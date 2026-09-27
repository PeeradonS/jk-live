(()=>{if(window.JK_STICKER_PICKER_V103)return;window.JK_STICKER_PICKER_V103=1;
const RECENT_KEY='jk_sticker_recent_v103';
const MAX_RECENT=12;
let overlay=null,activePackId='',catalog=[],busy=false,oldOverflow='';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function api(){return window.JKStickerV77||null}
function owned(p){return !!(p&&(Number(p.amount_minor||0)===0||p.owned||api()?.isOwned?.(p)))}
function price(p){const n=Number(p?.amount_minor||0);return n===0?'ฟรี':(n/100).toLocaleString('th-TH')+' บาท'}
function recent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch{return[]}}
function remember(packId,key){
  const id=packId+'|'+key;
  const a=recent().filter(x=>x!==id);a.unshift(id);
  localStorage.setItem(RECENT_KEY,JSON.stringify(a.slice(0,MAX_RECENT)));
}
function mapItems(){
  const m=new Map();
  catalog.forEach(p=>(p.items||[]).forEach(i=>m.set(p.pack_id+'|'+i.sticker_key,{pack:p,item:i})));
  return m;
}
function art(item,cls=''){
  return api()?.artMarkup?.(item.sticker_key,cls)||'<span class="jk103-fallback">JK</span>';
}
function stickerButton(pack,item){
  return '<button class="jk103-sticker" type="button" data-jk103-send="'+esc(pack.pack_id)+'|'+esc(item.sticker_key)+'" aria-label="ส่ง '+esc(item.caption_th)+'">'+
    art(item,'jk103-art')+'<span>'+esc(item.caption_th)+'</span></button>';
}
function packThumb(pack){
  const item=pack.items?.[0];
  return '<button class="jk103-pack '+(pack.pack_id===activePackId?'active':'')+'" type="button" data-jk103-pack="'+esc(pack.pack_id)+'" aria-label="'+esc(pack.title)+'">'+
    (item?art(item,'jk103-pack-art'):'<span>JK</span>')+'</button>';
}

function close(){
  if(!overlay)return;
  overlay.remove();overlay=null;
  document.documentElement.style.overflow=oldOverflow;
  document.removeEventListener('keydown',onKey);
}
function onKey(e){if(e.key==='Escape')close()}

function shell(){
  const el=document.createElement('div');el.className='jk103-overlay';
  el.innerHTML='<section class="jk103-sheet" role="dialog" aria-modal="true" aria-label="สติ๊กเกอร์ JK">'+
    '<div class="jk103-handle"></div>'+
    '<header class="jk103-head"><div><small>JK STICKERS</small><h3>สติ๊กเกอร์</h3></div><button type="button" class="jk103-close" aria-label="ปิด">×</button></header>'+
    '<nav class="jk103-tabs" aria-label="หมวดสติ๊กเกอร์">'+
      '<button type="button" data-jk103-tab="recent" class="active">ล่าสุด</button>'+
      '<button type="button" data-jk103-tab="mine">ของฉัน</button>'+
      '<button type="button" data-jk103-tab="store">ร้าน Sticker</button>'+
    '</nav>'+
    '<div class="jk103-packs"></div><main class="jk103-body"></main>'+
  '</section>';
  document.body.appendChild(el);
  el.addEventListener('click',e=>{if(e.target===el)close()});
  q('.jk103-close',el).onclick=close;
  qa('[data-jk103-tab]',el).forEach(b=>b.onclick=()=>switchTab(b.dataset.jk103Tab));
  return el;
}
function setTab(tab){
  if(!overlay)return;
  qa('[data-jk103-tab]',overlay).forEach(b=>b.classList.toggle('active',b.dataset.jk103Tab===tab));
}
function bindStickerSends(root){
  qa('[data-jk103-send]',root).forEach(b=>b.onclick=async()=>{
    if(busy)return;
    const raw=b.dataset.jk103Send||'',i=raw.indexOf('|');
    if(i<0)return;
    const packId=raw.slice(0,i),key=raw.slice(i+1);
    busy=true;b.classList.add('sending');
    try{
      const ok=await api()?.sendByKey?.(packId,key);
      if(ok){
        remember(packId,key);
        b.classList.add('sent');
        setTimeout(()=>b.classList.remove('sent'),500);
      }
    }finally{busy=false;b.classList.remove('sending')}
  });
}
function renderRecent(){
  if(!overlay)return;
  const body=q('.jk103-body',overlay),packs=q('.jk103-packs',overlay);
  packs.innerHTML='';
  const map=mapItems();
  let rows=recent().map(k=>map.get(k)).filter(Boolean);
  if(!rows.length){
    const p=catalog.find(owned)||catalog[0];
    rows=(p?.items||[]).slice(0,8).map(item=>({pack:p,item}));
  }
  body.innerHTML='<div class="jk103-title"><div><b>ใช้ล่าสุด</b><small>แตะครั้งเดียวเพื่อส่ง</small></div></div>'+
    (rows.length?'<div class="jk103-grid">'+rows.map(x=>stickerButton(x.pack,x.item)).join('')+'</div>':'<div class="jk103-empty">ยังไม่มีสติ๊กเกอร์ที่ใช้ล่าสุด</div>');
  bindStickerSends(body);
}
function renderMine(packId=''){
  if(!overlay)return;
  const ownedPacks=catalog.filter(owned);
  const body=q('.jk103-body',overlay),packs=q('.jk103-packs',overlay);
  if(!ownedPacks.length){
    packs.innerHTML='';body.innerHTML='<div class="jk103-empty">ยังไม่มีชุดสติ๊กเกอร์ในบัญชีนี้</div>';return;
  }
  const p=ownedPacks.find(x=>x.pack_id===(packId||activePackId))||ownedPacks[0];
  activePackId=p.pack_id;
  packs.innerHTML='<div class="jk103-packrail">'+ownedPacks.map(packThumb).join('')+'</div>';
  qa('[data-jk103-pack]',packs).forEach(b=>b.onclick=()=>renderMine(b.dataset.jk103Pack));
  body.innerHTML='<div class="jk103-title"><div><b>'+esc(p.title)+'</b><small>'+p.items.length+' ภาพ · แตะเพื่อส่งทันที</small></div></div>'+
    '<div class="jk103-grid">'+p.items.map(i=>stickerButton(p,i)).join('')+'</div>';
  bindStickerSends(body);
}
function renderStore(){
  if(!overlay)return;
  const body=q('.jk103-body',overlay),packs=q('.jk103-packs',overlay);
  packs.innerHTML='';
  body.innerHTML='<div class="jk103-storehead"><div><small>JK ORIGINAL</small><b>ร้าน Sticker</b><span>24 ภาพต่อชุด · ซื้อแล้วใช้กับบัญชีเดิมได้</span></div></div>'+
    '<div class="jk103-storegrid">'+catalog.map(p=>{
      const previews=(p.items||[]).slice(0,2).map(i=>art(i,'jk103-cover-art')).join('');
      return '<button class="jk103-storecard" type="button" data-jk103-store="'+esc(p.pack_id)+'"><div class="jk103-cover">'+previews+'</div><b>'+esc(p.title)+'</b><small>'+p.items.length+' ภาพ</small><strong>'+(owned(p)?'มีแล้ว':price(p))+'</strong></button>';
    }).join('')+'</div>';
  qa('[data-jk103-store]',body).forEach(b=>b.onclick=()=>{
    const p=catalog.find(x=>x.pack_id===b.dataset.jk103Store);if(!p)return;
    if(owned(p)){activePackId=p.pack_id;switchTab('mine');return}
    close();api()?.openPack?.(p.pack_id,'store');
  });
}
function switchTab(tab){
  setTab(tab);
  if(tab==='recent')renderRecent();
  else if(tab==='mine')renderMine();
  else renderStore();
}
async function open(){
  if(overlay||busy)return;
  const bridge=window.JKStickerBridgeV77;
  if(!bridge?.activeMatch?.())return bridge?.toast?.('เลือกห้องคุยก่อนใช้สติ๊กเกอร์');
  const a=api();if(!a)return bridge?.toast?.('กำลังโหลดสติ๊กเกอร์…');
  busy=true;
  try{
    catalog=await a.getCatalog();
    if(!Array.isArray(catalog)||!catalog.length)return bridge?.toast?.('ยังโหลดชุดสติ๊กเกอร์ไม่สำเร็จ');
    oldOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    overlay=shell();document.addEventListener('keydown',onKey);
    switchTab('recent');
  }catch{bridge?.toast?.('เปิดสติ๊กเกอร์ไม่สำเร็จ ลองอีกครั้ง')}
  finally{busy=false}
}

function styleTrigger(){
  const b=q('#expressionBtnV28');if(!b)return;
  b.classList.add('jk103-trigger');b.setAttribute('aria-label','สติ๊กเกอร์');b.setAttribute('title','สติ๊กเกอร์');
  if(!b.dataset.jk103Icon){
    b.dataset.jk103Icon='1';
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4.5h14v10.2L13.7 20H5Z"/><path d="M13.5 20v-5.5H19"/><path d="M8.5 9.5h.01M15.5 9.5h.01"/><path d="M9.2 13c.8 1 1.8 1.5 2.8 1.5s2-.5 2.8-1.5"/></svg>';
  }
}

document.addEventListener('click',e=>{
  const b=e.target.closest?.('#expressionBtnV28');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();open();
},true);

let queued=false;
const hydrate=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;styleTrigger()})};
new MutationObserver(hydrate).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',styleTrigger);
setTimeout(styleTrigger,150);setTimeout(styleTrigger,700);setTimeout(runQa,900);setTimeout(runQa,1600);

