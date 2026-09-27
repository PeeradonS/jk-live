(()=>{if(window.JK_STICKER_PICKER_V104)return;window.JK_STICKER_PICKER_V104=1;
const RECENT_KEY='jk_sticker_recent_v104';
const FAV_KEY='jk_sticker_favorites_v104';
const USAGE_KEY='jk_sticker_usage_v104';
const MAX_RECENT=16;
let overlay=null,activePackId='',catalog=[],busy=false,oldOverflow='',activeTab='recent';

const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=()=>window.JKStickerV77||null;
const bridge=()=>window.JKStickerBridgeV77||null;
const owned=p=>!!(p&&(Number(p.amount_minor||0)===0||p.owned||api()?.isOwned?.(p)));
const price=p=>{const n=Number(p?.amount_minor||0);return n===0?'ฟรี':(n/100).toLocaleString('th-TH')+' บาท'};

function readList(key){try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function writeList(key,v){localStorage.setItem(key,JSON.stringify(v))}
function usage(){try{const v=JSON.parse(localStorage.getItem(USAGE_KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return{}}}
function id(packId,key){return packId+'|'+key}
function recent(){return readList(RECENT_KEY)}
function favorites(){return readList(FAV_KEY)}
function isFav(packId,key){return favorites().includes(id(packId,key))}
function remember(packId,key){
  const k=id(packId,key),a=recent().filter(x=>x!==k);a.unshift(k);writeList(RECENT_KEY,a.slice(0,MAX_RECENT));
  const u=usage();u[k]=Number(u[k]||0)+1;localStorage.setItem(USAGE_KEY,JSON.stringify(u));
}
function toggleFav(packId,key){
  const k=id(packId,key),a=favorites();
  const next=a.includes(k)?a.filter(x=>x!==k):[k,...a].slice(0,48);
  writeList(FAV_KEY,next);renderCurrent();
}
function mapItems(){
  const m=new Map();
  catalog.forEach(p=>(p.items||[]).forEach(i=>m.set(id(p.pack_id,i.sticker_key),{pack:p,item:i})));
  return m;
}
function art(item,cls=''){return api()?.artMarkup?.(item.sticker_key,cls)||'<span class="jk104-fallback">JK</span>'}
function tile(pack,item){
  const fav=isFav(pack.pack_id,item.sticker_key);
  const key=esc(id(pack.pack_id,item.sticker_key));
  return '<div class="jk104-tile">'+
    '<button class="jk104-sticker" type="button" data-jk104-send="'+key+'" aria-label="ส่ง '+esc(item.caption_th)+'">'+
      art(item,'jk104-art')+'<span>'+esc(item.caption_th)+'</span></button>'+
    '<button class="jk104-fav'+(fav?' active':'')+'" type="button" data-jk104-fav="'+key+'" aria-label="'+(fav?'เอาออกจากรายการโปรด':'เพิ่มในรายการโปรด')+'">'+
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3 4.9 13.5A4.8 4.8 0 0 1 11.7 6.7L12 7l.3-.3a4.8 4.8 0 0 1 6.8 6.8Z"/></svg>'+
    '</button></div>';
}
function packThumb(pack){
  const item=pack.items?.[0];
  return '<button class="jk104-pack '+(pack.pack_id===activePackId?'active':'')+'" type="button" data-jk104-pack="'+esc(pack.pack_id)+'" aria-label="'+esc(pack.title)+'">'+
    (item?art(item,'jk104-pack-art'):'<span>JK</span>')+'</button>';
}
function close(){
  if(!overlay)return;overlay.remove();overlay=null;
  document.documentElement.style.overflow=oldOverflow;document.removeEventListener('keydown',onKey);
}
function onKey(e){if(e.key==='Escape')close()}
function shell(){
  const el=document.createElement('div');el.className='jk104-overlay';
  el.innerHTML='<section class="jk104-sheet" role="dialog" aria-modal="true" aria-label="สติ๊กเกอร์ JK">'+
    '<div class="jk104-handle"></div>'+
    '<header class="jk104-head"><div><small>JK STICKERS</small><h3>สติ๊กเกอร์</h3></div><button type="button" class="jk104-close" aria-label="ปิด">×</button></header>'+
    '<nav class="jk104-tabs" aria-label="หมวดสติ๊กเกอร์">'+
      '<button type="button" data-jk104-tab="recent" class="active">ล่าสุด</button>'+
      '<button type="button" data-jk104-tab="mine">ของฉัน</button>'+
      '<button type="button" data-jk104-tab="store">ร้าน Sticker</button>'+
    '</nav>'+
    '<div class="jk104-packs"></div><main class="jk104-body"></main>'+
  '</section>';
  document.body.appendChild(el);
  el.addEventListener('click',e=>{if(e.target===el)close()});
  q('.jk104-close',el).onclick=close;
  qa('[data-jk104-tab]',el).forEach(b=>b.onclick=()=>switchTab(b.dataset.jk104Tab));
  return el;
}
function setTab(tab){
  activeTab=tab;if(!overlay)return;
  qa('[data-jk104-tab]',overlay).forEach(b=>b.classList.toggle('active',b.dataset.jk104Tab===tab));
}
async function sendAndRemember(packId,key,button=null){
  if(busy)return false;
  busy=true;button?.classList.add('sending');
  try{
    const ok=await api()?.sendByKey?.(packId,key);
    if(ok){
      remember(packId,key);
      button?.classList.add('sent');
      if(button)setTimeout(()=>button.classList.remove('sent'),450);
      return true;
    }
    return false;
  }finally{
    busy=false;button?.classList.remove('sending');
  }
}
function bindTiles(root){
  qa('[data-jk104-send]',root).forEach(b=>b.onclick=async()=>{
    const raw=b.dataset.jk104Send||'',i=raw.indexOf('|');if(i<0)return;
    await sendAndRemember(raw.slice(0,i),raw.slice(i+1),b);
  });
  qa('[data-jk104-fav]',root).forEach(b=>b.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const raw=b.dataset.jk104Fav||'',i=raw.indexOf('|');if(i<0)return;
    toggleFav(raw.slice(0,i),raw.slice(i+1));
  });
}
function section(title,subtitle,rows){
  return '<section class="jk104-section"><div class="jk104-title"><div><b>'+esc(title)+'</b><small>'+esc(subtitle)+'</small></div></div>'+
    (rows.length?'<div class="jk104-grid">'+rows.map(x=>tile(x.pack,x.item)).join('')+'</div>':'<div class="jk104-empty compact">ยังไม่มี</div>')+'</section>';
}
function renderRecent(){
  if(!overlay)return;const body=q('.jk104-body',overlay),packs=q('.jk104-packs',overlay);packs.innerHTML='';
  const map=mapItems(),u=usage();
  const favRows=favorites().map(k=>map.get(k)).filter(Boolean).sort((a,b)=>(u[id(b.pack.pack_id,b.item.sticker_key)]||0)-(u[id(a.pack.pack_id,a.item.sticker_key)]||0));
  let recentRows=recent().map(k=>map.get(k)).filter(Boolean);
  if(!recentRows.length){
    const p=catalog.find(owned)||catalog[0];recentRows=(p?.items||[]).slice(0,8).map(item=>({pack:p,item}));
  }
  body.innerHTML=(favRows.length?section('รายการโปรด','ตัวที่หยิบใช้บ่อยอยู่ตรงนี้',favRows):'')+
    section('ใช้ล่าสุด','แตะครั้งเดียวเพื่อส่ง',recentRows);
  bindTiles(body);
}
function renderMine(packId=''){
  if(!overlay)return;const ownedPacks=catalog.filter(owned),body=q('.jk104-body',overlay),packs=q('.jk104-packs',overlay);
  if(!ownedPacks.length){packs.innerHTML='';body.innerHTML='<div class="jk104-empty">ยังไม่มีชุดสติ๊กเกอร์ในบัญชีนี้</div>';return}
  const p=ownedPacks.find(x=>x.pack_id===(packId||activePackId))||ownedPacks[0];activePackId=p.pack_id;
  packs.innerHTML='<div class="jk104-packrail">'+ownedPacks.map(packThumb).join('')+'</div>';
  qa('[data-jk104-pack]',packs).forEach(b=>b.onclick=()=>renderMine(b.dataset.jk104Pack));
  body.innerHTML='<div class="jk104-title"><div><b>'+esc(p.title)+'</b><small>'+p.items.length+' ภาพ · แตะภาพเพื่อส่ง · แตะหัวใจเพื่อเก็บ</small></div></div>'+
    '<div class="jk104-grid">'+p.items.map(i=>tile(p,i)).join('')+'</div>';
  bindTiles(body);
}
function renderStore(){
  if(!overlay)return;const body=q('.jk104-body',overlay),packs=q('.jk104-packs',overlay);packs.innerHTML='';
  body.innerHTML='<div class="jk104-storehead"><div><small>JK ORIGINAL</small><b>ร้าน Sticker</b><span>24 ภาพต่อชุด · ซื้อแล้วใช้กับบัญชีเดิมได้</span></div></div>'+
    '<div class="jk104-storegrid">'+catalog.map(p=>{
      const previews=(p.items||[]).slice(0,2).map(i=>art(i,'jk104-cover-art')).join('');
      return '<button class="jk104-storecard" type="button" data-jk104-store="'+esc(p.pack_id)+'"><div class="jk104-cover">'+previews+'</div><b>'+esc(p.title)+'</b><small>'+p.items.length+' ภาพ</small><strong>'+(owned(p)?'มีแล้ว':price(p))+'</strong></button>';
    }).join('')+'</div>';
  qa('[data-jk104-store]',body).forEach(b=>b.onclick=()=>{
    const p=catalog.find(x=>x.pack_id===b.dataset.jk104Store);if(!p)return;
    if(owned(p)){activePackId=p.pack_id;switchTab('mine');return}
    close();api()?.openPack?.(p.pack_id,'store');
  });
}
function renderCurrent(){if(activeTab==='recent')renderRecent();else if(activeTab==='mine')renderMine();else renderStore()}
function switchTab(tab){setTab(tab);renderCurrent()}
async function open(){
  if(overlay||busy)return;const br=bridge();
  if(!br?.activeMatch?.())return br?.toast?.('เลือกห้องคุยก่อนใช้สติ๊กเกอร์');
  const a=api();if(!a)return br?.toast?.('กำลังโหลดสติ๊กเกอร์…');
  busy=true;
  try{
    catalog=await a.getCatalog();
    if(!Array.isArray(catalog)||!catalog.length)return br?.toast?.('ยังโหลดชุดสติ๊กเกอร์ไม่สำเร็จ');
    oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
    overlay=shell();document.addEventListener('keydown',onKey);switchTab('recent');
  }catch{br?.toast?.('เปิดสติ๊กเกอร์ไม่สำเร็จ ลองอีกครั้ง')}
  finally{busy=false}
}

const QA_RUN=new URLSearchParams(location.search).get('pickerQa')==='1';
let qaRan=false;
function showQa(result){
  let el=q('#jk104QaStatus');
  if(!el){
    el=document.createElement('div');
    el.id='jk104QaStatus';
    el.style.cssText='position:fixed;left:10px;right:10px;top:10px;z-index:2147483647;padding:12px 14px;border-radius:14px;font:800 12px/1.45 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.14)';
    document.body.appendChild(el);
  }
  el.style.background=result.pass?'#e9f8ee':'#fff4e5';
  el.style.color=result.pass?'#176b36':'#7b4a00';
  el.dataset.result=result.pass?'pass':'wait';
  el.dataset.qa=JSON.stringify(result);
  el.textContent=result.pass
    ? 'JK STICKER STEP 4 · PASS · send + recent'
    : 'JK STICKER STEP 4 · WAIT · '+(result.info||'');
}
async function runQa(){
  if(!QA_RUN||qaRan)return;
  const br=bridge(),a=api(),hasMatch=!!br?.activeMatch?.();
  if(!br?.preview||!hasMatch||!a){
    showQa({pass:false,info:'preview='+!!br?.preview+' match='+hasMatch+' api='+!!a});
    return;
  }
  qaRan=true;
  const result={pass:false,sent:false,recentFirst:false};
  try{
    catalog=await a.getCatalog();
    const pack=catalog.find(owned)||catalog[0];
    const item=pack?.items?.[0];
    if(!pack||!item)throw new Error('no_sticker');
    result.key=id(pack.pack_id,item.sticker_key);
    result.sent=!!(await a.sendByKey(pack.pack_id,item.sticker_key));
    if(result.sent)remember(pack.pack_id,item.sticker_key);
    result.recentFirst=recent()[0]===result.key;
    result.pass=result.sent&&result.recentFirst;
    if(!result.pass)result.info='sent='+result.sent+' recentFirst='+result.recentFirst;
  }catch(err){result.info=String(err?.message||err)}
  window.JK_STICKER_PICKER_V104_QA=result;
  showQa(result);
}


const QA_RUN=(()=>{
  const p=new URLSearchParams(location.search);
  return p.get('pickerQaRun')==='1'||p.get('pickerQa104')==='1';
})();
let qaRan=false;
function showQa(result){
  let el=q('#jk104QaStatus');
  if(!el){
    el=document.createElement('div');
    el.id='jk104QaStatus';
    el.style.cssText='position:fixed;left:12px;right:12px;top:12px;z-index:2147483647;padding:12px 14px;border-radius:14px;font:700 12px/1.45 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.12)';
    document.body.appendChild(el);
  }
  el.style.background=result.pass?'#e9f8ee':'#fff0f0';
  el.style.color=result.pass?'#176b36':'#9b1c1c';
  el.dataset.result=result.pass?'pass':'fail';
  el.dataset.qa=JSON.stringify(result);
  el.textContent=(result.pass?'STICKER PICKER V104 QA PASS · ':'STICKER PICKER V104 QA FAIL · ')+
    'sent='+!!result.sent+' · recentFirst='+!!result.recentFirst+' · '+(result.key||result.error||'');
}
async function runQa(){
  if(!QA_RUN||qaRan)return;
  const br=bridge();
  if(!br?.preview||!br?.activeMatch?.())return;
  const a=api();if(!a)return;
  qaRan=true;
  const result={pass:false,sent:false,recentFirst:false};
  try{
    const packs=await a.getCatalog();
    const pack=packs.find(owned)||packs[0];
    const item=pack?.items?.[0];
    if(!pack||!item)throw new Error('no_sticker');
    result.key=id(pack.pack_id,item.sticker_key);
    result.sent=await sendAndRemember(pack.pack_id,item.sticker_key);
    result.recentFirst=recent()[0]===result.key;
    result.pass=result.sent&&result.recentFirst;
  }catch(err){result.error=String(err?.message||err)}
  window.JK_STICKER_PICKER_V104_QA=result;
  showQa(result);
}

function styleTrigger(){
  const b=q('#expressionBtnV28');if(!b)return;b.classList.add('jk104-trigger');
  b.setAttribute('aria-label','สติ๊กเกอร์');b.setAttribute('title','สติ๊กเกอร์');
  if(!b.dataset.jk104Icon){
    b.dataset.jk104Icon='1';
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4.5h14v10.2L13.7 20H5Z"/><path d="M13.5 20v-5.5H19"/><path d="M8.5 9.5h.01M15.5 9.5h.01"/><path d="M9.2 13c.8 1 1.8 1.5 2.8 1.5s2-.5 2.8-1.5"/></svg>';
  }
}
document.addEventListener('click',e=>{
  const b=e.target.closest?.('#expressionBtnV28');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();open();
},true);
let queued=false;
const hydrate=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;styleTrigger();runQa()})};
new MutationObserver(hydrate).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>{styleTrigger();runQa()});setTimeout(()=>{styleTrigger();runQa()},150);setTimeout(()=>{styleTrigger();runQa()},700);setTimeout(runQa,1400);
window.JKStickerPickerV104={open,close,toggleFav,favorites,recent,usage,runQa};
})();