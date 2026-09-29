/* ===== GIF TEMPLATE — EDIT THESE =====
   1. Put your GIF files in the "gifs" folder next to index.html.
   2. Change the file names below (or keep the defaults).
   Each GIF is shown FULL SCREEN when its ending happens:
   jackpot    = player ends with the ₱1,000,000 briefcase
   dealWin    = player accepts the Banker's deal and still wins (>= WIN_MIN)
   win        = player wins ( >= WIN_MIN ) by keep/swap, but not the jackpot
   lose       = player ends below WIN_MIN (low deal or low final case)
   eliminated = player opens the ₱1,000,000 case (after the fake virus prank)
   WIN_MIN = smallest amount that counts as a win.
   FIT = 'cover' (fills screen, may crop) or 'contain' (shows whole GIF). */
const GIFS={
  jackpot:{src:'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2gxcG4yMXMxemhlMGNwd3N3a3IybHA3Y2hvMXAwaHZpeDVidHpvYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8X0BJeKzJpv0YsujtT/giphy.gif',alt:'Celebration for winning one million pesos'},
  dealWin:{src:'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2gxcG4yMXMxemhlMGNwd3N3a3IybHA3Y2hvMXAwaHZpeDVidHpvYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gXXFrjHFJIMoqKr8UT/giphy.gif',alt:'Celebration for taking a winning deal'},
  win:{src:'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazhtdjN4N3RiYTVzMnY3MGg1bnEzNXJhYTBsbnhwdXRwd200NTl5cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tphCApwvdtC1VJabZ1/giphy.gif',alt:'Celebration for winning'},
  lose:{src:'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Z3JuaG9jZWdqNmU5ZHplOHIyb3JlZ214bjRlejJlZmd0cDFnNnVkMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7rhy3qJnT0O3MFZU0K/giphy.gif',alt:'Sad reaction for losing'},
  eliminated:{src:'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGg5eTE2NzNya3Z6b281ZGk2YzZ5aWZxcWduOWcyOXB1cWZ0emxrbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Iy1PWGPb7Hz3AI4e3T/giphy.gif',alt:'Reaction to eliminating the million pesos'}
};
const WIN_MIN=100000;
const FIT='cover';
/* ===== END TEMPLATE ===== */
const PRIZES=[1,10,50,100,500,1000,5000,10000,25000,50000,75000,100000,200000,300000,500000,1000000];
const ROUNDS=[5,4,3,2], FACT=[.32,.5,.68,.85];
const $=id=>document.getElementById(id);
const peso=n=>'₱'+n.toLocaleString('en-PH');
let vals,mine,opened,ri,left,locked,over,timers=[];
const wait=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t};
const clearT=()=>{timers.forEach(clearTimeout);timers=[]};
const rmOn=()=>document.body.classList.contains('body-rm')||matchMedia('(prefers-reduced-motion:reduce)').matches;


