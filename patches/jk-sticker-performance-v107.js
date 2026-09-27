(()=>{if(window.JK_STICKER_PERFORMANCE_V107)return;window.JK_STICKER_PERFORMANCE_V107=1;
const SELECTOR='img[data-jk-sticker-lazy-key]';
const stats={observed:0,queued:0,hydrated:0,active:0,maxActive:0,warmed:0};
const seen=new WeakSet();
const queue=[];
const MAX_ACTIVE=3;
const api=()=>window.JKStickerV77||null;

function next(){
  while(stats.active<MAX_ACTIVE&&queue.length){
    const img=queue.shift();
    if(!img||!img.isConnected||img.dataset.jk107Done==='1')continue;
    stats.active++;stats.maxActive=Math.max(stats.maxActive,stats.active);
    const run=()=>{
      try{
        const key=img.getAttribute('data-jk-sticker-lazy-key')||'';
        const src=api()?.assetUrlByKey?.(key)||'';
        if(src){
          img.onload=()=>img.classList.add('jk107-loaded');
          img.src=src;
          img.dataset.jk107Done='1';
          img.removeAttribute('data-jk-sticker-lazy-key');
          stats.hydrated++;
        }
      }finally{
        stats.active--;
        next();
      }
    };
    if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:220});
    else setTimeout(run,0);
  }
}
function enqueue(img){
  if(!img||img.dataset.jk107Queued==='1'||img.dataset.jk107Done==='1')return;
  img.dataset.jk107Queued='1';queue.push(img);stats.queued++;next();
}
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    observer.unobserve(entry.target);
    enqueue(entry.target);
  });
},{root:null,rootMargin:'260px 0px',threshold:0.01}):null;

function observe(img){
  if(!img||seen.has(img)||img.dataset.jk107Done==='1')return;
  seen.add(img);stats.observed++;
  if(observer)observer.observe(img);else enqueue(img);
}
function scan(root=document){
  if(root?.matches?.(SELECTOR))observe(root);
  root?.querySelectorAll?.(SELECTOR)?.forEach(observe);
}
async function hydrate(img){
  if(!img)return false;
  const key=img.getAttribute('data-jk-sticker-lazy-key')||img.getAttribute('data-sticker-key')||'';
  if(!key)return false;
  const src=api()?.assetUrlByKey?.(key)||'';
  if(!src)return false;
  img.src=src;img.dataset.jk107Done='1';img.removeAttribute('data-jk-sticker-lazy-key');
  img.classList.add('jk107-loaded');stats.hydrated++;
  return true;
}
function warmRecent(){
  const picker=window.JKStickerPickerV104;
  const stickerApi=api();
  if(!picker?.recent||!stickerApi?.assetUrlByKey)return setTimeout(warmRecent,500);
  const keys=picker.recent().slice(0,4).map(x=>String(x).split('|').slice(1).join('|')).filter(Boolean);
  const work=()=>{
    keys.forEach(key=>{try{if(stickerApi.assetUrlByKey(key))stats.warmed++}catch{}});
  };
  if('requestIdleCallback'in window)requestIdleCallback(work,{timeout:800});else setTimeout(work,500);
}
let queuedScan=false;
const mo=new MutationObserver(records=>{
  if(queuedScan)return;queuedScan=true;
  queueMicrotask(()=>{
    queuedScan=false;
    records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}));
  });
});
mo.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>{scan();setTimeout(warmRecent,700)});
setTimeout(scan,250);setTimeout(warmRecent,1400);
window.JKStickerPerformanceV107={scan,hydrate,stats,MAX_ACTIVE};
})();