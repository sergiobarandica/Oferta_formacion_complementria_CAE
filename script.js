(function(){
  const COURSES = JSON.parse(document.getElementById('courses-data').textContent);
  const TIPOS = ['Regular', 'Campesena', 'Población Desplazada'];
  const TIPO_LABELS = { 'Regular': 'Formación Regular', 'Campesena': 'Campesena', 'Población Desplazada': 'Población Desplazada' };
  let state = { tipo: 'Regular', query: '', red: null, selected: null };

  document.getElementById('total-count').textContent = COURSES.length;

  function renderTabs() {
    const el = document.getElementById('tabs');
    el.innerHTML = '';
    TIPOS.forEach(t => {
      const count = COURSES.filter(c => c.tipo === t).length;
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (state.tipo === t ? ' active' : '');
      btn.innerHTML = TIPO_LABELS[t] + ' <span style="opacity:0.7;font-weight:500;">(' + count + ')</span>';
      btn.onclick = () => { state.tipo = t; state.red = null; state.query = ''; document.getElementById('search-input').value=''; render(); };
      el.appendChild(btn);
    });
  }

  function renderChips() {
    const el = document.getElementById('chips');
    el.innerHTML = '';
    const inTipo = COURSES.filter(c => c.tipo === state.tipo);
    const counts = {};
    inTipo.forEach(c => counts[c.red] = (counts[c.red]||0)+1);
    const reds = Object.keys(counts).sort();

    const allBtn = document.createElement('button');
    allBtn.className = 'chip-btn' + (state.red === null ? ' active' : '');
    allBtn.textContent = 'Todas las áreas';
    allBtn.onclick = () => { state.red = null; render(); };
    el.appendChild(allBtn);

    reds.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'chip-btn' + (state.red === r ? ' active' : '');
      btn.innerHTML = r + ' <span style="opacity:0.65;">' + counts[r] + '</span>';
      btn.onclick = () => { state.red = (state.red === r ? null : r); render(); };
      el.appendChild(btn);
    });
  }

  function renderGrid() {
    const inTipo = COURSES.filter(c => c.tipo === state.tipo);
    let filtered = inTipo;
    if (state.red) filtered = filtered.filter(c => c.red === state.red);
    const q = state.query.trim().toLowerCase();
    if (q) filtered = filtered.filter(c => c.nombre.toLowerCase().includes(q) || c.red.toLowerCase().includes(q));

    document.getElementById('results-label').textContent = filtered.length + ' programa' + (filtered.length===1?'':'s') + ' disponible' + (filtered.length===1?'':'s') + (state.red ? ' en ' + state.red : '');

    const grid = document.getElementById('grid');
    const noRes = document.getElementById('no-results');
    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.style.display = 'none';
      noRes.style.display = 'block';
      return;
    }
    grid.style.display = 'grid';
    noRes.style.display = 'none';
    filtered.forEach(c => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = '<div style="font-size:11px;font-weight:700;letter-spacing:0.04em;color:#39A900;text-transform:uppercase;">' + c.red + '</div>' +
        '<div style="font-family:\'Work Sans\',sans-serif;font-weight:700;font-size:18px;line-height:1.25;color:oklch(20% 0.015 150);flex:1;">' + c.nombre + '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;font-size:13px;color:oklch(48% 0.01 150);font-weight:500;"><span>⏱ ' + c.horas + ' horas</span><span style="opacity:0.4;">·</span><span>Cód. ' + c.codigo + '</span></div>';
      card.onclick = () => { state.selected = c; renderModal(); };
      grid.appendChild(card);
    });
  }

  function renderModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!state.selected) { overlay.style.display = 'none'; return; }
    const c = state.selected;
    document.getElementById('modal-red').textContent = c.red;
    document.getElementById('modal-nombre').textContent = c.nombre;
    document.getElementById('modal-horas').textContent = c.horas + ' horas';
    document.getElementById('modal-tipo').textContent = TIPO_LABELS[c.tipo];
    document.getElementById('modal-codigo').textContent = c.codigo + ' · v' + c.version;
    overlay.style.display = 'flex';
  }

  document.getElementById('search-input').addEventListener('input', e => { state.query = e.target.value; renderGrid(); });
  document.getElementById('modal-close').onclick = () => { state.selected = null; renderModal(); };
  document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target.id === 'modal-overlay') { state.selected = null; renderModal(); } });

  function render() { renderTabs(); renderChips(); renderGrid(); }
  render();
})();