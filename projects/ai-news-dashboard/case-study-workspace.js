(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const steps = [
    { id: 'overview', title: 'User needs', sub: 'Start with user questions', icon: 'scan-search', sections: ['overview'] },
    { id: 'campaigns', title: 'Acquisition', sub: 'From interest to trial', icon: 'route', sections: ['campaigns'] },
    { id: 'materials', title: 'Creative assets', sub: 'Explain the product value', icon: 'panels-top-left', sections: ['materials', 'content-test'] },
    { id: 'channels', title: 'Creators & channels', sub: 'Reach a relevant audience', icon: 'network', sections: ['channels'] },
    { id: 'research', title: 'Performance review', sub: 'From attention to first use', icon: 'chart-no-axes-combined', sections: ['sop', 'results', 'research'] }
  ];
  const sections = Object.fromEntries(steps.flatMap(step => step.sections).map(id => [id, document.getElementById(id)]));
  const main = $('main');
  const workspace = document.createElement('div');
  workspace.className = 'workspace report';
  workspace.id = 'workspace';
  workspace.innerHTML = `
    <aside class="workspace-rail">
      <p class="rail-label">PROJECT WORKFLOW <span>05 STEPS</span></p>
      <div class="workflow-tabs" role="tablist" aria-label="Project workflow" aria-orientation="vertical">
        ${steps.map((step, index) => `<button type="button" role="tab" id="step-${step.id}" aria-controls="panel-${step.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-step="${index}"><span class="step-number">0${index + 1}</span><span class="step-text"><strong>${step.title}</strong><small>${step.sub}</small></span>${icon(step.icon)}</button>`).join('')}
      </div>
      <div class="rail-ownership"><span>My contribution</span><p>Research / Campaign planning<br>Creative / Distribution<br>Creator support / Analysis</p></div>
      <p class="rail-note">Internal user records, creator identities and commercial quotes are not disclosed.</p>
    </aside>
    <div class="workspace-body">
      <div class="workspace-toolbar"><span class="workspace-breadcrumb"><b>01</b> / 05 <span>${steps[0].title}</span></span><div class="workspace-actions"><button type="button" class="read-mode" aria-pressed="false">${icon('rows-3')}<span>Full case</span></button><a href="operations_dashboard.html" class="tool-link">${icon('chart-no-axes-combined')}<span>Analysis dashboard</span>${icon('arrow-up-right')}</a></div></div>
      <div class="workspace-panels"></div>
      <nav class="workflow-footer" aria-label="Workflow navigation"><button type="button" class="step-prev" aria-label="Previous">${icon('arrow-left')}<span>Previous</span></button><span class="step-position" aria-live="polite">01 / 05</span><button type="button" class="step-next"><span>Next: ${steps[1].title}</span>${icon('arrow-right')}</button></nav>
    </div>`;
  main.prepend(workspace);

  // Move the original evidence and charts intact; old section URLs remain valid.
  const panels = steps.map((step, index) => {
    const panel = document.createElement('div');
    panel.className = 'workflow-panel';
    panel.id = `panel-${step.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `step-${step.id}`);
    panel.tabIndex = 0;
    step.sections.forEach(id => {
      const section = sections[id];
      section.classList.remove('report');
      if (id === 'content-test' || id === 'sop') {
        const details = document.createElement('details');
        details.className = 'evidence-drawer';
        details.innerHTML = `<summary>${icon(id === 'sop' ? 'chart-no-axes-combined' : 'split')}<span>${id === 'sop' ? 'Operations analysis tool' : 'Content comparison'}<small>${id === 'sop' ? 'Synthetic data / Method demonstration' : 'Reconstructed examples, not campaign screenshots'}</small></span>${icon('chevron-down')}</summary>`;
        if (id === 'sop') {
          details.classList.add('tool-drawer');
          details.open = true;
          $('.dashboard-shot', section).before($('.demo-footer', section));
        }
        details.append(section);
        panel.append(details);
      } else panel.append(section);
    });
    $('.workspace-panels', workspace).append(panel);
    panel.hidden = index !== 0;
    return panel;
  });
  $$('main > .band').forEach(band => band.remove());
  document.body.classList.add('interactive-case');

  $('.nav-links').innerHTML = `<a href="#overview">The work</a><a href="#materials">Creative assets</a><a href="#results">Results</a><a href="operations_dashboard.html">Analysis tool ${icon('arrow-up-right')}</a>`;
  $('.snapshot .metric-strip').innerHTML = `
    <a class="summary-stat" href="#materials"><strong>100<span>+</span></strong><span>Content pieces<small>WeChat / Xiaohongshu / Communities</small></span>${icon('arrow-up-right')}</a>
    <a class="summary-stat" href="#results"><strong>+50<span>%</span></strong><span>New registrations<small>Campaign period vs prior week</small></span>${icon('arrow-up-right')}</a>
    <a class="summary-stat" href="#research"><strong><small>~</small>+15<span>%</span></strong><span>First-topic creation rate<small>Relative growth / Overall period result</small></span>${icon('arrow-up-right')}</a>`;
  $('.hero-copy').textContent = 'I independently designed selected online acquisition campaigns, created promotional assets and handled relevant distribution. I also supported creator partnerships and tracked registration and first use.';
  $('#overview .kicker').textContent = '01 / USER UNDERSTANDING';
  $('#overview h2').textContent = 'Understand users before planning content';
  $('#overview .section-lead').textContent = 'Feedback and pricing surveys helped identify needs, willingness to pay and stages of use, informing when to introduce the product and when to offer practical guidance.';
  $('#campaigns .kicker').textContent = '02 / ACQUISITION CAMPAIGN';
  $('#campaigns h2').textContent = 'Turn interest into a first experience';
  $('#campaigns .section-lead').textContent = 'For product launches and trials, I independently designed selected online campaigns, prepared posters and content, and handled relevant distribution.';
  $('#channels .kicker').textContent = '04 / CREATORS & CHANNELS';
  $('#channels h2').textContent = 'One product, different ways to explain it';
  $('#channels .section-lead').textContent = 'I independently published and distributed relevant content, and supported finance and AI creator screening, asset preparation and publishing follow-up.';
  $('#results .kicker').textContent = '05 / RESULTS & REVIEW';
  $('#results h2').textContent = 'Look beyond registration to first use';
  $('#results .section-lead').textContent = 'These results summarise my internship period. Content performance, trackable product data and user feedback informed the next steps.';
  $('#research .section-head').hidden = true;
  $('#research .review-journey').hidden = true;

  let active = 0;
  let fullRead = false;
  const stepTabs = $$('.workflow-tabs [role="tab"]');
  const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const rootTarget = () => workspace.scrollIntoView({ behavior: motion(), block: 'start' });
  function selectStep(index, { scroll = false, hash = true } = {}) {
    active = index;
    stepTabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = !fullRead && i !== index;
    });
    $('.workspace-breadcrumb').innerHTML = `<b>0${index + 1}</b> / 05 <span>${steps[index].title}</span>`;
    $('.step-position').textContent = `0${index + 1} / 05`;
    $('.step-prev').disabled = index === 0;
    $('.step-next span').textContent = index === steps.length - 1 ? `Back to ${steps[0].title}` : `Next: ${steps[index + 1].title}`;
    $('.step-next').setAttribute('aria-label', $('.step-next span').textContent);
    if (hash) history.pushState(null, '', `#${steps[index].id}`);
    if (scroll) {
      if (fullRead) panels[index].scrollIntoView({ behavior: motion(), block: 'start' });
      else rootTarget();
      panels[index].focus({ preventScroll: true });
    }
    if (matchMedia('(max-width: 900px)').matches) stepTabs[index].scrollIntoView({ behavior: motion(), block: 'nearest', inline: 'nearest' });
  }
  stepTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectStep(index, { scroll: true }));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : delta ? (active + delta + 5) % 5 : null;
      if (next === null) return;
      event.preventDefault();
      selectStep(next);
      stepTabs[next].focus({ preventScroll: true });
      stepTabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
  $('.step-prev').addEventListener('click', () => selectStep(Math.max(0, active - 1), { scroll: true }));
  $('.step-next').addEventListener('click', () => selectStep((active + 1) % 5, { scroll: true }));
  $('.read-mode').addEventListener('click', () => {
    fullRead = !fullRead;
    workspace.classList.toggle('is-full-read', fullRead);
    $('.read-mode').setAttribute('aria-pressed', String(fullRead));
    $('.read-mode span').textContent = fullRead ? 'Step-by-step' : 'Full case';
    selectStep(active, { hash: false });
    rootTarget();
  });
  function followHash(scroll = true) {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const index = steps.findIndex(step => step.sections.includes(id));
    if (index < 0) return;
    selectStep(index, { hash: false });
    const section = sections[id];
    const drawer = section.closest('details');
    if (drawer) drawer.open = true;
    if (scroll) {
      const target = id === steps[index].id ? panels[index] : drawer || section;
      target.scrollIntoView({ behavior: motion(), block: 'start' });
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.hash.slice(1);
    if (!steps.some(step => step.sections.includes(id))) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    followHash();
  });
  window.addEventListener('popstate', () => {
    if (!location.hash) selectStep(0, { hash: false, scroll: true });
    else followHash();
  });
  window.addEventListener('hashchange', () => followHash());

  function selectableTabs(buttons, onSelect) {
    buttons.forEach((button, index) => {
      function select(i) {
        buttons.forEach((item, n) => { item.setAttribute('aria-selected', String(n === i)); item.tabIndex = n === i ? 0 : -1; });
        onSelect(i);
      }
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const i = event.key === 'ArrowRight' ? (index + 1) % buttons.length : event.key === 'ArrowLeft' ? (index + buttons.length - 1) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : null;
        if (i === null) return;
        event.preventDefault(); select(i); buttons[i].focus();
      });
    });
  }
  const needs = [
    ['Too much information. What is worth following?', 'Start with scattered information and repetitive searches so people can judge whether the product is useful to them.', 'Use the information-overload campaign to introduce news tracking, then explain the features.', 'Explore the product and try it.', '03-awareness.jpg', 'Information overload campaign'],
    ['Interested, but why try it now?', 'Explain the trial, participation steps and benefits to reduce hesitation between interest and action.', 'Prepare new-user trial materials with feature information and a clear entry point.', 'Enter the product and try it.', '04-activation.jpg', 'New-user trial offer'],
    ['I have registered. What should I do first?', 'Registration does not necessarily mean use. People need to know how to create their first topic.', 'Show topic creation in a feature poster, then collect questions through community support and trial surveys.', 'Create a topic and share feedback.', '08-topic-creation.png', 'Create a topic']
  ];
  selectableTabs($$('[data-need]'), index => {
    const [question, reason, action, next, file, title] = needs[index];
    $('.need-question').textContent = question;
    $('[data-need-reason]').textContent = reason;
    $('[data-need-action]').textContent = action;
    $('[data-need-next]').textContent = next;
    $('.need-evidence img').src = `event-materials/${file}`;
    $('.need-evidence img').alt = title;
    $('.need-evidence strong').textContent = title;
    $('#need-detail').setAttribute('aria-labelledby', $$('[data-need]')[index].id);
  });

  const campaignRoute = document.createElement('div');
  campaignRoute.className = 'campaign-flow';
  campaignRoute.innerHTML = `<div class="campaign-flow-label"><span>Product launch and trial promotion</span><span>Campaign path / Based on my work</span></div><ol>${[
    ['See the value', 'Launch and use-case posters', 'megaphone'], ['Build interest', 'Features and trial details', 'mouse-pointer-2'], ['Start using', 'Topic creation and support', 'square-plus'], ['Share feedback', 'Community discussions and surveys', 'messages-square']
  ].map(([name, detail, symbol], i) => `<li>${icon(symbol)}<span>0${i + 1}</span><h3>${name}</h3><p>${detail}</p></li>`).join('')}</ol><a class="evidence-jump" href="#materials">Explore the creative assets ${icon('arrow-right')}</a>`;
  $('#campaigns .section-head').after(campaignRoute);

  const materials = sections.materials;
  materials.classList.add('section');
  $('h3', materials).outerHTML = '<div class="section-head"><div><p class="kicker">03 / CONTENT & CREATIVE</p><h2>Every asset has a next step</h2></div><p class="section-lead">Content follows the user journey: product launch, feature education, trial, support and feedback.</p></div>';
  $('.materials-intro').hidden = true;
  const figures = $$('.campaign-material', materials);
  const materialNotes = [
    ['Introduce YouNews.', 'Clarify the positioning and create the poster copy and design.', 'Explore the features and open the product.'],
    ['Show how to start tracking.', 'Highlight the topic input and creation entry point.', 'Create a first topic.'],
    ['Explain the different reading options.', 'Show the overview, plain-language explanation and in-depth analysis side by side.', 'Choose a suitable reading mode.'],
    ['Show how the product fits into daily reading.', 'Use the digest screen to explain how topic updates are collected.', 'Follow topics and check new updates.'],
    ['Start with scattered information and repetitive searches.', 'Turn the tracking feature into a relatable use case.', 'Decide whether the product is relevant.'],
    ['Give interested users a reason to try.', 'Organise trial features, benefits and participation details.', 'Join the trial following the campaign instructions.'],
    ['Provide a place to ask questions.', 'Explain practical support, feature trials and the user community.', 'Join the community and discuss usage questions.'],
    ['Invite trial users to share problems and suggestions.', 'Explain eligibility, survey steps and incentives.', 'Complete the experience survey.']
  ];
  const viewer = document.createElement('div');
  viewer.className = 'creative-viewer';
  viewer.innerHTML = `<div class="creative-image"><img alt=""><button type="button" class="creative-zoom" aria-label="Enlarge poster" title="Enlarge poster">${icon('expand')}</button></div><div class="creative-annotation"><p class="creative-index">01 / 08</p><h3></h3><dl><div><dt>Purpose</dt><dd data-creative-purpose></dd></div><div><dt>My work</dt><dd data-creative-work></dd></div><div><dt>Next user action</dt><dd data-creative-next></dd></div></dl><p class="creative-credit">Copy & visual design / Laurel Li</p></div>`;
  $('.materials-credit').after(viewer);
  let selectedMaterial = 0;
  let openingLightbox = false;
  function selectMaterial(index) {
    selectedMaterial = index;
    const figure = figures[index];
    const source = $('img', figure);
    $('.creative-image img').src = source.src;
    $('.creative-image img').alt = source.alt;
    $('.creative-annotation h3').textContent = $('figcaption strong', figure).textContent;
    $('.creative-index').textContent = `0${index + 1} / 08`;
    $('[data-creative-purpose]').textContent = materialNotes[index][0];
    $('[data-creative-work]').textContent = materialNotes[index][1];
    $('[data-creative-next]').textContent = materialNotes[index][2];
    figures.forEach((item, i) => { item.classList.toggle('is-selected', i === index); $('a', item).setAttribute('aria-pressed', String(i === index)); });
  }
  figures.forEach((figure, index) => {
    const link = $('a', figure);
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', `Select poster: ${$('figcaption strong', figure).textContent}`);
    link.addEventListener('click', event => {
      if (openingLightbox || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); event.stopImmediatePropagation();
      selectMaterial(index);
    }, true);
    link.addEventListener('keydown', event => { if (event.key === ' ') { event.preventDefault(); link.click(); } });
  });
  $('.creative-zoom').addEventListener('click', () => {
    openingLightbox = true;
    try { $('a', figures[selectedMaterial]).click(); } finally { openingLightbox = false; }
  });
  $('.material-lightbox').addEventListener('close', () => $('.creative-zoom').focus({ preventScroll: true }));
  selectMaterial(0);

  const channelMap = $('.channel-map');
  const channels = [
    ['WeChat', 'Explain the full product value', 'Introductions, tutorials and industry use cases', 'Use longer-form content to explain features, use cases and practical steps.', 'Views, engagement and questions about features or use.'],
    ['Xiaohongshu', 'Lead with a specific use case', 'Use-case topics, headlines and covers', 'Build content around scattered information and repeated searches, refining headlines and copy.', 'Views, saves and needs expressed in comments.'],
    ['Communities', 'Help people move from interest to use', 'Distribution, support and feedback', 'Share relevant content, then use discussion questions to improve tutorials and FAQs.', 'Trackable visits and registrations, plus questions during use.']
  ];
  channelMap.innerHTML = `<div class="channel-select" role="tablist" aria-label="Distribution channels">${channels.map((item, i) => `<button type="button" id="channel-${i}" role="tab" aria-controls="channel-detail" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span>0${i + 1}</span>${item[0]}${icon('arrow-right')}</button>`).join('')}</div><div id="channel-detail" role="tabpanel" aria-labelledby="channel-0" tabindex="0"><span class="channel-content-label"></span><h3></h3><dl><div><dt>Content approach</dt><dd data-channel-action></dd></div><div><dt>After publishing</dt><dd data-channel-review></dd></div></dl></div>`;
  function selectChannel(index) {
    $('.channel-content-label').textContent = channels[index][2];
    $('#channel-detail h3').textContent = channels[index][1];
    $('[data-channel-action]').textContent = channels[index][3];
    $('[data-channel-review]').textContent = channels[index][4];
    $('#channel-detail').setAttribute('aria-labelledby', `channel-${index}`);
  }
  selectableTabs($$('.channel-select button'), selectChannel);
  selectChannel(0);

  const chartTabs = document.createElement('div');
  chartTabs.className = 'chart-tabs';
  chartTabs.setAttribute('role', 'tablist');
  chartTabs.setAttribute('aria-label', 'Review metrics');
  chartTabs.innerHTML = '<button type="button" role="tab" id="chart-registration" aria-controls="chart-0" aria-selected="true">New registrations <strong>+50%</strong></button><button type="button" role="tab" id="chart-activation" aria-controls="chart-1" aria-selected="false" tabindex="-1">First-topic creation rate <strong>~ +15%</strong></button>';
  $('.result-charts').before(chartTabs);
  const charts = $$('.result-chart');
  charts.forEach((chart, index) => {
    chart.id = `chart-${index}`;
    chart.setAttribute('role', 'tabpanel');
    chart.setAttribute('aria-labelledby', index === 0 ? 'chart-registration' : 'chart-activation');
    chart.tabIndex = 0;
    chart.hidden = index !== 0;
  });
  selectableTabs($$('.chart-tabs button'), index => charts.forEach((chart, i) => { chart.hidden = i !== index; }));
  const loop = document.createElement('a');
  loop.className = 'review-loop';
  loop.href = '#overview';
  loop.innerHTML = `${icon('corner-up-left')}<span><strong>Bring the findings into the next round</strong><small>User questions > Content updates / Product feedback > Review again</small></span>${icon('arrow-right')}`;
  $('#research').append(loop);

  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.6, 'aria-hidden': 'true' } });
  selectStep(0, { hash: false });
  if (location.hash) requestAnimationFrame(() => followHash());
  const narrow = matchMedia('(max-width: 900px)');
  const updateOrientation = () => $('.workflow-tabs').setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical');
  updateOrientation();
  narrow.addEventListener('change', updateOrientation);
})();