let AC=null,muted=false,dTimer=null;
const CAT='<svg viewBox="0 0 160 200" aria-hidden="true"><path class="tail" d="M108 165 Q150 160 145 120" stroke="#e8902a" stroke-width="14" fill="none" stroke-linecap="round"/><g class="aL"><line x1="58" y1="108" x2="50" y2="150" stroke="#f4a340" stroke-width="13" stroke-linecap="round"/></g><g class="aR"><line x1="102" y1="108" x2="110" y2="150" stroke="#f4a340" stroke-width="13" stroke-linecap="round"/></g><ellipse cx="80" cy="140" rx="36" ry="42" fill="#f4a340"/><ellipse cx="80" cy="145" rx="20" ry="28" fill="#ffe0b0"/><ellipse cx="62" cy="185" rx="15" ry="9" fill="#e8902a"/><ellipse cx="98" cy="185" rx="15" ry="9" fill="#e8902a"/><polygon points="52,55 56,22 76,45" fill="#f4a340"/><polygon points="108,55 104,22 84,45" fill="#f4a340"/><circle cx="80" cy="72" r="34" fill="#f4a340"/><rect x="50" y="60" width="26" height="18" rx="6" fill="#111"/><rect x="84" y="60" width="26" height="18" rx="6" fill="#111"/><rect x="74" y="65" width="12" height="4" fill="#111"/><path d="M68 90 Q80 102 92 90" stroke="#5a2a00" stroke-width="3" fill="none"/><polygon points="76,82 84,82 80,87" fill="#ff7a9a"/></svg>';
document.querySelectorAll('.cat').forEach(c=>c.innerHTML=CAT);
function ac(){if(muted)return null;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}}
function tone(f,d,ty='sine',v=.12,at=0,f2){const a=ac();if(!a)return;const t=a.currentTime+at,o=a.createOscillator(),g=a.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02)}
function noise(d,v=.1,at=0){const a=ac();if(!a)return;const n=a.sampleRate*d|0,b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource(),g=a.createGain();s.buffer=b;g.gain.value=v;s.connect(g);g.connect(a.destination);s.start(a.currentTime+at)}
const sfx={
 click:()=>tone(660,.09,'square',.07),
 suspense:()=>{tone(110,.9,'sawtooth',.06,0,260);[0,.3,.6].forEach(x=>tone(440,.1,'square',.05,x))},
 reveal:v=>{if(v>=100000)tone(330,.6,'sawtooth',.09,0,90);else if(v>=5000){tone(500,.15,'triangle',.1);tone(420,.25,'triangle',.1,.15)}else{tone(784,.12,'triangle',.12);tone(1047,.25,'triangle',.12,.12)}},
 ring:()=>[0,.6].forEach(t=>{tone(440,.4,'sine',.09,t);tone(480,.4,'sine',.09,t)}),
 deal:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.12,i*.09)),
 nodeal:()=>tone(160,.35,'sawtooth',.1,0,90),
 drone:()=>tone(70,2.2,'sawtooth',.13,0,35),
 glitch:()=>{noise(.5,.15);tone(200,.4,'square',.08,0,2500)},
 alarm:()=>{for(let i=0;i<6;i++)tone(i%2?600:900,.25,'square',.08,i*.28)},
 tick:()=>tone(700+Math.random()*900,.05,'square',.04),
 kid:()=>{[392,523,659,784].forEach((f,i)=>tone(f,.18,'square',.09,i*.1));tone(1047,.6,'triangle',.12,.45)},
 fanfare:()=>[523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,.3,'triangle',.13,i*.12)),
 sad:()=>[392,349,311,262].forEach((f,i)=>tone(f,.4,'sawtooth',.07,i*.35))
};
function disco(){stopDisco();let b=0;dTimer=setInterval(()=>{tone(130,.18,'sine',.22,0,45);if(b%2)noise(.05,.06);const n=[130,164,196,164][b%4];tone(n*2,.2,'square',.035);b++},250)}
function stopDisco(){clearInterval(dTimer);dTimer=null}
$('muteBtn').onclick=()=>{muted=!muted;$('muteBtn').setAttribute('aria-pressed',muted);$('muteBtn').textContent=muted?'🔇 Sound: Off':'🔊 Sound: On';if(muted)stopDisco();else if($('fin').classList.contains('win'))disco()};

$('rmBtn').onclick=()=>{const on=document.body.classList.toggle('body-rm');$('rmBtn').setAttribute('aria-pressed',on);$('rmBtn').textContent='Reduce Motion: '+(on?'On':'Off')};
if(matchMedia('(prefers-reduced-motion:reduce)').matches)$('rmBtn').click();

