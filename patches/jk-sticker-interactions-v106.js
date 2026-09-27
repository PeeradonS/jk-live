(()=>{if(window.JK_STICKER_INTERACTIONS_V106)return;window.JK_STICKER_INTERACTIONS_V106=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
let lastSticker=null;

function stickerId(pack,key){return String(pack||'')+'|'+String(key||'')}
function picker(){return window.JKStickerPickerV104||null}
function stickerApi(){return window.JKStickerV77||null}
function bridge(){return window.JKStickerBridgeV77||null}
function isFavorite(pack,key){
  const p=picker(),id=stickerId(pack,key);
  try{return !!p?.favorites?.().includes(id)}catch{return false}
}
function rememberWrap(wrap){
  if(!wrap)return;
  const key=wrap.getAttribute('data-sticker-key')||'';
  const pack=wrap.getAttribute('data-sticker-pack')||'';
  if(!key||!pack)return;
  lastSticker={key,pack,at:Date.now(),wrap};
}
function currentSticker(){
  if(!lastSticker||Date.now()-lastSticker.at>2200)return null;
  return lastSticker;
}
function closeMenu(root){
  const close=q('[data-close]',root);
  if(close){close.click();return}
  if(root?.hasAttribute?.('data-jk106-qa-root'))return;
}
function toast(msg){bridge()?.toast?.(msg)}
async function resend(pack,key,root){
  closeMenu(root);
  const send=stickerApi()?.sendByKey;
  if(!send)return toast('ระบบสติ๊กเกอร์ยังไม่พร้อม');
  const ok=await send(pack,key);
  if(!ok)toast('ยังส่งสติ๊กเกอร์นี้ไม่ได้');
}
function toggleFavorite(pack,key,root){
  const p=picker();
  if(!p?.toggleFav)return toast('รายการโปรดยังไม่พร้อม');
  const before=isFavorite(pack,key);
  p.toggleFav(pack,key);
  const added=!before;
  try{window.dispatchEvent(new CustomEvent('jk-sticker-favorites-updated',{detail:{pack,key,added}}))}catch{}
  closeMenu(root);
  toast(added?'เพิ่มสติ๊กเกอร์นี้ไปที่โปรดแล้ว':'เอาสติกเกอร์นี้ออกจากโปรดแล้ว');
}
function menuRoot(reply){
  return reply?.closest?.('[data-jk106-qa-root],#modalRoot,.modal-root,.modal-card,[role="dialog"]')||
    q('#modalRoot')||reply?.parentElement;
}
function decorate(root,sticker){
  if(!root||!sticker||root.querySelector('[data-jk106-action]'))return false;
  const reply=q('#replyMessageV28',root);
  if(!reply)return false;
  const list=reply.closest('.menu-list')||q('.menu-list',root);
  if(!list)return false;
  const fav=isFavorite(sticker.pack,sticker.key);
  const favBtn=document.createElement('button');
  favBtn.type='button';favBtn.className='menu-item';favBtn.dataset.jk106Action='favorite';
  favBtn.innerHTML='<span>'+(fav?'เอาออกจากรายการโปรด':'เพิ่มไปที่รายการโปรด')+
    '<small>'+(fav?'ลบจากรายการโปรดของสติ๊กเกอร์':'ใช้ซ้ำได้เร็วจากตัวเลือกสติ๊กเกอร์')+'</small></span><span>'+(fav?'★':'☆')+'</span>';
  favBtn.addEventListener('click',()=>toggleFavorite(sticker.pack,sticker.key,root));

  const resendBtn=document.createElement('button');
  resendBtn.type='button';resendBtn.className='menu-item';resendBtn.dataset.jk106Action='resend';
  resendBtn.innerHTML='<span>ส่งสติ๊กเกอร์นี้อีกครั้ง<small>ไม่ต้องไล่หาจากทั้งแพ็ก</small></span><span>›</span>';
  resendBtn.addEventListener('click',()=>resend(sticker.pack,sticker.key,root));

  const own=q('#manageOwnMessageV28',list);
  if(own){list.insertBefore(favBtn,own);list.insertBefore(resendBtn,own)}
  else{list.appendChild(favBtn);list.appendChild(resendBtn)}
  return true;
}
function scanMenus(){
  const sticker=currentSticker();if(!sticker)return;
  qa('#replyMessageV28').forEach(reply=>decorate(menuRoot(reply),sticker));
}
document.addEventListener('pointerdown',e=>{
  const wrap=e.target.closest?.('.bubble-wrap[data-sticker-key][data-sticker-pack]');
  if(wrap)rememberWrap(wrap);
},true);
document.addEventListener('contextmenu',e=>{
  const wrap=e.target.closest?.('.bubble-wrap[data-sticker-key][data-sticker-pack]');
  if(wrap){rememberWrap(wrap);setTimeout(scanMenus,0)}
},true);

let queued=false;
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;scanMenus()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});

