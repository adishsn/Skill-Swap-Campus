// ==========================================================================
// SkillSwap Campus - Core Frontend Application with 3 Separate Dashboards
// Roles: 'student' | 'teacher' | 'admin'
// ==========================================================================

const STATE = {
  currentUser: {
    id: "usr-student-1",
    name: "Alex Sharma",
    email: "student@skillswap.edu",
    role: "student",
    department: "Computer Science & Engineering",
    semester: 4,
    avatar: "👨‍🎓",
    verified: true,
    title_or_role: "Student"
  },
  currentView: 'student-library', // Views: 'student-library' | 'student-bookmarks' | 'student-skills' | 'teacher-studio' | 'admin-dashboard'
  notes: [],
  skills: [],
  bookmarks: new Set(['note-1', 'note-3']),
  adminOverview: null,
  adminUsers: [],
  adminReports: [],
  stats: {
    totalNotes: 8,
    totalDownloads: 2274,
    totalViews: 7880,
    totalDepartments: 6,
    activeStudents: 540,
    activeTeachers: 48,
    activeSkillSwaps: 4
  },
  filters: {
    search: '',
    department: 'All',
    semester: 'All',
    file_type: 'All',
    sort: 'latest'
  },
  activePreviewNote: null,
  activePreviewPage: 0
};

// Fallback seed data in case backend is offline
const LOCAL_USERS = [
  {
    id: "usr-student-1",
    name: "Alex Sharma",
    email: "student@skillswap.edu",
    role: "student",
    department: "Computer Science & Engineering",
    semester: 4,
    avatar: "👨‍🎓",
    verified: true,
    title_or_role: "Student",
    joined_date: "2025-08-10",
    status: "Active"
  },
  {
    id: "usr-teacher-1",
    name: "Prof. Sarah Johnson",
    email: "teacher@skillswap.edu",
    role: "teacher",
    department: "Computer Science & Engineering",
    semester: null,
    avatar: "👨‍🏫",
    verified: true,
    title_or_role: "Associate Professor (CSE)",
    joined_date: "2024-06-15",
    status: "Active"
  },
  {
    id: "usr-admin-1",
    name: "Dr. Arthur Vance",
    email: "admin@skillswap.edu",
    role: "admin",
    department: "Academic Administration",
    semester: null,
    avatar: "🛡️",
    verified: true,
    title_or_role: "Dean of Academic Affairs",
    joined_date: "2024-01-10",
    status: "Active"
  }
];

