(()=>{if(window.JK_ICON_SYSTEM_V95)return;window.JK_ICON_SYSTEM_V95=1;

const ICONS={
  home:{
    fill:'<path d="M4.5 10.8 12 4l7.5 6.8v8.1a1.6 1.6 0 0 1-1.6 1.6H6.1a1.6 1.6 0 0 1-1.6-1.6Z"/>',
    line:'<path d="M3.8 11.2 12 3.8l8.2 7.4"/><path d="M6.1 10.1v9.3h11.8v-9.3"/><path d="M9.6 19.4v-5.3h4.8v5.3"/>'
  },
  meet:{
    fill:'<circle cx="12" cy="12" r="8.4"/>',
    line:'<circle cx="12" cy="12" r="8.4"/><path d="m14.9 9.1-1.8 4-4 1.8 1.8-4Z"/><circle cx="12" cy="12" r=".7"/>'
  },
  story:{
    fill:'<path d="M5 5.2h14v11.4a2.8 2.8 0 0 1-2.8 2.8H8.6L5 21v-3.8Z"/>',
    line:'<path d="M5 5.2h14v11.4a2.8 2.8 0 0 1-2.8 2.8H8.6L5 21v-3.8Z"/><path d="M8.2 12h1.3l1-3.1 1.8 6.1 1.2-4h2.3"/>'
  },
  chat:{
    fill:'<path d="M4 5.4h16v11.2a2.5 2.5 0 0 1-2.5 2.5H9L4.4 21l1-3.7A2.5 2.5 0 0 1 4 15Z"/>',
    line:'<path d="M5.3 17.2 4 20.7l4-1.6h9a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v6a4.8 4.8 0 0 0 1.3 3.2Z"/><path d="M8 10.5h8M8 14h5"/>'
  },
  user:{
    fill:'<circle cx="12" cy="8.1" r="4.1"/><path d="M4.7 20.3c.7-4.2 3.1-6.3 7.3-6.3s6.6 2.1 7.3 6.3Z"/>',
    line:'<circle cx="12" cy="8" r="3.8"/><path d="M4.7 20c.7-4 3.1-6 7.3-6s6.6 2 7.3 6"/>'
  },
  bell:{line:'<path d="M6.5 16.8h11l-1.3-2.2V10a4.2 4.2 0 0 0-8.4 0v4.6Z"/><path d="M10 19.5h4"/>'},
  share:{line:'<circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8.1 10.9 7.8-4.7M8.1 13.1l7.8 4.7"/>'},
  message:{line:'<path d="M4.5 5.5h15v10.8a2.2 2.2 0 0 1-2.2 2.2H9l-4.5 2v-4.2Z"/><path d="M8 10h8M8 13.5h5.2"/>'},
  voice:{line:'<path d="M4.5 13v-2M8 16V8M12 19V5M16 16V8M19.5 13v-2"/>'},
  video:{line:'<rect x="3.5" y="6" width="12.5" height="12" rx="3"/><path d="m16 10 4.5-2.5v9L16 14Z"/>'},
  nearby:{line:'<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="2.8"/><path d="M12 3.8v2M20.2 12h-2M12 20.2v-2M3.8 12h2"/>'},
  phone:{line:'<path d="M7.2 4.2 4.9 6.5c-.7.7-.8 1.9-.3 2.8 2.3 4.4 5.7 7.8 10.1 10.1.9.5 2.1.4 2.8-.3l2.3-2.3-4-3-2 2c-2.4-1.2-4.4-3.2-5.6-5.6l2-2Z"/>'},
  more:{line:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>'},
  plus:{line:'<path d="M12 5v14M5 12h14"/>'},
  sticker:{line:'<path d="M5 4.5h14v10.2L13.7 20H5Z"/><path d="M13.5 20v-5.5H19"/><path d="M8.4 9.5h.01M15.6 9.5h.01M9.2 12.8c.8 1 1.7 1.5 2.8 1.5s2-.5 2.8-1.5"/>'},
  mic:{line:'<rect x="9" y="3.2" width="6" height="11" rx="3"/><path d="M6.3 11.3a5.7 5.7 0 0 0 11.4 0M12 17v3.8M9.4 20.8h5.2"/>'},
  send:{
    fill:'<path d="m4.3 4.2 16.1 7.3c.5.2.5.8 0 1L4.3 19.8l2.4-7.7Z"/>',
    line:'<path d="m4 4 17 8-17 8 2.8-8Z"/><path d="M7 12h13.5"/>'
  },
  back:{line:'<path d="m14.5 5-7 7 7 7"/>'},
  close:{line:'<path d="m6 6 12 12M18 6 6 18"/>'},
  edit:{line:'<path d="m5 19 3.6-.7L19 7.9 16.1 5 5.7 15.4Z"/><path d="m14.8 6.3 2.9 2.9"/>'},
  spark:{line:'<path d="m12 3.5 1.4 4 4.1 1.5-4.1 1.5-1.4 4-1.4-4L6.5 9l4.1-1.5Z"/><path d="m18.5 14.5.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/>'},
  connection:{line:'<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3.8 19c.6-3.1 2-4.7 4.2-4.7 1.8 0 3.1 1 4 3M12 17.3c.9-2 2.2-3 4-3 2.2 0 3.6 1.6 4.2 4.7"/>'},
  checkChat:{line:'<path d="M4.5 5.5h15v10.7a2.3 2.3 0 0 1-2.3 2.3H9l-4.5 2v-4.3Z"/><path d="m8.3 11.8 2.2 2.2 5.2-5.2"/>'},
  profile:{line:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.8 3-5.7 7-5.7s6.3 1.9 7 5.7"/>'},
  block:{line:'<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>'},
  shield:{line:'<path d="M12 3.5 19 6v5.2c0 4.4-2.5 7.4-7 9.3-4.5-1.9-7-4.9-7-9.3V6Z"/><path d="m9 12 2 2 4-4"/>'},
  chevronRight:{line:'<path d="m9 5 7 7-7 7"/>'}
};

function svg(name,opts={}){
  const d=ICONS[name]||ICONS.more;
  const fill=d.fill?'<g class="jk95-icon-fill">'+d.fill+'</g>':'';
  const line='<g class="jk95-icon-line">'+(d.line||'')+'</g>';
  const cls=['jk95-icon',opts.className||''].filter(Boolean).join(' ');
  return '<svg class="'+cls+'" data-jk95="'+name+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+fill+line+'</svg>';
}

function setIcon(target,name,mode='replace'){
  if(!target)return;
  if(target.dataset.jk95Icon===name)return;
  target.dataset.jk95Icon=name;
  if(mode==='inner') target.innerHTML=svg(name);
  else{
    const old=target.querySelector(':scope > svg, :scope > .jk-line-icon, :scope > .jk-top-icon-v25');
    if(old){
      const t=document.createElement('template');t.innerHTML=svg(name);old.replaceWith(t.content.firstElementChild);
    }else target.insertAdjacentHTML('afterbegin',svg(name));
  }
}

function iconTextButton(btn,name,label){
  if(!btn)return;
  const key=name+'|'+label;
  if(btn.dataset.jk95Button===key)return;
  btn.dataset.jk95Button=key;
  btn.classList.add('jk95-with-icon');
  btn.innerHTML=svg(name)+'<span>'+label+'</span>';
}

function nav(){
  const map={discover:'home',people:'meet',stories:'story',chat:'chat',me:'user'};
  document.querySelectorAll('.jk-v17-nav .nav-btn').forEach(b=>{
    const name=map[b.dataset.route]||'home';
    setIcon(b,name);
  });
}

function header(){
  const n=document.querySelector('#notificationBtn .jk-top-icon-v25');
  if(n)setIcon(n,'bell','inner');
  const s=document.querySelector('#inviteBtn .jk-top-icon-v25');
  if(s)setIcon(s,'share','inner');
  document.querySelectorAll('.jk-edit-icon-btn').forEach(b=>setIcon(b,'edit','inner'));
}

function home(){
  document.querySelectorAll('.jk-random-mode-v27').forEach(b=>{
    const k=b.dataset.socialMode;
    const name=k==='random_voice'?'voice':k==='random_video'?'video':'message';
    const t=b.querySelector('.jk-random-icon-v27');
    if(t)setIcon(t,name,'inner');
  });
  const near=document.querySelector('.jk-choose-icon-v27');
  if(near)setIcon(near,'nearby','inner');

  document.querySelectorAll('[data-request-action="accept"]').forEach(b=>iconTextButton(b,'checkChat','รับและเริ่มแชท'));
  document.querySelectorAll('[data-request-profile-v38]').forEach(b=>iconTextButton(b,'profile','ดูโปรไฟล์ก่อน'));
}

function chat(){
  setIcon(document.querySelector('#voiceCallBtn'),'phone','inner');
  setIcon(document.querySelector('#videoCallBtn'),'video','inner');
  setIcon(document.querySelector('#chatMenu'),'more','inner');
  setIcon(document.querySelector('#pairSpaceBtnV29'),'connection','inner');
  setIcon(document.querySelector('#backChat'),'back','inner');

  setIcon(document.querySelector('#attachBtn'),'plus','inner');
  setIcon(document.querySelector('#expressionBtnV28'),'sticker','inner');
  setIcon(document.querySelector('#voiceNoteBtnV28'),'mic','inner');
  setIcon(document.querySelector('#composer .composer-send'),'send','inner');
}

function profile(){
  const intro=document.querySelector('#exploreIntro');
  if(intro)iconTextButton(intro,'message','ส่งข้อความแรก');
  const opening=document.querySelector('#exploreOpening');
  if(opening)iconTextButton(opening,'spark','ช่วยคิดประโยคเปิด');
}

function modals(){
  document.querySelectorAll('#modalRoot button.close,[data-close].close').forEach(b=>setIcon(b,'close','inner'));
  document.querySelectorAll('.back-btn').forEach(b=>setIcon(b,'back','inner'));
}

function markIconButtons(){
  document.querySelectorAll('#notificationBtn,#inviteBtn,.chat-call-btn,.more-btn,.back-btn,.jk-edit-icon-btn,.composer-plus,.jk-expression-btn-v28,.composer-voice,.composer-send,#pairSpaceBtnV29,#modalRoot button.close')
    .forEach(b=>b.classList.add('jk95-icon-btn'));
}

function run(){
  nav();header();home();chat();profile();modals();markIconButtons();
  document.documentElement.dataset.jkIcons='v95';
}
let queued=false;
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;run()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',run);
setTimeout(run,100);setTimeout(run,500);setTimeout(run,1400);
window.JKIconV95=(name)=>svg(name);
})();