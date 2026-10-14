"""Read-only calls to Redmine and OpenProject. Every item is normalised to the same dict:
{source, id, subject, project, tracker, status, priority, due, start, done}"""
import json
import time
from datetime import date

import requests
import urllib3

import config

if not (config.REDMINE_VERIFY_SSL and config.OPENPROJECT_VERIFY_SSL):
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

_cache = {}


class SourceError(Exception):
    pass


def _cached(key, loader):
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < config.CACHE_SECONDS:
        return hit[1]
    value = loader()
    _cache[key] = (time.time(), value)
    return value


def clear_cache():
    _cache.clear()


def _d(value):
    return date.fromisoformat(value[:10]) if value else None


# ------------------------------------------------------------------- Redmine
def _redmine_get(path, params=None):
    if not (config.REDMINE_URL and config.REDMINE_API_KEY):
        raise SourceError("Redmine is not configured (check .env)")
    r = requests.get(
        f"{config.REDMINE_URL}/{path}",
        params=params,
        headers={"X-Redmine-API-Key": config.REDMINE_API_KEY},
        verify=config.REDMINE_VERIFY_SSL,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def ping_redmine():
    _redmine_get("projects.json", {"limit": 1})


def _redmine_item(i):
    return {
        "source": "redmine",
        "id": i["id"],
        "subject": i.get("subject", ""),
        "project": i["project"]["name"],
        "tracker": i["tracker"]["name"],
        "status": i["status"]["name"],
        "priority": (i.get("priority") or {}).get("name", ""),
        "due": _d(i.get("due_date")),
        "start": _d(i.get("start_date")),
        "done": i.get("done_ratio") or 0,
    }


def redmine_open_issues(project=None):
    """All open issues (optionally of one project identifier)."""

    def load():
        items, offset = [], 0
        while True:
            params = {"status_id": "open", "limit": 100, "offset": offset}
            if project:
                params["project_id"] = project
            body = _redmine_get("issues.json", params)
            items += body["issues"]
            offset += 100
            if offset >= body.get("total_count", 0):
                break
        return [_redmine_item(i) for i in items]

    return _cached(("redmine_open", project), load)


# --------------------------------------------------------------- OpenProject
def _op_get(path, params=None):
    if not (config.OPENPROJECT_URL and config.OPENPROJECT_API_KEY):
        raise SourceError("OpenProject is not configured (check .env)")
    r = requests.get(
        f"{config.OPENPROJECT_URL}/api/v3/{path}",
        params=params,
        auth=("apikey", config.OPENPROJECT_API_KEY),
        verify=config.OPENPROJECT_VERIFY_SSL,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def ping_openproject():
    _op_get("")


def _op_pages(path, params):
    """OpenProject paginates by page number in `offset`."""
    items, page = [], 1
    while True:
        body = _op_get(path, {**params, "offset": page})
        elements = body["_embedded"]["elements"]
        items += elements
        if not elements or len(items) >= body.get("total", 0):
            return items
        page += 1


def _op_title(wp, link):
    return (wp["_links"].get(link) or {}).get("title") or ""


def _openproject_item(wp):
    return {
        "source": "openproject",
        "id": wp["id"],
        "subject": wp.get("subject", ""),
        "project": _op_title(wp, "project"),
        "tracker": _op_title(wp, "type"),
        "status": _op_title(wp, "status"),
        "priority": _op_title(wp, "priority"),
        "due": _d(wp.get("dueDate") or wp.get("date")),
        "start": _d(wp.get("startDate")),
        "done": wp.get("percentageDone") or 0,
    }


def openproject_open_work_packages(project_id):
    """Open work packages of one OpenProject project (by numeric id)."""

    def load():
        flt = json.dumps([{"status": {"operator": "o", "values": None}}])  # "o" = open
        wps = _op_pages(f"projects/{project_id}/work_packages", {"filters": flt, "pageSize": 200})
        return [_openproject_item(w) for w in wps]

    return _cached(("op_open", project_id), load)


# ------------------------------------------------------------- project lists
def redmine_projects():
    """[{id, identifier, name, description}] of every project the key can see."""

    def load():
        items, offset = [], 0
        while True:
            body = _redmine_get("projects.json", {"limit": 100, "offset": offset})
            items += body["projects"]
            offset += 100
            if offset >= body.get("total_count", 0):
                break
        return [
            {
                "id": p["id"],
                "identifier": p.get("identifier", ""),
                "name": p.get("name", ""),
                "description": p.get("description") or "",
            }
            for p in items
        ]

    return _cached("redmine_projects", load)


def openproject_projects():
    def load():
        return [
            {
                "id": p["id"],
                "identifier": p.get("identifier", ""),
                "name": p.get("name", ""),
                "description": (p.get("description") or {}).get("raw") or "",
            }
            for p in _op_pages("projects", {"pageSize": 100})
        ]

    return _cached("op_projects", load)
