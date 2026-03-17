const SUBJECTS = [
  { name: "Additional Mathematics", levels: ["G2", "G3"], flags: ["math"] },
  { name: "Arabic as a 3rd Language", levels: ["G3"], flags: [] },
  { name: "Art", levels: ["G1", "G2", "G3"], flags: ["arts"] },
  { name: "Bahasa Indonesia as a 3rd Language", levels: ["G3"], flags: [] },
  { name: "Bengali", levels: ["G2", "G3"], flags: [] },
  { name: "Biology", levels: ["G3"], flags: ["science"] },
  { name: "Business", levels: ["G3"], flags: ["business"] },
  { name: "Burmese", levels: ["G3"], flags: [] },
  { name: "Chemistry", levels: ["G3"], flags: ["science"] },
  { name: "Chinese Language", levels: ["G1", "G2"], flags: [] },
  { name: "Computing", levels: ["G1", "G2", "G3"], flags: ["ict"] },
  { name: "Design & Technology", levels: ["G3"], flags: ["design"] },
  { name: "Design and Technology", levels: ["G1", "G2"], flags: ["design"] },
  { name: "Drama", levels: ["G3"], flags: ["arts"] },
  { name: "Economics", levels: ["G3"], flags: ["business"] },
  { name: "Electronics", levels: ["G3"], flags: ["ict", "science"] },
  { name: "Elements of Business Skills", levels: ["G1"], flags: ["business"] },
  { name: "English Language", levels: ["G1", "G2", "G3"], flags: ["english"] },
  { name: "French", levels: ["G3"], flags: [] },
  { name: "Geography", levels: ["G2", "G3"], flags: ["humanities"] },
  { name: "German", levels: ["G3"], flags: [] },
  { name: "Gujarati", levels: ["G2", "G3"], flags: [] },
  { name: "Higher Art", levels: ["G3"], flags: ["arts"] },
  { name: "Higher Music", levels: ["G3"], flags: ["arts"] },
  { name: "Hindi", levels: ["G2", "G3"], flags: [] },
  { name: "History", levels: ["G2", "G3"], flags: ["humanities"] },
  { name: "Humanities (Social Studies, Geography)", levels: ["G2", "G3"], flags: ["humanities"] },
  { name: "Humanities (Social Studies, History)", levels: ["G2", "G3"], flags: ["humanities"] },
  { name: "Humanities (Social Studies, Literature in English)", levels: ["G2", "G3"], flags: ["humanities"] },
  { name: "Japanese", levels: ["G3"], flags: [] },
  { name: "Literature in English", levels: ["G2", "G3"], flags: ["humanities"] },
  { name: "Malay Language", levels: ["G1", "G2"], flags: [] },
  { name: "Mathematics", levels: ["G1", "G2", "G3"], flags: ["math"] },
  { name: "Mobile Robotics", levels: ["G1"], flags: ["ict"] },
  { name: "Music", levels: ["G1", "G3"], flags: ["arts"] },
  { name: "Nutrition and Food Science", levels: ["G1", "G2", "G3"], flags: ["design"] },
  { name: "Physics", levels: ["G3"], flags: ["science"] },
  { name: "Panjabi", levels: ["G2", "G3"], flags: [] },
  { name: "Principles of Accounts", levels: ["G2", "G3"], flags: ["business"] },
  { name: "Retail Operations", levels: ["G1"], flags: ["business"] },
  { name: "Science", levels: ["G1"], flags: ["science"] },
  { name: "Science (Chemistry, Biology)", levels: ["G2", "G3"], flags: ["science"] },
  { name: "Science (Physics, Biology)", levels: ["G2", "G3"], flags: ["science"] },
  { name: "Science (Physics, Chemistry)", levels: ["G2", "G3"], flags: ["science"] },
  { name: "Smart Electrical Technology", levels: ["G1"], flags: ["ict", "science"] },
  { name: "Spanish", levels: ["G3"], flags: [] },
  { name: "Tamil Language", levels: ["G1", "G2"], flags: [] },
  { name: "Thai", levels: ["G3"], flags: [] },
  { name: "Urdu", levels: ["G2", "G3"], flags: [] }
].sort((a, b) => a.name.localeCompare(b.name));

