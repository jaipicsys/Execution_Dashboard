from flask import Blueprint, jsonify, request

import cards
import db
import sources

api = Blueprint("api", __name__)

OPP_TYPES = {"Pilot", "Prospect"}
HEALTH = {"onTrack", "atRisk", "blocked", "pending"}
RELEASE_STATUS = {"onTrack", "atRisk", "blocked"}


def _error(message, code=400):
    return jsonify({"error": message}), code


# ------------------------------------------------------------------- general
@api.get("/health")
def health():
    def check(fn):
        try:
            fn()
            return "ok"
        except Exception as exc:  # noqa: BLE001
            return f"error: {exc}"

    return jsonify(
        {
            "redmine": check(sources.ping_redmine),
            "openproject": check(sources.ping_openproject),
            "database": check(db.list_opportunities),
        }
    )


@api.get("/cards")
def get_cards():
    if request.args.get("refresh") == "1":
        sources.clear_cache()
    return jsonify(cards.all_cards())


@api.get("/pilots")
def pilots_list():
    """Pilots found automatically (shows which projects are detected and why they count)."""
    try:
        return jsonify(cards.pilot_summaries())
    except Exception as exc:  # noqa: BLE001
        return _error(str(exc), 502)


# ------------------------------------------------------------- opportunities
@api.get("/opportunities")
def opportunities_list():
    return jsonify(db.list_opportunities())


def _validate_opportunity(data, partial=False):
    if not partial and not data.get("code"):
        return "code is required"
    if not partial and data.get("type") not in OPP_TYPES:
        return "type must be Pilot or Prospect"
    if partial and "type" in data and data["type"] not in OPP_TYPES:
        return "type must be Pilot or Prospect"
    if "health" in data and data["health"] not in HEALTH:
        return f"health must be one of {sorted(HEALTH)}"
    return None


@api.post("/opportunities")
def opportunities_add():
    data = request.get_json(silent=True) or {}
    problem = _validate_opportunity(data)
    if problem:
        return _error(problem)
    return jsonify(db.get_opportunity(db.add_opportunity(data))), 201


@api.put("/opportunities/<int:opp_id>")
def opportunities_update(opp_id):
    if not db.get_opportunity(opp_id):
        return _error("not found", 404)
    data = request.get_json(silent=True) or {}
    problem = _validate_opportunity(data, partial=True)
    if problem:
        return _error(problem)
    db.update_opportunity(opp_id, data)
    return jsonify(db.get_opportunity(opp_id))


@api.delete("/opportunities/<int:opp_id>")
def opportunities_delete(opp_id):
    if not db.get_opportunity(opp_id):
        return _error("not found", 404)
    db.delete_opportunity(opp_id)
    return "", 204


# ------------------------------------------------------------------- release
@api.get("/release")
def release_get():
    return jsonify(db.get_release())


@api.put("/release")
def release_set():
    data = request.get_json(silent=True) or {}
    items = data.get("items") or []
    if not data.get("version"):
        return _error("version is required")
    for i in items:
        if not i.get("label") or i.get("status") not in RELEASE_STATUS:
            return _error(f"each item needs label and status in {sorted(RELEASE_STATUS)}")
        try:
            if not 0 <= int(i.get("value", 0)) <= 100:
                raise ValueError
        except (TypeError, ValueError):
            return _error("item value must be a number from 0 to 100")
    db.set_release(data["version"], data.get("target_date"), items)
    return jsonify(db.get_release())
