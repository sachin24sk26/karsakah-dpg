/**
 * KARSAKAH - Track 4 Implementation & Progress Tracker
 * Handles priority-based task tracking, progress calculation, filters, 
 * persistence via localStorage, and the interactive BRICS API / Architecture simulator.
 */

// Initial Task Dataset with Priority Weights (Easy + Important = P0)
const DEFAULT_TASKS = [
    // P0: Easy to Implement + High Importance (Quick Wins & Security Foundation)
    {
        id: "task-1-1",
        phase: 1,
        title: "1.1 Remove Sensitive Files & Secrets",
        desc: "Delete users.json & messages.json from repo, add to .gitignore, purge history, and rotate API keys.",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "Critical",
        ease: "High",
        timeEst: "30 mins",
        assignee: "Harshit",
        deliverable: "Clean Repo & Security Guardrails",
        sprint72: true,
        completed: true
    },
    {
        id: "task-1-4",
        phase: 1,
        title: "1.4 Open License & DPG Compliance",
        desc: "Add Apache-2.0 LICENSE file, CONTRIBUTING.md, and CODE_OF_CONDUCT.md for Digital Public Good recognition.",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "High",
        ease: "High",
        timeEst: "30 mins",
        assignee: "Sachin",
        deliverable: "DPG-ready Repository Files",
        sprint72: true,
        completed: true
    },
    {
        id: "task-1-3",
        phase: 1,
        title: "1.3 Update & Modernize README",
        desc: "Fix repo URLs, language list, and frame Track 4 architecture clearly with problem statement.",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "High",
        ease: "High",
        timeEst: "45 mins",
        assignee: "Sachin",
        deliverable: "Professional README.md",
        sprint72: true,
        completed: true
    },
    {
        id: "task-5-1",
        phase: 5,
        title: "5.1 Config-driven Multi-Country Profiles",
        desc: "Create JSON profiles (/country_profiles/IN.json, BR.json, ZA.json) with local crops, units, seasons, and languages.",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "High",
        ease: "High",
        timeEst: "1-2 hours",
        assignee: "Harshit",
        deliverable: "Country Profiles Loader",
        sprint72: true,
        completed: true
    },
    {
        id: "task-6-1",
        phase: 6,
        title: "6.1 Web Speech API Voice Readout",
        desc: "Implement one-click 'Listen' TTS for recommendations in Punjabi, Hindi, English, and Portuguese.",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "High",
        ease: "High",
        timeEst: "1.5 hours",
        assignee: "Sachin",
        deliverable: "Audio Accessibility for Smallholders",
        sprint72: true,
        completed: true
    },
    {
        id: "task-2-1",
        phase: 2,
        title: "2.1 Open-Meteo Weather Connector",
        desc: "Integrate Open-Meteo 7-day forecast API (temp, rain, humidity, ET₀) with 6-hour caching and demo fallbacks.",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "High",
        ease: "High",
        timeEst: "2 hours",
        assignee: "Harshit",
        deliverable: "Live / Cached Weather Endpoint",
        sprint72: true,
        completed: true
    },
    {
        id: "task-4-1",
        phase: 4,
        title: "4.1 Structured JSON Disease Diagnosis",
        desc: "Enforce Gemini vision structured output with strict schema (crop, disease, symptoms, confidence score).",
        tier: "p0",
        tierLabel: "P0: Easy & Critical",
        importance: "High",
        ease: "High",
        timeEst: "2 hours",
        assignee: "Sachin",
        deliverable: "Validated Diagnosis JSON API",
        sprint72: true,
        completed: true
    },

    // P1: Core Pillars (High Importance, Moderate Effort)
    {
        id: "task-1-2",
        phase: 1,
        title: "1.2 Clean Architecture Restructure",
        desc: "Move legacy patch scripts to /tools/legacy/, create /backend, /frontend, /docs, /country_profiles.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "High",
        ease: "Medium",
        timeEst: "1.5 hours",
        assignee: "Harshit",
        deliverable: "Clean Folder Hierarchy",
        sprint72: true,
        completed: true
    },
    {
        id: "task-1-5",
        phase: 1,
        title: "1.5 Secure Backend & Env Variables",
        desc: "Keep Gemini & external API keys server-side only in .env. Implement CORS and rate-limiting middleware.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "Critical",
        ease: "Medium",
        timeEst: "2 hours",
        assignee: "Harshit",
        deliverable: "Hardened API Gateway",
        sprint72: true,
        completed: true
    },
    {
        id: "task-2-2",
        phase: 2,
        title: "2.2 SoilGrids REST API + Fallback",
        desc: "Connect SoilGrids (pH, organic carbon, texture) with cached demo coords and manual soil input fallback.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "High",
        ease: "Medium",
        timeEst: "3 hours",
        assignee: "Sachin",
        deliverable: "Normalized Soil Connector",
        sprint72: true,
        completed: true
    },
    {
        id: "task-3-1",
        phase: 3,
        title: "3.1 Regenerative Agronomic Rules Engine",
        desc: "Transparent rules for crop suitability, nitrogen restoration, organic matter boost, and moisture efficiency.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "Critical",
        ease: "Medium",
        timeEst: "4 hours",
        assignee: "Both",
        deliverable: "Explainable Advisory Engine",
        sprint72: true,
        completed: true
    },
    {
        id: "task-3-3",
        phase: 3,
        title: "3.3 Data-Backed Confidence Scoring",
        desc: "Compute confidence from data quality (weather freshness, soil resolution, source certainty), not hallucinations.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "High",
        ease: "Medium",
        timeEst: "2 hours",
        assignee: "Sachin",
        deliverable: "Confidence Metric in Recommendations",
        sprint72: true,
        completed: true
    },
    {
        id: "task-4-2",
        phase: 4,
        title: "4.2 Disease Confidence Gate & Organic-First",
        desc: "Below 0.6 confidence show expert fallback warning. Prioritize organic/cultural controls over chemical options.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "High",
        ease: "Medium",
        timeEst: "2 hours",
        assignee: "Harshit",
        deliverable: "Safe & Biased-to-Organic Crop Doctor",
        sprint72: true,
        completed: true
    },
    {
        id: "task-5-2",
        phase: 5,
        title: "5.2 OpenAPI 3.0 Spec & Node Info Contract",
        desc: "Publish openapi.yaml and GET /v1/node/info returning node metadata, supported crops, and schema versions.",
        tier: "p1",
        tierLabel: "P1: Core Pillars",
        importance: "High",
        ease: "Medium",
        timeEst: "2 hours",
        assignee: "Sachin",
        deliverable: "Interoperable OpenAPI Spec",
        sprint72: true,
        completed: true
    },

    // P2: BRICS Federation & Smallholder Tools (Strategic Presentation Impact)
    {
        id: "task-5-3",
        phase: 5,
        title: "5.3 Simulated BRICS Federation Hub",
        desc: "Demonstrate multi-node insight exchange (India, Brazil, South Africa) with shared disease alert transfer.",
        tier: "p2",
        tierLabel: "P2: BRICS & Scaling",
        importance: "High",
        ease: "Medium",
        timeEst: "4 hours",
        assignee: "Both",
        deliverable: "Federated Insights Dashboard",
        sprint72: true,
        completed: true
    },
    {
        id: "task-5-4",
        phase: 5,
        title: "5.4 Privacy by Design & Zero Raw Data Exchange",
        desc: "Document and enforce local data retention with aggregated metadata exchange only. Add privacy notice.",
        tier: "p2",
        tierLabel: "P2: BRICS & Scaling",
        importance: "Medium",
        ease: "Medium",
        timeEst: "2 hours",
        assignee: "Sachin",
        deliverable: "docs/privacy-and-governance.md",
        sprint72: false,
        completed: true
    },
    {
        id: "task-6-2",
        phase: 6,
        title: "6.2 Voice Input & Client Image Compression",
        desc: "Web Speech API voice queries and canvas image compression to keep mobile uploads small & fast.",
        tier: "p2",
        tierLabel: "P2: BRICS & Scaling",
        importance: "Medium",
        ease: "Medium",
        timeEst: "3 hours",
        assignee: "Harshit",
        deliverable: "Low-Bandwidth Mobile Optimization",
        sprint72: true,
        completed: true
    },
    {
        id: "task-6-4",
        phase: 6,
        title: "6.4 WhatsApp & SMS Advisory Mockup / API",
        desc: "Interactive payload builder and simulated chat mockup for instant farmer message delivery.",
        tier: "p2",
        tierLabel: "P2: BRICS & Scaling",
        importance: "Medium",
        ease: "Low",
        timeEst: "2.5 hours",
        assignee: "Sachin",
        deliverable: "WhatsApp Advisory Dispatcher",
        sprint72: false,
        completed: true
    },
    {
        id: "task-7-1",
        phase: 7,
        title: "7.1 Refocus Homepage Navigation",
        desc: "Place Field Advisory, Crop Doctor, Weather Risk, and Network upfront. Move legacy tools into 'More'.",
        tier: "p2",
        tierLabel: "P2: BRICS & Scaling",
        importance: "High",
        ease: "Medium",
        timeEst: "2 hours",
        assignee: "Harshit",
        deliverable: "Streamlined Track 4 Homepage",
        sprint72: true,
        completed: true
    },

    // P3: Validation, Documentation & Final Polish
    {
        id: "task-2-3",
        phase: 2,
        title: "2.3 Vegetation NDVI & Soil Moisture Proxy",
        desc: "Sentinel-2 NDVI via STAC / Open-Meteo soil-moisture proxy with clear data-freshness timestamps.",
        tier: "p3",
        tierLabel: "P3: Polish & Docs",
        importance: "Medium",
        ease: "Low",
        timeEst: "3-4 hours",
        assignee: "Harshit",
        deliverable: "Vegetation & Moisture Layer",
        sprint72: false,
        completed: true
    },
    {
        id: "task-3-4",
        phase: 3,
        title: "3.4 Agronomic Benchmark Validation (EcoCrop)",
        desc: "Verify crop recommendation rules against FAO EcoCrop / ICAR criteria across 10 test locations.",
        tier: "p3",
        tierLabel: "P3: Polish & Docs",
        importance: "High",
        ease: "Medium",
        timeEst: "3 hours",
        assignee: "Both",
        deliverable: "docs/validation.md with test cases",
        sprint72: false,
        completed: true
    },
    {
        id: "task-5-5",
        phase: 5,
        title: "5.5 Country Onboarding Guide",
        desc: "Create docs/onboarding-a-new-country.md explaining how any nation can add a node in under 30 minutes.",
        tier: "p3",
        tierLabel: "P3: Polish & Docs",
        importance: "High",
        ease: "High",
        timeEst: "2 hours",
        assignee: "Sachin",
        deliverable: "DPG Onboarding Guide",
        sprint72: true,
        completed: true
    },
    {
        id: "task-8-1",
        phase: 8,
        title: "8.1 Pitch Script & Backup Video Walkthrough",
        desc: "5-minute pitch rehearsal, architecture slide decks, and pre-recorded offline demo fallback.",
        tier: "p3",
        tierLabel: "P3: Polish & Docs",
        importance: "Critical",
        ease: "Medium",
        timeEst: "4 hours",
        assignee: "Both",
        deliverable: "Submission & Demo Video",
        sprint72: true,
        completed: true
    }
];