const state = {
  selected: [],
  pendingSubjectName: SUBJECTS[0]?.name || "",
  pendingLevel: SUBJECTS[0]?.levels[0] || "G1"
};

const els = {
  subjectSearch: document.getElementById("subjectSearch"),
  subjectSelect: document.getElementById("subjectSelect"),
  levelOptions: document.getElementById("levelOptions"),
  addSubjectBtn: document.getElementById("addSubjectBtn"),
  selectedSubjects: document.getElementById("selectedSubjects"),
  selectedCount: document.getElementById("selectedCount"),
  actualG1: document.getElementById("actualG1"),
  actualG2: document.getElementById("actualG2"),
  actualG3: document.getElementById("actualG3"),
  eqG1: document.getElementById("eqG1"),
  eqG2: document.getElementById("eqG2"),
  eqG3: document.getElementById("eqG3"),
  flagList: document.getElementById("flagList"),
  progressList: document.getElementById("progressList"),
  pathwayCards: document.getElementById("pathwayCards"),
  adviceBox: document.getElementById("adviceBox"),
  resetAllBtn: document.getElementById("resetAllBtn"),
  subjectRowTemplate: document.getElementById("subjectRowTemplate")
};

function getSubjectByName(name) {
  return SUBJECTS.find(s => s.name === name);
}

function renderSubjectSelect(filter = "") {
  const term = filter.trim().toLowerCase();
  const filtered = SUBJECTS.filter(subject => subject.name.toLowerCase().includes(term));
  els.subjectSelect.innerHTML = "";

  (filtered.length ? filtered : SUBJECTS).forEach(subject => {
    const opt = document.createElement("option");
    opt.value = subject.name;
    opt.textContent = subject.name;
    els.subjectSelect.appendChild(opt);
  });

  state.pendingSubjectName = els.subjectSelect.value;
  renderPendingLevels();
}

function renderPendingLevels() {
  const subject = getSubjectByName(els.subjectSelect.value);
  if (!subject) return;
  if (!subject.levels.includes(state.pendingLevel)) {
    state.pendingLevel = subject.levels[0];
  }
  els.levelOptions.innerHTML = "";
  subject.levels.forEach(level => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `level-chip ${level === state.pendingLevel ? "active" : ""}`;
    btn.textContent = level;
    btn.addEventListener("click", () => {
      state.pendingLevel = level;
      renderPendingLevels();
    });
    els.levelOptions.appendChild(btn);
  });
}

function addSubject() {
  const name = els.subjectSelect.value;
  const subject = getSubjectByName(name);
  if (!subject) return;
  if (state.selected.some(item => item.name === name)) {
    alert("That subject is already added.");
    return;
  }
  state.selected.push({ name, level: state.pendingLevel });
  render();
}

function updateSubjectLevel(name, level) {
  const target = state.selected.find(item => item.name === name);
  if (!target) return;
  target.level = level;
  render();
}

function removeSubject(name) {
  state.selected = state.selected.filter(item => item.name !== name);
  render();
}

function resetAll() {
  state.selected = [];
  render();
}

