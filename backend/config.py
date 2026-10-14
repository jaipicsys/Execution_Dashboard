"""Settings from .env plus the card mapping rules. Edit the RULES section to change the numbers."""
import os

from dotenv import load_dotenv

load_dotenv()


def _bool(name, default):
    return os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


# ---------------------------------------------------------------- connection
REDMINE_URL = os.getenv("REDMINE_URL", "").rstrip("/")
REDMINE_API_KEY = os.getenv("REDMINE_API_KEY", "")
REDMINE_VERIFY_SSL = _bool("REDMINE_VERIFY_SSL", True)

OPENPROJECT_URL = os.getenv("OPENPROJECT_URL", "").rstrip("/")
OPENPROJECT_API_KEY = os.getenv("OPENPROJECT_API_KEY", "")
OPENPROJECT_VERIFY_SSL = _bool("OPENPROJECT_VERIFY_SSL", True)

PORT = int(os.getenv("PORT", "5000"))
DEBUG = _bool("DEBUG", False)
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://192.168.2.30:3011").split(",") if o.strip()]
DB_PATH = os.getenv("DB_PATH", "dashboard.db")
CACHE_SECONDS = int(os.getenv("CACHE_SECONDS", "30"))
SEED_SAMPLE_DATA = _bool("SEED_SAMPLE_DATA", True)

# --------------------------------------------------------------------- RULES
# Redmine tracker names (case-insensitive)
TRACKER_FEATURE = "Feature"      # -> Product Development card
TRACKER_BUG = "Bug"              # -> Product Quality card
TRACKER_DEPLOYMENT = "Deployment"  # -> Deployments card

# Pilots are found automatically: put "(pilot)" in a project's name or description,
# e.g. "Module1 (pilot)". Use the same name in both tools to join them into one pilot.
# Projects listed here are ALWAYS pilots (identifier or name), with or without the marker.
PILOT_PROJECTS = [""]

# Health rules (applied to every open item)
AT_RISK_DAYS = 3                       # due within this many days -> At Risk
NOT_STARTED_STATUSES = {"new"}         # start date passed + still here + 0% done -> At Risk
BLOCKED_STATUSES = {"on hold", "test failed"}  # explicit "Blocked"

# Bug severity from the Redmine / OpenProject priority name (lowercase).
# Priorities not listed here (e.g. Low) count in "Open Bugs" but not in a severity tile.
SEVERITY_BY_PRIORITY = {
    "immediate": "critical",
    "urgent": "critical",
    "critical": "critical",
    "high": "high",
    "meduim": "medium",  # typo currently in your Redmine
    "medium": "medium",
    "normal": "medium",
}
