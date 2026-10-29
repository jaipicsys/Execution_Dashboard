import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import jira_client as jira
from dashboard import build_dashboard

PROJECT = os.getenv("JIRA_PROJECT", "B517")
ORIGINS = [o.strip() for o in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://192.168.2.30:3011").split(",") if o.strip()]

app = FastAPI(title="Eigenstate Dashboard API (read-only)")

# Only GET is allowed, and only from your frontend addresses.
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_methods=["GET"], allow_headers=["*"])


@app.get("/api/dashboard")
def dashboard():
    try:
        flagged_id = jira.flagged_field_id()
        issues = jira.search_issues(PROJECT, flagged_id)
        versions = jira.versions(PROJECT)
    except httpx.HTTPStatusError as e:
        raise HTTPException(502, f"Jira returned {e.response.status_code}. Check the URL, email, token and project key.")
    except httpx.HTTPError as e:
        raise HTTPException(502, f"Could not reach Jira: {e}")
    return build_dashboard(issues, versions, flagged_id)