function computeSummary() {
  const actual = { G1: 0, G2: 0, G3: 0 };
  const selectedSubjects = state.selected.map(item => ({ ...item, meta: getSubjectByName(item.name) }));

  selectedSubjects.forEach(item => {
    actual[item.level] += 1;
  });

  const eq = {
    G1: actual.G1 + actual.G2 + actual.G3,
    G2: actual.G2 + actual.G3,
    G3: actual.G3
  };

  const hasFlagAtLevel = (flag, levelOrBetter) => selectedSubjects.some(item => {
    const itemLevelNum = Number(item.level.replace("G", ""));
    return item.meta.flags.includes(flag) && itemLevelNum >= levelOrBetter;
  });

  const hasSubjectAtLevel = (name, levelOrBetter) => selectedSubjects.some(item => {
    const itemLevelNum = Number(item.level.replace("G", ""));
    return item.name === name && itemLevelNum >= levelOrBetter;
  });

  const englishG2Plus = hasFlagAtLevel("english", 2);
  const mathG2Plus = hasSubjectAtLevel("Mathematics", 2) || hasSubjectAtLevel("Additional Mathematics", 2);
  const englishG3 = hasFlagAtLevel("english", 3);
  const mathG3 = hasSubjectAtLevel("Mathematics", 3) || hasSubjectAtLevel("Additional Mathematics", 3);

  const humanitiesG3 = selectedSubjects.some(item => item.level === "G3" && item.meta.flags.includes("humanities"));
  const artsG3 = selectedSubjects.some(item => item.level === "G3" && item.meta.flags.includes("arts"));
  const businessG3 = selectedSubjects.some(item => item.level === "G3" && item.meta.flags.includes("business"));
  const ictEngG3 = selectedSubjects.some(item => item.level === "G3" && (item.meta.flags.includes("ict") || item.meta.flags.includes("science") || item.meta.flags.includes("design") || item.meta.flags.includes("math")));
  const designG3 = selectedSubjects.some(item => item.level === "G3" && (item.meta.flags.includes("arts") || item.meta.flags.includes("design") || item.meta.flags.includes("ict")));
  const b1G3 = selectedSubjects.some(item => item.level === "G3");
  const b2G2Plus = selectedSubjects.some(item => item.level === "G2" || item.level === "G3");

  return {
    actual,
    eq,
    flags: {
      englishG2Plus,
      mathG2Plus,
      englishG3,
      mathG3,
      artsG3,
      businessG3,
      ictEngG3,
      designG3,
      humanitiesG3,
      b1G3,
      b2G2Plus
    },
    totalSelected: state.selected.length
  };
}

