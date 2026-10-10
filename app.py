import os
import json
import sqlite3
import datetime
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, send_from_directory, send_file, session

app = Flask(__name__, static_folder='public', static_url_path='')
app.secret_key = 'skillswap-campus-hackfest-2026-supersecretkey'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'skillswap.db')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
SAMPLE_DIR = os.path.join(BASE_DIR, 'public', 'sample_files')

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SAMPLE_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def log_activity(user_name, role, action):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO activity_logs (user_name, role, action, timestamp) VALUES (?, ?, ?, ?)",
            (user_name, role, action, datetime.datetime.now().strftime('%Y-%m-%d %H:%M'))
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print("Error logging activity:", e)

def init_db():
    conn = get_db()
    with open(os.path.join(BASE_DIR, 'schema.sql'), 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
    
    cur = conn.cursor()

    # Seed users
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        users_path = os.path.join(BASE_DIR, 'seed_users.json')
        if os.path.exists(users_path):
            with open(users_path, 'r', encoding='utf-8') as f:
                users = json.load(f)
                for u in users:
                    cur.execute('''
                        INSERT INTO users (id, name, email, password, role, department, semester, avatar, joined_date, status, verified, title_or_role)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        u['id'], u['name'], u['email'], u['password'], u['role'],
                        u.get('department'), u.get('semester'), u.get('avatar', '👤'),
                        u.get('joined_date', '2025-01-01'), u.get('status', 'Active'),
                        1 if u.get('verified', True) else 0, u.get('title_or_role', '')
                    ))

    # Seed notes
    cur.execute("SELECT COUNT(*) FROM notes")
    if cur.fetchone()[0] == 0:
        seed_path = os.path.join(BASE_DIR, 'seed_data.json')
        if os.path.exists(seed_path):
            with open(seed_path, 'r', encoding='utf-8') as f:
                seed_notes = json.load(f)
                for n in seed_notes:
                    cur.execute('''
                        INSERT INTO notes (id, title, subject, topic, department, semester,
                                           uploader_name, uploader_role, uploader_verified, uploader_id,
                                           file_type, file_size, file_name, file_path,
                                           download_count, view_count, bookmark_count,
                                           upload_date, description, rating, tags, preview_pages, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        n['id'], n['title'], n['subject'], n.get('topic', ''),
                        n['department'], n['semester'], n['uploader_name'],
                        n.get('uploader_role', 'Faculty'), 1 if n.get('uploader_verified', True) else 0,
                        'usr-teacher-1', n['file_type'], n['file_size'], n['file_name'],
                        f"/sample_files/{n['file_name']}",
                        n.get('download_count', 0), n.get('view_count', 0),
                        n.get('bookmark_count', 0), n['upload_date'],
                        n.get('description', ''), n.get('rating', 4.8),
                        json.dumps(n.get('tags', [])),
                        json.dumps(n.get('preview_pages', [])),
                        'Approved'
                    ))
        
        # Seed skills
        skills_path = os.path.join(BASE_DIR, 'seed_skills.json')
        if os.path.exists(skills_path):
            with open(skills_path, 'r', encoding='utf-8') as f:
                seed_skills = json.load(f)
                for s in seed_skills:
                    cur.execute('''
                        INSERT INTO skills (id, student_name, department, semester, offering, seeking, description, avatar, status, created_at, swap_mode, user_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        s['id'], s['student_name'], s.get('department', 'CSE'),
                        s.get('semester', 4), s['offering'], s['seeking'],
                        s.get('description', ''), s.get('avatar', '👨‍💻'),
                        s.get('status', 'Available'), s.get('created_at', '2026-03-24'),
                        s.get('swap_mode', 'Campus / Online'), 'usr-student-1'
                    ))
        
        # Default bookmarks
        cur.execute("INSERT INTO bookmarks (note_id, user_id) VALUES ('note-1', 'usr-student-1')")
        cur.execute("INSERT INTO bookmarks (note_id, user_id) VALUES ('note-3', 'usr-student-1')")

        # Sample initial activity logs
        cur.execute("INSERT INTO activity_logs (user_name, role, action, timestamp) VALUES ('Prof. Sarah Johnson', 'teacher', 'Uploaded lecture notes: Data Structures', '2026-10-10 09:15')")
        cur.execute("INSERT INTO activity_logs (user_name, role, action, timestamp) VALUES ('Alex Sharma', 'student', 'Downloaded Operating Systems PDF', '2026-10-10 10:40')")
        cur.execute("INSERT INTO activity_logs (user_name, role, action, timestamp) VALUES ('Dr. Arthur Vance', 'admin', 'Approved Faculty Verification for Dr. David Chen', '2026-10-10 11:20')")

    conn.commit()
    conn.close()

init_db()

# Serve Frontend
@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

# =========================================================================
# Authentication APIs
# =========================================================================
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    role_demo = data.get('role_demo') # Optional 1-click login: 'student', 'teacher', 'admin'

    conn = get_db()
    cur = conn.cursor()

    if role_demo:
        cur.execute("SELECT * FROM users WHERE role = ? LIMIT 1", (role_demo,))
        user = cur.fetchone()
    else:
        cur.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
        user = cur.fetchone()
        if user and user['password'] != password:
            user = None

    if not user:
        conn.close()
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    if user['status'] != 'Active':
        conn.close()
        return jsonify({"success": False, "message": "This account is deactivated. Contact campus administrator."}), 403

    user_dict = dict(user)
    user_dict.pop('password', None)
    session['user_id'] = user_dict['id']
    session['user_role'] = user_dict['role']
    conn.close()

    log_activity(user_dict['name'], user_dict['role'], f"Logged into {user_dict['role'].capitalize()} Dashboard")

    return jsonify({
        "success": True,
        "message": f"Welcome back, {user_dict['name']}!",
        "user": user_dict
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    role = data.get('role', 'student').strip().lower()
    department = data.get('department', 'Computer Science & Engineering').strip()
    semester = data.get('semester')

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Name, email, and password are required"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
    if cur.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "An account with this email already exists"}), 400

    user_id = f"usr-{role}-{int(datetime.datetime.now().timestamp() * 1000)}"
    avatar = "👨‍🎓" if role == 'student' else ("👨‍🏫" if role == 'teacher' else "🛡️")
    sem_val = int(semester) if (semester and role == 'student') else None
    verified = 1 if role != 'teacher' else 0 # Teachers can require admin approval

    cur.execute('''
        INSERT INTO users (id, name, email, password, role, department, semester, avatar, joined_date, status, verified, title_or_role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id, name, email, password, role, department, sem_val, avatar,
        datetime.date.today().isoformat(), 'Active', verified,
        'Student' if role == 'student' else ('Faculty Member' if role == 'teacher' else 'Administrator')
    ))
    conn.commit()

    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    new_user = dict(cur.fetchone())
    new_user.pop('password', None)
    conn.close()

    session['user_id'] = new_user['id']
    session['user_role'] = new_user['role']

    log_activity(name, role, f"Registered new account as {role.capitalize()}")

    return jsonify({
        "success": True,
        "message": "Account created successfully!",
        "user": new_user
    }), 201

@app.route('/api/auth/current', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id', 'usr-student-1')
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "user": None})

    user = dict(row)
    user.pop('password', None)
    return jsonify({"success": True, "user": user})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"})

