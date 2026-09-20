/* ============================================================
   Talla · طلّة — التطبيق: التوجيه، الأحداث، الإشعارات
   ============================================================ */

const App = (() => {
  const app = document.getElementById('app');
  const navActions = document.getElementById('nav-actions');
  const navLinks = document.getElementById('nav-links');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');

  /* ---------- Toast ---------- */
  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`; el.innerHTML = `<i></i><span>${msg}</span>`;
    toastRoot.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 3600);
  }
  const notify = (res) => { if (res && res.msg) toast(res.msg, res.ok ? 'ok' : 'bad'); return res; };

  /* ---------- Modal ---------- */
  function openModal(html) { modalRoot.innerHTML = `<div class="modal-bg" data-action="close-modal-bg">${html}</div>`; document.body.style.overflow = 'hidden'; Effects.bind(modalRoot); }
  function closeModal() { modalRoot.innerHTML = ''; document.body.style.overflow = ''; }

  /* ---------- Router ---------- */
  function parse() {
    const h = location.hash.slice(1) || '/';
    const [path, qs] = h.split('?');
    const q = Object.fromEntries(new URLSearchParams(qs || ''));
    const seg = path.split('/').filter(Boolean);
    return { path, seg, q };
  }

  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  function render() {
    closeModal();
    const { path, seg, q } = parse();
    const u = Store.user();
    let html = '';
    if (seg.length === 0) html = V.Home();
    else if (seg[0] === 'catalog') html = V.Catalog(q);
    else if (seg[0] === 'item') html = V.Item(seg[1]);
    else if (seg[0] === 'plans') html = V.Plans();
    else if (seg[0] === 'how') html = V.How();
    else if (seg[0] === 'owners') html = V.Owners();
    else if (seg[0] === 'about') html = V.About();
    else if (seg[0] === 'login') html = u ? V.Dashboard() : V.Login();
    else if (seg[0] === 'dashboard') html = u ? V.Dashboard(seg[1]) : V.Login();
    else html = `<div class="container"><div class="empty mt-4"><div class="big">🧭</div>الصفحة غير موجودة.<br><a href="#/" class="btn btn-outline btn-sm mt-2">الرئيسية</a></div></div>`;

    app.innerHTML = html;
    app.style.animation = 'none'; void app.offsetHeight; app.style.animation = '';
    renderNav(seg);
    Effects.bind(app);
    navLinks.classList.remove('open');
    if (!(seg[0] === 'catalog' && q._keep)) window.scrollTo({ top: 0, behavior: 'instant' });
    bindCalc();
    const key = app.querySelector('input.key'); if (key) setTimeout(() => key.focus(), 80);
  }

  function renderNav(seg) {
    const u = Store.user();
    const route = '/' + (seg[0] || '');
    navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.dataset.route === route));
    if (u) {
      navActions.innerHTML = `<a href="#/dashboard" class="user-chip" data-magnetic><div class="avatar">${V.initials(u.name)}</div><div class="meta"><b>${u.name.split(' ')[0]}</b><small>${ROLE_LABELS[u.role]}</small></div></a><button class="icon-btn" data-action="logout" title="تسجيل الخروج">${V.SVG.logout}</button>`;
    } else {
      navActions.innerHTML = `<a href="#/login" class="btn btn-ghost btn-sm">دخول</a><a href="#/plans" class="btn btn-gold btn-sm btn-dash">اشتركي الآن</a>`;
    }
  }

  /* ---------- حاسبة الأرباح ---------- */
  function bindCalc() {
    const r = document.getElementById('calc-range'); if (!r) return;
    const share = (100 - Store.get().settings.commission) / 100;
    const f = (x) => x.toLocaleString('en-US') + ' ر.س';
    r.addEventListener('input', () => {
      const v = Number(r.value), rate = Math.round(v * 0.04), s = Math.round(rate * share);
      document.getElementById('calc-val').textContent = f(v);
      document.getElementById('calc-rate').textContent = f(rate);
      document.getElementById('calc-share').textContent = f(s);
      document.getElementById('calc-year').textContent = f(s * 8);
    });
  }

  /* ---------- الأحداث ---------- */
  function requireLogin(res) { if (res && res.code === 'login') { toast(res.msg, 'bad'); setTimeout(() => go('#/login'), 600); return true; } return false; }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action, id = t.dataset.id;
    if (a === 'close-modal-bg') { if (e.target === t) closeModal(); return; }
    if (a === 'close-modal') { closeModal(); return; }
    if (t.tagName === 'BUTTON') e.preventDefault();

    switch (a) {
      case 'quick-login': { e.preventDefault(); const r = Store.login(t.dataset.key); if (r.ok) { toast(`أهلاً ${r.user.name.split(' ')[0]} — دخلتِ كـ${ROLE_LABELS[r.user.role]}`, 'ok'); go('#/dashboard'); } else toast(r.msg, 'bad'); break; }
      case 'logout': { e.preventDefault(); Store.logout(); toast('تم تسجيل الخروج. إلى اللقاء ✨', 'info'); go('#/'); break; }
      case 'wish': { const r = Store.toggleWishlist(id); if (requireLogin(r)) return; notify(r); render(); break; }
      case 'subscribe': {
        const u = Store.user(); if (!u) { go('#/login'); return; }
        const cur = Store.planOf(u.id); const p = Store.plan(id);
        if (!t.dataset.confirmed) { openModal(V.confirmModal(cur ? `تغيير الباقة إلى ${p.name}` : `الاشتراك في باقة ${p.name}`, `${p.price.toLocaleString('en-US')} ر.س شهرياً شاملة الضريبة، تُخصم من mada •••• 4821. ${cur ? 'يبدأ الفرق من الآن.' : 'يمكنك الإلغاء في أي وقت.'}`, 'subscribe', id, 'تأكيد الدفع')); return; }
        closeModal(); const r = notify(Store.subscribe(id)); if (r.ok) setTimeout(() => go('#/catalog'), 900); else render(); break;
      }
      case 'cancel-sub': { if (!t.dataset.confirmed) { openModal(V.confirmModal('إلغاء الاشتراك', 'سيتوقف التجديد التلقائي وتفقدين وصولك للقطع بنهاية الدورة الحالية.', 'cancel-sub', '', 'نعم، إلغاء', 'btn-danger')); return; } closeModal(); notify(Store.cancelSubscription()); render(); break; }
      case 'rent': { const r = Store.rent(id); if (requireLogin(r)) return; if (!r.ok) { toast(r.msg, 'bad'); if (r.code === 'plan') setTimeout(() => go('#/plans'), 600); return; } openModal(V.rentSuccess(Store.item(id), r.rental)); render(); break; }
      case 'return': { const rr = Store.rental(id); if (!t.dataset.confirmed && rr && rr.status === 'active') { openModal(V.confirmModal('إرجاع / تبديل القطعة', 'سيمرّ المندوب لاستلامها خلال ٢٤ ساعة وتتحرر خانتك فور تأكيد الاستلام.', 'return', id, 'تأكيد الإرجاع')); return; } closeModal(); notify(Store.requestReturn(id)); render(); break; }
      case 'extend': { notify(Store.extendRental(id)); render(); break; }
      case 'withdraw': { if (!t.dataset.confirmed) { openModal(V.confirmModal('سحب القطعة', 'ستُزال من التشكيلة ونرتّب إعادتها إليك خلال ٤٨ ساعة.', 'withdraw', id, 'تأكيد السحب', 'btn-danger')); return; } closeModal(); notify(Store.withdrawItem(id)); render(); break; }
      case 'relist': { notify(Store.relistItem(id)); render(); break; }
      case 'payout': { notify(Store.requestPayout()); render(); break; }
      case 'approve': { notify(Store.approveItem(id)); render(); break; }
      case 'reject': { openModal(V.rejectModal(Store.item(id))); break; }
      case 'authenticate': { notify(Store.authenticateItem(id)); render(); break; }
      case 'advance': { notify(Store.advanceRental(id)); render(); break; }
      case 'payout-ok': { notify(Store.approvePayout(id, true)); render(); break; }
      case 'payout-no': { notify(Store.approvePayout(id, false)); render(); break; }
      case 'toggle-user': { notify(Store.toggleUser(id)); render(); break; }
      case 'reset': { if (!t.dataset.confirmed) { openModal(V.confirmModal('إعادة تعيين البيانات', 'ستُحذف كل التغييرات المحلية وتعود البيانات التجريبية لحالتها الأصلية.', 'reset', '', 'إعادة التعيين', 'btn-danger')); return; } closeModal(); notify(Store.resetDemo()); render(); break; }
    }
  });

  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f).entries());
    switch (f.dataset.form) {
      case 'login': { const r = Store.login(data.key); if (r.ok) { toast(`أهلاً ${r.user.name.split(' ')[0]} — دخلتِ كـ${ROLE_LABELS[r.user.role]}`, 'ok'); go('#/dashboard'); } else { const err = document.getElementById('login-err'); if (err) err.textContent = r.msg; f.querySelector('input').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 300 }); } break; }
      case 'profile': { notify(Store.updateProfile(data)); render(); break; }
      case 'add-item': { const r = notify(Store.addItem(data)); if (r.ok) go('#/dashboard/items'); break; }
      case 'settings': { notify(Store.updateSettings({ commission: Number(data.commission), vat: Number(data.vat), deliveryHours: Number(data.deliveryHours), damageCover: Number(data.damageCover) })); render(); break; }
      case 'reject': { closeModal(); notify(Store.rejectItem(f.dataset.id, data.reason)); render(); break; }
    }
  });

  // فلاتر التشكيلة
  let searchT = null;
  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-search]')) {
      clearTimeout(searchT);
      searchT = setTimeout(() => { const { q } = parse(); const p = new URLSearchParams({ ...q, q: e.target.value, _keep: 1 }); if (!e.target.value) p.delete('q'); location.hash = '#/catalog?' + p.toString(); setTimeout(() => { const s = app.querySelector('[data-search]'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } }, 30); }, 260);
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-filter]')) { const { q } = parse(); const p = new URLSearchParams({ ...q, [e.target.dataset.filter]: e.target.value, _keep: 1 }); location.hash = '#/catalog?' + p.toString(); }
  });

  document.getElementById('burger').addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  addEventListener('hashchange', render);

  function init() {
    Effects.init();
    render();
    setTimeout(() => document.getElementById('page-loader').classList.add('hide'), 500);
  }
  return { init, toast, render, go };
})();

document.addEventListener('DOMContentLoaded', App.init);
