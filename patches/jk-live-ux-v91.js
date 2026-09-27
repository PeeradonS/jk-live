(()=>{if(window.JK_LIVE_UX_V91)return;window.JK_LIVE_UX_V91=1;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
function setText(el,t){if(el&&el.textContent!==t)el.textContent=t}
function simplifyNav(){
 const nav=q('.jk-v17-nav'); if(!nav)return;
 const btn=qa('.nav-btn',nav); if(btn.length<5)return;
 const spec=[['discover','หน้าแรก'],['people','เจอกัน'],['stories','เล่า'],['chat','แชท'],['me','ฉัน']];
 btn.slice(0,5).forEach((b,i)=>{b.dataset.route=spec[i][0];const label=qa('span,b,small',b).find(x=>x.textContent&&x.textContent.trim());if(label&&label.children.length===0)setText(label,spec[i][1]);else{const nodes=[...b.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());if(nodes.length)nodes[nodes.length-1].textContent=spec[i][1]}});
}
function simplifyHome(){
 const hero=q('.jk-city-hero'); if(!hero)return;
 const c=q('.jk-city-hero-copy',hero); if(c){setText(q('small',c),'● ออนไลน์ตอนนี้');setText(q('h1',c),'คืนนี้อยากคุยกับใครสักคนไหม?');setText(q('p',c),'เลือกคนใกล้ ๆ หรือให้ JK พาคุณไปเจอคนที่พร้อมคุยตอนนี้')}
 const way=q('.jk-way-section');if(way){const h=q('.jk-home-heading h2',way);setText(h,'เริ่มคุยแบบไหนดี');const modes=qa('.jk-random-mode-v27',way);[['ส่งแชท','💬'],['สุ่มเสียง','🎧'],['สุ่มวิดีโอ','🎥']].forEach((x,i)=>{if(!modes[i])return;setText(q('b',modes[i]),x[0])})}
 const heads=qa('.jk-home-section .jk-home-heading h2');if(heads[0])setText(heads[0],'คนแถวนี้');
 if(!q('#jkIntent91')&&way){const s=document.createElement('section');s.id='jkIntent91';s.className='jk-home-section';s.innerHTML='<div class="jk-home-heading"><div><small>วันนี้คุณเข้ามาเพราะอะไร</small><h2>เลือกตามจังหวะของคุณ</h2></div></div><div class="jk91-intents"><button data-social-mode="now">💬 คุยตอนนี้</button><button data-social-mode="relationship">♥ หาแฟน</button><button data-social-mode="friends">👋 หาเพื่อน</button><button data-social-mode="activities">☕ หากิจกรรม</button></div>';const personSec=qa('.jk-home-section')[0];(personSec||way).after(s);qa('[data-social-mode]',s).forEach(b=>b.onclick=()=>{const existing=q('[data-social-mode="'+b.dataset.socialMode+'"]');if(existing&&existing!==b)existing.click();else q('.nav-btn[data-route="people"]')?.click()})}
}
function simplifyPeople(){
 const head=q('.discover-v17-head');if(!head)return;setText(q('small',head),'เจอกัน');setText(q('h1',head),'เลือกคนที่อยากรู้จัก');setText(q('p',head),'ดูคนใกล้คุณหรือคนที่กำลังออนไลน์ แล้วค่อยเปิดโปรไฟล์เมื่อมีใครสะดุดตา')}
function fixSticker(){const b=q('#expressionBtnV28');if(b){b.title='สติ๊กเกอร์';b.setAttribute('aria-label','สติ๊กเกอร์');if(!b.dataset.jk91){b.dataset.jk91='1';b.innerHTML='☺'}}}
function run(){simplifyNav();simplifyHome();simplifyPeople();fixSticker()}
new MutationObserver(()=>queueMicrotask(run)).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('DOMContentLoaded',run);setTimeout(run,250);setTimeout(run,1000)})();