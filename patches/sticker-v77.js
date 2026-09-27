(() => {
  'use strict';

  const bridge = window.JKStickerBridgeV77;
  if (!bridge) return;

  const ownedKey = 'jk_v77_sticker_owned_preview';
  const imageCache = new Map();
  const itemByKey = new Map();
  const categoryLabels = {
    cute:'น่ารัก', pets:'สัตว์เลี้ยง', reptile:'สัตว์จิ๋ว', love:'ความรัก',
    dating:'จีบ/คุย', feelings:'อารมณ์', daily:'ทุกวัน', lifestyle:'ไลฟ์สไตล์',
    work:'งาน', nerd:'เนิร์ด', gaming:'เกม', men:'ผู้ชาย', women:'ผู้หญิง',
    women_mischief:'สาวเจ้าเล่ห์', pride:'Pride', couple:'คู่รัก'
  };

  let packs = [];
  let paymentReady = false;
  let ready = false;

  const titles = [
    'JK Hello','น้องแมว JK','น้องหมาใจดี','หมีอ้อน','กระต่ายน้อย','แพนด้าอารมณ์ดี','ไดโนจิ๋ว','แก๊งสัตว์น่ารัก',
    'กิ้งก่าน้อย','งูน้อยใจดี','รักนะ','คิดถึงนะ','จีบเบา ๆ','เขินแล้วนะ','งอนแล้วนะ','กอดหน่อย','ฝันดีนะ','ตื่นได้แล้ว',
    'อ้อนเก่ง','สายกิน','คนรวย','CEO Life','Working','สายเที่ยว','คาเฟ่ฮอป','สายชิล','ฟิตเนส','นักศึกษา 20+',
    'หนุ่มเนิร์ด','เกมเมอร์','Bad Boy','เด็กแว้น','สายซิ่ง','นักเลงใจดี','ทรงเอ','หนุ่มเกาหลี','หนุ่มอบอุ่น','หนุ่มตี๋',
    'หนุ่มลุคเท่','หนุ่มสายฮา','สาวน่ารัก','สาวเจ้าเล่ห์','สาวหวาน','สาวเท่','สาวทำงาน','สาวสายเที่ยว','Girls Love',
    'Pride Love','คู่รัก','โมเมนต์พิเศษ'
  ];

  const categories = [
    'cute','pets','pets','cute','cute','cute','reptile','pets','reptile','reptile',
    'love','love','dating','dating','feelings','love','daily','daily','cute','daily',
    'lifestyle','work','work','lifestyle','lifestyle','lifestyle','lifestyle','daily','nerd','gaming',
    'men','men','men','men','men','men','men','men','men','men',
    'women','women_mischief','women','women','women','women','pride','pride','couple','love'
  ];

  const commonCaptions = [
    'คิดถึงนะ','ขอกอดหน่อย','น่ารักจัง','เป็นห่วงนะ','กินข้าวยัง','ไปกันไหม','ถึงบ้านบอกนะ','ฝันดีนะ',
    'โอเคเลย','ได้เลย','แป๊บนึงนะ','ขอบคุณนะ','ขอโทษนะ','หายงอนน้า','งอนแล้วนะ','ง้อหน่อย',
    'สู้ ๆ นะ','เก่งมากเลย','ฮ่า ๆ ๆ','ไว้คุยกันนะ'
  ];

  function previewCaptions(category, title) {
    const first = {
      pets:['เล่นด้วยหน่อย','คิดถึงเจ้าตัวแสบ','น้วยไหม','เอ็นดูจัง'],
      reptile:['จิ๋วแต่ใจใหญ่','ไม่ดุนะ','แอบมองอยู่','ขอเกาะหน่อย'],
      nerd:['อ่านอยู่','มีเรื่องจะเล่า','คิดแป๊บ','รู้แล้ว'],
      gaming:['พร้อมลุย','เข้าเกมไหม','แบกหน่อย','GG นะ'],
      men:['หวัดดีครับ','มอร์นิ่งนะ','ทำไรอยู่','ว่างคุยไหม'],
      women:['น่ารักไหม','อ้อนหน่อย','ยิ้มให้แล้ว','เอ็นดูเรานะ'],
      women_mischief:['รู้ทันนะ','แกล้งเล่น','จับได้แล้ว','คิดอะไรอยู่'],
      work:['งานเข้าแล้ว','ขอพักแป๊บ','สู้กับงาน','ประชุมอีกแล้ว'],
      lifestyle:['ไปเที่ยวกัน','วันนี้ชิล','หาอะไรอร่อย ๆ','ออกไปกัน'],
      pride:['รักก็คือรัก','เป็นตัวเองนะ','ส่งใจให้','อยู่ข้างกัน'],
      couple:['เราไปด้วยกัน','คิดถึงคนนี้','กอดที','อยู่ด้วยนะ'],
      love:['รักนะ','คิดถึงมาก','ใจให้แล้ว','เขินนะ'],
      dating:['ทักมาได้','จีบได้ไหม','ชอบนะ','คุยกันไหม'],
      feelings:['งอนแล้ว','ง้อหน่อย','ใจบาง','โอ๋หน่อย'],
      daily:['มอร์นิ่ง','ทำไรอยู่','กินข้าวยัง','ฝันดี'],
      cute:['น่ารักปะ','อ้อนหน่อย','ยิ้มหน่อย','ใจฟูแล้ว']
    }[category] || ['หวัดดี','ทำไรอยู่','คุยกันไหม','ยิ้มหน่อย'];
    if (title === 'Bad Boy') return ['หวัดดีครับ','มอร์นิ่งนะ','ทำไรอยู่','ว่างคุยไหม',...commonCaptions];
    return [...first, ...commonCaptions];
  }

  function makePreviewPacks() {
    return titles.map((title, idx) => {
      const n = idx + 1;
      const packId = 'v62_' + String(n).padStart(2,'0');
      const category = categories[idx] || 'cute';
      const captions = previewCaptions(category,title).slice(0,24);
      const price = n === 1 ? 0 : n <= 8 ? 29 : n >= 48 ? 49 : 39;
      return {
        item_key:'sticker_' + packId,
        pack_id:packId,
        title,
        category,
        amount_minor:price * 100,
        currency:'THB',
        owned:n === 1 || previewOwned().has(packId),
        sticker_count:24,
        design_family:n === 31 ? 'bad_boy_png_v62' : 'jk_runtime_png_v65',
        items:captions.map((caption,i) => ({
          item_index:i+1,
          sticker_key:'v65_' + packId + '_' + String(i+1).padStart(2,'0'),
          caption_th:caption,
          render_family:n === 31 ? 'bad_boy_png_v62' : 'jk_runtime_png_v65',
          render_seed:n*100 + i + 1,
          category,
          asset_path:n === 31 ? './resources/stickers/standardized/bad-boy/' + String(i+1).padStart(2,'0') + '.png' : ''
        }))
      };
    });
  }

  function previewOwned() {
    try { return new Set(JSON.parse(localStorage.getItem(ownedKey) || '[]')); }
    catch { return new Set(); }
  }

  function savePreviewOwned(set) {
    localStorage.setItem(ownedKey, JSON.stringify([...set]));
  }

  async function loadCatalog(force = false) {
    if (ready && !force) return packs;
    if (bridge.preview) {
      packs = makePreviewPacks();
      paymentReady = false;
    } else {
      const result = await bridge.catalog();
      if (!result?.ok) throw new Error(result?.error || 'sticker_catalog_failed');
      packs = result.packs || [];
      paymentReady = !!result.digital_payment_ready;
    }
    itemByKey.clear();
    packs.forEach(pack => (pack.items || []).forEach(item => itemByKey.set(item.sticker_key,{ item, pack })));
    ready = packs.length > 0;
    bridge.refresh?.();
    return packs;
  }

  function icon(category) {
    return ({
      cute:'♡',pets:'🐾',reptile:'🦎',love:'♥',dating:'💌',feelings:'☁',
      daily:'☀',lifestyle:'✦',work:'⌁',nerd:'⌘',gaming:'🎮',men:'♠',
      women:'✿',women_mischief:'♣',pride:'🌈',couple:'∞'
    })[category] || 'JK';
  }

  function palette(seed) {
    const h = Number(seed || 1) % 360;
    return {
      main:'hsl(' + h + ' 66% 78%)',
      deep:'hsl(' + ((h + 330) % 360) + ' 48% 35%)',
      light:'hsl(' + ((h + 18) % 360) + ' 85% 95%)'
    };
  }

  function rounded(ctx,x,y,w,h,r) {
    const rr = Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);
    ctx.arcTo(x,y,x+w,y,rr);
    ctx.closePath();
  }

  function renderRuntime(item) {
    if (imageCache.has(item.sticker_key)) return imageCache.get(item.sticker_key);
    if (item.asset_path) {
      imageCache.set(item.sticker_key,item.asset_path);
      return item.asset_path;
    }
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const seed = Number(item.render_seed || 1);
    const colors = palette(seed);
    ctx.clearRect(0,0,size,size);

    ctx.save();
    ctx.translate(256,205);
    ctx.rotate(((seed % 7)-3) * Math.PI / 180);

    ctx.fillStyle = colors.light;
    rounded(ctx,-155,-130,310,275,112); ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.stroke();

    ctx.fillStyle = colors.main;
    ctx.beginPath(); ctx.arc(0,-10,112,0,Math.PI*2); ctx.fill();

    const cat = item.category || 'cute';
    if (cat === 'pets') {
      ctx.beginPath(); ctx.moveTo(-82,-88); ctx.lineTo(-122,-165); ctx.lineTo(-38,-125); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(82,-88); ctx.lineTo(122,-165); ctx.lineTo(38,-125); ctx.closePath(); ctx.fill();
    } else if (cat === 'reptile') {
      ctx.beginPath();
      for(let i=0;i<5;i++){ const x=-82+i*42; ctx.moveTo(x,-106); ctx.lineTo(x+21,-150); ctx.lineTo(x+42,-106); }
      ctx.fill();
    } else if (cat === 'men' || cat === 'nerd' || cat === 'gaming') {
      ctx.fillStyle = colors.deep;
      ctx.beginPath(); ctx.arc(0,-34,116,Math.PI,Math.PI*2); ctx.fill();
      if (cat === 'nerd') {
        ctx.strokeStyle = colors.deep; ctx.lineWidth=7;
        ctx.strokeRect(-72,-35,55,37); ctx.strokeRect(17,-35,55,37);
        ctx.beginPath(); ctx.moveTo(-17,-17); ctx.lineTo(17,-17); ctx.stroke();
      }
    } else if (cat === 'women' || cat === 'women_mischief') {
      ctx.fillStyle = colors.deep;
      ctx.beginPath(); ctx.arc(0,-15,121,Math.PI*0.88,Math.PI*2.12); ctx.strokeStyle=colors.deep; ctx.lineWidth=28; ctx.stroke();
    }

    ctx.fillStyle = colors.deep;
    ctx.beginPath(); ctx.arc(-38,-20,9,0,Math.PI*2); ctx.arc(38,-20,9,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = colors.deep; ctx.lineWidth = 8; ctx.lineCap='round';
    ctx.beginPath();
    if (seed % 4 === 0) {
      ctx.moveTo(-26,28); ctx.quadraticCurveTo(0,10,26,28);
    } else {
      ctx.arc(0,18,30,0.15*Math.PI,0.85*Math.PI);
    }
    ctx.stroke();

    ctx.font = '54px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(icon(cat),0,100);
    ctx.restore();

    const caption = String(item.caption_th || '');
    ctx.font = '700 44px sans-serif';
    let fontSize = 44;
    while (ctx.measureText(caption).width > 400 && fontSize > 28) {
      fontSize -= 2; ctx.font = '700 ' + fontSize + 'px sans-serif';
    }
    const textW = Math.min(430,ctx.measureText(caption).width + 58);
    ctx.fillStyle='rgba(255,255,255,.96)';
    rounded(ctx,(512-textW)/2,382,textW,86,40); ctx.fill();
    ctx.lineWidth=5; ctx.strokeStyle=colors.main; ctx.stroke();
    ctx.fillStyle=colors.deep; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(caption,256,425);

    const url = canvas.toDataURL('image/png');
    imageCache.set(item.sticker_key,url);
    return url;
  }

  function attr(value) {
    return String(value ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }

  function artMarkup(key, cls = '') {
    const found = itemByKey.get(String(key));
    if (!found) return '';
    const src = renderRuntime(found.item);
    if (!src) return '';
    return '<img class="jk-sticker-image-v62 jk-v77-art ' + attr(cls) + '" src="' + attr(src) + '" alt="' + attr(found.item.caption_th) + '" loading="lazy" decoding="async">';
  }

  function packOwned(pack) {
    if (!pack) return false;
    if (Number(pack.amount_minor || 0) === 0) return true;
    if (bridge.preview) return previewOwned().has(pack.pack_id);
    return !!pack.owned;
  }

  function priceText(pack) {
    const amount = Number(pack.amount_minor || 0);
    return amount === 0 ? 'ฟรี' : (amount/100).toLocaleString('th-TH') + ' บาท';
  }

  function stickerTile(item, mode='preview') {
    return '<button class="jk-v77-sticker" data-v77-sticker="' + attr(item.sticker_key) + '" data-v77-mode="' + mode + '">' +
      artMarkup(item.sticker_key,'shop') + '<b>' + bridge.escape(item.caption_th) + '</b></button>';
  }

  function packCard(pack) {
    return '<button class="jk-v77-pack" data-v77-pack="' + attr(pack.pack_id) + '">' +
      '<div class="jk-v77-cover">' + pack.items.slice(0,3).map(i => artMarkup(i.sticker_key,'shop')).join('') + '</div>' +
      '<div><b>' + bridge.escape(pack.title) + '</b><small>' + bridge.escape(categoryLabels[pack.category] || pack.category) + ' · 24 ภาพ</small></div>' +
      '<strong>' + (packOwned(pack) ? 'มีแล้ว' : priceText(pack)) + '</strong></button>';
  }

  async function openStore() {
    await loadCatalog();
    bridge.showModal(
      '<div class="modal-head"><div><small>JK ORIGINAL STICKERS</small><h3>ร้านสติกเกอร์ · ' + packs.length + ' ชุด</h3><div class="muted">' +
      packs.reduce((s,p)=>s+p.items.length,0) + ' ภาพ · ทุกชุด 24 ภาพพร้อมคำไทย</div></div><button class="close" data-close>×</button></div>' +
      '<div class="jk-v77-filters"><input id="jkV77Search" type="search" placeholder="ค้นหาชุดหรือคำ เช่น คิดถึง งอน แมว"><label><input id="jkV77Mine" type="checkbox"> ชุดที่มีแล้ว</label></div>' +
      '<div class="jk-v77-cats" id="jkV77Cats"></div>' +
      '<p class="jk-v77-count" id="jkV77Count"></p><div class="jk-v77-pack-grid" id="jkV77Grid"></div>' +
      '<div class="notice">' + (bridge.preview ? 'Preview: การกดปลดล็อกเป็นการจำลองในเครื่องนี้เท่านั้น' : paymentReady ? 'การซื้อจริงใช้สิทธิ์ตามบัญชีและกู้คืนได้หลังเข้าสู่ระบบ' : 'ยังไม่เปิดชำระเงินจริงจนกว่า Store Billing จะเชื่อมเสร็จ') + '</div>'
    );
    const root = bridge.root();
    const cats = [...new Set(packs.map(p=>p.category))];
    root.querySelector('#jkV77Cats').innerHTML = '<button class="active" data-v77-cat="">ทั้งหมด</button>' +
      cats.map(c=>'<button data-v77-cat="' + attr(c) + '">' + bridge.escape(categoryLabels[c] || c) + '</button>').join('');
    let activeCat = '';
    function render() {
      const q = String(root.querySelector('#jkV77Search')?.value || '').trim().toLocaleLowerCase('th');
      const mine = !!root.querySelector('#jkV77Mine')?.checked;
      const rows = packs.filter(p => {
        if (activeCat && p.category !== activeCat) return false;
        if (mine && !packOwned(p)) return false;
        if (!q) return true;
        const hay = [p.title,...p.items.map(i=>i.caption_th)].join(' ').toLocaleLowerCase('th');
        return hay.includes(q);
      });
      root.querySelector('#jkV77Count').textContent = rows.length + ' ชุดที่แสดง';
      root.querySelector('#jkV77Grid').innerHTML = rows.length ? rows.map(packCard).join('') : '<div class="notice">ยังไม่พบชุดที่ตรงคำค้น</div>';
      root.querySelectorAll('[data-v77-pack]').forEach(b=>b.onclick=()=>openPack(b.dataset.v77Pack,'store'));
    }
    root.querySelector('#jkV77Search').addEventListener('input',render);
    root.querySelector('#jkV77Mine').addEventListener('change',render);
    root.querySelectorAll('[data-v77-cat]').forEach(b=>b.onclick=()=>{
      activeCat=b.dataset.v77Cat || '';
      root.querySelectorAll('[data-v77-cat]').forEach(x=>x.classList.toggle('active',x===b));
      render();
    });
    render();
  }

  function openPack(packId, source='store') {
    const pack = packs.find(p=>p.pack_id===packId) || packs[0];
    if (!pack) return;
    const owned = packOwned(pack);
    bridge.showModal(
      '<div class="modal-head"><div><small>' + bridge.escape(categoryLabels[pack.category] || pack.category) + '</small><h3>' + bridge.escape(pack.title) + '</h3><div class="muted">24 ภาพพร้อมคำไทย · ' + priceText(pack) + '</div></div><button class="close" data-close>×</button></div>' +
      '<button class="btn soft jk-v77-back" id="jkV77Back">‹ กลับ' + (source==='tray' ? 'ถาดสติกเกอร์' : 'ร้านสติกเกอร์') + '</button>' +
      '<div class="jk-v77-sticker-grid">' + pack.items.map(i=>stickerTile(i,'detail')).join('') + '</div>' +
      (!owned ? '<button class="btn primary full" id="jkV77Buy">' + (bridge.preview ? 'Preview · จำลองปลดล็อกชุดนี้' : paymentReady ? 'ซื้อ ' + priceText(pack) : 'ยังไม่เปิดชำระเงินจริง') + '</button>' : '<div class="notice">✓ ชุดนี้ใช้ได้ในบัญชีของคุณ</div>')
    );
    const root=bridge.root();
    root.querySelector('#jkV77Back').onclick=()=> source==='tray' ? openTray(pack.pack_id) : openStore();
    root.querySelectorAll('[data-v77-sticker]').forEach(b=>b.onclick=()=>openStickerDetail(pack,b.dataset.v77Sticker,source));
    const buy=root.querySelector('#jkV77Buy');
    if (buy) {
      if (!bridge.preview && !paymentReady) buy.disabled=true;
      else buy.onclick=()=>buyPack(pack,source);
    }
  }

  function openStickerDetail(pack, key, source) {
    const index = pack.items.findIndex(i=>i.sticker_key===key);
    if (index<0) return;
    const item=pack.items[index];
    const canSend=packOwned(pack) && !!bridge.activeMatch();
    bridge.showModal(
      '<div class="modal-head"><div><h3>' + bridge.escape(item.caption_th) + '</h3><div class="muted">' + bridge.escape(pack.title) + ' · ' + (index+1) + ' / 24</div></div><button class="close" data-close>×</button></div>' +
      '<div class="jk-v77-detail">' + artMarkup(item.sticker_key,'detail') + '</div>' +
      '<div class="jk-v77-pager"><button class="btn soft" id="jkV77Prev"' + (index===0?' disabled':'') + '>‹ ก่อนหน้า</button><button class="btn soft" id="jkV77Next"' + (index===23?' disabled':'') + '>ถัดไป ›</button></div>' +
      (canSend ? '<button class="btn primary full" id="jkV77Send">ส่งภาพนี้</button>' : '') +
      '<button class="btn soft full" id="jkV77PackBack">กลับดูทั้งชุด</button>'
    );
    const root=bridge.root();
    root.querySelector('#jkV77Prev').onclick=()=>openStickerDetail(pack,pack.items[index-1]?.sticker_key,source);
    root.querySelector('#jkV77Next').onclick=()=>openStickerDetail(pack,pack.items[index+1]?.sticker_key,source);
    root.querySelector('#jkV77PackBack').onclick=()=>openPack(pack.pack_id,source);
    root.querySelector('#jkV77Send')?.addEventListener('click',()=>send(pack,item));
  }

  async function buyPack(pack, source) {
    if (packOwned(pack)) return openPack(pack.pack_id,source);
    if (bridge.preview) {
      const owned=previewOwned(); owned.add(pack.pack_id); savePreviewOwned(owned); pack.owned=true;
      bridge.toast('Preview: จำลองปลดล็อก ' + pack.title + ' แล้ว');
      return openPack(pack.pack_id,source);
    }
    if (!paymentReady) return bridge.toast('ยังไม่เปิดชำระเงินจริง');
    const result = await bridge.purchase(pack.item_key);
    if (!result) return;
    await loadCatalog(true);
    openPack(pack.pack_id,source);
  }

  async function openTray(packId='') {
    await loadCatalog();
    if (!bridge.activeMatch()) return bridge.toast('เลือกห้องคุยก่อนใช้สติกเกอร์');
    const owned = packs.filter(packOwned);
    if (!owned.length) return bridge.toast('ยังไม่มีชุดสติกเกอร์ที่ใช้ได้');
    const pack = owned.find(p=>p.pack_id===packId) || owned[0];
    bridge.showModal(
      '<div class="modal-head"><div><h3>สติกเกอร์ JK</h3><div class="muted">แตะภาพเพื่อส่ง · ' + owned.length + ' ชุดที่ใช้ได้</div></div><button class="close" data-close>×</button></div>' +
      '<button class="jk-expression-store-v48" id="jkV77OpenStore">🛍 ร้านสติกเกอร์ · ดูครบ 50 ชุด</button>' +
      '<div class="jk-v77-tabs">' + owned.map(p=>'<button class="' + (p.pack_id===pack.pack_id?'active':'') + '" data-v77-tab="' + attr(p.pack_id) + '">' + bridge.escape(p.title) + '</button>').join('') + '</div>' +
      '<div class="jk-v77-sticker-grid">' + pack.items.map(i=>stickerTile(i,'send')).join('') + '</div>'
    );
    const root=bridge.root();
    root.querySelector('#jkV77OpenStore').onclick=openStore;
    root.querySelectorAll('[data-v77-tab]').forEach(b=>b.onclick=()=>openTray(b.dataset.v77Tab));
    root.querySelectorAll('[data-v77-sticker]').forEach(b=>b.onclick=()=>{
      const item=pack.items.find(i=>i.sticker_key===b.dataset.v77Sticker);
      if (item) send(pack,item);
    });
  }

  async function send(pack,item) {
    if (!packOwned(pack)) return openPack(pack.pack_id,'store');
    const ok=await bridge.send(pack,item);
    if (ok) bridge.toast('ส่ง ' + item.caption_th + ' แล้ว');
  }

  window.JKStickerV77 = {
    get ready(){ return ready; },
    get packs(){ return packs; },
    loadCatalog,
    getCatalog: async () => { await loadCatalog(); return packs; },
    isOwned: pack => packOwned(pack),
    sendByKey: async (packId, stickerKey) => {
      await loadCatalog();
      const pack=packs.find(p=>p.pack_id===packId);
      const item=pack?.items?.find(i=>i.sticker_key===stickerKey);
      if(!pack||!item) return false;
      return send(pack,item);
    },
    openStore,
    openTray,
    openPack,
    artMarkup
  };

  window.JKReviewShopV61 = openStore;
  window.JKReviewStickerTrayV61 = () => openTray('');
  loadCatalog().catch(()=>{ if (bridge.preview) { packs=makePreviewPacks(); ready=true; } });
})();