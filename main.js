const SCREENS=['home','about','work','ai','contact'];
function showScreen(name,push=true){
 if(!SCREENS.includes(name))name='home';
 document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===name));
 document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===name));
 window.scrollTo({top:0,behavior:'smooth'});
 if(push&&location.hash!=='#'+name){try{history.pushState(null,'','#'+name)}catch(e){}}
}
window.addEventListener('popstate',()=>showScreen(location.hash.slice(1),false));
document.getElementById('year').textContent=new Date().getFullYear();

const chatMessages=document.getElementById('chatMessages');
const chatForm=document.getElementById('chatForm');
const chatInput=document.getElementById('chatInput');
const chatHistory=[];
function addBubble(text,role,extra=''){const el=document.createElement('div');el.className='bubble '+role+(extra?' '+extra:'');el.textContent=text;chatMessages.appendChild(el);chatMessages.scrollTop=chatMessages.scrollHeight;return el;}
function demoAnswer(q){
 const lower=q.toLowerCase();
 if(lower.includes('vmix')||lower.includes('livestream')||lower.includes('stream')) return `Let’s approach it step by step.

1. Confirm your source: camera, phone, or capture card.
2. In vMix, choose Add Input and confirm the camera preview is moving.
3. Check audio meters and monitor with headphones to avoid echo.
4. Open Settings → Streaming and configure the destination. Keep your stream key private.
5. Choose a resolution and bitrate your upload connection can sustain.
6. Run a private or unlisted test and check sound, sync, dropped frames and the platform preview.

Tell me your computer specs, upload speed, camera connection and whether you stream to Facebook, YouTube or both, and I’ll tailor the setup.

This is the built-in demo assistant until live AI is configured.`;
 if(lower.includes('premiere')||lower.includes('edit')) return `Here is a beginner-friendly Premiere Pro workflow:

1. Create a project and organize your media in folders.
2. Import footage using File → Import, or drag files into the Project panel.
3. Create a sequence that matches your footage.
4. Remove mistakes and dead space first.
5. Balance dialogue audio before adding music.
6. Correct exposure and white balance before applying a creative look.
7. Add readable captions and review on a phone-sized screen.
8. Export using H.264 with dimensions suited to your platform.

Tell me whether the video is for TikTok, Instagram, YouTube or an event screen for suitable export settings.`;
 if(lower.includes('audio')||lower.includes('lag')||lower.includes('delay')) return `Troubleshoot one thing at a time:

1. Identify whether the delay is in the audio source, vMix, or only the public stream.
2. Monitor locally with headphones.
3. Use one clean audio path and avoid feeding the same mixer signal twice.
4. Check the audio source in vMix; apply delay only after identifying which signal is early.
5. Check upload stability and dropped frames; reduce output settings for a test if needed.
6. Make a short test recording and compare speech with video.

What mixer, sound card or capture card, and vMix version are you using? Is the sound early or late?`;
 return `I can help with media production and livestreaming in practical steps.

1. Tell me what you want to achieve.
2. List the equipment and software you have.
3. Describe what is happening versus what you expected.
4. I’ll suggest a practical workflow that fits your setup and budget.

This is the built-in demo assistant. For live, adaptive AI answers, deploy the included backend and configure an OpenAI API key privately on the server.`;
}
async function askAI(message,history){
 const cfg=window.SITE_CONFIG||{};
 if(!cfg.SUPABASE_URL||cfg.SUPABASE_URL.includes('YOUR-PROJECT-REF'))throw new Error('AI backend not configured yet (see js/config.js)');
 const res=await fetch(cfg.SUPABASE_URL+'/functions/v1/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+cfg.SUPABASE_ANON_KEY,'apikey':cfg.SUPABASE_ANON_KEY},body:JSON.stringify({message,history})});
 if(!res.ok)throw new Error('AI backend error '+res.status);
 return (await res.json()).reply;
}
async function sendMessage(q){
 q=q.trim();if(!q)return;
 addBubble(q,'user');chatInput.value='';chatInput.disabled=true;document.getElementById('sendChat').disabled=true;
 const pending=addBubble('Preparing a practical answer…','assistant','typing');
 try{
  const answer=(await askAI(q,chatHistory.slice(-8)))||'I could not create an answer. Please try again.';
  pending.remove();addBubble(answer,'assistant');chatHistory.push({role:'user',content:q},{role:'assistant',content:answer});
 }catch(err){
  console.error('MediaIsrael AI:',err.message);
  pending.remove();addBubble(demoAnswer(q),'assistant');
 }finally{chatInput.disabled=false;document.getElementById('sendChat').disabled=false;chatInput.focus();}
}
chatForm.addEventListener('submit',e=>{e.preventDefault();sendMessage(chatInput.value);});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>sendMessage(b.dataset.prompt)));
document.getElementById('clearChat').addEventListener('click',()=>{chatMessages.innerHTML='';chatHistory.length=0;addBubble('Chat cleared. What media production question can I help with?','assistant');});

