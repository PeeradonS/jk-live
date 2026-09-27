(()=>{if(window.JK_STICKER_STORE_V105)return;window.JK_STICKER_STORE_V105=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LABELS={cute:'น่ารัก',pets:'สัตว์เลี้ยง',reptile:'สัตว์จิ๋ว',love:'ความรัก',dating:'จีบ/คุย',feelings:'อารมณ์',daily:'ทุกวัน',lifestyle:'ไลฟ์สไตล์',work:'งาน',nerd:'เนิร์ด',gaming:'เกม',men:'ผู้ชาย',women:'ผู้หญิง',women_mischief:'สาวเจ้าเล่ห์',pride:'Pride',couple:'คู่รัก'};
const PAGE_SIZE=12;
let overlay=null,catalog=[],query='',category='',detailPackId='',oldOverflow='',browseLimit=PAGE_SIZE;

const api=()=>window.JKStickerV77||null;
const isOwned=p=>!!(p&&(Number(p.amount_minor||0)===0||p.owned||api()?.isOwned?.(p)));
const saleReady=p=>!!p?.sale_ready;
const price=p=>{const n=Number(p?.amount_minor||0);return n===0?'ฟรี':(n/100).toLocaleString('th-TH')+' บาท'};
const art=(i,cls='')=>api()?.lazyArtMarkup?.(i?.sticker_key,cls)||api()?.artMarkup?.(i?.sticker_key,cls)||'<span class="jk105-fallback">JK</span>';
function paymentState(){
  const a=api();
  const ps=a?.paymentStatus || {};
  return {
    ready:!!a?.paymentReady,
    platform:String(ps.platform||'web'),
    provider:String(ps.provider||'')
  };
}
async function startPackPurchase(pack){
  const a=api();
  const status=q('#jk105PaymentStatus',overlay);
  const btn=q('#jk105Buy',overlay);
  if(!a?.startPurchaseByPackId){
    if(status)status.textContent='ระบบชำระเงินยังไม่พร้อม';
    return {ok:false,error:'purchase_api_unavailable'};
  }
  if(btn){btn.disabled=true;btn.textContent='กำลังเปิดช่องทางชำระเงิน…'}
  const result=await a.startPurchaseByPackId(pack.pack_id);
  if(result?.owned){
    await restoreOwnership();
    renderDetail(pack.pack_id);
    return result;
  }
  if(result?.started){
    if(status)status.textContent='เปิดช่องทางชำระเงินแล้ว · เมื่อผู้ให้บริการยืนยันการจ่าย ระบบจะเพิ่มแพ็กในบัญชีอัตโนมัติ';
    if(btn){btn.disabled=false;btn.textContent='ซื้อ '+price(pack)}
    return result;
  }
  const msg=result?.error==='art_not_ready'
    ? 'แพ็กนี้ยังไม่เปิดขายจนกว่างานภาพจริงจะครบ 24 รูป'
    : result?.error==='payment_not_ready'||result?.error==='preview_payment_disabled'
      ? 'ช่องทางชำระเงินจริงยังไม่เปิดใช้งาน'
      : 'ยังเริ่มการชำระเงินไม่ได้ ลองใหม่อีกครั้ง';
  if(status)status.textContent=msg;
  if(btn){btn.disabled=!paymentState().ready;btn.textContent=paymentState().ready?'ซื้อ '+price(pack):'ยังไม่เปิดชำระเงินจริง'}
  return result||{ok:false,error:'purchase_failed'};
}

function close(){
  if(!overlay)return;
  overlay.remove();overlay=null;detailPackId='';
  document.documentElement.style.overflow=oldOverflow;
  document.removeEventListener('keydown',onKey);
}
function onKey(e){if(e.key==='Escape')close()}

function cover(p){
  const items=(p.items||[]).slice(0,3);
  return '<div class="jk105-cover">'+items.map((i,n)=>'<div class="jk105-cover-piece p'+n+'">'+art(i,'jk105-cover-art')+'</div>').join('')+'</div>';
}
function status(p){
  if(isOwned(p))return '<span class="jk105-owned">มีแล้ว</span>';
  if(!saleReady(p))return '<span class="jk105-artwait">กำลังปรับภาพ</span>';
  return '<span class="jk105-price">'+esc(price(p))+'</span>';
}
function card(p){
  return '<button class="jk105-card" type="button" data-jk105-pack="'+esc(p.pack_id)+'">'+
    cover(p)+
    '<div class="jk105-card-copy"><small>'+esc(LABELS[p.category]||p.category||'JK')+'</small><b>'+esc(p.title)+'</b><span>24 ภาพ · คำไทยพร้อมใช้</span><div class="jk105-card-foot">'+status(p)+'<em>ดูชุด ›</em></div></div>'+
  '</button>';
}
async function restoreOwnership(){
  const a=api();
  if(!a?.loadCatalog)return {ok:false,error:'restore_unavailable'};
  const btn=q('#jk105Restore',overlay);
  const before=catalog.filter(isOwned).length;
  if(btn){btn.disabled=true;btn.textContent='กำลังกู้คืน…'}
  try{
    const fresh=await a.loadCatalog(true);
    catalog=Array.isArray(fresh)?fresh:await a.getCatalog();
    query='';category='';browseLimit=PAGE_SIZE;
    renderBrowse();
    const owned=catalog.filter(isOwned).length;
    const status=q('#jk105RestoreStatus',overlay);
    if(status)status.textContent='กู้คืนสิทธิ์แล้ว · พบ '+owned+' ชุดในบัญชีนี้';
    return {ok:true,before,owned};
  }catch(err){
    const status=q('#jk105RestoreStatus',overlay);
    if(status)status.textContent='กู้คืนไม่สำเร็จ ลองใหม่อีกครั้ง';
    if(btn){btn.disabled=false;btn.textContent='กู้คืนการซื้อ'}
    return {ok:false,before,owned:before,error:String(err?.message||err)};
  }
}

function filtered(){
  const term=query.trim().toLocaleLowerCase('th');
  return catalog.filter(p=>{
    if(category&&p.category!==category)return false;
    if(!term)return true;
    const hay=[p.title,LABELS[p.category]||p.category,...(p.items||[]).map(i=>i.caption_th)].join(' ').toLocaleLowerCase('th');
    return hay.includes(term);
  }).sort((a,b)=>{
    const ready=Number(saleReady(b))-Number(saleReady(a));
    if(ready)return ready;
    const own=Number(isOwned(b))-Number(isOwned(a));
    if(own)return own;
    return String(a.title||'').localeCompare(String(b.title||''),'th');
  });
}
function renderBrowse(){
  if(!overlay)return;
  detailPackId='';
  const body=q('.jk105-body',overlay);
  const cats=[...new Set(catalog.map(p=>p.category).filter(Boolean))];
  const rows=filtered();
  const readyCount=catalog.filter(saleReady).length;
  const pendingCount=Math.max(0,catalog.length-readyCount);
  const shown=rows.slice(0,browseLimit);
  const remaining=Math.max(0,rows.length-shown.length);
  body.innerHTML=
    '<section class="jk105-hero"><small>JK ORIGINAL STICKERS</small><h2>สติ๊กเกอร์ที่อยากหยิบมาใช้จริง</h2><p>พร้อมขายจริง '+readyCount+' ชุด · กำลังอัปเกรดภาพ '+pendingCount+' ชุด · '+catalog.reduce((n,p)=>n+(p.items?.length||0),0).toLocaleString('th-TH')+' ภาพใน catalog</p></section>'+
    '<section class="jk105-account"><div><b>สิทธิ์ผูกกับบัญชี</b><span>เปลี่ยนเครื่องหรือลงแอปใหม่ แพ็กที่ซื้อแล้วกู้คืนได้</span><small id="jk105RestoreStatus" role="status"></small></div><button type="button" id="jk105Restore">กู้คืนการซื้อ</button></section>'+
    '<label class="jk105-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input id="jk105Search" type="search" inputmode="search" placeholder="ค้นหา เช่น ฝันดี แมว เนิร์ด…" value="'+esc(query)+'"></label>'+
    '<div class="jk105-cats"><button type="button" data-jk105-cat="" class="'+(!category?'active':'')+'">ทั้งหมด</button>'+
      cats.map(c=>'<button type="button" data-jk105-cat="'+esc(c)+'" class="'+(category===c?'active':'')+'">'+esc(LABELS[c]||c)+'</button>').join('')+
    '</div>'+
    '<div class="jk105-resultbar"><b>'+rows.length+' ชุด</b><span>กำลังแสดง '+shown.length+' · แตะเพื่อดูครบ 24 ภาพ</span></div>'+
    (shown.length?'<div class="jk105-grid">'+shown.map(card).join('')+'</div>':'<div class="jk105-empty">ยังไม่พบชุดที่ตรงกับคำค้น</div>')+
    (remaining?'<button type="button" class="jk105-more" id="jk105More">ดูเพิ่มอีก '+Math.min(PAGE_SIZE,remaining)+' ชุด</button>':'');
  q('#jk105Restore',body)?.addEventListener('click',restoreOwnership);
  q('#jk105Search',body)?.addEventListener('input',e=>{query=e.target.value;browseLimit=PAGE_SIZE;renderBrowse();const i=q('#jk105Search',overlay);i?.focus();if(i)i.setSelectionRange(i.value.length,i.value.length)});
  qa('[data-jk105-cat]',body).forEach(b=>b.onclick=()=>{category=b.dataset.jk105Cat||'';browseLimit=PAGE_SIZE;renderBrowse()});
  q('#jk105More',body)?.addEventListener('click',()=>{browseLimit+=PAGE_SIZE;renderBrowse()});
  qa('[data-jk105-pack]',body).forEach(b=>b.onclick=()=>renderDetail(b.dataset.jk105Pack));
  window.JKStickerPerformanceV107?.scan?.(body);
}
function renderDetail(packId){
  if(!overlay)return;
  const p=catalog.find(x=>x.pack_id===packId);if(!p)return;
  detailPackId=packId;
  const body=q('.jk105-body',overlay);
  body.innerHTML=
    '<div class="jk105-detail-head"><button type="button" id="jk105Back" aria-label="กลับ">‹</button><div><small>'+esc(LABELS[p.category]||p.category||'JK')+'</small><h2>'+esc(p.title)+'</h2><span>24 ภาพพร้อมคำไทย</span></div>'+status(p)+'</div>'+
    '<div class="jk105-detail-cover">'+cover(p)+'<div><b>'+esc(p.title)+'</b><p>'+(isOwned(p)?'ชุดนี้พร้อมใช้งานในบัญชีของคุณ':'ดูครบทั้งชุดก่อนตัดสินใจซื้อ')+'</p></div></div>'+
    '<div class="jk105-preview-grid">'+(p.items||[]).map((i,n)=>'<div class="jk105-preview-item">'+art(i,'jk105-preview-art')+'<span>'+esc(i.caption_th||'')+'</span><small>'+(n+1)+'/24</small></div>').join('')+'</div>'+
    '<div class="jk105-detail-action">'+
      (isOwned(p)
        ? '<button type="button" class="jk105-use" id="jk105Use">ใช้ชุดนี้</button><small>เปิดกลับไปที่ “ของฉัน” แล้วเลือกส่งได้ทันที</small>'
        : (!saleReady(p)
          ? '<button type="button" class="jk105-buy" id="jk105Buy" disabled>กำลังปรับงานภาพ</button><small id="jk105PaymentStatus">ยังไม่เปิดขายจนกว่า PNG 512×512 โปร่งใสจะครบ 24 รูป</small>'
          : (paymentState().ready
            ? '<button type="button" class="jk105-buy" id="jk105Buy">ซื้อ '+esc(price(p))+'</button><small id="jk105PaymentStatus">เมื่อชำระสำเร็จ สิทธิ์จะผูกกับบัญชีและกู้คืนได้ทุกเครื่อง</small>'
            : '<button type="button" class="jk105-buy" id="jk105Buy" disabled>ยังไม่เปิดชำระเงินจริง</button><small id="jk105PaymentStatus">ราคา '+esc(price(p))+' · ช่องทางชำระเงินกำลังเชื่อมต่อ ระบบจะไม่จำลองว่าสำเร็จ</small>')))+
    '</div>';
  q('#jk105Back',body).onclick=renderBrowse;
  const use=q('#jk105Use',body);
  if(use)use.onclick=async()=>{close();await window.JKStickerPickerV104?.openMinePack?.(p.pack_id)};
  const buy=q('#jk105Buy',body);
  if(buy&&!buy.disabled)buy.onclick=()=>startPackPurchase(p);
  window.JKStickerPerformanceV107?.scan?.(body);
}
function shell(){
  const el=document.createElement('div');el.className='jk105-overlay';
  el.innerHTML='<section class="jk105-sheet" role="dialog" aria-modal="true" aria-label="ร้าน Sticker JK">'+
    '<header class="jk105-head"><div><small>JK STORE</small><h3>ร้าน Sticker</h3></div><button type="button" class="jk105-close" aria-label="ปิด">×</button></header>'+
    '<main class="jk105-body"></main></section>';
  document.body.appendChild(el);
  q('.jk105-close',el).onclick=close;
  el.addEventListener('click',e=>{if(e.target===el)close()});
  return el;
}
async function open(){
  if(overlay)return;
  const a=api();if(!a)return;
  try{
    catalog=await a.getCatalog();
    if(!Array.isArray(catalog)||!catalog.length)return;
    query='';category='';detailPackId='';browseLimit=PAGE_SIZE;
    oldOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    overlay=shell();document.addEventListener('keydown',onKey);renderBrowse();
  }catch{}
}
function qaResult(){
  if(!overlay)return null;
  const body=q('.jk105-body',overlay);
  return {
    cards:qa('.jk105-card',body).length,
    search:!!q('#jk105Search',body),
    categories:qa('[data-jk105-cat]',body).length,
    hasOwned:!!q('.jk105-owned',body),
    hasPrice:!!q('.jk105-price',body)
  };
}
const QA_PARAMS=new URLSearchParams(location.search);
const QA=QA_PARAMS.get('storeQaStep6')==='1';
const QA7=QA_PARAMS.get('storeQaStep7')==='1';
const QA8=QA_PARAMS.get('storeQaStep8')==='1';
const QA8OFF=QA_PARAMS.get('storeQaStep8Off')==='1';
let qaDone=false,qaTries=0,qa7Done=false,qa8Done=false,qa8OffDone=false;
function qaBadge(text,pass=null){
  let badge=q('#jk105QaStatus');
  if(!badge){
    badge=document.createElement('div');
    badge.id='jk105QaStatus';
    badge.style.cssText='position:fixed;left:12px;right:12px;top:12px;z-index:2147483647;padding:12px 14px;border-radius:14px;font:700 12px/1.45 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.12)';
    document.body.appendChild(badge);
  }
  badge.style.background=pass===true?'#e9f8ee':pass===false?'#fff0f0':'#fff8e8';
  badge.style.color=pass===true?'#176b36':pass===false?'#9b1c1c':'#7b5a00';
  badge.textContent=text;
}
async function runQa(){
  if(!QA||qaDone)return;
  qaTries++;
  qaBadge('JK STICKER STEP 6 · CHECKING · try '+qaTries);
  const a=api();
  if(!a?.getCatalog){
    if(qaTries<24)return setTimeout(runQa,250);
    qaDone=true;return qaBadge('JK STICKER STEP 6 · FAIL · sticker API not ready',false);
  }
  try{
    catalog=await a.getCatalog();
    if(!Array.isArray(catalog)||!catalog.length){
      if(qaTries<24)return setTimeout(runQa,250);
      qaDone=true;return qaBadge('JK STICKER STEP 6 · FAIL · empty catalog',false);
    }
    if(!overlay){
      oldOverflow=document.documentElement.style.overflow;
      document.documentElement.style.overflow='hidden';
      overlay=shell();document.addEventListener('keydown',onKey);
    }
    query='';category='';renderBrowse();
    const r=qaResult()||{};
    const first=catalog[0];
    renderDetail(first.pack_id);
    const detailCount=qa('.jk105-preview-item',overlay).length;
    const result={...r,detailCount,pass:r.cards>0&&r.search&&r.categories>1&&detailCount===24};
    window.JK_STICKER_STORE_V105_QA=result;
    qaDone=true;
    qaBadge(result.pass
      ? 'JK STICKER STEP 6 · PASS · browse + search + category + 24 preview'
      : 'JK STICKER STEP 6 · FAIL · cards='+r.cards+' search='+!!r.search+' categories='+r.categories+' preview='+detailCount,
      result.pass);
  }catch(err){
    if(qaTries<24)return setTimeout(runQa,250);
    qaDone=true;qaBadge('JK STICKER STEP 6 · FAIL · '+String(err?.message||err),false);
  }
}
async function runStep7Qa(){
  if(!QA7||qa7Done)return;
  const a=api();
  if(!a?.getCatalog||!a?.loadCatalog){
    return setTimeout(runStep7Qa,250);
  }
  qa7Done=true;
  try{
    if(!overlay)await open();
    const restoreButton=!!q('#jk105Restore',overlay);
    const before=catalog.filter(isOwned).length;
    const result=await restoreOwnership();
    const after=catalog.filter(isOwned).length;
    const paidRestored=catalog.some(p=>Number(p.amount_minor||0)>0&&isOwned(p));
    const pass=restoreButton&&result.ok&&after>before&&paidRestored;
    window.JK_STICKER_STORE_V105_STEP7_QA={pass,restoreButton,before,after,paidRestored};
    qaBadge(pass
      ? 'JK STICKER STEP 7 · PASS · account ownership + restore'
      : 'JK STICKER STEP 7 · FAIL · button='+restoreButton+' before='+before+' after='+after+' paid='+paidRestored,
      pass);
  }catch(err){
    qaBadge('JK STICKER STEP 7 · FAIL · '+String(err?.message||err),false);
  }
}
async function runStep8Qa(){
  if(!QA8||qa8Done)return;
  const a=api();
  if(!a?.getCatalog||!a?.startPurchaseByPackId)return setTimeout(runStep8Qa,250);
  qa8Done=true;
  try{
    catalog=await a.getCatalog();
    if(!overlay){
      oldOverflow=document.documentElement.style.overflow;
      document.documentElement.style.overflow='hidden';
      overlay=shell();document.addEventListener('keydown',onKey);
    }
    const paid=catalog.find(p=>Number(p.amount_minor||0)>0&&!isOwned(p));
    if(!paid)throw new Error('no_unowned_paid_pack');
    const beforeOwned=isOwned(paid);
    const ready=paymentState().ready;
    renderDetail(paid.pack_id);
    const btn=q('#jk105Buy',overlay);
    const ctaPresent=!!btn;
    const ctaEnabled=!!btn&&!btn.disabled;
    let purchaseResult={ok:false,error:'not_called'};
    if(ready&&ctaEnabled)purchaseResult=await startPackPurchase(paid);
    const afterOwned=isOwned(paid);
    const callCount=Number(window.__JK_QA_PURCHASE_CALLS||0);
    const honestNoAutoUnlock=!afterOwned;
    const pass=ready&&ctaPresent&&ctaEnabled&&!!purchaseResult?.started&&callCount===1&&honestNoAutoUnlock;
    const result={pass,ready,ctaPresent,ctaEnabled,started:!!purchaseResult?.started,callCount,beforeOwned,afterOwned,honestNoAutoUnlock};
    window.JK_STICKER_STORE_V105_STEP8_QA=result;
    qaBadge(pass
      ? 'JK STICKER STEP 8 · PASS · purchase CTA + no fake ownership'
      : 'JK STICKER STEP 8 · FAIL · ready='+ready+' cta='+ctaPresent+'/'+ctaEnabled+' started='+!!purchaseResult?.started+' calls='+callCount+' owned='+beforeOwned+'>'+afterOwned,
      pass);
  }catch(err){
    qaBadge('JK STICKER STEP 8 · FAIL · '+String(err?.message||err),false);
  }
}
async function runStep8OffQa(){
  if(!QA8OFF||qa8OffDone)return;
  const a=api();
  if(!a?.getCatalog)return setTimeout(runStep8OffQa,250);
  qa8OffDone=true;
  try{
    catalog=await a.getCatalog();
    if(!overlay){
      oldOverflow=document.documentElement.style.overflow;
      document.documentElement.style.overflow='hidden';
      overlay=shell();document.addEventListener('keydown',onKey);
    }
    const paid=catalog.find(p=>Number(p.amount_minor||0)>0&&!isOwned(p));
    if(!paid)throw new Error('no_unowned_paid_pack');
    renderDetail(paid.pack_id);
    const btn=q('#jk105Buy',overlay);
    const ready=paymentState().ready;
    const disabled=!!btn&&btn.disabled;
    const honestText=String(btn?.textContent||'').includes('ยังไม่เปิดชำระเงินจริง') &&
      String(q('#jk105PaymentStatus',overlay)?.textContent||'').includes('ระบบจะไม่จำลองว่าสำเร็จ');
    const callCount=Number(window.__JK_QA_PURCHASE_CALLS||0);
    const pass=!ready&&disabled&&honestText&&callCount===0&&!isOwned(paid);
    window.JK_STICKER_STORE_V105_STEP8_OFF_QA={pass,ready,disabled,honestText,callCount,owned:isOwned(paid)};
    qaBadge(pass
      ? 'JK STICKER STEP 8 OFF · PASS · disabled + honest state'
      : 'JK STICKER STEP 8 OFF · FAIL · ready='+ready+' disabled='+disabled+' honest='+honestText+' calls='+callCount+' owned='+isOwned(paid),
      pass);
  }catch(err){
    qaBadge('JK STICKER STEP 8 OFF · FAIL · '+String(err?.message||err),false);
  }
}
if(QA)qaBadge('JK STICKER STEP 6 · CHECKING');
if(QA7)qaBadge('JK STICKER STEP 7 · CHECKING');
if(QA8)qaBadge('JK STICKER STEP 8 · CHECKING');
if(QA8OFF)qaBadge('JK STICKER STEP 8 OFF · CHECKING');
document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{runQa();runStep7Qa();runStep8Qa();runStep8OffQa()},120));
setTimeout(()=>{runQa();runStep7Qa();runStep8Qa();runStep8OffQa()},180);
document.addEventListener('click',e=>{
  const tab=e.target.closest?.('[data-jk104-tab="store"]');
  if(!tab)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  window.JKStickerPickerV104?.close?.();
  open();
},true);
window.JKStickerStoreV105={open,close,renderBrowse,renderDetail,restoreOwnership,startPackPurchase,runQa,runStep7Qa,runStep8Qa,runStep8OffQa};
})();