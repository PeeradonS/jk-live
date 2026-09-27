(()=>{if(window.JK_CORE_LOOP_V94)return;window.JK_CORE_LOOP_V94=1;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const store=window.sessionStorage;
document.documentElement.dataset.jkUi='v94';

function log(kind,meta={}){
  try{
    const key='jk_core_loop_v94';
    const a=JSON.parse(localStorage.getItem(key)||'[]');
    a.push({kind,at:new Date().toISOString(),...meta});
    localStorage.setItem(key,JSON.stringify(a.slice(-120)));
  }catch{}
}
window.JKCoreLoopV94={events:()=>{try{return JSON.parse(localStorage.getItem('jk_core_loop_v94')||'[]')}catch{return[]}}};

function nav(route){q('.jk-v17-nav .nav-btn[data-route="'+route+'"]')?.click()}

function paintChatBadge(){
  const navBtn=q('.jk-v17-nav .nav-btn[data-route="chat"]');if(!navBtn)return;
  const n=Math.max(0,Number(store.getItem('jk_v94_request_count')||0));
  let b=q('.jk94-chat-badge',navBtn);
  if(!n){b?.remove();return}
  if(!b){b=document.createElement('span');b.className='jk94-chat-badge';navBtn.appendChild(b)}
  b.textContent=String(Math.min(n,99));
}

function enhanceHome(){
  const root=q('#page[data-route="discover"]');if(!root)return;
  const hero=q('.jk-city-hero',root),copy=q('.jk-city-hero-copy',hero);
  const people=q('#jkPeople93',root),intent=q('#jkIntent93',root),way=q('.jk-way-section',root);
  if(!hero||!copy||!people||!way)return;

  let actions=q('#jk94HeroActions',copy);
  if(!actions){
    actions=document.createElement('div');actions.id='jk94HeroActions';actions.className='jk94-hero-actions';
    actions.innerHTML='<button class="primary" id="jk94GoPeople">ดูคนที่น่าเริ่มคุย</button><button class="secondary" id="jk94RandomText">สุ่มแชท</button>';
    copy.appendChild(actions);
    q('#jk94GoPeople',actions).onclick=()=>{log('home_people');nav('people')};
    q('#jk94RandomText',actions).onclick=()=>{log('home_random_text');q('[data-social-mode="random_text"]',way)?.click()};
  }

  const cards=qa('.jk-person-peek',people);
  const online=cards.filter(c=>/ออนไลน์/.test(c.textContent||''));
  cards.forEach(c=>c.classList.toggle('jk94-online',/ออนไลน์/.test(c.textContent||'')));
  const pbtn=q('#jk94GoPeople',actions);
  if(pbtn)pbtn.textContent=online.length?('ดู '+online.length+' คนออนไลน์'):'ดูคนที่น่าเริ่มคุย';

  const heading=q('.jk-home-heading',people);
  if(heading){
    const h=q('h2',heading),sm=q('small',heading);
    if(h)h.textContent='คนที่น่าเริ่มคุยตอนนี้';
    if(sm)sm.textContent='ออนไลน์แสดงเฉพาะเมื่อมีสถานะจริง';
    if(!q('#jk94SeeAllPeople',heading)){
      const b=document.createElement('button');b.id='jk94SeeAllPeople';b.textContent='ดูทั้งหมด ›';
      b.onclick=()=>{log('home_people_all');nav('people')};heading.appendChild(b);
    }
  }

  const wh=q('.jk-home-heading h2',way);if(wh)wh.textContent='หรือให้ JK พาไปเจอคนใหม่';

  const desired=[hero,people,intent,way].filter(Boolean);
  const visible=[...root.children];
  if(desired.some((el,i)=>visible[i]!==el))desired.forEach(el=>root.appendChild(el));
}

function requestSectionHead(stack,root){
  let prev=stack?.previousElementSibling;
  if(prev?.classList?.contains('section-head'))return prev;
  const heads=qa('.section-head',root);
  return heads.find(h=>/คำขอ|มาทัก/.test(h.textContent||''))||null;
}

function enhanceChat(){
  const root=q('#page[data-route="chat"]');if(!root)return;
  const stack=q('.request-stack',root);
  const count=stack?qa('.request-card',stack).length:0;
  store.setItem('jk_v94_request_count',String(count));
  paintChatBadge();

  const old=q('#jk94IncomingBanner',root);
  if(!count){old?.remove();return}

  const head=requestSectionHead(stack,root);
  if(head){head.classList.add('jk94-requests-head');const h=q('h3',head);if(h)h.textContent='คนมาทักคุณ'}

  let banner=old;
  if(!banner){
    banner=document.createElement('button');banner.id='jk94IncomingBanner';banner.className='jk94-incoming-banner';
    const pageHead=q('.v17-page-head',root);
    pageHead?.after(banner);
    banner.onclick=()=>{log('incoming_banner_open',{count});stack.scrollIntoView({behavior:'smooth',block:'center'})};
  }
  banner.innerHTML='<span class="mark">💬</span><span class="grow"><b>มีคนอยากคุยกับคุณ '+count+' คน</b><small>ข้อความจากคนจริงอยู่ก่อนฟีดและโปรโมชั่นเสมอ</small></span><strong>ดูเลย ›</strong>';

  const search=q('.jk-chat-search-v30',root);
  if(head&&stack&&search){
    banner.after(head);head.after(stack);stack.after(search);
  }

  qa('.request-card',stack).forEach(card=>{
    const accept=q('[data-request-action="accept"]',card);
    if(accept&&!accept.dataset.jk94Tracked){accept.dataset.jk94Tracked='1';accept.addEventListener('click',()=>log('request_accept'))}
    const profile=q('[data-request-profile-v38]',card);
    if(profile&&!profile.dataset.jk94Tracked){profile.dataset.jk94Tracked='1';profile.addEventListener('click',()=>log('request_profile'))}
  });
}

function enhanceProfileModal(){
  const modal=q('#modalRoot');if(!modal)return;
  const box=q('.jk-profile-preview',modal);if(!box)return;
  modal.classList.add('jk94-profile-modal');
  const actions=q('.jk-profile-actions',box)||q('.jk-profile-actions',modal);
  const bio=[...box.children].find(x=>x.tagName==='P');
  if(actions&&bio&&actions.previousElementSibling!==bio)bio.after(actions);
  const opening=q('#exploreOpening',modal);
  if(opening&&actions&&opening.previousElementSibling!==actions)actions.after(opening);
  const primary=q('#exploreIntro',modal);
  if(primary){primary.textContent='💬 ทักเลย';if(!primary.dataset.jk94Tracked){primary.dataset.jk94Tracked='1';primary.addEventListener('click',()=>log('profile_intro'))}}
  if(opening&&!opening.dataset.jk94Tracked){opening.dataset.jk94Tracked='1';opening.addEventListener('click',()=>log('profile_starter'))}
  if(actions&&!q('#jk94ProfileNote',modal)){
    const n=document.createElement('div');n.id='jk94ProfileNote';n.className='jk94-profile-note';
    n.textContent='ทักได้โดยไม่ต้อง Match · อีกฝ่ายเลือกตอบ ปฏิเสธ หรือบล็อกได้';
    opening?opening.after(n):actions.after(n);
  }
  q('#profilePrivacyHintV34',modal)?.remove();
  q('#profileMutualV53',modal)?.remove();
  if(!box.dataset.jk94Open){box.dataset.jk94Open='1';log('profile_open')}
}

function enhanceIntro(){
  const form=q('#messageRequestForm');if(!form)return;
  q('#priorityHelloV44',form)?.remove();
  const textarea=q('textarea[name="body"]',form);if(!textarea)return;
  const modal=form.closest('#modalRoot')||q('#modalRoot');
  const title=q('.modal-head h3',modal),muted=q('.modal-head .muted',modal);
  if(title)title.textContent='ส่งข้อความแรก';
  if(muted)muted.textContent='ไม่ต้อง Match · อีกฝ่ายเป็นคนเลือกว่าจะตอบหรือไม่';

  if(!q('#jk94StarterWrap',form)){
    const wrap=document.createElement('div');wrap.id='jk94StarterWrap';wrap.className='jk94-starter-wrap';
    const samples=[
      'สวัสดี เห็นโปรไฟล์แล้วรู้สึกว่าน่าจะคุยกันได้ 🙂',
      'แวะมาทักนะ วันนี้เป็นยังไงบ้าง?',
      'ไม่ถนัดประโยคเปิดเท่าไหร่ แต่ตั้งใจมาทักจริง ๆ 😅'
    ];
    wrap.innerHTML='<small>ไม่รู้จะเริ่มยังไง ลองแตะประโยคแล้วแก้ต่อได้</small><div class="jk94-starters">'+samples.map((x,i)=>'<button type="button" data-jk94-starter="'+i+'">'+x+'</button>').join('')+'</div>';
    textarea.closest('.field')?.before(wrap);
    qa('[data-jk94-starter]',wrap).forEach((b,i)=>b.onclick=()=>{textarea.value=samples[i];textarea.focus();log('intro_starter',{i})});
  }
  if(!q('#jk94IntroHelp',form)){
    const help=document.createElement('div');help.id='jk94IntroHelp';help.className='jk94-intro-help';
    help.textContent='ข้อความที่พูดถึงสิ่งที่เห็นในโปรไฟล์จริง มักชวนให้ตอบต่อได้ง่ายกว่าคำทักสั้น ๆ';
    textarea.closest('.field')?.after(help);
  }
  const submit=q('button[type="submit"],button.btn.primary.full',form);
  if(submit){submit.textContent='ส่งข้อความแรก';if(!submit.dataset.jk94Tracked){submit.dataset.jk94Tracked='1';submit.addEventListener('click',()=>log('intro_send_click'))}}
  if(!form.dataset.jk94Open){form.dataset.jk94Open='1';log('intro_open');setTimeout(()=>textarea.focus(),80)}
}

function trackChatOpen(){
  const root=q('#page');
  if(!root)return;
  if(root.dataset.route==='chat-detail'&&!root.dataset.jk94ChatOpen){root.dataset.jk94ChatOpen='1';log('chat_open')}
}

function run(){
  document.documentElement.dataset.jkUi='v94';
  paintChatBadge();enhanceHome();enhanceChat();enhanceProfileModal();enhanceIntro();trackChatOpen();
}
let queued=false;const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;run()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);setTimeout(run,120);setTimeout(run,600);setTimeout(run,1400);
})();