const LOCAL_SEED_NOTES = [
  {
    id: "note-1",
    title: "Data Structures & Algorithms Complete Master Notes",
    subject: "Data Structures & Algorithms",
    topic: "Arrays, Trees, Graphs, DP & Asymptotic Analysis",
    department: "Computer Science & Engineering",
    semester: 3,
    uploader_name: "Prof. Sarah Johnson",
    uploader_role: "Faculty (CSE Dept) • Verified",
    uploader_verified: true,
    file_type: "PDF",
    file_size: "4.2 MB",
    file_name: "dsa_comprehensive_notes.pdf",
    download_count: 342,
    view_count: 1280,
    bookmark_count: 89,
    upload_date: "2026-02-18",
    description: "Complete verified lecture notes covering asymptotic notations, linked lists, binary search trees, AVL trees, graph traversals (BFS/DFS), Dijkstra's algorithm, and dynamic programming.",
    rating: 4.9,
    tags: ["DSA", "Algorithms", "Trees", "Graphs", "Exam Prep"],
    preview_pages: [
      {
        page: 1,
        title: "Unit 1: Foundations & Asymptotic Complexity",
        text: "1.1 Time & Space Complexity Analysis\nBig-O, Big-Omega, and Big-Theta notations mathematically quantify algorithmic performance.\n\nKey Recurrence Relations:\n- Master Theorem: T(n) = aT(n/b) + f(n)\n- Merge Sort: T(n) = 2T(n/2) + O(n) => O(n log n)\n- Binary Search: T(n) = T(n/2) + O(1) => O(log n)"
      },
      {
        page: 2,
        title: "Unit 2: Non-Linear Data Structures - Trees & Heaps",
        text: "2.1 Binary Search Trees (BST)\nLeft subtree < root < right subtree.\n- Average search time: O(log n), Worst case: O(n).\n\n2.2 AVL Trees:\nBalance factor in {-1, 0, 1} with LL, RR, LR, RL rotations."
      }
    ]
  },
  {
    id: "note-2",
    title: "Operating Systems: Process Management & Virtual Memory",
    subject: "Operating Systems",
    topic: "CPU Scheduling, Synchronization, Deadlocks, Paging",
    department: "Computer Science & Engineering",
    semester: 4,
    uploader_name: "Prof. Alex Rivera",
    uploader_role: "Senior Lecturer (CSE) • Verified",
    uploader_verified: true,
    file_type: "PDF",
    file_size: "3.6 MB",
    file_name: "os_memory_scheduling.pdf",
    download_count: 294,
    view_count: 940,
    bookmark_count: 72,
    upload_date: "2026-02-24",
    description: "Exhaustive lecture guide detailing CPU Scheduling, Banker's Deadlock Algorithm, Critical Section problem using Semaphores, and Virtual Memory Paging.",
    rating: 4.8,
    tags: ["OS", "Processes", "Deadlock", "Virtual Memory"],
    preview_pages: [
      {
        page: 1,
        title: "Module 1: Process Scheduling",
        text: "PCB: Holds Process State, Program Counter, CPU registers.\n\nScheduling Metrics:\n- Turnaround Time = Completion - Arrival\n- Waiting Time = Turnaround - Burst Time\n\nRound Robin scheduling guarantees fairness."
      }
    ]
  },
  {
    id: "note-3",
    title: "Database Systems: Normalization, ER Modeling & SQL Cheatsheet",
    subject: "Database Management Systems",
    topic: "ER Diagrams, Relational Algebra, 1NF to BCNF, ACID Transactions",
    department: "Information Technology",
    semester: 4,
    uploader_name: "Prof. Sarah Johnson",
    uploader_role: "Faculty (IT & CSE) • Verified",
    uploader_verified: true,
    file_type: "PPT",
    file_size: "5.1 MB",
    file_name: "dbms_normalization_sql.ppt",
    download_count: 415,
    view_count: 1420,
    bookmark_count: 110,
    upload_date: "2026-03-01",
    description: "High-yield lecture slides covering Entity-Relationship models, relational schema reduction, Functional Dependencies, decomposition up to BCNF, and transactions.",
    rating: 4.9,
    tags: ["DBMS", "SQL", "Normalization", "BCNF", "Transactions"],
    preview_pages: [
      {
        page: 1,
        title: "Slide 1: Normal Forms Hierarchy",
        text: "1NF: Atomic attributes.\n2NF: No partial dependency on PK.\n3NF: No transitive dependency.\nBCNF: In X -> Y, X must be a super key."
      }
    ]
  },
  {
    id: "note-4",
    title: "Machine Learning Foundations & Supervised Algorithms",
    subject: "Machine Learning",
    topic: "Linear Regression, SVM, Decision Trees, Evaluation Metrics",
    department: "Computer Science & Engineering",
    semester: 6,
    uploader_name: "Dr. David Chen",
    uploader_role: "Associate Professor & AI Lab Head • Verified",
    uploader_verified: true,
    file_type: "PDF",
    file_size: "6.5 MB",
    file_name: "machine_learning_essentials.pdf",
    download_count: 520,
    view_count: 1890,
    bookmark_count: 145,
    upload_date: "2026-03-05",
    description: "Comprehensive semester study pack with mathematical derivations for Gradient Descent, Support Vector Machines, Random Forests, and ROC-AUC curves.",
    rating: 5.0,
    tags: ["Machine Learning", "AI", "Python", "SVM"],
    preview_pages: [
      {
        page: 1,
        title: "Chapter 1: Cost Function & Optimization",
        text: "Linear Regression Cost: J(theta) = (1/2m) * sum((h(x) - y)^2)\nGradient Descent update: theta_j := theta_j - alpha * (1/m) * sum((h(x) - y) * x_j)"
      }
    ]
  },
  {
    id: "note-5",
    title: "Full-Stack Web Development & Modern REST Architecture",
    subject: "Web Technologies",
    topic: "HTTP Protocols, Express/Flask APIs, Async JS, Authentication",
    department: "Information Technology",
    semester: 5,
    uploader_name: "Prof. Vikram Rao",
    uploader_role: "Faculty (Web Tech) • Verified",
    uploader_verified: true,
    file_type: "PDF",
    file_size: "3.7 MB",
    file_name: "fullstack_web_dev_rest.pdf",
    download_count: 215,
    view_count: 780,
    bookmark_count: 64,
    upload_date: "2026-03-12",
    description: "Student handbook on REST API principles, stateless sessions, JWT tokens, CORS security, async/await patterns, and responsive CSS styling.",
    rating: 4.7,
    tags: ["Web Dev", "REST API", "JavaScript", "Full Stack"],
    preview_pages: [
      {
        page: 1,
        title: "Part 1: RESTful API Principles",
        text: "HTTP Verbs: GET, POST, PUT, DELETE.\nStatus Codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error."
      }
    ]
  },
  {
    id: "note-6",
    title: "Digital Signal Processing Formula Hand-Guide & Transforms",
    subject: "Digital Signal Processing",
    topic: "Z-Transform, DFT, FFT Radix-2, FIR/IIR Filter Design",
    department: "Electronics & Communication",
    semester: 5,
    uploader_name: "Prof. K. Ramesh",
    uploader_role: "Faculty (ECE Dept) • Verified",
    uploader_verified: true,
    file_type: "PDF",
    file_size: "3.1 MB",
    file_name: "dsp_formula_handguide.pdf",
    download_count: 198,
    view_count: 620,
    bookmark_count: 51,
    upload_date: "2026-03-15",
    description: "Compact exam preparation handbook containing all derivations for Discrete Fourier Transform, Radix-2 FFT butterflies, and filter specs.",
    rating: 4.8,
    tags: ["DSP", "ECE", "FFT", "Filters"],
    preview_pages: [
      {
        page: 1,
        title: "Section 1: DFT & FFT Butterflies",
        text: "N-Point DFT: X[k] = sum x[n] W_N^{kn}\nRadix-2 FFT reduces complexity from O(N^2) to O(N log2 N)."
      }
    ]
  },
  {
    id: "note-7",
    title: "Engineering Thermodynamics & Heat Transfer Key Derivations",
    subject: "Thermodynamics",
    topic: "First & Second Laws, Carnot Cycle, Heat Exchangers, Conduction",
    department: "Mechanical Engineering",
    semester: 3,
    uploader_name: "Prof. Rajesh Verma",
    uploader_role: "Head of Dept (Mech) • Verified",
    uploader_verified: true,
    file_type: "PDF",
    file_size: "4.8 MB",
    file_name: "thermodynamics_heat_transfer.pdf",
    download_count: 160,
    view_count: 510,
    bookmark_count: 43,
    upload_date: "2026-03-20",
    description: "Essential formulas, cycle thermal efficiencies (Otto, Diesel, Carnot, Rankine), and 1D Fourier conduction equations.",
    rating: 4.7,
    tags: ["Thermodynamics", "Mechanical", "Heat Transfer"],
    preview_pages: [
      {
        page: 1,
        title: "Section 1: Thermodynamic Cycles",
        text: "Carnot Efficiency: eta = 1 - (T_L / T_H)\nFourier's Law: q = -k * A * (dT/dx)"
      }
    ]
  },
  {
    id: "note-8",
    title: "Structural Analysis & Reinforced Concrete Design (RCC)",
    subject: "Structural Engineering",
    topic: "Bending Moments, Shear Force, Limit State Method, Beam Design",
    department: "Civil Engineering",
    semester: 4,
    uploader_name: "Prof. Priya Nair",
    uploader_role: "Faculty (Civil Dept) • Verified",
    uploader_verified: true,
    file_type: "DOCX",
    file_size: "4.4 MB",
    file_name: "rcc_structural_design.docx",
    download_count: 135,
    view_count: 440,
    bookmark_count: 38,
    upload_date: "2026-03-22",
    description: "Calculations and guidelines for singly and doubly reinforced rectangular beams, slab design, and IS 456 safety factors.",
    rating: 4.6,
    tags: ["Civil", "RCC", "Structures", "Beams"],
    preview_pages: [
      {
        page: 1,
        title: "Chapter 1: Limit State Method",
        text: "Safety factor for concrete: 1.5, for steel: 1.15.\nMoment of resistance: M_u,lim = 0.36 * f_ck * b * x_u,max * (d - 0.42 * x_u,max)."
      }
    ]
  }
];

