"""
Database Management Module for KARSAKAH (Track 4)
Replaces insecure flat JSON storage with a lightweight, secure SQLite database.
Includes password hashing, user registration, and contact/inquiry logging.
"""

import sqlite3
import os
import hashlib
import uuid
import datetime

DB_PATH = os.environ.get("KARSAKAH_DB_PATH", os.path.join(os.path.dirname(__file__), "..", "karsakah.db"))

def get_db_connection():
    """Get a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    """Securely hash a password using SHA-256 with a unique cryptographic salt."""
    if not salt:
        salt = uuid.uuid4().hex[:16]
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed, salt

def verify_password(password: str, hashed: str, salt: str) -> bool:
    """Verify if the provided password matches the stored hash."""
    test_hash, _ = hash_password(password, salt)
    return test_hash == hashed

def init_db():
    """Initialize the database tables if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            country TEXT DEFAULT 'IN'
        )
    """)

    # Inquiries / Messages Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            form_type TEXT NOT NULL,
            name TEXT,
            email TEXT,
            phone TEXT,
            scheme_id TEXT,
            scheme_name TEXT,
            scheme_state TEXT,
            applicant_state TEXT,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Advisory Cache / History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS advisory_cache (
            cache_key TEXT PRIMARY KEY,
            country TEXT,
            lat REAL,
            lon REAL,
            data_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()

def create_user(name: str, email: str, phone: str, password: str, country: str = "IN") -> dict:
    """Register a new user with hashed credentials."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    user_id = f"usr_{int(datetime.datetime.now().timestamp())}_{uuid.uuid4().hex[:4]}"
    pwd_hash, salt = hash_password(password)

    try:
        cursor.execute("""
            INSERT INTO users (id, name, email, phone, password_hash, salt, country)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, email, phone, pwd_hash, salt, country))
        conn.commit()
        return {
            "success": True,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "phone": phone,
                "country": country
            }
        }
    except sqlite3.IntegrityError:
        return {"success": False, "error": "A user with this email already exists."}
    finally:
        conn.close()

def authenticate_user(email_or_phone: str, password: str) -> dict:
    """Authenticate user with email or phone and password."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users WHERE email = ? OR phone = ?
    """, (email_or_phone, email_or_phone))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return {"success": False, "error": "User not found."}

    if verify_password(password, user["password_hash"], user["salt"]):
        return {
            "success": True,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "country": user["country"]
            }
        }
    return {"success": False, "error": "Invalid credentials."}

def save_message(data: dict) -> bool:
    """Save an incoming contact message or scheme inquiry."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO messages (
            form_type, name, email, phone, scheme_id, scheme_name, scheme_state, applicant_state, message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("form_type", "GENERAL_CONTACT"),
        data.get("name", "Anonymous"),
        data.get("email", "N/A"),
        data.get("phone", "N/A"),
        data.get("schemeId", ""),
        data.get("schemeName", ""),
        data.get("schemeType", ""),
        data.get("applicantState", ""),
        data.get("message", "")
    ))
    conn.commit()
    conn.close()
    return True

def get_all_messages():
    """Retrieve all logged messages for admin dashboard."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Initialize DB on module load
init_db()
