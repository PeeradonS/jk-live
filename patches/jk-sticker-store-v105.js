(()=>{if(window.JK_STICKER_STORE_V105)return;window.JK_STICKER_STORE_V105=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LABELS={cute:'น่ารัก',pets:'สัตว์เลี้ยง',reptile:'สัตว์จิ๋ว',love:'ความรัก',dating:'จีบ/คุย',feelings:'อารมณ์',daily:'ทุกวัน',lifestyle:'ไลฟ์สไตล์',work:'งาน',nerd:'เนิร์ด',gaming:'เกม',men:'ผู้ชาย',women:'ผู้หญิง',women_mischief:'สาวเจ้าเล่ห์',pride:'Pride',couple:'คู่รัก'};
let overlay=null,catalog=[],query='',category='',detailPackId='',oldOverflow='';

const api=()=>window.JKStickerV77||null;
const isOwned=p=>!!(p&&(Number(p.amount_minor||0)===0||p.owned||api()?.isOwned?.(p)));
const price=p=>{const n=Number(p?.amount_minor||0);return n===0?'ฟรี':(n/100).toLocaleString('th-TH')+' บาท'};
const art=(i,cls='')=>api()?.artMarkup?.(i?.sticker_key,cls)||'<span class="jk105-fallback">JK</span>';

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
  return '<span class="jk105-price">'+esc(price(p))+'</span>';
}
function card(p){
  return '<button class="jk105-card" type="button" data-jk105-pack="'+esc(p.pack_id)+'">'+
    cover(p)+
    '<div class="jk105-card-copy"><small>'+esc(LABELS[p.category]||p.category||'JK')+'</small><b>'+esc(p.title)+'</b><span>24 ภาพ · คำไทยพร้อมใช้</span><div class="jk105-card-foot">'+status(p)+'<em>ดูชุด ›</em></div></div>'+
  '</button>';
}
function filtered(){
  const term=query.trim().toLocaleLowerCase('th');
  return catalog.filter(p=>{
    if(category&&p.category!==category)return false;
    if(!term)return true;
    const hay=[p.title,LABELS[p.category]||p.category,...(p.items||[]).map(i=>i.caption_th)].join(' ').toLocaleLowerCase('th');
    return hay.includes(term);
  });
}
function renderBrowse(){
  if(!overlay)return;
  detailPackId='';
  const body=q('.jk105-body',overlay);
  const cats=[...new Set(catalog.map(p=>p.category).filter(Boolean))];
  const rows=filtered();
  body.innerHTML=
    '<section class="jk105-hero"><small>JK ORIGINAL STICKERS</small><h2>สติ๊กเกอร์ที่อยากหยิบมาใช้จริง</h2><p>'+catalog.length+' ชุด · '+catalog.reduce((n,p)=>n+(p.items?.length||0),0).toLocaleString('th-TH')+' ภาพ · ทุกชุดมีข้อความไทย</p></section>'+
    '<label class="jk105-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input id="jk105Search" type="search" inputmode="search" placeholder="ค้นหา เช่น ฝันดี แมว เนิร์ด…" value="'+esc(query)+'"></label>'+
    '<div class="jk105-cats"><button type="button" data-jk105-cat="" class="'+(!category?'active':'')+'">ทั้งหมด</button>'+
      cats.map(c=>'<button type="button" data-jk105-cat="'+esc(c)+'" class="'+(category===c?'active':'')+'">'+esc(LABELS[c]||c)+'</button>').join('')+
    '</div>'+
    '<div class="jk105-resultbar"><b>'+rows.length+' ชุด</b><span>แตะเพื่อดูครบ 24 ภาพ</span></div>'+
    (rows.length?'<div class="jk105-grid">'+rows.map(card).join('')+'</div>':'<div class="jk105-empty">ยังไม่พบชุดที่ตรงกับคำค้น</div>');
  q('#jk105Search',body)?.addEventListener('input',e=>{query=e.target.value;renderBrowse();const i=q('#jk105Search',overlay);i?.focus();if(i)i.setSelectionRange(i.value.length,i.value.length)});
  qa('[data-jk105-cat]',body).forEach(b=>b.onclick=()=>{category=b.dataset.jk105Cat||'';renderBrowse()});
  qa('[data-jk105-pack]',body).forEach(b=>b.onclick=()=>renderDetail(b.dataset.jk105Pack));
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
        : '<div class="jk105-buy-row"><b>'+esc(price(p))+'</b><span>ระบบชำระเงินจริงยังไม่เปิดใน Preview นี้</span></div>')+
    '</div>';
  q('#jk105Back',body).onclick=renderBrowse;
  const use=q('#jk105Use',body);
  if(use)use.onclick=async()=>{close();await window.JKStickerPickerV104?.openMinePack?.(p.pack_id)};
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
    query='';category='';detailPackId='';
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
const QA=new URLSearchParams(location.search).get('storeQaStep6')==='1';
let qaDone=false,qaTries=0;
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
if(QA)qaBadge('JK STICKER STEP 6 · CHECKING');
document.addEventListener('DOMContentLoaded',()=>setTimeout(runQa,120));
setTimeout(runQa,180);
window.JKStickerStoreV105={open,close,renderBrowse,renderDetail};
})();