document.getElementById('bookingForm').addEventListener('submit',function(e){
 e.preventDefault();
 const d=new FormData(this);
 const subject=encodeURIComponent('Project enquiry — '+d.get('service'));
 const body=encodeURIComponent(
 'Hello MEDIA ISRAEL,\n\nI would like to discuss a project.\n\nName: '+d.get('name')+
 '\nEmail: '+d.get('email')+'\nService: '+d.get('service')+'\nBudget: '+(d.get('budget')||'Not specified')+
 '\nPreferred date: '+(d.get('date')||'Not specified')+'\nLocation: '+(d.get('location')||'Not specified')+
 '\n\nProject details:\n'+d.get('details')+'\n\nThank you.'
 );
 document.getElementById('formNotice').style.display='block';
 window.location.href='mailto:mediaisrael2007@gmail.com?subject='+subject+'&body='+body;
});

showScreen(location.hash.slice(1)||'home',false);

/* Gallery: photos & videos are listed in js/media.js */
(function(){
 const items=window.MEDIA_ITEMS||[];
 const grid=document.getElementById('gallery'),head=document.getElementById('galleryHead');
 if(!grid||!items.length)return;
 head.hidden=false;
 const PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
 items.forEach(it=>{
  const fig=document.createElement('figure');fig.className='gal-item';
  if(it.type==='video'){
   const wrap=document.createElement('div');wrap.className='vwrap';
   const v=document.createElement('video');v.src=it.src;v.controls=true;v.preload='none';v.playsInline=true;if(it.poster)v.poster=it.poster;if(it.ratio)v.style.aspectRatio=it.ratio;
   const b=document.createElement('button');b.type='button';b.className='vplay';b.setAttribute('aria-label','Play video');b.innerHTML=PLAY;
   b.addEventListener('click',()=>v.play());
   v.addEventListener('play',()=>{wrap.classList.add('playing');document.querySelectorAll('.vwrap video').forEach(o=>{if(o!==v)o.pause()})});
   v.addEventListener('pause',()=>{if(v.ended||v.currentTime===0)wrap.classList.remove('playing')});
   v.addEventListener('ended',()=>wrap.classList.remove('playing'));
   wrap.append(v,b);fig.appendChild(wrap);
  }else if(it.type==='youtube'){
   const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+it.id;f.allowFullscreen=true;f.loading='lazy';f.title=it.title||'Video';f.style.cssText='width:100%;aspect-ratio:16/9;border:0;display:block';fig.appendChild(f);
  }else{
   const im=document.createElement('img');im.src=it.src;im.alt=it.title||'';im.loading='lazy';im.addEventListener('click',()=>openLightbox(it));fig.appendChild(im);
  }
  if(it.title){const c=document.createElement('figcaption');c.textContent=it.title;c.style.cssText='padding:14px 18px;font-size:12px;color:var(--muted)';fig.appendChild(c);}
  grid.appendChild(fig);
 });
 function openLightbox(it){
  const box=document.createElement('div');box.className='lightbox';box.innerHTML='<img alt="">';box.firstChild.src=it.src;box.firstChild.alt=it.title||'';
  const close=()=>{box.remove();document.removeEventListener('keydown',esc)};const esc=e=>{if(e.key==='Escape')close()};
  box.addEventListener('click',close);document.addEventListener('keydown',esc);document.body.appendChild(box);
 }
})();
