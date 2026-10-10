const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/sample_files', express.static(path.join(__dirname, 'public', 'sample_files')));

const DATA_FILE = path.join(__dirname, 'database_notes.json');
const SKILLS_FILE = path.join(__dirname, 'database_skills.json');
const USERS_FILE = path.join(__dirname, 'database_users.json');
const BOOKMARKS_FILE = path.join(__dirname, 'database_bookmarks.json');
const REPORTS_FILE = path.join(__dirname, 'database_reports.json');
const LOGS_FILE = path.join(__dirname, 'database_logs.json');

function initializeData() {
  if (!fs.existsSync(DATA_FILE)) {
    const seedNotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data.json'), 'utf8'));
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedNotes, null, 2));
  }
  if (!fs.existsSync(SKILLS_FILE)) {
    const seedSkills = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_skills.json'), 'utf8'));
    fs.writeFileSync(SKILLS_FILE, JSON.stringify(seedSkills, null, 2));
  }
  if (!fs.existsSync(USERS_FILE)) {
    const seedUsers = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_users.json'), 'utf8'));
    fs.writeFileSync(USERS_FILE, JSON.stringify(seedUsers, null, 2));
  }
  if (!fs.existsSync(BOOKMARKS_FILE)) {
    fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(['note-1', 'note-3'], null, 2));
  }
  if (!fs.existsSync(REPORTS_FILE)) {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([
      { id: 1, user_name: 'Prof. Sarah Johnson', role: 'teacher', action: 'Uploaded lecture notes: Data Structures', timestamp: '2026-10-10 09:15' },
      { id: 2, user_name: 'Alex Sharma', role: 'student', action: 'Downloaded Operating Systems PDF', timestamp: '2026-10-10 10:40' },
      { id: 3, user_name: 'Dr. Arthur Vance', role: 'admin', action: 'Approved Faculty Verification for Dr. David Chen', timestamp: '2026-10-10 11:20' }
    ], null, 2));
  }
}
initializeData();