const LOCAL_SEED_SKILLS = [
  {
    id: "skill-1",
    student_name: "Rohan Patel",
    department: "Computer Science",
    semester: 5,
    offering: "Python, Machine Learning & NumPy",
    seeking: "UI/UX Design in Figma & Tailwind CSS",
    description: "I have completed 3 ML projects and can teach Python from scratch to intermediate ML models. Looking for someone to guide me on modern UI design and prototyping in Figma.",
    avatar: "👨‍💻",
    status: "Available",
    created_at: "2026-03-24",
    swap_mode: "Campus Library / Google Meet"
  },
  {
    id: "skill-2",
    student_name: "Ananya Sen",
    department: "Information Technology",
    semester: 4,
    offering: "React, JavaScript & Frontend Animations",
    seeking: "Data Structures (Trees, Dynamic Programming)",
    description: "Can help you master React component state, custom hooks, and modern CSS. Need peer study partner for DSA coding interview prep in C++ / Java.",
    avatar: "👩‍💻",
    status: "Available",
    created_at: "2026-03-25",
    swap_mode: "Online / Discord"
  },
  {
    id: "skill-3",
    student_name: "Karthik Raja",
    department: "Electronics & Communication",
    semester: 6,
    offering: "Arduino, Embedded C & Sensor Interfacing",
    seeking: "Backend API Development with Node.js or Flask",
    description: "Built IoT smart irrigation prototype. Happy to share hands-on microcontroller troubleshooting in exchange for guidance on building cloud REST APIs.",
    avatar: "⚡",
    status: "Available",
    created_at: "2026-03-27",
    swap_mode: "Campus Innovation Lab"
  },
  {
    id: "skill-4",
    student_name: "Meera Nair",
    department: "Computer Science",
    semester: 3,
    offering: "SQL, Database Schema Design & Normalization",
    seeking: "Public Speaking & Hackathon Pitching",
    description: "Strong in relational databases and writing complex queries. Would love to practice hackathon pitching and deck presentation skills with an experienced speaker.",
    avatar: "📊",
    status: "Available",
    created_at: "2026-03-28",
    swap_mode: "Campus Cafeteria / Library"
  }
];

// Document Initialization
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initDeck();
});

async function initApp() {
  setupEventListeners();
  await loadData();
  renderApp();
}

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const view = link.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Main Search Input with debouncing
  const searchInput = document.getElementById('mainSearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        STATE.filters.search = e.target.value;
        fetchAndRenderNotes();
      }, 250);
    });
  }

  // Hero Search Input
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  if (heroSearchBtn && heroSearchInput) {
    const triggerHeroSearch = () => {
      const query = heroSearchInput.value.trim();
      STATE.filters.search = query;
      if (searchInput) searchInput.value = query;
      switchView('student-library');
      fetchAndRenderNotes();
      const libraryView = document.getElementById('view-student-library');
      if (libraryView) libraryView.scrollIntoView({ behavior: 'smooth' });
    };
    heroSearchBtn.addEventListener('click', triggerHeroSearch);
    heroSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerHeroSearch();
    });
  }

  // Filter Selects
  const filterDept = document.getElementById('filterDept');
  const filterSem = document.getElementById('filterSem');
  const filterType = document.getElementById('filterType');
  const filterSort = document.getElementById('filterSort');

  if (filterDept) filterDept.addEventListener('change', (e) => {
    STATE.filters.department = e.target.value;
    updateDeptPillsActiveState(e.target.value);
    fetchAndRenderNotes();
  });
  if (filterSem) filterSem.addEventListener('change', (e) => {
    STATE.filters.semester = e.target.value;
    fetchAndRenderNotes();
  });
  if (filterType) filterType.addEventListener('change', (e) => {
    STATE.filters.file_type = e.target.value;
    fetchAndRenderNotes();
  });
  if (filterSort) filterSort.addEventListener('change', (e) => {
    STATE.filters.sort = e.target.value;
    fetchAndRenderNotes();
  });

  // Department Pills
  document.querySelectorAll('.dept-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const dept = pill.getAttribute('data-dept');
      STATE.filters.department = dept;
      if (filterDept) filterDept.value = dept;
      updateDeptPillsActiveState(dept);
      fetchAndRenderNotes();
    });
  });

  // Reset Filters
  const resetBtn = document.getElementById('btnResetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      STATE.filters = { search: '', department: 'All', semester: 'All', file_type: 'All', sort: 'latest' };
      if (searchInput) searchInput.value = '';
      if (filterDept) filterDept.value = 'All';
      if (filterSem) filterSem.value = 'All';
      if (filterType) filterType.value = 'All';
      if (filterSort) filterSort.value = 'latest';
      updateDeptPillsActiveState('All');
      fetchAndRenderNotes();
      showToast('Filters cleared');
    });
  }

  // Keyboard shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      switchView('student-library');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // Teacher Upload File Dropzone
  setupDropzone();

  // Teacher Upload Form Submit
  const uploadForm = document.getElementById('teacherUploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', handleUploadSubmit);
  }

  // Skill Swap Posting Form
  const postSkillForm = document.getElementById('postSkillForm');
  if (postSkillForm) {
    postSkillForm.addEventListener('submit', handlePostSkillSubmit);
  }

  // Auth Forms
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleEmailLogin);

  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegisterSubmit);
}

function updateDeptPillsActiveState(selectedDept) {
  document.querySelectorAll('.dept-pill').forEach(pill => {
    if (pill.getAttribute('data-dept') === selectedDept) pill.classList.add('active');
    else pill.classList.remove('active');
  });
}

function setupDropzone() {
  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('uploadFileInput');
  const fileSelectedPill = document.getElementById('fileSelectedPill');
  const selectedFileName = document.getElementById('selectedFileName');

  if (!dropzone || !fileInput) return;

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileInput.files = e.dataTransfer.files;
      displaySelectedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      displaySelectedFile(e.target.files[0]);
    }
  });

  function displaySelectedFile(file) {
    if (selectedFileName && fileSelectedPill) {
      selectedFileName.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      fileSelectedPill.style.display = 'inline-flex';
    }
  }
}