function newGame(){
  clearT();
  ['bank','fin','gp','tw','alert','vir','kid'].forEach(i=>$(i).classList.remove('on'));
  $('log').innerHTML='';$('failT').classList.add('hide');
  document.querySelectorAll('.win,.pt').forEach(e=>e.remove());
  vals=[...PRIZES];for(let i=vals.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[vals[i],vals[j]]=[vals[j],vals[i]]}
  stopDisco();stopCall();$('fin').classList.remove('win');mine=null;opened=new Set();ri=0;left=0;locked=false;over=false;
  render();
}
function render(){
  $('board').innerHTML=PRIZES.map(p=>{const gone=opened.has(vals.indexOf(p));return `<div class="chip ${p==1e6?'big':''} ${gone?'gone':''}">${peso(p)}${gone?'<span class="sr" hidden> eliminated</span>':''}</div>`}).join('');
  $('cases').innerHTML=vals.map((v,i)=>{
    const o=opened.has(i),m=i===mine;
    const cls='case'+(o?' opened':'')+(m?' mine':'');
    const dis=o||m&&true||locked||over;
    const txt=o?peso(v):(i+1);
    return `<button class="${cls}" data-i="${i}" ${(o||locked||over||(m))?'disabled':''} aria-label="${o?'Briefcase '+(i+1)+' opened: '+peso(v):m?'Your briefcase, number '+(i+1):'Briefcase '+(i+1)}"><span class="n">${txt}</span>${m?'<span class="tag">★ YOUR BRIEFCASE</span>':''}${o?'<span class="tag">OPENED</span>':''}</button>`}).join('');
  document.querySelectorAll('.case').forEach(b=>b.onclick=()=>pick(+b.dataset.i));
  if(over)return;
  if(mine===null){$('stTitle').textContent='Choose your briefcase.';$('stSub').textContent='Tap any case to keep as YOUR BRIEFCASE.'}
  else if(ri<ROUNDS.length){$('stTitle').textContent='ROUND '+(ri+1);$('stSub').textContent='Open '+left+' briefcase'+(left>1?'s':'')+'.'}
  else{$('stTitle').textContent='FINAL ROUND';$('stSub').textContent='Keep or swap your briefcase.'}
}
function pick(i){
  if(locked||over||opened.has(i))return;
  if(mine===null){mine=i;left=ROUNDS[0];sfx.click();render();return}
  if(i===mine)return;
  locked=true;render();
  const b=document.querySelector(`.case[data-i="${i}"]`);b.classList.add('opening');sfx.suspense();
  $('stTitle').textContent='Opening case #'+(i+1)+'…';$('stSub').textContent='The studio holds its breath…';
  wait(()=>{
    opened.add(i);locked=true;render();
    if(vals[i]===1e6){twist();return}sfx.reveal(vals[i]);
    $('stTitle').textContent=peso(vals[i])+' eliminated';$('stSub').textContent='Removed from the board.';
    left--;
    wait(()=>{locked=false;if(left===0)banker();else render()},rmOn()?600:1100);
  },rmOn()?500:1000);
}
function remaining(){return vals.filter((v,i)=>!opened.has(v===undefined?i:i))} 
function offerCalc(){
  const rem=vals.filter((v,i)=>!opened.has(i));
  const avg=rem.reduce((a,b)=>a+b,0)/rem.length;
  const step=avg>20000?1000:avg>1000?100:10;
  return Math.max(1,Math.round(avg*FACT[ri]/step)*step);
}
let curOffer=0;
let ringT=null,callT=null,autoT=null;
function stopCall(){clearInterval(ringT);clearInterval(callT);clearTimeout(autoT);if('speechSynthesis' in window)speechSynthesis.cancel();$('bkWaves').classList.add('hide')}
function pickVoice(){const v=speechSynthesis.getVoices();return v.find(x=>/^en/i.test(x.lang)&&/male|daniel|david|alex|guy|mark|george|james/i.test(x.name)&&!/female/i.test(x.name))||v.find(x=>/^en/i.test(x.lang))||null}
function banker(){
  locked=true;curOffer=offerCalc();stopCall();
  $('bkRing').classList.remove('hide');$('bkOffer').classList.add('hide');$('bkAv').classList.remove('calm');
  $('bkState').textContent='incoming call…';$('bkTime').textContent='';$('bkSub').textContent='';
  $('bkName').textContent='📞 THE BANKER IS CALLING...';$('bank').classList.add('on');
  const ring=()=>{sfx.ring();if(navigator.vibrate&&!muted)navigator.vibrate([300,150,300])};
  ring();ringT=setInterval(ring,2200);
  $('bkAns').focus();
  autoT=wait(answerCall,9000);
}
function answerCall(){
  clearInterval(ringT);clearTimeout(autoT);
  $('bkRing').classList.add('hide');$('bkAv').classList.add('calm');
  $('bkName').textContent='THE BANKER';$('bkWaves').classList.remove('hide');
  let s=0;const tick=()=>{s++;$('bkState').textContent='Connected';$('bkTime').textContent='0:'+String(s).padStart(2,'0')};
  tick();callT=setInterval(tick,1000);sfx.click();
  const line=`Hello. This is the Banker. I have looked at the board, and I have an offer for you. ${curOffer.toLocaleString('en-US')} pesos. Deal... or no deal?`;
  $('bkSub').textContent='“'+line+'”';
  let done=false;
  const showOffer=()=>{
    if(done)return;done=true;clearInterval(callT);$('bkWaves').classList.add('hide');$('bkState').textContent='Call in progress';
    $('bkOffer').classList.remove('hide');$('offerAmt').textContent=peso(curOffer);
    $('offerNote').textContent='Based on the '+vals.filter((v,i)=>!opened.has(i)).length+' prizes still in play (including yours).';
    $('dealBtn').focus();
  };
  if(!muted&&'speechSynthesis' in window){
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(line),v=pickVoice();
      if(v)u.voice=v;u.lang=v?v.lang:'en-US';u.pitch=.6;u.rate=.92;
      u.onend=showOffer;u.onerror=showOffer;speechSynthesis.speak(u);wait(showOffer,16000);
    }catch(e){wait(showOffer,4000)}
  }else wait(showOffer,rmOn()?1500:4000);
}
$('bkAns').onclick=answerCall;
$('dealBtn').onclick=()=>{stopCall();sfx.deal();$('bank').classList.remove('on');end('DEAL!',curOffer,true)};
$('noBtn').onclick=()=>{
  stopCall();sfx.nodeal();$('bank').classList.remove('on');ri++;
  if(ri<ROUNDS.length){left=ROUNDS[ri]}
  locked=false;
  if(ri>=ROUNDS.length)finalStage();else render();
};
function finalStage(){
  const other=vals.findIndex((v,i)=>!opened.has(i)&&i!==mine);
  render();
  showFin('FINAL DECISION','',`Two cases left: YOUR BRIEFCASE (#${mine+1}) and case #${other+1}. Keep yours or swap?`,
    [['KEEP MINE','deal',()=>reveal(mine,other)],['SWAP 🔁','nodeal',()=>reveal(other,mine)]]);
}
function showFin(t,a,txt,btns){
  $('fnT').textContent=t;$('fnAmt').textContent=a;$('fnTxt').textContent=txt;
  const c=$('fnBtns');c.innerHTML='';
  btns.forEach(([l,cl,fn])=>{const b=document.createElement('button');b.className='big-btn '+cl;b.textContent=l;b.onclick=fn;c.appendChild(b)});
  $('fin').classList.add('on');c.firstChild.focus();
}
function reveal(keepIdx,otherIdx){
  const won=vals[keepIdx];
  end(won>=100000?'🎉 YOU WIN!':'GAME OVER',won,false,`The other case held ${peso(vals[otherIdx])}.`);
}
function end(title,amt,deal,extra){
  over=true;locked=true;
  let txt=deal?`You took the Banker's deal. Your briefcase (#${mine+1}) actually held ${peso(vals[mine])}. `+(vals[mine]>amt?'Ouch — you could have won more!':'Smart move — you beat your briefcase!'):(extra||'');
  render();
  const win=amt>=WIN_MIN;
  if(win&&!deal&&amt===1e6){gifPage('jackpot','🏆 JACKPOT! 🏆',amt,'Your briefcase held the ₱1,000,000 grand prize!');sfx.fanfare();wait(disco,900);return}
  if(win&&deal){gifPage('dealWin','🤝 DEAL — YOU WON! 🎉',amt,txt);sfx.fanfare();wait(disco,900);return}
  if(win){gifPage('win','🎉 YOU WIN! 🎉',amt,txt);sfx.fanfare();wait(disco,900);return}
  gifPage('lose','😢 GAME OVER',amt,txt);sfx.sad();return;
  showFin(win?title+' 🕺🪩':title,peso(amt),txt+(win?' Time to dance!':''),[['🔄 PLAY AGAIN','again',newGame]]);
  $('fin').classList.toggle('win',win);
  if(win){sfx.fanfare();wait(disco,900)}else sfx.sad();
}
/* ---- THE TWIST (all simulated) ---- */
function twist(){
  over=true;
  const tw=$('tw');tw.classList.add('on');sfx.drone();$('twT').textContent='';$('twS').textContent='';
  const rm=rmOn();
  wait(()=>{$('twT').textContent='💀 ₱1,000,000 ELIMINATED';sfx.glitch();if(!rm)$('twT').classList.add('glitch')},rm?500:1600);
  wait(()=>{tw.classList.remove('on');$('twT').classList.remove('glitch');$('alert').classList.add('on');sfx.alarm()},rm?2000:3600);
  wait(()=>$('failT').classList.remove('hide'),rm?3500:5600);
  wait(()=>{$('alert').classList.remove('on');virus()},rm?5500:8200);
}
const STEPS=[
 [7,'Initializing... 7%',['Waking up the hamsters...']],
 [23,'Connecting to mysterious server... 23%',['Downloading 47 suspicious gigabytes...']],
 [47,'Downloading virus... 47%',['Scanning for common sense...','Common sense not found.']],
 [68,'Installing absolutely questionable software... 68%',['Installing disappointment.exe...','Your ₱1,000,000 has left the chat.']],
 [82,'Taking over the calculator... 82%',['Contacting the Banker for technical support...','Banker refused to help.']],
 [94,'Deleting your high score... 94%',['High score was already 0. Impressive.']],
 [100,'ERROR: Too much failure detected... 100%',['Everything here is virus. HAHAHAHA!!.']]
];
const COLORS=['#ff2d55','#a020f0','#1e64ff','#00e676','#ffea00','#ff8a00','#ff4fd8','#00e5ff'];
const ERRS=['ERROR 404: Skill not found','Virus Scanner','Warning: Virus detected','Banker.exe not responding','Low confidence in you','Virus alert'];
function virus(){
  const v=$('vir');v.classList.add('on');$('log').innerHTML='';
  const rm=rmOn();let k=0;
  function log(t){sfx.tick();const d=document.createElement('div');d.textContent=t;$('log').appendChild(d);while($('log').children.length>7)$('log').firstChild.remove()}
  function step(){
    if(k>=STEPS.length){wait(finish,rm?800:1500);return}
    const [p,msg,extra]=STEPS[k];
    $('pf').style.width=p+'%';$('pct').textContent=p+'%';$('pb').setAttribute('aria-valuenow',p);
    log(msg);extra.forEach((t,i)=>wait(()=>log(t),600*(i+1)));
    $('chaos').style.opacity=rm?Math.min(.35,.05*(k+1)):Math.min(.9,.14*(k+1));
    if(!rm){$('vbox').classList.toggle('shake',k>2);spawnWin();spawnWin();confetti(k*4+6)}
    else if(k%2===0)spawnWin();
    k++;wait(step,rm?1500:2000);
  }
  step();
}
function spawnWin(){
  const v=$('vir'),w=document.createElement('div');w.className='win';
  w.style.left=Math.random()*40+'%';w.style.top=Math.random()*80+'%';
  w.style.borderColor=COLORS[Math.random()*8|0];
  w.innerHTML=`<b>⚠ ${ERRS[Math.random()*ERRS.length|0]}</b><span>Injecting virus to your device. [OK]</span>`;
  v.appendChild(w);wait(()=>w.remove(),2600);
}
function confetti(n){
  const v=$('vir');
  for(let i=0;i<n;i++){const p=document.createElement('i');p.className='pt';
    p.style.left=Math.random()*100+'%';p.style.background=COLORS[Math.random()*8|0];
    p.style.animationDuration=(2+Math.random()*2)+'s';v.appendChild(p);wait(()=>p.remove(),4200)}
}
function finish(){
  document.querySelectorAll('.win,.pt').forEach(e=>e.remove());
  $('vir').classList.remove('on');$('vbox').classList.remove('shake');$('chaos').style.opacity=0;
  sfx.kid();gifPage('eliminated','😂 JUST KIDDING!',null,'No virus was downloaded. You only lost the ₱1,000,000 prize. Better luck next game!');
}
$('skipBtn').onclick=()=>{clearT();finish()};
$('againK').onclick=newGame;
$('gpAgain').onclick=newGame;
function gifPage(kind,title,amt,txt){
  const g=GIFS[kind],img=$('gpImg'),ph=$('gpPh');
  $('gpT').textContent=title;
  $('gpAmt').textContent=amt==null?'':peso(amt);$('gpAmt').classList.toggle('hide',amt==null);
  $('gpTxt').textContent=txt||'';
  img.alt=g.alt;img.style.objectFit=FIT;img.classList.remove('hide');ph.classList.add('hide');
  img.onerror=()=>{img.classList.add('hide');ph.classList.remove('hide');ph.innerHTML='🖼️ Put your GIF here:<br>'+g.src};
  img.src=g.src;
  $('gp').classList.add('on');$('gpAgain').focus();
}
newGame();