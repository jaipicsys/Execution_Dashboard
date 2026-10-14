# Execution Dashboard – Flask backend (cards)

## Run
```
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then fill in the URLs and NEW API keys
python main.py              # http://localhost:5000
```
Check the connections first:  `GET /api/health`  (shows ok / error for Redmine, OpenProject, database).

## Files
| File | Job |
|---|---|
| `main.py` | creates the app, CORS, creates DB tables, registers routes |
| `routes.py` | all `/api/...` endpoints |
| `db.py` | SQLite tables: `opportunities`, `releases`, `release_items` |
| `sources.py` | read-only calls to Redmine and OpenProject (cached `CACHE_SECONDS`) |
| `cards.py` | the numbers for each card |
| `config.py` | `.env` settings + the mapping rules (edit RULES section) |

## Endpoints
| | |
|---|---|
| `GET /api/cards` (`?refresh=1` skips cache) | all six cards, same shape as the React `dashboardData.js` |
| `GET/POST /api/opportunities`, `PUT/DELETE /api/opportunities/<id>` | Commercial / Pipeline data |
| `GET/PUT /api/release` | Product Release (version, target_date, items) |
| `GET /api/pilots` | pilots detected right now, with their open items and health |
| `GET /api/health` | connection check |

## Where each card comes from
| Card | Rule |
|---|---|
| Product Development | Redmine, tracker **Feature**, open issues |
| Product Quality | Redmine, tracker **Bug**, open issues. Severity from priority (High, Meduim, Low). Overdue = past due date |
| Pilots | Any project with **(pilot)** in its name/description, in Redmine and/or OpenProject (see below) |
| Deployments | Redmine, tracker **Deployment**, open issues |
| Commercial / Pipeline | `opportunities` table |
| Product Release | `releases` + `release_items` tables |

Health of an open item: **Blocked** = status in `BLOCKED_STATUSES` · **Overdue** = due date passed ·
**At Risk** = due within `AT_RISK_DAYS`, or start date passed while still New at 0% · otherwise **On Track**.
Features: overdue is its own bucket (blocked counts as At Risk). Pilots/Deployments: overdue counts as At Risk,
Blocked only for an explicit blocked status.

## Fill in Commercial and Release
```
curl -X POST localhost:5000/api/opportunities -H "Content-Type: application/json" \
  -d '{"code":"B900","industry":"Textile","type":"Prospect","stage":"Qualified","owner":"Priya"}'

curl -X PUT localhost:5000/api/release -H "Content-Type: application/json" \
  -d '{"version":"V1.4","target_date":"2026-10-15","items":[{"label":"Core Features","value":90,"status":"onTrack"}]}'
```
Set `SEED_SAMPLE_DATA=false` in `.env` once you enter real data (the first start fills sample values from the design).

## Pilots are detected automatically
Put `(pilot)` (or `[pilot]`) in a project's **name or description**, in Redmine and/or OpenProject:

* `Module1 (pilot)` -> Module1 becomes a pilot, the Pilots card goes up by one.
* Remove the marker (or archive/delete the project) -> it disappears from the card.
* Use the **same name** in both tools (e.g. `B517 (pilot)` in each) and they are counted as ONE pilot,
  with open items from both. Different names = two separate pilots.
* `PILOT_PROJECTS` in `config.py` lists projects that are always pilots (currently `b517`).

## How fast do changes show up?
Nothing is copied: every request reads Redmine/OpenProject live (cached for `CACHE_SECONDS`, default 30 s) and the
React dashboard re-fetches every 60 s (`refreshMs` in `hooks/useDashboardCards.js`).
New / deleted / closed issues, work packages and projects therefore appear within about a minute or two.
Only Commercial and Release come from the local database, because neither tool holds that data.