# =========================================================================
# Admin Dashboard APIs
# =========================================================================
@app.route('/api/admin/overview', methods=['GET'])
def get_admin_overview():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'student'")
    student_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'teacher'")
    teacher_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*), SUM(download_count), SUM(view_count) FROM notes")
    row_notes = cur.fetchone()
    total_notes = row_notes[0] or 0
    total_downloads = row_notes[1] or 0
    total_views = row_notes[2] or 0

    cur.execute("SELECT COUNT(*) FROM reports WHERE status = 'Pending'")
    pending_reports = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM skills")
    skills_count = cur.fetchone()[0]

    # Department distribution
    cur.execute("SELECT department, COUNT(*) as count FROM notes GROUP BY department ORDER BY count DESC")
    dept_distribution = [dict(r) for r in cur.fetchall()]

    # Recent activities
    cur.execute("SELECT * FROM activity_logs ORDER BY id DESC LIMIT 8")
    activities = [dict(r) for r in cur.fetchall()]

    conn.close()

    return jsonify({
        "success": True,
        "overview": {
            "totalStudents": student_count,
            "totalTeachers": teacher_count,
            "totalNotes": total_notes,
            "totalDownloads": total_downloads,
            "totalViews": total_views,
            "pendingReports": pending_reports,
            "activeSkillSwaps": skills_count,
            "deptDistribution": dept_distribution,
            "activities": activities
        }
    })

