/* ============================================================
   Talla · طلّة — بيانات تجريبية (Demo Data)
   نموذج العمل: اشتراك شهري لاستئجار قطع فاخرة (حقائب، أحذية،
   ساعات، مجوهرات، إكسسوارات) من مالكات القطع (Consigners)
   عبر منصة توثّق، تنظّف، تؤمّن وتوصّل داخل السعودية.
   ============================================================ */

const ROLE_LABELS = {
  admin:  'مدير النظام',
  ops:    'فريق العمليات',
  owner:  'مالكة قطع',
  renter: 'مشتركة',
};

const CATEGORY_LABELS = {
  bags: 'حقائب',
  shoes: 'أحذية',
  watches: 'ساعات',
  jewelry: 'مجوهرات',
  accessories: 'إكسسوارات',
};

const ITEM_STATUS = {
  pending:        { label: 'بانتظار المراجعة',  tone: 'warn' },
  authenticating: { label: 'قيد التوثيق',        tone: 'info' },
  available:      { label: 'متاحة الآن',         tone: 'ok'   },
  rented:         { label: 'مؤجّرة حالياً',      tone: 'gold' },
  cleaning:       { label: 'تنظيف وتعقيم',       tone: 'info' },
  rejected:       { label: 'مرفوضة',             tone: 'bad'  },
  withdrawn:      { label: 'مسحوبة',             tone: 'muted'},
};

const RENTAL_FLOW = ['processing', 'shipped', 'active', 'return_requested', 'returned', 'cleaning', 'completed'];
const RENTAL_STATUS = {
  processing:       { label: 'قيد التجهيز',       tone: 'info' },
  shipped:          { label: 'في الطريق إليكِ',    tone: 'info' },
  active:           { label: 'معكِ الآن',          tone: 'ok'   },
  return_requested: { label: 'طلب إرجاع',          tone: 'warn' },
  returned:         { label: 'تم الاستلام',        tone: 'muted'},
  cleaning:         { label: 'تنظيف وتعقيم',       tone: 'info' },
  completed:        { label: 'مكتمل',              tone: 'muted'},
  cancelled:        { label: 'ملغي',               tone: 'bad'  },
};

const PAYOUT_STATUS = {
  pending: { label: 'بانتظار الاعتماد', tone: 'warn' },
  paid:    { label: 'تم التحويل',       tone: 'ok'   },
  rejected:{ label: 'مرفوض',            tone: 'bad'  },
};

// صور القطع من Unsplash (ترخيص Unsplash — الربط المباشر عبر CDN)
const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
const CATEGORY_IMG = {
  bags: U('1589363358751-ab05797e5629'),
  shoes: U('1573100925118-870b8efc799d'),
  watches: U('1600003014637-ff82a275e191'),
  jewelry: U('1721807644561-9efcabee5c42'),
  accessories: U('1577803645773-f96470509666'),
};

const CITIES = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة'];