// Phase Metadata
const PHASE_METADATA = {
    1: { name: "Phase 1: Foundation & Cleanup", time: "Day 1 (0-8h)", goal: "Clean repo, deployed backend, open license & security." },
    2: { name: "Phase 2: Standardized Data Connectors", time: "Days 1-2 (8-16h)", goal: "Normalized weather, soil, and vegetation data bundle." },
    3: { name: "Phase 3: Regenerative Advisory Engine", time: "Days 2-4 (16-36h)", goal: "Explainable agronomic rules, confidence metrics & recommendations." },
    4: { name: "Phase 4: Disease Diagnosis Upgrade", time: "Day 4 (36-44h)", goal: "Structured JSON diagnosis, confidence gates & organic treatments." },
    5: { name: "Phase 5: BRICS Layer & Federation", time: "Days 4-6 (44-60h)", goal: "Multi-country JSON profiles, OpenAPI spec & simulated node hub." },
    6: { name: "Phase 6: Smallholder Accessibility", time: "Days 5-6 (60-68h)", goal: "Speech synthesis, voice input & low-bandwidth optimization." },
    7: { name: "Phase 7: Trim & Focus", time: "Day 6 (68-70h)", goal: "Homepage restructuring & highlighting key Track 4 pillars." },
    8: { name: "Phase 8: Documentation & Pitch", time: "Day 7 (70-72h)", goal: "Validation docs, country onboarding guide & pitch demo video." }
};

