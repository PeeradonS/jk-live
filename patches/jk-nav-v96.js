(()=>{if(window.JK_NAV_V96)return;window.JK_NAV_V96=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const SPEC=[
  {route:'discover',label:'หน้าแรก'},
  {route:'people',label:'เจอกัน'},
  {route:'stories',label:'เล่า'},
  {route:'chat',label:'แชท'},
  {route:'me',label:'ฉัน'}
];

function paint(){
  document.documentElement.dataset.jkUi='v94';
  const nav=q('.jk-v17-nav');if(!nav)return;
  const btns=qa('.nav-btn',nav).slice(0,5);if(btns.length<5)return;
  const current=q('#page')?.dataset?.route||'discover';
  btns.forEach((b,i)=>{
    const x=SPEC[i];if(!x)return;
    if(b.dataset.route!==x.route)b.dataset.route=x.route;
    b.setAttribute('aria-label',x.label);
    const label=[...b.children].find(el=>el.tagName==='SPAN'&&!el.querySelector('svg')&&!el.classList.contains('notification-badge'));
    if(label&&label.textContent!==x.label)label.textContent=x.label;
    b.classList.toggle('active',current===x.route||(x.route==='chat'&&current==='chat-detail'));
  });
}

document.addEventListener('click',e=>{
  const b=e.target.closest?.('.jk-v17-nav .nav-btn');if(!b)return;
  const nav=q('.jk-v17-nav');const btns=nav?qa('.nav-btn',nav).slice(0,5):[];
  const i=btns.indexOf(b);const x=SPEC[i];if(!x)return;
  e.preventDefault();e.stopImmediatePropagation();
  btns.forEach((n,j)=>n.classList.toggle('active',j===i));
  if(typeof window.JKOpenRoute==='function')window.JKOpenRoute(x.route);
},true);

let queued=false;
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;paint()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',paint);
setTimeout(paint,80);setTimeout(paint,400);setTimeout(paint,1000);
})();