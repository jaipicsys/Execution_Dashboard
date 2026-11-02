"""Read-only Jira client. Only GET requests exist here on purpose."""
import os
import time

import httpx
from dotenv import load_dotenv

load_dotenv()

BASE = os.environ["JIRA_BASE_URL"].rstrip("/")
AUTH = (os.environ["JIRA_EMAIL"], os.environ["JIRA_API_TOKEN"])
TTL = int(os.getenv("CACHE_SECONDS", "60"))
_cache: dict = {}


def _get(path: str, params: dict | None = None, ttl: int | None = None):
    params = params or {}
    key = (path, tuple(sorted(params.items())))
    hit = _cache.get(key)
    limit = TTL if ttl is None else ttl
    if hit and time.time() - hit[0] < limit:
        return hit[1]
    r = httpx.get(BASE + path, params=params, auth=AUTH, headers={"Accept": "application/json"}, timeout=30)
    r.raise_for_status()
    data = r.json()
    _cache[key] = (time.time(), data)
    return data


def _search(jql: str, fields: list[str]) -> list[dict]:
    """Run a JQL search with the current /search/jql endpoint, following pagination."""
    issues, token = [], None
    while True:
        params = {"jql": jql, "fields": ",".join(fields), "maxResults": 100}
        if token:
            params["nextPageToken"] = token
        data = _get("/rest/api/3/search/jql", params)
        issues += data.get("issues", [])
        token = data.get("nextPageToken")
        if data.get("isLast", True) or not token:
            break
    return issues


def flagged_field_id() -> str | None:
    """The 'Flagged' field id differs per site, so look it up (cached for an hour)."""
    for f in _get("/rest/api/3/field", ttl=3600):
        if f["name"].lower() == "flagged":
            return f["id"]
    return None


def projects() -> list[dict]:
    """Every project the token's account can see."""
    out, start = [], 0
    while True:
        data = _get("/rest/api/3/project/search", {"startAt": start, "maxResults": 50})
        vals = data.get("values", [])
        out += vals
        if data.get("isLast", True) or not vals:
            break
        start += len(vals)
    return out


def find_epics(name: str) -> list[dict]:
    """Epics (in any project) whose title contains `name`. The caller checks for an exact match."""
    safe = name.replace("\\", "\\\\").replace('"', '\\"')
    jql = f'issuetype = Epic AND summary ~ "{safe}" AND created >= "2000-01-01" ORDER BY key ASC'
    return _search(jql, ["summary", "project"])


def search_issues(project: str, flagged_id: str | None) -> list[dict]:
    fields = [
        "summary", "issuetype", "status", "assignee", "priority", "created", "duedate",
        "resolutiondate", "parent", "labels", "issuelinks", "fixVersions",
    ]
    if flagged_id:
        fields.append(flagged_id)
    return _search(f'project = {project} AND created >= "2000-01-01" ORDER BY created DESC', fields)


def versions(project: str) -> list[dict]:
    return _get(f"/rest/api/3/project/{project}/versions")