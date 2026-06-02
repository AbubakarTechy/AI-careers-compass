/* 
================================================================
Career Compass AI - Student Dashboard Script
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
    if (!session || session.role !== "student") {
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

    // 2. Load Student Profile
    const email = session.email;
    const allProfiles = JSON.parse(localStorage.getItem("compass_student_profiles")) || {};
    let studentProfile = allProfiles[email] || {
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

    // Keep arrays clean
    studentProfile.skills = studentProfile.skills || [];
    studentProfile.interests = studentProfile.interests || [];
    studentProfile.subjects = studentProfile.subjects || [];
    studentProfile.savedCareers = studentProfile.savedCareers || [];
    studentProfile.checklist = studentProfile.checklist || [];

    // Populate Fields
    document.getElementById("degree-input").value = studentProfile.degree || "";
    document.getElementById("subject-input").value = studentProfile.subjects.join(", ") || "";
    document.getElementById("goals-input").value = studentProfile.goals || "";

    // Tags Management
    let tempSkills = [...studentProfile.skills];
    let tempInterests = [...studentProfile.interests];

    function renderTags() {
        const skillsContainer = document.getElementById("skills-tags-container");
        const interestsContainer = document.getElementById("interests-tags-container");

        skillsContainer.innerHTML = "";
        tempSkills.forEach(s => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.innerHTML = `${s} <i class="fa-solid fa-xmark" onclick="removeSkillTag('${s}')"></i>`;
            skillsContainer.appendChild(tag);
        });

        interestsContainer.innerHTML = "";
        tempInterests.forEach(i => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.style.backgroundColor = "var(--accent-light)";
            tag.style.color = "var(--accent)";
            tag.innerHTML = `${i} <i class="fa-solid fa-xmark" onclick="removeInterestTag('${i}')"></i>`;
            interestsContainer.appendChild(tag);
        });
    }

    // Global listeners for tag removal
    window.removeSkillTag = (skillName) => {
        tempSkills = tempSkills.filter(s => s !== skillName);
        renderTags();
    };

    window.removeInterestTag = (interestName) => {
        tempInterests = tempInterests.filter(i => i !== interestName);
        renderTags();
    };

    // Add tags handlers
    const addSkillBtn = document.getElementById("add-skill-btn");
    const skillInput = document.getElementById("skill-add-input");
    if (addSkillBtn && skillInput) {
        addSkillBtn.addEventListener("click", () => {
            const val = skillInput.value.trim();
            if (val && !tempSkills.includes(val)) {
                tempSkills.push(val);
                renderTags();
                skillInput.value = "";
            }
        });
    }

    const addInterestBtn = document.getElementById("add-interest-btn");
    const interestInput = document.getElementById("interest-add-input");
    if (addInterestBtn && interestInput) {
        addInterestBtn.addEventListener("click", () => {
            const val = interestInput.value.trim();
            if (val && !tempInterests.includes(val)) {
                tempInterests.push(val);
                renderTags();
                interestInput.value = "";
            }
        });
    }

    // Save Profile Form Submission
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            studentProfile.degree = document.getElementById("degree-input").value.trim();
            studentProfile.goals = document.getElementById("goals-input").value.trim();
            studentProfile.skills = [...tempSkills];
            studentProfile.interests = [...tempInterests];
            
            const subjectsVal = document.getElementById("subject-input").value;
            studentProfile.subjects = subjectsVal ? subjectsVal.split(",").map(s => s.trim()).filter(s => s !== "") : [];

            // Mark "Complete your profile" checklist item
            const setupIdx = studentProfile.checklist.findIndex(c => c.id === "setup" || c.text.toLowerCase().includes("complete your profile"));
            if (setupIdx !== -1) {
                studentProfile.checklist[setupIdx].completed = true;
            }

            // Save to LocalStorage
            allProfiles[email] = studentProfile;
            localStorage.setItem("compass_student_profiles", JSON.stringify(allProfiles));
            
            showToast("Profile details successfully updated!", "success");
            renderChecklist();
            renderResumeTips();
        });
    }

    // 3. Recommendation Engine Simulation
    const generateBtn = document.getElementById("generate-recommendations-btn");
    const spinner = document.getElementById("recommendation-spinner");
    const resultsSection = document.getElementById("recommendations-results");
    const resultsContainer = document.getElementById("recommendations-cards-container");

    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            // First check if user filled profile
            if (!studentProfile.degree) {
                showToast("Please fill and save your Degree Program in the sidebar first!", "warning");
                return;
            }

            // Show Spinner
            spinner.style.display = "block";
            resultsSection.style.display = "none";
            
            setTimeout(() => {
                spinner.style.display = "none";
                
                // Recommendation Logic
                const allCareers = JSON.parse(localStorage.getItem("compass_careers")) || [];
                
                // Simple scoring algorithm based on skills, program major, and subjects
                const scoredCareers = allCareers.map(career => {
                    let score = 0;
                    
                    // Match category against Degree Program
                    const degreeLower = studentProfile.degree.toLowerCase();
                    if (career.category === "development" && (degreeLower.includes("computer science") || degreeLower.includes("software") || degreeLower.includes("web"))) score += 3;
                    if (career.category === "design" && (degreeLower.includes("graphics") || degreeLower.includes("ux") || degreeLower.includes("art") || degreeLower.includes("system"))) score += 2;
                    if (career.category === "data" && (degreeLower.includes("information") || degreeLower.includes("stats") || degreeLower.includes("data") || degreeLower.includes("business"))) score += 3;
                    if (career.category === "security" && (degreeLower.includes("security") || degreeLower.includes("cyber") || degreeLower.includes("network"))) score += 3;

                    // Match skills
                    studentProfile.skills.forEach(s => {
                        if (career.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))) score += 2;
                    });

                    // Match interests
                    studentProfile.interests.forEach(i => {
                        const interestLower = i.toLowerCase();
                        if (career.whyRecommended.toLowerCase().includes(interestLower) || career.name.toLowerCase().includes(interestLower)) score += 2;
                    });

                    // Match subjects
                    studentProfile.subjects.forEach(sub => {
                        const subLower = sub.toLowerCase();
                        if (career.whyRecommended.toLowerCase().includes(subLower) || career.name.toLowerCase().includes(subLower)) score += 2;
                    });

                    return { career, score };
                });

                // Sort by score descending and take top 3
                scoredCareers.sort((a, b) => b.score - a.score);
                const recommendations = scoredCareers.slice(0, 3).map(sc => sc.career.name);

                studentProfile.recommendations = recommendations;
                
                // Mark "Generate AI recommendations" checklist item
                const recIdx = studentProfile.checklist.findIndex(c => c.id === "recommend" || c.text.toLowerCase().includes("generate ai career"));
                if (recIdx !== -1) {
                    studentProfile.checklist[recIdx].completed = true;
                }

                allProfiles[email] = studentProfile;
                localStorage.setItem("compass_student_profiles", JSON.stringify(allProfiles));
                
                renderRecommendations(scoredCareers.slice(0, 3).map(sc => sc.career));
                resultsSection.style.display = "block";
                renderChecklist();
                renderResumeTips();
            }, 1500);
        });
    }

    function renderRecommendations(careers) {
        resultsContainer.innerHTML = "";
        
        careers.forEach(c => {
            const isSaved = studentProfile.savedCareers.includes(c.name);
            const card = document.createElement("div");
            card.className = "dashboard-card rec-card";
            
            // Set border color based on category
            let categoryColor = "var(--primary)";
            if (c.category === "design") categoryColor = "var(--accent)";
            else if (c.category === "data") categoryColor = "#f59e0b";
            else if (c.category === "security") categoryColor = "#10b981";

            card.style.borderLeftColor = categoryColor;

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="font-size: 1.3rem; color: var(--text-primary);">${c.name}</h4>
                        <span style="font-size: 0.8rem; background-color: var(--bg-primary); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); color: var(--text-secondary); text-transform: uppercase;">
                            ${c.category}
                        </span>
                    </div>
                    <button class="btn btn-secondary btn-icon" style="width: 2.2rem; height: 2.2rem;" onclick="toggleSaveCareer('${c.name}')">
                        <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-star" style="color: ${isSaved ? 'var(--warning)' : 'var(--text-muted)'};"></i>
                    </button>
                </div>

                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    <strong>Why Recommended:</strong> ${c.whyRecommended}
                </p>

                <div style="margin-bottom: 1rem;">
                    <strong>Prerequisite Skills:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.25rem;">
                        ${c.skills.map(s => `
                            <span style="font-size: 0.75rem; background-color: var(--bg-tertiary); color: var(--text-primary); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                                ${s}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <strong>Salary Range Estimate:</strong>
                    <span style="font-size: 1rem; color: var(--success); font-weight: 700; margin-left: 0.5rem;">
                        ${c.salary}
                    </span>
                </div>

                <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-bottom: 1rem;">
                    <strong>Step-by-Step Career Roadmap:</strong>
                    <div class="roadmap-timeline">
                        ${c.roadmap.map(step => `
                            <div class="roadmap-node">
                                <span style="font-size: 0.85rem; color: var(--text-primary); font-weight: 500;">${step}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="border-top: 1px dashed var(--border); padding-top: 1rem;">
                    <strong>Free SDG Learning References:</strong>
                    <ul style="list-style: none; margin-top: 0.5rem;">
                        ${c.resources.map(r => `
                            <li style="margin-bottom: 0.35rem; font-size: 0.85rem;">
                                <i class="fa-solid fa-graduation-cap" style="color: var(--primary); margin-right: 0.5rem;"></i>
                                <a href="${r.url}" target="_blank" style="color: var(--primary); text-decoration: underline; font-weight: 500;">
                                    ${r.title}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // Save Career handler
    window.toggleSaveCareer = (careerName) => {
        const idx = studentProfile.savedCareers.indexOf(careerName);
        if (idx !== -1) {
            studentProfile.savedCareers.splice(idx, 1);
        } else {
            studentProfile.savedCareers.push(careerName);
        }

        allProfiles[email] = studentProfile;
        localStorage.setItem("compass_student_profiles", JSON.stringify(allProfiles));
        
        // Redraw results and saved careers block
        const allCareers = JSON.parse(localStorage.getItem("compass_careers")) || [];
        const recommendedCareers = allCareers.filter(c => studentProfile.recommendations.includes(c.name));
        renderRecommendations(recommendedCareers);
        renderSavedCareers();
    };

    function renderSavedCareers() {
        const savedBox = document.getElementById("saved-careers-box");
        const savedList = document.getElementById("saved-careers-list");

        if (studentProfile.savedCareers.length > 0) {
            savedBox.style.display = "block";
            savedList.innerHTML = "";
            studentProfile.savedCareers.forEach(scName => {
                const item = document.createElement("div");
                item.style.backgroundColor = "var(--bg-tertiary)";
                item.style.border = "1px solid var(--border)";
                item.style.borderRadius = "var(--radius-sm)";
                item.style.padding = "0.5rem 0.75rem";
                item.style.fontSize = "0.85rem";
                item.style.display = "flex";
                item.style.justifyContent = "between";
                item.style.alignItems = "center";
                item.innerHTML = `
                    <span style="font-weight:600;"><i class="fa-solid fa-star" style="color:var(--warning); margin-right:0.35rem;"></i> ${scName}</span>
                    <button style="background:none; color:var(--danger); cursor:pointer; font-size: 0.85rem; margin-left:auto;" onclick="toggleSaveCareer('${scName}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
                savedList.appendChild(item);
            });
        } else {
            savedBox.style.display = "none";
        }
    }

    // 4. Checklist / Progress Tracker
    const addGoalBtn = document.getElementById("add-goal-btn");
    const newItemInput = document.getElementById("new-item-input");
    const checklistContainer = document.getElementById("checklist-items-container");

    function renderChecklist() {
        checklistContainer.innerHTML = "";
        let completedCount = 0;

        if (studentProfile.checklist.length === 0) {
            checklistContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">No checklist items setup.</p>`;
            updateProgressMetrics(0);
            return;
        }

        studentProfile.checklist.forEach(item => {
            if (item.completed) completedCount++;

            const div = document.createElement("div");
            div.className = `checklist-item ${item.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <input type="checkbox" id="check-${item.id}" ${item.completed ? 'checked' : ''} onclick="toggleChecklistItem('${item.id}')" style="cursor: pointer; width: 1.1rem; height: 1.1rem;">
                <label for="check-${item.id}" style="cursor: pointer; font-size: 0.85rem; flex: 1;">${item.text}</label>
                <button style="background:none; color:var(--text-muted); cursor:pointer;" onclick="deleteChecklistItem('${item.id}')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            checklistContainer.appendChild(div);
        });

        const percent = Math.round((completedCount / studentProfile.checklist.length) * 100);
        updateProgressMetrics(percent);
    }

    function updateProgressMetrics(percent) {
        studentProfile.progress = percent;
        allProfiles[email] = studentProfile;
        localStorage.setItem("compass_student_profiles", JSON.stringify(allProfiles));

        document.getElementById("progress-percent").textContent = `${percent}%`;
        document.getElementById("progress-bar-fill").style.width = `${percent}%`;
    }

    window.toggleChecklistItem = (itemId) => {
        const item = studentProfile.checklist.find(c => c.id === itemId);
        if (item) {
            item.completed = !item.completed;
            renderChecklist();
        }
    };

    window.deleteChecklistItem = (itemId) => {
        studentProfile.checklist = studentProfile.checklist.filter(c => c.id !== itemId);
        renderChecklist();
    };

    if (addGoalBtn && newItemInput) {
        addGoalBtn.addEventListener("click", () => {
            const text = newItemInput.value.trim();
            if (text) {
                const id = "goal-" + Date.now();
                studentProfile.checklist.push({ id, text, completed: false });
                newItemInput.value = "";
                renderChecklist();
            }
        });
    }

    // 5. Resume Tips Generator
    const resumeContainer = document.getElementById("resume-tips-content");

    function renderResumeTips() {
        if (!studentProfile.degree) {
            resumeContainer.innerHTML = `<p>Add your degree details in the sidebar to load specific resume tips.</p>`;
            return;
        }

        let tipsHtml = `
            <ul style="padding-left: 1.2rem; margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <li><strong>Formatting:</strong> Keep your resume to exactly 1 page and use a modern, clean, single-column layout.</li>
                <li><strong>Degree Optimization:</strong> Highlight your program (<strong>${studentProfile.degree}</strong>) at the top, along with relevant coursework.</li>
        `;

        if (studentProfile.skills.length > 0) {
            tipsHtml += `<li><strong>Technical Section:</strong> List your main skills (<em>${studentProfile.skills.slice(0, 4).join(', ')}</em>) clearly. Categorize them into Languages, Libraries, and Tools.</li>`;
        } else {
            tipsHtml += `<li style="color: var(--warning);"><strong>Warning:</strong> You haven't added any skills to your profile. Recruiters look for concrete technology tags. Update your sidebar profile!</li>`;
        }

        if (studentProfile.recommendations && studentProfile.recommendations.length > 0) {
            const targetCareer = studentProfile.recommendations[0];
            tipsHtml += `<li><strong>Tailoring for ${targetCareer}:</strong> Make sure your projects reflect tools mentioned in the roadmap for ${targetCareer}. Emphasize accomplishments rather than just tasks performed.</li>`;
        }

        tipsHtml += `
                <li><strong>Contact details:</strong> Ensure your GitHub, LinkedIn, and email address are professional and clickable.</li>
            </ul>
        `;

        resumeContainer.innerHTML = tipsHtml;
    }

    // 6. AI Chatbot Widget (Simulated)
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const chatMessages = document.getElementById("chat-messages");

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener("click", handleChatSend);
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleChatSend();
        });
    }

    function handleChatSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Render User Message
        appendMessage(text, "user");
        chatInput.value = "";

        // Generate Bot Response
        setTimeout(() => {
            const response = getBotResponse(text);
            appendMessage(response, "bot");
        }, 600);
    }

    function appendMessage(text, sender) {
        const div = document.createElement("div");
        div.className = `chat-msg ${sender}`;
        div.innerHTML = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(query) {
        const q = query.toLowerCase();
        
        if (q.includes("salary") || q.includes("money") || q.includes("pay")) {
            return `Based on current market trends:<br>
            • Software Engineer: <strong>$85k - $140k</strong><br>
            • Cyber Specialist: <strong>$80k - $130k</strong><br>
            • Web Developer: <strong>$70k - $110k</strong><br>
            • UI/UX Designer: <strong>$65k - $105k</strong><br>
            • Data Analyst: <strong>$60k - $95k</strong>`;
        }
        
        if (q.includes("web") || q.includes("developer") || q.includes("javascript") || q.includes("html")) {
            return `Web Developers design, build, and deploy websites. You should learn: <strong>HTML/CSS, JavaScript, React, and Node.js</strong>. Start with freeCodeCamp for practical exercises.`;
        }

        if (q.includes("figma") || q.includes("design") || q.includes("ux") || q.includes("ui")) {
            return `UI/UX Designers focus on user satisfaction. Master tools like <strong>Figma</strong>, understand user research flows, and practice wireframing. The Google UX course is a great launchpad.`;
        }

        if (q.includes("data") || q.includes("sql") || q.includes("analyst") || q.includes("statistics")) {
            return `Data Analysts extract insights. You'll need to master <strong>SQL databases, Excel, Tableau or Power BI, and Python Pandas</strong>. Kaggle Courses offer a great starting path.`;
        }

        if (q.includes("cyber") || q.includes("security") || q.includes("hack") || q.includes("linux")) {
            return `Cybersecurity is in massive demand. Focus on <strong>Networking basics, Linux Shell scripting, and the Security+ certificate</strong>. Check out TryHackMe to practice.`;
        }

        if (q.includes("soft") || q.includes("engineer") || q.includes("algorithms") || q.includes("java")) {
            return `Software Engineers build scalable backend architectures. Study <strong>Data Structures, Algorithms (LeetCode), Object-Oriented design, and Git</strong>. CS50 is highly recommended.`;
        }

        if (q.includes("sdg") || q.includes("goal 4")) {
            return `Career Compass AI supports <strong>UN SDG 4 (Quality Education)</strong> by offering students free access to structured learning pathways and bridges local curricula with industrial market demands.`;
        }

        return `I can help you with learning requirements, salaries, and roadmaps for <strong>Software Engineering, Web Development, UI/UX Design, Data Analytics</strong>, and <strong>Cybersecurity</strong>. Try asking about salaries or a specific career!`;
    }

    // Initial Dashboard Rendering Tasks
    renderTags();
    renderChecklist();
    renderSavedCareers();
    renderResumeTips();

    // If profile already has recommendations, render them right away
    if (studentProfile.recommendations && studentProfile.recommendations.length > 0) {
        const allCareers = JSON.parse(localStorage.getItem("compass_careers")) || [];
        const recommendedCareers = allCareers.filter(c => studentProfile.recommendations.includes(c.name));
        renderRecommendations(recommendedCareers);
        resultsSection.style.display = "block";
    }
});
