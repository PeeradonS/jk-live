(()=>{if(window.JK_PROD_UI_V93)return;window.JK_PROD_UI_V93=1;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.dataset.jkUi='v93';

function labelNav(){
  const nav=q('.jk-v17-nav'); if(!nav)return;
  const spec=[['discover','หน้าแรก'],['people','เจอกัน'],['stories','เล่า'],['chat','แชท'],['me','ฉัน']];
  const btns=qa('.nav-btn',nav).slice(0,5);
  if(btns.length<5)return;
  btns.forEach((b,i)=>{
    b.dataset.route=spec[i][0];
    const direct=[...b.children].find(x=>x.tagName==='SPAN' && !x.querySelector('svg'));
    if(direct) direct.textContent=spec[i][1];
    b.setAttribute('aria-label',spec[i][1]);
  });
}
function makeIntent(root,anchor){
  let box=q('#jkIntent93',root);
  if(!box){
    box=document.createElement('section');
    box.id='jkIntent93';box.className='jk-home-section';
    box.innerHTML='<div class="jk93-title"><small>วันนี้คุณเข้ามาเพราะอะไร</small><h2>เลือกตามจังหวะของคุณ</h2></div><div class="jk93-intents"><button class="active" data-jk93-intent="now">💬 คุยตอนนี้</button><button data-jk93-intent="relationship">♥ หาแฟน</button><button data-jk93-intent="friends">👋 หาเพื่อน</button><button data-jk93-intent="activities">☕ หากิจกรรม</button></div>';
    anchor?.after(box);
    qa('[data-jk93-intent]',box).forEach(b=>b.onclick=()=>{
      qa('[data-jk93-intent]',box).forEach(x=>x.classList.toggle('active',x===b));
      const key=b.dataset.jk93Intent;
      if(key==='now'){q('[data-social-mode="now"]',root)?.click();return;}
      const target=q('[data-social-mode="'+key+'"]',root);
      if(target){target.click();return;}
      const nav=q('.nav-btn[data-route="people"]');nav?.click();
    });
  }
  return box;
}
function simplifyHome(){
  const root=q('#page[data-route="discover"]'); if(!root)return;
  const hero=q('.jk-city-hero',root),way=q('.jk-way-section',root);
  if(!hero||!way)return;
  const small=q('.jk-city-hero-copy small',hero),h=q('.jk-city-hero-copy h1',hero),p=q('.jk-city-hero-copy p',hero);
  if(small)small.textContent='● ออนไลน์ตอนนี้';
  if(h)h.textContent='คืนนี้อยากคุยกับใครสักคนไหม?';
  if(p)p.textContent='เลือกคนใกล้ ๆ หรือให้ JK พาคุณไปเจอคนที่พร้อมคุยตอนนี้';
  const wh=q('.jk-home-heading h2',way);if(wh)wh.textContent='เริ่มคุยแบบไหนดี';
  const modes=qa('.jk-random-mode-v27',way);
  [['ส่งแชท','random_text'],['สุ่มเสียง','random_voice'],['สุ่มวิดีโอ','random_video']].forEach((x,i)=>{
    const b=modes[i];if(!b)return;const t=q('b',b);if(t)t.textContent=x[0];b.dataset.socialMode=x[1];
  });
  const choose=q('.jk-choose-self-v27',way);if(choose){const b=q('b',choose);if(b)b.textContent='เลือกคนใกล้ฉัน';}
  const intent=makeIntent(root,way);
  let people=qa('.jk-home-section',root).find(x=>q('.jk-people-rail',x) && x!==intent);
  if(people){people.id='jkPeople93';const hh=q('.jk-home-heading h2',people);if(hh)hh.textContent='คนแถวนี้';const ss=q('.jk-home-heading small',people);if(ss)ss.textContent='ออนไลน์ก่อน · แตะเพื่อดูโปรไฟล์';}
  const keep=new Set([hero,way,intent,people].filter(Boolean));
  [...root.children].forEach(el=>{
    if(keep.has(el))el.removeAttribute('data-jk93-hidden');
    else el.dataset.jk93Hidden='1';
  });
  [...root.children].forEach(el=>{if(el.dataset.jk93Hidden==='1')el.style.display='none';else el.style.display='';});
  [hero,way,intent,people].filter(Boolean).forEach(el=>root.appendChild(el));
}
function run(){document.documentElement.dataset.jkUi='v93';labelNav();simplifyHome();
 const s=q('#expressionBtnV28');if(s){s.innerHTML='☺';s.setAttribute('aria-label','สติ๊กเกอร์');s.title='สติ๊กเกอร์';}
}
new MutationObserver(()=>queueMicrotask(run)).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);setTimeout(run,80);setTimeout(run,400);setTimeout(run,1200);
})();