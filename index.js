const SUBJECTS = [
  ["Arabic as a 3rd Language", ["G3"], ["language"]],
  ["Bahasa Indonesia as a 3rd Language", ["G3"], ["language"]],
  ["Bengali", ["G2", "G3"], ["language"]],
  ["Biology", ["G3"], ["science", "polySci"]],
  ["Burmese", ["G3"], ["language"]],
  ["Business", ["G3"], ["business", "polyBusinessR1"]],
  ["Chemistry", ["G3"], ["science", "polySci"]],
  ["Chinese Language", ["G1", "G2", "G3"], ["language"]],
  ["Chinese (Special Programme)", ["G3"], ["language"]],
  ["Computing", ["G1", "G2", "G3"], ["computing", "polyICTR1"]],
  ["Design and Technology", ["G1", "G2", "G3"], ["design", "polyDesignR1"]],
  ["Drama", ["G3"], ["arts", "polyArtsR1"]],
  ["Economics", ["G3"], ["humanities", "polyBusinessR1"]],
  ["Electronics", ["G3"], ["engineering", "polyICTR1"]],
  ["Elements of Business Skills", ["G1"], ["business"]],
  ["English Language", ["G1", "G2", "G3"], ["english"]],
  ["French", ["G3"], ["language"]],
  ["Geography", ["G2", "G3"], ["humanities", "polyArtsR1"]],
  ["German", ["G3"], ["language"]],
  ["Gujarati", ["G2", "G3"], ["language"]],
  ["Higher Art", ["G3"], ["arts", "polyDesignR1", "polyArtsR1"]],
  ["Higher Chinese", ["G3"], ["language"]],
  ["Higher Malay", ["G3"], ["language"]],
  ["Higher Music", ["G3"], ["arts", "polyArtsR1"]],
  ["Higher Tamil", ["G3"], ["language"]],
  ["Hindi", ["G2", "G3"], ["language"]],
  ["History", ["G2", "G3"], ["humanities", "polyArtsR1"]],
  ["Humanities (Social Studies, Geography)", ["G2", "G3"], ["humanities", "polyArtsR1"]],
  ["Humanities (Social Studies, History)", ["G2", "G3"], ["humanities", "polyArtsR1"]],
  ["Humanities (Social Studies, Literature in Chinese)", ["G3"], ["humanities", "polyArtsR1"]],
  ["Humanities (Social Studies, Literature in English)", ["G2", "G3"], ["humanities", "polyArtsR1"]],
  ["Humanities (Social Studies, Literature in Malay)", ["G3"], ["humanities", "polyArtsR1"]],
  ["Humanities (Social Studies, Literature in Tamil)", ["G3"], ["humanities", "polyArtsR1"]],
  ["Japanese", ["G3"], ["language"]],
  ["Literature in Chinese", ["G3"], ["humanities", "polyArtsR1"]],
  ["Literature in English", ["G2", "G3"], ["humanities", "polyArtsR1"]],
  ["Literature in Malay", ["G3"], ["humanities", "polyArtsR1"]],
  ["Literature in Tamil", ["G3"], ["humanities", "polyArtsR1"]],
  ["Malay Language", ["G1", "G2", "G3"], ["language"]],
  ["Malay (Special Programme)", ["G3"], ["language"]],
  ["Mathematics", ["G1", "G2", "G3"], ["math", "polyMath"]],
  ["Mobile Robotics", ["G1"], ["engineering"]],
  ["Music", ["G1", "G3"], ["arts", "polyArtsR1"]],
  ["Nutrition and Food Science", ["G1", "G2", "G3"], ["science", "polySci"]],
  ["Physics", ["G3"], ["science", "polySci"]],
  ["Panjabi", ["G2", "G3"], ["language"]],
  ["Principles of Accounts", ["G2", "G3"], ["business", "polyBusinessR1"]],
  ["Retail Operations", ["G1"], ["business"]],
  ["Science", ["G1"], ["science", "polySci"]],
  ["Science (Chemistry, Biology)", ["G2", "G3"], ["science", "polySci"]],
  ["Science (Physics, Biology)", ["G2", "G3"], ["science", "polySci"]],
  ["Science (Physics, Chemistry)", ["G2", "G3"], ["science", "polySci"]],
  ["Smart Electrical Technology", ["G1"], ["engineering", "polyICTR1"]],
  ["Spanish", ["G3"], ["language"]],
  ["Tamil Language", ["G1", "G2", "G3"], ["language"]],
  ["Thai", ["G3"], ["language"]],
  ["Urdu", ["G2", "G3"], ["language"]],
  ["Art", ["G1", "G2", "G3"], ["arts", "polyArtsR1", "polyDesignR1"]],
  ["Additional Mathematics", ["G2", "G3"], ["math", "polyMath"]],
];

