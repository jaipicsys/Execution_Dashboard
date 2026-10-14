"""SQLite storage for the data that does not exist in Redmine/OpenProject:
Commercial opportunities and the Product Release."""
import sqlite3
from contextlib import contextmanager
from datetime import datetime

import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS opportunities (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT NOT NULL,
    industry    TEXT,
    type        TEXT NOT NULL CHECK (type IN ('Pilot', 'Prospect')),
    stage       TEXT,
    health      TEXT NOT NULL DEFAULT 'pending',
    target_date TEXT,
    owner       TEXT,
    active      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS releases (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    version     TEXT NOT NULL,
    target_date TEXT,
    is_current  INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS release_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    release_id  INTEGER NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    label       TEXT NOT NULL,
    value       INTEGER NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'onTrack'
);
"""

OPP_FIELDS = ("code", "industry", "type", "stage", "health", "target_date", "owner", "active")


@contextmanager
def connect():
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with connect() as conn:
        conn.executescript(SCHEMA)
        if config.SEED_SAMPLE_DATA:
            _seed(conn)


def _seed(conn):
    if conn.execute("SELECT COUNT(*) FROM opportunities").fetchone()[0] == 0:
        rows = [
            ("B563", "Automotive Tier-1", "Pilot", "Qualified", "atRisk", "2026-11-30", "Rahul"),
            ("T641", "Textile – Garment Folding/Packing", "Prospect", "Initial Discussion", "pending", "2026-12-31", "Priya"),
            ("E368", "Electronics / EMS", "Pilot", "Qualified", "atRisk", "2026-11-30", "Arjun"),
            ("A518", "Automotive OEM – EV", "Prospect", "Initial Discussion", "pending", "2026-12-31", "Vikram"),
            ("B739", "Automotive Tier-1", "Prospect", "Qualified", "atRisk", "2026-11-30", "Rahul"),
            ("F586", "Automotive Fabrication / Welding", "Prospect", "Initial Discussion", "pending", "2026-12-31", "Sharath"),
        ]
        conn.executemany(
            "INSERT INTO opportunities (code, industry, type, stage, health, target_date, owner) VALUES (?,?,?,?,?,?,?)",
            rows,
        )
    if conn.execute("SELECT COUNT(*) FROM releases").fetchone()[0] == 0:
        cur = conn.execute("INSERT INTO releases (version, target_date) VALUES ('V1.4', '2026-10-15')")
        conn.executemany(
            "INSERT INTO release_items (release_id, label, value, status) VALUES (?,?,?,?)",
            [
                (cur.lastrowid, "Core Features", 90, "onTrack"),
                (cur.lastrowid, "AI Models", 80, "atRisk"),
                (cur.lastrowid, "Testing", 60, "atRisk"),
                (cur.lastrowid, "Documentation", 50, "blocked"),
            ],
        )


# ------------------------------------------------------------- opportunities
def list_opportunities():
    with connect() as conn:
        return [dict(r) for r in conn.execute("SELECT * FROM opportunities ORDER BY id")]


def get_opportunity(opp_id):
    with connect() as conn:
        row = conn.execute("SELECT * FROM opportunities WHERE id = ?", (opp_id,)).fetchone()
        return dict(row) if row else None


def add_opportunity(data):
    cols = [f for f in OPP_FIELDS if f in data]
    with connect() as conn:
        cur = conn.execute(
            f"INSERT INTO opportunities ({', '.join(cols)}) VALUES ({', '.join('?' * len(cols))})",
            [data[c] for c in cols],
        )
        return cur.lastrowid


def update_opportunity(opp_id, data):
    cols = [f for f in OPP_FIELDS if f in data]
    if not cols:
        return
    with connect() as conn:
        conn.execute(
            f"UPDATE opportunities SET {', '.join(c + ' = ?' for c in cols)} WHERE id = ?",
            [data[c] for c in cols] + [opp_id],
        )


def delete_opportunity(opp_id):
    with connect() as conn:
        conn.execute("DELETE FROM opportunities WHERE id = ?", (opp_id,))


def opportunity_counts():
    with connect() as conn:
        rows = conn.execute(
            "SELECT type, COUNT(*) AS n FROM opportunities WHERE active = 1 GROUP BY type"
        ).fetchall()
    counts = {r["type"]: r["n"] for r in rows}
    return {
        "total": sum(counts.values()),
        "pilot": counts.get("Pilot", 0),
        "prospect": counts.get("Prospect", 0),
    }


# ------------------------------------------------------------------- release
def _pretty_date(iso):
    try:
        return datetime.strptime(iso, "%Y-%m-%d").strftime("%d %b %Y")
    except (TypeError, ValueError):
        return iso or "—"


def get_release():
    with connect() as conn:
        rel = conn.execute(
            "SELECT * FROM releases WHERE is_current = 1 ORDER BY id DESC LIMIT 1"
        ).fetchone()
        if not rel:
            return {"version": "—", "target": "—", "overall": 0, "items": []}
        items = [
            {"label": r["label"], "value": r["value"], "status": r["status"]}
            for r in conn.execute(
                "SELECT label, value, status FROM release_items WHERE release_id = ? ORDER BY id",
                (rel["id"],),
            )
        ]
    overall = round(sum(i["value"] for i in items) / len(items)) if items else 0
    return {
        "version": rel["version"],
        "target": _pretty_date(rel["target_date"]),
        "overall": overall,
        "items": items,
    }


def set_release(version, target_date, items):
    """Replace the current release (older ones are kept as history)."""
    with connect() as conn:
        conn.execute("UPDATE releases SET is_current = 0")
        cur = conn.execute(
            "INSERT INTO releases (version, target_date) VALUES (?, ?)", (version, target_date)
        )
        conn.executemany(
            "INSERT INTO release_items (release_id, label, value, status) VALUES (?,?,?,?)",
            [(cur.lastrowid, i["label"], int(i["value"]), i["status"]) for i in items],
        )