function pathwayDefinitions(summary) {
  const { eq, flags, totalSelected } = summary;
  const meetsG1Base = eq.G1 >= 4;
  const meetsG2Base = eq.G2 >= 5 && flags.englishG2Plus && flags.mathG2Plus;
  const meetsPolyThreshold = eq.G3 >= 4 && eq.G2 >= 5;
  const meetsG3Base = eq.G3 >= 5;
  const artsInstitutions = meetsG3Base || (eq.G3 >= 4 && eq.G2 >= 5);

  const polyClusters = [
    {
      name: "Arts",
      met: flags.englishG3 && flags.mathG3 && flags.artsG3 && flags.b1G3 && flags.b2G2Plus,
      missing: missingItems([
        [flags.englishG3, "English at G3"],
        [flags.mathG3, "Math / A Math at G3"],
        [flags.artsG3, "an Arts-aligned G3 subject"],
        [flags.b1G3, "another G3 subject for B1"],
        [flags.b2G2Plus, "another G2/G3 subject for B2"]
      ])
    },
    {
      name: "Business",
      met: flags.englishG3 && flags.mathG3 && (flags.businessG3 || flags.humanitiesG3 || flags.designG3) && flags.b1G3 && flags.b2G2Plus,
      missing: missingItems([
        [flags.englishG3, "English at G3"],
        [flags.mathG3, "Math / A Math at G3"],
        [flags.businessG3 || flags.humanitiesG3 || flags.designG3, "a Business/Humanities/D&T/NFS-style G3 subject"],
        [flags.b1G3, "another G3 subject for B1"],
        [flags.b2G2Plus, "another G2/G3 subject for B2"]
      ])
    },
    {
      name: "ICT & Engineering",
      met: flags.englishG3 && flags.mathG3 && flags.ictEngG3 && flags.b1G3 && flags.b2G2Plus,
      missing: missingItems([
        [flags.englishG3, "English at G3"],
        [flags.mathG3, "Math / A Math at G3"],
        [flags.ictEngG3, "a Science / Computing / D&T / NFS-style G3 subject"],
        [flags.b1G3, "another G3 subject for B1"],
        [flags.b2G2Plus, "another G2/G3 subject for B2"]
      ])
    },
    {
      name: "Design & Media",
      met: flags.englishG3 && flags.mathG3 && flags.designG3 && flags.b1G3 && flags.b2G2Plus,
      missing: missingItems([
        [flags.englishG3, "English at G3"],
        [flags.mathG3, "Math / A Math at G3"],
        [flags.designG3, "a Design/Media-aligned G3 subject"],
        [flags.b1G3, "another G3 subject for B1"],
        [flags.b2G2Plus, "another G2/G3 subject for B2"]
      ])
    }
  ];

  const anyPolyClusterMet = polyClusters.some(c => c.met);

  return [
    {
      key: "hn3",
      title: "3-Year Higher Nitec",
      status: meetsG1Base ? "eligible" : "not-eligible",
      reason: meetsG1Base
        ? `You have ${eq.G1} G1-equivalent subjects. 4 are needed.`
        : `You currently have ${eq.G1} G1-equivalent subjects. 4 are needed.`,
      meaning: "Skills-based route through ITE, with later progression opportunities based on results.",
      details: [
        "Threshold check used here: at least 4 G1-equivalent subjects.",
        "A G2 subject can count toward a G1 requirement, and a G3 subject can also count downward."
      ]
    },
    {
      key: "hn2",
      title: "Selected Higher Nitec progression options",
      status: meetsG2Base ? "eligible" : meetsG1Base ? "possible" : "not-eligible",
      reason: meetsG2Base
        ? "You meet the G2-equivalent threshold with English and Math at G2 or above."
        : meetsG1Base
          ? "Some ITE progression remains visible, but the stronger G2 threshold is not yet met."
          : "You do not yet meet the stronger G2-based threshold used for selected progression options.",
      meaning: "Includes selected progression routes such as entry into Year 2 of some 3-year Higher Nitec courses.",
      details: [
        "Main threshold used here: at least 5 G2-equivalent subjects, including English and Math at G2 or above.",
        "Placement still depends on programme availability and results."
      ]
    },
    {
      key: "pfp",
      title: "Polytechnic Foundation Programme (PFP)",
      status: meetsG2Base ? "eligible" : "not-eligible",
      reason: meetsG2Base
        ? "You meet the subject-level threshold used for PFP visibility in this tool."
        : `Need 5 G2-equivalent subjects plus English and Math at G2 or above. Current G2-equivalent count: ${eq.G2}.`,
      meaning: "1-year preparatory polytechnic route before diploma progression, subject to merit and course allocation.",
      details: [
        "PFP is cluster-based and competitive.",
        "This checker shows threshold visibility, not guaranteed placement."
      ]
    },
    {
      key: "nfp",
      title: "NAFA Foundation Programme (NFP)",
      status: meetsG2Base ? "eligible" : "not-eligible",
      reason: meetsG2Base
        ? "You meet the G2-based threshold used to surface NFP."
        : "Need 5 G2-equivalent subjects, including English and Math at G2 or above.",
      meaning: "1-year preparatory route into NAFA diploma pathways.",
      details: [
        "Entry is based on academic results and audition.",
        "Arts-related subjects strengthen relevance, though the threshold card here focuses on the core count rule."
      ]
    },
    {
      key: "arts",
      title: "Arts Institutions",
      status: artsInstitutions ? "possible" : "not-eligible",
      reason: artsInstitutions
        ? "Your current subject mix reaches the higher-level band where arts pathways become visible."
        : "Arts Institutions are shown once the higher-level threshold is met.",
      meaning: "Arts-focused routes may be suitable, especially for students with strong arts-aligned subjects.",
      details: [
        "In practice, portfolio or audition requirements may apply.",
        "This card does not guarantee eligibility for any specific arts course."
      ]
    },
    {
      key: "poly",
      title: "Polytechnic Year 1",
      status: meetsPolyThreshold ? (anyPolyClusterMet ? "eligible" : "possible") : "not-eligible",
      reason: meetsPolyThreshold
        ? anyPolyClusterMet
          ? "You meet the 4 G3 + 1 G2 threshold and at least one cluster check looks promising."
          : "You meet the 4 G3 + 1 G2 threshold, but compulsory G3 subject fit still needs attention."
        : `Need at least 4 G3 subjects and 1 G2-equivalent subject. Current counts: ${eq.G3} G3 and ${eq.G2} G2-equivalent.`,
      meaning: "Direct diploma entry route, but subject conditions at G3 matter for different ELR2B2 clusters.",
      details: polyClusters.map(cluster => `${cluster.name}: ${cluster.met ? "looks possible" : `missing ${cluster.missing.join(", ")}`}`)
    },
    {
      key: "mi",
      title: "Millennia Institute (MI)",
      status: meetsG3Base ? "eligible" : "not-eligible",
      reason: meetsG3Base
        ? `You have ${eq.G3} G3 subjects. 5 are needed.`
        : `You currently have ${eq.G3} G3 subjects. 5 are needed.`,
      meaning: "3-year A-Level route.",
      details: [
        "This checker uses the subject-level threshold only.",
        "Placement is still based on merit and vacancy."
      ]
    },
    {
      key: "jc",
      title: "Junior College (JC)",
      status: meetsG3Base ? "eligible" : "not-eligible",
      reason: meetsG3Base
        ? `You have ${eq.G3} G3 subjects. 5 are needed.`
        : `You currently have ${eq.G3} G3 subjects. 5 are needed.`,
      meaning: "2-year A-Level route.",
      details: [
        "This checker uses the subject-level threshold only.",
        "Placement is still based on merit and vacancy."
      ]
    }
  ].map(card => ({ ...card, disabled: totalSelected === 0 }));
}

