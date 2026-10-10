const fs = require('fs');
const path = require('path');

const sampleFiles = [
  {
    name: 'dsa_comprehensive_notes.pdf',
    title: 'Data Structures & Algorithms - Master Lecture Notes',
    author: 'Prof. Sarah Johnson (CSE Dept)',
    content: `%PDF-1.4
% SkillSwap Campus Verified Study Material
1 0 obj
<< /Title (Data Structures & Algorithms Comprehensive Notes)
   /Author (Prof. Sarah Johnson)
   /Subject (Computer Science Sem 3)
   /Keywords (DSA, Trees, Graphs, Sorting, Dynamic Programming)
>>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 260 >>
stream
BT
/F1 18 Tf
50 720 Td (SkillSwap Campus - Computer Science & Engineering) Tj
/F1 14 Tf
0 -30 Td (Data Structures & Algorithms: Comprehensive Notes) Tj
/F1 11 Tf
0 -24 Td (Author: Prof. Sarah Johnson | Verified Faculty) Tj
0 -20 Td (Semester: 3 | Subject: CS301) Tj
0 -30 Td (1. Time Complexity Analysis: Big-O, Big-Omega, Big-Theta) Tj
0 -20 Td (2. Binary Search Trees & AVL Rotations) Tj
0 -20 Td (3. Graph Traversals: BFS, DFS, Dijkstra Shortest Path) Tj
0 -20 Td (4. Dynamic Programming: Optimal Substructure & Memoization) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000180 00000 n 
0000000235 00000 n 
0000000300 00000 n 
0000000400 00000 n 
trailer
<< /Size 6 /Root 2 0 R >>
%%EOF`
  },
  {
    name: 'os_memory_scheduling.pdf',
    title: 'Operating Systems - Process Management & Virtual Memory',
    author: 'Prof. Alex Rivera (CSE Dept)',
    content: `%PDF-1.4
% SkillSwap Campus Verified Study Material
1 0 obj
<< /Title (Operating Systems Process & Memory Management)
   /Author (Prof. Alex Rivera)
   /Subject (Computer Science Sem 4)
>>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 250 >>
stream
BT
/F1 18 Tf
50 720 Td (SkillSwap Campus - Operating Systems Lecture Notes) Tj
/F1 12 Tf
0 -30 Td (Author: Prof. Alex Rivera | CSE Department) Tj
0 -20 Td (Topics: CPU Scheduling, Synchronization & Deadlocks) Tj
0 -25 Td (- Turnaround Time = Completion Time - Arrival Time) Tj
0 -20 Td (- Banker's Algorithm Safe State Determination) Tj
0 -20 Td (- Paging, TLB, LRU Page Replacement Policies) Tj
ET
endstream
endobj
trailer
<< /Size 6 /Root 2 0 R >>
%%EOF`
  },
  {
    name: 'dbms_normalization_sql.ppt',
    title: 'DBMS Normalization & SQL Cheatsheet',
    author: 'Prof. Sarah Johnson',
    content: `[SkillSwap Campus Slide Presentation]
Title: Database Management Systems - Normalization & SQL
Uploader: Prof. Sarah Johnson
Semester: 4 | Department: Information Technology

Slide 1: Relational Schema & Functional Dependencies
Slide 2: First, Second, Third Normal Forms (1NF, 2NF, 3NF)
Slide 3: Boyce-Codd Normal Form (BCNF) Decomposition
Slide 4: ACID Transactions & 2-Phase Locking Protocols
Slide 5: Complex SQL Joins & Query Optimization Strategies`
  },
  {
    name: 'machine_learning_essentials.pdf',
    title: 'Machine Learning Foundations & Supervised Algorithms',
    author: 'Dr. David Chen',
    content: `%PDF-1.4
1 0 obj
<< /Title (Machine Learning Essentials) /Author (Dr. David Chen) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 240 >>
stream
BT
/F1 18 Tf
50 720 Td (SkillSwap Campus - Machine Learning Foundations) Tj
/F1 12 Tf
0 -30 Td (Author: Dr. David Chen | AI Lab Head) Tj
0 -20 Td (Linear Regression, Logistic Regression, SVM, Random Forests) Tj
0 -25 Td (Gradient Descent formula: theta := theta - alpha * grad(J)) Tj
0 -20 Td (Cross Validation, Precision, Recall, F1-Score, ROC-AUC) Tj
ET
endstream
endobj
trailer
<< /Size 6 /Root 2 0 R >>
%%EOF`
  },
  {
    name: 'fullstack_web_dev_rest.pdf',
    title: 'Full-Stack Web Development & Modern REST Architecture',
    author: 'Prof. Vikram Rao',
    content: `%PDF-1.4
1 0 obj
<< /Title (Full-Stack Web Dev) /Author (Prof. Vikram Rao) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 230 >>
stream
BT
/F1 18 Tf
50 720 Td (SkillSwap Campus - Full-Stack Web Development) Tj
/F1 12 Tf
0 -30 Td (Author: Prof. Vikram Rao | IT Department) Tj
0 -20 Td (RESTful Principles, HTTP Verbs, Express, Async/Await) Tj
0 -25 Td (Client-Server Architecture & Responsive Web Styling) Tj
ET
endstream
endobj
trailer
<< /Size 6 /Root 2 0 R >>
%%EOF`
  },
  {
    name: 'dsp_formula_handguide.pdf',
    title: 'Digital Signal Processing Formula Hand-Guide & Transforms',
    author: 'Prof. K. Ramesh',
    content: `%PDF-1.4
1 0 obj
<< /Title (DSP Formula Hand-Guide) /Author (Prof. K. Ramesh) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 220 >>
stream
BT
/F1 18 Tf
50 720 Td (SkillSwap Campus - Digital Signal Processing) Tj
/F1 12 Tf
0 -30 Td (Author: Prof. K. Ramesh | ECE Department) Tj
0 -20 Td (DFT, FFT Radix-2 Butterfly, IIR & FIR Filter Design) Tj
ET
endstream
endobj
trailer
<< /Size 6 /Root 2 0 R >>
%%EOF`
  },
  {
    name: 'thermodynamics_heat_transfer.pdf',
    title: 'Engineering Thermodynamics & Heat Transfer Key Derivations',
    author: 'Prof. Rajesh Verma',
    content: `%PDF-1.4
1 0 obj
<< /Title (Engineering Thermodynamics) /Author (Prof. Rajesh Verma) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 230 >>
stream
BT
/F1 18 Tf
50 720 Td (SkillSwap Campus - Engineering Thermodynamics) Tj
/F1 12 Tf
0 -30 Td (Author: Prof. Rajesh Verma | Mechanical Dept) Tj
0 -20 Td (1st & 2nd Laws of Thermodynamics, Carnot Engine, Conduction) Tj
ET
endstream
endobj
trailer
<< /Size 6 /Root 2 0 R >>
%%EOF`
  },
  {
    name: 'rcc_structural_design.docx',
    title: 'Structural Analysis & Reinforced Concrete Design (RCC)',
    author: 'Prof. Priya Nair',
    content: `[SkillSwap Campus Study Document]
Subject: Structural Analysis & Reinforced Concrete Design (RCC)
Author: Prof. Priya Nair (Civil Engineering)
Semester: 4 | IS 456:2000 Code Guidelines

Chapter 1: Limit State Method & Concrete Strength Criteria
Chapter 2: Singly & Doubly Reinforced Beam Calculations
Chapter 3: Shear Reinforcement, Stirrup Spacing & Development Length
Chapter 4: One-way & Two-way Slab Moment Coefficients`
  }
];

const targetDirs = [
  path.join(__dirname, 'public', 'sample_files'),
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'static', 'sample_files')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

sampleFiles.forEach(file => {
  targetDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, file.name), file.content, 'utf8');
  });
});

console.log(`Successfully generated ${sampleFiles.length} sample study files in all directories.`);