// State Management
let tasks = [];
let currentFilter = 'all';
let currentAssignee = 'all';
let isSprint72Active = false;

// Initialize Tracker
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderStats();
    renderPriorityMatrix();
    renderPhaseAccordion();
    initSimulator();
    setupEventListeners();
});

function loadTasks() {
    const saved = localStorage.getItem('karsakah_track4_tasks');
    if (saved) {
        try {
            const savedArr = JSON.parse(saved);
            tasks = DEFAULT_TASKS.map(def => {
                const match = savedArr.find(s => s.id === def.id);
                return match ? { ...def, completed: match.completed } : def;
            });
        } catch (e) {
            tasks = [...DEFAULT_TASKS];
        }
    } else {
        tasks = [...DEFAULT_TASKS];
    }
}

function saveTasks() {
    localStorage.setItem('karsakah_track4_tasks', JSON.stringify(tasks));
    renderStats();
    renderPriorityMatrix();
    renderPhaseAccordion();
}

function toggleTask(taskId) {
    tasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    saveTasks();
}

function renderStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const p0Total = tasks.filter(t => t.tier === 'p0').length;
    const p0Done = tasks.filter(t => t.tier === 'p0' && t.completed).length;
    const p0Pct = p0Total > 0 ? Math.round((p0Done / p0Total) * 100) : 0;

    const sprintTasks = tasks.filter(t => t.sprint72);
    const sprintDone = sprintTasks.filter(t => t.completed).length;
    const sprintPct = sprintTasks.length > 0 ? Math.round((sprintDone / sprintTasks.length) * 100) : 0;

    // Update Header / Card Stats
    document.getElementById('stat-total-progress').innerText = `${pct}%`;
    document.getElementById('stat-tasks-done').innerText = `${completed}/${total}`;
    document.getElementById('stat-p0-progress').innerText = `${p0Pct}% (${p0Done}/${p0Total})`;
    document.getElementById('stat-sprint-progress').innerText = `${sprintPct}% (${sprintDone}/${sprintTasks.length})`;
    
    // Progress Bar
    const fill = document.getElementById('progress-bar-fill');
    if (fill) fill.style.width = `${pct}%`;
    const label = document.getElementById('progress-pct-label');
    if (label) label.innerText = `${pct}% Complete (${completed} of ${total} deliverables)`;
}

