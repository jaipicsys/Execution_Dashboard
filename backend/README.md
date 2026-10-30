# Dashboard backend (read-only)

    pip install -r requirements.txt
    copy .env.example to .env and fill in URL, email, token
    python3 main.py        (or: uvicorn main:app --reload --port 8000)

Endpoints (GET only):
- /api/dashboards          all projects, in the order of projects.json  (the page uses this)
- /api/dashboard?project=B517   one project (default: the first one)
- /api/projects            configured projects, and whether each is shown (needs a Development epic)

## Adding a project
Add an entry to projects.json and restart the backend. Only "key" is required.

    {
      "key": "ABC",                       Jira project key
      "featureEpicKey": "ABC-12",         optional: use this epic instead of the one named "Development"
      "phaseRegex": "^\\d+\\.",           epics matching this are the stages in the stepper
      "title": "PRODUCT DEVELOPMENT",
      "atRiskDays": 7,
      "atRiskMinProgress": 50
    }

Any setting you leave out uses the default from .env. The account behind the token must be able to browse every project listed.
If one project fails (for example no permission), only that slide shows an error; the others keep working.

## How each number is calculated
- Standard rule: every project has an epic named "Development" (FEATURE_EPIC_NAME). Its tasks are the features.
  Tracker rows: those tasks, In Progress first, then To Do, then Done. Subtasks are not listed; they set the progress %.
  A project WITHOUT that epic is not shown at all (left out of the rotation, and logged as a warning).
  If an epic has a different name, set featureEpicKey for that project in projects.json.
- Active Features (KPI): feature tasks that are not Done.
- Progress %: done subtasks / all subtasks of the task. No subtasks: 100 if Done, else 0.
- Status: Completed if Done. Blocked if flagged or has an open "is blocked by" link.
  At Risk if overdue, or due within atRiskDays with progress under atRiskMinProgress. Otherwise On Track.
- Next Milestone column: the first open subtask of that feature.
- Completed this week: epics and tasks (not subtasks) resolved Monday to Sunday of this week.
- Task Status Distribution: all non-epic work items by To Do / In Progress / Done.
- Stage stepper: the phase epics, with done/total tasks per phase. A phase with no tasks follows its epic status.
- Blockers: open items that are flagged or blocked by another open item.
- Target Release: next unreleased version; if none exists, the next open MILESTONE REVIEW task.