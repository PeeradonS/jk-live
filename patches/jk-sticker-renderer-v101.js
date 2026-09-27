(()=>{if(window.JK_STICKER_RENDERER_V101)return;window.JK_STICKER_RENDERER_V101=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}

function fallbackSvg(face,caption){
  const seed=hash((face||'')+'|'+caption);
  const palettes=[
    ['#bde9c8','#58ad70','#376742','#f5fff7'],
    ['#ffd5e0','#d85b7c','#6b2940','#fff7f9'],
    ['#cfdcff','#6783d0','#2e3d72','#f7f9ff'],
    ['#ffe0b9','#d4864e','#6b4325','#fffaf3'],
    ['#dccbff','#8c6ecb','#44326c','#faf7ff']
  ];
  const [main,accent,ink,light]=palettes[seed%palettes.length];
  const safeCaption=String(caption||'JK').slice(0,22);
  const safeFace=String(face||'☺').slice(0,3);
  const font=safeCaption.length>12?30:safeCaption.length>8?34:38;
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'+
    '<defs><filter id="d" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#2d1720" flood-opacity=".10"/></filter></defs>'+
    '<g filter="url(#d)">'+
      '<path d="M133 108c34-49 97-68 153-48 61 22 99 84 86 148l-7 34c-14 67-72 112-140 109-64-3-114-52-119-115l-2-28c-3-37 7-72 29-100Z" fill="'+light+'" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>'+
      '<circle cx="245" cy="198" r="105" fill="'+main+'"/>'+
      '<circle cx="211" cy="190" r="9" fill="'+ink+'"/><circle cx="279" cy="190" r="9" fill="'+ink+'"/>'+
      '<path d="M216 230q29 34 58 0" fill="none" stroke="'+ink+'" stroke-width="9" stroke-linecap="round"/>'+
      '<circle cx="185" cy="226" r="16" fill="'+accent+'" opacity=".22"/><circle cx="305" cy="226" r="16" fill="'+accent+'" opacity=".22"/>'+
      '<text x="245" y="302" text-anchor="middle" font-size="42" font-family="system-ui, sans-serif">'+esc(safeFace)+'</text>'+
    '</g>'+
    '<g filter="url(#d)"><rect x="54" y="365" width="404" height="92" rx="44" fill="#fff" stroke="'+main+'" stroke-width="7"/>'+
      '<text x="256" y="421" text-anchor="middle" dominant-baseline="middle" fill="'+ink+'" font-family="system-ui,-apple-system,\"Noto Sans Thai\",sans-serif" font-size="'+font+'" font-weight="800">'+esc(safeCaption)+'</text>'+
    '</g>'+
  '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}

function upgradeWrap(wrap){
  if(!wrap||wrap.dataset.jkStickerRendererV101==='1')return;
  const legacy=q('.jk-sticker-bubble-v28',wrap);
  const asset=q('.jk-sticker-image-v62,.jk-v77-art,[data-sticker-asset]',wrap);
  if(!legacy&&!asset)return;

  wrap.dataset.jkStickerRendererV101='1';
  wrap.classList.add('jk-sticker-message-v101');

  if(asset){
    const src=asset.getAttribute('src')||'';
    const m=/\/resources\/stickers\/bad-boy-24\/(\d{2})\.png(?:$|[?#])/.exec(src);
    if(m){
      asset.setAttribute('src','./resources/stickers/standardized/bad-boy/'+m[1]+'.png');
      asset.setAttribute('width','512');
      asset.setAttribute('height','512');
    }
    const stickerKey=asset.getAttribute('data-sticker-key')||'';
    const stickerPack=asset.getAttribute('data-sticker-pack')||'';
    if(stickerKey)wrap.setAttribute('data-sticker-key',stickerKey);
    if(stickerPack)wrap.setAttribute('data-sticker-pack',stickerPack);
    asset.classList.add('jk-sticker-art-v101');
    const parent=asset.closest('[class*="sticker-bubble"]');
    if(parent)parent.classList.add('jk-sticker-host-v101');
    return;
  }

  const face=q('i',legacy)?.textContent?.trim()||'☺';
  const caption=q('b',legacy)?.textContent?.trim()||'JK';
  const img=document.createElement('img');
  img.className='jk-sticker-art-v101';
  img.alt=caption;
  img.loading='lazy';
  img.decoding='async';
  img.src=fallbackSvg(face,caption);
  legacy.textContent='';
  legacy.appendChild(img);
  legacy.classList.add('jk-sticker-host-v101');
}


async function runDataQa(){
  if(!DATA_QA_MODE)return;
  if(sessionStorage.getItem('jk_sticker_data_qa_v102')==='reloaded')return;
  const bridge=window.JKStickerBridgeV77;
  const match=bridge?.activeMatch?.();
  if(!bridge?.send||!match)return;
  if(sessionStorage.getItem('jk_sticker_data_qa_v102')==='sending')return;
  sessionStorage.setItem('jk_sticker_data_qa_v102','sending');
  const ok=await bridge.send(
    {pack_id:'v62_31'},
    {sticker_key:'v65_v62_31_01',caption_th:'หวัดดีครับ'}
  );
  if(!ok){
    sessionStorage.removeItem('jk_sticker_data_qa_v102');
    return;
  }
  sessionStorage.setItem('jk_sticker_data_qa_v102','reloaded');
  setTimeout(()=>location.reload(),220);
}

function scan(){
  injectQaFixture();
  runDataQa();
  qa('.bubble-wrap').forEach(upgradeWrap);
}


const params=new URLSearchParams(location.search);
const QA_MODE=params.get('stickerQa')==='1';
const DATA_QA_MODE=params.get('stickerDataQa')==='1';
function injectQaFixture(){
  if(!QA_MODE)return;
  const list=q('#messageList');if(!list||list.dataset.jkStickerQaV101==='1')return;
  list.dataset.jkStickerQaV101='1';
  const samples=[
    {side:'me',face:'☺',caption:'หายงอนน้า',time:'13:18'},
    {side:'me',face:'♡',caption:'แป๊บนึงนะ',time:'13:18'},
    {side:'them',face:'✦',caption:'ถึงบ้านบอกนะ',time:'13:19'}
  ];
  samples.forEach((x,i)=>{
    const wrap=document.createElement('div');
    wrap.className='bubble-wrap '+x.side;
    wrap.dataset.chatMessageV28='jk-sticker-qa-'+i;
    wrap.innerHTML='<div class="jk-sticker-bubble-v28"><i>'+esc(x.face)+'</i><b>'+esc(x.caption)+'</b></div><span class="bubble-time">'+x.time+'</span>';
    list.appendChild(wrap);
  });
}

let queued=false;
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;scan()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',scan);
setTimeout(scan,80);setTimeout(scan,450);setTimeout(scan,1100);
window.JKStickerRendererV101={scan};
})();