function missingItems(entries) {
  return entries.filter(([ok]) => !ok).map(([, label]) => label);
}

function renderSelectedSubjects() {
  els.selectedCount.textContent = String(state.selected.length);
  if (!state.selected.length) {
    els.selectedSubjects.className = "selected-list empty-state";
    els.selectedSubjects.textContent = "No subjects added yet.";
    return;
  }

  els.selectedSubjects.className = "selected-list";
  els.selectedSubjects.innerHTML = "";

  state.selected.forEach(item => {
    const meta = getSubjectByName(item.name);
    const fragment = els.subjectRowTemplate.content.cloneNode(true);
    fragment.querySelector(".subject-name").textContent = item.name;

    const levelsContainer = fragment.querySelector(".subject-levels");
    meta.levels.forEach(level => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `level-chip small ${item.level === level ? "active" : ""}`;
      btn.textContent = level;
      btn.addEventListener("click", () => updateSubjectLevel(item.name, level));
      levelsContainer.appendChild(btn);
    });

    fragment.querySelector(".remove-btn").addEventListener("click", () => removeSubject(item.name));
    els.selectedSubjects.appendChild(fragment);
  });
}

function renderSummary(summary) {
  els.actualG1.textContent = summary.actual.G1;
  els.actualG2.textContent = summary.actual.G2;
  els.actualG3.textContent = summary.actual.G3;
  els.eqG1.textContent = summary.eq.G1;
  els.eqG2.textContent = summary.eq.G2;
  els.eqG3.textContent = summary.eq.G3;

  const flagEntries = [
    ["English at G2 or above", summary.flags.englishG2Plus],
    ["Math at G2 or above", summary.flags.mathG2Plus],
    ["English at G3", summary.flags.englishG3],
    ["Math / A Math at G3", summary.flags.mathG3],
    ["Arts-related G3 subject", summary.flags.artsG3],
    ["Business-related G3 subject", summary.flags.businessG3],
    ["ICT / Engineering-related G3 subject", summary.flags.ictEngG3],
    ["Design / Media-related G3 subject", summary.flags.designG3]
  ];

  els.flagList.innerHTML = "";
  flagEntries.forEach(([label, ok]) => {
    const row = document.createElement("div");
    row.className = "flag-item";
    row.innerHTML = `<span>${label}</span><span class="flag-badge ${ok ? "yes" : "no"}">${ok ? "Yes" : "No"}</span>`;
    els.flagList.appendChild(row);
  });

  const progressEntries = [
    ["G1-equivalent for Higher Nitec base", summary.eq.G1, 4],
    ["G2-equivalent for PFP/NFP routes", summary.eq.G2, 5],
    ["G3 for JC / MI", summary.eq.G3, 5],
    ["G3 for Poly Year 1 threshold", summary.eq.G3, 4]
  ];

  els.progressList.innerHTML = "";
  progressEntries.forEach(([label, value, target]) => {
    const percent = Math.min(100, Math.round((value / target) * 100));
    const row = document.createElement("div");
    row.className = "progress-item";
    row.innerHTML = `
      <span>${label}</span>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
      <strong>${value}/${target}</strong>
    `;
    els.progressList.appendChild(row);
  });
}

