(()=>{if(window.JK_RUNTIME_V96)return;window.JK_RUNTIME_V96=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const ss=window.sessionStorage;
const setText=(el,t)=>{if(el&&el.textContent!==t)el.textContent=t};
document.documentElement.dataset.jkRuntime='v96';

function log(kind,meta={}){
  try{const k='jk_core_loop_v96',a=JSON.parse(localStorage.getItem(k)||'[]');a.push({kind,at:new Date().toISOString(),...meta});localStorage.setItem(k,JSON.stringify(a.slice(-160)))}catch{}
}
window.JKCoreLoopV96={events:()=>{try{return JSON.parse(localStorage.getItem('jk_core_loop_v96')||'[]')}catch{return[]}}};

function nav(route){
  if(typeof window.JKOpenRoute==='function'){window.JKOpenRoute(route);return}
  q('.jk-v17-nav .nav-btn[data-route="'+route+'"]')?.click();
}

function addIntent(root){
  let box=q('#jkIntent95',root);
  if(box)return box;
  box=document.createElement('section');box.id='jkIntent95';
  box.innerHTML='<small>วันนี้คุณเข้ามาเพราะอะไร</small><h2>เลือกตามจังหวะของคุณ</h2><div class="jk95-intents"><button data-jk95-intent="chat" class="active">คุยก่อน</button><button data-jk95-intent="relationship">หาแฟน</button><button data-jk95-intent="friends">หาเพื่อน</button><button data-jk95-intent="activities">หากิจกรรม</button></div>';
  qa('[data-jk95-intent]',box).forEach(b=>b.onclick=()=>{
    qa('[data-jk95-intent]',box).forEach(x=>x.classList.toggle('active',x===b));
    const key=b.dataset.jk95Intent;log('intent_select',{key});nav('people');
    setTimeout(()=>q('[data-intent="'+key+'"]',q('#page'))?.click(),160);
  });
  return box;
}

function home(){
  const root=q('#page');
  if(!root||root.dataset.route!=='discover')return;
  const hero=q('.jk-city-hero',root),people=q('#peopleEngineV38',root);
  if(!hero||!people)return;
  if(root.dataset.jk95Route!=='home')root.dataset.jk95Route='home';

  const copy=q('.jk-city-hero-copy',hero);
  if(copy){
    setText(q('small',copy),'● ออนไลน์ตอนนี้');
    setText(q('h1',copy),'คืนนี้อยากคุยกับใครสักคนไหม?');
    setText(q('p',copy),'เริ่มจากคนที่มีเหตุผลให้คุย หรือให้ JK พาไปเจอคนใหม่');
    const orbit=q('.jk-orbit-people',hero);if(orbit)orbit.remove();
    let a=q('#jk95HeroActions',copy);
    if(!a){
      a=document.createElement('div');a.id='jk95HeroActions';a.className='jk95-hero-actions';
      a.innerHTML='<button class="primary" id="jk95SeePeople">ดูคนที่น่าลองรู้จัก</button><button class="secondary" id="jk95RandomChat">สุ่มแชท</button>';
      copy.appendChild(a);
      q('#jk95SeePeople',a).onclick=()=>{log('home_people');people.scrollIntoView({behavior:'smooth',block:'start'})};
      q('#jk95RandomChat',a).onclick=()=>{
        log('home_random_text');
        const b=q('[data-social-mode="random_text"]',root);
        if(b)b.click(); else if(typeof window.openSocialMode==='function')window.openSocialMode('random_text'); else nav('people');
      };
    }
  }

  const ph=q('.jk-home-heading',people);
  setText(q('h2',ph),'คนที่น่าเริ่มคุยตอนนี้');
  setText(q('small',ph),'คัดจากความพร้อม ความสนใจ และสิ่งที่กำลังมองหา');
  const note=[...people.children].find(x=>x.classList?.contains('muted'));
  setText(note,'แตะดูโปรไฟล์ก่อน แล้วค่อยตัดสินใจทัก ไม่มีการบังคับ Match');

  const intent=addIntent(root);
  const way=q('.jk-way-section',root);
  if(way){
    setText(q('.jk-home-heading h2',way),'หรือให้ JK พาไปเจอคนใหม่');
    const modes=qa('.jk-random-mode-v27',way);
    [['ส่งแชท','random_text'],['สุ่มเสียง','random_voice'],['สุ่มวิดีโอ','random_video']].forEach((x,i)=>{
      const b=modes[i];if(!b)return;
      setText(q('b',b),x[0]);
      if(b.dataset.socialMode!==x[1])b.dataset.socialMode=x[1];
    });
    const choose=q('.jk-choose-self-v27',way);if(choose)setText(q('b',choose),'เลือกคนใกล้ฉัน');
  }

  const keep=new Set([hero,people,intent,way].filter(Boolean));
  [...root.children].forEach(el=>{if(!keep.has(el))el.remove()});
  const order=[hero,people,intent,way].filter(Boolean);
  const cur=[...root.children];
  if(order.some((el,i)=>cur[i]!==el))order.forEach(el=>root.appendChild(el));
}

function badge(){
  const b=q('.jk-v17-nav .nav-btn[data-route="chat"]');if(!b)return;
  const n=Math.max(0,Number(ss.getItem('jk95_requests')||0));
  let x=q('.jk95-chat-badge',b);
  if(!n){if(x)x.remove();return}
  if(!x){x=document.createElement('span');x.className='jk95-chat-badge';b.appendChild(x)}
  const t=String(Math.min(n,99));if(x.textContent!==t)x.textContent=t;
}

function chat(){
  const root=q('#page');
  if(!root||root.dataset.route!=='chat')return;
  const list=q('.jk-chatlist-v30',root);if(!list)return;
  if(root.dataset.jk95Route!=='chat')root.dataset.jk95Route='chat';
  const stack=q('.request-stack',root),count=stack?qa('.request-card',stack).length:0;
  if(ss.getItem('jk95_requests')!==String(count))ss.setItem('jk95_requests',String(count));
  badge();

  let banner=q('#jk95Incoming',root);
  if(!count){if(banner)banner.remove();return}
  if(!banner){
    banner=document.createElement('button');banner.id='jk95Incoming';banner.className='jk95-incoming-banner';
    banner.innerHTML='<span class="mark"></span><span class="grow"><b></b><small>ข้อความจริงอยู่ก่อนฟีด โปรโมชั่น และของขายเสมอ</small></span><strong>ดูเลย ›</strong>';
    banner.onclick=()=>{log('incoming_open',{count});stack.scrollIntoView({behavior:'smooth',block:'center'})};
  }
  const mark=q('.mark',banner);
  if(mark&&!mark.firstElementChild&&typeof window.JKIconV95==='function')mark.innerHTML=window.JKIconV95('chat');
  setText(q('b',banner),'มีคนมาทักคุณ '+count+' คน');
  const pageHead=q('.v17-page-head',root);
  if(pageHead&&pageHead.nextElementSibling!==banner)pageHead.after(banner);

  const heads=qa('.section-head',root);
  const h=heads.find(x=>/คำขอข้อความ|คนมาทัก/.test(x.textContent||''))||stack.previousElementSibling;
  if(h?.classList?.contains('section-head')){
    setText(q('h3',h),'คนมาทักคุณ');
    if(banner.nextElementSibling!==h)banner.after(h);
    if(h.nextElementSibling!==stack)h.after(stack);
  }
  qa('.request-card',stack).forEach(card=>{
    const accept=q('[data-request-action="accept"]',card);
    if(accept&&!accept.dataset.jkRuntime96){accept.dataset.jkRuntime96='1';accept.addEventListener('click',()=>log('request_accept'))}
  });
}

function profile(){
  const modal=q('#modalRoot'),box=q('.jk-profile-preview',modal);if(!modal||!box)return;
  if(!modal.classList.contains('jk95-profile-modal'))modal.classList.add('jk95-profile-modal');
  const actions=q('.jk-profile-actions',box)||q('.jk-profile-actions',modal);
  const bio=[...box.children].find(x=>x.tagName==='P');
  if(actions&&bio&&actions.previousElementSibling!==bio)bio.after(actions);
  const opening=q('#exploreOpening',modal);
  if(opening&&actions&&opening.previousElementSibling!==actions)actions.after(opening);
  const intro=q('#exploreIntro',modal);
  if(intro&&!intro.dataset.jkRuntime96){
    intro.dataset.jkRuntime96='1';
    intro.addEventListener('click',()=>log('profile_intro'));
  }
  if(actions&&!q('#jk95ProfileNote',modal)){
    const n=document.createElement('div');n.id='jk95ProfileNote';n.className='jk95-profile-note';
    n.textContent='ทักได้โดยไม่ต้อง Match · อีกฝ่ายเลือกตอบ ปฏิเสธ หรือบล็อกได้';
    opening?opening.after(n):actions.after(n);
  }
  const a=q('#profilePrivacyHintV34',modal);if(a)a.remove();
  const m=q('#profileMutualV53',modal);if(m)m.remove();
  if(!box.dataset.jkRuntime96){box.dataset.jkRuntime96='1';log('profile_open')}
}

function intro(){
  const form=q('#messageRequestForm');if(!form)return;
  const old=q('#priorityHelloV44',form);if(old)old.remove();
  const ta=q('textarea[name="body"]',form);if(!ta)return;
  const modal=q('#modalRoot');
  setText(q('.modal-head h3',modal),'ส่งข้อความแรก');
  setText(q('.modal-head .muted',modal),'ไม่ต้อง Match · อีกฝ่ายเป็นคนเลือกว่าจะตอบหรือไม่');
  if(!q('#jk95Starters',form)){
    const samples=['สวัสดี เห็นโปรไฟล์แล้วรู้สึกว่าน่าจะคุยกันได้ 🙂','แวะมาทักนะ วันนี้เป็นยังไงบ้าง?','ไม่ถนัดประโยคเปิดเท่าไหร่ แต่ตั้งใจมาทักจริง ๆ 😅'];
    const w=document.createElement('div');w.id='jk95Starters';w.className='jk95-starter-wrap';
    w.innerHTML='<small>ไม่รู้จะเริ่มยังไง แตะแล้วแก้ต่อได้</small><div class="jk95-starters">'+samples.map((x,i)=>'<button type="button" data-jk95-starter="'+i+'">'+x+'</button>').join('')+'</div>';
    ta.closest('.field')?.before(w);
    qa('[data-jk95-starter]',w).forEach((b,i)=>b.onclick=()=>{ta.value=samples[i];ta.focus();log('intro_starter',{i})});
  }
  if(!q('#jk95IntroHelp',form)){
    const d=document.createElement('div');d.id='jk95IntroHelp';d.className='jk95-intro-help';
    d.textContent='พูดถึงสิ่งที่เห็นในโปรไฟล์จริง จะต่อบทสนทนาได้ง่ายกว่าคำทักสั้น ๆ';
    ta.closest('.field')?.after(d);
  }
  const submit=q('button[type="submit"],button.btn.primary.full',form);
  setText(submit,'ส่งข้อความแรก');
  if(submit&&!submit.dataset.jkRuntime96){submit.dataset.jkRuntime96='1';submit.addEventListener('click',()=>log('intro_send_click'))}
}

function run(){
  badge();home();chat();profile();intro();
}
let scheduled=false;
const go=()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;run()})};
new MutationObserver(go).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);
setTimeout(run,80);setTimeout(run,350);setTimeout(run,900);
})();