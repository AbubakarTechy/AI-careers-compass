/* 
================================================================
Career Compass AI - Counselor Dashboard Script
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

document.addEventListener("DOMContentLoaded", () => {
    // 1. Session Verification
    const session = JSON.parse(localStorage.getItem("compass_session"));
    if (!session || session.role !== "counselor") {
        showToast("Unauthorized access. Redirecting to landing page...", "error");
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1500);
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

    // Announcements Seed Data
    const defaultAnnouncements = [
        { id: "ann-1", title: "Global Dev Summit", details: "Free student passes available. Register at counselor desk before June 15." },
        { id: "ann-2", title: "Mock Interview Sessions", details: "Sign up via Google Form for technical mock screens with industry experts next Wednesday." }
    ];

    if (!localStorage.getItem("compass_announcements")) {
        localStorage.setItem("compass_announcements", JSON.stringify(defaultAnnouncements));
    }

    // Main logic components
    let studentAccounts = [];
    let careerCounts = {};

    function loadStatsAndTable() {
        const users = JSON.parse(localStorage.getItem("compass_users")) || [];
        const studentProfiles = JSON.parse(localStorage.getItem("compass_student_profiles")) || {};
        
        // Filter student accounts
        studentAccounts = users.filter(u => u.role === "student").map(u => {
            const profile = studentProfiles[u.email] || {
                degree: "Not specified",
                skills: [],
                recommendations: [],
                progress: 0,
                checklist: []
            };
            return {
                email: u.email,
                name: u.name,
                degree: profile.degree || "Not specified",
                skills: profile.skills || [],
                recommendations: profile.recommendations || [],
                progress: profile.progress || 0,
                checklist: profile.checklist || []
            };
        });

        // 1. Calculate Stats
        const totalStudents = studentAccounts.length;
        document.getElementById("stat-total-students").textContent = totalStudents;

        let totalProgress = 0;
        careerCounts = {};

        studentAccounts.forEach(s => {
            totalProgress += s.progress;
            
            // Count career interests from recommendations
            if (s.recommendations && s.recommendations.length > 0) {
                const primaryCareer = s.recommendations[0];
                careerCounts[primaryCareer] = (careerCounts[primaryCareer] || 0) + 1;
            }
        });

        const avgProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0;
        document.getElementById("stat-avg-progress").textContent = `${avgProgress}%`;

        // Calculate top career path
        let topCareer = "None";
        let maxCount = 0;
        for (const name in careerCounts) {
            if (careerCounts[name] > maxCount) {
                maxCount = careerCounts[name];
                topCareer = name;
            }
        }
        document.getElementById("stat-top-career").textContent = topCareer;

        // 2. Render student rows in table
        const tbody = document.getElementById("students-table-body");
        tbody.innerHTML = "";

        if (studentAccounts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No student accounts found.</td></tr>`;
            return;
        }

        studentAccounts.forEach(s => {
            const tr = document.createElement("tr");
            const topFit = s.recommendations.length > 0 ? s.recommendations[0] : "Not generated yet";
            
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${s.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${s.email}</div>
                </td>
                <td>${s.degree}</td>
                <td>
                    <span style="font-weight: 500; color: var(--primary);">${topFit}</span>
                </td>
                <td>
                    <div class="progress-bar-container">
                        <div style="width: ${s.progress}%; height: 100%; background-color: var(--success);"></div>
                    </div>
                    <span style="font-weight: 700; font-size: 0.8rem; color: var(--text-secondary);">${s.progress}%</span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="viewStudentDetails('${s.email}')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;">
                            <i class="fa-solid fa-eye"></i> Details
                        </button>
                        <button class="btn btn-primary" onclick="downloadStudentReport('${s.email}')" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;">
                            <i class="fa-solid fa-file-arrow-down"></i> Report
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Initialize/update chart
        renderChart();
    }

    // Modal Control for Details
    const detailModal = document.getElementById("student-detail-modal");
    const closeDetailBtn = document.getElementById("close-detail-modal-btn");

    if (closeDetailBtn) {
        closeDetailBtn.addEventListener("click", () => {
            detailModal.classList.remove("active");
        });
    }

    window.viewStudentDetails = (studentEmail) => {
        const student = studentAccounts.find(s => s.email === studentEmail);
        if (!student) return;

        const body = document.getElementById("modal-detail-body");
        
        let skillsHtml = student.skills.length > 0 
            ? student.skills.map(sk => `<span class="tag" style="background-color: var(--primary-light); color: var(--primary); margin-right: 0.25rem; font-size: 0.75rem;">${sk}</span>`).join('')
            : '<span style="color:var(--text-muted); font-style:italic;">None entered</span>';

        let recommendationsHtml = student.recommendations.length > 0 
            ? student.recommendations.map((rec, i) => `<li><strong>Fit #${i+1}:</strong> ${rec}</li>`).join('')
            : '<li>No recommendations generated yet.</li>';

        let checklistHtml = student.checklist.length > 0
            ? student.checklist.map(item => `
                <div style="margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem;">
                    <i class="fa-solid ${item.completed ? 'fa-square-check' : 'fa-square'}" style="color: ${item.completed ? 'var(--success)' : 'var(--text-muted)'};"></i>
                    <span style="${item.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${item.text}</span>
                </div>
            `).join('')
            : '<div style="color:var(--text-muted); font-style:italic;">No milestones configured.</div>';

        body.innerHTML = `
            <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
                <i class="fa-solid fa-graduation-cap" style="color: var(--primary);"></i> ${student.name} Academic Audit
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
                <div>
                    <h4 style="margin-bottom: 0.25rem;">Academic Details</h4>
                    <p style="font-size: 0.9rem; margin-bottom: 0.75rem;"><strong>Email:</strong> ${student.email}</p>
                    <p style="font-size: 0.9rem; margin-bottom: 0.75rem;"><strong>Program:</strong> ${student.degree}</p>
                    
                    <h4 style="margin-top: 1rem; margin-bottom: 0.25rem;">Skills & Toolkits</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                        ${skillsHtml}
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom: 0.25rem;">AI Recommendation Profile</h4>
                    <ul style="padding-left: 1.2rem; font-size: 0.9rem; margin-bottom: 1rem;">
                        ${recommendationsHtml}
                    </ul>
                    
                    <h4 style="margin-bottom: 0.25rem;">Checklist & Milestones (${student.progress}% Done)</h4>
                    <div>
                        ${checklistHtml}
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 2rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="document.getElementById('student-detail-modal').classList.remove('active')">
                    Close
                </button>
                <button class="btn btn-primary" onclick="downloadStudentReport('${student.email}')">
                    <i class="fa-solid fa-download"></i> Print Full Report
                </button>
            </div>
        `;
        detailModal.classList.add("active");
    };

    // Download Single Student Report as text
    window.downloadStudentReport = (studentEmail) => {
        const student = studentAccounts.find(s => s.email === studentEmail);
        if (!student) return;

        const dateString = new Date().toLocaleDateString();
        
        let reportText = `========================================================\n`;
        reportText += `CAREER COMPASS AI - STUDENT PROFILE & COUNSELING AUDIT\n`;
        reportText += `Generated on: ${dateString}\n`;
        reportText += `========================================================\n\n`;
        reportText += `Student Name:     ${student.name}\n`;
        reportText += `Student Email:    ${student.email}\n`;
        reportText += `Degree Program:   ${student.degree}\n`;
        reportText += `Preparation Rate: ${student.progress}%\n\n`;
        
        reportText += `--------------------------------------------------------\n`;
        reportText += `Acquired Skills:\n`;
        reportText += `--------------------------------------------------------\n`;
        if (student.skills.length > 0) {
            student.skills.forEach(s => { reportText += `* ${s}\n`; });
        } else {
            reportText += `No skills specified.\n`;
        }
        
        reportText += `\n--------------------------------------------------------\n`;
        reportText += `AI Recommended Careers:\n`;
        reportText += `--------------------------------------------------------\n`;
        if (student.recommendations.length > 0) {
            student.recommendations.forEach((rec, i) => { reportText += `${i+1}. ${rec}\n`; });
        } else {
            reportText += `No recommendations computed.\n`;
        }
        
        reportText += `\n--------------------------------------------------------\n`;
        reportText += `Checklist Goals Progress:\n`;
        reportText += `--------------------------------------------------------\n`;
        if (student.checklist.length > 0) {
            student.checklist.forEach(item => {
                reportText += `[${item.completed ? 'X' : ' '}] ${item.text}\n`;
            });
        } else {
            reportText += `No custom checklist items found.\n`;
        }
        
        reportText += `\n========================================================\n`;
        reportText += `Career Compass AI supports SDG 4 & Vision 2030 initiatives.\n`;
        reportText += `========================================================\n`;

        downloadFile(`${student.name.replace(/\s+/g, '_')}_Career_Report.txt`, reportText);
    };

    // Download Aggregated CSV of all Students
    const downloadAllBtn = document.getElementById("download-all-report-btn");
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener("click", () => {
            if (studentAccounts.length === 0) {
                alert("No students to export.");
                return;
            }

            let csvContent = "Name,Email,Degree Program,Primary Recommended Career,Prep Progress (%)\n";
            studentAccounts.forEach(s => {
                const primaryCareer = s.recommendations.length > 0 ? s.recommendations[0] : "None";
                csvContent += `"${s.name}","${s.email}","${s.degree}","${primaryCareer}",${s.progress}\n`;
            });

            downloadFile("Aggregate_Student_Career_Metrics.csv", csvContent);
        });
    }

    // Helper file downloader
    function downloadFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // 3. Render Chart.js
    let myChartInstance = null;

    function renderChart() {
        const ctx = document.getElementById('careerChart');
        if (!ctx) return;

        // Destroy previous instance if it exists
        if (myChartInstance) {
            myChartInstance.destroy();
        }

        const labels = Object.keys(careerCounts);
        const data = Object.values(careerCounts);

        if (labels.length === 0) {
            // Draw dummy chart if no careers calculated
            labels.push("No matches computed");
            data.push(1);
        }

        const isDark = document.body.classList.contains("dark-theme");
        const textColor = isDark ? "#ffffff" : "#0f172a";

        myChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Students Match',
                    data: data,
                    backgroundColor: [
                        '#2563eb', // Blue
                        '#0d9488', // Teal
                        '#f59e0b', // Amber
                        '#10b981', // Emerald
                        '#ef4444'  // Red
                    ],
                    borderWidth: 1,
                    borderColor: isDark ? '#111827' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: {
                                family: 'Inter',
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    // 4. Manage Announcements/Recommendations noticeboard
    const announcementForm = document.getElementById("post-announcement-form");
    const announceContainer = document.getElementById("announcements-container");

    function renderAnnouncements() {
        const list = JSON.parse(localStorage.getItem("compass_announcements")) || [];
        announceContainer.innerHTML = "";

        if (list.length === 0) {
            announceContainer.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No training announcements found. Add one below!</div>`;
            return;
        }

        list.forEach(ann => {
            const item = document.createElement("div");
            item.className = "training-item";
            item.innerHTML = `
                <strong style="font-size: 0.9rem; color: var(--text-primary); display:block; margin-bottom:0.25rem;">${ann.title}</strong>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${ann.details}</p>
                <button class="training-delete-btn" onclick="deleteAnnouncement('${ann.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            announceContainer.appendChild(item);
        });
    }

    if (announcementForm) {
        announcementForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("announce-title").value.trim();
            const details = document.getElementById("announce-text").value.trim();

            const list = JSON.parse(localStorage.getItem("compass_announcements")) || [];
            const id = "ann-" + Date.now();
            list.push({ id, title, details });
            localStorage.setItem("compass_announcements", JSON.stringify(list));

            document.getElementById("announce-title").value = "";
            document.getElementById("announce-text").value = "";
            renderAnnouncements();
        });
    }

    window.deleteAnnouncement = (id) => {
        let list = JSON.parse(localStorage.getItem("compass_announcements")) || [];
        list = list.filter(ann => ann.id !== id);
        localStorage.setItem("compass_announcements", JSON.stringify(list));
        renderAnnouncements();
    };

    // Load everything on startup
    loadStatsAndTable();
    renderAnnouncements();
});
