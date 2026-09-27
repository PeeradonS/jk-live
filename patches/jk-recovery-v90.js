(() => {
  'use strict';
  if (window.JK_RECOVERY_V90) return;
  window.JK_RECOVERY_V90 = true;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = s => {
    try {
      const u = new URL(String(s || ''), location.href);
      return ['https:','http:','blob:','data:'].includes(u.protocol) ? u.href : '';
    } catch { return ''; }
  };
  const by = (q, root=document) => root.querySelector(q);
  const all = (q, root=document) => [...root.querySelectorAll(q)];

  function toast(msg) {
    if (window.JKUXBridgeV76?.toast) return window.JKUXBridgeV76.toast(msg);
    if (typeof window.toast === 'function') return window.toast(msg);
  }

  function openAlbum(rows, start=0) {
    const photos=(rows||[]).filter(r => r && r.url && (r.media_type === 'PHOTO' || !r.media_type));
    if (!photos.length) return;
    let index=Math.max(0,Math.min(start,photos.length-1));
    const layer=document.createElement('div');
    layer.className='jk-recovery-lightbox-v90';
    layer.setAttribute('role','dialog');
    layer.setAttribute('aria-modal','true');
    document.body.appendChild(layer);
    const close=()=>{ layer.remove(); document.removeEventListener('keydown',keys); };
    const keys=e=>{ if(e.key==='Escape')close(); if(e.key==='ArrowRight')show(index+1); if(e.key==='ArrowLeft')show(index-1); };
    function show(n){
      index=(n+photos.length)%photos.length;
      const row=photos[index];
      layer.innerHTML='<div class="jk-recovery-lightbox-bar-v90"><strong>รูป '+(index+1)+' / '+photos.length+'</strong><button type="button" data-close>✕</button></div>'+
        '<img src="'+esc(row.url)+'" alt="'+esc(row.caption||'รูปโปรไฟล์')+'">'+
        '<p>'+esc(row.caption||'')+'</p>'+
        '<div class="jk-recovery-lightbox-controls-v90"><button type="button" data-prev>‹</button><button type="button" data-next>›</button></div>';
      by('[data-close]',layer).onclick=close;
      by('[data-prev]',layer).onclick=()=>show(index-1);
      by('[data-next]',layer).onclick=()=>show(index+1);
    }
    document.addEventListener('keydown',keys);
    show(index);
  }

  function ensureStickerButton() {
    const composers=all('form#composer, form.v17-composer');
    composers.forEach(form => {
      let btn=by('#expressionBtnV28',form) || by('[data-jk-sticker-v90]',form);
      if (!btn) {
        btn=document.createElement('button');
        btn.type='button';
        btn.id='expressionBtnV28';
        btn.dataset.jkStickerV90='1';
        btn.className='jk-expression-btn-v28';
        btn.setAttribute('aria-label','สติกเกอร์');
        btn.setAttribute('title','สติกเกอร์');
        btn.textContent='☺';
        const voice=by('#voiceNoteBtnV28,.composer-voice',form);
        if (voice) form.insertBefore(btn,voice); else form.appendChild(btn);
      }
      if (btn.dataset.jkStickerBoundV90) return;
      btn.dataset.jkStickerBoundV90='1';
      btn.addEventListener('click', async e => {
        e.preventDefault(); e.stopPropagation();
        try {
          if (window.JKStickerV77?.openTray) return await window.JKStickerV77.openTray('');
          if (typeof window.JKReviewStickerTrayV61 === 'function') return window.JKReviewStickerTrayV61();
          if (typeof window.openExpressionTrayV28 === 'function') return window.openExpressionTrayV28();
          toast('กำลังโหลดสติกเกอร์…');
          window.dispatchEvent(new CustomEvent('jk:reload-stickers'));
        } catch { toast('เปิดสติกเกอร์ไม่สำเร็จ ลองอีกครั้ง'); }
      }, true);
    });
  }

  let lastProfileId='';
  document.addEventListener('click', e => {
    const target=e.target.closest('[data-profile],[data-home-person],[data-explore-open-person],[data-message-person],[data-request-profile-v38],[data-home-request-profile-v38],[data-people-card-v54]');
    if (target) {
      lastProfileId = target.dataset.profile || target.dataset.homePerson || target.dataset.exploreOpenPerson ||
        target.dataset.messagePerson || target.dataset.requestProfileV38 || target.dataset.homeRequestProfileV38 ||
        target.dataset.peopleCardV54 || lastProfileId;
    }
  }, true);

  async function publicMedia(userId) {
    if (!userId || !window.JKUXBridgeV76?.invoke) return [];
    try {
      const r=await window.JKUXBridgeV76.invoke('profile-audit',{action:'public_profile_content',target_user_id:String(userId)});
      return (r?.media||[]).filter(m => m && m.url && m.media_type === 'PHOTO').slice(0,9);
    } catch { return []; }
  }

  async function mountPublicAlbum() {
    const modal=by('#modalRoot') || document;
    const profile=by('.jk-profile-preview',modal);
    if (!profile || profile.dataset.jkAlbumMountedV90==='1' || !lastProfileId) return;
    profile.dataset.jkAlbumMountedV90='loading';
    const photos=await publicMedia(lastProfileId);
    if (!profile.isConnected) return;
    if (!photos.length) { profile.dataset.jkAlbumMountedV90='1'; return; }
    const first=profile.querySelector('img');
    if (first && safeUrl(first.src)) {
      first.style.cursor='zoom-in';
      first.addEventListener('click',()=>openAlbum(photos,0),{once:false});
    }
    const section=document.createElement('section');
    section.className='jk-recovery-album-v90';
    section.innerHTML='<div class="jk-recovery-album-head-v90"><h3>รูปโปรไฟล์</h3><span>'+photos.length+' รูป</span></div>'+
      '<div class="jk-recovery-album-rail-v90">'+photos.map((p,i)=>'<button type="button" data-i="'+i+'" aria-label="ดูรูปที่ '+(i+1)+'"><img src="'+esc(safeUrl(p.url))+'" alt="'+esc(p.caption||'รูปโปรไฟล์')+'"></button>').join('')+'</div>';
    profile.appendChild(section);
    all('button[data-i]',section).forEach(b=>b.onclick=()=>openAlbum(photos,Number(b.dataset.i)));
    profile.dataset.jkAlbumMountedV90='1';
  }

  async function mountOwnAlbum() {
    const root=by('#page');
    const hero=root && by('.jk-me-hero-v25',root);
    if (!hero || by('#jkOwnAlbumV90',root) || !window.JKUXBridgeV76?.listProfileMedia) return;
    const section=document.createElement('section');
    section.id='jkOwnAlbumV90';
    section.className='jk-profile-section-v25 jk-recovery-own-v90';
    section.innerHTML='<div class="jk-recovery-album-head-v90"><div><h3>รูปและอัลบั้มของฉัน</h3><p>รูปที่คนอื่นเห็นเมื่อเปิดโปรไฟล์</p></div><button type="button" id="jkManageMediaV90">จัดการ</button></div><div data-own-album><span class="muted">กำลังโหลด…</span></div>';
    hero.after(section);
    by('#jkManageMediaV90',section).onclick=()=>{
      if (window.JKProfileFullV86?.open) return window.JKProfileFullV86.open();
      by('#profilePhotoEditV25,#editProfile',root)?.click();
    };
    try {
      const rows=await window.JKUXBridgeV76.listProfileMedia();
      if (!section.isConnected) return;
      const photos=(rows||[]).filter(r=>r.media_type==='PHOTO'&&r.url).slice(0,9);
      const host=by('[data-own-album]',section);
      if (!photos.length) {
        host.innerHTML='<button type="button" class="btn soft full" data-add-photo>เพิ่มรูปในโปรไฟล์</button>';
        by('[data-add-photo]',host).onclick=()=>by('#jkManageMediaV90',section).click();
      } else {
        host.innerHTML='<div class="jk-recovery-album-rail-v90">'+photos.map((p,i)=>'<button type="button" data-i="'+i+'"><img src="'+esc(safeUrl(p.url))+'" alt="'+esc(p.caption||'รูปโปรไฟล์')+'"></button>').join('')+'</div>';
        all('button[data-i]',host).forEach(b=>b.onclick=()=>openAlbum(photos,Number(b.dataset.i)));
      }
    } catch {
      by('[data-own-album]',section).innerHTML='<button type="button" class="btn soft full" data-retry>ลองโหลดอัลบั้มอีกครั้ง</button>';
      by('[data-retry]',section).onclick=()=>{section.remove();mountOwnAlbum();};
    }
  }

  function hydrate() {
    ensureStickerButton();
    mountPublicAlbum();
    mountOwnAlbum();
  }

  const style=document.createElement('style');
  style.id='jk-recovery-v90-style';
  style.textContent=`
    #expressionBtnV28,[data-jk-sticker-v90]{display:grid!important;visibility:visible!important;opacity:1!important;width:40px!important;min-width:40px!important;height:40px!important;flex:0 0 40px!important;place-items:center!important;border:1px solid #f0d8de!important;background:#fff7f8!important;color:#c91f3b!important;border-radius:14px!important;font-size:24px!important;line-height:1!important}
    #expressionBtnV28 svg{display:none!important}
    #expressionBtnV28::before{content:none!important}
    .jk-recovery-album-head-v90{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px}.jk-recovery-album-head-v90 h3{margin:0;font-size:17px}.jk-recovery-album-head-v90 p{margin:3px 0 0;color:#81757a;font-size:12px}.jk-recovery-album-head-v90 span{font-size:12px;color:#81757a}
    .jk-recovery-album-v90{margin-top:16px}.jk-recovery-album-rail-v90{display:flex;gap:8px;overflow-x:auto;padding:2px 0 4px;scroll-snap-type:x mandatory}.jk-recovery-album-rail-v90 button{flex:0 0 94px;width:94px;height:118px;border:0;border-radius:13px;overflow:hidden;padding:0;background:#eee;scroll-snap-align:start;cursor:zoom-in}.jk-recovery-album-rail-v90 img{width:100%;height:100%;object-fit:cover;display:block}
    .jk-recovery-lightbox-v90{position:fixed;inset:0;z-index:2147483000;background:rgba(18,15,18,.96);color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;box-sizing:border-box}.jk-recovery-lightbox-v90>img{max-width:100%;max-height:75vh;object-fit:contain}.jk-recovery-lightbox-bar-v90{display:flex;justify-content:space-between;align-items:center;width:100%;max-width:680px;margin-bottom:12px}.jk-recovery-lightbox-v90 button{border:0;border-radius:12px;padding:10px 14px;background:#fff;color:#21191c;font-size:16px}.jk-recovery-lightbox-controls-v90{display:flex;gap:14px;margin-top:16px}.jk-recovery-lightbox-v90 p{max-width:680px;text-align:center}
  `;
  document.head.appendChild(style);

  const obs=new MutationObserver(()=>queueMicrotask(hydrate));
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',hydrate);
  setTimeout(hydrate,300);
  setTimeout(hydrate,1200);
})();