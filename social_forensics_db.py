import argparse
import json
import os
import re
import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS persons (
    person_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    canonical_name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
    profile_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id      INTEGER NOT NULL REFERENCES persons(person_id),
    platform       TEXT NOT NULL CHECK(platform IN ('instagram','facebook','x')),
    handle         TEXT NOT NULL,
    followers      INTEGER,
    following      INTEGER,
    friends_count  INTEGER,
    bio            TEXT,
    source_file    TEXT,
    UNIQUE(platform, handle)
);

CREATE TABLE IF NOT EXISTS posts (
    post_id           INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id        INTEGER NOT NULL REFERENCES profiles(profile_id),
    platform_post_id  TEXT,
    timestamp         TEXT,
    content           TEXT,
    likes             INTEGER,
    retweets          INTEGER,
    location          TEXT,
    media_url         TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id           INTEGER NOT NULL REFERENCES posts(post_id),
    commenter_handle  TEXT,
    text              TEXT
);

CREATE TABLE IF NOT EXISTS mentions (
    mention_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id           INTEGER NOT NULL REFERENCES posts(post_id),
    mentioned_handle  TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_profile    ON posts(profile_id);
CREATE INDEX IF NOT EXISTS idx_comments_post     ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_mentions_post     ON mentions(post_id);
CREATE INDEX IF NOT EXISTS idx_mentions_handle   ON mentions(mentioned_handle);
CREATE INDEX IF NOT EXISTS idx_comments_handle   ON comments(commenter_handle);
"""

FILENAME_PATTERN = re.compile(r"^(?P<name>.+?)_(?P<platform>insta|fb|x)\.json$", re.IGNORECASE)
PLATFORM_MAP = {"insta": "instagram", "fb": "facebook", "x": "x"}

def normalize_name(raw: str) -> str:
    cleaned = raw.strip("_").replace("_", " ").strip().lower()
    words = sorted(w for w in cleaned.split() if w)
    return " ".join(words)

class SocialForensicsDB:
    def __init__(self, db_path: str = "forensics.db"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("PRAGMA foreign_keys = ON;")
        self.conn.executescript(SCHEMA)
        self.conn.commit()

    def close(self):
        self.conn.close()

    def get_or_create_person(self, display_name: str) -> int:
        key = normalize_name(display_name)
        row = self.conn.execute(
            "SELECT person_id FROM persons WHERE canonical_name = ?", (key,)
        ).fetchone()
        if row:
            return row[0]
        cur = self.conn.execute(
            "INSERT INTO persons (canonical_name) VALUES (?)", (key,)
        )
        self.conn.commit()
        return cur.lastrowid

    def ingest_file(self, filepath: str):
        filename = os.path.basename(filepath)
        m = FILENAME_PATTERN.match(filename)
        if not m:
            print(f"[skip] filename doesn't match <name>_<platform>.json: {filename}")
            return

        raw_name = m.group("name")
        platform = PLATFORM_MAP[m.group("platform").lower()]

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        person_id = self.get_or_create_person(raw_name)

        if platform == "instagram":
            self._ingest_instagram(data, person_id, filename)
        elif platform == "facebook":
            self._ingest_facebook(data, person_id, filename)
        elif platform == "x":
            self._ingest_x(data, person_id, filename)

        self.conn.commit()
        print(f"[ok] {filename} -> platform={platform}, person_id={person_id}")

    def _get_or_create_profile(self, person_id, platform, handle, **kw):
        row = self.conn.execute(
            "SELECT profile_id FROM profiles WHERE platform=? AND handle=?",
            (platform, handle),
        ).fetchone()
        if row:
            return row[0]
        cur = self.conn.execute(
            """INSERT INTO profiles
               (person_id, platform, handle, followers, following, friends_count, bio, source_file)
               VALUES (?,?,?,?,?,?,?,?)""",
            (person_id, platform, handle, kw.get("followers"), kw.get("following"),
             kw.get("friends_count"), kw.get("bio"), kw.get("source_file")),
        )
        return cur.lastrowid

    def _ingest_instagram(self, data, person_id, filename):
        handle = data.get("profile_id", "unknown_insta")
        profile_id = self._get_or_create_profile(
            person_id, "instagram", handle,
            followers=data.get("followers"), following=data.get("following"),
            bio=data.get("bio"), source_file=filename,
        )
        for post in data.get("posts", []):
            db_post_id = self.conn.execute(
                """INSERT INTO posts (profile_id, platform_post_id, timestamp, content,
                                       likes, location, media_url)
                   VALUES (?,?,?,?,?,?,?)""",
                (profile_id, post.get("post_id"), post.get("timestamp"),
                 post.get("caption"), post.get("likes"),
                 post.get("location"), post.get("media_url")),
            ).lastrowid
            for c in post.get("comments", []):
                self.conn.execute(
                    "INSERT INTO comments (post_id, commenter_handle, text) VALUES (?,?,?)",
                    (db_post_id, c.get("user"), c.get("text")),
                )

    def _ingest_facebook(self, data, person_id, filename):
        handle = data.get("profile_name", "unknown_fb")
        profile_id = self._get_or_create_profile(
            person_id, "facebook", handle,
            friends_count=data.get("friends_count"), source_file=filename,
        )
        for post in data.get("posts", []):
            db_post_id = self.conn.execute(
                """INSERT INTO posts (profile_id, platform_post_id, timestamp, content, likes)
                   VALUES (?,?,?,?,?)""",
                (profile_id, post.get("post_id"), post.get("timestamp"),
                 post.get("content"), post.get("likes")),
            ).lastrowid
            for c in post.get("comments", []):
                self.conn.execute(
                    "INSERT INTO comments (post_id, commenter_handle, text) VALUES (?,?,?)",
                    (db_post_id, c.get("user"), c.get("text")),
                )

    def _ingest_x(self, data, person_id, filename):
        handle = data.get("handle", "unknown_x")
        profile_id = self._get_or_create_profile(
            person_id, "x", handle,
            followers=data.get("followers"), following=data.get("following"),
            source_file=filename,
        )
        for tweet in data.get("tweets", []):
            db_post_id = self.conn.execute(
                """INSERT INTO posts (profile_id, platform_post_id, timestamp, content,
                                       likes, retweets)
                   VALUES (?,?,?,?,?,?)""",
                (profile_id, tweet.get("tweet_id"), tweet.get("timestamp"),
                 tweet.get("text"), tweet.get("likes"), tweet.get("retweets")),
            ).lastrowid
            for mention in tweet.get("mentions", []):
                self.conn.execute(
                    "INSERT INTO mentions (post_id, mentioned_handle) VALUES (?,?)",
                    (db_post_id, mention),
                )

    def linked_profiles(self, display_name: str):
        key = normalize_name(display_name)
        return self.conn.execute(
            """SELECT pl.platform, pl.handle, pl.followers, pl.following, pl.friends_count
               FROM profiles pl JOIN persons p ON p.person_id = pl.person_id
               WHERE p.canonical_name = ?""",
            (key,),
        ).fetchall()

    def cross_platform_common_contacts(self, display_name: str):
        key = normalize_name(display_name)
        return self.conn.execute(
            """
            SELECT contact, COUNT(DISTINCT platform) AS platform_count,
                   GROUP_CONCAT(DISTINCT platform) AS platforms
            FROM (
                SELECT c.commenter_handle AS contact, pl.platform AS platform
                FROM comments c
                JOIN posts po ON po.post_id = c.post_id
                JOIN profiles pl ON pl.profile_id = po.profile_id
                JOIN persons p ON p.person_id = pl.person_id
                WHERE p.canonical_name = ?
                UNION ALL
                SELECT m.mentioned_handle AS contact, pl.platform AS platform
                FROM mentions m
                JOIN posts po ON po.post_id = m.post_id
                JOIN profiles pl ON pl.profile_id = po.profile_id
                JOIN persons p ON p.person_id = pl.person_id
                WHERE p.canonical_name = ?
            )
            GROUP BY contact
            HAVING platform_count > 1
            ORDER BY platform_count DESC
            """,
            (key, key),
        ).fetchall()

    def all_persons(self):
        return self.conn.execute(
            "SELECT person_id, canonical_name FROM persons"
        ).fetchall()

    def all_posts_for_person(self, display_name: str):
        key = normalize_name(display_name)
        return self.conn.execute(
            """SELECT pl.platform, pl.handle, po.timestamp, po.content, po.likes
               FROM posts po
               JOIN profiles pl ON pl.profile_id = po.profile_id
               JOIN persons p ON p.person_id = pl.person_id
               WHERE p.canonical_name = ?
               ORDER BY po.timestamp""",
            (key,),
        ).fetchall()

def ingest_directory(db: SocialForensicsDB, data_dir: str):
    for path in sorted(Path(data_dir).glob("*.json")):
        db.ingest_file(str(path))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Ingest multi-platform social JSON exports into a linked SQLite DB"
    )
    parser.add_argument("--data-dir", default=".", help="Folder with *_insta.json / *_fb.json / *_x.json")
    parser.add_argument("--db", default="forensics.db", help="Output SQLite DB path")
    args = parser.parse_args()

    db = SocialForensicsDB(args.db)
    ingest_directory(db, args.data_dir)

    print("\n--- Linked identities ---")
    for pid, name in db.all_persons():
        print(f"\n{name}:")
        for platform, handle, followers, following, friends in db.linked_profiles(name):
            print(f"  [{platform}] handle={handle} followers={followers} following={following} friends={friends}")
        common = db.cross_platform_common_contacts(name)
        if common:
            print("  shared contacts across platforms:")
            for contact, count, platforms in common:
                print(f"    {contact} -> on {count} platforms ({platforms})")

    db.close()
