// ==========================================================================
// Hack Fest'26 - 7 Slides Interactive Presentation Engine
// ==========================================================================

const SLIDES_DATA = [
  {
    number: 1,
    eyebrow: "Slide 1: Introduction",
    title: "SkillSwap Campus",
    subtitle: "Smart Learning Platform",
    tagline: "Learn Skills. Share Knowledge. Grow Together.",
    contentHtml: `
      <div class="slide-box">
        <p style="font-size:1.1rem; line-height:1.6; margin-bottom:16px;">
          <strong>SkillSwap Campus</strong> is a digital learning platform designed to connect college students and teachers in one place. Teachers can upload study notes and educational materials, while students can access resources and learn new skills.
        </p>
        <h4 style="color:var(--green-400); margin-bottom:12px; font-size:1.05rem;">Key Features:</h4>
        <ul class="slide-bullets">
          <li>Teachers can upload PDF notes, PPTs, and documents.</li>
          <li>Students can search for notes by subject and semester.</li>
          <li>Students can preview and download study materials.</li>
          <li>Students can bookmark important notes.</li>
          <li>Students can explore new skills and learning resources.</li>
        </ul>
      </div>
      <div style="background:rgba(16,185,129,0.15); border:1px solid rgba(52,211,153,0.3); border-radius:12px; padding:16px 20px;">
        <span style="color:var(--green-400); font-weight:800; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">Objective:</span>
        <p style="color:var(--white); font-size:1rem; margin-top:4px;">
          To make educational resources easily accessible and improve the learning experience for college students.
        </p>
      </div>
    `
  },
  {
    number: 2,
    eyebrow: "Slide 2: Problem Statement",
    title: "Problems Faced by Students and Teachers",
    subtitle: "Fragmented materials & lost educational resources across multiple platforms",
    contentHtml: `
      <div class="slide-box">
        <p style="font-size:1.05rem; line-height:1.6; margin-bottom:18px; color:var(--slate-200);">
          Students often struggle to find the correct study materials because notes are shared across different platforms, such as WhatsApp groups, emails, and personal websites.
        </p>
        <h4 style="color:#f87171; margin-bottom:12px; font-size:1.05rem;">Major Problems Identified:</h4>
        <ul class="slide-bullets">
          <li>Study materials are scattered across multiple platforms.</li>
          <li>Students find it difficult to locate notes for specific subjects.</li>
          <li>Important notes can get lost among daily chat messages.</li>
          <li>Teachers lack a centralized platform to share study materials.</li>
          <li>Students may waste time searching for reliable learning resources.</li>
        </ul>
      </div>
      <div style="background:rgba(239,68,68,0.15); border:1px solid rgba(248,113,113,0.35); border-radius:12px; padding:16px 20px;">
        <span style="color:#fca5a5; font-weight:800; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">Core Problem Statement:</span>
        <p style="color:var(--white); font-size:1rem; margin-top:4px;">
          There is a need for a centralized platform where teachers can upload organized study materials and students can easily search, access, and download them.
        </p>
        <p style="color:var(--slate-300); font-size:0.85rem; margin-top:6px;"><strong>Target Users:</strong> College students and faculty members.</p>
      </div>
    `
  },
  {
    number: 3,
    eyebrow: "Slide 3: Solution",
    title: "Our Proposed Solution",
    subtitle: "SkillSwap Campus Centralized Architecture",
    contentHtml: `
      <div class="slide-box">
        <p style="font-size:1.05rem; margin-bottom:16px;">
          SkillSwap Campus provides a centralized platform for sharing educational resources and discovering learning opportunities.
        </p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px;">
            <strong style="color:var(--green-400);">1. Student Dashboard:</strong> Students explore skills & study materials.
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px;">
            <strong style="color:var(--green-400);">2. Teacher Dashboard:</strong> Teachers upload & manage educational resources.
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px;">
            <strong style="color:var(--green-400);">3. Smart Search:</strong> Search by subject, topic, and semester.
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px;">
            <strong style="color:var(--green-400);">4. Study Material Library:</strong> All resources organized in one repository.
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px;">
            <strong style="color:var(--green-400);">5. Preview & Download:</strong> Preview documents and download in 1 click.
          </div>
          <div style="background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px;">
            <strong style="color:var(--green-400);">6. Bookmarks:</strong> Save essential notes for quick future exam revision.
          </div>
        </div>
      </div>
      <div style="background:linear-gradient(90deg, rgba(37,82,154,0.3) 0%, rgba(16,185,129,0.3) 100%); border:1px solid rgba(52,211,153,0.3); border-radius:12px; padding:16px 20px;">
        <span style="color:var(--green-400); font-weight:800; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">System Workflow:</span>
        <p style="color:var(--white); font-size:1.05rem; font-weight:700; margin-top:4px;">
          Teacher uploads notes ➔ Materials are organized ➔ Students search for notes ➔ Students preview & download
        </p>
        <p style="color:var(--slate-200); font-size:0.85rem; margin-top:6px;"><strong>Main Advantage:</strong> Single unified platform for all campus learning resources.</p>
      </div>
    `
  },
  {
    number: 4,
    eyebrow: "Slide 4: Challenges",
    title: "Challenges in Developing SkillSwap Campus",
    subtitle: "Overcoming Technical and Operational Hurdles",
    contentHtml: `
      <div class="slide-challenges-grid">
        <div class="challenge-item">
          <h4>1. Organizing Study Materials</h4>
          <p><strong>Challenge:</strong> Managing notes from different subjects and semesters.<br>
          <span style="color:var(--green-400);"><strong>Solution:</strong> Categorize materials by subject, topic, department, and semester.</span></p>
        </div>
        <div class="challenge-item">
          <h4>2. Finding Relevant Notes</h4>
          <p><strong>Challenge:</strong> Students may struggle to find specific resources.<br>
          <span style="color:var(--green-400);"><strong>Solution:</strong> Provide intelligent search functionality, filters, and sort metrics.</span></p>
        </div>
        <div class="challenge-item">
          <h4>3. Uploading Documents</h4>
          <p><strong>Challenge:</strong> Handling different file formats and file sizes.<br>
          <span style="color:var(--green-400);"><strong>Solution:</strong> Support approved formats (PDF, PPT, DOCX) with client & server validation.</span></p>
        </div>
        <div class="challenge-item">
          <h4>4. Maintaining Content Quality</h4>
          <p><strong>Challenge:</strong> Ensuring that uploaded resources are appropriate and useful.<br>
          <span style="color:var(--green-400);"><strong>Solution:</strong> Teacher verified badges and student reporting option for quality moderation.</span></p>
        </div>
      </div>
      <div class="challenge-item" style="margin-top:14px; border-left-color:var(--accent-amber);">
        <h4 style="color:#fcd34d;">5. Limited Development Time</h4>
        <p><strong>Challenge:</strong> Building the complete application within an eight-hour hackathon window.<br>
        <span style="color:var(--green-400);"><strong>Solution:</strong> Develop a robust, end-to-end prototype focusing on login/role switcher, dashboards, uploading, smart searching, document previews, and downloading.</span></p>
      </div>
    `
  },
  {
    number: 5,
    eyebrow: "Slide 5: Impacts and Benefits",
    title: "How SkillSwap Campus Benefits Users",
    subtitle: "Tangible Value for Students, Faculty, and Higher Education Institutions",
    contentHtml: `
      <div class="slide-benefits-grid">
        <div class="benefit-col">
          <h4>🎓 Benefits for Students</h4>
          <ul>
            <li>Easy access to verified study notes.</li>
            <li>Less time spent searching across platforms.</li>
            <li>Convenient downloading and bookmarking.</li>
            <li>Better preparation for semester examinations.</li>
            <li>Opportunities to explore new peer skills.</li>
          </ul>
        </div>
        <div class="benefit-col">
          <h4>👨‍🏫 Benefits for Teachers</h4>
          <ul>
            <li>Easy sharing of educational resources.</li>
            <li>Organized management of lecture materials.</li>
            <li>A centralized location for uploading notes.</li>
            <li>Better access to learning resources for students.</li>
            <li>Live download and view analytics.</li>
          </ul>
        </div>
        <div class="benefit-col">
          <h4>🏛️ Benefits for the College</h4>
          <ul>
            <li>Encourages digital campus learning culture.</li>
            <li>Improves equitable access to materials.</li>
            <li>Supports peer knowledge sharing.</li>
            <li>Promotes collaborative student environment.</li>
            <li>Measurable academic repository assets.</li>
          </ul>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.06); border-radius:12px; padding:14px 20px; margin-top:16px;">
        <strong style="color:var(--green-400);">Expected Impact & Metrics:</strong>
        <p style="color:var(--slate-200); font-size:0.9rem; margin-top:4px;">
          Success is measured through: number of uploaded materials, active users, total downloads, and student feedback.
        </p>
      </div>
    `
  },
  {
    number: 6,
    eyebrow: "Slide 6: Technical Approach",
    title: "Technical Approach & Architecture",
    subtitle: "Modern, Scalable Prototype Stack",
    contentHtml: `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
        <div style="background:rgba(255,255,255,0.06); border-radius:12px; padding:16px;">
          <h4 style="color:var(--green-400); margin-bottom:10px;">🛠️ Technologies Used</h4>
          <p style="font-size:0.9rem; margin-bottom:8px;"><strong>1. Frontend:</strong> HTML, CSS, JavaScript (Responsive dashboards & UI)</p>
          <p style="font-size:0.9rem; margin-bottom:8px;"><strong>2. Backend:</strong> Python Flask / Node.js Express (Logic & management)</p>
          <p style="font-size:0.9rem; margin-bottom:8px;"><strong>3. Database:</strong> SQLite / JSON Storage (Profiles, subjects, metadata)</p>
          <p style="font-size:0.9rem;"><strong>4. File Storage:</strong> File Storage (PDF notes, PPTs, documents)</p>
        </div>
        <div style="background:rgba(255,255,255,0.06); border-radius:12px; padding:16px;">
          <h4 style="color:var(--green-400); margin-bottom:10px;">⚡ System Workflow</h4>
          <p style="font-size:0.9rem; line-height:1.6; color:var(--slate-200);">
            <strong>Teacher Login</strong> ➔ <strong>Upload Notes</strong> ➔ <strong>Save Materials</strong> ➔ <strong>Student Login</strong> ➔ <strong>Search Notes</strong> ➔ <strong>Preview</strong> ➔ <strong>Download</strong>
          </p>
          <h4 style="color:var(--green-400); margin:12px 0 6px;">Main Technical Features:</h4>
          <ul style="font-size:0.85rem; color:var(--slate-300); list-style:square; padding-left:18px;">
            <li>Separate student & teacher accounts & role switching</li>
            <li>Study material upload and management</li>
            <li>Subject-based search and filtering</li>
            <li>Document preview and direct download</li>
            <li>Bookmark and SkillSwap peer hub</li>
          </ul>
        </div>
      </div>
      <div style="background:rgba(16,185,129,0.15); border:1px solid rgba(52,211,153,0.3); border-radius:10px; padding:10px 16px; font-size:0.85rem; color:var(--white);">
        🎯 <strong>Development Goal:</strong> To build a simple, user-friendly, and functional prototype within the eight-hour hackathon.
      </div>
    `
  },
  {
    number: 7,
    eyebrow: "Slide 7: Thank You",
    title: "THANK YOU!",
    subtitle: "SkillSwap Campus – Hack Fest'26",
    tagline: "Learn Skills. Share Knowledge. Grow Together.",
    contentHtml: `
      <div style="text-align:center; padding:32px 20px;">
        <div style="font-size:3.5rem; margin-bottom:12px;">🎓🤝📚</div>
        <h3 style="font-size:2rem; font-weight:800; color:var(--white); margin-bottom:6px;">SkillSwap Campus</h3>
        <p style="font-size:1.15rem; color:var(--green-400); font-weight:700; margin-bottom:20px;">
          Learn Skills. Share Knowledge. Grow Together.
        </p>
        <p style="font-size:1.05rem; color:var(--slate-200); max-width:540px; margin:0 auto 28px;">
          Making educational resources accessible to every student, everywhere.
        </p>
        <div style="background:rgba(255,255,255,0.08); border-radius:16px; padding:20px; max-width:480px; margin:0 auto; border:1px solid rgba(255,255,255,0.15);">
          <p style="font-size:0.95rem; color:var(--slate-300);"><strong>Presented for:</strong> Hack Fest'26</p>
          <p style="font-size:0.9rem; color:var(--green-300); margin-top:8px;">
            <strong>Our Vision:</strong> To create a learning community where teachers can share knowledge and students can discover the resources they need to succeed.
          </p>
        </div>
        <div style="margin-top:28px;">
          <button class="btn-card-action btn-card-preview" onclick="closeDeckModal(); activateDemoStep(1);" style="padding:10px 22px; font-size:0.95rem;">
            ▶ Start Live Prototype Demo
          </button>
        </div>
      </div>
    `
  }
];

