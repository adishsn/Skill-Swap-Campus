# SkillSwap Campus 🎓

> **Smart Student Learning and Study Material Platform**  
> *Tagline: Learn Together. Share Skills. Grow Together.*  
> **Built for Hack Fest'26**

---

## 🌟 Overview

**SkillSwap Campus** connects college students, faculty teachers, and campus administrators in one unified platform. Instead of study notes being scattered across chaotic WhatsApp groups, personal Google Drives, and buried email chains, **SkillSwap Campus** introduces **three distinct role-based dashboards** and an **interactive 3D graduation cap opening reveal**:

1. **🎓 3D Graduation Cap Intro & Reveal:** A physical 3D graduation cap rotates, lifts open, bursts with warm golden and electric blue light, and smoothly unveils the actual live SkillSwap platform!
2. **👨‍🎓 Student Dashboard:** Search by semester/department, live in-browser previewer, direct downloads, exam bookmarks, and peer-to-peer technical skill swaps.
3. **👨‍🏫 Teacher Studio:** Drag-and-drop lecture notes upload (PDF, PPT, DOCX), live reach analytics (student views, downloads, rating), and published materials management.
4. **🛡️ Campus Admin Oversight:** College-wide overview, user account management (students, teachers, admins), faculty verification approvals, content moderation (report resolution), and live audit logs.

---

## 🎓 3D Graduation Cap Intro & Cinematic Reveal

### Animation Sequence (~3.0 Seconds):
- **Stage 1 (0.0s – 0.4s): Initial Appearance** — Fullscreen midnight navy backdrop (`#071426`), closed graduation cap with golden aura fades in with a gentle upward scale, and the SkillSwap brand & tagline appear below.
- **Stage 2 (0.4s – 1.2s): 3D Physical Rotation** — The cap rotates 360° in 3D perspective around its vertical axis with subtle horizontal tilt, with the hanging tassel naturally swaying with momentum.
- **Stage 3 (1.2s – 1.9s): Cap Opens** — The square mortarboard visibly lifts upward and tilts back, the lower skull cap gently lowers, and an inner radiant core of warm gold (`#E8B85B`) and electric blue (`#4DA8FF`) beams outward.
- **Stage 4 (1.9s – 2.6s): Live Homepage Reveal** — A cinematic circular aperture expands outward from the open cap, revealing the real, interactive SkillSwap homepage beneath it.
- **Stage 5 (2.6s – 3.0s): Final Transition** — The cap dissolves, the overlay fades out and detaches from pointer interactions, and the homepage is fully accessible.

### Controls & Accessibility:
- **Skip Intro:** Click the **Skip Intro ➔** button in the top-right corner or press `Escape` on your keyboard.
- **Replay Intro:** Click the **🎬 Replay 3D Intro** button in the top live demo banner at any time during your hackathon presentation.
- **Reduced Motion Support:** Respects `prefers-reduced-motion` to skip or immediately fade in for users who need reduced motion.
- **How to Disable:** Set `CONFIG.enabled = false` in `public/js/intro.js`.

---

## 🔐 Authentication & Role-Based Access

The platform includes a dedicated **Sign In / Sign Up Screen** with:
- **1-Click Presentation Quick Logins** (perfect for hackathon demos):
  - 👨‍🎓 **Student Demo:** Alex Sharma (`student@skillswap.edu` / `password123`)
  - 👨‍🏫 **Teacher Demo:** Prof. Sarah Johnson (`teacher@skillswap.edu` / `password123`)
  - 🛡️ **Admin Demo:** Dr. Arthur Vance (`admin@skillswap.edu` / `admin123`)
- Standard **Email & Password Authentication** and **Registration Form** with custom role selection.
- **Top Header Quick Switcher:** Allows judges and presenters to jump between Student, Teacher, and Admin dashboards instantly during a presentation!

---

## 📊 Three Dedicated Dashboards Breakdown

### 1. 👨‍🎓 Student Dashboard
- **Profile Welcome Bar:** Student name, department, semester, and personal saved notes count.
- **Smart Search & Filters:**
  - Real-time debounced full-text search (`Ctrl + K`).
  - Filter by Department (CSE, IT, ECE, Mech, Civil).
  - Filter by Semester (Sem 1 to Sem 8).
  - Filter by File Format (PDF, PPT, DOCX).
  - Sort by Most Downloaded, Most Viewed, or Highest Rated.
- **Note Cards:** Subject badges, semester tags, faculty verification seals, download counters.
- **In-Browser Document Reader:** Multi-page previewer with reading mode and direct file download.
- **My Bookmarks Tab:** Personal library of saved notes for university exam revision.
- **SkillSwap Hub:** Peer learning exchange (e.g., offering Python in exchange for UI/UX in Figma).

### 2. 👨‍🏫 Teacher Studio
- **Faculty Profile Welcome Bar:** Teacher name, designation, verified checkmark.
- **Teacher Analytics:** Total notes published, total student downloads, total read views.
- **Upload Studio:** Drag-and-drop file upload with validation (PDF, PPT, DOCX up to 50MB), subject, topic, semester, and summary notes.
- **My Published Materials Table:** View individual downloads and views, preview notes, or delete materials.

### 3. 🛡️ Campus Admin Dashboard
- **Campus Platform Overview:** Total Students, Total Faculty, Total Notes, Total Downloads, and Pending Reports.
- **User Management Table:**
  - View all registered students, teachers, and admins.
  - **1-Click Faculty Verification Toggle:** Grant or revoke verified faculty status.
  - **1-Click User Status Toggle:** Activate or deactivate accounts.
- **Content Moderation & Reports (Slide 4 Challenge 4):**
  - Review materials flagged by students.
  - 1-click **Dismiss Report** or **Remove Flagged Note** to maintain content quality.
- **Platform Activity Logs:** Live audit feed of uploads, downloads, and administrative actions.

---

## 🎨 Theme & Design System

- **Intro Screen Palette:** Deep Midnight Navy (`#071426`), Soft Metallic Gold (`#E8B85B`), Electric Blue (`#4DA8FF`), and Soft Blue-Gray (`#94A3B8`).
- **Application Palette:** Navy Blue (`#0B192C`, `#122B56`), Emerald & Mint Green (`#10B981`, `#059669`), and Crisp White (`#FFFFFF`).

---

## 🚀 How to Run the Platform

### Running with Python Flask (Slide 6 Architecture)
```powershell
# Double-click run_flask.bat OR run:
python app.py
```
> Live at: **http://127.0.0.1:5000**

### Running with Node.js Express (Alternative)
```powershell
# Double-click run_node.bat OR run:
node server.js
```
> Live at: **http://localhost:5000**