// Data Fetching
async function loadData() {
  try {
    const [notesRes, statsRes, skillsRes, userRes] = await Promise.all([
      fetch('/api/notes').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/stats').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/skills').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/auth/current').then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    if (notesRes && notesRes.success && notesRes.notes) STATE.notes = notesRes.notes;
    else STATE.notes = [...LOCAL_SEED_NOTES];

    if (statsRes && statsRes.success && statsRes.stats) STATE.stats = statsRes.stats;

    if (skillsRes && skillsRes.success && skillsRes.skills) STATE.skills = skillsRes.skills;
    else STATE.skills = [...LOCAL_SEED_SKILLS];

    if (userRes && userRes.success && userRes.user) STATE.currentUser = userRes.user;
  } catch (err) {
    STATE.notes = [...LOCAL_SEED_NOTES];
    STATE.skills = [...LOCAL_SEED_SKILLS];
  }
}

// Render Application UI based on active role
function renderApp() {
  updateUserInterfaceForRole();
  updateMetricsUI();
  updateBookmarksBadge();

  if (STATE.currentUser.role === 'admin') {
    loadAdminDataAndRender();
  } else if (STATE.currentUser.role === 'teacher') {
    renderTeacherDashboard();
  } else {
    fetchAndRenderNotes();
    renderSkills();
  }
}

// Adjust top navbar, tabs, and layout depending on current role
function updateUserInterfaceForRole() {
  const role = STATE.currentUser.role; // 'student' | 'teacher' | 'admin'

  // Header user pill
  const userAvatar = document.getElementById('headerUserAvatar');
  const userName = document.getElementById('headerUserName');
  const userRole = document.getElementById('headerUserRole');

  if (userAvatar) userAvatar.textContent = STATE.currentUser.avatar || (role === 'student' ? '👨‍🎓' : (role === 'teacher' ? '👨‍🏫' : '🛡️'));
  if (userName) userName.textContent = STATE.currentUser.name;
  if (userRole) userRole.textContent = role.toUpperCase();

  // Nav links visibility
  const navStudentLinks = document.querySelectorAll('.nav-role-student');
  const navTeacherLinks = document.querySelectorAll('.nav-role-teacher');
  const navAdminLinks = document.querySelectorAll('.nav-role-admin');

  navStudentLinks.forEach(el => el.style.display = (role === 'student') ? 'inline-flex' : 'none');
  navTeacherLinks.forEach(el => el.style.display = (role === 'teacher') ? 'inline-flex' : 'none');
  navAdminLinks.forEach(el => el.style.display = (role === 'admin') ? 'inline-flex' : 'none');

  // Presentation Quick Role Pill dropdown in header
  const demoRoleSelect = document.getElementById('quickRoleSelect');
  if (demoRoleSelect) demoRoleSelect.value = role;

  // Set default view if active view doesn't match role
  if (role === 'student' && !STATE.currentView.startsWith('student')) {
    switchView('student-library');
  } else if (role === 'teacher' && STATE.currentView !== 'teacher-studio' && STATE.currentView !== 'teacher-published') {
    switchView('teacher-studio');
  } else if (role === 'admin' && STATE.currentView !== 'admin-dashboard') {
    switchView('admin-dashboard');
  }

  // Update profile headers in dashboards
  updateProfileHeaders();
}

function updateProfileHeaders() {
  // Student Profile Bar
  const sName = document.getElementById('studentProfileName');
  const sDept = document.getElementById('studentProfileDept');
  const sAvatar = document.getElementById('studentProfileAvatar');
  if (sName) sName.textContent = STATE.currentUser.name;
  if (sDept) sDept.textContent = `${STATE.currentUser.department} • Semester ${STATE.currentUser.semester || 4}`;
  if (sAvatar) sAvatar.textContent = STATE.currentUser.avatar || '👨‍🎓';

  // Teacher Profile Bar
  const tName = document.getElementById('teacherProfileName');
  const tDept = document.getElementById('teacherProfileDept');
  const tAvatar = document.getElementById('teacherProfileAvatar');
  if (tName) tName.textContent = STATE.currentUser.name;
  if (tDept) tDept.textContent = `${STATE.currentUser.title_or_role || 'Faculty'} • ${STATE.currentUser.department}`;
  if (tAvatar) tAvatar.textContent = STATE.currentUser.avatar || '👨‍🏫';

  // Admin Profile Bar
  const aName = document.getElementById('adminProfileName');
  const aDept = document.getElementById('adminProfileDept');
  const aAvatar = document.getElementById('adminProfileAvatar');
  if (aName) aName.textContent = STATE.currentUser.name;
  if (aDept) aDept.textContent = `${STATE.currentUser.title_or_role || 'Dean'} • Campus Academic Administration`;
  if (aAvatar) aAvatar.textContent = STATE.currentUser.avatar || '🛡️';
}

function updateMetricsUI() {
  const noteCountEl = document.getElementById('metricNoteCount');
  const downloadCountEl = document.getElementById('metricDownloadCount');
  const viewCountEl = document.getElementById('metricViewCount');
  const deptCountEl = document.getElementById('metricDeptCount');

  if (noteCountEl) noteCountEl.textContent = `${STATE.notes.length}+`;
  if (downloadCountEl) downloadCountEl.textContent = `${STATE.stats.totalDownloads.toLocaleString()}+`;
  if (viewCountEl) viewCountEl.textContent = `${STATE.stats.totalViews.toLocaleString()}+`;
  if (deptCountEl) deptCountEl.textContent = STATE.stats.totalDepartments;
}

function updateBookmarksBadge() {
  const badge = document.getElementById('navBookmarkCount');
  if (badge) badge.textContent = STATE.bookmarks.size;
}

// Switch Active View
function switchView(viewName) {
  STATE.currentView = viewName;

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-view') === viewName) link.classList.add('active');
    else link.classList.remove('active');
  });

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  if (viewName === 'student-bookmarks') renderBookmarksGrid();
  if (viewName === 'teacher-studio' || viewName === 'teacher-published') renderTeacherDashboard();
  if (viewName === 'admin-dashboard') loadAdminDataAndRender();
  if (viewName === 'student-library') fetchAndRenderNotes();
}

// =========================================================================
// Authentication Logic: Login, Register, Quick Demo Role Switching
// =========================================================================
function openAuthModal(mode = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.classList.add('active');
  switchAuthTab(mode);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
  const loginTabBtn = document.getElementById('tabBtnLogin');
  const regTabBtn = document.getElementById('tabBtnRegister');
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('registerForm');

  if (tab === 'register') {
    regTabBtn?.classList.add('active');
    loginTabBtn?.classList.remove('active');
    if (regForm) regForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
  } else {
    loginTabBtn?.classList.add('active');
    regTabBtn?.classList.remove('active');
    if (loginForm) loginForm.style.display = 'block';
    if (regForm) regForm.style.display = 'none';
  }
}

// 1-Click Fast Login for Presentation / Testing
async function quickLoginAs(role) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_demo: role })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        STATE.currentUser = data.user;
        closeAuthModal();
        renderApp();
        showToast(`Logged in as ${data.user.name} (${role.toUpperCase()})`);
        return;
      }
    }
  } catch (e) {}

  // Local fallback
  const found = LOCAL_USERS.find(u => u.role === role);
  if (found) {
    STATE.currentUser = { ...found };
    closeAuthModal();
    renderApp();
    showToast(`Logged in as ${found.name} (${role.toUpperCase()})`);
  }
}

// Form-based Email Login
async function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.user) {
      STATE.currentUser = data.user;
      closeAuthModal();
      renderApp();
      showToast(`Welcome back, ${data.user.name}!`);
    } else {
      showToast(data.message || 'Invalid credentials', 3000, true);
    }
  } catch (err) {
    // Local fallback check
    const found = LOCAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      STATE.currentUser = { ...found };
      closeAuthModal();
      renderApp();
      showToast(`Logged in as ${found.name}`);
    } else {
      showToast('Login failed: Invalid email or password', 3000, true);
    }
  }
}