let currentSlideIdx = 0;

function initDeck() {
  renderDeckSlide(0);
}

function renderDeckSlide(idx) {
  if (idx < 0 || idx >= SLIDES_DATA.length) return;
  currentSlideIdx = idx;
  const slide = SLIDES_DATA[idx];

  const contentArea = document.getElementById('deckSlideContent');
  if (!contentArea) return;

  contentArea.innerHTML = `
    <div class="slide-container active">
      <div class="slide-eyebrow">${slide.eyebrow}</div>
      <h2 class="slide-title">${slide.title}</h2>
      <h3 class="slide-subtitle">${slide.subtitle}</h3>
      ${slide.contentHtml}
    </div>
  `;

  // Update dots
  const dotsContainer = document.getElementById('deckDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = SLIDES_DATA.map((s, i) => `
      <div class="slide-dot ${i === idx ? 'active' : ''}" onclick="renderDeckSlide(${i})" title="Slide ${s.number}: ${s.title}"></div>
    `).join('');
  }

  // Update counter
  const counterEl = document.getElementById('deckCounter');
  if (counterEl) {
    counterEl.textContent = `Slide ${idx + 1} of ${SLIDES_DATA.length}`;
  }

  // Update nav buttons
  const prevBtn = document.getElementById('deckPrevBtn');
  const nextBtn = document.getElementById('deckNextBtn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === SLIDES_DATA.length - 1;
}

function prevSlide() {
  if (currentSlideIdx > 0) renderDeckSlide(currentSlideIdx - 1);
}

function nextSlide() {
  if (currentSlideIdx < SLIDES_DATA.length - 1) renderDeckSlide(currentSlideIdx + 1);
}

function openDeckModal() {
  const modal = document.getElementById('deckModal');
  if (modal) {
    modal.classList.add('active');
    renderDeckSlide(currentSlideIdx);
  }
}

function closeDeckModal() {
  const modal = document.getElementById('deckModal');
  if (modal) modal.classList.remove('active');
}

// Keyboard arrow listener for slides
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('deckModal');
  if (modal && modal.classList.contains('active')) {
    if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') closeDeckModal();
  }
});