function filterTasksList(taskList) {
    return taskList.filter(t => {
        if (currentFilter !== 'all' && t.tier !== currentFilter) return false;
        if (currentAssignee !== 'all' && t.assignee !== currentAssignee && t.assignee !== 'Both') return false;
        if (isSprint72Active && !t.sprint72) return false;
        return true;
    });
}

function renderPriorityMatrix() {
    const tiers = [
        { id: 'p0', title: 'P0: Quick Wins & High-Impact Essentials', subtitle: 'Easy to implement + Critical foundation', class: 'tier-p0', icon: 'ph-lightning' },
        { id: 'p1', title: 'P1: Core Scientific Pillars', subtitle: 'Rules engine, connectors, confidence & diagnosis', class: 'tier-p1', icon: 'ph-cpu' },
        { id: 'p2', title: 'P2: BRICS Federation & Smallholder Tools', subtitle: 'Multi-node registry, voice, WhatsApp payload', class: 'tier-p2', icon: 'ph-globe-hemisphere-west' },
        { id: 'p3', title: 'P3: Validation, Docs & Pitch Polish', subtitle: 'FAO benchmarks, country guide, demo video', class: 'tier-p3', icon: 'ph-medal' }
    ];

    const matrixContainer = document.getElementById('priority-matrix-container');
    if (!matrixContainer) return;

    matrixContainer.innerHTML = tiers.map(tier => {
        const tierTasks = filterTasksList(tasks.filter(t => t.tier === tier.id));
        const total = tasks.filter(t => t.tier === tier.id).length;
        const done = tasks.filter(t => t.tier === tier.id && t.completed).length;

        return `
            <div class="priority-tier-card ${tier.class}">
                <div class="tier-header">
                    <div class="tier-title-wrap">
                        <i class="ph-bold ${tier.icon} tier-icon"></i>
                        <div>
                            <div class="tier-title">${tier.title}</div>
                            <div class="tier-subtitle">${tier.subtitle}</div>
                        </div>
                    </div>
                    <span class="status-pill ${done === total && total > 0 ? 'pill-recommended' : 'pill-info'}">
                        ${done}/${total} Done
                    </span>
                </div>
                <div class="tier-body">
                    ${tierTasks.length === 0 ? '<div style="color:var(--text-gray);font-size:13px;padding:12px;text-align:center;">No matching tasks with current filter</div>' : ''}
                    ${tierTasks.map(t => createTaskCardHtml(t)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function createTaskCardHtml(task) {
    return `
        <div class="task-item ${task.completed ? 'completed' : ''}" id="card-${task.id}">
            <div class="task-header">
                <input type="checkbox" class="task-checkbox" id="chk-${task.id}" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <div class="task-info">
                    <div class="task-name">
                        <label for="chk-${task.id}" style="cursor:pointer;flex-grow:1;">${task.title}</label>
                        ${task.sprint72 ? '<span class="status-pill pill-urgent" style="font-size:10px;padding:2px 8px;" title="Included in 72-Hour Sprint">72h Sprint</span>' : ''}
                    </div>
                    <div class="task-desc">${task.desc}</div>
                    <div class="task-meta">
                        <span class="meta-tag deliverable"><i class="ph-bold ph-check-circle"></i> ${task.deliverable}</span>
                        <span class="meta-tag time"><i class="ph-bold ph-clock"></i> ${task.timeEst}</span>
                        <span class="meta-tag"><i class="ph-bold ph-user"></i> ${task.assignee}</span>
                        <span class="meta-tag"><i class="ph-bold ph-calendar"></i> Phase ${task.phase}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPhaseAccordion() {
    const accordionContainer = document.getElementById('phase-accordion-container');
    if (!accordionContainer) return;

    let html = '';
    for (let p = 1; p <= 8; p++) {
        const meta = PHASE_METADATA[p];
        const phaseTasks = filterTasksList(tasks.filter(t => t.phase === p));
        const allPhaseTasks = tasks.filter(t => t.phase === p);
        const done = allPhaseTasks.filter(t => t.completed).length;
        const total = allPhaseTasks.length;

        html += `
            <div class="phase-section">
                <div class="phase-header" onclick="togglePhaseSection(${p})">
                    <div class="phase-title-wrap">
                        <div class="phase-num">${p}</div>
                        <div>
                            <div class="phase-heading">${meta.name}</div>
                            <div class="phase-timeline"><i class="ph-bold ph-clock"></i> ${meta.time} &bull; ${meta.goal}</div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span class="status-pill ${done === total && total > 0 ? 'pill-recommended' : 'pill-info'}">
                            ${done}/${total} Done
                        </span>
                        <i class="ph-bold ph-caret-down phase-arrow" id="phase-arrow-${p}"></i>
                    </div>
                </div>
                <div class="phase-content" id="phase-content-${p}">
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        ${phaseTasks.length === 0 ? '<div style="color:var(--text-gray);font-size:13px;padding:8px;">No tasks in this phase match current filter.</div>' : ''}
                        ${phaseTasks.map(t => createTaskCardHtml(t)).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    accordionContainer.innerHTML = html;
}

window.togglePhaseSection = function(phaseNum) {
    const content = document.getElementById(`phase-content-${phaseNum}`);
    const arrow = document.getElementById(`phase-arrow-${phaseNum}`);
    if (content) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        } else {
            content.style.display = 'none';
            if (arrow) arrow.style.transform = 'rotate(-90deg)';
        }
    }
};

function setupEventListeners() {
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentFilter = e.currentTarget.dataset.filter;
            renderPriorityMatrix();
            renderPhaseAccordion();
        });
    });

    // Assignee Select
    const assigneeSelect = document.getElementById('assignee-filter');
    if (assigneeSelect) {
        assigneeSelect.addEventListener('change', (e) => {
            currentAssignee = e.target.value;
            renderPriorityMatrix();
            renderPhaseAccordion();
        });
    }

    // 72h Sprint Toggle
    const sprintToggle = document.getElementById('sprint-mode-toggle');
    if (sprintToggle) {
        sprintToggle.addEventListener('change', (e) => {
            isSprint72Active = e.target.checked;
            renderPriorityMatrix();
            renderPhaseAccordion();
        });
    }

    // View Tabs (Matrix vs Accordion)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const mode = e.currentTarget.dataset.view;
            if (mode === 'matrix') {
                document.getElementById('priority-matrix-container').style.display = 'grid';
                document.getElementById('phase-accordion-container').style.display = 'none';
            } else {
                document.getElementById('priority-matrix-container').style.display = 'none';
                document.getElementById('phase-accordion-container').style.display = 'block';
            }
        });
    });
}

// Reset / Export Tools
window.resetProgress = function() {
    if (confirm("Reset all task progress to default state?")) {
        tasks = [...DEFAULT_TASKS];
        saveTasks();
    }
};

window.markAllP0Done = function() {
    tasks = tasks.map(t => t.tier === 'p0' ? { ...t, completed: true } : t);
    saveTasks();
};

/* =========================================================================
   LIVE API & ARCHITECTURE SIMULATOR (Track 4 Demo Engine)
   ========================================================================= */

const SIMULATOR_DATA = {
    IN: {
        country: "India",
        node: "node-in-punjab-01",
        coords: { lat: 30.90, lon: 75.85, name: "Ludhiana, Punjab" },
        language: "pa",
        langName: "Punjabi / Hindi / English",
        weather: {
            temp_c: 29.4,
            rain_mm_7d: 38.2,
            humidity_pct: 68,
            et0_mm: 4.1,
            forecast_alert: "Moderate rainfall expected on Day 3 & 4"
        },
        soil: {
            ph: 7.4,
            organic_carbon_g_kg: 6.1,
            texture: "sandy loam",
            nitrogen_status: "medium-low",
            source: "SoilGrids (ISRIC 250m)",
            freshness: "Cached static (Q3 2026)"
        },
        vegetation: {
            ndvi: 0.42,
            moisture_index: 0.38,
            source: "Open-Meteo Soil-Moisture Proxy (Sentinel-2 STAC ready)",
            observed_on: "2026-09-29"
        },
        advisory: {
            crop: "Moong (Green Gram / Vigna radiata)",
            variety: "SML 668 / IPM 205-7",
            suitability_score: 0.88,
            confidence: "High (0.85)",
            why: [
                "Soil pH 7.4 is within optimal range (6.5 - 7.5)",
                "Legume cultivation fixes atmospheric nitrogen after wheat harvest",
                "7-day rainfall covers 70% of crop water need (low groundwater strain)"
            ],
            regenerative_practices: [
                "Retain wheat stubble as organic mulch to conserve soil moisture",
                "Seed inoculation with Rhizobium culture to eliminate synthetic urea need",
                "Zero-tillage direct seeding to protect soil microbiome"
            ],
            water_plan: "Delay irrigation for 72 hours due to forecast rain.",
            risks: ["Ensure adequate field drainage before Day 3 rain spell"],
            voice_text: {
                en: "Recommended crop is Moong Green Gram. Soil pH 7.4 is optimal. Retain wheat stubble as mulch to conserve moisture, and delay irrigation due to expected rain.",
                pa: "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਫ਼ਸਲ ਮੂੰਗੀ ਹੈ। ਮਿੱਟੀ ਦਾ ਪੀਐਚ 7.4 ਬਿਲਕੁਲ ਠੀਕ ਹੈ। ਨਮੀ ਬਚਾਉਣ ਲਈ ਕਣਕ ਦੇ ਨਾੜ ਨੂੰ ਮਲਚ ਵਜੋਂ ਵਰਤੋ। ਮੀਂਹ ਕਾਰਨ ਸਿੰਚਾਈ ਰੋਕੋ।",
                hi: "अनुशंसित फसल मूंग है। मिट्टी का पीएच 7.4 उपयुक्त है। नमी बचाने के लिए पराली का मल्च लगाएं और आने वाली बारिश के कारण सिंचाई रोकें।"
            }
        },
        diagnosis: {
            crop: "Rice / Paddy",
            disease: "Bacterial Leaf Blight (Xanthomonas oryzae)",
            confidence: 0.89,
            symptoms: ["Water-soaked yellowish-white lesions along leaf margins", "Waving stripes drying up"],
            organic_controls: [
                "Spray 5% fresh cow dung extract filtered supernatant or Neem seed kernel extract (5%)",
                "Apply Pseudomonas fluorescens bio-agent @ 10g/L water",
                "Drain excess standing water and avoid excess synthetic nitrogen"
            ],
            chemical_controls: [
                "Streptocycline (1g) + Copper Oxychloride (30g) in 10L water (only if organic threshold exceeded)"
            ],
            expert_fallback: "If wilting exceeds 25% of canopy, contact your Krishi Vigyan Kendra (KVK) officer."
        }
    },
    BR: {
        country: "Brazil",
        node: "node-br-cerrado-02",
        coords: { lat: -12.97, lon: -38.50, name: "Bahia / Cerrado Region" },
        language: "pt",
        langName: "Português",
        weather: {
            temp_c: 27.1,
            rain_mm_7d: 14.0,
            humidity_pct: 62,
            et0_mm: 5.2,
            forecast_alert: "Dry spell expected next 5 days"
        },
        soil: {
            ph: 5.8,
            organic_carbon_g_kg: 8.4,
            texture: "clay loam",
            nitrogen_status: "medium",
            source: "SoilGrids (ISRIC 250m) + Embrapa Baseline",
            freshness: "Cached static (Q3 2026)"
        },
        vegetation: {
            ndvi: 0.55,
            moisture_index: 0.31,
            source: "Sentinel-2 NDVI & Soil Moisture Proxy",
            observed_on: "2026-09-28"
        },
        advisory: {
            crop: "Soybean with Brachiaria Intercropping (ILPF System)",
            variety: "BRS 284",
            suitability_score: 0.91,
            confidence: "High (0.88)",
            why: [
                "Soil pH 5.8 is ideal for biological nitrogen fixation in oxisols",
                "Intercropping Brachiaria grass increases soil organic matter and deep root channels",
                "Forecast temperature aligns with reproductive phase thermal requirements"
            ],
            regenerative_practices: [
                "Direct planting into crop residue (Plantio Direto)",
                "Biological seed inoculation with Bradyrhizobium & Azospirillum",
                "Maintain permanent soil cover to reduce surface temperature by 4°C"
            ],
            water_plan: "Maximize straw cover to retain soil moisture during the 5-day dry spell.",
            risks: ["Monitor for early signs of Asian Soybean Rust if humidity rises"],
            voice_text: {
                pt: "Cultura recomendada: Soja em consórcio com Braquiária no sistema de Plantio Direto. O pH do solo de 5.8 é ideal. Mantenha a palhada para reter umidade durante o período seco.",
                en: "Recommended crop is Soybean intercropped with Brachiaria under Direct Planting. Soil pH 5.8 is ideal. Maintain mulch cover during the dry spell."
            }
        },
        diagnosis: {
            crop: "Soybean",
            disease: "Asian Soybean Rust (Phakopsora pachyrhizi)",
            confidence: 0.92,
            symptoms: ["Small brown necrotic lesions on lower leaves with visible pustules underneath"],
            organic_controls: [
                "Apply potassium silicate and botanical extracts to strengthen leaf cuticle",
                "Bio-fungicide Bacillus subtilis application during initial sporulation",
                "Respect the sanitary void (Vazio Sanitário) rules strictly"
            ],
            chemical_controls: [
                "Triazole + Strobilurin mixture rotation following Embrapa anti-resistance guidelines"
            ],
            expert_fallback: "Consult local agronomic extension (Emater / Embrapa) if threshold is breached."
        }
    },
    ZA: {
        country: "South Africa",
        node: "node-za-kzn-03",
        coords: { lat: -29.85, lon: 31.02, name: "KwaZulu-Natal" },
        language: "zu",
        langName: "isiZulu / English",
        weather: {
            temp_c: 24.8,
            rain_mm_7d: 22.5,
            humidity_pct: 74,
            et0_mm: 3.9,
            forecast_alert: "Light coastal showers"
        },
        soil: {
            ph: 6.2,
            organic_carbon_g_kg: 7.0,
            texture: "sandy clay",
            nitrogen_status: "medium",
            source: "SoilGrids (ISRIC 250m) + ARC Baseline",
            freshness: "Cached static (Q3 2026)"
        },
        vegetation: {
            ndvi: 0.48,
            moisture_index: 0.40,
            source: "Sentinel-2 NDVI & Soil Moisture Proxy",
            observed_on: "2026-09-29"
        },
        advisory: {
            crop: "Cowpea (Vigna unguiculata) & Sorghum Rotation",
            variety: "Encore / Bechuana White",
            suitability_score: 0.86,
            confidence: "High (0.83)",
            why: [
                "High drought and heat tolerance with minimal fertilizer requirement",
                "Fixes nitrogen for subsequent maize rotation in smallholder plots",
                "Well suited to sandy clay soil texture with moderate drainage"
            ],
            regenerative_practices: [
                "Conservation agriculture: minimum tillage with permanent basin planting",
                "Intercrop with drought-resistant millet or cowpea residue mulching",
                "Zero synthetic chemical dependency for nitrogen"
            ],
            water_plan: "Capture coastal shower moisture using localized planting basins (Zai pit technique).",
            risks: ["Aphid scouting required during flowering stage"],
            voice_text: {
                en: "Recommended crop is Cowpea and Sorghum rotation under conservation agriculture. High drought tolerance and natural nitrogen fixation.",
                zu: "Isilimo esinconywayo yi-Cowpea ne-Sorghum. Ivuselela umhlabathi futhi imelana nesomiso."
            }
        },
        diagnosis: {
            crop: "Maize / Corn",
            disease: "Fall Armyworm (Spodoptera frugiperda)",
            confidence: 0.87,
            symptoms: ["Ragged feeding holes in whorl leaves", "Sawdust-like frass on leaf axils"],
            organic_controls: [
                "Apply Neem oil (5ml/L) or fine sand mixed with wood ash directly into the leaf whorl",
                "Release Trichogramma parasitic wasps or apply Bacillus thuringiensis (Bt)",
                "Hand-pick egg masses on smallholder family plots"
            ],
            chemical_controls: [
                "Registered selective biologicals (Spinosad) if pest exceeds 20% infestation threshold"
            ],
            expert_fallback: "Report heavy infestations to your local provincial agricultural advisor."
        }
    }
};

let currentSimCountry = 'IN';
let currentSimEndpoint = 'advisory';

function initSimulator() {
    const countrySelect = document.getElementById('sim-country-select');
    const endpointSelect = document.getElementById('sim-endpoint-select');
    const runBtn = document.getElementById('sim-run-btn');

    if (countrySelect) {
        countrySelect.addEventListener('change', (e) => {
            currentSimCountry = e.target.value;
            runSimulation();
        });
    }

    if (endpointSelect) {
        endpointSelect.addEventListener('change', (e) => {
            currentSimEndpoint = e.target.value;
            runSimulation();
        });
    }

    if (runBtn) {
        runBtn.addEventListener('click', () => runSimulation());
    }

    // Run initial simulation
    runSimulation();
}

function runSimulation() {
    const data = SIMULATOR_DATA[currentSimCountry];
    const outputEl = document.getElementById('sim-json-output');
    const statusEl = document.getElementById('sim-status-indicator');
    const speechBtn = document.getElementById('sim-speech-btn');

    if (!outputEl || !data) return;

    let payload = {};
    let speechText = "";
    let speechLang = "en";

    if (currentSimEndpoint === 'data') {
        payload = {
            status: "success",
            endpoint: `/v1/data?lat=${data.coords.lat}&lon=${data.coords.lon}`,
            node: data.node,
            location: {
                country: data.country,
                name: data.coords.name,
                lat: data.coords.lat,
                lon: data.coords.lon
            },
            weather: data.weather,
            soil: data.soil,
            vegetation: data.vegetation,
            data_freshness: {
                weather: "live (Open-Meteo)",
                soil: "static 250m resolution (SoilGrids)",
                vegetation: "observed 24-48h (Sentinel-2 proxy)"
            }
        };
        speechText = `Weather for ${data.coords.name}: Temperature ${data.weather.temp_c} degrees Celsius, rainfall forecast ${data.weather.rain_mm_7d} millimeters. Soil pH is ${data.soil.ph}.`;
    } else if (currentSimEndpoint === 'advisory') {
        payload = {
            status: "success",
            endpoint: `/v1/advisory`,
            country_node: data.node,
            location: data.coords.name,
            recommendation: {
                crop: data.advisory.crop,
                variety: data.advisory.variety,
                suitability_score: data.advisory.suitability_score,
                confidence: data.advisory.confidence,
                explainability_reasons: data.advisory.why,
                regenerative_practices: data.advisory.regenerative_practices,
                water_efficiency_plan: data.advisory.water_plan,
                risk_alerts: data.advisory.risks
            },
            governance: {
                open_license: "Apache-2.0",
                rules_engine_version: "2.4-agro",
                privacy_mode: "Zero raw-data transmission (Federated local execution)"
            }
        };
        speechText = data.advisory.voice_text[data.language] || data.advisory.voice_text.en;
        speechLang = data.language;
    } else if (currentSimEndpoint === 'diagnose') {
        payload = {
            status: "success",
            endpoint: `/v1/diagnose`,
            model: "Gemini Vision Multi-Modal + Agro Bias Validator",
            confidence_threshold: 0.60,
            diagnosis: data.diagnosis,
            regenerative_bias: "Organic & biological solutions listed first; synthetic restricted as secondary fallback."
        };
        speechText = `Diagnosis for ${data.diagnosis.crop}: ${data.diagnosis.disease} with confidence score ${Math.round(data.diagnosis.confidence * 100)} percent. Primary organic treatment: ${data.diagnosis.organic_controls[0]}.`;
    } else if (currentSimEndpoint === 'node_info') {
        payload = {
            status: "success",
            endpoint: `/v1/node/info`,
            federation_status: "Operational (Simulated Architecture-Ready)",
            current_node: {
                id: data.node,
                country: data.country,
                languages_supported: ["en", data.language],
                openapi_version: "3.0.3",
                model_card: {
                    advisory_model: "Regenerative Rule Matrix v2.4",
                    vision_model: "Gemini 2.5 Flash Vision + PlantVillage Validation Set",
                    accuracy_benchmark: "89.4% on 100 EcoCrop/ICAR Test Cases"
                },
                shared_insights_feed: [
                    { alert: "Early fungal blight warning shared with South Africa node", timestamp: "2026-09-30T10:00:00Z" },
                    { alert: "Legume intercrop soil organic boost model synced with Brazil node", timestamp: "2026-09-29T14:30:00Z" }
                ]
            }
        };
        speechText = `Node information for ${data.country}: Node ID ${data.node}. Federated architecture is operational and sharing disease warnings across nodes.`;
    }

    // Render formatted JSON
    outputEl.innerHTML = syntaxHighlightJson(JSON.stringify(payload, null, 2));
    if (statusEl) statusEl.innerHTML = `<i class="ph-bold ph-check-circle"></i> HTTP 200 OK &bull; ${data.node}`;

    // Setup TTS button
    if (speechBtn) {
        speechBtn.onclick = () => playTts(speechText, speechLang);
    }
}

function syntaxHighlightJson(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'color: #93C5FD;'; // default number / value
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'color: #34D399; font-weight: 600;'; // key
            } else {
                cls = 'color: #FDE047;'; // string
            }
        } else if (/true|false/.test(match)) {
            cls = 'color: #F472B6;'; // boolean
        } else if (/null/.test(match)) {
            cls = 'color: #A78BFA;';
        }
        return '<span style="' + cls + '">' + match + '</span>';
    });
}

function playTts(text, lang) {
    if (!('speechSynthesis' in window)) {
        alert("Speech Synthesis not supported by this browser.");
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map custom codes
    const langMap = {
        'pa': 'pa-IN',
        'hi': 'hi-IN',
        'pt': 'pt-BR',
        'zu': 'zu-ZA',
        'en': 'en-US'
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const speechBtn = document.getElementById('sim-speech-btn');
    if (speechBtn) speechBtn.innerHTML = '<i class="ph-bold ph-speaker-high"></i> Speaking...';

    utterance.onend = () => {
        if (speechBtn) speechBtn.innerHTML = '<i class="ph-bold ph-speaker-high"></i> Listen (TTS)';
    };

    utterance.onerror = () => {
        if (speechBtn) speechBtn.innerHTML = '<i class="ph-bold ph-speaker-high"></i> Listen (TTS)';
    };

    window.speechSynthesis.speak(utterance);
}
