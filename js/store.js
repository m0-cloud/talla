/* ============================================================
   Rent4Less — إدارة الحالة (Store)
   يحفظ الحالة في localStorage ليبقى الموقع "ديناميكياً" بين الجلسات
   ============================================================ */

const Store = (() => {
  const KEY = 'r4l_state_v1';
  const SKEY = 'r4l_session_v1';

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = (p) => p + Math.random().toString(36).slice(2, 7);
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const addDays = (iso, n) => { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const nowTS = () => new Date().toISOString().slice(0, 19);

  let state = load();
  let session = null;
  try { session = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { session = null; }

  function load() {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {}
    return clone(SEED);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function saveSession() { try { localStorage.setItem(SKEY, JSON.stringify(session)); } catch (e) {} }
  function log(text) { state.activity.unshift({ ts: nowTS(), text }); state.activity = state.activity.slice(0, 40); }

  /* ---------- Getters ---------- */
  const get = () => state;
  const user = () => session ? state.users.find(u => u.id === session.userId) || null : null;
  const userById = (id) => state.users.find(u => u.id === id);
  const plan = (id) => state.plans.find(p => p.id === id);
  const item = (id) => state.items.find(i => i.id === id);
  const rental = (id) => state.rentals.find(r => r.id === id);

  const subOf = (userId) => state.subscriptions.find(s => s.userId === userId && s.status === 'active') || null;
  const planOf = (userId) => { const s = subOf(userId); return s ? plan(s.planId) : null; };
  const activeRentals = (userId) => state.rentals.filter(r => r.renterId === userId && ['processing', 'shipped', 'active', 'return_requested'].includes(r.status));
  const slotsUsed = (userId) => activeRentals(userId).length;
  const rentalsOf = (userId) => state.rentals.filter(r => r.renterId === userId).sort((a, b) => b.start.localeCompare(a.start));
  const itemsOf = (ownerId) => state.items.filter(i => i.ownerId === ownerId);
  const wishlistOf = (userId) => state.wishlist[userId] || [];
  const isWished = (userId, itemId) => wishlistOf(userId).includes(itemId);
  const currentRentalOfItem = (itemId) => state.rentals.find(r => r.itemId === itemId && !['completed', 'cancelled'].includes(r.status));

  const ownerShare = () => (100 - state.settings.commission) / 100;
  const earningsOf = (ownerId) => {
    const ids = itemsOf(ownerId).map(i => i.id);
    return state.rentals
      .filter(r => ids.includes(r.itemId) && r.status !== 'processing' && r.status !== 'cancelled')
      .map(r => ({ ...r, amount: Math.round(item(r.itemId).rate * ownerShare()) }));
  };
  const balanceOf = (ownerId) => {
    const earned = earningsOf(ownerId).reduce((s, r) => s + r.amount, 0);
    const out = state.payouts.filter(p => p.ownerId === ownerId && p.status !== 'rejected').reduce((s, p) => s + p.amount, 0);
    return Math.max(0, earned - out);
  };

  const publicItems = () => state.items.filter(i => ['available', 'rented', 'cleaning'].includes(i.status));

  const kpis = () => {
    const activeSubs = state.subscriptions.filter(s => s.status === 'active');
    const mrr = activeSubs.reduce((s, sub) => s + plan(sub.planId).price, 0);
    const pool = state.items.filter(i => ['available', 'rented', 'cleaning'].includes(i.status));
    const rented = pool.filter(i => i.status === 'rented').length;
    return {
      mrr,
      activeSubs: activeSubs.length,
      utilization: pool.length ? Math.round((rented / pool.length) * 100) : 0,
      pendingItems: state.items.filter(i => i.status === 'pending').length,
      pendingPayouts: state.payouts.filter(p => p.status === 'pending').length,
      openOrders: state.rentals.filter(r => !['completed', 'cancelled'].includes(r.status)).length,
      totalItems: state.items.length,
      renters: state.users.filter(u => u.role === 'renter').length,
      owners: state.users.filter(u => u.role === 'owner').length,
    };
  };

  const revenueByMonth = (months = 6) => {
    const out = [];
    const d = new Date(); d.setDate(1);
    for (let i = months - 1; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const key = m.toISOString().slice(0, 7);
      const total = state.transactions.filter(t => t.date.startsWith(key)).reduce((s, t) => s + t.amount, 0);
      out.push({ key, label: m.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { month: 'short' }), total });
    }
    return out;
  };

  const ownerEarningsByMonth = (ownerId, months = 6) => {
    const rows = earningsOf(ownerId);
    const out = [];
    const d = new Date(); d.setDate(1);
    for (let i = months - 1; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const key = m.toISOString().slice(0, 7);
      out.push({ key, label: m.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { month: 'short' }), total: rows.filter(r => r.start.startsWith(key)).reduce((s, r) => s + r.amount, 0) });
    }
    return out;
  };

  /* ---------- Auth ---------- */
  function login(key) {
    const k = (key || '').trim().toUpperCase();
    const u = state.users.find(x => x.key === k);
    if (!u) return { ok: false, msg: 'مفتاح الوصول غير صحيح. جرّبي أحد المفاتيح التجريبية أدناه.' };
    if (u.status === 'suspended') return { ok: false, msg: 'هذا الحساب موقوف مؤقتاً. تواصلي مع الدعم.' };
    session = { userId: u.id };
    saveSession();
    return { ok: true, user: u };
  }
  function logout() { session = null; saveSession(); }

  /* ---------- Renter actions ---------- */
  function subscribe(planId) {
    const u = user(); if (!u || u.role !== 'renter') return { ok: false, msg: 'الاشتراك متاح لحسابات المشتركات فقط.' };
    const p = plan(planId); if (!p) return { ok: false, msg: 'الباقة غير موجودة.' };
    const existing = subOf(u.id);
    if (existing) {
      if (existing.planId === planId) return { ok: false, msg: 'أنتِ مشتركة بالفعل في هذه الباقة.' };
      const old = plan(existing.planId);
      if (p.slots < slotsUsed(u.id)) return { ok: false, msg: `لديكِ ${slotsUsed(u.id)} قطع نشطة، أعيدي بعضها قبل التخفيض.` };
      existing.planId = planId;
      state.transactions.unshift({ id: uid('t'), userId: u.id, type: 'subscription', amount: p.price, date: todayISO(), desc: `تغيير الباقة من ${old.name} إلى ${p.name}` });
      log(`${u.name} غيّرت باقتها إلى ${p.name}`);
      save();
      return { ok: true, msg: `تم تغيير باقتك إلى ${p.name} بنجاح.` };
    }
    state.subscriptions.push({ id: uid('s'), userId: u.id, planId, start: todayISO(), renew: addDays(todayISO(), 30), status: 'active', swapsUsed: 0 });
    state.transactions.unshift({ id: uid('t'), userId: u.id, type: 'subscription', amount: p.price, date: todayISO(), desc: `اشتراك باقة ${p.name}` });
    log(`${u.name} اشتركت في باقة ${p.name}`);
    save();
    return { ok: true, msg: `مبروك! أصبحتِ مشتركة في باقة ${p.name}. اختاري قطعتك الأولى الآن.` };
  }

  function cancelSubscription() {
    const u = user(); const s = u && subOf(u.id);
    if (!s) return { ok: false, msg: 'لا يوجد اشتراك نشط.' };
    if (slotsUsed(u.id)) return { ok: false, msg: 'أعيدي كل القطع النشطة قبل إلغاء الاشتراك.' };
    s.status = 'cancelled';
    log(`${u.name} ألغت اشتراكها`);
    save();
    return { ok: true, msg: 'تم إلغاء التجديد. نتمنى رؤيتك قريباً.' };
  }

  function canRent(itemId) {
    const u = user();
    if (!u) return { ok: false, code: 'login', msg: 'سجّلي الدخول أولاً لاستئجار القطعة.' };
    if (u.role !== 'renter') return { ok: false, code: 'role', msg: 'الاستئجار متاح لحسابات المشتركات فقط.' };
    const it = item(itemId);
    if (!it || it.status !== 'available') return { ok: false, code: 'na', msg: 'هذه القطعة غير متاحة حالياً.' };
    const p = planOf(u.id);
    if (!p) return { ok: false, code: 'plan', msg: 'اختاري باقة اشتراك أولاً.' };
    if (it.tier > p.tier) return { ok: false, code: 'tier', msg: `هذه القطعة من فئة ${plan('p' + it.tier).name}. رقّي باقتك للوصول إليها.` };
    if (slotsUsed(u.id) >= p.slots) return { ok: false, code: 'slots', msg: `استخدمتِ كل خانات باقتك (${p.slots}). أعيدي قطعة أو رقّي باقتك.` };
    return { ok: true };
  }

  function rent(itemId) {
    const c = canRent(itemId); if (!c.ok) return c;
    const u = user(); const it = item(itemId);
    const r = { id: uid('r'), itemId, renterId: u.id, start: todayISO(), end: addDays(todayISO(), 30), status: 'processing', city: u.city };
    state.rentals.unshift(r);
    it.status = 'rented';
    log(`${u.name} استأجرت ${it.brand} ${it.name}`);
    save();
    return { ok: true, msg: `تم الحجز! ${it.brand} ${it.name} ستصلك خلال ${state.settings.deliveryHours} ساعة.`, rental: r };
  }

  function requestReturn(rentalId) {
    const r = rental(rentalId); const u = user();
    if (!r || !u || r.renterId !== u.id) return { ok: false, msg: 'الطلب غير موجود.' };
    if (r.status === 'processing') {
      r.status = 'cancelled'; item(r.itemId).status = 'available';
      log(`${u.name} ألغت طلب ${r.id}`); save();
      return { ok: true, msg: 'تم إلغاء الطلب قبل الشحن.' };
    }
    if (r.status !== 'active') return { ok: false, msg: 'لا يمكن طلب الإرجاع في هذه المرحلة.' };
    r.status = 'return_requested';
    log(`${u.name} طلبت إرجاع ${item(r.itemId).name}`); save();
    return { ok: true, msg: 'تم تسجيل طلب الإرجاع. سيصلك المندوب خلال ٢٤ ساعة.' };
  }

  function extendRental(rentalId) {
    const r = rental(rentalId); const u = user();
    if (!r || !u || r.renterId !== u.id || r.status !== 'active') return { ok: false, msg: 'لا يمكن التمديد.' };
    r.end = addDays(r.end, 30);
    log(`${u.name} مدّدت إيجار ${item(r.itemId).name}`); save();
    return { ok: true, msg: 'تم التمديد شهراً إضافياً ضمن اشتراكك.' };
  }

  function toggleWishlist(itemId) {
    const u = user(); if (!u) return { ok: false, code: 'login', msg: 'سجّلي الدخول لحفظ المفضلة.' };
    const list = state.wishlist[u.id] || (state.wishlist[u.id] = []);
    const idx = list.indexOf(itemId);
    if (idx > -1) { list.splice(idx, 1); save(); return { ok: true, added: false, msg: 'أُزيلت من المفضلة.' }; }
    list.push(itemId); save();
    return { ok: true, added: true, msg: 'أُضيفت إلى المفضلة ♥' };
  }

  function updateProfile(fields) {
    const u = user(); if (!u) return { ok: false };
    Object.assign(u, fields); save();
    return { ok: true, msg: 'تم حفظ بياناتك.' };
  }

  /* ---------- Owner actions ---------- */
  function addItem(data) {
    const u = user(); if (!u || u.role !== 'owner') return { ok: false, msg: 'غير مصرح.' };
    const arts = ['linear-gradient(135deg,#1a1230 0%,#4a2f8a 55%,#b48cff 100%)', 'linear-gradient(135deg,#2a0f1a 0%,#8a2f55 55%,#ff9ac2 100%)', 'linear-gradient(135deg,#0f2a2a 0%,#2f8a80 55%,#9affee 100%)', 'linear-gradient(135deg,#2a2210 0%,#8a6f2f 55%,#ffe19a 100%)'];
    const it = {
      id: uid('i'), name: data.name, brand: data.brand.toUpperCase(), category: data.category, ownerId: u.id,
      tier: Number(data.tier), retail: Number(data.retail), rate: Math.round(Number(data.retail) * 0.04),
      status: 'pending', condition: data.condition, size: data.size || undefined, desc: data.desc || '',
      color: '#d8b25c', art: arts[Math.floor(Math.random() * arts.length)], likes: 0, createdAt: todayISO(),
    };
    state.items.unshift(it);
    log(`${u.name} أضافت قطعة جديدة: ${it.brand} ${it.name}`); save();
    return { ok: true, msg: 'تم إرسال القطعة للمراجعة. سنستلمها منك خلال ٤٨ ساعة للتوثيق والتصوير.', item: it };
  }

  function withdrawItem(itemId) {
    const u = user(); const it = item(itemId);
    if (!u || !it || it.ownerId !== u.id) return { ok: false, msg: 'غير مصرح.' };
    if (it.status !== 'available' && it.status !== 'pending') return { ok: false, msg: 'لا يمكن سحب القطعة إلا وهي متاحة أو قيد المراجعة.' };
    it.status = 'withdrawn';
    log(`${u.name} سحبت قطعة ${it.brand} ${it.name}`); save();
    return { ok: true, msg: 'تم سحب القطعة. سنرتّب إعادتها إليك.' };
  }

  function relistItem(itemId) {
    const u = user(); const it = item(itemId);
    if (!u || !it || it.ownerId !== u.id || !['withdrawn', 'rejected'].includes(it.status)) return { ok: false, msg: 'غير مصرح.' };
    it.status = 'pending'; delete it.rejectReason;
    log(`${u.name} أعادت عرض ${it.brand} ${it.name}`); save();
    return { ok: true, msg: 'أُعيدت القطعة إلى قائمة المراجعة.' };
  }

  function requestPayout() {
    const u = user(); if (!u || u.role !== 'owner') return { ok: false, msg: 'غير مصرح.' };
    const bal = balanceOf(u.id);
    if (bal < 100) return { ok: false, msg: 'الحد الأدنى للتحويل ١٠٠ ر.س.' };
    if (state.payouts.some(p => p.ownerId === u.id && p.status === 'pending')) return { ok: false, msg: 'لديكِ طلب تحويل قيد الاعتماد بالفعل.' };
    state.payouts.unshift({ id: uid('po'), ownerId: u.id, amount: bal, status: 'pending', date: todayISO() });
    log(`${u.name} طلبت تحويل أرباح بقيمة ${bal} ر.س`); save();
    return { ok: true, msg: `تم إرسال طلب تحويل ${bal.toLocaleString('en-US')} ر.س. يُعتمد خلال ٣ أيام عمل.` };
  }

  /* ---------- Admin / Ops actions ---------- */
  const isStaff = () => { const u = user(); return u && (u.role === 'admin' || u.role === 'ops'); };
  const isAdmin = () => { const u = user(); return u && u.role === 'admin'; };

  function approveItem(itemId) {
    if (!isAdmin()) return { ok: false, msg: 'غير مصرح.' };
    const it = item(itemId); if (!it || it.status !== 'pending') return { ok: false, msg: 'القطعة ليست قيد المراجعة.' };
    it.status = 'authenticating';
    log(`تمت الموافقة المبدئية على ${it.brand} ${it.name} — بانتظار التوثيق`); save();
    return { ok: true, msg: 'تمت الموافقة وأُحيلت القطعة إلى فريق التوثيق.' };
  }
  function rejectItem(itemId, reason) {
    if (!isStaff()) return { ok: false, msg: 'غير مصرح.' };
    const it = item(itemId); if (!it) return { ok: false };
    it.status = 'rejected'; it.rejectReason = reason || 'لم تستوفِ معايير الجودة';
    log(`رُفضت ${it.brand} ${it.name}: ${it.rejectReason}`); save();
    return { ok: true, msg: 'تم رفض القطعة وإبلاغ المالكة.' };
  }
  function authenticateItem(itemId) {
    if (!isStaff()) return { ok: false, msg: 'غير مصرح.' };
    const it = item(itemId); if (!it || it.status !== 'authenticating') return { ok: false, msg: 'القطعة ليست قيد التوثيق.' };
    it.status = 'available';
    log(`✔ توثيق ${it.brand} ${it.name} — أصبحت متاحة في التشكيلة`); save();
    return { ok: true, msg: 'تم التوثيق. القطعة الآن متاحة للمشتركات.' };
  }

  function advanceRental(rentalId) {
    if (!isStaff()) return { ok: false, msg: 'غير مصرح.' };
    const r = rental(rentalId); if (!r) return { ok: false };
    const idx = RENTAL_FLOW.indexOf(r.status);
    if (idx < 0 || idx >= RENTAL_FLOW.length - 1) return { ok: false, msg: 'الطلب في مرحلته الأخيرة.' };
    let next = RENTAL_FLOW[idx + 1];
    if (r.status === 'active') next = 'return_requested';
    r.status = next;
    const it = item(r.itemId);
    if (next === 'cleaning') it.status = 'cleaning';
    if (next === 'completed') it.status = 'available';
    log(`الطلب ${r.id} (${it.brand} ${it.name}) → ${RENTAL_STATUS[next].label}`); save();
    return { ok: true, msg: `تم تحديث الطلب إلى: ${RENTAL_STATUS[next].label}` };
  }

  function approvePayout(id, ok = true) {
    if (!isAdmin()) return { ok: false, msg: 'غير مصرح.' };
    const p = state.payouts.find(x => x.id === id); if (!p || p.status !== 'pending') return { ok: false };
    p.status = ok ? 'paid' : 'rejected'; p.date = todayISO();
    log(`${ok ? 'اعتماد' : 'رفض'} تحويل ${p.amount} ر.س إلى ${userById(p.ownerId).name}`); save();
    return { ok: true, msg: ok ? 'تم اعتماد التحويل.' : 'تم رفض التحويل.' };
  }

  function toggleUser(userId) {
    if (!isAdmin()) return { ok: false, msg: 'غير مصرح.' };
    const u = userById(userId); if (!u || u.role === 'admin') return { ok: false, msg: 'لا يمكن تعديل هذا الحساب.' };
    u.status = u.status === 'active' ? 'suspended' : 'active';
    log(`${u.status === 'active' ? 'تفعيل' : 'إيقاف'} حساب ${u.name}`); save();
    return { ok: true, msg: u.status === 'active' ? 'تم تفعيل الحساب.' : 'تم إيقاف الحساب.' };
  }

  function updateSettings(fields) {
    if (!isAdmin()) return { ok: false, msg: 'غير مصرح.' };
    Object.assign(state.settings, fields); log('تم تحديث إعدادات المنصة'); save();
    return { ok: true, msg: 'تم حفظ الإعدادات.' };
  }

  function resetDemo() {
    state = clone(SEED); save();
    return { ok: true, msg: 'تمت إعادة تعيين البيانات التجريبية.' };
  }

  return {
    get, user, userById, plan, item, rental, subOf, planOf, activeRentals, slotsUsed, rentalsOf, itemsOf,
    wishlistOf, isWished, currentRentalOfItem, earningsOf, balanceOf, ownerShare, publicItems, kpis,
    revenueByMonth, ownerEarningsByMonth,
    login, logout, subscribe, cancelSubscription, canRent, rent, requestReturn, extendRental, toggleWishlist, updateProfile,
    addItem, withdrawItem, relistItem, requestPayout,
    approveItem, rejectItem, authenticateItem, advanceRental, approvePayout, toggleUser, updateSettings, resetDemo,
    todayISO,
  };
})();
