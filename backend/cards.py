"""Turns raw items into the numbers each dashboard card shows.
Output shapes match what the React cards already expect."""
import logging
import re
from datetime import date, timedelta

import config
import db
import sources

log = logging.getLogger(__name__)


def classify(item, today=None):
    """-> 'blocked' | 'overdue' | 'at_risk' | 'on_track'"""
    today = today or date.today()
    status = (item["status"] or "").lower()
    if status in config.BLOCKED_STATUSES:
        return "blocked"
    due, start = item["due"], item["start"]
    if due and due < today:
        return "overdue"
    if due and due <= today + timedelta(days=config.AT_RISK_DAYS):
        return "at_risk"
    if start and start < today and status in config.NOT_STARTED_STATUSES and not item["done"]:
        return "at_risk"
    return "on_track"


def _count(items, today=None):
    c = {"on_track": 0, "at_risk": 0, "overdue": 0, "blocked": 0}
    for i in items:
        c[classify(i, today)] += 1
    return c


def _by_tracker(issues, tracker):
    return [i for i in issues if i["tracker"].lower() == tracker.lower()]


# ------------------------------------------------------------------- cards
def product_development(today=None):
    items = _by_tracker(sources.redmine_open_issues(), config.TRACKER_FEATURE)
    c = _count(items, today)
    return {
        "total": len(items),
        "onTrack": c["on_track"],
        "atRisk": c["at_risk"] + c["blocked"],
        "overdue": c["overdue"],
    }


def product_quality(today=None):
    today = today or date.today()
    bugs = _by_tracker(sources.redmine_open_issues(), config.TRACKER_BUG)
    sev = {"critical": 0, "high": 0, "medium": 0}
    for b in bugs:
        level = config.SEVERITY_BY_PRIORITY.get(b["priority"].lower())
        if level in sev:
            sev[level] += 1
    return {
        "openBugs": len(bugs),
        "critical": sev["critical"],
        "high": sev["high"],
        "medium": sev["medium"],
        "overdue": sum(1 for b in bugs if b["due"] and b["due"] < today),
    }


# A project is a pilot when "(pilot)" or "[pilot]" appears in its name or description
# (in Redmine and/or OpenProject), or it is listed in config.PILOT_PROJECTS.
_PILOT_MARKER = re.compile(r"[\(\[]\s*pilot\s*[\)\]]", re.IGNORECASE)


def _key(name):
    """'B517 (pilot)' and 'b-517' -> 'b517': used to join the same pilot across both tools."""
    return re.sub(r"[^a-z0-9]", "", _PILOT_MARKER.sub("", name or "").lower())


def _clean_name(name):
    return re.sub(r"\s+", " ", _PILOT_MARKER.sub("", name or "")).strip()


def _is_pilot(project):
    fixed = [p.lower() for p in config.PILOT_PROJECTS]
    return (
        bool(_PILOT_MARKER.search(project["name"] + " " + project["description"]))
        or project["identifier"].lower() in fixed
        or _key(project["name"]) in {_key(p) for p in fixed}
    )


def discover_pilots():
    """Find pilot projects automatically. Same name in both tools = one pilot."""
    pilots = {}
    for system, projects in (
        ("redmine", sources.redmine_projects()),
        ("openproject", sources.openproject_projects()),
    ):
        for p in projects:
            if _is_pilot(p):
                entry = pilots.setdefault(
                    _key(p["name"]),
                    {"name": _clean_name(p["name"]), "redmine": None, "openproject": None},
                )
                entry[system] = p
    return list(pilots.values())


def pilot_summaries(today=None):
    out = []
    for p in discover_pilots():
        items = []
        if p["redmine"]:
            items += sources.redmine_open_issues(project=p["redmine"]["identifier"])
        if p["openproject"]:
            items += sources.openproject_open_work_packages(p["openproject"]["id"])
        c = _count(items, today)
        if c["blocked"]:
            health = "blocked"
        elif c["overdue"] or c["at_risk"]:
            health = "atRisk"
        else:
            health = "onTrack"
        out.append(
            {
                "name": p["name"],
                "systems": [s for s in ("redmine", "openproject") if p[s]],
                "openItems": len(items),
                "overdue": c["overdue"],
                "blocked": c["blocked"],
                "health": health,
            }
        )
    return out


def pilots(today=None):
    summaries = pilot_summaries(today)
    return {
        "total": len(summaries),
        "onTrack": sum(1 for p in summaries if p["health"] == "onTrack"),
        "atRisk": sum(1 for p in summaries if p["health"] == "atRisk"),
        "blocked": sum(1 for p in summaries if p["health"] == "blocked"),
    }


def deployments(today=None):
    items = _by_tracker(sources.redmine_open_issues(), config.TRACKER_DEPLOYMENT)
    c = _count(items, today)
    return {
        "total": len(items),
        "onTrack": c["on_track"],
        "atRisk": c["at_risk"] + c["overdue"],
        "blocked": c["blocked"],
    }


def commercial():
    return db.opportunity_counts()


def release():
    return db.get_release()


def _safe(fn):
    """One failing source must not break the other cards."""
    try:
        return fn()
    except Exception as exc:  # noqa: BLE001
        log.exception("card failed: %s", fn.__name__)
        return {"error": str(exc)}


def all_cards():
    return {
        "productDevelopment": _safe(product_development),
        "productQuality": _safe(product_quality),
        "pilots": _safe(pilots),
        "deployments": _safe(deployments),
        "commercial": _safe(commercial),
        "release": _safe(release),
    }