function renderAdvice(summary, cards) {
  const advice = [];
  if (summary.totalSelected === 0) {
    advice.push("Add subjects to begin checking pathways.");
  }
  if (summary.eq.G3 < 5) {
    advice.push(`${5 - summary.eq.G3} more G3 subject${5 - summary.eq.G3 === 1 ? "" : "s"} would reach the JC / MI threshold.`);
  }
  if (!(summary.flags.englishG2Plus && summary.flags.mathG2Plus)) {
    if (!summary.flags.englishG2Plus) advice.push("English at G2 or above is needed for the G2-based pathways.");
    if (!summary.flags.mathG2Plus) advice.push("Mathematics at G2 or above is needed for the G2-based pathways.");
  }
  const polyCard = cards.find(card => card.key === "poly");
  if (polyCard && polyCard.status === "possible") {
    advice.push("Polytechnic Year 1 is close, but cluster-specific G3 subject fit still needs checking.");
  }

  els.adviceBox.innerHTML = `
    <h3>Planning notes</h3>
    <ul>${advice.map(item => `<li>${item}</li>`).join("") || "<li>Current subject combination already meets several visible thresholds.</li>"}</ul>
  `;
}

function renderPathways(cards) {
  els.pathwayCards.innerHTML = "";
  cards.forEach(card => {
    const article = document.createElement("article");
    article.className = "pathway-card";
    article.innerHTML = `
      <div class="pathway-head">
        <h3>${card.title}</h3>
        <span class="status-badge ${card.status}">${statusLabel(card.status)}</span>
      </div>
      <p><strong>Why:</strong> ${card.reason}</p>
      <p class="muted">${card.meaning}</p>
      <details>
        <summary>Details</summary>
        <ul>${card.details.map(detail => `<li>${detail}</li>`).join("")}</ul>
      </details>
    `;
    els.pathwayCards.appendChild(article);
  });
}

function statusLabel(status) {
  if (status === "eligible") return "Eligible";
  if (status === "possible") return "Check details";
  return "Not yet";
}

function render() {
  renderSelectedSubjects();
  const summary = computeSummary();
  renderSummary(summary);
  const cards = pathwayDefinitions(summary);
  renderAdvice(summary, cards);
  renderPathways(cards);
}

els.subjectSearch.addEventListener("input", e => renderSubjectSelect(e.target.value));
els.subjectSelect.addEventListener("change", () => {
  state.pendingSubjectName = els.subjectSelect.value;
  renderPendingLevels();
});
els.addSubjectBtn.addEventListener("click", addSubject);
els.resetAllBtn.addEventListener("click", resetAll);

renderSubjectSelect();
render();
