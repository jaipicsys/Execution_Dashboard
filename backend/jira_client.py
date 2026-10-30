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


def flagged_field_id() -> str | None:
    """The 'Flagged' field id differs per site, so look it up (cached for an hour)."""
    for f in _get("/rest/api/3/field", ttl=3600):
        if f["name"].lower() == "flagged":
            return f["id"]
    return None


def search_issues(project: str, flagged_id: str | None) -> list[dict]:
    fields = [
        "summary", "issuetype", "status", "assignee", "priority", "created", "duedate",
        "resolutiondate", "parent", "labels", "issuelinks", "fixVersions",
    ]
    if flagged_id:
        fields.append(flagged_id)
    jql = f'project = {project} AND created >= "2000-01-01" ORDER BY created DESC'
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


def project_name(project: str) -> str:
    return _get(f"/rest/api/3/project/{project}", ttl=3600).get("name") or project


def versions(project: str) -> list[dict]:
    return _get(f"/rest/api/3/project/{project}/versions")