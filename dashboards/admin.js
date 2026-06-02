/* 
================================================================
Career Compass AI - Admin Dashboard Script
================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Session Verification
    const session = JSON.parse(localStorage.getItem("compass_session"));
    if (!session || session.role !== "admin") {
        alert("Unauthorized access. Redirecting to landing page.");
        window.location.href = "../index.html";
        return;
    }

    // Set Name in Navbar
    const navName = document.getElementById("nav-user-name");
    if (navName) {
        navName.textContent = session.name;
        navName.style.display = "inline";
    }

    // Logout Handler
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("compass_session");
            window.location.href = "../index.html";
        });
    }

    // Theme (Dark / Light) Setup
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        updateThemeToggleIcon(true);
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateThemeToggleIcon(isDark);
        });
    }
    function updateThemeToggleIcon(isDark) {
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector("i");
            if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    // 2. Load Core Data and Render Elements
    function loadDashboardData() {
        const users = JSON.parse(localStorage.getItem("compass_users")) || [];
        const careers = JSON.parse(localStorage.getItem("compass_careers")) || [];
        const feedback = JSON.parse(localStorage.getItem("compass_feedback")) || [];

        // Update Analytics Cards
        document.getElementById("stat-total-users").textContent = users.length;
        document.getElementById("stat-total-careers").textContent = careers.length;
        document.getElementById("stat-total-feedback").textContent = feedback.length;

        renderUsersTable(users);
        renderCareersTable(careers);
        renderFeedbackList(feedback);
    }

    // 3. User Management
    function renderUsersTable(users) {
        const tbody = document.getElementById("users-table-body");
        tbody.innerHTML = "";

        users.forEach(u => {
            const tr = document.createElement("tr");
            let badgeClass = "badge-student";
            if (u.role === "counselor") badgeClass = "badge-counselor";
            else if (u.role === "admin") badgeClass = "badge-admin";

            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${u.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${u.email}</div>
                </td>
                <td>
                    <span class="badge ${badgeClass}">${u.role}</span>
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="deleteUser('${u.email}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--danger);" ${u.email === session.email ? 'disabled title="You cannot delete yourself!"' : ''}>
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Add User
    const addUserForm = document.getElementById("add-user-form");
    if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("add-user-name").value.trim();
            const email = document.getElementById("add-user-email").value.trim().toLowerCase();
            const pass = document.getElementById("add-user-pass").value;
            const role = document.getElementById("add-user-role").value;

            const users = JSON.parse(localStorage.getItem("compass_users")) || [];
            if (users.find(u => u.email === email)) {
                alert("Account with this email already exists!");
                return;
            }

            users.push({ email, password: pass, name, role });
            localStorage.setItem("compass_users", JSON.stringify(users));

            // Initialize student profile if student
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
                        { id: "recommend", text: "Generate AI Career recommendations", completed: false }
                    ]
                };
                localStorage.setItem("compass_student_profiles", JSON.stringify(profiles));
            }

            addUserForm.reset();
            loadDashboardData();
            alert("New user created successfully!");
        });
    }

    window.deleteUser = (emailToDelete) => {
        if (emailToDelete === session.email) {
            alert("Security warning: You cannot delete your currently active session.");
            return;
        }

        if (confirm(`Are you sure you want to delete user ${emailToDelete}?`)) {
            let users = JSON.parse(localStorage.getItem("compass_users")) || [];
            users = users.filter(u => u.email !== emailToDelete);
            localStorage.setItem("compass_users", JSON.stringify(users));

            // Also remove profile if student
            let profiles = JSON.parse(localStorage.getItem("compass_student_profiles")) || {};
            if (profiles[emailToDelete]) {
                delete profiles[emailToDelete];
                localStorage.setItem("compass_student_profiles", JSON.stringify(profiles));
            }

            loadDashboardData();
        }
    };

    // 4. Career Directory Management
    function renderCareersTable(careers) {
        const tbody = document.getElementById("careers-table-body");
        tbody.innerHTML = "";

        careers.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${c.salary}</div>
                </td>
                <td>
                    <span style="font-weight: 500; font-size: 0.8rem; text-transform: uppercase;">${c.category}</span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.25rem;">
                        <button class="btn btn-secondary" onclick="editCareer('${c.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-secondary" onclick="deleteCareer('${c.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--danger);">
                            <i class="fa-solid fa-trash-can"></i> Del
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Submit Add/Edit career form
    const careerForm = document.getElementById("add-career-form");
    const careerFormTitle = document.getElementById("career-form-title");
    const cancelCareerEditBtn = document.getElementById("cancel-career-edit-btn");

    if (careerForm) {
        careerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const editId = document.getElementById("edit-career-id").value;
            const name = document.getElementById("career-name").value.trim();
            const category = document.getElementById("career-category").value;
            const rationale = document.getElementById("career-rationale").value.trim();
            const salary = document.getElementById("career-salary").value.trim();
            
            const skillsVal = document.getElementById("career-skills").value;
            const skills = skillsVal ? skillsVal.split(",").map(s => s.trim()).filter(s => s !== "") : [];

            const roadmapVal = document.getElementById("career-roadmap").value;
            const roadmap = roadmapVal ? roadmapVal.split(",").map(r => r.trim()).filter(r => r !== "") : [];

            const careers = JSON.parse(localStorage.getItem("compass_careers")) || [];

            if (editId) {
                // Edit mode
                const index = careers.findIndex(c => c.id === editId);
                if (index !== -1) {
                    careers[index].name = name;
                    careers[index].category = category;
                    careers[index].whyRecommended = rationale;
                    careers[index].salary = salary;
                    careers[index].skills = skills;
                    careers[index].roadmap = roadmap;
                }
            } else {
                // Add mode
                const id = "car-" + Date.now();
                const newCareer = {
                    id, name, category, salary,
                    whyRecommended: rationale,
                    skills, roadmap,
                    resources: [
                        { title: "Google Free E-learning Search", url: "https://www.google.com" },
                        { title: "Coursera Free Courses Guide", url: "https://www.coursera.org" }
                    ]
                };
                careers.push(newCareer);
            }

            localStorage.setItem("compass_careers", JSON.stringify(careers));
            resetCareerForm();
            loadDashboardData();
            alert("Career profile updated successfully!");
        });
    }

    window.editCareer = (id) => {
        const careers = JSON.parse(localStorage.getItem("compass_careers")) || [];
        const career = careers.find(c => c.id === id);
        if (!career) return;

        // Change Form State
        document.getElementById("edit-career-id").value = career.id;
        document.getElementById("career-name").value = career.name;
        document.getElementById("career-category").value = career.category;
        document.getElementById("career-rationale").value = career.whyRecommended;
        document.getElementById("career-salary").value = career.salary;
        document.getElementById("career-skills").value = career.skills.join(", ");
        document.getElementById("career-roadmap").value = career.roadmap.join(", ");

        careerFormTitle.textContent = `Edit Career Path: ${career.name}`;
        cancelCareerEditBtn.style.display = "inline-block";
        document.getElementById("submit-career-btn").textContent = "Save Changes";
    };

    if (cancelCareerEditBtn) {
        cancelCareerEditBtn.addEventListener("click", resetCareerForm);
    }

    function resetCareerForm() {
        document.getElementById("edit-career-id").value = "";
        careerForm.reset();
        careerFormTitle.textContent = "Add New Career Recommendation Profile";
        cancelCareerEditBtn.style.display = "none";
        document.getElementById("submit-career-btn").textContent = "Save Career";
    }

    window.deleteCareer = (idToDelete) => {
        if (confirm("Are you sure you want to delete this career category? All recommendations and statistics matching this path will be updated.")) {
            let careers = JSON.parse(localStorage.getItem("compass_careers")) || [];
            careers = careers.filter(c => c.id !== idToDelete);
            localStorage.setItem("compass_careers", JSON.stringify(careers));
            loadDashboardData();
        }
    };

    // 5. User Feedback inbox
    function renderFeedbackList(feedback) {
        const container = document.getElementById("feedback-inbox-container");
        container.innerHTML = "";

        if (feedback.length === 0) {
            container.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">No feedback submissions in inbox.</div>`;
            return;
        }

        feedback.forEach((feed, index) => {
            const div = document.createElement("div");
            div.className = "feedback-item fade-in";
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div>
                        <h4 style="font-size: 1.05rem; color: var(--text-primary);">${feed.subject}</h4>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">From: <strong>${feed.name}</strong> (${feed.email})</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${feed.date}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.4; white-space: pre-line;">
                    ${feed.message}
                </p>
                <div style="display: flex; justify-content: flex-end;">
                    <button class="btn btn-secondary btn-sm" onclick="deleteFeedback(${index})" style="color: var(--danger); padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                        <i class="fa-solid fa-trash-can"></i> Dismiss Message
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    window.deleteFeedback = (index) => {
        const feedback = JSON.parse(localStorage.getItem("compass_feedback")) || [];
        feedback.splice(index, 1);
        localStorage.setItem("compass_feedback", JSON.stringify(feedback));
        loadDashboardData();
    };

    // Load initial data
    loadDashboardData();
});