function getNotes() { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
function saveNotes(d) { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }
function getSkills() { return JSON.parse(fs.readFileSync(SKILLS_FILE, 'utf8')); }
function saveSkills(d) { fs.writeFileSync(SKILLS_FILE, JSON.stringify(d, null, 2)); }
function getUsers() { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
function saveUsers(d) { fs.writeFileSync(USERS_FILE, JSON.stringify(d, null, 2)); }
function getBookmarks() { return JSON.parse(fs.readFileSync(BOOKMARKS_FILE, 'utf8')); }
function saveBookmarks(d) { fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(d, null, 2)); }
function getReports() { return JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8')); }
function saveReports(d) { fs.writeFileSync(REPORTS_FILE, JSON.stringify(d, null, 2)); }
function getLogs() { return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8')); }
function addLog(user_name, role, action) {
  const logs = getLogs();
  logs.unshift({
    id: Date.now(),
    user_name,
    role,
    action,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 50), null, 2));
}

let currentSessionUser = getUsers()[0]; // Default Alex Sharma

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password, role_demo } = req.body;
  const users = getUsers();
  let user = null;

  if (role_demo) {
    user = users.find(u => u.role === role_demo);
  } else {
    user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  currentSessionUser = user;
  addLog(user.name, user.role, `Logged into ${user.role.toUpperCase()} Dashboard`);
  const safeUser = { ...user };
  delete safeUser.password;
  res.json({ success: true, user: safeUser, message: `Welcome back, ${user.name}!` });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, department, semester } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password required' });
  }

  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const newUser = {
    id: `usr-${role || 'student'}-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: role || 'student',
    department: department || 'Computer Science & Engineering',
    semester: role === 'student' ? (parseInt(semester) || 1) : null,
    avatar: role === 'student' ? '👨‍🎓' : (role === 'teacher' ? '👨‍🏫' : '🛡️'),
    joined_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    verified: role !== 'teacher',
    title_or_role: role === 'student' ? 'Student' : (role === 'teacher' ? 'Faculty Member' : 'Campus Administrator')
  };

  users.push(newUser);
  saveUsers(users);
  currentSessionUser = newUser;
  addLog(newUser.name, newUser.role, `Registered new account as ${newUser.role}`);

  const safe = { ...newUser };
  delete safe.password;
  res.status(201).json({ success: true, user: safe });
});

app.get('/api/auth/current', (req, res) => {
  const safe = { ...currentSessionUser };
  delete safe.password;
  res.json({ success: true, user: safe });
});

app.post('/api/auth/logout', (req, res) => {
  currentSessionUser = getUsers()[0];
  res.json({ success: true, message: 'Logged out' });
});

// Admin Overview & Management
app.get('/api/admin/overview', (req, res) => {
  const users = getUsers();
  const notes = getNotes();
  const skills = getSkills();
  const reports = getReports();
  const logs = getLogs();

  const totalDownloads = notes.reduce((a, c) => a + (c.download_count || 0), 0);
  const totalViews = notes.reduce((a, c) => a + (c.view_count || 0), 0);

  const deptMap = {};
  notes.forEach(n => {
    deptMap[n.department] = (deptMap[n.department] || 0) + 1;
  });
  const deptDistribution = Object.keys(deptMap).map(k => ({ department: k, count: deptMap[k] }));

  res.json({
    success: true,
    overview: {
      totalStudents: users.filter(u => u.role === 'student').length,
      totalTeachers: users.filter(u => u.role === 'teacher').length,
      totalNotes: notes.length,
      totalDownloads,
      totalViews,
      pendingReports: reports.filter(r => r.status === 'Pending').length,
      activeSkillSwaps: skills.length,
      deptDistribution,
      activities: logs.slice(0, 8)
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  const role = req.query.role;
  let users = getUsers();
  if (role && role !== 'all') {
    users = users.filter(u => u.role === role);
  }
  res.json({ success: true, users: users.map(u => { const c = { ...u }; delete c.password; return c; }) });
});

app.post('/api/admin/users/:id/toggle-verify', (req, res) => {
  const users = getUsers();
  const u = users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false, message: 'User not found' });
  u.verified = !u.verified;
  saveUsers(users);

  // Update notes
  const notes = getNotes();
  notes.forEach(n => {
    if (n.uploader_id === u.id || n.uploader_name === u.name) {
      n.uploader_verified = u.verified;
    }
  });
  saveNotes(notes);

  addLog('Campus Admin', 'admin', `${u.verified ? 'Verified' : 'Unverified'} faculty status for ${u.name}`);
  res.json({ success: true, verified: u.verified });
});

app.post('/api/admin/users/:id/toggle-status', (req, res) => {
  const users = getUsers();
  const u = users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false, message: 'User not found' });
  u.status = u.status === 'Active' ? 'Deactivated' : 'Active';
  saveUsers(users);
  addLog('Campus Admin', 'admin', `Set user status to ${u.status} for ${u.name}`);
  res.json({ success: true, status: u.status });
});

app.get('/api/admin/reports', (req, res) => {
  const reports = getReports();
  const notes = getNotes();
  const enriched = reports.map(r => {
    const n = notes.find(x => x.id === r.note_id);
    return {
      ...r,
      note_title: n ? n.title : 'Study Note',
      note_subject: n ? n.subject : 'Subject',
      uploader_name: n ? n.uploader_name : 'Faculty'
    };
  });
  res.json({ success: true, reports: enriched });
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const { action } = req.body;
  const reports = getReports();
  const r = reports.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Report not found' });

  if (action === 'remove_note') {
    let notes = getNotes();
    notes = notes.filter(n => n.id !== r.note_id);
    saveNotes(notes);
    r.status = 'Resolved - Removed';
    addLog('Campus Admin', 'admin', `Removed reported note #${r.note_id}`);
  } else {
    r.status = 'Dismissed';
    addLog('Campus Admin', 'admin', `Dismissed report #${r.id}`);
  }
  saveReports(reports);
  res.json({ success: true, message: 'Report resolved' });
});

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, 'skillswap-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Notes APIs
app.get('/api/stats', (req, res) => {
  const notes = getNotes();
  const skills = getSkills();
  const users = getUsers();
  const totalDownloads = notes.reduce((acc, curr) => acc + (curr.download_count || 0), 0);
  const totalViews = notes.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
  const departments = [...new Set(notes.map(n => n.department))];

  res.json({
    success: true,
    stats: {
      totalNotes: notes.length,
      totalDownloads,
      totalViews,
      totalDepartments: departments.length,
      activeStudents: users.filter(u => u.role === 'student').length,
      activeTeachers: users.filter(u => u.role === 'teacher').length,
      activeSkillSwaps: skills.length
    }
  });
});

