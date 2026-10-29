"""Turns raw Jira data into the numbers the dashboard shows. No Jira calls happen here."""
import os
import re
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta

from dotenv import load_dotenv

load_dotenv()

FEATURE_EPIC_KEY = os.getenv("FEATURE_EPIC_KEY", "").strip()
FEATURE_EPIC_NAME = os.getenv("FEATURE_EPIC_NAME", "Development").strip()
PHASE_REGEX = os.getenv("PHASE_REGEX", r"^\d+\.")
AT_RISK_DAYS = int(os.getenv("AT_RISK_DAYS", "7"))
AT_RISK_MIN_PROGRESS = int(os.getenv("AT_RISK_MIN_PROGRESS", "50"))
TITLE = os.getenv("DASHBOARD_TITLE", "PRODUCT DEVELOPMENT")
DASH = "—"


# ------------------------------------------------------------------ small helpers
def _date(s):
    return date.fromisoformat(s[:10]) if s else None


def _day(d):
    return f"{d.day} {d.strftime('%b')}" if d else DASH


def _day_year(d):
    return f"{d.day} {d.strftime('%b %Y')}" if d else DASH


def _num(key):
    try:
        return int(key.rsplit("-", 1)[1])
    except (IndexError, ValueError):
        return 0


def parse(i, flagged_id):
    f = i["fields"]
    it = f.get("issuetype") or {}
    st = f.get("status") or {}
    blocked_by = []
    for link in f.get("issuelinks") or []:
        other = link.get("inwardIssue")
        if other and "blocked" in (link.get("type") or {}).get("inward", "").lower():
            cat = (((other.get("fields") or {}).get("status") or {}).get("statusCategory") or {}).get("key")
            if cat != "done":
                blocked_by.append(other["key"])
    parent = f.get("parent") or {}
    return {
        "key": i["key"],
        "summary": (f.get("summary") or "").strip(),
        "type": it.get("name", ""),
        "is_epic": it.get("hierarchyLevel") == 1 or it.get("name", "").lower() == "epic",
        "is_subtask": bool(it.get("subtask")),
        "status": st.get("name", ""),
        "cat": (st.get("statusCategory") or {}).get("key", ""),
        "assignee": (f.get("assignee") or {}).get("displayName"),
        "priority": (f.get("priority") or {}).get("name"),
        "created": _date(f.get("created")),
        "due": _date(f.get("duedate")),
        "resolved": _date(f.get("resolutiondate")),
        "parent": parent.get("key"),
        "parent_summary": ((parent.get("fields") or {}).get("summary") or "").strip(),
        "labels": [l.lower() for l in (f.get("labels") or [])],
        "flagged": bool(flagged_id and f.get(flagged_id)),
        "blocked_by": blocked_by,
    }


# ------------------------------------------------------------------ rules
def progress_of(task, children):
    subs = children.get(task["key"], [])
    if subs:
        return round(100 * sum(1 for s in subs if s["cat"] == "done") / len(subs))
    return 100 if task["cat"] == "done" else 0


def health_of(task, prog, today):
    """Completed / Blocked / At Risk / On Track. Rules are documented in the README."""
    if task["cat"] == "done":
        return "Completed"
    if task["flagged"] or task["blocked_by"]:
        return "Blocked"
    due = task["due"]
    if due:
        if due < today:
            return "At Risk"
        if (due - today).days <= AT_RISK_DAYS and prog < AT_RISK_MIN_PROGRESS:
            return "At Risk"
    return "On Track"


def next_step(task, children):
    """First open subtask (lowest key). Shown in the 'Next Milestone' column."""
    open_subs = sorted((s for s in children.get(task["key"], []) if s["cat"] != "done"), key=lambda s: _num(s["key"]))
    return open_subs[0]["summary"] if open_subs else DASH