const QA=new URLSearchParams(location.search).get('stickerQaStep9')==='1';
let qaDone=false;
async function runQa(){
  if(!QA||qaDone)return;
  if(!picker()?.toggleFav||!stickerApi()?.sendByKey)return setTimeout(runQa,160);
  qaDone=true;
  const pack='qa_step9_pack',key='qa_step9_key',id=stickerId(pack,key);
  const wasFav=isFavorite(pack,key);
  if(wasFav)picker().toggleFav(pack,key);
  const wrap=document.createElement('div');
  wrap.className='bubble-wrap me';
  wrap.setAttribute('data-sticker-key',key);
  wrap.setAttribute('data-sticker-pack',pack);
  wrap.style.display='none';
  document.body.appendChild(wrap);
  rememberWrap(wrap);

  const root=document.createElement('div');
  root.setAttribute('data-jk106-qa-root','1');
  root.style.display='none';
  root.innerHTML='<div class="menu-list"><button id="replyMessageV28" class="menu-item">ตอบกลับ</button></div>';
  document.body.appendChild(root);
  decorate(root,currentSticker());
  const reply=!!q('#replyMessageV28',root);
  const favBtn=q('[data-jk106-action="favorite"]',root);
  const resendBtn=q('[data-jk106-action="resend"]',root);
  favBtn?.click();
  const favoriteChanged=isFavorite(pack,key);

  let resendCalls=0;
  const api=stickerApi(),original=api.sendByKey;
  try{
    api.sendByKey=async(p,k)=>{if(p===pack&&k===key)resendCalls++;return true};
    await resend(pack,key,root);
  }finally{api.sendByKey=original}
  if(isFavorite(pack,key))picker().toggleFav(pack,key);
  if(wasFav&&!isFavorite(pack,key))picker().toggleFav(pack,key);
  root.remove();wrap.remove();
  const pass=reply&&!!favBtn&&!!resendBtn&&favoriteChanged&&resendCalls===1;
  const badge=document.createElement('div');
  badge.id='jkStep9Qa';
  badge.style.cssText='position:fixed;left:12px;right:12px;top:12px;z-index:2147483647;padding:12px 14px;border-radius:14px;background:'+(pass?'#e9f8ee':'#fff0f0')+';color:'+(pass?'#176b36':'#9b1c1c')+';font:700 12px/1.45 system-ui';
  badge.textContent=pass
    ?'JK STICKER STEP 9 · PASS · existing long press + reply + favorite + resend'
    :'JK STICKER STEP 9 · FAIL · reply='+reply+' fav='+!!favBtn+' resend='+!!resendBtn+' changed='+favoriteChanged+' calls='+resendCalls;
  document.body.appendChild(badge);
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(runQa,220));
setTimeout(runQa,700);
window.JKStickerInteractionsV106={scanMenus,isFavorite,resend};
})();