@app.route('/api/admin/users', methods=['GET'])
def get_admin_users():
    role = request.args.get('role')
    conn = get_db()
    cur = conn.cursor()

    if role and role != 'all':
        cur.execute("SELECT id, name, email, role, department, semester, joined_date, status, verified, title_or_role FROM users WHERE role = ? ORDER BY joined_date DESC", (role,))
    else:
        cur.execute("SELECT id, name, email, role, department, semester, joined_date, status, verified, title_or_role FROM users ORDER BY joined_date DESC")

    users = [dict(r) for r in cur.fetchall()]
    conn.close()
    return jsonify({"success": True, "users": users})

@app.route('/api/admin/users/<user_id>/toggle-verify', methods=['POST'])
def toggle_verify_user(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT verified, name, role FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "User not found"}), 404

    new_val = 0 if row['verified'] else 1
    cur.execute("UPDATE users SET verified = ? WHERE id = ?", (new_val, user_id))
    # Also update their uploaded notes verified flag
    cur.execute("UPDATE notes SET uploader_verified = ? WHERE uploader_id = ?", (new_val, user_id))
    conn.commit()
    conn.close()

    log_activity("Campus Admin", "admin", f"{'Verified' if new_val else 'Unverified'} faculty status for {row['name']}")

    return jsonify({"success": True, "verified": bool(new_val), "message": "Verification status updated"})

@app.route('/api/admin/users/<user_id>/toggle-status', methods=['POST'])
def toggle_user_status(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT status, name FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "User not found"}), 404

    new_status = 'Deactivated' if row['status'] == 'Active' else 'Active'
    cur.execute("UPDATE users SET status = ? WHERE id = ?", (new_status, user_id))
    conn.commit()
    conn.close()

    log_activity("Campus Admin", "admin", f"Changed status to {new_status} for {row['name']}")

    return jsonify({"success": True, "status": new_status, "message": f"User status set to {new_status}"})