# ------------------------------------------------------------------ main
def build_dashboard(raw_issues, versions, flagged_id, now=None):
    now = now or datetime.now()
    today = now.date()
    week_start = today - timedelta(days=today.weekday())  # Monday
    week_end = week_start + timedelta(days=6)
    last_start = week_start - timedelta(days=7)

    items = [parse(i, flagged_id) for i in raw_issues]
    epics = [i for i in items if i["is_epic"]]
    children = defaultdict(list)
    for i in items:
        if i["parent"]:
            children[i["parent"]].append(i)

    # ---- features = tasks under the feature epic
    if FEATURE_EPIC_KEY:
        feat_epic = next((e for e in epics if e["key"] == FEATURE_EPIC_KEY), None)
    else:
        feat_epic = next((e for e in epics if e["summary"].lower() == FEATURE_EPIC_NAME.lower()), None)
    tasks = sorted(children.get(feat_epic["key"], []), key=lambda t: _num(t["key"])) if feat_epic else []

    features = []
    for t in tasks:
        prog = progress_of(t, children)
        features.append({
            "key": t["key"],
            "name": t["summary"],
            "owner": t["assignee"] or "Unassigned",
            "stage": t["status"],
            "progress": prog,
            "status": health_of(t, prog, today),
            "overdue": bool(t["due"] and t["due"] < today and t["cat"] != "done"),
            "target": _day(t["due"]),
            "milestone": next_step(t, children),
        })

    active = [f for f in features if f["status"] != "Completed"]
    n_blocked_feat = sum(1 for f in active if f["status"] == "Blocked")
    n_overdue = sum(1 for f in active if f["overdue"])
    n_risk_only = sum(1 for f in active if f["status"] == "At Risk" and not f["overdue"])
    n_risk_all = sum(1 for f in active if f["status"] == "At Risk")

    # ---- completed this week (epics + tasks, not subtasks)
    resolved = [i for i in items if i["resolved"] and not i["is_subtask"]]
    this_week = sorted((i for i in resolved if week_start <= i["resolved"] <= week_end), key=lambda i: i["resolved"], reverse=True)
    last_week = [i for i in resolved if last_start <= i["resolved"] < week_start]
    completed = [
        {"task": i["summary"], "owner": i["assignee"] or "Unassigned", "date": _day(i["resolved"]), "status": "Completed"}
        for i in this_week[:8]
    ]

    # ---- blockers = open items that are flagged or have an open 'is blocked by' link
    blockers = []
    for i in items:
        if i["cat"] != "done" and (i["flagged"] or i["blocked_by"]):
            days = (today - i["created"]).days if i["created"] else 0
            blockers.append({
                "issue": i["summary"],
                "feature": i["parent_summary"] or DASH,
                "owner": i["assignee"] or "Unassigned",
                "daysOpen": days,
                "nextAction": DASH,      # no Jira field for this yet
                "requiredFrom": DASH,    # no Jira field for this yet
                "severity": "high" if days >= 4 else "medium",
            })
    blockers.sort(key=lambda b: -b["daysOpen"])

    # ---- task status distribution (all non-epic work items)
    names = {"new": "To Do", "indeterminate": "In Progress", "done": "Done"}
    cats = Counter(i["cat"] for i in items if not i["is_epic"])
    task_status = [{"name": names[k], "value": cats.get(k, 0)} for k in ("new", "indeterminate", "done")]

    # ---- stage stepper = phase epics
    phases = sorted((e for e in epics if re.match(PHASE_REGEX, e["summary"])), key=lambda e: e["summary"])
    stages = []
    for e in phases:
        kids = children.get(e["key"], [])
        done = sum(1 for k in kids if k["cat"] == "done")
        started = done > 0 or any(k["cat"] == "indeterminate" for k in kids)
        state = "done" if kids and done == len(kids) else ("current" if started else "todo")
        stages.append({
            "label": re.sub(PHASE_REGEX + r"\s*", "", e["summary"]).strip() or e["summary"],
            "value": f"{done}/{len(kids)}",
            "caption": "tasks done",
            "state": state,
        })

    # ---- open bugs
    bugs = [i for i in items if i["type"].lower() == "bug" and i["cat"] != "done"]
    by_p = Counter(b["priority"] for b in bugs)
    open_bugs = {
        "total": len(bugs),
        "critical": by_p.get("Highest", 0),
        "high": by_p.get("High", 0),
        "medium": by_p.get("Medium", 0),
        "low": by_p.get("Low", 0) + by_p.get("Lowest", 0),
    }

    # ---- target release, or the next milestone review when no versions exist
    unreleased = sorted((v for v in versions if not v.get("released")), key=lambda v: v.get("releaseDate") or "9999")
    if unreleased:
        v = unreleased[0]
        release = {"label": "Target Release", "title": v["name"], "date": _day_year(_date(v.get("releaseDate")))}
    else:
        ms = sorted((i for i in items if "milestone" in i["labels"] and i["cat"] != "done" and i["due"]), key=lambda i: i["due"])
        if ms:
            title = re.sub(r"^MILESTONE REVIEW\s*\d+\s*[–-]\s*", "", ms[0]["summary"], flags=re.I)
            release = {"label": "Next Milestone", "title": title, "date": _day_year(ms[0]["due"])}
        else:
            release = {"label": "Target Release", "title": DASH, "date": ""}

    diff = len(this_week) - len(last_week)
    iso_week = today.isocalendar()[1]
    return {
        "titleBar": {
            "title": TITLE,
            "subtitle": "Execution Dashboard",
            "week": f"Week {iso_week} ({_day(week_start)} – {_day(week_end)} {week_end.year})",
            "updated": f"{now:%a}, {now.day} {now:%b %Y}  {now.hour % 12 or 12}:{now:%M} {now:%p}",
        },
        "kpis": {
            "active": {"total": len(active), "onTrack": len(active) - n_risk_all - n_blocked_feat, "atRisk": n_risk_all, "blocked": n_blocked_feat},
            "completed": {"thisWeek": len(this_week), "vsLastWeek": diff},
            "atRiskOverdue": {"total": n_risk_only + n_overdue, "atRisk": n_risk_only, "overdue": n_overdue},
            "blocked": {"total": len(blockers), "note": "Requires management support" if blockers else "No blocked items"},
        },
        "features": features,
        "taskStatus": task_status,
        "blockers": blockers,
        "readiness": {"stages": stages, "openBugs": open_bugs, "release": release},
        "completed": completed,
        "meta": {
            "featureEpic": feat_epic["key"] if feat_epic else None,
            "workItemsRead": len(items),
            "rules": {"atRiskDays": AT_RISK_DAYS, "atRiskMinProgress": AT_RISK_MIN_PROGRESS},
        },
    }