(()=>{if(window.JK_RUNTIME_V95)return;window.JK_RUNTIME_V95=1;
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const ss=window.sessionStorage;
document.documentElement.dataset.jkRuntime='v95';

function log(kind,meta={}){
  try{const k='jk_core_loop_v95',a=JSON.parse(localStorage.getItem(k)||'[]');a.push({kind,at:new Date().toISOString(),...meta});localStorage.setItem(k,JSON.stringify(a.slice(-160)))}catch{}
}
window.JKCoreLoopV95={events:()=>{try{return JSON.parse(localStorage.getItem('jk_core_loop_v95')||'[]')}catch{return[]}}};

function nav(route){
  const b=q('.jk-v17-nav .nav-btn[data-route="'+route+'"]');if(b)b.click();
}
function forceNav(){
  const nav=q('.jk-v17-nav');if(!nav)return;
  const spec=[['discover','หน้าแรก'],['people','เจอกัน'],['stories','เล่า'],['chat','แชท'],['me','ฉัน']];
  const btns=qa('.nav-btn',nav).slice(0,5);
  if(btns.length<5)return;
  btns.forEach((b,i)=>{
    b.dataset.route=spec[i][0];
    const spans=[...b.children].filter(x=>x.tagName==='SPAN'&&!x.querySelector('svg'));
    const label=spans[spans.length-1];if(label&&label.textContent!==spec[i][1])label.textContent=spec[i][1];
    b.setAttribute('aria-label',spec[i][1]);
  });
}

function addIntent(root){
  let box=q('#jkIntent95',root);
  if(box)return box;
  box=document.createElement('section');box.id='jkIntent95';
  box.innerHTML='<small>วันนี้คุณเข้ามาเพราะอะไร</small><h2>เลือกตามจังหวะของคุณ</h2><div class="jk95-intents"><button data-jk95-intent="chat" class="active">💬 คุยก่อน</button><button data-jk95-intent="relationship">♥ หาแฟน</button><button data-jk95-intent="friends">👋 หาเพื่อน</button><button data-jk95-intent="activities">☕ หากิจกรรม</button></div>';
  qa('[data-jk95-intent]',box).forEach(b=>b.onclick=()=>{
    qa('[data-jk95-intent]',box).forEach(x=>x.classList.toggle('active',x===b));
    const key=b.dataset.jk95Intent;log('intent_select',{key});nav('people');
    setTimeout(()=>q('[data-intent="'+key+'"]',q('#page'))?.click(),120);
    setTimeout(()=>q('[data-intent="'+key+'"]',q('#page'))?.click(),500);
  });
  return box;
}

function home(){
  const root=q('#page'),hero=q('.jk-city-hero',root),people=q('#peopleEngineV38',root);
  if(!root||!hero||!people)return;
  root.dataset.jk95Route='home';

  const copy=q('.jk-city-hero-copy',hero);
  if(copy){
    const small=q('small',copy),h=q('h1',copy),p=q('p',copy);
    if(small)small.textContent='● ออนไลน์ตอนนี้';
    if(h)h.textContent='คืนนี้อยากคุยกับใครสักคนไหม?';
    if(p)p.textContent='เริ่มจากคนที่มีเหตุผลให้คุย หรือให้ JK พาไปเจอคนใหม่';
    q('.jk-orbit-people',hero)?.remove();
    if(!q('#jk95HeroActions',copy)){
      const a=document.createElement('div');a.id='jk95HeroActions';a.className='jk95-hero-actions';
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

  const ph=q('.jk-home-heading',people),ph2=q('h2',ph),ps=q('small',ph);
  if(ph2)ph2.textContent='คนที่น่าเริ่มคุยตอนนี้';
  if(ps)ps.textContent='คัดจากความพร้อม ความสนใจ และสิ่งที่กำลังมองหา';
  const note=[...people.children].find(x=>x.classList?.contains('muted'));if(note)note.textContent='แตะดูโปรไฟล์ก่อน แล้วค่อยตัดสินใจทัก ไม่มีการบังคับ Match';

  let intent=addIntent(root);
  let way=q('.jk-way-section',root);
  if(way){
    const wh=q('.jk-home-heading h2',way);if(wh)wh.textContent='หรือให้ JK พาไปเจอคนใหม่';
    const modes=qa('.jk-random-mode-v27',way);
    [['ส่งแชท','random_text'],['สุ่มเสียง','random_voice'],['สุ่มวิดีโอ','random_video']].forEach((x,i)=>{
      const b=modes[i];if(!b)return;const t=q('b',b);if(t)t.textContent=x[0];b.dataset.socialMode=x[1];
    });
    const choose=q('.jk-choose-self-v27',way);if(choose){const b=q('b',choose);if(b)b.textContent='เลือกคนใกล้ฉัน'}
  }

  const keep=new Set([hero,people,intent,way].filter(Boolean));
  [...root.children].forEach(el=>{if(!keep.has(el))el.remove()});
  const order=[hero,people,intent,way].filter(Boolean),cur=[...root.children];
  if(order.some((el,i)=>cur[i]!==el))order.forEach(el=>root.appendChild(el));
}

function badge(){
  const b=q('.jk-v17-nav .nav-btn[data-route="chat"]');if(!b)return;
  const n=Math.max(0,Number(ss.getItem('jk95_requests')||0));
  let x=q('.jk95-chat-badge',b);
  if(!n){x?.remove();return}
  if(!x){x=document.createElement('span');x.className='jk95-chat-badge';b.appendChild(x)}
  x.textContent=String(Math.min(n,99));
}
function chat(){
  const root=q('#page'),list=q('.jk-chatlist-v30',root);if(!root||!list)return;
  root.dataset.jk95Route='chat';
  const stack=q('.request-stack',root),count=stack?qa('.request-card',stack).length:0;
  ss.setItem('jk95_requests',String(count));badge();
  q('#jk95Incoming',root)?.remove();
  if(!count)return;
  const banner=document.createElement('button');banner.id='jk95Incoming';banner.className='jk95-incoming-banner';
  banner.innerHTML='<span class="mark">💬</span><span class="grow"><b>มีคนมาทักคุณ '+count+' คน</b><small>ข้อความจริงอยู่ก่อนฟีด โปรโมชั่น และของขายเสมอ</small></span><strong>ดูเลย ›</strong>';
  const pageHead=q('.v17-page-head',root);pageHead?.after(banner);
  banner.onclick=()=>{log('incoming_open',{count});stack.scrollIntoView({behavior:'smooth',block:'center'})};
  const heads=qa('.section-head',root),h=heads.find(x=>/คำขอข้อความ|คนมาทัก/.test(x.textContent||''))||stack.previousElementSibling;
  if(h?.classList?.contains('section-head')){const t=q('h3',h);if(t)t.textContent='คนมาทักคุณ';banner.after(h);h.after(stack)}
  qa('.request-card',stack).forEach(card=>{
    const accept=q('[data-request-action="accept"]',card);if(accept&&!accept.dataset.jk95){accept.dataset.jk95='1';accept.addEventListener('click',()=>log('request_accept'))}
  });
}

function profile(){
  const modal=q('#modalRoot'),box=q('.jk-profile-preview',modal);if(!modal||!box)return;
  modal.classList.add('jk95-profile-modal');
  const actions=q('.jk-profile-actions',box)||q('.jk-profile-actions',modal),bio=[...box.children].find(x=>x.tagName==='P');
  if(actions&&bio&&actions.previousElementSibling!==bio)bio.after(actions);
  const opening=q('#exploreOpening',modal);if(opening&&actions&&opening.previousElementSibling!==actions)actions.after(opening);
  const intro=q('#exploreIntro',modal);if(intro){intro.textContent='💬 ทักเลย';if(!intro.dataset.jk95){intro.dataset.jk95='1';intro.addEventListener('click',()=>log('profile_intro'))}}
  if(actions&&!q('#jk95ProfileNote',modal)){
    const n=document.createElement('div');n.id='jk95ProfileNote';n.className='jk95-profile-note';n.textContent='ทักได้โดยไม่ต้อง Match · อีกฝ่ายเลือกตอบ ปฏิเสธ หรือบล็อกได้';
    opening?opening.after(n):actions.after(n);
  }
  q('#profilePrivacyHintV34',modal)?.remove();q('#profileMutualV53',modal)?.remove();
  if(!box.dataset.jk95){box.dataset.jk95='1';log('profile_open')}
}

function intro(){
  const form=q('#messageRequestForm');if(!form)return;
  q('#priorityHelloV44',form)?.remove();
  const ta=q('textarea[name="body"]',form);if(!ta)return;
  const modal=q('#modalRoot'),title=q('.modal-head h3',modal),muted=q('.modal-head .muted',modal);
  if(title)title.textContent='ส่งข้อความแรก';if(muted)muted.textContent='ไม่ต้อง Match · อีกฝ่ายเป็นคนเลือกว่าจะตอบหรือไม่';
  if(!q('#jk95Starters',form)){
    const samples=['สวัสดี เห็นโปรไฟล์แล้วรู้สึกว่าน่าจะคุยกันได้ 🙂','แวะมาทักนะ วันนี้เป็นยังไงบ้าง?','ไม่ถนัดประโยคเปิดเท่าไหร่ แต่ตั้งใจมาทักจริง ๆ 😅'];
    const w=document.createElement('div');w.id='jk95Starters';w.className='jk95-starter-wrap';
    w.innerHTML='<small>ไม่รู้จะเริ่มยังไง แตะแล้วแก้ต่อได้</small><div class="jk95-starters">'+samples.map((x,i)=>'<button type="button" data-jk95-starter="'+i+'">'+x+'</button>').join('')+'</div>';
    ta.closest('.field')?.before(w);
    qa('[data-jk95-starter]',w).forEach((b,i)=>b.onclick=()=>{ta.value=samples[i];ta.focus();log('intro_starter',{i})});
  }
  if(!q('#jk95IntroHelp',form)){const d=document.createElement('div');d.id='jk95IntroHelp';d.className='jk95-intro-help';d.textContent='พูดถึงสิ่งที่เห็นในโปรไฟล์จริง จะต่อบทสนทนาได้ง่ายกว่าคำทักสั้น ๆ';ta.closest('.field')?.after(d)}
  const submit=q('button[type="submit"],button.btn.primary.full',form);if(submit){submit.textContent='ส่งข้อความแรก';if(!submit.dataset.jk95){submit.dataset.jk95='1';submit.addEventListener('click',()=>log('intro_send_click'))}}
}

function run(){
  document.documentElement.dataset.jkRuntime='v95';forceNav();badge();home();chat();profile();intro();
}
let scheduled=false;const go=()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;run()})};
new MutationObserver(go).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);setTimeout(run,80);setTimeout(run,350);setTimeout(run,900);setTimeout(run,1800);
})();