// Registration Form Submit
async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const role = document.getElementById('regRole').value;
  const dept = document.getElementById('regDept').value;
  const sem = document.getElementById('regSem').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, department: dept, semester: sem })
    });
    const data = await res.json();
    if (data.success && data.user) {
      STATE.currentUser = data.user;
      closeAuthModal();
      renderApp();
      showToast(`Account created! Welcome, ${data.user.name}`);
    } else {
      showToast(data.message || 'Registration failed', 3000, true);
    }
  } catch (err) {
    showToast('Failed to create account', 3000, true);
  }
}

// Logout
async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {}
  openAuthModal('login');
  showToast('Logged out. Please sign in.');
}

// Quick role switch from header dropdown (for jury live walkthroughs)
function handleQuickRoleChange(newRole) {
  quickLoginAs(newRole);
}

// =========================================================================
// Student Dashboard Logic: Search, Filter, Bookmarks, Skill Swaps
// =========================================================================
async function fetchAndRenderNotes() {
  let filtered = [...STATE.notes];

  try {
    const params = new URLSearchParams();
    if (STATE.filters.search) params.append('search', STATE.filters.search);
    if (STATE.filters.department !== 'All') params.append('department', STATE.filters.department);
    if (STATE.filters.semester !== 'All') params.append('semester', STATE.filters.semester);
    if (STATE.filters.file_type !== 'All') params.append('file_type', STATE.filters.file_type);
    if (STATE.filters.sort) params.append('sort', STATE.filters.sort);

    const res = await fetch(`/api/notes?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.notes) filtered = data.notes;
    }
  } catch (e) {
    const q = STATE.filters.search.toLowerCase();
    if (q) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q) ||
        n.uploader_name.toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (STATE.filters.department !== 'All') filtered = filtered.filter(n => n.department === STATE.filters.department);
    if (STATE.filters.semester !== 'All') filtered = filtered.filter(n => n.semester === parseInt(STATE.filters.semester));
    if (STATE.filters.file_type !== 'All') filtered = filtered.filter(n => n.file_type.toUpperCase() === STATE.filters.file_type.toUpperCase());
  }

  const resultCountEl = document.getElementById('resultCountText');
  if (resultCountEl) {
    resultCountEl.innerHTML = `Showing <strong>${filtered.length}</strong> study materials across departments`;
  }

  const grid = document.getElementById('notesGrid');
  if (grid) {
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No study materials matched your search</h3>
          <p class="empty-subtitle">Try adjusting your search keywords, semester, or department filters.</p>
          <button class="btn-reset-filters" onclick="document.getElementById('btnResetFilters').click()">
            ↺ Clear All Filters
          </button>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(note => createNoteCardHtml(note)).join('');
    }
  }

  renderBookmarksGrid();
}

function createNoteCardHtml(note) {
  const isBookmarked = STATE.bookmarks.has(note.id);
  const typeClass = (note.file_type || 'pdf').toLowerCase();
  let deptShort = note.department || '';
  if (deptShort.length > 20) {
    deptShort = deptShort.replace('Computer Science & Engineering', 'CSE')
                         .replace('Information Technology', 'IT')
                         .replace('Electronics & Communication', 'ECE')
                         .replace('Mechanical Engineering', 'Mech')
                         .replace('Civil Engineering', 'Civil');
  }

  return `
    <div class="note-card" id="card-${note.id}">
      <div class="card-top-bar">
        <span class="file-badge ${typeClass}">
          ${note.file_type} • ${note.file_size || '3.5 MB'}
        </span>
        <div class="card-badges-right">
          <span class="sem-badge">Sem ${note.semester}</span>
          <span class="dept-badge" title="${escapeHtml(note.department)}">${escapeHtml(deptShort)}</span>
        </div>
      </div>

      <div class="card-body">
        <h3 class="card-title" onclick="openPreviewModal('${note.id}')">${escapeHtml(note.title)}</h3>
        <div class="card-subject">
          📚 ${escapeHtml(note.subject)}
        </div>
        <p class="card-desc">${escapeHtml(note.description || note.topic)}</p>

        <div class="card-tags">
          ${(note.tags || []).slice(0, 3).map(t => `<span class="tag-item">#${escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="card-uploader-row">
          <div class="uploader-avatar">${note.uploader_name.charAt(0)}</div>
          <div class="uploader-info">
            <div class="uploader-name">
              ${escapeHtml(note.uploader_name)}
              <span class="verified-icon" title="Verified Faculty">✔</span>
            </div>
            <div class="uploader-role">${escapeHtml(note.uploader_role || 'Faculty')}</div>
          </div>
          <button class="btn-bookmark-toggle ${isBookmarked ? 'bookmarked' : ''}" 
                  onclick="toggleBookmark('${note.id}')" 
                  title="${isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}">
            ★
          </button>
        </div>
      </div>

      <div class="card-footer">
        <div class="card-stats">
          <span class="stat-chip" title="Downloads">📥 <span id="dl-count-${note.id}">${note.download_count || 0}</span></span>
          <span class="stat-chip" title="Views">👁️ ${note.view_count || 0}</span>
          <span class="stat-chip" title="Rating">⭐ ${note.rating || '4.9'}</span>
        </div>
        <div class="card-actions">
          <button class="btn-card-action" onclick="openPreviewModal('${note.id}')">
            Preview
          </button>
          <button class="btn-card-action btn-card-download" onclick="downloadNote('${note.id}')">
            Download
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderBookmarksGrid() {
  const container = document.getElementById('bookmarksGrid');
  if (!container) return;

  const bookmarkedNotes = STATE.notes.filter(n => STATE.bookmarks.has(n.id));

  if (bookmarkedNotes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔖</div>
        <h3 class="empty-title">You haven't bookmarked any notes yet</h3>
        <p class="empty-subtitle">Save essential lecture slides, formula cheat-sheets, and study guides for quick access before exams.</p>
        <button class="btn-card-action btn-card-preview" onclick="switchView('student-library')" style="padding:10px 20px;">
          📚 Browse Study Material Library
        </button>
      </div>
    `;
  } else {
    container.innerHTML = bookmarkedNotes.map(n => createNoteCardHtml(n)).join('');
  }
}

// =========================================================================
// Teacher Dashboard Logic: Analytics, Upload Form, Manage Published Table
// =========================================================================
function renderTeacherDashboard() {
  const tableBody = document.getElementById('teacherTableBody');
  if (!tableBody) return;

  // Filter notes uploaded by current teacher
  const teacherNotes = STATE.notes.filter(n => 
    n.uploader_name === STATE.currentUser.name || 
    n.uploader_id === STATE.currentUser.id || 
    (STATE.currentUser.role === 'teacher' && n.uploader_name.includes('Johnson'))
  );

  const totalUploaded = teacherNotes.length;
  const teacherDownloads = teacherNotes.reduce((a, c) => a + (c.download_count || 0), 0);
  const teacherViews = teacherNotes.reduce((a, c) => a + (c.view_count || 0), 0);

  // Update stat counters
  const tNotes = document.getElementById('teacherStatNotes');
  const tDownloads = document.getElementById('teacherStatDownloads');
  const tViews = document.getElementById('teacherStatViews');

  if (tNotes) tNotes.textContent = totalUploaded;
  if (tDownloads) tDownloads.textContent = teacherDownloads.toLocaleString();
  if (tViews) tViews.textContent = teacherViews.toLocaleString();

  // Render Table
  if (teacherNotes.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:28px; color:var(--slate-400);">
          You haven't uploaded any study materials yet. Use the upload form on the left to share your first lecture note!
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = teacherNotes.map(note => `
      <tr>
        <td>
          <strong style="color:var(--navy-900);">${escapeHtml(note.title)}</strong>
          <div style="font-size:0.75rem; color:var(--slate-400);">${escapeHtml(note.subject)} • Sem ${note.semester}</div>
        </td>
        <td><span class="dept-badge">${note.department}</span></td>
        <td><span class="file-badge ${note.file_type.toLowerCase()}">${note.file_type}</span></td>
        <td><strong>${note.download_count || 0}</strong></td>
        <td>${note.view_count || 0}</td>
        <td>${note.upload_date}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn-card-action" onclick="openPreviewModal('${note.id}')" title="Preview note">👁️</button>
            <button class="btn-card-action btn-card-download" onclick="downloadNote('${note.id}')" title="Download note">📥</button>
            <button class="action-btn-delete" onclick="deleteNote('${note.id}')" title="Delete note">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// =========================================================================
// Admin Dashboard Logic: Overview, User Management, Reports & Activity
// =========================================================================
async function loadAdminDataAndRender() {
  try {
    const [ovRes, uRes, rRes] = await Promise.all([
      fetch('/api/admin/overview').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/admin/users').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/admin/reports').then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    if (ovRes && ovRes.success && ovRes.overview) STATE.adminOverview = ovRes.overview;
    if (uRes && uRes.success && uRes.users) STATE.adminUsers = uRes.users;
    if (rRes && rRes.success && rRes.reports) STATE.adminReports = rRes.reports;
  } catch (err) {}

  renderAdminOverviewCards();
  renderAdminUsersTable();
  renderAdminReportsTable();
  renderAdminActivities();
}

function renderAdminOverviewCards() {
  const ov = STATE.adminOverview || {
    totalStudents: 540,
    totalTeachers: 48,
    totalNotes: STATE.notes.length,
    totalDownloads: STATE.stats.totalDownloads,
    pendingReports: 1
  };

  const admStudents = document.getElementById('adminStatStudents');
  const admTeachers = document.getElementById('adminStatTeachers');
  const admNotes = document.getElementById('adminStatNotes');
  const admDownloads = document.getElementById('adminStatDownloads');
  const admReports = document.getElementById('adminStatReports');

  if (admStudents) admStudents.textContent = ov.totalStudents;
  if (admTeachers) admTeachers.textContent = ov.totalTeachers;
  if (admNotes) admNotes.textContent = ov.totalNotes;
  if (admDownloads) admDownloads.textContent = ov.totalDownloads.toLocaleString();
  if (admReports) admReports.textContent = ov.pendingReports || 0;
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  const users = (STATE.adminUsers && STATE.adminUsers.length > 0) ? STATE.adminUsers : LOCAL_USERS;

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <strong style="color:var(--navy-900); font-weight:700;">${escapeHtml(u.name)}</strong>
        <div style="font-size:0.75rem; color:var(--slate-400);">${escapeHtml(u.email)}</div>
      </td>
      <td>
        <span class="role-tag-pill ${u.role}">${u.role.toUpperCase()}</span>
      </td>
      <td>${escapeHtml(u.department || 'General')}</td>
      <td>
        <span class="status-chip ${u.status === 'Active' ? 'active' : 'deactivated'}">
          ${u.status}
        </span>
      </td>
      <td>
        ${u.role === 'teacher' ? `
          <button class="btn-admin-action" onclick="toggleVerifyUser('${u.id}')" title="Toggle Verified Badge">
            ${u.verified ? '✔ Verified' : '⏳ Unverified'}
          </button>
        ` : `<span style="color:var(--slate-400);">N/A</span>`}
      </td>
      <td>
        <button class="btn-admin-action" onclick="toggleUserStatus('${u.id}')">
          ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

async function toggleVerifyUser(userId) {
  try {
    const res = await fetch(`/api/admin/users/${userId}/toggle-verify`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast('Faculty verification status updated');
      loadAdminDataAndRender();
    }
  } catch (err) {}
}

async function toggleUserStatus(userId) {
  try {
    const res = await fetch(`/api/admin/users/${userId}/toggle-status`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'User status updated');
      loadAdminDataAndRender();
    }
  } catch (err) {}
}

function renderAdminReportsTable() {
  const tbody = document.getElementById('adminReportsTableBody');
  if (!tbody) return;

  const reports = STATE.adminReports || [];

  if (reports.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:20px; color:var(--green-600); font-weight:600;">
          ✔ No pending content reports. All study materials meet university standards.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = reports.map(r => `
    <tr>
      <td>
        <strong>${escapeHtml(r.note_title || 'Note')}</strong>
        <div style="font-size:0.75rem; color:var(--slate-400);">Uploader: ${escapeHtml(r.uploader_name || 'Faculty')}</div>
      </td>
      <td><span style="color:#dc2626; font-weight:600;">${escapeHtml(r.reason)}</span></td>
      <td>${escapeHtml(r.student_name || 'Student')}</td>
      <td><span class="status-chip ${r.status === 'Pending' ? 'pending' : 'active'}">${r.status}</span></td>
      <td>
        ${r.status === 'Pending' ? `
          <div style="display:flex; gap:6px;">
            <button class="btn-admin-action" onclick="resolveReport('${r.id}', 'dismiss')">Dismiss</button>
            <button class="btn-admin-action btn-admin-danger" onclick="resolveReport('${r.id}', 'remove_note')">Remove Note</button>
          </div>
        ` : `<span style="color:var(--slate-400); font-size:0.78rem;">Resolved</span>`}
      </td>
    </tr>
  `).join('');
}

async function resolveReport(reportId, action) {
  try {
    const res = await fetch(`/api/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
      loadAdminDataAndRender();
      await loadData();
    }
  } catch (err) {}
}

function renderAdminActivities() {
  const container = document.getElementById('adminActivityList');
  if (!container) return;

  const logs = STATE.adminOverview?.activities || [
    { user_name: 'Prof. Sarah Johnson', role: 'teacher', action: 'Uploaded lecture notes: Data Structures', timestamp: '2026-10-10 09:15' },
    { user_name: 'Alex Sharma', role: 'student', action: 'Downloaded Operating Systems PDF', timestamp: '2026-10-10 10:40' },
    { user_name: 'Dr. Arthur Vance', role: 'admin', action: 'Approved Faculty Verification for Dr. David Chen', timestamp: '2026-10-10 11:20' }
  ];

  container.innerHTML = logs.map(l => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div style="flex:1;">
        <div><strong>${escapeHtml(l.user_name)}</strong> <span class="role-tag-pill ${l.role}">${l.role}</span>: ${escapeHtml(l.action)}</div>
        <div class="activity-meta">${l.timestamp}</div>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// Peer Skill Swap Network & Previews & Downloads
// =========================================================================
function handleHeroChipSearch(term) {
  STATE.filters.search = term;
  const searchInput = document.getElementById('mainSearchInput');
  const heroSearchInput = document.getElementById('heroSearchInput');
  if (searchInput) searchInput.value = term;
  if (heroSearchInput) heroSearchInput.value = term;
  switchView('student-library');
  fetchAndRenderNotes();
  const libraryView = document.getElementById('view-student-library');
  if (libraryView) libraryView.scrollIntoView({ behavior: 'smooth' });
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  grid.innerHTML = STATE.skills.map(skill => {
    let category = skill.department ? skill.department.replace('& Engineering', '').trim() : 'Skill Swap';
    if (category.length > 20) category = category.substring(0, 18) + '...';
    const previewText = escapeHtml(skill.description || 'Open for collaborative peer exchange and exam prep.');

    return `
    <div class="skill-card" id="skill-${skill.id}">
      <!-- 1. Header: Skill category badge + author avatar -->
      <div class="skill-card-header">
        <span class="skill-category-badge">${escapeHtml(category)}</span>
        <div class="skill-author-group">
          <div class="skill-author-info">
            <span class="skill-author-name">${escapeHtml(skill.student_name)}</span>
            <span class="skill-author-meta">Sem ${skill.semester || 4}</span>
          </div>
          <div class="skill-author-avatar" title="${escapeHtml(skill.student_name)}">${skill.avatar || '👩‍💻'}</div>
        </div>
      </div>

      <!-- 2. Body: Concise skill title + brief preview -->
      <div class="skill-card-body">
        <h4 class="skill-card-title">${escapeHtml(skill.offering)}</h4>
        <p class="skill-card-preview">${previewText}</p>
        <div class="skill-meta-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${escapeHtml(skill.swap_mode || 'Campus / Online')}</span>
        </div>
      </div>

      <!-- 3. Footer: "Looking to learn: [tag]" and a distinct, styled swap action button -->
      <div class="skill-card-footer">
        <div class="skill-seeking-row">
          <span class="skill-seeking-label">Looking to learn:</span>
          <span class="skill-seeking-tag" title="${escapeHtml(skill.seeking)}">${escapeHtml(skill.seeking)}</span>
        </div>
        <button class="btn-swap-action" onclick="openSkillRequestModal('${skill.id}', '${escapeHtml(skill.student_name)}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/></svg>
          Propose Swap
        </button>
      </div>
    </div>
  `;
  }).join('');
}

function openPreviewModal(noteId) {
  const note = STATE.notes.find(n => n.id === noteId);
  if (!note) return;

  STATE.activePreviewNote = note;
  STATE.activePreviewPage = 0;

  note.view_count = (note.view_count || 0) + 1;
  STATE.stats.totalViews++;
  updateMetricsUI();

  fetch(`/api/notes/${noteId}`).catch(() => {});

  const modal = document.getElementById('previewModal');
  const titleEl = document.getElementById('previewNoteTitle');
  const metaEl = document.getElementById('previewNoteMeta');
  const dlBtn = document.getElementById('btnPreviewDownload');

  if (titleEl) titleEl.textContent = note.title;
  if (metaEl) {
    metaEl.innerHTML = `
      <span>📚 ${escapeHtml(note.subject)}</span>
      <span>•</span>
      <span>🏛️ ${escapeHtml(note.department)} (Sem ${note.semester})</span>
      <span>•</span>
      <span>👨‍🏫 ${escapeHtml(note.uploader_name)}</span>
    `;
  }
  if (dlBtn) dlBtn.onclick = () => downloadNote(note.id);

  renderPreviewPage();
  if (modal) modal.classList.add('active');
}

function renderPreviewPage() {
  const note = STATE.activePreviewNote;
  if (!note) return;

  const pages = note.preview_pages && note.preview_pages.length > 0 ? note.preview_pages : [
    { page: 1, title: `Study Guide: ${note.title}`, text: `${note.description}\n\nSubject: ${note.subject}\nDepartment: ${note.department}` }
  ];

  const currentIdx = Math.max(0, Math.min(STATE.activePreviewPage, pages.length - 1));
  const page = pages[currentIdx];

  const sheetTitle = document.getElementById('previewSheetTitle');
  const sheetText = document.getElementById('previewSheetText');
  const pageCounter = document.getElementById('previewPageIndicator');
  const prevBtn = document.getElementById('previewPrevPageBtn');
  const nextBtn = document.getElementById('previewNextPageBtn');

  if (sheetTitle) sheetTitle.textContent = page.title || `Page ${currentIdx + 1}`;
  if (sheetText) sheetText.textContent = page.text || 'No text preview available.';
  if (pageCounter) pageCounter.textContent = `Page ${currentIdx + 1} of ${pages.length}`;

  if (prevBtn) prevBtn.disabled = currentIdx === 0;
  if (nextBtn) nextBtn.disabled = currentIdx === pages.length - 1;
}

function prevPreviewPage() {
  if (STATE.activePreviewPage > 0) {
    STATE.activePreviewPage--;
    renderPreviewPage();
  }
}

function nextPreviewPage() {
  const pages = STATE.activePreviewNote?.preview_pages || [];
  if (STATE.activePreviewPage < pages.length - 1) {
    STATE.activePreviewPage++;
    renderPreviewPage();
  }
}

function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.remove('active');
  STATE.activePreviewNote = null;
}

async function downloadNote(noteId) {
  const note = STATE.notes.find(n => n.id === noteId);
  if (!note) return;

  note.download_count = (note.download_count || 0) + 1;
  STATE.stats.totalDownloads++;
  updateMetricsUI();

  const countBadge = document.getElementById(`dl-count-${noteId}`);
  if (countBadge) countBadge.textContent = note.download_count;

  if (STATE.currentUser.role === 'teacher') renderTeacherDashboard();
  showToast(`Downloading: ${note.title} (${note.file_type})`);

  const downloadUrl = `/api/notes/${noteId}/download`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${note.title}.${note.file_type.toLowerCase()}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function toggleBookmark(noteId) {
  const note = STATE.notes.find(n => n.id === noteId);
  if (!note) return;

  const isBookmarked = STATE.bookmarks.has(noteId);

  if (isBookmarked) {
    STATE.bookmarks.delete(noteId);
    note.bookmark_count = Math.max(0, (note.bookmark_count || 1) - 1);
    showToast('Removed from Bookmarks');
  } else {
    STATE.bookmarks.add(noteId);
    note.bookmark_count = (note.bookmark_count || 0) + 1;
    showToast('Saved to My Bookmarks ★');
  }

  fetch(`/api/notes/${noteId}/bookmark`, { method: 'POST' }).catch(() => {});
  updateBookmarksBadge();
  fetchAndRenderNotes();
}

async function handleUploadSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('btnSubmitUpload');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Uploading Material...';
  }

  try {
    const formData = new FormData(form);
    formData.set('uploader_name', STATE.currentUser.name);
    formData.set('uploader_role', STATE.currentUser.title_or_role || 'Faculty');

    let uploadedNote = null;

    try {
      const res = await fetch('/api/notes', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.note) uploadedNote = data.note;
      }
    } catch (netErr) {}

    if (!uploadedNote) {
      const fileInput = document.getElementById('uploadFileInput');
      const file = fileInput?.files?.[0];
      const title = formData.get('title');
      const subject = formData.get('subject');
      const dept = formData.get('department');
      const sem = parseInt(formData.get('semester')) || 1;
      const desc = formData.get('description');
      const ext = file ? file.name.split('.').pop().toUpperCase() : 'PDF';

      uploadedNote = {
        id: 'note-' + Date.now(),
        title, subject,
        topic: formData.get('topic') || subject,
        department: dept, semester: sem,
        uploader_name: STATE.currentUser.name,
        uploader_role: STATE.currentUser.title_or_role || 'Faculty • Verified',
        uploader_verified: true,
        uploader_id: STATE.currentUser.id,
        file_type: ext === 'DOCX' ? 'DOCX' : (ext === 'PPTX' ? 'PPT' : ext),
        file_size: file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : '2.8 MB',
        file_name: file ? file.name : 'uploaded_lecture_note.pdf',
        download_count: 0, view_count: 1, bookmark_count: 0,
        upload_date: new Date().toISOString().split('T')[0],
        description: desc || `Lecture notes on ${subject}.`,
        rating: 5.0,
        tags: [subject, dept, `Sem ${sem}`],
        preview_pages: [
          { page: 1, title: `Unit Overview: ${title}`, text: `${desc || 'Newly uploaded study material'}\n\nSubject: ${subject}\nDepartment: ${dept} • Semester: ${sem}` }
        ]
      };
    }

    STATE.notes.unshift(uploadedNote);
    STATE.stats.totalNotes = STATE.notes.length;

    form.reset();
    const fileSelectedPill = document.getElementById('fileSelectedPill');
    if (fileSelectedPill) fileSelectedPill.style.display = 'none';

    renderTeacherDashboard();
    showToast('✅ Study material successfully uploaded and published!');

  } catch (err) {
    showToast('Failed to upload: ' + err.message, 3000, true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '📤 Publish to Campus Library';
    }
  }
}

async function deleteNote(noteId) {
  if (!confirm('Are you sure you want to delete this study material?')) return;

  STATE.notes = STATE.notes.filter(n => n.id !== noteId);
  STATE.bookmarks.delete(noteId);
  STATE.stats.totalNotes = STATE.notes.length;

  fetch(`/api/notes/${noteId}`, { method: 'DELETE' }).catch(() => {});

  renderTeacherDashboard();
  showToast('Study material deleted.');
}

async function handlePostSkillSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = document.getElementById('skillStudentName').value;
  const offering = document.getElementById('skillOffering').value;
  const seeking = document.getElementById('skillSeeking').value;
  const dept = document.getElementById('skillDept').value;
  const sem = document.getElementById('skillSem').value;
  const desc = document.getElementById('skillDesc').value;
  const mode = document.getElementById('skillMode').value;

  const newSkill = {
    id: 'skill-' + Date.now(),
    student_name: name || STATE.currentUser.name,
    department: dept || STATE.currentUser.department,
    semester: parseInt(sem) || STATE.currentUser.semester || 4,
    offering, seeking,
    description: desc,
    avatar: '👨‍💻',
    status: 'Available',
    created_at: new Date().toISOString().split('T')[0],
    swap_mode: mode || 'Campus Library / Online'
  };

  try {
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkill)
    });
  } catch (err) {}

  STATE.skills.unshift(newSkill);
  renderSkills();
  closeModal('postSkillModal');
  form.reset();
  showToast('🎉 Your skill swap offer is now visible to all students!');
}