app.get('/api/notes', (req, res) => {
  let notes = getNotes();
  const { search, department, semester, file_type, sort, bookmarked_only, teacher_id } = req.query;
  const bookmarks = getBookmarks();

  if (teacher_id) {
    notes = notes.filter(n => n.uploader_id === teacher_id || (n.uploader_name && n.uploader_name.includes('Johnson')));
  }
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    notes = notes.filter(n =>
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.subject && n.subject.toLowerCase().includes(q)) ||
      (n.topic && n.topic.toLowerCase().includes(q)) ||
      (n.uploader_name && n.uploader_name.toLowerCase().includes(q)) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
  if (department && department !== 'All') notes = notes.filter(n => n.department === department);
  if (semester && semester !== 'All') notes = notes.filter(n => n.semester === parseInt(semester));
  if (file_type && file_type !== 'All') notes = notes.filter(n => n.file_type.toUpperCase() === file_type.toUpperCase());
  if (bookmarked_only === 'true') notes = notes.filter(n => bookmarks.includes(n.id));

  if (sort === 'downloads') notes.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
  else if (sort === 'views') notes.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
  else if (sort === 'rating') notes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else notes.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));

  res.json({
    success: true,
    count: notes.length,
    notes: notes.map(n => ({ ...n, is_bookmarked: bookmarks.includes(n.id) }))
  });
});

app.get('/api/notes/:id', (req, res) => {
  const notes = getNotes();
  const n = notes.find(x => x.id === req.params.id);
  if (!n) return res.status(404).json({ success: false, message: 'Note not found' });
  n.view_count = (n.view_count || 0) + 1;
  saveNotes(notes);
  res.json({ success: true, note: { ...n, is_bookmarked: getBookmarks().includes(n.id) } });
});

app.post('/api/notes', upload.single('file'), (req, res) => {
  const { title, subject, topic, department, semester, description, uploader_name, uploader_role } = req.body;
  if (!title || !subject || !department || !semester) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }

  let fileName = 'sample_lecture_material.pdf';
  let fileSize = '3.0 MB';
  let fileType = 'PDF';
  let filePath = '/sample_files/dsa_comprehensive_notes.pdf';

  if (req.file) {
    fileName = req.file.filename;
    filePath = '/uploads/' + req.file.filename;
    fileSize = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const ext = path.extname(req.file.originalname).replace('.', '').toUpperCase();
    fileType = ext === 'DOCX' ? 'DOCX' : (ext === 'PPTX' ? 'PPT' : ext);
  }

  const newNote = {
    id: 'note-' + Date.now(),
    title: title.trim(),
    subject: subject.trim(),
    topic: topic || subject,
    department,
    semester: parseInt(semester),
    uploader_name: uploader_name || currentSessionUser.name,
    uploader_role: uploader_role || currentSessionUser.title_or_role || 'Faculty',
    uploader_verified: currentSessionUser.verified !== false,
    uploader_id: currentSessionUser.id,
    file_type: fileType,
    file_size: fileSize,
    file_name: fileName,
    file_path: filePath,
    download_count: 0,
    view_count: 1,
    bookmark_count: 0,
    upload_date: new Date().toISOString().split('T')[0],
    description: description || `Lecture notes on ${subject}.`,
    rating: 5.0,
    tags: [subject, department, `Sem ${semester}`],
    preview_pages: [
      { page: 1, title: `Overview: ${title}`, text: `${description || 'Study material uploaded for campus students.'}\n\nSubject: ${subject}\nDepartment: ${department} • Semester: ${semester}` }
    ],
    status: 'Approved'
  };

  const notes = getNotes();
  notes.unshift(newNote);
  saveNotes(notes);

  addLog(newNote.uploader_name, 'teacher', `Uploaded new study material: ${title}`);
  res.status(201).json({ success: true, note: newNote });
});

