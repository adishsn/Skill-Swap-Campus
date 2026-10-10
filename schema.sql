-- SkillSwap Campus SQLite Schema
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- 'student', 'teacher', 'admin'
    department TEXT,
    semester INTEGER,
    avatar TEXT,
    joined_date TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    verified INTEGER DEFAULT 1,
    title_or_role TEXT
);

CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT,
    department TEXT NOT NULL,
    semester INTEGER NOT NULL,
    uploader_name TEXT NOT NULL,
    uploader_role TEXT,
    uploader_verified INTEGER DEFAULT 1,
    uploader_id TEXT,
    file_type TEXT NOT NULL,
    file_size TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    upload_date TEXT NOT NULL,
    description TEXT,
    rating REAL DEFAULT 5.0,
    tags TEXT,
    preview_pages TEXT,
    status TEXT DEFAULT 'Approved' -- 'Approved', 'Flagged', 'Under Review'
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    department TEXT,
    semester INTEGER,
    offering TEXT NOT NULL,
    seeking TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'Available',
    created_at TEXT NOT NULL,
    swap_mode TEXT,
    user_id TEXT
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id TEXT NOT NULL,
    user_id TEXT DEFAULT 'usr-student-1'
);

CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    student_name TEXT,
    created_at TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' -- 'Pending', 'Resolved', 'Dismissed'
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