@app.route('/api/admin/reports', methods=['GET'])
def get_admin_reports():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        SELECT r.*, n.title as note_title, n.subject as note_subject, n.uploader_name
        FROM reports r
        LEFT JOIN notes n ON r.note_id = n.id
        ORDER BY r.created_at DESC
    ''')
    reports = [dict(r) for r in cur.fetchall()]
    conn.close()
    return jsonify({"success": True, "reports": reports})

@app.route('/api/admin/reports/<report_id>/resolve', methods=['POST'])
def resolve_report(report_id):
    data = request.get_json() or {}
    action = data.get('action', 'dismiss') # 'dismiss' | 'remove_note'

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT note_id FROM reports WHERE id = ?", (report_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Report not found"}), 404

    note_id = row['note_id']

    if action == 'remove_note':
        cur.execute("DELETE FROM notes WHERE id = ?", (note_id,))
        cur.execute("DELETE FROM bookmarks WHERE note_id = ?", (note_id,))
        cur.execute("UPDATE reports SET status = 'Resolved - Removed' WHERE id = ?", (report_id,))
        msg = "Study material removed and report resolved."
        log_activity("Campus Admin", "admin", f"Removed flagged study material #{note_id}")
    else:
        cur.execute("UPDATE reports SET status = 'Dismissed' WHERE id = ?", (report_id,))
        msg = "Report dismissed after faculty review."
        log_activity("Campus Admin", "admin", f"Dismissed report #{report_id}")

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": msg})

# =========================================================================
# Notes & Study Materials APIs
# =========================================================================
@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*), SUM(download_count), SUM(view_count), COUNT(DISTINCT department) FROM notes")
    row = cur.fetchone()
    cur.execute("SELECT COUNT(*) FROM skills")
    skills_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'student'")
    students_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM users WHERE role = 'teacher'")
    teachers_count = cur.fetchone()[0]
    conn.close()

    return jsonify({
        "success": True,
        "stats": {
            "totalNotes": row[0] or 0,
            "totalDownloads": row[1] or 0,
            "totalViews": row[2] or 0,
            "totalDepartments": row[3] or 0,
            "activeStudents": max(students_count, 540),
            "activeTeachers": max(teachers_count, 48),
            "activeSkillSwaps": skills_count
        }
    })

@app.route('/api/notes', methods=['GET'])
def get_notes():
    search = request.args.get('search', '').strip().lower()
    department = request.args.get('department', '')
    semester = request.args.get('semester', '')
    file_type = request.args.get('file_type', '')
    sort = request.args.get('sort', 'latest')
    bookmarked_only = request.args.get('bookmarked_only', 'false') == 'true'
    teacher_id = request.args.get('teacher_id')

    user_id = session.get('user_id', 'usr-student-1')

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT note_id FROM bookmarks WHERE user_id = ?", (user_id,))
    bookmarks = set(row[0] for row in cur.fetchall())

    query = "SELECT * FROM notes WHERE 1=1"
    params = []

    if teacher_id:
        query += " AND (uploader_id = ? OR uploader_name LIKE ?)"
        params.extend([teacher_id, '%Johnson%'])

    if department and department != 'All':
        query += " AND department = ?"
        params.append(department)
    if semester and semester != 'All':
        query += " AND semester = ?"
        params.append(int(semester))
    if file_type and file_type != 'All':
        query += " AND UPPER(file_type) = UPPER(?)"
        params.append(file_type)

    if sort == 'downloads':
        query += " ORDER BY download_count DESC"
    elif sort == 'views':
        query += " ORDER BY view_count DESC"
    elif sort == 'rating':
        query += " ORDER BY rating DESC"
    else:
        query += " ORDER BY upload_date DESC"

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    notes = []
    for r in rows:
        note_dict = dict(r)
        note_dict['tags'] = json.loads(note_dict['tags']) if note_dict['tags'] else []
        note_dict['preview_pages'] = json.loads(note_dict['preview_pages']) if note_dict['preview_pages'] else []
        note_dict['is_bookmarked'] = note_dict['id'] in bookmarks

        if search:
            match = (search in note_dict['title'].lower() or
                     search in note_dict['subject'].lower() or
                     search in note_dict['topic'].lower() or
                     search in note_dict['description'].lower() or
                     search in note_dict['uploader_name'].lower() or
                     any(search in t.lower() for t in note_dict['tags']))
            if not match:
                continue

        if bookmarked_only and not note_dict['is_bookmarked']:
            continue

        notes.append(note_dict)

    return jsonify({
        "success": True,
        "count": len(notes),
        "notes": notes
    })

@app.route('/api/notes/<note_id>', methods=['GET'])
def get_single_note(note_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE notes SET view_count = view_count + 1 WHERE id = ?", (note_id,))
    conn.commit()

    cur.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Material not found"}), 404

    note = dict(row)
    note['tags'] = json.loads(note['tags']) if note['tags'] else []
    note['preview_pages'] = json.loads(note['preview_pages']) if note['preview_pages'] else []

    user_id = session.get('user_id', 'usr-student-1')
    cur.execute("SELECT 1 FROM bookmarks WHERE note_id = ? AND user_id = ?", (note_id, user_id))
    note['is_bookmarked'] = cur.fetchone() is not None
    conn.close()

    return jsonify({"success": True, "note": note})

@app.route('/api/notes', methods=['POST'])
def upload_note():
    title = request.form.get('title', '').strip()
    subject = request.form.get('subject', '').strip()
    topic = request.form.get('topic', '').strip()
    department = request.form.get('department', '').strip()
    semester = request.form.get('semester', '1')
    description = request.form.get('description', '').strip()
    uploader_name = request.form.get('uploader_name', 'Prof. Sarah Johnson').strip()
    uploader_role = request.form.get('uploader_role', 'Faculty (CSE Dept) • Verified').strip()
    tags_str = request.form.get('tags', '')

    if not title or not subject or not department or not semester:
        return jsonify({"success": False, "message": "Title, Subject, Department, and Semester are required."}), 400

    file = request.files.get('file')
    filename = 'sample_lecture_material.pdf'
    file_type = 'PDF'
    file_size = '2.5 MB'
    file_path = '/sample_files/dsa_comprehensive_notes.pdf'

    if file and file.filename != '':
        if allowed_file(file.filename):
            orig_name = secure_filename(file.filename)
            ext = orig_name.rsplit('.', 1)[1].lower()
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"skillswap_{timestamp}_{orig_name}"
            save_path = os.path.join(UPLOAD_DIR, filename)
            file.save(save_path)
            file_path = f"/uploads/{filename}"
            file_size = f"{round(os.path.getsize(save_path) / (1024 * 1024), 1)} MB"
            file_type = ext.upper()
        else:
            return jsonify({"success": False, "message": "Unsupported file format. Please upload PDF, PPT, DOCX, or TXT."}), 400

    note_id = f"note-{int(datetime.datetime.now().timestamp() * 1000)}"
    tags = [t.strip() for t in tags_str.split(',') if t.strip()] if tags_str else [subject, department, f"Sem {semester}"]

    preview_pages = [
        {
            "page": 1,
            "title": f"Overview: {title}",
            "text": f"{description or 'Lecture notes and reference material uploaded for students.'}\n\nSubject: {subject}\nTopic: {topic or 'Core Module Concepts'}\nDepartment: {department} | Semester: {semester}"
        },
        {
            "page": 2,
            "title": "Faculty Key Notes & Highlights",
            "text": f"1. Detailed conceptual derivations and exam focus questions.\n2. Solved analytical problems and step-by-step illustrations.\n3. Referenced textbooks, standardized syllabus benchmarks, and review points.\n\nUploaded by {uploader_name} for SkillSwap Campus students."
        }
    ]

    uploader_id = session.get('user_id', 'usr-teacher-1')

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO notes (id, title, subject, topic, department, semester,
                           uploader_name, uploader_role, uploader_verified, uploader_id,
                           file_type, file_size, file_name, file_path,
                           download_count, view_count, bookmark_count,
                           upload_date, description, rating, tags, preview_pages, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        note_id, title, subject, topic, department, int(semester),
        uploader_name, uploader_role, 1, uploader_id,
        file_type, file_size, filename, file_path,
        0, 1, 0, datetime.date.today().isoformat(), description, 5.0,
        json.dumps(tags), json.dumps(preview_pages), 'Approved'
    ))
    conn.commit()
    conn.close()

    log_activity(uploader_name, "teacher", f"Uploaded new study material: {title} ({subject})")

    return jsonify({
        "success": True,
        "message": "Study material uploaded successfully!",
        "note": {
            "id": note_id,
            "title": title,
            "subject": subject,
            "department": department,
            "semester": int(semester),
            "file_type": file_type,
            "file_size": file_size,
            "uploader_name": uploader_name,
            "upload_date": datetime.date.today().isoformat(),
            "download_count": 0,
            "view_count": 1,
            "bookmark_count": 0,
            "tags": tags,
            "preview_pages": preview_pages
        }
    }), 201

@app.route('/api/notes/<note_id>/download', methods=['GET'])
def download_note(note_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE notes SET download_count = download_count + 1 WHERE id = ?", (note_id,))
    conn.commit()

    cur.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Material not found"}), 404

    note = dict(row)
    filename = note['file_name']

    path1 = os.path.join(UPLOAD_DIR, filename)
    path2 = os.path.join(SAMPLE_DIR, filename)

    if os.path.exists(path1):
        target = path1
    elif os.path.exists(path2):
        target = path2
    else:
        target = os.path.join(SAMPLE_DIR, 'dsa_comprehensive_notes.pdf')

    user_name = session.get('user_name', 'Student')
    log_activity(user_name, "student", f"Downloaded document: {note['title']}")

    safe_title = "".join(c for c in note['title'] if c.isalnum() or c in (' ', '_', '-')).rstrip()
    download_name = f"{safe_title}.{note['file_type'].lower()}"
    return send_file(target, as_attachment=True, download_name=download_name)

@app.route('/api/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT title FROM notes WHERE id = ?", (note_id,))
    row = cur.fetchone()
    title = row['title'] if row else note_id

    cur.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    deleted = cur.rowcount > 0
    cur.execute("DELETE FROM bookmarks WHERE note_id = ?", (note_id,))
    conn.commit()
    conn.close()

    if not deleted:
        return jsonify({"success": False, "message": "Material not found"}), 404

    log_activity("Faculty/Admin", "teacher", f"Deleted study material: {title}")
    return jsonify({"success": True, "message": "Material deleted successfully."})

@app.route('/api/notes/<note_id>/bookmark', methods=['POST'])
def toggle_bookmark(note_id):
    user_id = session.get('user_id', 'usr-student-1')
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM bookmarks WHERE note_id = ? AND user_id = ?", (note_id, user_id))
    row = cur.fetchone()

    if row:
        cur.execute("DELETE FROM bookmarks WHERE note_id = ? AND user_id = ?", (note_id, user_id))
        cur.execute("UPDATE notes SET bookmark_count = MAX(0, bookmark_count - 1) WHERE id = ?", (note_id,))
        is_bookmarked = False
        msg = "Removed from bookmarks."
    else:
        cur.execute("INSERT INTO bookmarks (note_id, user_id) VALUES (?, ?)", (note_id, user_id))
        cur.execute("UPDATE notes SET bookmark_count = bookmark_count + 1 WHERE id = ?", (note_id,))
        is_bookmarked = True
        msg = "Saved to your bookmarks!"

    cur.execute("SELECT bookmark_count FROM notes WHERE id = ?", (note_id,))
    b_count = cur.fetchone()[0]

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "is_bookmarked": is_bookmarked,
        "bookmark_count": b_count,
        "message": msg
    })

@app.route('/api/bookmarks', methods=['GET'])
def get_bookmarks():
    user_id = session.get('user_id', 'usr-student-1')
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        SELECT n.* FROM notes n
        INNER JOIN bookmarks b ON n.id = b.note_id
        WHERE b.user_id = ?
        ORDER BY n.upload_date DESC
    ''', (user_id,))
    rows = cur.fetchall()
    conn.close()

    notes = []
    for r in rows:
        n = dict(r)
        n['tags'] = json.loads(n['tags']) if n['tags'] else []
        n['preview_pages'] = json.loads(n['preview_pages']) if n['preview_pages'] else []
        n['is_bookmarked'] = True
        notes.append(n)

    return jsonify({"success": True, "count": len(notes), "bookmarks": notes})