async function runQa(){
  const params=new URLSearchParams(location.search);
  if(params.get('pickerQa')!=='1')return;
  if(window.__JK_PICKER_QA_RUNNING)return;
  const bridge=window.JKStickerBridgeV77;
  if(!bridge?.activeMatch?.())return;
  const a=api();
  if(!a)return;
  window.__JK_PICKER_QA_RUNNING=1;
  const result={step:'start',pass:false,at:new Date().toISOString()};
  try{
    catalog=await a.getCatalog();
    const pack=catalog.find(owned)||catalog[0];
    const item=pack?.items?.[0];
    if(!pack||!item)throw new Error('no_sticker');
    result.pack_id=pack.pack_id;
    result.sticker_key=item.sticker_key;
    result.step='send';
    const ok=await a.sendByKey(pack.pack_id,item.sticker_key);
    if(!ok)throw new Error('send_failed');
    remember(pack.pack_id,item.sticker_key);
    const first=recent()[0]||'';
    result.recent_first=first;
    result.pass=first===(pack.pack_id+'|'+item.sticker_key);
    result.step=result.pass?'passed':'recent_mismatch';
  }catch(err){
    result.error=String(err?.message||err);
    result.step='failed';
  }
  window.JK_STICKER_PICKER_QA_RESULT=result;
  let badge=document.getElementById('jkPickerQaBadge');
  if(!badge){
    badge=document.createElement('div');
    badge.id='jkPickerQaBadge';
    badge.style.cssText='position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:2147483647;padding:9px 13px;border-radius:999px;font:800 12px system-ui;background:#fff;border:1px solid #eadfe2;box-shadow:0 6px 20px rgba(0,0,0,.12);color:#24191d';
    document.body.appendChild(badge);
  }
  badge.textContent=result.pass?'STICKER PICKER QA · PASS':'STICKER PICKER QA · FAIL · '+result.step;
  badge.dataset.qa=JSON.stringify(result);
}

window.JKStickerPickerV103={open,close ,runQa};
})();