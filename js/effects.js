/* ============================================================
   Talla · طلّة — التأثيرات البصرية
   مؤشر مخصص، إضاءة تتبع الماوس، إمالة ثلاثية الأبعاد، بارالاكس،
   ظهور عند التمرير، عدّادات، أزرار مغناطيسية
   ============================================================ */

const Effects = (() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  let mx = innerWidth / 2, my = innerHeight / 2;   // الموضع الفعلي
  let rx = mx, ry = my, gx = mx, gy = my;          // مواضع متأخرة (ring / glow)
  let raf = null;

  /* ---------- المؤشر والتوهج ---------- */
  function initCursor() {
    if (coarse) { document.body.classList.add('no-cursor'); return; }
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const glow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-down'));
    document.addEventListener('mouseover', (e) => { if (e.target.closest('a, button, input, select, textarea, label, .chip, .key-card, summary')) document.body.classList.add('cursor-hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest('a, button, input, select, textarea, label, .chip, .key-card, summary')) document.body.classList.remove('cursor-hover'); });
    document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = '1'; });
    const loop = () => {
      rx = lerp(rx, mx, 0.22); ry = lerp(ry, my, 0.22);
      gx = lerp(gx, mx, 0.08); gy = lerp(gy, my, 0.08);
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- الإضاءة الموضعية على البطاقات ---------- */
  function initSpotlight() {
    if (coarse) return;
    document.addEventListener('mousemove', (e) => {
      const el = e.target.closest('.card, .spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- الإمالة ثلاثية الأبعاد ---------- */
  function initTilt() {
    if (coarse || reduced) return;
    document.addEventListener('mousemove', (e) => {
      const el = e.target.closest('.tilt');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) translateY(-6px)`;
      el.style.transition = 'transform .1s ease-out';
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('.tilt');
      if (!el || el.contains(e.relatedTarget)) return;
      el.style.transform = '';
      el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
    });
  }

  /* ---------- بارالاكس (الهيرو + الكرات الخلفية) ---------- */
  function initParallax() {
    if (coarse || reduced) return;
    const orbs = [...document.querySelectorAll('.orb')];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { tx = (e.clientX / innerWidth - 0.5); ty = (e.clientY / innerHeight - 0.5); }, { passive: true });
    const loop = () => {
      cx = lerp(cx, tx, 0.05); cy = lerp(cy, ty, 0.05);
      orbs.forEach((o, i) => { const d = (i + 1) * 18; o.style.translate = `${cx * d}px ${cy * d}px`; });
      document.querySelectorAll('.float-card[data-depth]').forEach(c => {
        const d = parseFloat(c.dataset.depth) * 22;
        c.style.transform = `translate3d(${-cx * d}px, ${-cy * d}px, 0) rotateY(${cx * 10}deg) rotateX(${-cy * 8}deg)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- الظهور عند التمرير ---------- */
  let io = null;
  function bindReveal(root = document) {
    if (!io) io = new IntersectionObserver((entries) => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    root.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  }

  /* ---------- العدّادات ---------- */
  function bindCounters(root = document) {
    root.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || '';
      const start = performance.now(), dur = 1600;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * e).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- الأزرار المغناطيسية ---------- */
  function initMagnetic() {
    if (coarse || reduced) return;
    document.addEventListener('mousemove', (e) => {
      const el = e.target.closest('[data-magnetic]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('[data-magnetic]');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
  }

  /* ---------- شريط التنقل عند التمرير ---------- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    const on = () => nav.classList.toggle('scrolled', scrollY > 10);
    addEventListener('scroll', on, { passive: true }); on();
  }

  function init() { initCursor(); initSpotlight(); initTilt(); initParallax(); initMagnetic(); initNavScroll(); }
  function bind(root) { bindReveal(root); bindCounters(root); }

  return { init, bind };
})();
