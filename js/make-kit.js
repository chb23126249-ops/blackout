/* READY : ON — household material kit matcher */
(function (RO) {
  'use strict';

  const groups = [
    { id: 'kitchen', name: '주방', items: [
      ['bakingSoda', '베이킹소다'], ['vinegar', '식초'], ['salt', '소금'], ['oil', '식용유'],
      ['foil', '알루미늄 포일'], ['can', '빈 깡통·참치캔'], ['jar', '유리병·유리컵'],
      ['bottle', '페트병'], ['potLid', '냄비·뚜껑'], ['plasticBag', '비닐봉지'], ['filter', '커피필터·거름망']
    ]},
    { id: 'clean', name: '청소·욕실', items: [
      ['bleach', '가정용 락스'], ['towel', '수건·헌 옷'], ['bucket', '양동이'], ['tape', '청테이프'],
      ['newspaper', '신문지'], ['cardboard', '골판지 박스'], ['rope', '노끈·빨래줄'], ['litter', '톱밥·반려동물 모래']
    ]},
    { id: 'tools', name: '공구·전기', items: [
      ['wire', '전선·구리선'], ['nail', '못·나사'], ['motor', '폐전자기기 DC 모터'], ['bicycle', '자전거'],
      ['usb', '차량용 USB 충전기'], ['flashlight', 'LED·손전등'], ['lighter', '라이터·성냥'],
      ['scissors', '가위·칼'], ['hanger', '철사 옷걸이'], ['stick', '나무막대']
    ]},
    { id: 'outdoor', name: '야외·기타', items: [
      ['sand', '모래·흙'], ['gravel', '자갈'], ['charcoal', '숯·활성탄'], ['gauze', '거즈·생리대'],
      ['blanket', '담요'], ['rubberBand', '고무밴드']
    ]}
  ];

  // 기본값은 모든 물품을 선택하지 않습니다. 사용자가 보유 여부를 확인한 뒤에만 매칭합니다.
  const preset = ['salt', 'oil', 'foil', 'can', 'jar', 'bottle', 'potLid', 'plasticBag', 'filter',
    'towel', 'bucket', 'tape', 'newspaper', 'cardboard', 'rope', 'scissors', 'lighter', 'flashlight',
    'hanger', 'gauze', 'blanket', 'rubberBand'];

  const guides = [
    {
      id: 'thermal', name: '보온용 단열 공간', time: '약 20분', level: '간단',
      requires: [['골판지', ['cardboard']], ['신문지', ['newspaper']], ['포일', ['foil']], ['담요', ['blanket']], ['테이프', ['tape']]],
      description: '난방이 어려울 때 작은 공간을 정리하고 바닥의 냉기를 줄이는 준비입니다.',
      steps: ['집 안에서 창문과 외벽이 적은 작은 공간을 고릅니다.', '바닥에 골판지와 신문지를 깔고, 담요를 준비합니다.', '담요는 몸을 덮는 용도로 쓰고, 포일은 안전하게 고정할 수 있는 면에만 사용합니다.', '문·환기구·대피 동선을 막지 않도록 공간을 정리합니다.'],
      warning: '실내에서 숯·가스·장작을 태우지 마세요. 일산화탄소 중독 위험이 있습니다. 출입구와 환기구를 막지 말고, 구조가 불안정한 가구 아래에는 머물지 마세요.'
    },
    {
      id: 'toilet', name: '단수 대비 위생 꾸러미', time: '약 5분', level: '간단',
      requires: [['양동이', ['bucket']], ['비닐봉지', ['plasticBag']], ['흡수재', ['litter', 'sand', 'newspaper']], ['테이프', ['tape']]],
      description: '단수로 화장실을 사용할 수 없을 때를 대비해 필요한 물품을 한곳에 모아 둡니다.',
      steps: ['뚜껑이 있고 안정적으로 놓을 수 있는 양동이와 튼튼한 봉지를 준비합니다.', '흡수재와 여분 봉지를 가까이 보관합니다.', '사용 후 봉지는 새지 않게 묶고, 음식·생활 공간과 분리해 둡니다.', '폐기 방법은 지자체와 재난 당국의 안내를 확인합니다.'],
      warning: '락스나 다른 세정제를 분뇨에 직접 붓지 마세요. 다른 화학제품과 섞지 말고, 재난 당국의 위생·폐기 지침을 따르세요.'
    },
    {
      id: 'signal', name: '반사 구조 신호판', time: '약 10분', level: '간단',
      requires: [['포일', ['foil']], ['골판지', ['cardboard']], ['가위', ['scissors']]],
      description: '주변이 안전하고 구조대가 보일 때 위치를 알리는 반사판을 준비합니다.',
      steps: ['골판지를 손바닥보다 크게 잘라 모서리를 정리합니다.', '포일을 구겨지지 않게 붙이고 가장자리를 접어 고정합니다.', '구조대가 보이는 안전한 장소에서 판을 기울여 햇빛을 반사합니다.', '통신이 되면 119에 위치와 상황을 알립니다.'],
      warning: '구조 요청을 위해 위험한 장소로 이동하지 마세요. 반사광을 운전자나 항공기 조종사 쪽으로 비추지 말고, 레이저 포인터를 사용하지 마세요.'
    },
    {
      id: 'light', name: '손전등 확산 조명', time: '약 1분', level: '매우 간단',
      requires: [['손전등·LED', ['flashlight']], ['투명 페트병', ['bottle']]],
      description: '손전등 빛을 물이 든 투명한 병에 비춰 주변을 조금 더 넓게 밝히는 방법입니다.',
      steps: ['투명한 페트병에 물을 담고 뚜껑을 닫습니다.', '손전등을 병에 밀착시키거나 병 뒤쪽을 비춥니다.', '병과 손전등을 넘어지지 않는 평평한 곳에 둡니다.'],
      warning: '촛불이나 기름 램프 대신 배터리 손전등을 우선 사용하세요. 물이 전기제품이나 배터리 접점에 닿지 않게 하세요.'
    },
    {
      id: 'firstaid', name: '응급용품 한곳에 모으기', time: '약 5분', level: '간단',
      requires: [['거즈·생리대', ['gauze']], ['테이프', ['tape']], ['가위', ['scissors']], ['깨끗한 천', ['towel']]],
      description: '새로운 의료 도구를 만들지 않고, 이미 있는 기본 물품과 연락 정보를 한곳에 챙깁니다.',
      steps: ['포장 상태가 깨끗한 거즈와 테이프, 가위 등 기존 물품을 한 파우치에 모읍니다.', '가족의 비상 연락처와 알레르기·복용약 정보를 종이에 적어 함께 넣습니다.', '쉽게 꺼낼 수 있고 물에 젖지 않는 장소에 보관합니다.'],
      warning: '임의의 끈·천으로 지혈대를 만들지 마세요. 다치거나 출혈이 있으면 119에 연락하고, 응급상황에서는 상담원의 안내를 따르세요.'
    }
  ];

  const KEY = 'readyon.household-kit.v1';
  const inventory = new Set();
  const allItems = groups.flatMap((g) => g.items);
  const itemName = Object.fromEntries(allItems);
  let initialized = false;

  function readSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(saved)) saved.filter((id) => itemName[id]).forEach((id) => inventory.add(id));
    } catch (_) { /* 저장이 막힌 브라우저에서도 기능은 계속 작동합니다. */ }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify([...inventory])); } catch (_) { /* optional storage */ }
  }

  function hasItem(id) { return inventory.has(id); }
  function evaluate(recipe) {
    return recipe.requires.map(([label, ids]) => ({ label, have: ids.some(hasItem) })).filter((part) => !part.have);
  }

  function makeInventory() {
    const root = document.getElementById('makerMaterials');
    root.replaceChildren();
    groups.forEach((group) => {
      const section = document.createElement('fieldset');
      section.className = 'maker-material-group';
      const legend = document.createElement('legend');
      legend.innerHTML = `${group.name}<span data-material-count="${group.id}"></span>`;
      section.append(legend);
      const chips = document.createElement('div');
      chips.className = 'maker-material-chips';
      group.items.forEach(([id, name]) => {
        const label = document.createElement('label');
        label.className = 'maker-material-chip';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'household-material';
        input.value = id;
        input.checked = hasItem(id);
        input.addEventListener('change', () => {
          input.checked ? inventory.add(id) : inventory.delete(id);
          save();
          updateMatches();
        });
        const text = document.createElement('span');
        text.textContent = name;
        label.append(input, text);
        chips.append(label);
      });
      section.append(chips);
      root.append(section);
    });
  }

  function makeGuide(recipe) {
    const details = document.createElement('details');
    details.className = 'maker-guide';
    details.id = `maker-guide-${recipe.id}`;
    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="maker-guide-kicker">READY : ON</span><b>${recipe.name}</b><span class="maker-guide-meta">${recipe.level} · ${recipe.time}</span><span class="maker-match-tag" data-guide-match="${recipe.id}"></span>`;
    details.append(summary);
    const body = document.createElement('div');
    body.className = 'maker-guide-body';
    const intro = document.createElement('p');
    intro.textContent = recipe.description;
    const needed = document.createElement('p');
    needed.className = 'maker-needed';
    needed.textContent = `필요 물품: ${recipe.requires.map(([label]) => label).join(' · ')}`;
    const heading = document.createElement('h4');
    heading.textContent = '준비 순서';
    const list = document.createElement('ol');
    recipe.steps.forEach((step) => {
      const item = document.createElement('li');
      item.textContent = step;
      list.append(item);
    });
    const warning = document.createElement('p');
    warning.className = 'maker-warning';
    warning.innerHTML = `<b>안전 주의</b><span>${recipe.warning}</span>`;
    body.append(intro, needed, heading, list, warning);
    details.append(body);
    return details;
  }

  function makeGuides() {
    const root = document.getElementById('makerGuides');
    root.replaceChildren(...guides.map(makeGuide));
  }

  function updateMatches() {
    const list = document.getElementById('makerMatchList');
    const matches = guides.map((recipe) => ({ recipe, missing: evaluate(recipe) }));
    matches.sort((a, b) => (a.missing.length / a.recipe.requires.length) - (b.missing.length / b.recipe.requires.length));
    list.replaceChildren();
    matches.forEach(({ recipe, missing }) => {
      const row = document.createElement('article');
      row.className = `maker-match${missing.length ? '' : ' is-ready'}`;
      const top = document.createElement('div');
      top.className = 'maker-match-top';
      const name = document.createElement('b');
      name.textContent = recipe.name;
      const status = document.createElement('span');
      status.className = `maker-status${missing.length ? '' : ' is-ready'}`;
      status.textContent = missing.length ? `물품 ${missing.length}종 더 필요` : '필요 물품 확인됨';
      const button = document.createElement('button');
      button.className = 'maker-guide-link';
      button.type = 'button';
      button.textContent = '방법 보기';
      button.setAttribute('aria-controls', `maker-guide-${recipe.id}`);
      button.addEventListener('click', () => {
        const guide = document.getElementById(`maker-guide-${recipe.id}`);
        guide.open = true;
        guide.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        guide.querySelector('summary').focus({ preventScroll: true });
      });
      top.append(name, status, button);
      row.append(top);
      if (missing.length) {
        const missingText = document.createElement('p');
        missingText.className = 'maker-missing';
        missingText.textContent = `더 필요한 물품: ${missing.map((part) => part.label).join(' · ')}`;
        row.append(missingText);
      }
      list.append(row);
    });

    const readyCount = matches.filter(({ missing }) => !missing.length).length;
    document.getElementById('makerCount').textContent = readyCount;
    document.getElementById('makerTotal').textContent = `/ ${guides.length}개`;
    document.getElementById('makerProgress').style.width = `${Math.round((readyCount / guides.length) * 100)}%`;
    groups.forEach((group) => {
      const tag = document.querySelector(`[data-material-count="${group.id}"]`);
      const count = group.items.filter(([id]) => hasItem(id)).length;
      tag.textContent = `${count}/${group.items.length}`;
    });
    guides.forEach((recipe) => {
      const tag = document.querySelector(`[data-guide-match="${recipe.id}"]`);
      const missing = evaluate(recipe).length;
      tag.textContent = missing ? `물품 ${missing}종 더 필요` : '필요 물품 확인됨';
      tag.classList.toggle('is-ready', missing === 0);
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;
    readSaved();
    makeInventory();
    makeGuides();
    updateMatches();
    document.getElementById('makerPreset').addEventListener('click', () => {
      inventory.clear();
      preset.forEach((id) => inventory.add(id));
      save(); makeInventory(); updateMatches();
    });
    document.getElementById('makerClear').addEventListener('click', () => {
      inventory.clear(); save(); makeInventory(); updateMatches();
    });
  }

  RO.makeKit = { init };
})(window.RO);
