(()=>{if(window.JK_STICKER_PRO_V100)return;window.JK_STICKER_PRO_V100=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const RECENT_KEY='jk_sticker_pro_recent_v100';
let bypassOld=false,pending=null,sheet=null,toastTimer=0;

const stickers=[
 ['555+','laugh'],['จริงดิ','shock'],['คิดถึงนะ','miss'],['ไปดิ','go'],
 ['ฝันดี','sleep'],['กินข้าวยัง','food'],['หายงอนน้า','sorry'],['แป๊บนึงนะ','wait'],
 ['ถึงบ้านบอกนะ','care'],['โอเคเลย','ok'],['ได้เลย','yes'],['ขอกอดหน่อย','hug'],
 ['เป็นห่วงนะ','care'],['ขอบคุณนะ','thanks'],['ขอโทษนะ','sorry'],['งอนแล้วนะ','pout'],
 ['ง้อหน่อย','please'],['สู้ ๆ นะ','cheer'],['เก่งมากเลย','proud'],['น่ารักจัง','love'],
 ['ทำไรอยู่','peek'],['ว่างคุยไหม','chat'],['ไว้คุยกันนะ','bye'],['มอร์นิ่งนะ','morning']
];
const legacyIds=['haha','really','miss','go','night','food'];
const packs=[
 {id:'daily',name:'JK Buddy',sub:'ทุกวัน · 24 ภาพ',price:'มีแล้ว',variant:0},
 {id:'badboy',name:'Bad Boy',sub:'หนุ่มเท่ · 24 ภาพ',price:'39 บาท',variant:1},
 {id:'cat',name:'น้องแมว JK',sub:'สัตว์เลี้ยง · 24 ภาพ',price:'39 บาท',variant:2},
 {id:'sweet',name:'สาวหวาน',sub:'น่ารัก · 24 ภาพ',price:'39 บาท',variant:3},
 {id:'nerd',name:'หนุ่มเนิร์ด',sub:'เนิร์ด · 24 ภาพ',price:'39 บาท',variant:4},
 {id:'love',name:'รักนะ',sub:'ความรัก · 24 ภาพ',price:'49 บาท',variant:5}
];

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
function recent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch{return[]}}
function remember(i){const a=recent().filter(x=>x!==i);a.unshift(i);localStorage.setItem(RECENT_KEY,JSON.stringify(a.slice(0,12)))}

function stickerSvg(caption,index=0,variant=0){
  const seed=(index+variant*7)%24;
  const palettes=[
    ['#f7b4c7','#d6456a','#5d2637','#fff4f7'],
    ['#c3d4ff','#6079c9','#24315f','#f3f6ff'],
    ['#ffd8a8','#d47a42','#65381f','#fff8ef'],
    ['#d8c4ff','#8a66c8','#3f2b66','#f8f4ff'],
    ['#bfe7dc','#3b9f87','#20584e','#f1fbf8'],
    ['#ffe0ee','#c84d8a','#642347','#fff5fa']
  ];
  const [main,accent,ink,light]=palettes[(seed+variant)%palettes.length];
  const mood=stickers[index%stickers.length]?.[1]||'ok';
  const wink=['love','go','yes','proud','peek'].includes(mood);
  const closed=['sleep','sorry','hug'].includes(mood);
  const mouth=['pout','sorry'].includes(mood)?'M224 250 Q256 230 288 250':
              ['shock'].includes(mood)?'M244 244 Q256 260 268 244 Q256 274 244 244':
              'M222 238 Q256 274 290 238';
  const eyeL=closed?'M205 213 Q220 202 235 213':wink?'M205 213 Q220 225 235 213':'';
  const eyeR=closed?'M277 213 Q292 202 307 213':'';
  const font=caption.length>11?34:caption.length>8?38:42;
  const accentThing=mood==='food'
    ?'<g transform="translate(330 135) rotate(12)"><rect x="-30" y="-18" width="60" height="42" rx="13" fill="#fff" stroke="#ffffff" stroke-width="9"/><path d="M-20 0h40M-14 10h28" stroke="'+accent+'" stroke-width="5" stroke-linecap="round"/></g>'
    :mood==='sleep'
    ?'<g fill="'+accent+'" font-family="Arial" font-weight="800"><text x="336" y="118" font-size="42">Z</text><text x="374" y="82" font-size="31">z</text></g>'
    :mood==='love'||mood==='miss'||mood==='hug'
    ?'<path d="M354 112c-25-28-68 9 0 59 68-50 25-87 0-59Z" fill="'+accent+'" stroke="#fff" stroke-width="9"/>'
    :'<path d="m354 112 10 23 25 2-19 16 6 25-22-13-22 13 6-25-19-16 25-2Z" fill="'+accent+'" stroke="#fff" stroke-width="8"/>';
  const eyes=(closed||wink)
    ?'<path d="'+eyeL+'" fill="none" stroke="'+ink+'" stroke-width="10" stroke-linecap="round"/><path d="'+(eyeR||'M277 213 Q292 202 307 213')+'" fill="none" stroke="'+ink+'" stroke-width="10" stroke-linecap="round"/>'
    :'<ellipse cx="220" cy="215" rx="9" ry="12" fill="'+ink+'"/><ellipse cx="292" cy="215" rx="9" ry="12" fill="'+ink+'"/>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'+
  '<defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#351b25" flood-opacity=".12"/></filter><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+light+'"/><stop offset="1" stop-color="'+main+'"/></linearGradient></defs>'+
  '<g filter="url(#s)">'+
  '<path d="M141 146c15-70 79-108 145-89 63 18 102 81 87 145l-7 27c-13 56-63 95-121 95h-9c-63 0-113-48-117-110l-1-17c-1-18 7-38 23-51Z" fill="url(#g)" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>'+
  '<path d="M166 158c16-48 59-74 106-69 42 4 76 31 91 70-35-19-69-24-101-15-33 9-63 14-96 14Z" fill="'+accent+'" opacity=".96" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>'+
  eyes+
  '<path d="'+mouth+'" fill="none" stroke="'+ink+'" stroke-width="10" stroke-linecap="round"/>'+
  '<ellipse cx="184" cy="250" rx="18" ry="9" fill="'+main+'" opacity=".85"/><ellipse cx="328" cy="250" rx="18" ry="9" fill="'+main+'" opacity=".85"/>'+
  accentThing+
  '</g>'+
  '<g filter="url(#s)"><rect x="53" y="352" width="406" height="104" rx="48" fill="#fff" stroke="'+main+'" stroke-width="8"/>'+
  '<text x="256" y="417" text-anchor="middle" dominant-baseline="middle" fill="'+ink+'" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="'+font+'" font-weight="800">'+esc(caption)+'</text></g>'+
  '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}

function art(caption,index,variant=0,cls=''){
  return '<img class="jk-sticker-pro-art '+cls+'" alt="'+esc(caption)+'" src="'+stickerSvg(caption,index,variant)+'">';
}

function markTrigger(){
 const b=q('#expressionBtnV28');if(!b)return;
 if(!b.classList.contains('jk-sticker-pro-trigger'))b.classList.add('jk-sticker-pro-trigger');
 b.setAttribute('aria-label','สติ๊กเกอร์');
 b.setAttribute('title','สติ๊กเกอร์');
 if(!b.dataset.jkspIcon){
   b.dataset.jkspIcon='1';
   b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4.5h14v10.3L13.8 20H5Z"/><path d="M13.5 20v-5.5H19"/><path d="M8.5 9.5h.01M15.5 9.5h.01"/><path d="M9 13c.9 1 1.9 1.5 3 1.5s2.1-.5 3-1.5"/></svg>';
 }
}

function enhanceBubble(el,item=null){
 if(!el||el.dataset.jkStickerPro==='1')return;
 const wrap=el.closest('.bubble-wrap');
 const oldCaption=q('b',el)?.textContent?.trim()||'JK';
 const caption=item?.caption||oldCaption;
 const idx=item?.index??(hash(caption)%stickers.length);
 el.dataset.jkStickerPro='1';
 if(wrap)wrap.classList.add('jk-sticker-pro-message');
 el.innerHTML=art(caption,idx,0);
}
function enhanceAll(){
 const raw=qa('.jk-sticker-bubble-v28:not([data-jk-sticker-pro="1"])');
 if(pending&&raw.length){
   const mine=raw.filter(x=>x.closest('.bubble-wrap')?.classList.contains('me')).pop();
   if(mine){enhanceBubble(mine,pending);pending=null}
 }
 raw.forEach(x=>enhanceBubble(x));
 qa('.bubble-wrap').forEach(w=>{
   if(q('.jk-sticker-image-v62',w))w.classList.add('jk-sticker-pro-message');
 });
 markTrigger();
}

function closeSheet(){
 if(!sheet)return;
 sheet.remove();sheet=null;
 document.documentElement.style.overflow='';
}
function toast(msg){
 clearTimeout(toastTimer);q('.jksp-toast')?.remove();
 const t=document.createElement('div');t.className='jksp-toast';t.textContent=msg;document.body.appendChild(t);
 toastTimer=setTimeout(()=>t.remove(),1700);
}
function itemButton(i,variant=0){
 const [caption]=stickers[i%stickers.length];
 return '<button class="jksp-sticker" data-jksp-send="'+i+'" aria-label="ส่ง '+esc(caption)+'">'+art(caption,i,variant)+'</button>';
}
function packThumb(p){
 const idx=(p.variant*4)%stickers.length;
 return '<button class="jksp-pack '+(p.id==='daily'?'active':'')+'" data-jksp-pack="'+p.id+'" aria-label="'+esc(p.name)+'">'+art(stickers[idx][0],idx,p.variant)+'</button>';
}
function renderMine(root,mode='mine'){
 const body=q('.jksp-body',root);if(!body)return;
 let ids=[...Array(24).keys()];
 if(mode==='recent'){
   const r=recent();ids=r.length?r:ids.slice(0,8);
 }
 body.innerHTML='<div class="jksp-section-head"><div><b>'+(mode==='recent'?'ใช้ล่าสุด':'JK Buddy · Everyday')+'</b><small>'+(mode==='recent'?'แตะเพื่อส่งทันที':'24 ภาพ · คำไทยอยู่ในงานแล้ว')+'</small></div><small>PNG/SVG โปร่งใส</small></div><div class="jksp-grid">'+ids.map(i=>itemButton(i)).join('')+'</div>';
 bindSends(root);
}
function renderStore(root){
 const body=q('.jksp-body',root);if(!body)return;
 body.innerHTML='<div class="jksp-store-hero"><div class="badge">JK</div><div><b>Sticker Store</b><small>งานโปร่งใส · 24 ภาพต่อชุด · ซื้อแล้วผูกบัญชีและดาวน์โหลดใหม่ได้</small></div></div>'+
 '<div class="jksp-store-grid">'+packs.map((p,pi)=>{
   const a=(p.variant*4)%24,b=(a+3)%24;
   return '<button class="jksp-store-card" data-jksp-store="'+p.id+'"><div class="jksp-store-cover">'+art(stickers[a][0],a,p.variant)+art(stickers[b][0],b,p.variant)+'</div><b>'+esc(p.name)+'</b><small>'+esc(p.sub)+'</small><strong>'+esc(p.price)+'</strong></button>';
 }).join('')+'</div><div class="jksp-store-note">ตัวนี้เป็นหน้าตา Production ของ Store ก่อนเชื่อม Billing จริง การซื้อจะไม่ถูกจำลองเป็นเงินจริงจนกว่าระบบชำระเงินพร้อม</div>';
 qa('[data-jksp-store]',body).forEach(b=>b.onclick=()=>{const p=packs.find(x=>x.id===b.dataset.jkspStore);if(!p)return;if(p.id==='daily'){switchTab(root,'mine');return}toast(p.name+' · Preview ร้านค้า')});
}
function switchTab(root,mode){
 qa('[data-jksp-tab]',root).forEach(b=>b.classList.toggle('active',b.dataset.jkspTab===mode));
 if(mode==='store')renderStore(root);else renderMine(root,mode);
}
function bindSends(root){
 qa('[data-jksp-send]',root).forEach(b=>b.onclick=()=>sendSticker(Number(b.dataset.jkspSend)));
}
function openSheet(){
 if(sheet)return;
 const ov=document.createElement('div');ov.className='jksp-overlay';
 ov.innerHTML='<section class="jksp-sheet" role="dialog" aria-modal="true" aria-label="สติ๊กเกอร์"><div class="jksp-handle"></div>'+
 '<div class="jksp-head"><div class="jksp-head-copy"><small>JK STICKERS</small><h3>ส่งความรู้สึกให้ไวขึ้น</h3></div><button class="jksp-close" aria-label="ปิด">×</button></div>'+
 '<div class="jksp-tabs"><button class="active" data-jksp-tab="recent">ล่าสุด</button><button data-jksp-tab="mine">ของฉัน</button><button data-jksp-tab="store">ร้าน Sticker</button></div>'+
 '<div class="jksp-packbar">'+packs.slice(0,4).map(packThumb).join('')+'<button class="jksp-pack jksp-pack-store" data-jksp-tab-store aria-label="ร้านสติ๊กเกอร์">＋</button></div>'+
 '<div class="jksp-body"></div></section>';
 document.body.appendChild(ov);sheet=ov;document.documentElement.style.overflow='hidden';
 q('.jksp-close',ov).onclick=closeSheet;
 ov.addEventListener('click',e=>{if(e.target===ov)closeSheet()});
 qa('[data-jksp-tab]',ov).forEach(b=>b.onclick=()=>switchTab(ov,b.dataset.jkspTab));
 q('[data-jksp-tab-store]',ov).onclick=()=>{qa('[data-jksp-tab]',ov).forEach(x=>x.classList.toggle('active',x.dataset.jkspTab==='store'));renderStore(ov)};
 qa('[data-jksp-pack]',ov).forEach(b=>b.onclick=()=>{const id=b.dataset.jkspPack;if(id==='daily'){qa('[data-jksp-pack]',ov).forEach(x=>x.classList.toggle('active',x===b));switchTab(ov,'mine')}else toast((packs.find(x=>x.id===id)?.name||'ชุดนี้')+' · เปิดดูใน Store')});
 renderMine(ov,'recent');
}

function directPreviewInsert(item){
 const list=q('#messageList');if(!list)return false;
 const wrap=document.createElement('div');wrap.className='bubble-wrap me jk-sticker-pro-message';wrap.dataset.chatMessageV28='jksp-'+Date.now();
 const d=document.createElement('div');d.className='jk-sticker-bubble-v28';d.dataset.jkStickerPro='1';d.innerHTML=art(item.caption,item.index,0);
 const time=document.createElement('span');time.className='bubble-time';time.textContent=new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
 wrap.append(d,time);list.appendChild(wrap);wrap.scrollIntoView({behavior:'smooth',block:'end'});return true;
}

function sendSticker(index){
 const caption=stickers[index][0];remember(index);pending={caption,index};
 closeSheet();
 const trigger=q('#expressionBtnV28');
 if(!trigger){directPreviewInsert(pending);pending=null;return}
 const legacy=legacyIds[index%legacyIds.length];
 bypassOld=true;trigger.click();
 setTimeout(()=>{
   const old=q('[data-sticker-v28="'+legacy+'"]');
   if(old){
     old.click();
     setTimeout(enhanceAll,60);
   }else{
     q('[data-close]')?.click();
     directPreviewInsert(pending);pending=null;
     toast('Preview · ส่ง '+caption+' แล้ว');
   }
 },80);
}

document.addEventListener('click',e=>{
 const b=e.target.closest?.('#expressionBtnV28');
 if(!b)return;
 if(bypassOld){bypassOld=false;return}
 e.preventDefault();e.stopImmediatePropagation();openSheet();
},true);

let queued=false;
function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;enhanceAll()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',enhanceAll);
setTimeout(enhanceAll,120);setTimeout(enhanceAll,700);
window.JKStickerProV100={open:openSheet,enhance:enhanceAll};
})();