const SUBJECT_MAP = new Map();
SUBJECTS.forEach(([name, levels, flags]) => {
  if (!SUBJECT_MAP.has(name)) {
    SUBJECT_MAP.set(name, { name, levels: [...new Set(levels)], flags: [...new Set(flags)] });
  } else {
    const existing = SUBJECT_MAP.get(name);
    existing.levels = [...new Set([...existing.levels, ...levels])];
    existing.flags = [...new Set([...existing.flags, ...flags])];
  }
});
const SUBJECT_LIST = [...SUBJECT_MAP.values()].sort((a, b) => a.name.localeCompare(b.name));

const state = {
  selections: []
};

const els = {
  subjectSearch: document.getElementById('subjectSearch'),
  searchResults: document.getElementById('searchResults'),
  subjectSelect: document.getElementById('subjectSelect'),
  addSubjectBtn: document.getElementById('addSubjectBtn'),
  selectedSubjects: document.getElementById('selectedSubjects'),
  clearBtn: document.getElementById('clearBtn'),
  summaryCards: document.getElementById('summaryCards'),
  flagsList: document.getElementById('flagsList'),
  progressList: document.getElementById('progressList'),
  pathwayGrid: document.getElementById('pathwayGrid'),
  polyGrid: document.getElementById('polyGrid'),
  sampleBtn: document.getElementById('sampleBtn'),
  selectedSubjectTemplate: document.getElementById('selectedSubjectTemplate')
};

function init() {
  populateSubjectSelect();
  bindEvents();
  render();
}

function populateSubjectSelect() {
  SUBJECT_LIST.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject.name;
    option.textContent = `${subject.name} (${subject.levels.join('/')})`;
    els.subjectSelect.appendChild(option);
  });
}

function bindEvents() {
  els.addSubjectBtn.addEventListener('click', () => {
    addSubject(els.subjectSelect.value || els.subjectSearch.value.trim());
  });

  els.clearBtn.addEventListener('click', () => {
    state.selections = [];
    render();
  });

  els.sampleBtn.addEventListener('click', () => {
    state.selections = [
      { name: 'English Language', level: 'G3' },
      { name: 'Mathematics', level: 'G3' },
      { name: 'Science (Physics, Chemistry)', level: 'G3' },
      { name: 'Humanities (Social Studies, History)', level: 'G3' },
      { name: 'Computing', level: 'G2' }
    ];
    render();
  });

  els.subjectSearch.addEventListener('input', handleSearchInput);
  els.subjectSearch.addEventListener('focus', handleSearchInput);
  document.addEventListener('click', (event) => {
    if (!els.searchResults.contains(event.target) && event.target !== els.subjectSearch) {
      els.searchResults.style.display = 'none';
    }
  });
}

