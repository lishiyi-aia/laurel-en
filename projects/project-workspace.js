(() => {
  'use strict';
  const project = document.currentScript.dataset.project;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const node = (tag, className, html) => {
    const element = document.createElement(tag);
    element.className = className;
    if (html) element.innerHTML = html;
    return element;
  };
  const section = (id, heading, lead) => {
    const element = node('section', 'section', `<div class="section-head"><div><p class="kicker"></p><h2>${heading}</h2></div><p class="lead section-lead">${lead}</p></div>`);
    element.id = id;
    return element;
  };
  function bindTabs(buttons, callback) {
    function select(index) {
      buttons.forEach((button, i) => {
        button.setAttribute('aria-selected', String(index === i));
        button.tabIndex = index === i ? 0 : -1;
      });
      callback(index);
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : delta ? (index + delta + buttons.length) % buttons.length : null;
        if (next === null) return;
        event.preventDefault();
        select(next);
        buttons[next].focus();
      });
    });
    select(0);
    return select;
  }
  function explorer(target, id, label, items) {
    target.classList.add('project-explorer');
    target.innerHTML = `<div class="explorer-tabs" role="tablist" aria-label="${label}" aria-orientation="vertical">${items.map((item, i) => `<button type="button" role="tab" id="${id}-tab-${i}" aria-controls="${id}-detail"><span class="mono">0${i + 1}</span><span>${item.label}</span>${icon('arrow-right')}</button>`).join('')}</div><div class="explorer-detail" id="${id}-detail" role="tabpanel" tabindex="0"></div>`;
    const panel = $('.explorer-detail', target);
    bindTabs($$('.explorer-tabs button', target), i => {
      panel.setAttribute('aria-labelledby', `${id}-tab-${i}`);
      panel.innerHTML = `<p class="explorer-eyebrow">${items[i].eyebrow || label}</p><h3>${items[i].title}</h3><p class="explorer-copy">${items[i].copy}</p>${items[i].body || ''}`;
    });
  }
  const main = $('main');
  // Keep section IDs and existing tab listeners while moving content into the workflow.
  const sections = {};
  const ids = project === 'zus' ? ['overview', 'research', 'content', 'review', 'results'] : ['overview', 'feedback', 'content', 'pilot', 'results'];
  ids.forEach(id => {
    const original = document.getElementById(id);
    if (original.classList.contains('band')) {
      const inner = $('.section', original);
      original.removeAttribute('id');
      inner.id = id;
      sections[id] = inner;
    } else sections[id] = original;
  });
  let config;
  if (project === 'zus') {
    config = {
      title: 'ZUS Coffee', subtitle: 'Social Media & Launch Support', number: '03', eyebrow: 'INSTAGRAM / ENGLISH CONTENT',
      ownership: 'Research / Content planning<br>Production / English copy<br>Channel support / Review',
      note: 'Internal account data is not disclosed. Account screenshots and product references are not all my own work.',
      steps: [
        { id: 'research', title: 'Content research', sub: 'Define the message', icon: 'scan-search', sections: ['research', 'overview'] },
        { id: 'content', title: 'Content & assets', sub: 'Posts and product references', icon: 'images', sections: ['content'] },
        { id: 'channels', title: 'Channel support', sub: 'Publishing and purchase details', icon: 'network', sections: ['channels'] },
        { id: 'review', title: 'Content review', sub: 'Feedback and next steps', icon: 'chart-no-axes-combined', sections: ['review', 'results'] }
      ],
      metrics: [ ['50', 'Instagram posts', 'Production and publishing support', 'content'], ['15+', 'Content reviews', 'Completed during the internship', 'review'], ['11k+', 'Account follower growth', 'Overall project-period result', 'results'] ]
    };
    const evidence = $('.evidence', sections.content);
    const source = $('.hero-source');
    if (source) { source.classList.add('asset-source'); sections.content.append(source); }
    const channelLead = $('.lead p', sections.review).textContent;
    sections.channels = section('channels', 'Connect the post to purchasing details', channelLead);
    sections.channels.append($('.channel-steps', sections.review));
    $('.section-head h2', sections.review).textContent = 'Use feedback to plan the next post';
    $('.section-head .lead', sections.review).textContent = 'I tracked content weekly and completed 15+ reviews, using feedback to refine topics, formats and publishing cadence.';
    $('.section-head h2', sections.research).textContent = 'Decide what the post needs to say';
    const researchItems = $$('.research-item', sections.research);
    const topics = researchItems.map((item, i) => ({
      label: ['Audience preferences', 'Competitor content', 'Selected topic'][i], title: $('h3', item).textContent,
      copy: $('p', item).textContent,
      body: `<p class="explorer-takeaway">${$('small', item).textContent}</p>`
    }));
    explorer($('.research-grid', sections.research), 'zus-research', 'Research and topics', topics);
    const productProof = node('figure', 'research-product', '<img src="evidence/coffizz-product.png" alt="COFFIZZ product reference image" width="1080" height="1080"><figcaption>Product reference / Not my photography</figcaption>');
    $('.research-grid', sections.research).after(productProof);
    const researchBody = node('div', 'research-body');
    $('.research-grid', sections.research).before(researchBody);
    researchBody.append($('.research-grid', sections.research), productProof);
    const channelExplorer = node('div', 'channel-explorer');
    $('.channel-steps', sections.channels).before(channelExplorer);
    explorer(channelExplorer, 'zus-channel', 'Channel communication', [
      { label: 'Online launch', title: 'Keep product information, copy and timing consistent', copy: 'I helped organise launch assets and publishing schedules so that product visuals, English copy and release information matched.', body: '<dl class="explorer-rows"><div><dt>Prepare</dt><dd>Product assets, English captions, hashtags and purchase links.</dd></div><div><dt>Check</dt><dd>Product name, post theme, links and timing.</dd></div></dl>' },
      { label: 'FamilyMart', title: 'Help interested people find where to buy', copy: 'I supported FamilyMart retail communication by organising assets, store information, purchase links and schedules.', body: '<dl class="explorer-rows"><div><dt>Prepare</dt><dd>Confirmed store and channel details, with relevant product references.</dd></div><div><dt>Check</dt><dd>Store coverage, purchasing information and publishing arrangements.</dd></div></dl>' }
    ]);
    setupZusGallery(evidence);
  } else {
    config = {
      title: 'AI Education', subtitle: 'WeChat Content & Pilot Support', number: '02', eyebrow: 'USER EDUCATION / PRODUCT CONTENT',
      ownership: 'User feedback / Research<br>WeChat content / Materials<br>Training support / Suggestions',
      note: 'Internal feedback and records are not disclosed. Scenarios illustrate the approach, not direct user quotes.',
      steps: [
        { id: 'feedback', title: 'User needs', sub: 'Check the cause of questions', icon: 'scan-search', sections: ['feedback', 'overview'] },
        { id: 'content', title: 'WeChat content', sub: 'Build from scratch', icon: 'notebook-pen', sections: ['content'] },
        { id: 'resources', title: 'Product materials', sub: 'Turn questions into guidance', icon: 'files', sections: ['resources'] },
        { id: 'pilot', title: 'Pilot support', sub: 'Assist training and presentations', icon: 'presentation', sections: ['pilot'] },
        { id: 'results', title: 'Results', sub: 'Content and recommendations', icon: 'clipboard-check', sections: ['results'] }
      ],
      metrics: [ ['100+', 'Feedback items', 'From teachers, students and pilot users', 'feedback'], ['30+', 'Content pieces', 'Guides / FAQs / Tutorials / Use cases', 'content'], ['10+', 'Suggestions', 'Not necessarily all implemented', 'results'], ['0→1', 'WeChat content programme', 'Organised around user needs', 'content'] ]
    };
    sections.resources = section('resources', 'Turn questions into reference materials', 'I helped organise demos, FAQs, teacher use cases and course plans for product training and presentations.');
    const resources = node('div', 'resource-explorer');
    sections.resources.append(resources);
    const documents = [
      { label: 'Product demos', title: 'Show features in a practical sequence', copy: 'Work with the team to connect the task, key steps and resulting output in demo materials.', purpose: 'Support introductions and feature demonstrations', rows: [['Scenario', 'Start with teaching, lesson preparation or self-study'], ['Steps', 'Explain entry points, input requirements and key actions'], ['Output', 'Show how to view results and what to check']] },
      { label: 'FAQ', title: 'Bring recurring questions together', copy: 'Group common questions from feedback and help prepare answers and relevant notes.', purpose: 'Support self-service guidance and Q&A', rows: [['Question', 'Group by entry point, steps or results'], ['Answer', 'Add confirmed instructions and explanations'], ['Follow-up', 'Ask the relevant team to check unresolved questions']] },
      { label: 'Teacher use cases', title: 'Connect features to teaching tasks', copy: 'Help organise teacher use cases to explain which tasks the product supports.', purpose: 'Provide examples for training and presentations', rows: [['Task', 'Explain the need behind the case'], ['Process', 'Organise the product steps relevant to the task'], ['Context', 'Keep the background and notes needed to understand the case']] },
      { label: 'Course plans', title: 'Connect product use to course needs', copy: 'Help prepare course-related materials for training and pilot discussions.', purpose: 'Support course-related product discussions', rows: [['Needs', 'Summarise course needs from teacher and student feedback'], ['Materials', 'Organise relevant features, examples and instructions'], ['Feedback', 'Record questions that need additional guidance']] }
    ];
    explorer(resources, 'education-resource', 'How materials are organised', documents.map(item => ({ ...item, eyebrow: 'Illustrative structure, not internal documents', body: `<p class="resource-purpose">${item.purpose}</p><ol class="document-preview">${item.rows.map(([name, detail], i) => `<li><span>0${i + 1}</span><strong>${name}</strong><p>${detail}</p></li>`).join('')}</ol>` })));
    sections.resources.append($('.document-outline', sections.content));
    sections.resources.append(node('p', 'example-note', 'These examples show the organisation of materials. Internal documents, teacher identities and course details are not disclosed.'));
    const articles = $$('.content-item', sections.content);
    const contentNotes = [
      ['Entry points and first use', 'Entry point > Key features > First task', 'For users discovering the product.'],
      ['Features and practical steps', 'Task > Input requirements > Steps > Results', 'For users who need specific guidance after starting.'],
      ['Recurring usage questions', 'Question > Confirmed answer > Notes', 'Give repeated questions a lasting reference.'],
      ['Teaching, preparation and self-study', 'Need > Feature choice > Use case', 'Help users identify which features suit their task.']
    ];
    explorer($('.content-grid', sections.content), 'education-content', 'WeChat content types', articles.map((article, i) => ({
      label: $('h3', article).textContent, title: contentNotes[i][0], copy: $('p', article).textContent,
      body: `<div class="article-outline"><span>Content structure</span><p>${contentNotes[i][1]}</p></div><p class="explorer-takeaway">${contentNotes[i][2]}</p>`
    })));
    sections.content.append(node('div', 'content-connection', `${icon('files')}<div><strong>Online guidance and training materials answer the same questions</strong><p>WeChat content provides a lasting reference; product materials add specific steps and examples.</p></div><a href="#resources">Explore product materials ${icon('arrow-right')}</a>`));
    const stages = $$('.pilot-stage', sections.pilot);
    const handoffs = ['Common questions and missing guidance', 'Demos, FAQs, teacher use cases and course plans', 'Materials and content for training and presentations', '10+ suggestions for the relevant teams to consider'];
    explorer($('.pilot-stages', sections.pilot), 'education-pilot', 'Pilot support stages', stages.map((stage, i) => ({ label: $('h3', stage).textContent, title: $('h3', stage).textContent, copy: $('p', stage).textContent, body: `<dl class="explorer-rows"><div><dt>Output</dt><dd>${handoffs[i]}</dd></div><div><dt>Scope of responsibility</dt><dd>${i === 2 ? 'Provide materials and content to assist the team with training and presentations.' : 'Organise and support; the relevant teams confirm and use the materials.'}</dd></div></dl>` })));
    const path = $('.usage-path', sections.feedback);
    const pathHeading = path.previousElementSibling;
    const drawer = node('details', 'evidence-drawer usage-drawer', `<summary>${icon('route')}<span>User journey<small>Illustrative process, not conversion data</small></span>${icon('chevron-down')}</summary>`);
    sections.feedback.append(drawer);
    drawer.append(path);
    pathHeading.remove();
  }

  const totalSteps = config.steps.length;
  const totalLabel = String(totalSteps).padStart(2, '0');
  const workspace = node('div', 'workspace report');
  workspace.id = 'workspace';
  workspace.innerHTML = `<aside class="workspace-rail"><p class="rail-label">PROJECT WORKFLOW <span>05 STEPS</span></p><div class="workflow-tabs" role="tablist" aria-label="Project workflow" aria-orientation="vertical">${config.steps.map((step, i) => `<button type="button" role="tab" id="step-${step.id}" aria-controls="panel-${step.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-step="${i}"><span class="step-number">0${i + 1}</span><span class="step-text"><strong>${step.title}</strong><small>${step.sub}</small></span>${icon(step.icon)}</button>`).join('')}</div><div class="rail-ownership"><span>My contribution</span><p>${config.ownership}</p></div><p class="rail-note">${config.note}</p></aside><div class="workspace-body"><div class="workspace-toolbar"><span class="workspace-breadcrumb"></span><div class="workspace-actions"><button type="button" class="read-mode" aria-pressed="false">${icon('rows-3')}<span>Full case</span></button><a href="#results" class="tool-link">${icon('clipboard-check')}<span>Results</span>${icon('arrow-up-right')}</a></div></div><div class="workspace-panels"></div><nav class="workflow-footer" aria-label="Workflow navigation"><button type="button" class="step-prev" aria-label="Previous">${icon('arrow-left')}<span>Previous</span></button><span class="step-position" aria-live="polite"></span><button type="button" class="step-next"><span></span>${icon('arrow-right')}</button></nav></div>`;
  $('.rail-label span', workspace).textContent = `${totalLabel} STEPS`;
  const disclosure = $('.disclosure');
  const snapshot = $('.snapshot');
  snapshot.after(disclosure);
  disclosure.after(workspace);
  const panels = config.steps.map((step, i) => {
    const panel = node('div', 'workflow-panel');
    panel.id = `panel-${step.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `step-${step.id}`);
    panel.tabIndex = 0;
    step.sections.forEach(id => {
      const content = sections[id];
      content.classList.remove('wrap');
      if (id === 'overview') {
        const details = node('details', 'evidence-drawer responsibilities-drawer', `<summary>${icon('briefcase-business')}<span>Project context and my contribution</span>${icon('chevron-down')}</summary>`);
        details.append(content);
        panel.append(details);
      } else panel.append(content);
    });
    const firstHeading = $('.section-head .kicker', panel);
    firstHeading.textContent = `0${i + 1} / ${step.title}`;
    $('.workspace-panels', workspace).append(panel);
    return panel;
  });
  $$('main > .band').forEach(band => band.remove());
  document.body.classList.add('interactive-case', 'companion-case', `project-${project}`);
  $('.nav').classList.add('site-nav');
  $('.brand').classList.add('nav-brand');
  $('.brand > span:last-child').textContent = 'Portfolio';
  $('.hero-inner').classList.add('report');
  $('.eyebrow').textContent = `PROJECT ${config.number} / ${config.eyebrow}`;
  $('h1').textContent = config.title;
  $('h1').after(node('p', 'project-subtitle', config.subtitle));
  $('.hero-foot')?.remove();
  $$('.lead').forEach(lead => lead.classList.add('section-lead'));
  $('.nav-links').innerHTML = `<a href="#${config.steps[0].id}">The work</a><a href="#${project === 'zus' ? 'materials' : 'content'}">${project === 'zus' ? 'Assets' : 'WeChat content'}</a><a href="#results">Results</a>`;
  $('.metric-row').className = 'metric-strip companion-metrics';
  $('.metric-strip').innerHTML = config.metrics.map(([value, title, note, target]) => `<a class="summary-stat" href="#${target}"><strong>${value}</strong><span>${title}<small>${note}</small></span>${icon('arrow-up-right')}</a>`).join('');

  const resultMetrics = node('div', 'result-metrics');
  resultMetrics.innerHTML = config.metrics.slice(0, 3).map(([value, title, note]) => `<div><strong>${value}</strong><h3>${title}</h3><p>${note}</p></div>`).join('');
  $('.section-head', sections.results).after(resultMetrics);
  const resultLoop = node('a', 'review-loop', `${icon('corner-up-left')}<span><strong>${project === 'zus' ? 'Use the review to improve the next post' : 'Bring user feedback into content and materials'}</strong><small>${project === 'zus' ? 'Verify information > Refine topics and copy > Review after publishing' : 'Usage questions > Content updates / Product suggestions > Follow up'}</small></span>${icon('arrow-right')}`);
  resultLoop.href = `#${config.steps[0].id}`;
  sections.results.append(resultLoop);

  let active = 0;
  let fullRead = false;
  const tabs = $$('.workflow-tabs button', workspace);
  const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  function selectStep(index, { scroll = false, hash = true } = {}) {
    active = index;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = !fullRead && i !== index; });
    $('.workspace-breadcrumb').innerHTML = `<b>0${index + 1}</b> / ${totalLabel} <span>${config.steps[index].title}</span>`;
    $('.step-position').textContent = `0${index + 1} / ${totalLabel}`;
    $('.step-prev').disabled = index === 0;
    $('.step-next span').textContent = index === totalSteps - 1 ? `Back to ${config.steps[0].title}` : `Next: ${config.steps[index + 1].title}`;
    if (hash) history.pushState(null, '', `#${config.steps[index].id}`);
    if (scroll) {
      (fullRead ? panels[index] : workspace).scrollIntoView({ behavior: motion(), block: 'start' });
      panels[index].focus({ preventScroll: true });
    }
    if (matchMedia('(max-width: 900px)').matches) tabs[index].scrollIntoView({ behavior: motion(), block: 'nearest', inline: 'nearest' });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectStep(index, { scroll: true }));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? totalSteps - 1 : delta ? (index + delta + totalSteps) % totalSteps : null;
      if (next === null) return;
      event.preventDefault(); selectStep(next); tabs[next].focus({ preventScroll: true }); tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
  $('.step-next').addEventListener('click', () => selectStep((active + 1) % totalSteps, { scroll: true }));
  $('.step-prev').addEventListener('click', () => selectStep(Math.max(0, active - 1), { scroll: true }));
  $('.read-mode').addEventListener('click', () => {
    fullRead = !fullRead;
    workspace.classList.toggle('is-full-read', fullRead);
    $('.read-mode').setAttribute('aria-pressed', String(fullRead));
    $('.read-mode span').textContent = fullRead ? 'Step-by-step' : 'Full case';
    selectStep(active, { hash: false });
    workspace.scrollIntoView({ behavior: motion(), block: 'start' });
  });
  function showTarget(id, scroll = true) {
    if (project === 'zus' && ['content-product', 'content-scene', 'content-channel'].includes(id)) id = 'content';
    const target = document.getElementById(id);
    if (!target) return false;
    const index = panels.findIndex(panel => panel.contains(target));
    if (index < 0) return false;
    selectStep(index, { hash: false });
    const drawer = target.closest('details');
    if (drawer) drawer.open = true;
    if (target.matches('.panel, .decision-panel')) {
      const nestedTab = $(`[aria-controls="${target.id}"]`);
      nestedTab?.click();
    }
    if (scroll) (id === config.steps[index].id ? panels[index] : drawer || target).scrollIntoView({ behavior: motion(), block: 'start' });
    return true;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!showTarget(link.hash.slice(1))) return;
    event.preventDefault(); history.pushState(null, '', link.hash);
  });
  function followHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) selectStep(0, { hash: false, scroll: true });
    else showTarget(id);
  }
  window.addEventListener('hashchange', followHash);
  window.addEventListener('popstate', followHash);
  const narrow = matchMedia('(max-width: 900px)');
  function orientations() {
    $('.workflow-tabs').setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical');
    $$('.explorer-tabs').forEach(list => list.setAttribute('aria-orientation', getComputedStyle(list).display === 'flex' ? 'horizontal' : 'vertical'));
  }
  orientations();
  narrow.addEventListener('change', orientations);
  matchMedia('(max-width: 600px)').addEventListener('change', orientations);
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.6, 'aria-hidden': 'true' } });
  selectStep(0, { hash: false });
  if (location.hash) requestAnimationFrame(followHash);

  function setupZusGallery(evidence) {
    const feed = $('.feed', evidence);
    const materials = $$('.product-materials figure', evidence);
    const sourceImages = [feed, ...materials].map(figure => ({
      src: $('.photo-link', figure).getAttribute('href'), alt: $('img', figure).alt,
      caption: $('figcaption', figure).textContent
    }));
    sourceImages.push({ src: 'evidence/coffizz-launch.jpg', alt: 'COFFIZZ launch reference image', caption: 'COFFIZZ launch reference / Not my photography' });
    const labels = ['Account content', 'Product materials', 'Packaging', 'Launch reference'];
    const notes = [
      ['Instagram account content', 'The screenshot shows product, lifestyle and campaign posts.', 'My role covered planning, production, English copy and publishing support. Not all pictured content is my work.'],
      ['COFFIZZ product reference', 'Used to check the product name, packaging and information needed for content.', 'This is a product reference, not my photography or design work.'],
      ['COFFIZZ packaging reference', 'Used to check product information while organising communication materials.', 'Packaging is not presented as my design work.'],
      ['COFFIZZ launch reference', 'Shows product and brand information from the launch.', 'Brand materials provide context; I did not independently own the entire product launch.']
    ];
    const gallery = node('div', 'asset-gallery', `<div class="asset-tabs" role="tablist" aria-label="ZUS reference materials">${labels.map((label, i) => `<button type="button" role="tab" id="asset-tab-${i}" aria-controls="asset-detail">${label}</button>`).join('')}</div><div id="asset-detail" role="tabpanel" tabindex="0"><figure class="asset-visual"><img alt=""><button type="button" class="asset-zoom" aria-label="Enlarge image" title="Enlarge image">${icon('expand')}</button></figure><div class="asset-caption"><p class="asset-count mono"></p><h3></h3><p data-asset-context></p><p data-asset-credit class="asset-credit"></p><a class="asset-original" target="_blank" rel="noopener noreferrer">View original ${icon('arrow-up-right')}</a></div></div>`);
    gallery.id = 'materials';
    evidence.replaceWith(gallery);
    let current = 0;
    bindTabs($$('.asset-tabs button', gallery), i => {
      current = i;
      $('#asset-detail', gallery).setAttribute('aria-labelledby', `asset-tab-${i}`);
      $('.asset-visual img', gallery).src = sourceImages[i].src;
      $('.asset-visual img', gallery).alt = sourceImages[i].alt;
      $('.asset-count', gallery).textContent = `0${i + 1} / 04`;
      $('.asset-caption h3', gallery).textContent = notes[i][0];
      $('[data-asset-context]', gallery).textContent = notes[i][1];
      $('[data-asset-credit]', gallery).textContent = notes[i][2];
      $('.asset-original', gallery).href = sourceImages[i].src;
    });
    const dialog = node('dialog', 'asset-lightbox', `<header><h2 id="asset-lightbox-title">Original image</h2><button type="button" class="asset-close" aria-label="Close image" title="Close image" autofocus>${icon('x')}</button></header><div class="asset-lightbox-body"><img alt=""></div><p class="asset-lightbox-note"></p>`);
    dialog.setAttribute('aria-labelledby', 'asset-lightbox-title');
    document.body.append(dialog);
    let previousOverflow = '';
    $('.asset-zoom', gallery).addEventListener('click', () => {
      $('img', dialog).src = sourceImages[current].src;
      $('img', dialog).alt = sourceImages[current].alt;
      $('h2', dialog).textContent = notes[current][0];
      $('.asset-lightbox-note', dialog).textContent = sourceImages[current].caption;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    });
    $('.asset-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      $('.asset-zoom', gallery).focus({ preventScroll: true });
    });
  }
})();