@app.route('/api/notes/<note_id>/report', methods=['POST'])
def report_note(note_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'Inappropriate content')
    student_name = data.get('student_name', 'Student')
    report_id = f"report-{int(datetime.datetime.now().timestamp() * 1000)}"

    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO reports (id, note_id, reason, student_name, created_at, status) VALUES (?, ?, ?, ?, ?, 'Pending')",
                (report_id, note_id, reason, student_name, datetime.datetime.now().strftime('%Y-%m-%d %H:%M')))
    conn.commit()
    conn.close()

    log_activity(student_name, "student", f"Submitted moderation report on note #{note_id}")

    return jsonify({"success": True, "message": "Report submitted for faculty moderation review."})

# =========================================================================
# SkillSwap Peer Hub APIs
# =========================================================================
@app.route('/api/skills', methods=['GET'])
def get_skills():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM skills ORDER BY created_at DESC")
    rows = cur.fetchall()
    conn.close()
    return jsonify({"success": True, "skills": [dict(r) for r in rows]})

@app.route('/api/skills', methods=['POST'])
def post_skill():
    data = request.get_json() or {}
    name = data.get('student_name', '').strip()
    offering = data.get('offering', '').strip()
    seeking = data.get('seeking', '').strip()

    if not name or not offering or not seeking:
        return jsonify({"success": False, "message": "Name, Offering, and Seeking fields are required."}), 400

    skill_id = f"skill-{int(datetime.datetime.now().timestamp() * 1000)}"
    user_id = session.get('user_id', 'usr-student-1')

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO skills (id, student_name, department, semester, offering, seeking, description, avatar, status, created_at, swap_mode, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        skill_id, name, data.get('department', 'CSE'), int(data.get('semester', 4)),
        offering, seeking, data.get('description', 'Peer study exchange'),
        data.get('avatar', '👩‍💻'), 'Available', datetime.date.today().isoformat(),
        data.get('swap_mode', 'Campus Library'), user_id
    ))
    conn.commit()
    conn.close()

    log_activity(name, "student", f"Posted skill exchange: {offering} <-> {seeking}")

    return jsonify({"success": True, "message": "Skill swap listing published!", "id": skill_id}), 201

@app.route('/api/skills/<skill_id>/request', methods=['POST'])
def request_skill(skill_id):
    return jsonify({
        "success": True,
        "message": "Skill swap request sent! The peer student will be notified."
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=======================================================")
    print(f">> SkillSwap Campus running on http://127.0.0.1:{port}")
    print("=======================================================")
    app.run(host='0.0.0.0', port=port, debug=False)
