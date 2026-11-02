import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import jira_client as jira
from dashboard import DEFAULTS, build_dashboard, load_overrides

ORIGINS = [
    o.strip()
    for o in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:3011,http://192.168.2.30:3011").split(",")
    if o.strip()
]
# Also allow any page opened from this machine or from a private company network address, on any port:
# localhost, 127.x, 192.168.x.x, 10.x.x.x and 172.16-31.x.x. Pages from the internet are still blocked.
PRIVATE_ORIGIN_REGEX = r"^http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$"

app = FastAPI(title="Eigenstate Dashboard API (read-only)")

# Only GET is allowed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_origin_regex=PRIVATE_ORIGIN_REGEX,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _epic_number(key):
    try:
        return int(key.rsplit("-", 1)[1])
    except (IndexError, ValueError):
        return 0


def discover():
    """Ask Jira which projects have a 'Development' epic. Returns {project key: (epic key, project name)}."""
    wanted = DEFAULTS["featureEpicName"].strip().casefold()
    found = {}
    for e in sorted(jira.find_epics(DEFAULTS["featureEpicName"]), key=lambda e: _epic_number(e["key"])):
        f = e["fields"]
        if (f.get("summary") or "").strip().casefold() != wanted:  # text search is fuzzy, so check the exact title
            continue
        proj = f.get("project") or {}
        found.setdefault(proj.get("key"), (e["key"], proj.get("name") or proj.get("key")))
    return found


def project_configs():
    """One settings dict per project that has a Development epic. projects.json can override or hide any of them."""
    overrides = load_overrides()
    out = []
    for pkey, (epic_key, pname) in sorted(discover().items()):
        ov = overrides.get(pkey, {})
        if ov.get("hide"):
            continue
        out.append({**DEFAULTS, "key": pkey, "name": pname, "featureEpicKey": epic_key, **ov})
    return out


def _build(cfg):
    flagged_id = jira.flagged_field_id()
    issues = jira.search_issues(cfg["key"], flagged_id)
    versions = jira.versions(cfg["key"])
    return build_dashboard(issues, versions, flagged_id, cfg)


def _jira_error(e):
    code = getattr(getattr(e, "response", None), "status_code", None)
    return f"Jira returned {code}. Check the URL, email and token." if code else f"Could not reach Jira: {e}"


@app.get("/api/projects")
def projects():
    """Every project the account can see, and whether it is shown (it needs a Development epic)."""
    try:
        found = discover()
        overrides = load_overrides()
        visible = jira.projects()
    except httpx.HTTPError as e:
        raise HTTPException(502, _jira_error(e))
    out = []
    for p in sorted(visible, key=lambda p: p["key"]):
        key = p["key"]
        if key not in found:
            shown, reason = False, f"No epic named '{DEFAULTS['featureEpicName']}'"
        elif overrides.get(key, {}).get("hide"):
            shown, reason = False, "Hidden in projects.json"
        else:
            shown, reason = True, None
        out.append({"key": key, "name": p.get("name") or key, "shown": shown, "reason": reason,
                    "developmentEpic": found[key][0] if key in found else None})
    return out


@app.get("/api/dashboards")
def dashboards():
    """One entry per project that has a Development epic (found automatically, sorted by project key).
    A project that fails does not break the others."""
    try:
        configs = project_configs()
    except httpx.HTTPError as e:
        raise HTTPException(502, _jira_error(e))
    out = []
    for cfg in configs:
        try:
            result = _build(cfg)
            if result is not None:
                out.append(result)
        except httpx.HTTPError as e:
            out.append({"meta": {"project": cfg["key"], "name": cfg["name"]}, "error": f"{cfg['key']}: {_jira_error(e)}"})
    return out


@app.get("/api/dashboard")
def dashboard(project: str | None = None):
    """A single project. Defaults to the first one found."""
    try:
        configs = project_configs()
        cfg = next((c for c in configs if c["key"] == project), None) if project else (configs[0] if configs else None)
        if cfg is None:
            raise HTTPException(404, f"No project with a '{DEFAULTS['featureEpicName']}' epic" + (f" named {project}" if project else "") + " was found.")
        return _build(cfg)
    except httpx.HTTPError as e:
        raise HTTPException(502, _jira_error(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)  # 0.0.0.0 = reachable from other computers