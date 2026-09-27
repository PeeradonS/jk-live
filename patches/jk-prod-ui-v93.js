(()=>{if(window.JK_PROD_UI_V93)return;window.JK_PROD_UI_V93=1;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const setText=(el,t)=>{if(el&&el.textContent!==t)el.textContent=t};
document.documentElement.dataset.jkUi='v93';

function labelNav(){
  const nav=q('.jk-v17-nav'); if(!nav)return;
  const spec=[['discover','หน้าแรก'],['people','เจอกัน'],['stories','เล่า'],['chat','แชท'],['me','ฉัน']];
  const btns=qa('.nav-btn',nav).slice(0,5);
  if(btns.length<5)return;
  btns.forEach((b,i)=>{
    if(b.dataset.route!==spec[i][0]) b.dataset.route=spec[i][0];
    const direct=[...b.children].find(x=>x.tagName==='SPAN'&&!x.querySelector('svg'));
    setText(direct,spec[i][1]);
    if(b.getAttribute('aria-label')!==spec[i][1]) b.setAttribute('aria-label',spec[i][1]);
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
      q('.nav-btn[data-route="people"]')?.click();
    });
  }
  return box;
}

function simplifyHome(){
  const root=q('#page[data-route="discover"]'); if(!root)return;
  const hero=q('.jk-city-hero',root),way=q('.jk-way-section',root);
  if(!hero||!way)return;

  setText(q('.jk-city-hero-copy small',hero),'● ออนไลน์ตอนนี้');
  setText(q('.jk-city-hero-copy h1',hero),'คืนนี้อยากคุยกับใครสักคนไหม?');
  setText(q('.jk-city-hero-copy p',hero),'เลือกคนใกล้ ๆ หรือให้ JK พาคุณไปเจอคนที่พร้อมคุยตอนนี้');
  setText(q('.jk-home-heading h2',way),'เริ่มคุยแบบไหนดี');

  const modes=qa('.jk-random-mode-v27',way);
  [['ส่งแชท','random_text'],['สุ่มเสียง','random_voice'],['สุ่มวิดีโอ','random_video']].forEach((x,i)=>{
    const b=modes[i]; if(!b)return;
    setText(q('b',b),x[0]);
    if(b.dataset.socialMode!==x[1]) b.dataset.socialMode=x[1];
  });

  const choose=q('.jk-choose-self-v27',way);
  if(choose) setText(q('b',choose),'เลือกคนใกล้ฉัน');

  const intent=makeIntent(root,way);
  let people=qa('.jk-home-section',root).find(x=>q('.jk-people-rail',x)&&x!==intent);
  if(people){
    if(people.id!=='jkPeople93')people.id='jkPeople93';
    setText(q('.jk-home-heading h2',people),'คนแถวนี้');
    setText(q('.jk-home-heading small',people),'ออนไลน์ก่อน · แตะเพื่อดูโปรไฟล์');
  }

  const ordered=[hero,way,intent,people].filter(Boolean);
  const keep=new Set(ordered);

  [...root.children].forEach(el=>{if(!keep.has(el))el.remove();});

  const visible=[...root.children].filter(el=>keep.has(el));
  const wrong=ordered.some((el,i)=>visible[i]!==el);
  if(wrong) ordered.forEach(el=>root.appendChild(el));
}

function run(){
  if(document.documentElement.dataset.jkUi!=='v93')document.documentElement.dataset.jkUi='v93';
  labelNav();simplifyHome();
  const s=q('#expressionBtnV28');
  if(s){
    if(s.textContent!=='☺')s.textContent='☺';
    if(s.getAttribute('aria-label')!=='สติ๊กเกอร์')s.setAttribute('aria-label','สติ๊กเกอร์');
    if(s.title!=='สติ๊กเกอร์')s.title='สติ๊กเกอร์';
  }
}
let queued=false;
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;run()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);
setTimeout(run,80);setTimeout(run,400);setTimeout(run,1200);
})();