function openSkillRequestModal(skillId, studentName) {
  const modal = document.getElementById('skillRequestModal');
  const targetNameEl = document.getElementById('skillRequestTargetName');
  if (targetNameEl) targetNameEl.textContent = studentName;
  if (modal) modal.classList.add('active');
}

function sendSkillProposal() {
  closeModal('skillRequestModal');
  showToast('✉️ Study proposal sent! The peer student will be notified.');
}

// Presentation Walkthrough Step Guide
function activateDemoStep(stepNumber) {
  document.querySelectorAll('.demo-step-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`demoStepBtn${stepNumber}`);
  if (activeBtn) activeBtn.classList.add('active');

  if (stepNumber === 1) {
    quickLoginAs('teacher');
    switchView('teacher-studio');
    const uploadCard = document.getElementById('teacherUploadCard');
    if (uploadCard) {
      uploadCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      uploadCard.style.outline = '3px solid var(--green-500)';
      setTimeout(() => uploadCard.style.outline = 'none', 3000);
    }
    showToast('Step 1 Demo: Switched to Teacher Dashboard & Upload Hub!');
  } else if (stepNumber === 2) {
    quickLoginAs('student');
    switchView('student-library');
    const searchInput = document.getElementById('mainSearchInput');
    const filterSem = document.getElementById('filterSem');
    if (filterSem) {
      filterSem.value = '3';
      STATE.filters.semester = '3';
    }
    if (searchInput) {
      searchInput.value = 'Data Structures';
      STATE.filters.search = 'Data Structures';
      searchInput.focus();
    }
    fetchAndRenderNotes();
    showToast('Step 2 Demo: Switched to Student Dashboard & Searched Semester 3 Notes!');
  } else if (stepNumber === 3) {
    quickLoginAs('student');
    switchView('student-library');
    openPreviewModal('note-1');
    showToast('Step 3 Demo: In-Browser Document Previewer & 1-Click Download!');
  }
}

// Utility Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, duration = 3000, isError = false) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `<span>${isError ? '⚠️' : 'ℹ️'}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