const SEED = {
  settings: {
    commission: 40,   // نسبة المنصة من قيمة الإيجار الشهري للقطعة
    vat: 15,          // ضريبة القيمة المضافة
    deliveryHours: 24,
    damageCover: 100, // تغطية الأضرار %
  },

  users: [
    { id: 'u1', name: 'عبدالله الحربي',  role: 'admin',  key: 'ADMIN-2026',  city: 'الرياض', phone: '0501111111', joined: '2025-11-01', status: 'active' },
    { id: 'u2', name: 'سارة القحطاني',   role: 'ops',    key: 'OPS-5510',    city: 'الرياض', phone: '0502222222', joined: '2026-01-10', status: 'active' },
    { id: 'u3', name: 'نورة العتيبي',    role: 'owner',  key: 'OWNER-7741',  city: 'الرياض', phone: '0553333333', joined: '2026-02-14', status: 'active', iban: 'SA03 8000 0000 6080 1016 7519' },
    { id: 'u4', name: 'ريم الشمري',      role: 'owner',  key: 'OWNER-8852',  city: 'جدة',    phone: '0554444444', joined: '2026-03-02', status: 'active', iban: 'SA44 2000 0001 2345 6789 1234' },
    { id: 'u5', name: 'لمى الدوسري',     role: 'renter', key: 'RENTER-3320', city: 'الرياض', phone: '0565555555', joined: '2026-05-20', status: 'active', address: 'حي الياسمين، شارع الأمير محمد بن سلمان' },
    { id: 'u6', name: 'هند المطيري',     role: 'renter', key: 'RENTER-4410', city: 'الدمام', phone: '0566666666', joined: '2026-09-15', status: 'active', address: 'حي الشاطئ' },
    { id: 'u7', name: 'منيرة الزهراني',  role: 'renter', key: 'RENTER-5566', city: 'جدة',    phone: '0567777777', joined: '2026-08-15', status: 'active', address: 'حي الروضة' },
  ],

  plans: [
    { id: 'p1', name: 'لؤلؤة', tier: 1, price: 499,  slots: 1, swaps: 1,  color: '#cfd8e3',
      tagline: 'قطعة واحدة كل شهر',
      perks: ['قطعة فاخرة واحدة في نفس الوقت', 'تبديل واحد شهرياً', 'توصيل واستلام مجاني', 'تأمين كامل ضد الأضرار'] },
    { id: 'p2', name: 'ذهب',   tier: 2, price: 999,  slots: 2, swaps: 3,  color: '#d8b25c', featured: true,
      tagline: 'الأكثر طلباً',
      perks: ['قطعتان في نفس الوقت', '٣ تبديلات شهرياً', 'وصول لقطع الفئة الذهبية', 'توصيل خلال ٢٤ ساعة', 'تأمين كامل ضد الأضرار'] },
    { id: 'p3', name: 'ماس',   tier: 3, price: 1999, slots: 3, swaps: 99, color: '#b9e6ff',
      tagline: 'تجربة بلا حدود',
      perks: ['٣ قطع في نفس الوقت', 'تبديلات غير محدودة', 'وصول لكل القطع بما فيها النادرة', 'مستشارة أناقة شخصية', 'أولوية الحجز على القطع الجديدة', 'توصيل في نفس اليوم'] },
  ],

  items: [
    { id: 'i1', img: U('1773777145747-b5b7356f4e81'),  name: 'Classic Flap Medium', brand: 'CHANEL', category: 'bags', ownerId: 'u3', tier: 3, retail: 38000, rate: 1400, status: 'rented', condition: 'ممتازة', color: '#1c1a1e', art: 'linear-gradient(135deg,#0f0e12 0%,#2a262d 55%,#4a4048 100%)', likes: 212, createdAt: '2026-03-05', desc: 'الأيقونة الخالدة بجلد الخروف المبطّن وسلسلة ذهبية متداخلة مع الجلد.' },
    { id: 'i2', img: U('1758959457535-acf87e3dab12'),  name: 'Kelly 28 Togo', brand: 'HERMÈS', category: 'bags', ownerId: 'u4', tier: 3, retail: 62000, rate: 2200, status: 'available', condition: 'كالجديدة', color: '#e07a2f', art: 'linear-gradient(135deg,#6b2a0c 0%,#c4501b 60%,#f39a4a 100%)', likes: 348, createdAt: '2026-03-18', desc: 'كيلي ٢٨ بلون البرتقالي الشهير مع إكسسوارات ذهبية، قطعة نادرة تكتمل بها أي إطلالة.' },
    { id: 'i3', img: U('1597633125184-9fd7e54f0ff7'),  name: 'Neverfull MM', brand: 'LOUIS VUITTON', category: 'bags', ownerId: 'u3', tier: 1, retail: 8500, rate: 420, status: 'available', condition: 'ممتازة', color: '#a8773d', art: 'linear-gradient(135deg,#3b2a14 0%,#7a5527 55%,#c9a06a 100%)', likes: 156, createdAt: '2026-03-20', desc: 'حقيبة الأعمال والسفر اليومية بمونوغرام كلاسيكي وبطانة حمراء.' },
    { id: 'i4', img: U('1681747685985-a401c271156c'),  name: 'Lady Dior Medium', brand: 'DIOR', category: 'bags', ownerId: 'u4', tier: 2, retail: 24000, rate: 950, status: 'rented', condition: 'كالجديدة', color: '#e9c3cf', art: 'linear-gradient(135deg,#5a4a52 0%,#a58a97 50%,#f0d3dc 100%)', likes: 289, createdAt: '2026-04-02', desc: 'ليدي ديور بغرزة الكاناج الشهيرة وبلون الوردي الباهت، أناقة لا تُنسى.' },
    { id: 'i5', img: U('1548036328-c9fa89d128fa'),  name: 'GG Marmont Small', brand: 'GUCCI', category: 'bags', ownerId: 'u3', tier: 1, retail: 9800, rate: 450, status: 'cleaning', condition: 'جيدة جداً', color: '#2f6b47', art: 'linear-gradient(135deg,#0f2a1c 0%,#2f6b47 55%,#a83a3a 100%)', likes: 98, createdAt: '2026-04-10', desc: 'مارمونت بجلد المطلاسة الأخضر وشعار GG المزدوج العتيق.' },
    { id: 'i6', img: U('1575296020525-faff52f00d8c'),  name: 'Jodie Mini', brand: 'BOTTEGA VENETA', category: 'bags', ownerId: 'u4', tier: 2, retail: 12000, rate: 600, status: 'available', condition: 'ممتازة', color: '#5aa860', art: 'linear-gradient(135deg,#0c2b12 0%,#2f7d3a 55%,#8fd58f 100%)', likes: 174, createdAt: '2026-04-12', desc: 'جودي ميني بجلد الإنترتشاتو الأخضر الباروت — قطعة فنية تحمل في اليد.' },
    { id: 'i7', img: U('1705909237050-7a7625b47fac'),  name: 'Loulou Medium', brand: 'SAINT LAURENT', category: 'bags', ownerId: 'u3', tier: 1, retail: 10500, rate: 480, status: 'pending', condition: 'ممتازة', color: '#c9b37e', art: 'linear-gradient(135deg,#111 0%,#3a3a3a 55%,#c9b37e 100%)', likes: 0, createdAt: '2026-09-18', desc: 'لولو بجلد مبطّن أسود وشعار YSL ذهبي.' },
    { id: 'i8', img: U('1611233299310-f6276ff55307'),  name: 'So Kate 120', brand: 'CHRISTIAN LOUBOUTIN', category: 'shoes', ownerId: 'u4', tier: 1, retail: 3400, rate: 260, status: 'available', condition: 'ممتازة', size: '38', color: '#d61f3c', art: 'linear-gradient(135deg,#3a0810 0%,#b8172f 55%,#ff6b7a 100%)', likes: 121, createdAt: '2026-04-20', desc: 'الكعب الأحمر الأيقوني بارتفاع ١٢٠ مم — للمناسبات التي تستحق.' },
    { id: 'i9', img: U('1632793039681-2cf5f97be82c'),  name: 'Hangisi 105', brand: 'MANOLO BLAHNIK', category: 'shoes', ownerId: 'u3', tier: 1, retail: 4200, rate: 280, status: 'rented', condition: 'كالجديدة', size: '37', color: '#3b64d6', art: 'linear-gradient(135deg,#0d1a4a 0%,#2f4fb8 55%,#8fb3ff 100%)', likes: 133, createdAt: '2026-05-01', desc: 'هانغيسي بالساتان الأزرق الملكي وبكلة الكريستال الشهيرة.' },
    { id: 'i10', img: U('1591884807537-0bce39888fe0'), name: 'Bing 100', brand: 'JIMMY CHOO', category: 'shoes', ownerId: 'u4', tier: 1, retail: 3900, rate: 240, status: 'authenticating', condition: 'ممتازة', size: '39', color: '#e8c9b0', art: 'linear-gradient(135deg,#4a3a2e 0%,#a98a72 55%,#f5dcc7 100%)', likes: 0, createdAt: '2026-09-16', desc: 'بينغ بالجلد النيود وحزام الكريستال.' },
    { id: 'i11', img: U('1653227908236-36813ab5c30a'), name: 'Love Bracelet', brand: 'CARTIER', category: 'jewelry', ownerId: 'u3', tier: 2, retail: 28000, rate: 900, status: 'available', condition: 'كالجديدة', color: '#e8c36a', art: 'linear-gradient(135deg,#3a2a0c 0%,#a8802a 55%,#f5e0a3 100%)', likes: 402, createdAt: '2026-05-05', desc: 'سوار لوف من الذهب الأصفر عيار ١٨ مع مفكّه الأيقوني.' },
    { id: 'i12', img: U('1777126413571-8ec9bf884245'), name: 'Vintage Alhambra Necklace', brand: 'VAN CLEEF & ARPELS', category: 'jewelry', ownerId: 'u4', tier: 2, retail: 19000, rate: 750, status: 'available', condition: 'ممتازة', color: '#3aa374', art: 'linear-gradient(135deg,#0a2a1c 0%,#1f7a55 55%,#9fe3c2 100%)', likes: 366, createdAt: '2026-05-12', desc: 'عقد ألهامبرا بحجر الملكيت الأخضر — عشر ورقات من الحظ.' },
    { id: 'i13', img: U('1730757679771-b53e798846cf'), name: 'Submariner Date', brand: 'ROLEX', category: 'watches', ownerId: 'u4', tier: 3, retail: 45000, rate: 1600, status: 'available', condition: 'كالجديدة', color: '#8fb8d8', art: 'linear-gradient(135deg,#0b1d2e 0%,#2b5678 55%,#a9d3f0 100%)', likes: 257, createdAt: '2026-05-20', desc: 'سبمارينر ديت ستانلس وذهب أصفر بميناء وإطار أزرقين — أيقونة الغوص التي تليق بكل معصم.' },
    { id: 'i14', img: U('1620625515032-6ed0c1790c75'), name: 'Tank Must', brand: 'CARTIER', category: 'watches', ownerId: 'u3', tier: 2, retail: 15000, rate: 650, status: 'available', condition: 'ممتازة', color: '#d9c39a', art: 'linear-gradient(135deg,#1f1a12 0%,#5a4a2e 55%,#d9c39a 100%)', likes: 188, createdAt: '2026-06-01', desc: 'تانك مست بسوار جلد أسود وميناء أبيض بالأرقام الرومانية.' },
    { id: 'i15', img: U('1611222777277-61319d63ca94'), name: 'DiorSignature B1U', brand: 'DIOR', category: 'accessories', ownerId: 'u4', tier: 1, retail: 1900, rate: 150, status: 'available', condition: 'ممتازة', color: '#c9a7b3', art: 'linear-gradient(135deg,#2a2226 0%,#6a555d 55%,#d9bcc7 100%)', likes: 74, createdAt: '2026-06-08', desc: 'نظارة شمسية فراشية بعدسات متدرجة.' },
    { id: 'i16', img: U('1517472292914-9570a594783b'), name: 'Carré 90 Silk Scarf', brand: 'HERMÈS', category: 'accessories', ownerId: 'u3', tier: 1, retail: 2100, rate: 160, status: 'available', condition: 'كالجديدة', color: '#f2b8a0', art: 'linear-gradient(135deg,#7a2b1a 0%,#d86a3a 50%,#f7c9a8 100%)', likes: 91, createdAt: '2026-06-15', desc: 'وشاح حرير ٩٠×٩٠ بطبعة Brides de Gala الكلاسيكية.' },
    { id: 'i17', img: U('1605733513597-a8f8341084e6'), name: 'Baguette Medium', brand: 'FENDI', category: 'bags', ownerId: 'u4', tier: 2, retail: 14500, rate: 620, status: 'rejected', rejectReason: 'خدوش واضحة على الإبزيم وتآكل في الزوايا', condition: 'جيدة', color: '#a37b52', art: 'linear-gradient(135deg,#2e2117 0%,#7a5a3a 55%,#d9b98c 100%)', likes: 0, createdAt: '2026-09-10', desc: 'باجيت بالجلد البني وشعار FF.' },
    { id: 'i18', img: U('1590739225287-bd31519780c3'), name: 'Re-Edition 2005', brand: 'PRADA', category: 'bags', ownerId: 'u3', tier: 1, retail: 6800, rate: 380, status: 'available', condition: 'ممتازة', color: '#cfcfcf', art: 'linear-gradient(135deg,#121212 0%,#3d3d3d 55%,#9c9c9c 100%)', likes: 143, createdAt: '2026-06-20', desc: 'ري-إديشن ٢٠٠٥ من النايلون الأسود مع حقيبتها الصغيرة.' },
  ],

  subscriptions: [
    { id: 's1', userId: 'u5', planId: 'p3', start: '2026-06-01', renew: '2026-10-01', status: 'active', swapsUsed: 1 },
    { id: 's2', userId: 'u7', planId: 'p1', start: '2026-08-15', renew: '2026-10-15', status: 'active', swapsUsed: 0 },
  ],

  rentals: [
    { id: 'r1', itemId: 'i1',  renterId: 'u5', start: '2026-09-05', end: '2026-10-05', status: 'active',    city: 'الرياض' },
    { id: 'r2', itemId: 'i4',  renterId: 'u5', start: '2026-09-12', end: '2026-10-12', status: 'active',    city: 'الرياض' },
    { id: 'r3', itemId: 'i9',  renterId: 'u7', start: '2026-09-18', end: '2026-10-18', status: 'shipped',   city: 'جدة' },
    { id: 'r4', itemId: 'i5',  renterId: 'u5', start: '2026-08-03', end: '2026-09-03', status: 'cleaning',  city: 'الرياض' },
    { id: 'r5', itemId: 'i3',  renterId: 'u5', start: '2026-07-01', end: '2026-08-01', status: 'completed', city: 'الرياض' },
    { id: 'r6', itemId: 'i14', renterId: 'u7', start: '2026-08-15', end: '2026-09-15', status: 'completed', city: 'جدة' },
    { id: 'r7', itemId: 'i6',  renterId: 'u5', start: '2026-06-01', end: '2026-07-01', status: 'completed', city: 'الرياض' },
    { id: 'r8', itemId: 'i11', renterId: 'u5', start: '2026-08-05', end: '2026-09-05', status: 'completed', city: 'الرياض' },
    { id: 'r9', itemId: 'i13', renterId: 'u5', start: '2026-07-10', end: '2026-08-10', status: 'completed', city: 'الرياض' },
  ],

  payouts: [
    { id: 'po1', ownerId: 'u3', amount: 1512, status: 'paid',    date: '2026-08-28' },
    { id: 'po2', ownerId: 'u4', amount: 1530, status: 'paid',    date: '2026-08-28' },
    { id: 'po3', ownerId: 'u3', amount: 810,  status: 'pending', date: '2026-09-15' },
  ],

  transactions: [
    { id: 't1', userId: 'u5', type: 'subscription', amount: 1999, date: '2026-06-01', desc: 'اشتراك باقة ماس' },
    { id: 't2', userId: 'u5', type: 'subscription', amount: 1999, date: '2026-07-01', desc: 'تجديد باقة ماس' },
    { id: 't3', userId: 'u5', type: 'subscription', amount: 1999, date: '2026-08-01', desc: 'تجديد باقة ماس' },
    { id: 't4', userId: 'u5', type: 'subscription', amount: 1999, date: '2026-09-01', desc: 'تجديد باقة ماس' },
    { id: 't5', userId: 'u7', type: 'subscription', amount: 499,  date: '2026-08-15', desc: 'اشتراك باقة لؤلؤة' },
    { id: 't6', userId: 'u7', type: 'subscription', amount: 499,  date: '2026-09-15', desc: 'تجديد باقة لؤلؤة' },
    { id: 't7', userId: 'u6', type: 'subscription', amount: 999,  date: '2026-04-05', desc: 'اشتراك باقة ذهب (منتهٍ)' },
    { id: 't8', userId: 'u6', type: 'subscription', amount: 999,  date: '2026-05-05', desc: 'تجديد باقة ذهب (منتهٍ)' },
  ],

  wishlist: { u5: ['i2', 'i13'], u7: ['i11', 'i4'], u6: ['i3'] },

  activity: [
    { ts: '2026-09-18T10:20:00', text: 'نورة العتيبي أضافت قطعة جديدة: Saint Laurent Loulou' },
    { ts: '2026-09-18T09:05:00', text: 'شحنة الطلب r3 انطلقت إلى جدة' },
    { ts: '2026-09-16T14:40:00', text: 'ريم الشمري أضافت قطعة: Jimmy Choo Bing 100' },
    { ts: '2026-09-15T11:00:00', text: 'نورة العتيبي طلبت تحويل أرباح بقيمة 810 ر.س' },
    { ts: '2026-09-15T08:30:00', text: 'هند المطيري أنشأت حساباً جديداً' },
    { ts: '2026-09-12T16:15:00', text: 'لمى الدوسري استأجرت Dior Lady Dior' },
  ],

  testimonials: [
    { name: 'غادة .م', city: 'الرياض', text: 'حضرت ثلاث مناسبات في شهر واحد بثلاث حقائب مختلفة، ولم أشترِ شيئاً. تجربة غيّرت طريقتي في التفكير بالفخامة.' },
    { name: 'العنود .س', city: 'جدة', text: 'كمالكة، حقائبي كانت نائمة في الخزانة. الآن تدرّ دخلاً شهرياً وأنا مطمئنة تماماً على التوثيق والتأمين.' },
    { name: 'دانة .ع', city: 'الخبر', text: 'التوصيل في نفس اليوم والتغليف الفاخر... شعرتُ أنني أستلم هدية كل مرة.' },
  ],

  faq: [
    { q: 'كيف يعمل الاشتراك؟', a: 'تختارين باقة شهرية، ثم تختارين القطع التي تريدينها من التشكيلة. نوصّلها لبابك خلال ٢٤ ساعة، وتحتفظين بها حتى نهاية الشهر أو تبدّلينها حسب باقتك.' },
    { q: 'هل القطع أصلية؟', a: 'كل قطعة تمر بفحص توثيق مزدوج من فريق مختص قبل عرضها، ونرفق شهادة أصالة مع كل شحنة.' },
    { q: 'ماذا لو تضررت القطعة؟', a: 'كل الباقات تشمل تأميناً كاملاً ضد الأضرار الطبيعية للاستخدام. الأضرار الجسيمة أو الفقدان تُقيَّم بشكل منفصل.' },
    { q: 'كيف أربح من قطعي كمالكة؟', a: 'تسجّلين قطعتك، نستلمها ونوثّقها ونصوّرها، وتحصلين على حصة من قيمة الإيجار الشهرية في كل مرة تُستأجر فيها، مع تحويل شهري إلى حسابك البنكي.' },
    { q: 'هل يمكنني الإلغاء في أي وقت؟', a: 'نعم، الاشتراك شهري بلا التزام طويل. يُلغى التجديد ويستمر وصولك حتى نهاية الدورة الحالية.' },
  ],
};
