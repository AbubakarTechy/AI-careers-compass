/* 
================================================================
Career Compass AI - Shared Core Script
================================================================
*/

// Toast Notification Utility (Replaces blocking browser alerts)
function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-circle-check";
    let iconColor = "var(--success)";
    if (type === "error") {
        icon = "fa-circle-exclamation";
        iconColor = "var(--danger)";
    } else if (type === "warning") {
        icon = "fa-triangle-exclamation";
        iconColor = "var(--warning)";
    } else if (type === "info") {
        icon = "fa-circle-info";
        iconColor = "var(--primary)";
    }

    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${iconColor}; font-size: 1.15rem;"></i>
        <div style="flex: 1; line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 4000);
}

// Initial Career Data Seed
const defaultCareers = [
    {
        id: "web-dev",
        name: "Web Developer",
        category: "development",
        salary: "$70,000 - $110,000",
        whyRecommended: "High demand for interactive apps and global digitisation. Fits students with design and logical coding interests.",
        skills: ["HTML", "CSS", "JavaScript", "React / Vue", "Node.js", "Git / GitHub"],
        roadmap: ["Learn Core HTML/CSS/JS", "Master responsive UI designs", "Pick up a Frontend Framework (React/Vue)", "Understand databases & backends (Node/Express)", "Build complete full-stack portfolio projects"],
        resources: [
            { title: "freeCodeCamp Responsive Web Design", url: "https://www.freecodecamp.org/" },
            { title: "MDN Web Docs - Developer Guide", url: "https://developer.mozilla.org/" },
            { title: "The Odin Project - Full Stack JS", url: "https://theodinproject.com/" }
        ]
    },
    {
        id: "ui-ux",
        name: "UI/UX Designer",
        category: "design",
        salary: "$65,000 - $105,000",
        whyRecommended: "Perfect match for visual thinkers who enjoy understanding user behaviors, layouts, and graphic design principles.",
        skills: ["Figma / Adobe XD", "User Research", "Wireframing", "Interaction Design", "Prototyping", "Design Systems"],
        roadmap: ["Understand user experience fundamentals", "Master design tools like Figma", "Learn user research & persona creation", "Develop interactive high-fidelity prototypes", "Conduct usability testing & build portfolio"],
        resources: [
            { title: "Google UX Design Professional Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
            { title: "Figma YouTube Tutorials", url: "https://www.youtube.com/@Figma" },
            { title: "UX Collective Industry Reading", url: "https://uxdesign.cc/" }
        ]
    },
    {
        id: "data-analyst",
        name: "Data Analyst",
        category: "data",
        salary: "$60,000 - $95,000",
        whyRecommended: "Highly suited for individuals with strong mathematical and analytical skills who enjoy decoding statistical trends.",
        skills: ["SQL Databases", "Microsoft Excel", "Python / R", "Tableau / Power BI", "Data Wrangling", "Statistical Analysis"],
        roadmap: ["Learn advanced Excel for analytics", "Master SQL query writing", "Learn data visualization tools (Tableau/PowerBI)", "Study basic Python statistics library (Pandas/NumPy)", "Build and publish interactive business dashboards"],
        resources: [
            { title: "Kaggle Data Analytics Courses", url: "https://www.kaggle.com/learn" },
            { title: "SQL Bolt - Interactive SQL", url: "https://sqlbolt.com/" },
            { title: "Google Data Analytics Professional Cert", url: "https://www.coursera.org/professional-certificates/google-data-analytics" }
        ]
    },
    {
        id: "cyber-sec",
        name: "Cybersecurity Specialist",
        category: "security",
        salary: "$80,000 - $130,000",
        whyRecommended: "Essential in safeguarding digital assets. Suited for detail-oriented students interested in networking, hacking, and compliance.",
        skills: ["Networking Basics", "Linux Administration", "CompTIA Security+", "Ethical Hacking", "Firewall Configuration", "Threat Auditing"],
        roadmap: ["Master TCP/IP networking concepts", "Understand Linux system administration", "Prepare for basic security certs (CompTIA Security+)", "Learn ethical hacking with Kali Linux", "Understand incident response & compliance"],
        resources: [
            { title: "TryHackMe - Interactive Cybersecurity", url: "https://tryhackme.com/" },
            { title: "Cisco Networking Academy Courses", url: "https://www.netacad.com/" },
            { title: "Cybrary Cyber Security Library", url: "https://www.cybrary.it/" }
        ]
    },
    {
        id: "soft-eng",
        name: "Software Engineer",
        category: "development",
        salary: "$85,000 - $140,000",
        whyRecommended: "Geared towards problem solvers who want to construct backend architectures, write algorithms, and manage servers.",
        skills: ["Java / Python / C++", "Data Structures", "Algorithms", "System Architecture", "Git", "Object-Oriented Programming"],
        roadmap: ["Master a core programming language (Python/Java/C++)", "Study Data Structures & Algorithms (DSA)", "Understand Object-Oriented Design patterns", "Learn database models and system communication", "Practice building scalable backend server engines"],
        resources: [
            { title: "LeetCode Algorithm Practice", url: "https://leetcode.com/" },
            { title: "GeeksforGeeks Computer Science Guides", url: "https://www.geeksforgeeks.org/" },
            { title: "CS50 Introduction to Computer Science", url: "https://pll.harvard.edu/course/cs50-introduction-computer-science" }
        ]
    }
];

// Initial Seed Users
const defaultUsers = [
    { email: "student@compass.com", password: "password", name: "Ali Khan", role: "student" },
    { email: "counselor@compass.com", password: "password", name: "Dr. Sarah", role: "counselor" },
    { email: "admin@compass.com", password: "password", name: "System Admin", role: "admin" }
];

// Initial Seed Student Profiles
const defaultStudentProfiles = {
    "student@compass.com": {
        degree: "BS Computer Science",
        skills: ["HTML", "CSS", "JavaScript"],
        interests: ["Coding websites", "Designing simple graphics", "Creating online apps"],
        subjects: ["Web Engineering", "Database Systems"],
        goals: "Transition to a fullstack web developer by graduation.",
        recommendations: ["Web Developer", "UI/UX Designer", "Software Engineer"],
        savedCareers: ["Web Developer"],
        progress: 60,
        checklist: [
            { id: "html", text: "Learn HTML & CSS Basics", completed: true },
            { id: "js", text: "Master JavaScript Fundamentals", completed: true },
            { id: "portfolio", text: "Build personal portfolio project", completed: true },
            { id: "react", text: "Learn a Frontend Framework (React)", completed: false },
            { id: "intern", text: "Secure summer development internship", completed: false }
        ]
    },
    "fatimah@compass.com": {
        degree: "BS Information Systems",
        skills: ["SQL", "Excel", "Data Presentation"],
        interests: ["Finding hidden trends", "Generating reports", "Organizing database structures"],
        subjects: ["Information Security", "Business Intelligence"],
        goals: "Get hired as a data insights lead or business intelligence analyst.",
        recommendations: ["Data Analyst", "Web Developer"],
        savedCareers: ["Data Analyst"],
        progress: 80,
        checklist: [
            { id: "excel", text: "Learn Advanced Excel Tools", completed: true },
            { id: "sql", text: "Master Database SQL Queries", completed: true },
            { id: "tableau", text: "Learn Tableau Dashboard Creation", completed: true },
            { id: "python", text: "Learn basic Pandas dataframes", completed: false }
        ]
    },
    "yousef@compass.com": {
        degree: "BS Computer Engineering",
        skills: ["Linux", "Wireshark", "Networking Principles"],
        interests: ["Configuring networks", "Protecting environments from hackers"],
        subjects: ["Operating Systems", "Network Security"],
        goals: "Work in a corporate security team defense team.",
        recommendations: ["Cybersecurity Specialist", "Software Engineer"],
        savedCareers: ["Cybersecurity Specialist"],
        progress: 40,
        checklist: [
            { id: "linux", text: "Learn CLI Terminal Basics", completed: true },
            { id: "net", text: "Master TCP/IP configurations", completed: true },
            { id: "security", text: "CompTIA Security+ Prep", completed: false },
            { id: "hack", text: "TryHackMe CTF exercises", completed: false }
        ]
    }
};

// Seed Feedback Form Submissions
const defaultFeedback = [
    { name: "Ahmed Abdullah", email: "ahmed@university.edu", subject: "Integration with Portal", message: "Can we connect this tool directly with our university enrollment API?", date: "2026-06-01" },
    { name: "Fatima Al-Harbi", email: "fatima.h@study.com", subject: "More Design Careers", message: "Would love to see paths for Graphic Design and Motion Illustration added.", date: "2026-06-02" }
];

// Initialize LocalStorage Data
function initializeData() {
    if (!localStorage.getItem("compass_users")) {
        localStorage.setItem("compass_users", JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem("compass_careers")) {
        localStorage.setItem("compass_careers", JSON.stringify(defaultCareers));
    }
    if (!localStorage.getItem("compass_student_profiles")) {
        localStorage.setItem("compass_student_profiles", JSON.stringify(defaultStudentProfiles));
    }
    if (!localStorage.getItem("compass_feedback")) {
        localStorage.setItem("compass_feedback", JSON.stringify(defaultFeedback));
    }
}

// Quick fill function helper for university evaluations
function fillDemo(email, password, role) {
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = password;
    document.getElementById("login-role").value = role;
}

// Landing Page Specific Logic
document.addEventListener("DOMContentLoaded", () => {
    // Run initialization
    initializeData();

    // Setup Theme (Dark / Light)
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        updateThemeToggleIcon(true);
    }

    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeToggleIcon(isDark);
        });
    }

    function updateThemeToggleIcon(isDark) {
        const icon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;
        if (icon) {
            if (isDark) {
                icon.className = "fa-solid fa-sun";
            } else {
                icon.className = "fa-solid fa-moon";
            }
        }
    }

    // Mobile Navbar Drawer
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Modal Triggers
    const loginModal = document.getElementById("login-modal");
    const loginNavBtn = document.getElementById("login-nav-btn");
    const heroBtn = document.getElementById("hero-get-started");
    const closeModalBtn = document.getElementById("close-modal-btn");

    function openModal() {
        if (loginModal) loginModal.classList.add("active");
    }

    function closeModal() {
        if (loginModal) loginModal.classList.remove("active");
    }

    if (loginNavBtn) loginNavBtn.addEventListener("click", openModal);
    if (heroBtn) heroBtn.addEventListener("click", openModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    // Also support any footer or inline triggers
    document.querySelectorAll(".login-trigger-btn").forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal if user clicks background
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            closeModal();
        }
    });

    // Modal Tabs (Login vs Register toggle)
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (tabLogin && tabRegister && loginForm && registerForm) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active");
            tabRegister.classList.remove("active");
            loginForm.style.display = "block";
            registerForm.style.display = "none";
        });

        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("active");
            tabLogin.classList.remove("active");
            registerForm.style.display = "block";
            loginForm.style.display = "none";
        });
    }

    // Form Handling - Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const pass = document.getElementById("login-password").value;
            const role = document.getElementById("login-role").value;

            const users = JSON.parse(localStorage.getItem("compass_users")) || [];
            
            // Check auth
            const matchedUser = users.find(u => u.email === email && u.password === pass && u.role === role);

            if (matchedUser) {
                // Store active session
                localStorage.setItem("compass_session", JSON.stringify(matchedUser));
                
                // Redirect based on role
                if (role === "student") {
                    window.location.href = "dashboards/student.html";
                } else if (role === "counselor") {
                    window.location.href = "dashboards/counselor.html";
                } else if (role === "admin") {
                    window.location.href = "dashboards/admin.html";
                }
            } else {
                showToast("Invalid credentials, password, or role selection!", "error");
            }
        });
    }

    // Form Handling - Register
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("reg-name").value.trim();
            const email = document.getElementById("reg-email").value.trim().toLowerCase();
            const pass = document.getElementById("reg-password").value;
            const role = document.getElementById("reg-role").value;

            if (pass.length < 6) {
                showToast("Password must be at least 6 characters!", "warning");
                return;
            }

            const users = JSON.parse(localStorage.getItem("compass_users")) || [];
            
            // Duplicate check
            if (users.find(u => u.email === email)) {
                showToast("An account with this email is already registered!", "error");
                return;
            }

            // Register user
            const newUser = { email, password: pass, name, role };
            users.push(newUser);
            localStorage.setItem("compass_users", JSON.stringify(users));

            // If it's a student, initialize their blank profile
            if (role === "student") {
                const profiles = JSON.parse(localStorage.getItem("compass_student_profiles")) || {};
                profiles[email] = {
                    degree: "",
                    skills: [],
                    interests: [],
                    subjects: [],
                    goals: "",
                    recommendations: [],
                    savedCareers: [],
                    progress: 0,
                    checklist: [
                        { id: "setup", text: "Complete your profile", completed: false },
                        { id: "recommend", text: "Generate AI Career recommendations", completed: false },
                        { id: "skills", text: "Acquire one key missing skill", completed: false },
                        { id: "resume", text: "Update resume according to roadmap", completed: false }
                    ]
                };
                localStorage.setItem("compass_student_profiles", JSON.stringify(profiles));
            }

            showToast("Account registered successfully! You can login now.", "success");
            // Reset modal tabs back to login
            tabLogin.click();
            document.getElementById("login-email").value = email;
            document.getElementById("login-password").value = pass;
            document.getElementById("login-role").value = role;
        });
    }

    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const subject = document.getElementById("contact-subject").value.trim();
            const message = document.getElementById("contact-message").value.trim();
            const date = new Date().toISOString().split('T')[0];

            const feedbacks = JSON.parse(localStorage.getItem("compass_feedback")) || [];
            feedbacks.push({ name, email, subject, message, date });
            localStorage.setItem("compass_feedback", JSON.stringify(feedbacks));

            showToast(`Thank you, ${name}! Your message was sent to our advisors.`, "success");
            contactForm.reset();
        });
    }

    // Career Explorer search and filter logic
    const searchInput = document.getElementById("search-career-input");
    const filterSelect = document.getElementById("filter-career-select");
    const careersContainer = document.getElementById("landing-careers-container");

    if (careersContainer) {
        function renderExplorerList() {
            const careers = JSON.parse(localStorage.getItem("compass_careers")) || defaultCareers;
            const searchVal = searchInput ? searchInput.value.toLowerCase() : "";
            const filterVal = filterSelect ? filterSelect.value : "all";

            careersContainer.innerHTML = "";

            const filtered = careers.filter(c => {
                const matchesSearch = c.name.toLowerCase().includes(searchVal) || c.skills.some(s => s.toLowerCase().includes(searchVal));
                const matchesFilter = filterVal === "all" || c.category === filterVal;
                return matchesSearch && matchesFilter;
            });

            if (filtered.length === 0) {
                careersContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 1rem;">No matching careers found.</div>`;
                return;
            }

            filtered.forEach(c => {
                const item = document.createElement("div");
                item.style.backgroundColor = "var(--bg-tertiary)";
                item.style.border = "1px solid var(--border)";
                item.style.borderRadius = "var(--radius-md)";
                item.style.padding = "0.75rem 1rem";
                item.style.display = "flex";
                item.style.justifyContent = "between";
                item.style.alignItems = "center";
                item.style.gap = "1rem";
                
                let iconClass = "fa-laptop-code";
                if (c.category === "design") iconClass = "fa-palette";
                else if (c.category === "data") iconClass = "fa-chart-pie";
                else if (c.category === "security") iconClass = "fa-shield-halved";

                item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fa-solid ${iconClass}" style="color: var(--primary); font-size: 1.1rem; width: 1.5rem;"></i>
                        <div>
                            <strong style="font-size: 0.95rem; display: block; color: var(--text-primary);">${c.name}</strong>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${c.salary}</span>
                        </div>
                    </div>
                    <span style="background-color: var(--primary-light); color: var(--primary); font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-weight: 700; text-transform: uppercase; margin-left: auto;">
                        ${c.category}
                    </span>
                `;
                careersContainer.appendChild(item);
            });
        }

        if (searchInput) searchInput.addEventListener("input", renderExplorerList);
        if (filterSelect) filterSelect.addEventListener("change", renderExplorerList);

        // Initial render on explore tab
        renderExplorerList();
    }

    // Mini Quiz Controller
    const miniQuizContainer = document.getElementById("quiz-question-container");
    if (miniQuizContainer) {
        let currentQuestionIdx = 0;
        let answers = [];

        const quizQuestions = [
            {
                text: "1. What sounds most interesting to you?",
                options: [
                    { text: "Writing code and building functional applications", points: "development" },
                    { text: "Analyzing numbers, finding trends, and designing reports", points: "data" },
                    { text: "Designing layouts, visual aesthetics, and interfaces", points: "design" },
                    { text: "Securing systems, network firewalls, and defense coding", points: "security" }
                ]
            },
            {
                text: "2. If you were working on a website project, you would prefer:",
                options: [
                    { text: "Developing backend routes or styling pages", points: "development" },
                    { text: "Extracting analytics of who visits and why", points: "data" },
                    { text: "Drawing wireframes and designing user flows", points: "design" },
                    { text: "Making sure hackers can't intercept forms", points: "security" }
                ]
            },
            {
                text: "3. Choose your preferred study subject:",
                options: [
                    { text: "Object-Oriented Programming & Frameworks", points: "development" },
                    { text: "Data Analytics, SQL & Databases", points: "data" },
                    { text: "User Experience Design & Prototyping", points: "design" },
                    { text: "Network Cryptography & Incident Auditing", points: "security" }
                ]
            }
        ];

        function renderQuestion() {
            if (currentQuestionIdx < quizQuestions.length) {
                const q = quizQuestions[currentQuestionIdx];
                miniQuizContainer.innerHTML = `
                    <div style="margin-top: 1rem;">
                        <h4 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-primary);">${q.text}</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${q.options.map((opt, i) => `
                                <button type="button" class="btn btn-secondary" onclick="handleQuizAnswer('${opt.points}')" style="text-align: left; justify-content: flex-start; padding: 0.65rem 1rem; font-size: 0.85rem; font-weight: 500;">
                                    ${opt.text}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                // Calculate dominant category
                const counts = {};
                answers.forEach(cat => { counts[cat] = (counts[cat] || 0) + 1; });
                
                let matchedCategory = "development"; // fallback
                let maxCount = 0;
                for (const cat in counts) {
                    if (counts[cat] > maxCount) {
                        maxCount = counts[cat];
                        matchedCategory = cat;
                    }
                }

                const displayNames = {
                    development: "Software / Web Development",
                    data: "Data Analytics & Science",
                    design: "UI/UX & Interactive Design",
                    security: "Information Security & Cybersecurity"
                };

                miniQuizContainer.innerHTML = `
                    <div style="text-align: center; padding: 1.5rem 0;">
                        <div style="width: 3.5rem; height: 3.5rem; background-color: var(--accent-light); color: var(--accent); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1rem;">
                            <i class="fa-solid fa-square-poll-vertical"></i>
                        </div>
                        <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">Quiz Complete!</h4>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
                            Your best fit field: <strong style="color: var(--accent);">${displayNames[matchedCategory]}</strong>
                        </p>
                        <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button type="button" class="btn btn-primary btn-sm" onclick="restartMiniQuiz()">
                                Retake Quiz
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="applyQuizFilter('${matchedCategory}')">
                                Show Careers
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        window.handleQuizAnswer = (points) => {
            answers.push(points);
            currentQuestionIdx++;
            renderQuestion();
        };

        window.restartMiniQuiz = () => {
            currentQuestionIdx = 0;
            answers = [];
            renderQuestion();
        };

        window.applyQuizFilter = (category) => {
            const filterDropdown = document.getElementById("filter-career-select");
            if (filterDropdown) {
                filterDropdown.value = category;
                // Trigger change event to redraw
                const event = new Event('change');
                filterDropdown.dispatchEvent(event);
            }
        };

        // Render first question
        renderQuestion();
    }
});