function handleSearchInput() {
  const query = els.subjectSearch.value.trim().toLowerCase();
  if (!query) {
    els.searchResults.style.display = 'none';
    return;
  }

  const results = SUBJECT_LIST
    .filter(subject => subject.name.toLowerCase().includes(query))
    .slice(0, 10);

  els.searchResults.innerHTML = '';
  if (!results.length) {
    els.searchResults.style.display = 'none';
    return;
  }

  results.forEach(subject => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${subject.name} (${subject.levels.join('/')})`;
    btn.addEventListener('click', () => {
      addSubject(subject.name);
      els.subjectSearch.value = '';
      els.searchResults.style.display = 'none';
    });
    els.searchResults.appendChild(btn);
  });
  els.searchResults.style.display = 'block';
}

function addSubject(name) {
  const subject = SUBJECT_MAP.get(name);
  if (!subject) return;
  const exists = state.selections.some(item => item.name === name);
  if (exists) return;
  state.selections.push({ name: subject.name, level: subject.levels[subject.levels.length - 1] });
  els.subjectSelect.value = '';
  els.subjectSearch.value = '';
  render();
}

function removeSubject(name) {
  state.selections = state.selections.filter(item => item.name !== name);
  render();
}

function updateSubjectLevel(name, level) {
  const item = state.selections.find(entry => entry.name === name);
  if (!item) return;
  item.level = level;
  render();
}

function computeMetrics() {
  const actual = { G1: 0, G2: 0, G3: 0 };
  const flags = {
    hasEnglishG2Plus: false,
    hasMathG2Plus: false,
    hasEnglishG3: false,
    hasMathG3: false,
    hasArtsG3: false,
    hasBusinessG3: false,
    hasICTG3: false,
    hasDesignG3: false,
    hasScienceG3: false
  };

  state.selections.forEach(selection => {
    actual[selection.level] += 1;
    const subject = SUBJECT_MAP.get(selection.name);
    const flagSet = new Set(subject.flags);

    if (flagSet.has('english') && (selection.level === 'G2' || selection.level === 'G3')) {
      flags.hasEnglishG2Plus = true;
    }
    if (flagSet.has('math') && (selection.level === 'G2' || selection.level === 'G3')) {
      flags.hasMathG2Plus = true;
    }
    if (flagSet.has('english') && selection.level === 'G3') {
      flags.hasEnglishG3 = true;
    }
    if (flagSet.has('polyMath') && selection.level === 'G3') {
      flags.hasMathG3 = true;
    }
    if ((flagSet.has('arts') || flagSet.has('polyArtsR1')) && selection.level === 'G3') {
      flags.hasArtsG3 = true;
    }
    if ((flagSet.has('business') || flagSet.has('polyBusinessR1')) && selection.level === 'G3') {
      flags.hasBusinessG3 = true;
    }
    if ((flagSet.has('computing') || flagSet.has('engineering') || flagSet.has('polyICTR1')) && selection.level === 'G3') {
      flags.hasICTG3 = true;
    }
    if ((flagSet.has('design') || flagSet.has('polyDesignR1')) && selection.level === 'G3') {
      flags.hasDesignG3 = true;
    }
    if ((flagSet.has('science') || flagSet.has('polySci')) && selection.level === 'G3') {
      flags.hasScienceG3 = true;
    }
  });

  const equivalent = {
    G1: actual.G1 + actual.G2 + actual.G3,
    G2: actual.G2 + actual.G3,
    G3: actual.G3
  };

  return { actual, equivalent, flags };
}

function evaluatePathways(metrics) {
  const { equivalent, flags, actual } = metrics;
  const cards = [];

  cards.push(makePathway(
    '3-Year Higher Nitec',
    equivalent.G1 >= 4 ? 'eligible' : 'not-yet',
    equivalent.G1 >= 4
      ? `You have ${equivalent.G1} G1-equivalent subject(s), which meets the threshold.`
      : `You currently have ${equivalent.G1} G1-equivalent subject(s). 4 are needed.`,
    'Can be opened by meeting the G1-level threshold. Higher-level subjects can count downward.'
  ));

  cards.push(makePathway(
    '2-Year / Accelerated Higher Nitec',
    equivalent.G1 >= 4 ? 'possible' : 'not-yet',
    equivalent.G1 >= 4
      ? 'The matrix suggests a Higher Nitec pathway is open, though duration and acceleration can depend on route and later performance.'
      : 'This typically appears only after the lower-level threshold is met first.',
    'Use this as a planning indicator rather than a guaranteed direct duration outcome.'
  ));

  const pfpEligible = equivalent.G2 >= 5 && flags.hasEnglishG2Plus && flags.hasMathG2Plus;
  cards.push(makePathway(
    'Polytechnic Foundation Programme (PFP)',
    pfpEligible ? 'eligible' : 'not-yet',
    pfpEligible
      ? 'You meet the threshold of at least 5 G2-equivalent subjects, including English and Mathematics at G2 or above.'
      : 'Needs at least 5 G2-equivalent subjects, plus English and Mathematics at G2 or above.',
    'This is competitive and course allocation can still depend on merit and vacancies.'
  ));

  cards.push(makePathway(
    'Year 2 Entry into Selected 3-Year Higher Nitec',
    pfpEligible ? 'eligible' : 'not-yet',
    pfpEligible
      ? 'You meet the same G2-level threshold used for this progression route.'
      : 'This appears only after the G2-level threshold is met, including English and Mathematics.',
    'Applies only to selected courses.'
  ));

  cards.push(makePathway(
    'NAFA Foundation Programme',
    pfpEligible ? 'possible' : 'not-yet',
    pfpEligible
      ? 'You meet the subject-level threshold that can make this route visible.'
      : 'Needs the same G2-level threshold as PFP-related routes.',
    'Academic results and audition or portfolio may still be required.'
  ));

  const artsEligible = equivalent.G3 >= 5 || (actual.G3 >= 4 && equivalent.G2 >= 5);
  cards.push(makePathway(
    'Arts Institutions',
    artsEligible ? 'possible' : 'not-yet',
    artsEligible
      ? 'Your subject mix meets the broad level threshold where arts pathways can become visible.'
      : 'Usually needs either at least 5 G3 subjects, or 4 G3 plus 1 G2-equivalent subject.',
    'Audition, portfolio, and course-specific requirements may apply.'
  ));

  const polyThreshold = actual.G3 >= 4 && equivalent.G2 >= 5;
  const polyLikely = polyThreshold && flags.hasEnglishG3 && flags.hasMathG3;
  cards.push(makePathway(
    'Polytechnic Year 1',
    polyLikely ? 'possible' : (polyThreshold ? 'possible' : 'not-yet'),
    polyThreshold
      ? 'You meet the 4 G3 + 1 G2-equivalent threshold. Detailed subject fit still matters, especially English and Mathematics at G3 for cluster-based routes.'
      : 'Needs at least 4 actual G3 subjects and 1 additional G2-equivalent subject.',
    'See the Polytechnic cluster section below for a more detailed fit check.'
  ));

  cards.push(makePathway(
    'Millennia Institute (MI)',
    equivalent.G3 >= 5 ? 'eligible' : 'not-yet',
    equivalent.G3 >= 5
      ? `You have ${equivalent.G3} G3 subject(s), which meets the MI subject-level condition.`
      : `You currently have ${equivalent.G3} G3 subject(s). 5 are needed.`,
    'Placement may still depend on merit and vacancies.'
  ));

  cards.push(makePathway(
    'Junior College (JC)',
    equivalent.G3 >= 5 ? 'eligible' : 'not-yet',
    equivalent.G3 >= 5
      ? `You have ${equivalent.G3} G3 subject(s), which meets the JC subject-level condition.`
      : `You currently have ${equivalent.G3} G3 subject(s). 5 are needed.`,
    'Placement may still depend on merit and vacancies.'
  ));

  return cards;
}

function evaluatePolyClusters(metrics) {
  const { actual, flags } = metrics;
  const threshold = actual.G3 >= 4 && (actual.G2 + actual.G3) >= 5;
  const hasB2 = actual.G2 + actual.G3 >= 5;

  const clusters = [
    {
      title: 'Arts (ELR2B2-A)',
      checks: {
        'Threshold met': threshold,
        'English at G3': flags.hasEnglishG3,
        'R1 Arts/Humanities at G3': flags.hasArtsG3,
        'Math / A Math at G3': flags.hasMathG3,
        'B2 other G2/G3 subject': hasB2
      }
    },
    {
      title: 'Business (ELR2B2-B)',
      checks: {
        'Threshold met': threshold,
        'English at G3': flags.hasEnglishG3,
        'R1 Business/Humanities at G3': flags.hasBusinessG3 || flags.hasArtsG3,
        'Math / A Math at G3': flags.hasMathG3,
        'B2 other G2/G3 subject': hasB2
      }
    },
    {
      title: 'ICT & Engineering (ELR2B2-C)',
      checks: {
        'Threshold met': threshold,
        'English at G3': flags.hasEnglishG3,
        'R1 ICT/Engineering/Science at G3': flags.hasICTG3 || flags.hasScienceG3,
        'Math / A Math at G3': flags.hasMathG3,
        'B2 other G2/G3 subject': hasB2
      }
    },
    {
      title: 'Design & Media (ELR2B2-D)',
      checks: {
        'Threshold met': threshold,
        'English at G3': flags.hasEnglishG3,
        'R1 Design/Arts at G3': flags.hasDesignG3 || flags.hasArtsG3,
        'Math / A Math at G3': flags.hasMathG3,
        'B2 other G2/G3 subject': hasB2
      }
    }
  ];

  return clusters.map(cluster => {
    const passed = Object.values(cluster.checks).filter(Boolean).length;
    const total = Object.keys(cluster.checks).length;
    const likely = passed === total;
    return {
      ...cluster,
      summary: likely
        ? 'Likely cluster fit based on current subject combination.'
        : threshold
          ? 'Threshold met, but one or more detailed subject conditions are still missing.'
          : 'Core Poly threshold is not yet met.'
    };
  });
}

function makePathway(title, state, reason, notes) {
  return { title, state, reason, notes };
}

function render() {
  renderSelections();
  const metrics = computeMetrics();
  renderSummary(metrics);
  renderFlags(metrics);
  renderProgress(metrics);
  renderPathways(evaluatePathways(metrics));
  renderPoly(evaluatePolyClusters(metrics));
}

function renderSelections() {
  els.selectedSubjects.innerHTML = '';
  if (!state.selections.length) {
    els.selectedSubjects.className = 'selected-list empty-state';
    els.selectedSubjects.textContent = 'No subjects added yet.';
    return;
  }

  els.selectedSubjects.className = 'selected-list';

  state.selections
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(selection => {
      const subject = SUBJECT_MAP.get(selection.name);
      const node = els.selectedSubjectTemplate.content.firstElementChild.cloneNode(true);
      node.querySelector('.selected-item__name').textContent = selection.name;
      const controls = node.querySelector('.selected-item__controls');
      subject.levels.forEach(level => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `level-btn ${selection.level === level ? 'is-active' : ''}`;
        btn.textContent = level;
        btn.addEventListener('click', () => updateSubjectLevel(selection.name, level));
        controls.appendChild(btn);
      });
      node.querySelector('.remove-btn').addEventListener('click', () => removeSubject(selection.name));
      els.selectedSubjects.appendChild(node);
    });
}

function renderSummary(metrics) {
  const cards = [
    ['Actual G1', metrics.actual.G1],
    ['Actual G2', metrics.actual.G2],
    ['Actual G3', metrics.actual.G3],
    ['G1-equivalent', metrics.equivalent.G1],
    ['G2-equivalent', metrics.equivalent.G2],
    ['G3 count', metrics.equivalent.G3]
  ];
  els.summaryCards.innerHTML = '';
  cards.forEach(([label, value]) => {
    const div = document.createElement('div');
    div.className = 'summary-card';
    div.innerHTML = `<div class="summary-card__value">${value}</div><div class="summary-card__label">${label}</div>`;
    els.summaryCards.appendChild(div);
  });
}

function renderFlags(metrics) {
  const items = [
    ['English at G2 or above', metrics.flags.hasEnglishG2Plus],
    ['Mathematics at G2 or above', metrics.flags.hasMathG2Plus],
    ['English at G3', metrics.flags.hasEnglishG3],
    ['Mathematics / A Math at G3', metrics.flags.hasMathG3],
    ['Arts-related G3 subject', metrics.flags.hasArtsG3],
    ['Business-related G3 subject', metrics.flags.hasBusinessG3],
    ['ICT / Engineering-related G3 subject', metrics.flags.hasICTG3],
    ['Design-related G3 subject', metrics.flags.hasDesignG3]
  ];
  els.flagsList.innerHTML = '';
  items.forEach(([label, ok]) => {
    els.flagsList.appendChild(makeStatusItem(label, ok ? 'Yes' : 'No', ok ? 'good' : 'bad'));
  });
}

function renderProgress(metrics) {
  const items = [
    ['Towards G1 threshold (4 needed)', `${metrics.equivalent.G1}/4`, metrics.equivalent.G1 >= 4 ? 'good' : 'warn'],
    ['Towards G2 threshold (5 needed)', `${metrics.equivalent.G2}/5`, metrics.equivalent.G2 >= 5 ? 'good' : 'warn'],
    ['Towards G3 threshold (5 needed)', `${metrics.equivalent.G3}/5`, metrics.equivalent.G3 >= 5 ? 'good' : 'warn'],
    ['Poly threshold (4 G3 + 1 G2-equivalent)', metrics.actual.G3 >= 4 && metrics.equivalent.G2 >= 5 ? 'Met' : 'Not yet', metrics.actual.G3 >= 4 && metrics.equivalent.G2 >= 5 ? 'good' : 'warn']
  ];
  els.progressList.innerHTML = '';
  items.forEach(([label, text, tone]) => {
    els.progressList.appendChild(makeStatusItem(label, text, tone));
  });
}

function renderPathways(cards) {
  els.pathwayGrid.innerHTML = '';
  cards.forEach(card => {
    const article = document.createElement('article');
    article.className = 'pathway-card';
    article.innerHTML = `
      <div class="pathway-card__header">
        <div class="pathway-card__title">${escapeHtml(card.title)}</div>
        <span class="badge badge--${toneForState(card.state)}">${labelForState(card.state)}</span>
      </div>
      <p class="pathway-card__reason">${escapeHtml(card.reason)}</p>
      <div class="pathway-card__notes">${escapeHtml(card.notes)}</div>
    `;
    els.pathwayGrid.appendChild(article);
  });
}

function renderPoly(clusters) {
  els.polyGrid.innerHTML = '';
  clusters.forEach(cluster => {
    const article = document.createElement('article');
    article.className = 'poly-card';
    const checks = Object.entries(cluster.checks)
      .map(([label, ok]) => `<li><span>${escapeHtml(label)}</span><span class="badge badge--${ok ? 'good' : 'bad'}">${ok ? 'Met' : 'Missing'}</span></li>`)
      .join('');
    article.innerHTML = `
      <h3>${escapeHtml(cluster.title)}</h3>
      <ul class="poly-card__list">${checks}</ul>
      <div class="poly-card__summary">${escapeHtml(cluster.summary)}</div>
    `;
    els.polyGrid.appendChild(article);
  });
}

function makeStatusItem(label, text, tone) {
  const li = document.createElement('li');
  li.className = 'status-item';
  li.innerHTML = `<span class="status-item__label">${escapeHtml(label)}</span><span class="badge badge--${tone}">${escapeHtml(text)}</span>`;
  return li;
}

function toneForState(state) {
  if (state === 'eligible') return 'good';
  if (state === 'possible') return 'info';
  return 'bad';
}

function labelForState(state) {
  if (state === 'eligible') return 'Eligible';
  if (state === 'possible') return 'Possible';
  return 'Not yet';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

init();
