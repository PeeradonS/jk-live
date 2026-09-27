(()=>{if(window.JK_PROD_UI_V94)return;window.JK_PROD_UI_V94=1;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const setText=(el,t)=>{if(el&&el.textContent!==t)el.textContent=t};
document.documentElement.dataset.jkUi='v94';

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

function setChatBadge(show){
  const b=q('.nav-btn[data-route="chat"]'); if(!b)return;
  let badge=q('.jk94-nav-badge',b);
  if(show&&!badge){badge=document.createElement('i');badge.className='jk94-nav-badge';badge.textContent='•';b.appendChild(badge);}
  if(!show&&badge) badge.remove();
}

function makeIntent(root,anchor){
  let box=q('#jkIntent94',root);
  if(!box){
    box=document.createElement('section');
    box.id='jkIntent94';box.className='jk-home-section';
    box.innerHTML='<div class="jk94-title"><small>วันนี้คุณเข้ามาเพราะอะไร</small><h2>เลือกตามจังหวะของคุณ</h2></div><div class="jk94-intents"><button class="active" data-jk94-intent="now">💬 คุยตอนนี้</button><button data-jk94-intent="relationship">♥ หาแฟน</button><button data-jk94-intent="friends">👋 หาเพื่อน</button><button data-jk94-intent="activities">☕ หากิจกรรม</button></div>';
    anchor?.after(box);
    qa('[data-jk94-intent]',box).forEach(b=>b.onclick=()=>{
      qa('[data-jk94-intent]',box).forEach(x=>x.classList.toggle('active',x===b));
      q('.nav-btn[data-route="people"]')?.click();
    });
  }
  return box;
}

function extractPeopleEngine(root){
  const engine=q('#peopleEngineV38',root);
  let incoming=q('#jkIncoming94',root), people=q('#jkPeople94',root);

  if(engine){
    const inbound=q('.jk-home-message-request-v52',engine);
    const recList=q('.jk-recommend-list-v54',engine);

    if(inbound&&!incoming){
      incoming=document.createElement('section');
      incoming.id='jkIncoming94';incoming.className='jk-home-section jk94-incoming';
      incoming.innerHTML='<div class="jk94-heading"><div><small>คนมาทักคุณ</small><h2>มีคนอยากคุยกับคุณ</h2><p>ข้อความจริงมาก่อนฟีเจอร์อื่นเสมอ</p></div><span>ตอบก่อน</span></div><div class="jk94-incoming-body"></div>';
      q('.jk94-incoming-body',incoming).appendChild(inbound);
      const accept=q('[data-request-action="accept"]',incoming);
      const profile=q('[data-request-profile-v38]',incoming);
      if(accept)setText(accept,'รับและเริ่มแชท');
      if(profile)setText(profile,'ดูโปรไฟล์ก่อน');
      setChatBadge(true);
    }

    if(recList&&!people){
      people=document.createElement('section');
      people.id='jkPeople94';people.className='jk-home-section jk94-people';
      people.innerHTML='<div class="jk94-heading"><div><small>พร้อมคุยตอนนี้</small><h2>คนที่น่าลองรู้จัก</h2><p>เรียงจากความพร้อม เจตนา และสิ่งที่มีร่วมกัน</p></div><button class="jk94-seeall" type="button">ดูทั้งหมด ›</button></div><div class="jk94-people-body"></div>';
      q('.jk94-people-body',people).appendChild(recList);
      q('.jk94-seeall',people).onclick=()=>q('.nav-btn[data-route="people"]')?.click();
      qa('[data-people-profile-v54]',people).forEach(b=>setText(b,'ดูแล้วทัก ›'));
    }
  }
  return {incoming,people};
}

function fallbackPeople(root){
  let people=q('#jkPeople94',root); if(people)return people;
  const old=qa('.jk-home-section',root).find(x=>q('.jk-people-rail',x));
  if(!old)return null;
  old.id='jkPeople94';old.classList.add('jk94-people');
  setText(q('.jk-home-heading h2',old),'คนแถวนี้');
  setText(q('.jk-home-heading small',old),'ออนไลน์ก่อน · แตะเพื่อดูโปรไฟล์');
  return old;
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
    setText(q('b',b),x[0]); if(b.dataset.socialMode!==x[1])b.dataset.socialMode=x[1];
  });
  const choose=q('.jk-choose-self-v27',way); if(choose)setText(q('b',choose),'เลือกคนใกล้ฉัน');

  const extracted=extractPeopleEngine(root);
  const intent=makeIntent(root,way);
  const people=extracted.people||fallbackPeople(root);
  const incoming=extracted.incoming||q('#jkIncoming94',root);

  const ordered=[hero,incoming,way,intent,people].filter(Boolean);
  const keep=new Set(ordered);
  [...root.children].forEach(el=>{if(!keep.has(el))el.remove();});
  const visible=[...root.children];
  const wrong=ordered.some((el,i)=>visible[i]!==el);
  if(wrong)ordered.forEach(el=>root.appendChild(el));
}

