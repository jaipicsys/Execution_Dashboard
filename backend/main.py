import logging
import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import jira_client as jira
from dashboard import build_dashboard, load_projects

PROJECTS = load_projects()
ORIGINS = [o.strip() for o in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://192.168.2.30:3011").split(",") if o.strip()]

app = FastAPI(title="Eigenstate Dashboard API (read-only)")

# Only GET is allowed, and only from your frontend addresses.
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_methods=["GET"], allow_headers=["*"])


def _build(cfg):
    flagged_id = jira.flagged_field_id()
    issues = jira.search_issues(cfg["key"], flagged_id)
    versions = jira.versions(cfg["key"])
    name = cfg.get("name") or jira.project_name(cfg["key"])
    return build_dashboard(issues, versions, flagged_id, {**cfg, "name": name})


@app.get("/api/projects")
def projects():
    """Configured projects, and whether each one is shown (it needs a Development epic)."""
    out = []
    for p in PROJECTS:
        try:
            shown = _build(p) is not None
            reason = None if shown else f"No epic named '{p['featureEpicName']}'"
            name = p.get("name") or jira.project_name(p["key"])
        except httpx.HTTPError as e:
            shown, reason, name = False, f"Jira error: {e}", p["key"]
        out.append({"key": p["key"], "name": name, "shown": shown, "reason": reason})
    return out


@app.get("/api/dashboards")
def dashboards():
    """One entry per project, in the order of projects.json.
    A project without a Development epic is left out. A failing project does not break the others."""
    out = []
    for cfg in PROJECTS:
        try:
            result = _build(cfg)
            if result is None:
                logging.warning("Skipping %s: no '%s' epic found", cfg["key"], cfg["featureEpicName"])
                continue
            out.append(result)
        except httpx.HTTPError as e:
            code = getattr(getattr(e, "response", None), "status_code", None)
            msg = f"Jira returned {code}" if code else f"Could not reach Jira: {e}"
            out.append({"meta": {"project": cfg["key"], "name": cfg.get("name") or cfg["key"]}, "error": f"{cfg['key']}: {msg}"})
    return out


@app.get("/api/dashboard")
def dashboard(project: str | None = None):
    """A single project. Defaults to the first one in projects.json."""
    cfg = next((p for p in PROJECTS if p["key"] == project), None) if project else PROJECTS[0]
    if cfg is None:
        raise HTTPException(404, f"Project {project} is not in projects.json")
    try:
        result = _build(cfg)
    except httpx.HTTPStatusError as e:
        raise HTTPException(502, f"Jira returned {e.response.status_code}. Check the URL, email, token and project key.")
    except httpx.HTTPError as e:
        raise HTTPException(502, f"Could not reach Jira: {e}")
    if result is None:
        raise HTTPException(404, f"{cfg['key']} has no '{cfg['featureEpicName']}' epic, so there is nothing to show.")
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", "8000")), reload=True)