app.get('/api/notes/:id/download', (req, res) => {
  const notes = getNotes();
  const n = notes.find(x => x.id === req.params.id);
  if (!n) return res.status(404).json({ success: false, message: 'Not found' });

  n.download_count = (n.download_count || 0) + 1;
  saveNotes(notes);

  let target = path.join(__dirname, 'public', 'sample_files', n.file_name);
  if (!fs.existsSync(target)) target = path.join(__dirname, 'uploads', n.file_name);
  if (!fs.existsSync(target)) target = path.join(__dirname, 'public', 'sample_files', 'dsa_comprehensive_notes.pdf');

  addLog(currentSessionUser.name, currentSessionUser.role, `Downloaded note: ${n.title}`);
  res.download(target, `${n.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${n.file_type.toLowerCase()}`);
});

app.delete('/api/notes/:id', (req, res) => {
  let notes = getNotes();
  notes = notes.filter(n => n.id !== req.params.id);
  saveNotes(notes);
  res.json({ success: true, message: 'Deleted' });
});

app.post('/api/notes/:id/bookmark', (req, res) => {
  let b = getBookmarks();
  const id = req.params.id;
  const isB = b.includes(id);
  if (isB) b = b.filter(x => x !== id);
  else b.push(id);
  saveBookmarks(b);

  const notes = getNotes();
  const n = notes.find(x => x.id === id);
  if (n) {
    n.bookmark_count = Math.max(0, (n.bookmark_count || 0) + (isB ? -1 : 1));
    saveNotes(notes);
  }
  res.json({ success: true, is_bookmarked: !isB });
});

app.get('/api/bookmarks', (req, res) => {
  const b = getBookmarks();
  const notes = getNotes().filter(n => b.includes(n.id)).map(n => ({ ...n, is_bookmarked: true }));
  res.json({ success: true, bookmarks: notes });
});

app.post('/api/notes/:id/report', (req, res) => {
  const reports = getReports();
  reports.unshift({
    id: 'report-' + Date.now(),
    note_id: req.params.id,
    reason: req.body.reason || 'Flagged for moderation',
    student_name: req.body.student_name || currentSessionUser.name,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Pending'
  });
  saveReports(reports);
  addLog(currentSessionUser.name, 'student', `Reported note #${req.params.id}`);
  res.json({ success: true, message: 'Report submitted' });
});

app.get('/api/skills', (req, res) => {
  res.json({ success: true, skills: getSkills() });
});

app.post('/api/skills', (req, res) => {
  const { student_name, offering, seeking, department, semester, description, swap_mode } = req.body;
  const newS = {
    id: 'skill-' + Date.now(),
    student_name: student_name || currentSessionUser.name,
    department: department || currentSessionUser.department || 'CSE',
    semester: parseInt(semester) || currentSessionUser.semester || 4,
    offering,
    seeking,
    description: description || 'Collaborative study',
    avatar: '👩‍💻',
    status: 'Available',
    created_at: new Date().toISOString().split('T')[0],
    swap_mode: swap_mode || 'Campus / Online'
  };
  const s = getSkills();
  s.unshift(newS);
  saveSkills(s);
  res.status(201).json({ success: true, skill: newS });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`>> SkillSwap Campus Node Server running on http://localhost:${PORT}`);
});
