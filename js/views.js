/* ============================================================
   Talla · طلّة — الواجهات (Views)
   كل دالة تُرجع HTML كنص. الأحداث تُدار عبر data-action في app.js
   ============================================================ */

const V = (() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n = (x) => `<span class="num">${Number(x).toLocaleString('en-US')}</span>`;
  const money = (x) => `${n(x)} <small class="muted">ر.س</small>`;
  const fmtDate = (iso) => { if (!iso) return '—'; const d = new Date(iso); return `<span class="num">${d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' })}</span>`; };
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
  const daysLeft = (iso) => Math.max(0, daysBetween(Store.todayISO(), iso));
  const initials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('');

  const ICONS = {
    bags: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 24h40l3.5 28a4 4 0 0 1-4 4h-39a4 4 0 0 1-4-4z"/><path d="M22 24v-4a10 10 0 0 1 20 0v4"/><path d="M12 34h40"/><rect x="27" y="31" width="10" height="6" rx="2" fill="currentColor" stroke="none" opacity=".9"/></svg>',
    shoes: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 46c8-1 14-5 19-12l5-10 7 3-3 9c8 3 14 5 22 5v7H6z"/><path d="M27 24l3-12"/><path d="M6 46v6h50v-6"/></svg>',
    watches: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="14"/><path d="M32 24v8l5 4"/><path d="M24 18l2-10h12l2 10M24 46l2 10h12l2-10"/><circle cx="32" cy="32" r="18" opacity=".4"/></svg>',
    jewelry: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 14h28l10 14-24 28L8 28z"/><path d="M8 28h48M24 14l8 42 8-42M24 28l8-14 8 14"/></svg>',
    accessories: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="19" cy="34" r="11"/><circle cx="45" cy="34" r="11"/><path d="M30 32c1-2 3-2 4 0M8 30l4-10h40l4 10"/></svg>',
  };
  const ico = (cat) => ICONS[cat] || ICONS.bags;
  const SVG = {
    heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.5 5c2 0 3.4 1.1 4.2 2.3h2.6C14.1 6.1 15.5 5 17.5 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z"/></svg>',
    heartO: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.5 5c2 0 3.4 1.1 4.2 2.3h2.6C14.1 6.1 15.5 5 17.5 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    sparkle: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>',
    swap: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    wallet: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H6a2 2 0 0 0-2 2v2"/><circle cx="17" cy="14" r="1.5"/></svg>',
    box: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/></svg>',
    camera: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    list: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    gear: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  };

  const badge = (map, key, extra = '') => { const s = map[key] || { label: key, tone: 'muted' }; return `<span class="badge ${s.tone} ${extra}">${s.label}</span>`; };
  const tierBadge = (tier) => `<span class="badge tier-${tier}">${['', 'لؤلؤة', 'ذهب', 'ماس'][tier]}</span>`;
  const catBadge = (cat) => `<span class="badge muted">${CATEGORY_LABELS[cat] || cat}</span>`;
  const roleBadge = (role) => `<span class="badge ${{ admin: 'bad', ops: 'info', owner: 'violet', renter: 'gold' }[role]}">${ROLE_LABELS[role]}</span>`;
  const art = (it, cls = '') => `<div class="item-art ${cls} ${it.img ? 'has-img' : ''}" style="background:${it.art}">${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.brand)} ${esc(it.name)}" loading="lazy" onerror="this.parentNode.classList.remove('has-img');this.remove()">` : ''}<span class="brand-wm">${esc(it.brand)}</span>${ico(it.category)}<span class="shine"></span></div>`;
  const thumb = (it) => `<div class="thumb ${it.img ? 'has-img' : ''}" style="background:${it.art}">${it.img ? `<img src="${esc(it.img.replace('w=900', 'w=200'))}" alt="" loading="lazy" onerror="this.parentNode.classList.remove('has-img');this.remove()">` : ''}${ico(it.category)}</div>`;

  const itemCard = (it, opts = {}) => {
    const u = Store.user();
    const wished = u && Store.isWished(u.id, it.id);
    const status = it.status === 'available' ? '<span class="badge ok">متاحة الآن</span>' : it.status === 'rented' ? '<span class="badge gold">مؤجّرة حالياً</span>' : '<span class="badge info">قريباً</span>';
    return `
    <article class="card lift item-card tilt reveal" data-delay="${opts.delay || 0}">
      <div class="top-tags">${tierBadge(it.tier)}${status}</div>
      <button class="icon-btn wish ${wished ? 'active' : ''}" data-action="wish" data-id="${it.id}" aria-label="المفضلة">${wished ? SVG.heart : SVG.heartO}</button>
      <a href="#/item/${it.id}">${art(it)}</a>
      <div class="body">
        <span class="brand">${esc(it.brand)}</span>
        <h3><a href="#/item/${it.id}">${esc(it.name)}</a></h3>
        <div class="row" style="gap:6px">${catBadge(it.category)}${it.size ? `<span class="badge muted">مقاس ${it.size}</span>` : ''}</div>
        <div class="price">
          <div><small>القيمة السوقية</small><b class="muted" style="font-weight:500">${money(it.retail)}</b></div>
          <div style="text-align:end"><small>ضمن باقتك من</small><b class="gold-text">${['', 'لؤلؤة', 'ذهب', 'ماس'][it.tier]}</b></div>
        </div>
        <a href="#/item/${it.id}" class="btn ${it.status === 'available' ? 'btn-gold' : 'btn-ghost'} btn-sm btn-block mt-1">${it.status === 'available' ? 'استأجري الآن' : 'عرض التفاصيل'}</a>
      </div>
    </article>`;
  };

  /* ================= HOME ================= */
  function Home() {
    const S = Store.get();
    const featured = Store.publicItems().filter(i => i.status === 'available').slice(0, 8);
    const [f1, f2, f3] = [Store.item('i2'), Store.item('i1'), Store.item('i11')];
    const brands = ['CHANEL', 'HERMÈS', 'DIOR', 'LOUIS VUITTON', 'CARTIER', 'ROLEX', 'GUCCI', 'PRADA', 'BOTTEGA VENETA', 'SAINT LAURENT', 'VAN CLEEF & ARPELS', 'FENDI'];
    return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow"><span class="dot"></span> متاح الآن في الرياض · جدة · الدمام · الخبر</span>
          <h1>
            <span class="line"><span>خزانتكِ الفاخرة…</span></span>
            <span class="line"><span class="gold-text">بالاشتراك الشهري</span></span>
            <span class="line"><span>لا بالشراء.</span></span>
          </h1>
          <p class="lead">استأجري حقائب وأحذية وساعات ومجوهرات من أرقى الدور العالمية، موثّقة ومؤمّنة ومعقّمة، تصلك لبابك خلال ٢٤ ساعة. طلّة جديدة كل شهر، بلا التزام.</p>
          <div class="hero-cta">
            <a href="#/catalog" class="btn btn-gold btn-lg" data-magnetic>تصفّحي التشكيلة</a>
            <a href="#/plans" class="btn btn-ghost btn-lg" data-magnetic>شاهدي الباقات</a>
          </div>
          <div class="hero-stats">
            <div class="stat"><b data-count="${S.items.length * 47}">0</b><span>قطعة فاخرة موثّقة</span></div>
            <div class="stat"><b data-count="1200" data-suffix="+">0</b><span>مشتركة سعيدة</span></div>
            <div class="stat"><b data-count="98" data-suffix="%">0</b><span>نسبة رضا العميلات</span></div>
          </div>
        </div>
        <div class="hero-visual" id="hero-visual">
          <div class="hero-ring"></div>
          <div class="float-card fc1" data-depth="0.9">${art(f1)}<div class="fc-body"><b>${f1.brand}</b><span>${f1.name}</span></div></div>
          <div class="float-card fc2" data-depth="0.5">${art(f2)}<div class="fc-body"><b>${f2.brand}</b><span>${f2.name}</span></div></div>
          <div class="float-card fc3" data-depth="0.3">${art(f3)}<div class="fc-body"><b>${f3.brand}</b><span>${f3.name}</span></div></div>
        </div>
      </div>
    </section>

    <div class="marquee"><div class="marquee-track">${[...brands, ...brands].map(b => `<span>${b}</span>`).join('')}</div></div>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <div><span class="kicker">كيف يعمل</span><h2>أربع خطوات… وتتألقين</h2><p>نظام اشتراك شهري بسيط: اختاري، استلمي، تألّقي، بدّلي.</p></div>
        </div>
        <div class="steps">
          ${[
            ['اختاري باقتك', 'لؤلؤة أو ذهب أو ماس — حسب عدد القطع التي تريدينها معك في نفس الوقت.', SVG.sparkle],
            ['اختاري قطعك', 'تصفّحي مئات القطع الأصلية من أرقى الدور واحجزيها بضغطة.', SVG.search],
            ['استلميها لبابك', 'توصيل فاخر خلال ٢٤ ساعة مع شهادة أصالة وتغليف يليق بكِ.', SVG.truck],
            ['بدّلي أو مدّدي', 'في نهاية الشهر أعيديها مجاناً واختاري غيرها، أو مدّدي إن أحببتِها.', SVG.swap],
          ].map((s, i) => `<div class="card lift step reveal" data-delay="${i}"><div class="ic">${s[2]}</div><div class="n">0${i + 1}</div><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:20px">
      <div class="container">
        <div class="section-head reveal">
          <div><span class="kicker">التشكيلة</span><h2>قطع مختارة هذا الأسبوع</h2><p>كل قطعة موثّقة من فريقنا، ومعقّمة، ومؤمّنة بالكامل.</p></div>
          <a href="#/catalog" class="btn btn-outline">كل القطع ${SVG.arrow}</a>
        </div>
        <div class="items-grid">${featured.map((it, i) => itemCard(it, { delay: i % 4 })).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal center" style="justify-content:center;text-align:center"><div><span class="kicker">الباقات</span><h2>اختاري ما يناسب إيقاع حياتك</h2><p style="margin-inline:auto">كل الباقات تشمل التوصيل والاستلام والتنظيف والتأمين الكامل.</p></div></div>
        <div class="plans-grid">${S.plans.map((p, i) => planCard(p, i)).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div class="reveal">
          <span class="kicker">للمالكات</span>
          <h2 style="font-size:clamp(1.7rem,3vw,2.5rem);font-weight:900;line-height:1.2">حقائبكِ النائمة في الخزانة… يمكنها أن تعمل لأجلك</h2>
          <p class="muted mt-2">سجّلي قطعك الفاخرة معنا، ونتكفّل بكل شيء: الاستلام، التوثيق، التصوير، التخزين الآمن، التنظيف، والتأمين. وتحصلين على <b class="gold-text">${100 - S.settings.commission}%</b> من قيمة الإيجار في كل مرة تُستأجر فيها قطعتك.</p>
          <div class="feature-list">
            <div class="feature"><div class="ic">${SVG.shield}</div><div><b>تأمين شامل</b><p>كل قطعة مؤمّنة ضد الأضرار والفقدان طوال فترة وجودها لدينا.</p></div></div>
            <div class="feature"><div class="ic">${SVG.wallet}</div><div><b>دخل شهري</b><p>تحويل بنكي شهري إلى حسابك مع تقرير مفصّل لكل قطعة.</p></div></div>
            <div class="feature"><div class="ic">${SVG.box}</div><div><b>تحكّم كامل</b><p>اسحبي قطعتك متى شئتِ بإشعار مسبق، ونعيدها إليك معقّمة.</p></div></div>
          </div>
          <a href="#/owners" class="btn btn-gold mt-3" data-magnetic>ابدئي الربح من قطعك</a>
        </div>
        <div class="card violet reveal" data-delay="1" style="padding:30px">
          <h3 style="margin-bottom:18px">حاسبة الأرباح التقديرية</h3>
          <div class="field"><label>القيمة السوقية للقطعة (ر.س)</label><input type="range" min="2000" max="80000" step="500" value="24000" id="calc-range" style="height:auto;padding:0;accent-color:#d8b25c"></div>
          <div class="row between"><span class="muted">قيمة القطعة</span><b id="calc-val">${n(24000)} ر.س</b></div>
          <div class="row between mt-1"><span class="muted">قيمة الإيجار الشهرية (~٤٪)</span><b id="calc-rate">${n(960)} ر.س</b></div>
          <div class="row between mt-1"><span class="muted">حصتك (${100 - S.settings.commission}٪) لكل شهر إيجار</span><b class="gold-text" id="calc-share" style="font-size:1.4rem">${n(Math.round(960 * (100 - S.settings.commission) / 100))} ر.س</b></div>
          <div class="row between mt-1"><span class="muted">تقدير سنوي عند ٨ أشهر إيجار</span><b id="calc-year">${n(Math.round(960 * (100 - S.settings.commission) / 100 * 8))} ر.س</b></div>
          <p class="small muted mt-2">* أرقام تقديرية تعتمد على الطلب وفئة القطعة وحالتها.</p>
        </div>
      </div>
    </section>

    ${VisionTeaser()}
    <section class="section">
      <div class="container">
        <div class="section-head reveal"><div><span class="kicker">آراء المشتركات</span><h2>قصص من خزانات سعودية</h2></div></div>
        <div class="testi-grid">${S.testimonials.map((t, i) => `<div class="card lift testi reveal" data-delay="${i}"><div class="stars">★★★★★</div><q>${t.text}</q><div class="row"><div class="avatar">${initials(t.name)}</div><div><b>${t.name}</b><br><small class="muted">${t.city}</small></div></div></div>`).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-banner spot reveal">
          <h2>جاهزة لتجربة <span class="gold-text">الفخامة بلا حدود</span>؟</h2>
          <p>انضمي لأكثر من ١٢٠٠ مشتركة في المملكة. أول شهر يشمل تبديلاً إضافياً مجاناً.</p>
          <div class="row" style="justify-content:center"><a href="#/plans" class="btn btn-gold btn-lg" data-magnetic>ابدئي اشتراكك</a><a href="#/login" class="btn btn-ghost btn-lg" data-magnetic>جرّبي الحسابات التجريبية</a></div>
        </div>
      </div>
    </section>`;
  }

  function planCard(p, i, opts = {}) {
    const u = Store.user();
    const cur = u && Store.planOf(u.id);
    const isCur = cur && cur.id === p.id;
    let btn;
    if (isCur) btn = `<button class="btn btn-ghost btn-block" disabled>باقتك الحالية</button>`;
    else if (u && u.role === 'renter') btn = `<button class="btn ${p.featured ? 'btn-gold' : 'btn-ghost'} btn-block" data-action="subscribe" data-id="${p.id}">${cur ? (p.tier > cur.tier ? 'ترقية إلى ' + p.name : 'تغيير إلى ' + p.name) : 'اشتركي في ' + p.name}</button>`;
    else btn = `<a href="#/login" class="btn ${p.featured ? 'btn-gold' : 'btn-ghost'} btn-block">اشتركي في ${p.name}</a>`;
    return `<div class="card lift plan reveal ${p.featured ? 'featured' : ''}" data-delay="${i}">
      ${p.featured ? '<span class="ribbon">الأكثر طلباً</span>' : ''}
      <div class="pname"><i style="color:${p.color};background:${p.color}"></i>${p.name}</div>
      <div class="muted small">${p.tagline}</div>
      <div class="pprice">${n(p.price)} <small>ر.س / شهرياً</small></div>
      <div class="row" style="gap:6px"><span class="badge muted">${p.slots} ${p.slots === 1 ? 'قطعة' : 'قطع'} معكِ</span><span class="badge muted">${p.swaps > 50 ? 'تبديل غير محدود' : p.swaps + ' تبديل'}</span></div>
      <ul>${p.perks.map(x => `<li>${x}</li>`).join('')}</ul>
      ${btn}
    </div>`;
  }

  /* ================= CATALOG ================= */
  function Catalog(q = {}) {
    const S = Store.get();
    let items = Store.publicItems();
    const cat = q.cat || 'all', tier = q.tier || 'all', sort = q.sort || 'new', search = (q.q || '').toLowerCase();
    if (cat !== 'all') items = items.filter(i => i.category === cat);
    if (tier !== 'all') items = items.filter(i => i.tier === Number(tier));
    if (search) items = items.filter(i => (i.name + ' ' + i.brand + ' ' + (CATEGORY_LABELS[i.category] || '')).toLowerCase().includes(search));
    if (sort === 'new') items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'pop') items.sort((a, b) => b.likes - a.likes);
    if (sort === 'high') items.sort((a, b) => b.retail - a.retail);
    if (sort === 'low') items.sort((a, b) => a.retail - b.retail);
    if (sort === 'avail') items.sort((a, b) => (a.status === 'available' ? -1 : 1) - (b.status === 'available' ? -1 : 1));
    const link = (k, v) => `#/catalog?${new URLSearchParams({ ...q, [k]: v }).toString()}`;
    return `
    <div class="container">
      <div class="page-head reveal in"><span class="kicker">التشكيلة</span><h1>قطع تليق بكِ</h1><p>${S.items.filter(i => i.status !== 'pending').length} قطعة أصلية موثّقة من ${new Set(S.items.map(i => i.brand)).size} داراً عالمية</p></div>
      <div class="filters">
        <div class="chips">
          <a class="chip ${cat === 'all' ? 'active' : ''}" href="${link('cat', 'all')}">الكل</a>
          ${Object.entries(CATEGORY_LABELS).map(([k, v]) => `<a class="chip ${cat === k ? 'active' : ''}" href="${link('cat', k)}">${v}</a>`).join('')}
        </div>
        <div class="grow"></div>
        <label class="search">${SVG.search}<input type="search" placeholder="ابحثي عن دار أو قطعة…" value="${esc(q.q || '')}" data-search></label>
        <select class="select" data-filter="tier"><option value="all" ${tier === 'all' ? 'selected' : ''}>كل الفئات</option><option value="1" ${tier === '1' ? 'selected' : ''}>فئة لؤلؤة</option><option value="2" ${tier === '2' ? 'selected' : ''}>فئة ذهب</option><option value="3" ${tier === '3' ? 'selected' : ''}>فئة ماس</option></select>
        <select class="select" data-filter="sort"><option value="new" ${sort === 'new' ? 'selected' : ''}>الأحدث</option><option value="pop" ${sort === 'pop' ? 'selected' : ''}>الأكثر إعجاباً</option><option value="avail" ${sort === 'avail' ? 'selected' : ''}>المتاحة أولاً</option><option value="high" ${sort === 'high' ? 'selected' : ''}>الأعلى قيمة</option><option value="low" ${sort === 'low' ? 'selected' : ''}>الأقل قيمة</option></select>
      </div>
      ${items.length ? `<div class="items-grid stagger">${items.map((it, i) => itemCard(it, { delay: i % 4 })).join('')}</div>` : `<div class="empty"><div class="big">👜</div>لا توجد قطع تطابق بحثك.<br><a href="#/catalog" class="btn btn-outline btn-sm mt-2">مسح الفلاتر</a></div>`}
      <div style="height:60px"></div>
    </div>`;
  }

  /* ================= ITEM ================= */
  function Item(id) {
    const it = Store.item(id);
    if (!it || ['pending', 'rejected', 'withdrawn', 'authenticating'].includes(it.status)) return `<div class="container"><div class="empty mt-4"><div class="big">🔍</div>القطعة غير موجودة أو غير متاحة للعرض.<br><a href="#/catalog" class="btn btn-outline btn-sm mt-2">العودة للتشكيلة</a></div></div>`;
    const S = Store.get(); const u = Store.user(); const owner = Store.userById(it.ownerId);
    const wished = u && Store.isWished(u.id, it.id);
    const cr = Store.currentRentalOfItem(it.id);
    const can = Store.canRent(it.id);
    let cta;
    if (it.status !== 'available') cta = `<div class="notice warn"><span>${it.status === 'rented' ? `مؤجّرة حالياً${cr ? ' — تعود متاحة حوالي ' + fmtDate(cr.end) : ''}` : 'في مرحلة التنظيف والتعقيم، ستتاح خلال أيام'}.</span></div><button class="btn btn-ghost btn-lg btn-block mt-2" data-action="wish" data-id="${it.id}">${wished ? 'في مفضلتك ♥ — سنُشعرك عند توفرها' : 'أشعريني عند توفرها'}</button>`;
    else if (can.ok) cta = `<button class="btn btn-gold btn-lg btn-block" data-action="rent" data-id="${it.id}" data-magnetic>استأجري الآن — ضمن اشتراكك</button><p class="small muted center mt-1">لديكِ ${Store.planOf(u.id).slots - Store.slotsUsed(u.id)} خانة متاحة في باقة ${Store.planOf(u.id).name}</p>`;
    else if (can.code === 'login') cta = `<a href="#/login" class="btn btn-gold btn-lg btn-block">سجّلي الدخول لاستئجارها</a>`;
    else if (can.code === 'plan') cta = `<a href="#/plans" class="btn btn-gold btn-lg btn-block">اختاري باقة لتبدئي</a>`;
    else if (can.code === 'tier') cta = `<div class="notice gold"><span>${can.msg}</span></div><a href="#/plans" class="btn btn-gold btn-lg btn-block mt-2">ترقية الباقة</a>`;
    else cta = `<div class="notice warn"><span>${can.msg}</span></div>${can.code === 'slots' ? '<a href="#/dashboard/rentals" class="btn btn-ghost btn-lg btn-block mt-2">إدارة قطعي</a>' : ''}`;
    const similar = Store.publicItems().filter(x => x.id !== it.id && (x.category === it.category || x.brand === it.brand)).slice(0, 4);
    return `
    <div class="container">
      <div style="padding:26px 0 18px"><a href="#/catalog" class="muted small row" style="gap:6px;display:inline-flex">${SVG.arrow} العودة للتشكيلة</a></div>
      <div class="detail">
        <div class="tilt" style="position:relative">${art(it)}<button class="icon-btn ${wished ? 'active' : ''}" style="position:absolute;top:18px;inset-inline-end:18px;background:rgba(10,9,16,.55)" data-action="wish" data-id="${it.id}">${wished ? SVG.heart : SVG.heartO}</button></div>
        <div class="stagger">
          <div class="row" style="gap:6px">${tierBadge(it.tier)}${catBadge(it.category)}${badge(ITEM_STATUS, it.status)}</div>
          <div><span class="brand">${esc(it.brand)}</span><h1>${esc(it.name)}</h1></div>
          <p class="desc">${esc(it.desc)}</p>
          <div class="owner-line"><div class="avatar" style="width:28px;height:28px;font-size:.7rem">${initials(owner.name)}</div>من خزانة ${owner.name.split(' ')[0]} · ${owner.city} · <span class="num">${it.likes}</span> ♥</div>
          <div class="spec-grid">
            <div class="spec"><small>القيمة السوقية</small><b>${money(it.retail)}</b></div>
            <div class="spec"><small>قيمة الإيجار الشهرية المرجعية</small><b>${money(it.rate)}</b></div>
            <div class="spec"><small>الحالة</small><b>${it.condition}</b></div>
            <div class="spec"><small>${it.size ? 'المقاس' : 'مدة الإيجار'}</small><b>${it.size ? it.size + ' EU' : 'شهر كامل (٣٠ يوماً)'}</b></div>
          </div>
          <div class="includes"><span>${SVG.check} شهادة أصالة</span><span>${SVG.check} تعقيم احترافي</span><span>${SVG.check} تأمين ${S.settings.damageCover}٪</span><span>${SVG.check} توصيل خلال ${S.settings.deliveryHours} ساعة</span><span>${SVG.check} إرجاع مجاني</span></div>
          ${cta}
        </div>
      </div>
      ${similar.length ? `<div class="section-head"><div><h2 style="font-size:1.6rem">قد يعجبك أيضاً</h2></div></div><div class="items-grid">${similar.map((x, i) => itemCard(x, { delay: i })).join('')}</div><div style="height:60px"></div>` : ''}
    </div>`;
  }

  /* ================= PLANS ================= */
  function Plans() {
    const S = Store.get(); const u = Store.user(); const cur = u && Store.planOf(u.id);
    return `
    <div class="container">
      <div class="page-head center reveal in"><span class="kicker">الباقات</span><h1>اشتراك شهري… بلا التزام</h1><p style="margin-inline:auto;max-width:600px">ألغي في أي وقت. كل الباقات تشمل التوصيل والاستلام والتنظيف والتأمين الكامل ضد أضرار الاستخدام.</p></div>
      ${cur ? `<div class="notice gold mt-1" style="margin-bottom:24px">${SVG.sparkle}<span>باقتك الحالية: <b>${cur.name}</b> — تجدد في ${fmtDate(Store.subOf(u.id).renew)}. يمكنك الترقية فوراً أو التخفيض بعد إعادة القطع.</span></div>` : ''}
      <div class="plans-grid">${S.plans.map((p, i) => planCard(p, i)).join('')}</div>
      <div class="card mt-4 reveal" style="padding:30px">
        <h3 style="margin-bottom:18px">مقارنة سريعة</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>الميزة</th>${S.plans.map(p => `<th>${p.name}</th>`).join('')}</tr></thead>
          <tbody>
            <tr><td>عدد القطع معكِ في نفس الوقت</td>${S.plans.map(p => `<td><b>${p.slots}</b></td>`).join('')}</tr>
            <tr><td>التبديلات الشهرية</td>${S.plans.map(p => `<td>${p.swaps > 50 ? 'غير محدودة' : p.swaps}</td>`).join('')}</tr>
            <tr><td>الوصول لفئة لؤلؤة</td>${S.plans.map(p => `<td class="ok" style="color:var(--ok)">✓</td>`).join('')}</tr>
            <tr><td>الوصول لفئة ذهب</td>${S.plans.map(p => `<td>${p.tier >= 2 ? '<span style="color:var(--ok)">✓</span>' : '<span class="muted">—</span>'}</td>`).join('')}</tr>
            <tr><td>الوصول لفئة ماس (القطع النادرة)</td>${S.plans.map(p => `<td>${p.tier >= 3 ? '<span style="color:var(--ok)">✓</span>' : '<span class="muted">—</span>'}</td>`).join('')}</tr>
            <tr><td>مستشارة أناقة شخصية</td>${S.plans.map(p => `<td>${p.tier >= 3 ? '<span style="color:var(--ok)">✓</span>' : '<span class="muted">—</span>'}</td>`).join('')}</tr>
            <tr><td>التوصيل</td>${S.plans.map(p => `<td>${p.tier >= 3 ? 'نفس اليوم' : '٢٤ ساعة'}</td>`).join('')}</tr>
            <tr><td>التأمين ضد الأضرار</td>${S.plans.map(p => `<td><span style="color:var(--ok)">✓</span> كامل</td>`).join('')}</tr>
          </tbody>
        </table></div>
        <p class="small muted mt-2">الأسعار شاملة ضريبة القيمة المضافة ${S.settings.vat}٪. الدفع عبر mada، Apple Pay، Visa/Mastercard أو بالتقسيط عبر Tabby.</p>
      </div>
      <div style="height:60px"></div>
    </div>`;
  }

  /* ================= HOW ================= */
  function How() {
    const S = Store.get();
    return `
    <div class="container">
      <div class="page-head reveal in"><span class="kicker">كيف يعمل</span><h1>من الخزانة إلى بابك… بكل شفافية</h1><p>هكذا نضمن أن كل قطعة أصلية، نظيفة، مؤمّنة، وفي وقتها.</p></div>
      <div class="steps" style="margin-bottom:60px">
        ${[
          ['الاشتراك', 'اختاري باقة شهرية. لا رسوم تسجيل ولا التزام طويل الأمد.', SVG.sparkle],
          ['الاختيار', 'احجزي قطعك ضمن خانات باقتك. الفئة (لؤلؤة/ذهب/ماس) تحدد القطع المتاحة لك.', SVG.search],
          ['الاستلام', `مندوبتنا توصّل القطعة خلال ${S.settings.deliveryHours} ساعة في صندوق فاخر مع شهادة أصالة.`, SVG.truck],
          ['الإرجاع أو التبديل', 'في نهاية الشهر نستلمها من بابك مجاناً. بدّلي، مدّدي، أو استرخي.', SVG.swap],
        ].map((s, i) => `<div class="card lift step reveal" data-delay="${i}"><div class="ic">${s[2]}</div><div class="n">0${i + 1}</div><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}
      </div>
      <div class="grid-2" style="margin-bottom:60px">
        <div class="card reveal"><h3 style="margin-bottom:12px">${SVG.shield} التوثيق والأصالة</h3><p class="muted">كل قطعة تمر بفحص مزدوج: فحص مادي من خبيرة توثيق (الخياطة، الأختام، الأرقام التسلسلية، الجلد والمعدن) ثم فحص رقمي بمقارنة الصور مع قاعدة بيانات الدار. نرفض ما لا يجتاز الفحص، ونرفق شهادة أصالة مع كل شحنة.</p></div>
        <div class="card reveal" data-delay="1"><h3 style="margin-bottom:12px">${SVG.sparkle} التنظيف والتعقيم</h3><p class="muted">بعد كل إيجار تدخل القطعة مرحلة تنظيف متخصص حسب الخامة (جلد، ساتان، معدن، حرير) ثم تعقيم بالأوزون وتصوير موثّق لحالتها قبل عرضها من جديد.</p></div>
        <div class="card reveal" data-delay="2"><h3 style="margin-bottom:12px">${SVG.wallet} التأمين والمسؤولية</h3><p class="muted">آثار الاستخدام الطبيعي (خدوش خفيفة، علامات بسيطة) مغطاة بالكامل. الأضرار الجسيمة أو الفقدان تُقيَّم بواسطة فريقنا وقد تُطبَّق رسوم حسب القيمة السوقية للقطعة. لا نطلب وديعة تأمينية.</p></div>
        <div class="card reveal" data-delay="3"><h3 style="margin-bottom:12px">${SVG.truck} التوصيل داخل المملكة</h3><p class="muted">نخدم حالياً الرياض وجدة والدمام والخبر بتوصيل خاص، وبقية المدن عبر شركاء الشحن المبرّد خلال ٤٨ ساعة. الاستلام مجاني دائماً.</p></div>
      </div>
      <div class="section-head"><div><span class="kicker">الأسئلة الشائعة</span><h2>ربما تتساءلين…</h2></div></div>
      <div class="faq card reveal" style="padding:10px 26px">${S.faq.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>
      <div style="height:60px"></div>
    </div>`;
  }


  /* ================= ABOUT / VISION ================= */
  const VISION = {
    pillars: [
      { k: 'sustain', t: 'الاستدامة', h: 'اقتصاد دائري للفخامة', ic: 'leaf',
        p: 'القطعة الفاخرة صُنعت لتدوم عقوداً، لكنها تُستخدم في المتوسط مرات معدودة ثم تنام في الخزانة. في طلّة تعيش كل قطعة عشرات الإطلالات بدل إطلالة واحدة، فنقلّل الشراء الجديد والهدر ونطيل عمر ما هو موجود.',
        stat: '٨×', sl: 'إطلالات لكل قطعة بدل إطلالة واحدة (تقديري)' },
      { k: 'save', t: 'توفير التكلفة', h: 'الفخامة بجزء من ثمنها', ic: 'wallet',
        p: 'حقيبة بـ ٤٠ ألف ريال تُستخدم في مناسبتين. بالاشتراك تحصلين على القطعة نفسها، وتبدّلينها بأخرى في الشهر التالي، بما يعادل أقل من ٣٪ من قيمتها. المال الذي كان سيُجمَّد في خزانة يبقى في حياتك.',
        stat: '٩٠٪', sl: 'توفير مقارنة بامتلاك القطع نفسها (تقديري)' },
      { k: 'reinvest', t: 'إعادة الاستثمار', h: 'أصول راكدة تتحول إلى دخل', ic: 'swap',
        p: 'المالكات يحوّلن قطعاً نائمة إلى دخل شهري يُعاد ضخّه في مشاريعهن وتعليمهن وأسرهن. ونلتزم بتخصيص ٢٪ من إيرادات الاشتراكات لصندوق طلّة للتمكين: تدريب نساء على توثيق القطع الفاخرة والتنسيق (الستايلنج) وإدارة المتاجر.',
        stat: '٢٪', sl: 'من الإيرادات لصندوق طلّة للتمكين' },
      { k: 'women', t: 'من المرأة إلى المرأة', h: 'منصة نسائية بالكامل', ic: 'users',
        p: 'المالكة امرأة، والمشتركة امرأة، وفريق التوثيق والتنسيق والتوصيل نساء سعوديات. نبني اقتصاداً صغيراً تديره نساء لنساء، تُحترم فيه الخصوصية وتُبنى فيه الثقة على المعرفة والذوق، لا على الإعلان.',
        stat: '١٠٠٪', sl: 'فريق نسائي — من التوثيق إلى التوصيل' },
    ],
    v2030: [
      { t: 'مجتمع حيوي', p: 'أسلوب حياة عصري يوازن بين الذوق والاعتدال، وثقافة إعادة الاستخدام بدل الاستهلاك.' },
      { t: 'اقتصاد مزدهر', p: 'تمكين المرأة اقتصادياً، ودعم المنشآت الصغيرة والمتوسطة النسائية، وتنمية قطاع الأزياء الذي تقوده هيئة الأزياء.' },
      { t: 'وطن طموح', p: 'نموذج سعودي في الاقتصاد الدائري يتماشى مع مبادرة السعودية الخضراء وأهداف خفض الهدر.' },
    ],
    impact: [
      { v: 846, s: '', l: 'قطعة موثّقة في التشكيلة' },
      { v: 6200, s: '+', l: 'إطلالة أُعيد استخدامها' },
      { v: 4.1, s: 'م', l: 'ر.س وفّرتها المشتركات مقارنة بالشراء' },
      { v: 1.3, s: 'م', l: 'ر.س حُوّلت لمالكات القطع' },
    ],
    commitments: [
      ['2026', 'إطلاق صندوق طلّة للتمكين وتدريب أول ٥٠ خبيرة توثيق'],
      ['2027', 'التوسع إلى ٨ مدن سعودية بفريق توصيل نسائي كامل'],
      ['2028', 'تقرير أثر سنوي مدقّق: البصمة الكربونية المتجنَّبة والدخل المحوّل للمالكات'],
      ['2030', '١٠٠ ألف قطعة مشتركة و١٠ آلاف مالكة تدرّ قطعهن دخلاً'],
    ],
  };
  const ICO2 = {
    leaf: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-6 5-9 16-10-1 11-4 16-10 17z"/><path d="M4 20c4-4 8-6 12-9"/></svg>',
    wallet: SVG.wallet, swap: SVG.swap, users: SVG.users,
  };
  const pillarCard = (x, i) => `<div class="card lift pillar reveal" data-delay="${i}"><div class="ic">${ICO2[x.ic]}</div><span class="kicker">${x.t}</span><h3>${x.h}</h3><p>${x.p}</p><div class="pstat"><b class="gold-text">${x.stat}</b><small>${x.sl}</small></div></div>`;

  function About() {
    const S = Store.get();
    return `
    <div class="container">
      <div class="page-head reveal in" style="max-width:820px"><span class="kicker">رؤيتنا ورسالتنا</span><h1>فخامة تدور… لا تُهدر.<br><span class="gold-text">من المرأة إلى المرأة.</span></h1><p>طلّة منصة سعودية تعيد تعريف علاقة المرأة بالفخامة: بدل أن تشتري وتخزّن، تستأجر وتبدّل وتشارك — فتوفّر مالها، وتقلّل الهدر، وتمكّن نساءً أخريات من تحويل خزائنهن إلى دخل.</p></div>

      <div class="grid-2 reveal" style="margin-bottom:50px">
        <div class="card vm"><span class="kicker">رؤيتنا</span><p class="lead-ar">أن تكون طلّة الخزانة الفاخرة المشتركة الأولى في المملكة، ونموذجاً سعودياً في الاقتصاد الدائري تقوده النساء.</p></div>
        <div class="card vm violet"><span class="kicker">رسالتنا</span><p class="lead-ar">أن نمنح كل امرأة سعودية وصولاً ميسوراً للفخامة الأصلية باشتراك شهري، وأن نحوّل القطع النائمة في الخزائن إلى دخل ومعرفة وفرص عمل لنساء أخريات.</p></div>
      </div>

      <div class="section-head reveal"><div><span class="kicker">ركائزنا الأربع</span><h2>لماذا نفعل ما نفعل</h2></div></div>
      <div class="pillars" style="margin-bottom:60px">${VISION.pillars.map(pillarCard).join('')}</div>

      <div class="impact card spot reveal" style="margin-bottom:60px">
        <div class="section-head" style="margin-bottom:22px"><div><span class="kicker">أثرنا بالأرقام</span><h2 style="font-size:1.6rem">منذ الإطلاق التجريبي</h2></div><span class="badge muted">أرقام تجريبية توضيحية</span></div>
        <div class="impact-grid">${VISION.impact.map(x => `<div class="stat"><b data-count="${x.v}" data-suffix="${x.s}" data-decimals="${String(x.v).includes('.') ? 1 : 0}">0</b><span>${x.l}</span></div>`).join('')}</div>
      </div>

      <div class="split" style="margin-bottom:60px">
        <div class="reveal">
          <span class="kicker">التوافق مع رؤية المملكة 2030</span>
          <h2 style="font-size:clamp(1.6rem,3vw,2.3rem);font-weight:900;line-height:1.25">نبني على ثلاث ركائز الرؤية</h2>
          <p class="muted mt-2">تمكين المرأة اقتصادياً، وتنمية قطاع الأزياء والمنشآت الصغيرة، والاقتصاد الدائري المستدام — ليست شعارات عندنا، بل هي طريقة عمل المنصة يومياً.</p>
          <div class="feature-list">${VISION.v2030.map(x => `<div class="feature"><div class="ic" style="background:rgba(88,209,154,.12);border-color:rgba(88,209,154,.35);color:#a7f0cd">${SVG.check}</div><div><b>${x.t}</b><p>${x.p}</p></div></div>`).join('')}</div>
        </div>
        <div class="card v2030 reveal" data-delay="1">
          <div class="v2030-mark"><span>٢٠٣٠</span><small>رؤية المملكة العربية السعودية</small></div>
          <ul class="v2030-list">
            <li><b>مشاركة المرأة في سوق العمل</b><span>فرص عمل مرنة للمالكات وخبيرات التوثيق والتنسيق</span></li>
            <li><b>المنشآت الصغيرة والمتوسطة</b><span>منصة تخلق دخلاً لآلاف المالكات دون رأس مال</span></li>
            <li><b>قطاع الأزياء والترفيه</b><span>إتاحة إطلالات المناسبات والفعاليات بتكلفة أقل</span></li>
            <li><b>الاستدامة والاقتصاد الدائري</b><span>إعادة استخدام بدل الشراء الجديد وخفض الهدر</span></li>
          </ul>
        </div>
      </div>

      <div class="section-head reveal"><div><span class="kicker">التزاماتنا</span><h2>خارطة الطريق حتى 2030</h2></div></div>
      <div class="roadmap reveal">${VISION.commitments.map((c, i) => `<div class="rm-step reveal" data-delay="${i}"><b class="num">${c[0]}</b><i></i><p>${c[1]}</p></div>`).join('')}</div>

      <div class="cta-banner spot reveal mt-4">
        <h2>كوني جزءاً من <span class="gold-text">الدورة</span></h2>
        <p>اشتركي وتألّقي، أو سجّلي قطعك ودعيها تعمل لأجلك ولأجل امرأة أخرى.</p>
        <div class="row" style="justify-content:center"><a href="#/plans" class="btn btn-gold btn-lg" data-magnetic>اشتركي الآن</a><a href="#/owners" class="btn btn-ghost btn-lg" data-magnetic>سجّلي قطعك</a></div>
      </div>
      <div style="height:60px"></div>
    </div>`;
  }

  function VisionTeaser() {
    return `
    <section class="section" style="padding-top:20px">
      <div class="container">
        <div class="section-head reveal"><div><span class="kicker">رؤيتنا</span><h2>فخامة تدور… لا تُهدر. من المرأة إلى المرأة.</h2><p>استدامة، توفير، إعادة استثمار، وتمكين — بما يتوافق مع رؤية المملكة 2030.</p></div><a href="#/about" class="btn btn-outline">رؤيتنا ورسالتنا ${SVG.arrow}</a></div>
        <div class="pillars compact">${VISION.pillars.map((x, i) => `<a href="#/about" class="card lift pillar reveal" data-delay="${i}"><div class="ic">${ICO2[x.ic]}</div><span class="kicker">${x.t}</span><h3>${x.h}</h3><div class="pstat"><b class="gold-text">${x.stat}</b><small>${x.sl}</small></div></a>`).join('')}</div>
      </div>
    </section>`;
  }

  /* ================= OWNERS LANDING ================= */
  function Owners() {
    const S = Store.get(); const u = Store.user();
    return `
    <div class="container">
      <div class="page-head reveal in"><span class="kicker">للمالكات · Consignment</span><h1>حوّلي خزانتك إلى مصدر دخل</h1><p>سجّلي قطعك الفاخرة، ونتولّى الباقي: توثيق، تصوير، تخزين آمن، تنظيف، تأمين، وتوصيل. تحصلين على <b class="gold-text">${100 - S.settings.commission}٪</b> من قيمة كل إيجار.</p></div>
      <div class="kpis">
        <div class="card kpi reveal"><small>حصة المالكة</small><b class="gold-text">${100 - S.settings.commission}٪</b><span class="trend up">من قيمة الإيجار الشهرية</span></div>
        <div class="card kpi reveal" data-delay="1"><small>قيمة الإيجار المرجعية</small><b>~٤٪</b><span class="trend">من القيمة السوقية شهرياً</span></div>
        <div class="card kpi reveal" data-delay="2"><small>التحويل البنكي</small><b>شهري</b><span class="trend">بحد أدنى ١٠٠ ر.س</span></div>
        <div class="card kpi reveal" data-delay="3"><small>التأمين</small><b>${S.settings.damageCover}٪</b><span class="trend up">ضد الأضرار والفقدان</span></div>
      </div>
      <div class="steps" style="margin-bottom:50px">
        ${[
          ['سجّلي القطعة', 'أدخلي الدار والاسم والقيمة والحالة من لوحة المالكة.', SVG.plus],
          ['نستلمها منك', 'مندوبتنا تستلم القطعة من بابك خلال ٤٨ ساعة بتغليف آمن.', SVG.truck],
          ['توثيق وتصوير', 'فريق التوثيق يفحصها، ثم تُصوّر احترافياً وتُعرض في التشكيلة.', SVG.camera],
          ['اربحي شهرياً', 'كل إيجار يُضاف لرصيدك، واطلبي التحويل متى شئتِ.', SVG.wallet],
        ].map((s, i) => `<div class="card lift step reveal" data-delay="${i}"><div class="ic">${s[2]}</div><div class="n">0${i + 1}</div><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}
      </div>
      <div class="cta-banner spot reveal">
        <h2>${u && u.role === 'owner' ? 'أضيفي قطعة جديدة الآن' : 'جاهزة للبدء؟'}</h2>
        <p>${u && u.role === 'owner' ? 'من لوحتك يمكنك إضافة القطع ومتابعة أرباحك.' : 'استخدمي مفتاح مالكة تجريبي لتجربة لوحة المالكات كاملة.'}</p>
        <a href="${u && u.role === 'owner' ? '#/dashboard/add' : '#/login'}" class="btn btn-gold btn-lg" data-magnetic>${u && u.role === 'owner' ? 'إضافة قطعة' : 'دخول المالكات'}</a>
      </div>
      <div style="height:60px"></div>
    </div>`;
  }

  /* ================= LOGIN ================= */
  function Login() {
    const S = Store.get();
    const roleIc = { admin: SVG.gear, ops: SVG.box, owner: SVG.wallet, renter: SVG.sparkle };
    const desc = { admin: 'لوحة قيادة كاملة: موافقات، طلبات، مستخدمون، مدفوعات، إعدادات', ops: 'التوثيق، الشحنات، الإرجاع، التنظيف، المخزون', owner: 'قطعي، الأرباح، إضافة قطعة، طلب تحويل', renter: 'اشتراكي، إيجاراتي، المفضلة، المدفوعات' };
    const extra = { u5: 'باقة ماس · قطعتان معها الآن', u6: 'بدون اشتراك — جرّبي الاشتراك من الصفر', u7: 'باقة لؤلؤة · طلب في الطريق', u3: '٨ قطع · رصيد قابل للتحويل', u4: '٨ قطع · قطعة قيد التوثيق' };
    return `
    <div class="auth">
      <div class="auth-form stagger">
        <span class="kicker">دخول</span>
        <h1>أهلاً بعودتك</h1>
        <p class="muted" style="margin-bottom:26px">أدخلي مفتاح الوصول الخاص بك. في هذه النسخة التجريبية لا حاجة لكلمة مرور.</p>
        <form data-form="login">
          <div class="field"><label>مفتاح الوصول</label><input class="key" name="key" placeholder="XXXX-0000" autocomplete="off" required></div>
          <div class="err" id="login-err"></div>
          <button class="btn btn-gold btn-lg btn-block" type="submit" data-magnetic>دخول</button>
        </form>
      </div>
      <div class="auth-side">
        <span class="kicker">مفاتيح تجريبية</span>
        <h2 style="font-size:1.5rem;margin-bottom:6px">جرّبي كل الأدوار</h2>
        <p class="muted small" style="margin-bottom:10px">اضغطي على أي مفتاح للدخول مباشرة. البيانات تُحفظ في متصفحك ويمكنك إعادة تعيينها من لوحة المدير.</p>
        <div class="keys">
          ${S.users.map((u, i) => `<button class="key-card reveal in" data-action="quick-login" data-key="${u.key}" style="transition-delay:${i * 60}ms"><div class="role-ic role-${u.role}">${roleIc[u.role]}</div><div class="kmeta"><b>${u.name} <span class="badge ${{ admin: 'bad', ops: 'info', owner: 'violet', renter: 'gold' }[u.role]}" style="font-size:.65rem;padding:1px 7px">${ROLE_LABELS[u.role]}</span></b><small>${extra[u.id] || desc[u.role]}</small></div><code>${u.key}</code></button>`).join('')}
        </div>
      </div>
    </div>`;
  }

  /* ================= DASHBOARD SHELL ================= */
  function Dashboard(tab) {
    const u = Store.user();
    if (!u) return Login();
    const menus = {
      renter: [['overview', 'نظرة عامة', SVG.home], ['rentals', 'إيجاراتي', SVG.box], ['wishlist', 'المفضلة', SVG.heartO], ['payments', 'المدفوعات', SVG.wallet], ['profile', 'ملفي', SVG.user]],
      owner: [['overview', 'نظرة عامة', SVG.home], ['items', 'قطعي', SVG.list], ['add', 'إضافة قطعة', SVG.plus], ['earnings', 'الأرباح والتحويلات', SVG.wallet], ['profile', 'ملفي', SVG.user]],
      admin: [['overview', 'لوحة القيادة', SVG.home], ['approvals', 'الموافقات', SVG.check], ['orders', 'الطلبات', SVG.box], ['inventory', 'المخزون', SVG.list], ['users', 'المستخدمون', SVG.users], ['payouts', 'التحويلات', SVG.wallet], ['settings', 'الإعدادات', SVG.gear]],
      ops: [['overview', 'نظرة عامة', SVG.home], ['auth', 'التوثيق', SVG.shield], ['shipments', 'الشحنات والإرجاع', SVG.truck], ['inventory', 'المخزون', SVG.list]],
    };
    const menu = menus[u.role];
    tab = menu.some(m => m[0] === tab) ? tab : menu[0][0];
    const k = Store.kpis();
    const counts = { approvals: k.pendingItems, payouts: k.pendingPayouts, auth: Store.get().items.filter(i => i.status === 'authenticating').length, shipments: Store.get().rentals.filter(r => ['processing', 'shipped', 'return_requested', 'returned', 'cleaning'].includes(r.status)).length };
    const body = { renter: RenterDash, owner: OwnerDash, admin: AdminDash, ops: OpsDash }[u.role](tab, u);
    return `
    <div class="container dash">
      <aside class="side">
        <div class="who"><div class="avatar">${initials(u.name)}</div><div><b>${u.name}</b><small>${ROLE_LABELS[u.role]}</small></div></div>
        ${menu.map(m => `<a href="#/dashboard/${m[0]}" class="${tab === m[0] ? 'active' : ''}">${m[2]} ${m[1]} ${counts[m[0]] ? `<span class="cnt">${counts[m[0]]}</span>` : ''}</a>`).join('')}
        <a href="#/" class="logout" data-action="logout">${SVG.logout} تسجيل الخروج</a>
      </aside>
      <div class="dash-main stagger">${body}</div>
    </div>`;
  }

  const kpi = (label, value, trend = '', cls = '') => `<div class="card kpi ${cls}"><small>${label}</small><b>${value}</b>${trend ? `<span class="trend ${trend.startsWith('+') ? 'up' : ''}">${trend}</span>` : ''}</div>`;
  const bars = (rows, cls = '') => { const max = Math.max(1, ...rows.map(r => r.total)); return `<div class="bars">${rows.map((r, i) => `<div class="bar ${cls}"><i style="height:${Math.max(3, r.total / max * 100)}%;animation-delay:${i * 80}ms" data-v="${r.total.toLocaleString('en-US')}"></i><span>${r.label}</span></div>`).join('')}</div>`; };
  const timeline = (status) => {
    const steps = [['processing', 'تجهيز'], ['shipped', 'شحن'], ['active', 'معكِ'], ['return_requested', 'إرجاع'], ['cleaning', 'تنظيف'], ['completed', 'مكتمل']];
    const order = ['processing', 'shipped', 'active', 'return_requested', 'returned', 'cleaning', 'completed'];
    const idx = order.indexOf(status);
    return `<div class="timeline">${steps.map(s => { const si = order.indexOf(s[0]); const cls = si < idx ? 'done' : si === idx || (s[0] === 'return_requested' && status === 'returned') ? 'done now' : ''; return `<div class="tstep ${cls}"><i></i>${s[1]}</div>`; }).join('')}</div>`;
  };

  /* ================= RENTER ================= */
  function RenterDash(tab, u) {
    const S = Store.get(); const sub = Store.subOf(u.id); const p = sub && Store.plan(sub.planId);
    const active = Store.activeRentals(u.id); const all = Store.rentalsOf(u.id);
    const title = (t, s) => `<div class="dash-title"><div><h1>${t}</h1><p>${s}</p></div></div>`;
    const rentalCard = (r) => {
      const it = Store.item(r.itemId); const left = daysLeft(r.end); const total = daysBetween(r.start, r.end); const pct = Math.min(100, Math.round((1 - left / total) * 100));
      let acts = '';
      if (r.status === 'processing') acts = `<button class="btn btn-danger btn-sm" data-action="return" data-id="${r.id}">إلغاء الطلب</button>`;
      if (r.status === 'active') acts = `<button class="btn btn-ghost btn-sm" data-action="extend" data-id="${r.id}">تمديد شهر</button><button class="btn btn-outline btn-sm" data-action="return" data-id="${r.id}">إرجاع / تبديل</button>`;
      return `<div class="card rental-card">
        ${thumb(it)}
        <div><div class="row" style="gap:6px"><b class="nm">${esc(it.brand)} ${esc(it.name)}</b>${badge(RENTAL_STATUS, r.status)}</div>
        <div class="meta"><span>من ${fmtDate(r.start)}</span><span>إلى ${fmtDate(r.end)}</span>${['active', 'shipped', 'processing'].includes(r.status) ? `<span class="gold-text" style="font-weight:700">${left} يوم متبقٍ</span>` : ''}</div>
        ${['active'].includes(r.status) ? `<div class="progress"><i style="width:${pct}%"></i></div>` : timeline(r.status)}</div>
        <div class="actions">${acts}<a href="#/item/${it.id}" class="btn btn-ghost btn-sm">التفاصيل</a></div>
      </div>`;
    };
    if (tab === 'overview') {
      const wl = Store.wishlistOf(u.id).map(Store.item).filter(Boolean);
      return `${title(`مرحباً ${u.name.split(' ')[0]} ✨`, sub ? `اشتراكك في باقة ${p.name} نشط ويتجدد في ${fmtDate(sub.renew)}` : 'لم تختاري باقة بعد — ابدئي الآن')}
      ${!sub ? `<div class="notice gold" style="margin-bottom:20px">${SVG.sparkle}<span class="grow">اختاري باقتك لتبدئي استئجار القطع. أول شهر يشمل تبديلاً إضافياً مجاناً.</span><a href="#/plans" class="btn btn-gold btn-sm">الباقات</a></div>` : ''}
      <div class="kpis">
        ${kpi('باقتي', sub ? `<span class="gold-text">${p.name}</span>` : '—', sub ? `${n(p.price)} ر.س / شهر` : '')}
        ${kpi('القطع معكِ الآن', sub ? `${active.length} <small class="muted" style="font-size:1rem">/ ${p.slots}</small>` : '0')}
        ${kpi('تبديلات متبقية', sub ? (p.swaps > 50 ? '∞' : Math.max(0, p.swaps - sub.swapsUsed)) : '0', 'هذا الشهر')}
        ${kpi('إجمالي ما استأجرتِه', all.filter(r => r.status !== 'cancelled').length, 'قطعة منذ انضمامك')}
      </div>
      <div class="grid-3-1">
        <div>
          <div class="panel"><h3>القطع النشطة <a href="#/catalog" class="btn btn-gold btn-sm">${SVG.plus} استأجري قطعة</a></h3>
          <div style="display:flex;flex-direction:column;gap:12px">${active.length ? active.map(rentalCard).join('') : `<div class="card big-empty"><div class="big">👜</div>لا توجد قطع نشطة. <a href="#/catalog" class="gold-text">تصفّحي التشكيلة</a></div>`}</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px">
          ${sub ? `<div class="card panel center"><h3 style="justify-content:center">استخدام الخانات</h3><div class="ring" style="--p:${Math.round(active.length / p.slots * 100)};margin:0 auto"><div><b>${active.length}/${p.slots}</b><small>قطعة</small></div></div><p class="small muted mt-2">يتجدد الاشتراك في ${fmtDate(sub.renew)}</p><a href="#/plans" class="btn btn-ghost btn-sm mt-1">${p.tier < 3 ? 'ترقية الباقة' : 'إدارة الباقة'}</a></div>` : ''}
          <div class="card panel"><h3>من مفضلتك</h3>${wl.length ? wl.slice(0, 3).map(it => `<a href="#/item/${it.id}" class="cell-item" style="padding:8px 0;border-bottom:1px solid var(--border)">${thumb(it)}<div><b>${esc(it.brand)}</b><small>${esc(it.name)}</small></div><span class="grow"></span>${it.status === 'available' ? '<span class="badge ok">متاحة</span>' : '<span class="badge muted">مؤجرة</span>'}</a>`).join('') : '<p class="muted small">لا توجد قطع في المفضلة بعد.</p>'}</div>
        </div>
      </div>`;
    }
    if (tab === 'rentals') return `${title('إيجاراتي', 'كل ما استأجرتِه، مع تتبّع حالة كل طلب')}<div style="display:flex;flex-direction:column;gap:12px">${all.length ? all.map(rentalCard).join('') : `<div class="card big-empty"><div class="big">📦</div>لا توجد إيجارات بعد.</div>`}</div>`;
    if (tab === 'wishlist') { const wl = Store.wishlistOf(u.id).map(Store.item).filter(Boolean); return `${title('المفضلة', 'القطع التي حفظتِها لتعودي إليها')}${wl.length ? `<div class="items-grid">${wl.map((it, i) => itemCard(it, { delay: i })).join('')}</div>` : `<div class="card big-empty"><div class="big">♡</div>لا توجد قطع محفوظة. <a href="#/catalog" class="gold-text">تصفّحي التشكيلة</a></div>`}`; }
    if (tab === 'payments') {
      const tx = S.transactions.filter(t => t.userId === u.id).sort((a, b) => b.date.localeCompare(a.date));
      return `${title('المدفوعات', 'سجل اشتراكاتك وفواتيرك')}
      <div class="kpis"><div class="card kpi"><small>الاشتراك الحالي</small><b>${sub ? money(p.price) : '—'}</b></div><div class="card kpi"><small>التجديد القادم</small><b style="font-size:1.3rem">${sub ? fmtDate(sub.renew) : '—'}</b></div><div class="card kpi"><small>إجمالي المدفوع</small><b>${money(tx.reduce((s, t) => s + t.amount, 0))}</b></div><div class="card kpi"><small>وسيلة الدفع</small><b style="font-size:1.2rem">mada •••• 4821</b></div></div>
      <div class="card"><div class="table-wrap"><table><thead><tr><th>التاريخ</th><th>الوصف</th><th>المبلغ</th><th>الحالة</th></tr></thead><tbody>${tx.map(t => `<tr><td>${fmtDate(t.date)}</td><td>${t.desc}</td><td>${money(t.amount)}</td><td><span class="badge ok">مدفوع</span></td></tr>`).join('') || '<tr><td colspan="4" class="muted center">لا توجد مدفوعات</td></tr>'}</tbody></table></div></div>
      ${sub ? `<div class="card mt-2 row between"><div><b>إلغاء التجديد التلقائي</b><p class="small muted">يستمر وصولك حتى نهاية الدورة الحالية. يجب إعادة القطع النشطة أولاً.</p></div><button class="btn btn-danger btn-sm" data-action="cancel-sub">إلغاء الاشتراك</button></div>` : ''}`;
    }
    if (tab === 'profile') return profileForm(u, title('ملفي الشخصي', 'عنوان التوصيل وبيانات التواصل'));
  }

  function profileForm(u, head) {
    return `${head}<div class="card" style="max-width:640px"><form data-form="profile"><div class="form-grid">
      <div class="field"><label>الاسم</label><input name="name" value="${esc(u.name)}" required></div>
      <div class="field"><label>الجوال</label><input name="phone" value="${esc(u.phone)}" dir="ltr"></div>
      <div class="field"><label>المدينة</label><select name="city">${CITIES.map(c => `<option ${c === u.city ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      ${u.role === 'owner' ? `<div class="field"><label>الآيبان (IBAN) للتحويلات</label><input name="iban" value="${esc(u.iban || '')}" dir="ltr"></div>` : `<div class="field"><label>الحي والشارع</label><input name="address" value="${esc(u.address || '')}"></div>`}
    </div><button class="btn btn-gold" type="submit">حفظ التغييرات</button></form></div>`;
  }

  /* ================= OWNER ================= */
  function OwnerDash(tab, u) {
    const S = Store.get(); const items = Store.itemsOf(u.id); const earn = Store.earningsOf(u.id); const bal = Store.balanceOf(u.id);
    const thisMonth = earn.filter(r => r.start.startsWith(Store.todayISO().slice(0, 7))).reduce((s, r) => s + r.amount, 0);
    const title = (t, s, a = '') => `<div class="dash-title"><div><h1>${t}</h1><p>${s}</p></div>${a}</div>`;
    const rowItem = (it) => {
      const cr = Store.currentRentalOfItem(it.id); const times = S.rentals.filter(r => r.itemId === it.id && r.status !== 'cancelled').length;
      let acts = '';
      if (['available', 'pending'].includes(it.status)) acts = `<button class="btn btn-danger btn-sm" data-action="withdraw" data-id="${it.id}">سحب</button>`;
      if (['withdrawn', 'rejected'].includes(it.status)) acts = `<button class="btn btn-ghost btn-sm" data-action="relist" data-id="${it.id}">إعادة العرض</button>`;
      return `<tr><td><div class="cell-item">${thumb(it)}<div><b>${esc(it.brand)}</b><small>${esc(it.name)}</small></div></div></td><td>${tierBadge(it.tier)}</td><td>${badge(ITEM_STATUS, it.status)}${it.rejectReason ? `<br><small class="muted">${esc(it.rejectReason)}</small>` : ''}</td><td>${money(it.rate)}</td><td>${times}×</td><td>${cr && cr.status !== 'completed' ? `يعود ${fmtDate(cr.end)}` : '—'}</td><td><div class="actions">${acts}</div></td></tr>`;
    };
    if (tab === 'overview') return `${title(`أهلاً ${u.name.split(' ')[0]} 👜`, 'ملخّص قطعك وأرباحك', `<a href="#/dashboard/add" class="btn btn-gold">${SVG.plus} إضافة قطعة</a>`)}
      <div class="kpis">
        ${kpi('رصيدك القابل للتحويل', `<span class="gold-text">${money(bal)}</span>`)}
        ${kpi('أرباح هذا الشهر', money(thisMonth), '+ ' + earn.filter(r => r.start.startsWith(Store.todayISO().slice(0, 7))).length + ' إيجار')}
        ${kpi('إجمالي الأرباح', money(earn.reduce((s, r) => s + r.amount, 0)), 'منذ انضمامك')}
        ${kpi('قطعي', `${items.filter(i => !['rejected', 'withdrawn'].includes(i.status)).length}`, `${items.filter(i => i.status === 'rented').length} مؤجّرة الآن`)}
      </div>
      <div class="grid-3-1">
        <div class="card panel violet"><h3>الأرباح الشهرية (ر.س)</h3>${bars(Store.ownerEarningsByMonth(u.id), 'violet')}</div>
        <div class="card panel"><h3>حالة القطع</h3>${Object.entries(items.reduce((a, i) => (a[i.status] = (a[i.status] || 0) + 1, a), {})).map(([s, c]) => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)">${badge(ITEM_STATUS, s)}<b>${c}</b></div>`).join('')}<a href="#/dashboard/items" class="btn btn-ghost btn-sm btn-block mt-2">كل القطع</a></div>
      </div>
      <div class="card panel mt-2"><h3>آخر الإيجارات على قطعك</h3><div class="table-wrap"><table><thead><tr><th>القطعة</th><th>البداية</th><th>الحالة</th><th>حصتك</th></tr></thead><tbody>${earn.sort((a, b) => b.start.localeCompare(a.start)).slice(0, 5).map(r => { const it = Store.item(r.itemId); return `<tr><td><div class="cell-item">${thumb(it)}<div><b>${esc(it.brand)}</b><small>${esc(it.name)}</small></div></div></td><td>${fmtDate(r.start)}</td><td>${badge(RENTAL_STATUS, r.status)}</td><td class="gold-text" style="font-weight:700">${money(r.amount)}</td></tr>`; }).join('') || '<tr><td colspan="4" class="muted center">لا توجد إيجارات بعد</td></tr>'}</tbody></table></div></div>`;
    if (tab === 'items') return `${title('قطعي', `${items.length} قطعة مسجّلة`, `<a href="#/dashboard/add" class="btn btn-gold">${SVG.plus} إضافة قطعة</a>`)}<div class="card"><div class="table-wrap"><table><thead><tr><th>القطعة</th><th>الفئة</th><th>الحالة</th><th>الإيجار الشهري</th><th>مرات الإيجار</th><th>متاحة من</th><th></th></tr></thead><tbody>${items.map(rowItem).join('')}</tbody></table></div></div>`;
    if (tab === 'add') return `${title('إضافة قطعة جديدة', 'سنراجعها خلال ٢٤ ساعة ثم نرتّب استلامها منك')}
      <div class="grid-3-1">
        <div class="card"><form data-form="add-item"><div class="form-grid">
          <div class="field"><label>الدار / العلامة</label><input name="brand" placeholder="مثال: CHANEL" required dir="ltr"></div>
          <div class="field"><label>اسم القطعة / الموديل</label><input name="name" placeholder="مثال: Boy Bag Medium" required dir="ltr"></div>
          <div class="field"><label>التصنيف</label><select name="category">${Object.entries(CATEGORY_LABELS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
          <div class="field"><label>الفئة المقترحة</label><select name="tier"><option value="1">لؤلؤة (حتى ~١٠ آلاف)</option><option value="2" selected>ذهب (١٠–٣٠ ألف)</option><option value="3">ماس (أكثر من ٣٠ ألف / نادرة)</option></select></div>
          <div class="field"><label>القيمة السوقية (ر.س)</label><input name="retail" type="number" min="1000" step="100" placeholder="24000" required dir="ltr"></div>
          <div class="field"><label>الحالة</label><select name="condition"><option>كالجديدة</option><option selected>ممتازة</option><option>جيدة جداً</option><option>جيدة</option></select></div>
          <div class="field"><label>المقاس (للأحذية)</label><input name="size" placeholder="38" dir="ltr"></div>
          <div class="field"><label>سنة الشراء</label><input name="year" placeholder="2024" dir="ltr"></div>
        </div>
        <div class="field"><label>وصف مختصر</label><textarea name="desc" placeholder="اللون، الخامة، الإكسسوارات، هل تتوفر الفاتورة والصندوق الأصلي…"></textarea></div>
        <div class="field"><label>الصور</label><div class="notice info" style="padding:12px">${SVG.camera}<span class="small">في النسخة التجريبية تُستبدل الصور بتصميم تلقائي. فريق التصوير يلتقط الصور الرسمية بعد الاستلام.</span></div></div>
        <button class="btn btn-gold btn-lg" type="submit">إرسال للمراجعة</button></form></div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="card panel"><h3>ماذا يحدث بعد الإرسال؟</h3><ol style="padding-inline-start:18px;color:var(--muted);display:flex;flex-direction:column;gap:8px;font-size:.92rem"><li>مراجعة مبدئية من الإدارة خلال ٢٤ ساعة.</li><li>استلام القطعة من بابك.</li><li>فحص التوثيق والتصوير الاحترافي.</li><li>العرض في التشكيلة وبدء الأرباح.</li></ol></div>
          <div class="card panel"><h3>نقبل حالياً</h3><p class="small muted">حقائب وأحذية وساعات ومجوهرات وإكسسوارات من الدور العالمية الكبرى بحالة جيدة فأفضل، مع تفضيل توفر الفاتورة أو بطاقة الأصالة.</p></div>
        </div>
      </div>`;
    if (tab === 'earnings') {
      const pos = S.payouts.filter(p => p.ownerId === u.id);
      return `${title('الأرباح والتحويلات', `حصتك ${100 - S.settings.commission}٪ من قيمة كل إيجار`, `<button class="btn btn-gold" data-action="payout" ${bal < 100 ? 'disabled' : ''}>${SVG.wallet} طلب تحويل ${n(bal)} ر.س</button>`)}
      <div class="kpis">${kpi('الرصيد القابل للتحويل', `<span class="gold-text">${money(bal)}</span>`)}${kpi('قيد الاعتماد', money(pos.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)))}${kpi('تم تحويله', money(pos.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)))}${kpi('الآيبان', `<span style="font-size:.9rem;direction:ltr;display:inline-block">${u.iban || 'غير مضاف'}</span>`)}</div>
      <div class="grid-2">
        <div class="card panel"><h3>سجل التحويلات</h3><div class="table-wrap"><table><thead><tr><th>التاريخ</th><th>المبلغ</th><th>الحالة</th></tr></thead><tbody>${pos.map(p => `<tr><td>${fmtDate(p.date)}</td><td>${money(p.amount)}</td><td>${badge(PAYOUT_STATUS, p.status)}</td></tr>`).join('') || '<tr><td colspan="3" class="muted center">لا توجد تحويلات</td></tr>'}</tbody></table></div></div>
        <div class="card panel"><h3>تفاصيل الأرباح</h3><div class="table-wrap"><table><thead><tr><th>القطعة</th><th>البداية</th><th>حصتك</th></tr></thead><tbody>${earn.sort((a, b) => b.start.localeCompare(a.start)).map(r => { const it = Store.item(r.itemId); return `<tr><td><b class="en" style="font-size:.9rem">${esc(it.brand)}</b> <small class="muted">${esc(it.name)}</small></td><td>${fmtDate(r.start)}</td><td class="gold-text" style="font-weight:700">${money(r.amount)}</td></tr>`; }).join('')}</tbody></table></div></div>
      </div>`;
    }
    if (tab === 'profile') return profileForm(u, title('ملفي', 'بيانات التواصل والحساب البنكي'));
  }

  /* ================= ADMIN ================= */
  function AdminDash(tab, u) {
    const S = Store.get(); const k = Store.kpis();
    const title = (t, s, a = '') => `<div class="dash-title"><div><h1>${t}</h1><p>${s}</p></div>${a}</div>`;
    const orderRow = (r) => { const it = Store.item(r.itemId); const rn = Store.userById(r.renterId); const last = ['completed', 'cancelled'].includes(r.status); return `<tr><td><code class="muted">${r.id}</code></td><td><div class="cell-item">${thumb(it)}<div><b>${esc(it.brand)}</b><small>${esc(it.name)}</small></div></div></td><td>${rn.name}<br><small class="muted">${r.city}</small></td><td>${fmtDate(r.start)} → ${fmtDate(r.end)}</td><td>${badge(RENTAL_STATUS, r.status)}</td><td><div class="actions">${!last ? `<button class="btn btn-ok btn-sm" data-action="advance" data-id="${r.id}">${nextLabel(r.status)}</button>` : ''}</div></td></tr>`; };
    const rev = Store.revenueByMonth(); const cur = rev[rev.length - 1].total, prev = rev[rev.length - 2].total;
    const trend = prev ? `${cur >= prev ? '+' : ''}${Math.round((cur - prev) / prev * 100)}٪ عن الشهر الماضي` : 'أول شهر مسجّل';
    if (tab === 'overview') return `${title('لوحة القيادة', `اليوم ${fmtDate(Store.todayISO())} · ${k.openOrders} طلب مفتوح`)}
      <div class="kpis">
        ${kpi('الإيراد الشهري المتكرر (MRR)', `<span class="gold-text">${money(k.mrr)}</span>`, trend)}
        ${kpi('اشتراكات نشطة', k.activeSubs, `من ${k.renters} مشتركة مسجّلة`)}
        ${kpi('نسبة تشغيل المخزون', `${k.utilization}٪`, 'مؤجّرة / المتاحة للعرض')}
        ${kpi('بانتظار إجراء', k.pendingItems + k.pendingPayouts, `${k.pendingItems} قطع · ${k.pendingPayouts} تحويلات`)}
      </div>
      <div class="grid-3-1">
        <div class="card panel"><h3>إيرادات الاشتراكات (ر.س)</h3>${bars(Store.revenueByMonth())}</div>
        <div class="card panel"><h3>توزيع الباقات</h3>${S.plans.map(p => { const c = S.subscriptions.filter(s => s.status === 'active' && s.planId === p.id).length; return `<div style="padding:8px 0"><div class="row between small"><span>${p.name}</span><b>${c}</b></div><div class="progress mt-1"><i style="width:${k.activeSubs ? c / k.activeSubs * 100 : 0}%"></i></div></div>`; }).join('')}</div>
      </div>
      <div class="grid-2 mt-2">
        <div class="card panel"><h3>آخر النشاطات</h3><ul class="activity">${S.activity.slice(0, 7).map(a => `<li><i></i><div>${esc(a.text)}<small>${fmtDate(a.ts)}</small></div></li>`).join('')}</ul></div>
        <div class="card panel"><h3>يحتاج انتباهك <a href="#/dashboard/approvals" class="btn btn-ghost btn-sm">الموافقات</a></h3>
          ${S.items.filter(i => i.status === 'pending').map(i => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div class="cell-item">${thumb(i)}<div><b>${esc(i.brand)}</b><small>${esc(i.name)}</small></div></div><div class="actions"><button class="btn btn-ok btn-sm" data-action="approve" data-id="${i.id}">موافقة</button><button class="btn btn-danger btn-sm" data-action="reject" data-id="${i.id}">رفض</button></div></div>`).join('')}
          ${S.payouts.filter(p => p.status === 'pending').map(p => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><b>تحويل ${money(p.amount)}</b><br><small class="muted">${Store.userById(p.ownerId).name}</small></div><div class="actions"><button class="btn btn-ok btn-sm" data-action="payout-ok" data-id="${p.id}">اعتماد</button></div></div>`).join('')}
          ${!k.pendingItems && !k.pendingPayouts ? '<p class="muted small">لا شيء معلّق. 🎉</p>' : ''}
        </div>
      </div>`;
    if (tab === 'approvals') { const pend = S.items.filter(i => i.status === 'pending'); return `${title('موافقات القطع', 'مراجعة مبدئية قبل الإحالة لفريق التوثيق')}${pend.length ? `<div class="items-grid">${pend.map(i => { const o = Store.userById(i.ownerId); return `<div class="card item-card"><div class="top-tags">${tierBadge(i.tier)}</div>${art(i)}<div class="body"><span class="brand">${esc(i.brand)}</span><h3>${esc(i.name)}</h3><p class="small muted">${esc(i.desc) || 'بدون وصف'}</p><div class="row between small"><span class="muted">المالكة</span><b>${o.name}</b></div><div class="row between small"><span class="muted">القيمة السوقية</span><b>${money(i.retail)}</b></div><div class="row between small"><span class="muted">الإيجار المقترح</span><b>${money(i.rate)}</b></div><div class="row between small"><span class="muted">الحالة</span><b>${i.condition}</b></div><div class="actions mt-2"><button class="btn btn-ok btn-sm grow" data-action="approve" data-id="${i.id}">${SVG.check} موافقة وإحالة للتوثيق</button><button class="btn btn-danger btn-sm" data-action="reject" data-id="${i.id}">رفض</button></div></div></div>`; }).join('')}</div>` : `<div class="card big-empty"><div class="big">✅</div>لا توجد قطع بانتظار المراجعة.</div>`}`; }
    if (tab === 'orders') { const rs = [...S.rentals].sort((a, b) => b.start.localeCompare(a.start)); return `${title('الطلبات', `${k.openOrders} طلب مفتوح من ${rs.length}`)}<div class="card"><div class="table-wrap"><table><thead><tr><th>#</th><th>القطعة</th><th>المشتركة</th><th>المدة</th><th>الحالة</th><th>إجراء</th></tr></thead><tbody>${rs.map(orderRow).join('')}</tbody></table></div></div>`; }
    if (tab === 'inventory') return inventoryTable(title('المخزون', `${S.items.length} قطعة مسجّلة في النظام`), true);
    if (tab === 'users') return `${title('المستخدمون', `${S.users.length} حساب`)}<div class="card"><div class="table-wrap"><table><thead><tr><th>المستخدم</th><th>الدور</th><th>المدينة</th><th>مفتاح الوصول</th><th>انضم</th><th>الحالة</th><th></th></tr></thead><tbody>${S.users.map(x => `<tr><td><div class="row"><div class="avatar" style="width:30px;height:30px;font-size:.7rem">${initials(x.name)}</div><b>${x.name}</b></div></td><td>${roleBadge(x.role)}</td><td>${x.city}</td><td><code style="direction:ltr;color:var(--gold-2)">${x.key}</code></td><td>${fmtDate(x.joined)}</td><td>${x.status === 'active' ? '<span class="badge ok">نشط</span>' : '<span class="badge bad">موقوف</span>'}</td><td>${x.role !== 'admin' ? `<button class="btn ${x.status === 'active' ? 'btn-danger' : 'btn-ok'} btn-sm" data-action="toggle-user" data-id="${x.id}">${x.status === 'active' ? 'إيقاف' : 'تفعيل'}</button>` : ''}</td></tr>`).join('')}</tbody></table></div></div>`;
    if (tab === 'payouts') return `${title('تحويلات المالكات', 'اعتماد طلبات التحويل البنكي')}<div class="card"><div class="table-wrap"><table><thead><tr><th>المالكة</th><th>الآيبان</th><th>المبلغ</th><th>التاريخ</th><th>الحالة</th><th></th></tr></thead><tbody>${S.payouts.map(p => { const o = Store.userById(p.ownerId); return `<tr><td><b>${o.name}</b></td><td><code style="direction:ltr;font-size:.8rem">${o.iban || '—'}</code></td><td>${money(p.amount)}</td><td>${fmtDate(p.date)}</td><td>${badge(PAYOUT_STATUS, p.status)}</td><td>${p.status === 'pending' ? `<div class="actions"><button class="btn btn-ok btn-sm" data-action="payout-ok" data-id="${p.id}">اعتماد</button><button class="btn btn-danger btn-sm" data-action="payout-no" data-id="${p.id}">رفض</button></div>` : ''}</td></tr>`; }).join('')}</tbody></table></div></div>`;
    if (tab === 'settings') return `${title('إعدادات المنصة', 'نموذج الإيراد والسياسات')}<div class="grid-2"><div class="card"><form data-form="settings"><div class="field"><label>عمولة المنصة من قيمة الإيجار (٪)</label><input name="commission" type="number" min="10" max="70" value="${S.settings.commission}" dir="ltr"></div><div class="field"><label>ضريبة القيمة المضافة (٪)</label><input name="vat" type="number" min="0" max="30" value="${S.settings.vat}" dir="ltr"></div><div class="field"><label>مدة التوصيل القياسية (ساعة)</label><input name="deliveryHours" type="number" min="2" max="96" value="${S.settings.deliveryHours}" dir="ltr"></div><div class="field"><label>تغطية التأمين (٪)</label><input name="damageCover" type="number" min="50" max="100" value="${S.settings.damageCover}" dir="ltr"></div><button class="btn btn-gold" type="submit">حفظ</button></form></div>
      <div style="display:flex;flex-direction:column;gap:16px"><div class="card panel"><h3>نموذج الإيراد</h3><p class="small muted">المشتركة تدفع اشتراكاً شهرياً ثابتاً حسب الباقة. لكل قطعة قيمة إيجار مرجعية (~٤٪ من قيمتها السوقية) تُستخدم لاحتساب حصة المالكة (${100 - S.settings.commission}٪) عند كل إيجار. الفرق بين إيرادات الاشتراكات ومدفوعات المالكات وتكاليف التشغيل (توصيل، تنظيف، تأمين) هو هامش المنصة.</p></div><div class="card panel" style="border-color:rgba(240,106,106,.35)"><h3>منطقة الخطر</h3><p class="small muted">إعادة تعيين كل البيانات التجريبية إلى حالتها الأصلية (تُحذف الإضافات والتغييرات المحلية).</p><button class="btn btn-danger btn-sm mt-2" data-action="reset">إعادة تعيين البيانات التجريبية</button></div></div></div>`;
  }

  const nextLabel = (s) => ({ processing: 'تأكيد الشحن', shipped: 'تأكيد التسليم', active: 'تسجيل طلب إرجاع', return_requested: 'تأكيد الاستلام', returned: 'إرسال للتنظيف', cleaning: 'إنهاء وإتاحة' }[s] || 'التالي');

  function inventoryTable(head, isAdmin) {
    const S = Store.get();
    return `${head}<div class="card"><div class="table-wrap"><table><thead><tr><th>القطعة</th><th>التصنيف</th><th>الفئة</th><th>المالكة</th><th>القيمة</th><th>الحالة</th><th></th></tr></thead><tbody>${S.items.map(i => { const o = Store.userById(i.ownerId); let act = ''; if (i.status === 'pending' && isAdmin) act = `<button class="btn btn-ok btn-sm" data-action="approve" data-id="${i.id}">موافقة</button>`; if (i.status === 'authenticating') act = `<button class="btn btn-ok btn-sm" data-action="authenticate" data-id="${i.id}">توثيق</button>`; return `<tr><td><div class="cell-item">${thumb(i)}<div><b>${esc(i.brand)}</b><small>${esc(i.name)}</small></div></div></td><td>${catBadge(i.category)}</td><td>${tierBadge(i.tier)}</td><td>${o.name}</td><td>${money(i.retail)}</td><td>${badge(ITEM_STATUS, i.status)}</td><td><div class="actions">${act}</div></td></tr>`; }).join('')}</tbody></table></div></div>`;
  }

  /* ================= OPS ================= */
  function OpsDash(tab, u) {
    const S = Store.get();
    const title = (t, s) => `<div class="dash-title"><div><h1>${t}</h1><p>${s}</p></div></div>`;
    const auth = S.items.filter(i => i.status === 'authenticating');
    const open = S.rentals.filter(r => !['completed', 'cancelled'].includes(r.status));
    const byStatus = (s) => open.filter(r => r.status === s);
    const orderCard = (r) => { const it = Store.item(r.itemId); const rn = Store.userById(r.renterId); return `<div class="card rental-card">${thumb(it)}<div><div class="row" style="gap:6px"><b class="nm">${esc(it.brand)} ${esc(it.name)}</b>${badge(RENTAL_STATUS, r.status)}</div><div class="meta"><span>${rn.name}</span><span>${r.city}</span><span>${fmtDate(r.start)} → ${fmtDate(r.end)}</span></div>${timeline(r.status)}</div><div class="actions"><button class="btn btn-ok btn-sm" data-action="advance" data-id="${r.id}">${nextLabel(r.status)}</button></div></div>`; };
    if (tab === 'overview') return `${title(`مرحباً ${u.name.split(' ')[0]} 📦`, 'مهام اليوم في التوثيق والشحن')}
      <div class="kpis">${kpi('قطع بانتظار التوثيق', auth.length, '', auth.length ? 'violet' : '')}${kpi('طلبات للشحن', byStatus('processing').length)}${kpi('في الطريق', byStatus('shipped').length)}${kpi('إرجاعات وتنظيف', byStatus('return_requested').length + byStatus('returned').length + byStatus('cleaning').length)}</div>
      <div class="grid-2">
        <div class="card panel"><h3>قائمة التوثيق <a href="#/dashboard/auth" class="btn btn-ghost btn-sm">الكل</a></h3>${auth.length ? auth.map(i => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div class="cell-item">${thumb(i)}<div><b>${esc(i.brand)}</b><small>${esc(i.name)}</small></div></div><button class="btn btn-ok btn-sm" data-action="authenticate" data-id="${i.id}">توثيق</button></div>`).join('') : '<p class="muted small">لا توجد قطع قيد التوثيق.</p>'}</div>
        <div class="card panel"><h3>مهام الشحن العاجلة <a href="#/dashboard/shipments" class="btn btn-ghost btn-sm">الكل</a></h3>${[...byStatus('processing'), ...byStatus('return_requested')].map(r => { const it = Store.item(r.itemId); return `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div class="cell-item">${thumb(it)}<div><b>${esc(it.brand)}</b><small>${r.city} · ${RENTAL_STATUS[r.status].label}</small></div></div><button class="btn btn-ok btn-sm" data-action="advance" data-id="${r.id}">${nextLabel(r.status)}</button></div>`; }).join('') || '<p class="muted small">لا توجد مهام عاجلة.</p>'}</div>
      </div>`;
    if (tab === 'auth') return `${title('توثيق القطع', 'فحص الأصالة والحالة قبل العرض')}${auth.length ? `<div class="items-grid">${auth.map(i => { const o = Store.userById(i.ownerId); return `<div class="card item-card violet"><div class="top-tags">${tierBadge(i.tier)}${catBadge(i.category)}</div>${art(i)}<div class="body"><span class="brand">${esc(i.brand)}</span><h3>${esc(i.name)}</h3><div class="row between small"><span class="muted">المالكة</span><b>${o.name}</b></div><div class="row between small"><span class="muted">الحالة المُعلنة</span><b>${i.condition}</b></div><div class="row between small"><span class="muted">القيمة</span><b>${money(i.retail)}</b></div><div class="mt-2 small muted">قائمة الفحص: الأختام · الأرقام التسلسلية · الخياطة · المعدن · الجلد · الملحقات</div><div class="actions mt-2"><button class="btn btn-ok btn-sm grow" data-action="authenticate" data-id="${i.id}">${SVG.shield} أصلية — إتاحة للعرض</button><button class="btn btn-danger btn-sm" data-action="reject" data-id="${i.id}">لم تجتز</button></div></div></div>`; }).join('')}</div>` : `<div class="card big-empty"><div class="big">🛡️</div>لا توجد قطع قيد التوثيق.</div>`}`;
    if (tab === 'shipments') return `${title('الشحنات والإرجاع', `${open.length} طلب مفتوح`)}<div style="display:flex;flex-direction:column;gap:12px">${open.sort((a, b) => RENTAL_FLOW.indexOf(a.status) - RENTAL_FLOW.indexOf(b.status)).map(orderCard).join('') || '<div class="card big-empty"><div class="big">🚚</div>لا توجد طلبات مفتوحة.</div>'}</div>`;
    if (tab === 'inventory') return inventoryTable(title('المخزون', 'كل القطع وحالتها'), false);
  }

  /* ================= MODALS ================= */
  const rentSuccess = (it, r) => `<div class="modal center"><button class="icon-btn close" data-action="close-modal">${SVG.x}</button><div class="success-ic">✓</div><h2>تم الحجز بنجاح!</h2><p class="muted">${esc(it.brand)} ${esc(it.name)} في طريقها إليكِ.</p><div class="card mt-2" style="padding:16px;text-align:start"><div class="row between small"><span class="muted">رقم الطلب</span><code>${r.id}</code></div><div class="row between small"><span class="muted">التوصيل المتوقع</span><b>خلال ${Store.get().settings.deliveryHours} ساعة</b></div><div class="row between small"><span class="muted">الإرجاع</span><b>${fmtDate(r.end)}</b></div><div class="row between small"><span class="muted">التكلفة الإضافية</span><b class="gold-text">٠ ر.س — ضمن اشتراكك</b></div></div><div class="row mt-3" style="justify-content:center"><a href="#/dashboard/rentals" class="btn btn-gold" data-action="close-modal">تتبّع الطلب</a><a href="#/catalog" class="btn btn-ghost" data-action="close-modal">متابعة التصفح</a></div></div>`;
  const rejectModal = (it) => `<div class="modal"><button class="icon-btn close" data-action="close-modal">${SVG.x}</button><h2>رفض القطعة</h2><p class="muted">${esc(it.brand)} ${esc(it.name)} — سيُبلَّغ المالك بالسبب.</p><form data-form="reject" data-id="${it.id}" class="mt-2"><div class="field"><label>سبب الرفض</label><select name="reason"><option>لم تجتز فحص الأصالة</option><option>حالة القطعة دون المعايير</option><option>خدوش أو تلف واضح</option><option>الدار غير مدعومة حالياً</option><option>بيانات غير مكتملة</option></select></div><div class="row" style="justify-content:end"><button type="button" class="btn btn-ghost" data-action="close-modal">إلغاء</button><button class="btn btn-danger" type="submit">تأكيد الرفض</button></div></form></div>`;
  const confirmModal = (title, text, action, id, btn = 'تأكيد', cls = 'btn-gold') => `<div class="modal"><button class="icon-btn close" data-action="close-modal">${SVG.x}</button><h2>${title}</h2><p class="muted">${text}</p><div class="row mt-3" style="justify-content:end"><button class="btn btn-ghost" data-action="close-modal">تراجع</button><button class="btn ${cls}" data-action="${action}" data-id="${id || ''}" data-confirmed="1">${btn}</button></div></div>`;

  return { Home, Catalog, Item, Plans, How, Owners, About, Login, Dashboard, rentSuccess, rejectModal, confirmModal, initials, SVG, esc };
})();