function prioritizeChatRequests(){
  const root=q('#page[data-route="chat"]'); if(!root)return;
  const stack=q('.request-stack',root);
  if(!stack){setChatBadge(false);return;}
  setChatBadge(true);
  let wrap=q('#jkIncomingChat94',root);
  if(!wrap){
    const oldHead=stack.previousElementSibling?.classList?.contains('section-head')?stack.previousElementSibling:null;
    wrap=document.createElement('section');wrap.id='jkIncomingChat94';wrap.className='jk94-chat-incoming';
    wrap.innerHTML='<div class="jk94-heading"><div><small>คนมาทักคุณ</small><h2>ตอบคนที่เข้ามาหาคุณก่อน</h2><p>บทสนทนาจริงมีค่ากว่าการไถหาคนเพิ่ม</p></div></div>';
    if(oldHead)oldHead.remove();
    wrap.appendChild(stack);
    const head=q('.v17-page-head',root);
    head?.after(wrap);
  }
  qa('[data-request-action="accept"]',wrap).forEach(b=>setText(b,'รับและเริ่มแชท'));
  qa('[data-request-profile-v38]',wrap).forEach(b=>setText(b,'ดูโปรไฟล์ก่อน'));
}

function optimizeProfileDecision(){
  const modal=q('#modalRoot'); if(!modal)return;
  const preview=q('.jk-profile-preview',modal); if(!preview||preview.dataset.jk94Done)return;
  preview.dataset.jk94Done='1';
  const primary=q('#exploreIntro',preview),opening=q('#exploreOpening',preview);
  if(primary)setText(primary,'💬 ส่งข้อความแรก');
  if(opening)setText(opening,'✦ ช่วยคิดประโยคเปิด');
  const actions=q('.jk-profile-actions',preview);
  if(actions&&!q('.jk94-profile-hint',preview)){
    const hint=document.createElement('div');hint.className='jk94-profile-hint';
    hint.innerHTML='<b>ตัดสินใจง่าย ๆ</b><span>ดูรูป · อ่านก่อนทัก · ดูสิ่งที่มีร่วมกัน แล้วค่อยส่งข้อความ</span>';
    actions.before(hint);
  }
}

function stickerFix(){
  const s=q('#expressionBtnV28'); if(!s)return;
  if(s.textContent!=='☺')s.textContent='☺';
  if(s.getAttribute('aria-label')!=='สติ๊กเกอร์')s.setAttribute('aria-label','สติ๊กเกอร์');
  if(s.title!=='สติ๊กเกอร์')s.title='สติ๊กเกอร์';
}

function run(){
  if(document.documentElement.dataset.jkUi!=='v94')document.documentElement.dataset.jkUi='v94';
  labelNav();simplifyHome();prioritizeChatRequests();optimizeProfileDecision();stickerFix();
}
let queued=false;
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;run()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);
setTimeout(run,80);setTimeout(run,400);setTimeout(run,1200);
})();