# Dashboard backend (read-only)

    pip install -r requirements.txt
    copy .env.example to .env and fill in URL, email, token
    uvicorn main:app --reload --port 8000

Open http://localhost:8000/api/dashboard to see the JSON the page uses.

## How each number is calculated
- Features: tasks under the Development epic (FEATURE_EPIC_KEY).
- Progress %: done subtasks / all subtasks of the task. No subtasks: 100 if Done, else 0.
- Status: Completed if Done. Blocked if flagged or has an open "is blocked by" link.
  At Risk if overdue, or due within AT_RISK_DAYS with progress under AT_RISK_MIN_PROGRESS. Otherwise On Track.
- Next Milestone column: the first open subtask of that feature.
- Completed this week: epics and tasks (not subtasks) resolved Monday to Sunday of this week.
- Task Status Distribution: all non-epic work items by To Do / In Progress / Done.
- Stage stepper: the numbered phase epics (PHASE_REGEX), with done/total tasks per phase.
- Blockers: open items that are flagged or blocked by another open item.
- Target Release: next unreleased version; if none exists, the next open MILESTONE REVIEW task.