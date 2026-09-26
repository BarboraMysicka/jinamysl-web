function rozdelSlova(h){
  const casti=[];
  h.childNodes.forEach(node=>{
    if(node.nodeType===3){ node.textContent.split(/\s+/).forEach(w=>{ if(w) casti.push({t:w,cls:''}); }); }
    else if(node.nodeType===1){ casti.push({t:node.innerHTML, cls:node.getAttribute('class')||''}); }
  });
  let html='';
  casti.forEach((p,i)=>{
    const punct=/^[.,!?;:…)»"']+$/.test(p.t);
    if(i>0 && !punct) html+=' ';
    html+=`<span class="w ${p.cls}" style="--i:${i}">${p.t}</span>`;
  });
  h.innerHTML=html;
}
function animujSlova(){
  const vrstva = document.documentElement.dataset.vrstva==='zvenci' ? '.zvenci-web' : '.zblizka-pribeh';
  document.querySelectorAll(vrstva+' .slova').forEach(h=>{
    if(!h.dataset.hotovo){ rozdelSlova(h); h.dataset.hotovo='1'; }
    h.classList.remove('in'); void h.offsetWidth; h.classList.add('in');
  });
}
function nastavAria(){
  const el=document.documentElement;
  document.querySelectorAll('.prepinac .strana').forEach(s=>{
    s.setAttribute('aria-pressed', s.dataset.cil===el.dataset.vrstva ? 'true':'false');
  });
}
// klik na konkrétní stranu přepínače (Poodstoupit / Ponořit se)
function prepnoutNa(cil){
  if(document.documentElement.dataset.vrstva===cil) return; // už jsem tam
  prepnout();
}
function prepnout(){
  const el=document.documentElement;
  const nova = el.dataset.vrstva==='zvenci' ? 'zblizka' : 'zvenci';
  const novaBg = nova==='zblizka' ? '#ffffff' : '#101015';
  const p=document.querySelector('.mozek-popis'); if(p) p.style.display='none';
  const dokonci = ()=>{
    el.dataset.vrstva=nova;
    try{ localStorage.setItem('jm-vrstva', nova); }catch(e){}
    nastavAria();
    window.scrollTo(0,0);
    el.classList.add('prepinam');
    animujSlova(); spustReveal(); parallax(); pribehScroll();
    clearTimeout(window._pt);
    window._pt=setTimeout(()=>{ el.classList.remove('prepinam'); }, 900);
  };
  // přístupnost: bez animace přepni rovnou
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ dokonci(); return; }
  // radiální odhalení z mozku
  const btn=document.querySelector('.prepinac-mozek') || document.querySelector('.prepinac');
  const r=btn?btn.getBoundingClientRect():{left:90,top:28,width:0,height:0};
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  const maxR=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy));
  const kruh=document.querySelector('.reveal-kruh');
  kruh.style.background=novaBg; kruh.style.opacity='1';
  kruh.style.transition='none'; kruh.style.clipPath=`circle(0px at ${cx}px ${cy}px)`;
  void kruh.offsetWidth;
  kruh.style.transition='clip-path .5s cubic-bezier(.7,0,.3,1)';
  kruh.style.clipPath=`circle(${maxR}px at ${cx}px ${cy}px)`;
  setTimeout(()=>{
    dokonci();                                  // přepni obsah schované za kruhem
    kruh.style.transition='opacity .45s ease';
    kruh.style.opacity='0';                     // odhal nový obsah
    setTimeout(()=>{ kruh.style.transition='none'; kruh.style.clipPath=`circle(0px at ${cx}px ${cy}px)`; }, 470);
  }, 520);
}
// scroll-reveal + aktivní krok osy (počítáno při scrollu, spolehlivé všude)
function spustReveal(){
  document.querySelectorAll('.odhal').forEach(e=>{
    const r=e.getBoundingClientRect();
    if(r.top < window.innerHeight*0.85 && r.bottom>0) e.classList.add('videt');
  });
  document.querySelectorAll('.odhal-late').forEach(e=>{
    const r=e.getBoundingClientRect();
    if(r.top < window.innerHeight*0.58 && r.bottom>0) e.classList.add('videt');
  });
  document.querySelectorAll('.plovak').forEach(e=>{
    const r=e.getBoundingClientRect();
    if(r.top < window.innerHeight*0.85 && r.bottom>0) e.classList.add('videt');
  });
  // přerámování (vrchol příběhu) se spustí, když je zhruba na středu obrazovky
  document.querySelectorAll('.prerám').forEach(e=>{
    const r=e.getBoundingClientRect();
    if(r.top < window.innerHeight*0.65 && r.bottom>0) e.classList.add('videt');
  });
}
// příběh: aktivní fáze v progresu + domalování kreslené stopy
function pribehScroll(){
  if(document.documentElement.dataset.vrstva!=='zblizka') return;
  const stred=window.innerHeight/2; let cur=null;
  document.querySelectorAll('.zblizka-pribeh [data-f]').forEach(s=>{
    if(s.getBoundingClientRect().top < stred) cur=s.dataset.f;
  });
  document.querySelectorAll('.progres span').forEach(z=>z.classList.toggle('akt', z.dataset.f===cur));
  const path=document.querySelector('.stopa path');
  if(path){
    if(!path._L){ path._L=path.getTotalLength(); path.style.strokeDasharray=path._L; }
    const h=document.body.scrollHeight-window.innerHeight;
    const p=h>0 ? Math.min(1,Math.max(0,window.scrollY/h)) : 0;
    path.style.strokeDashoffset=path._L*(1-p);
  }
}
// jemný parallax lístečků a polaroidů
function parallax(){
  if(document.documentElement.dataset.vrstva!=='zblizka') return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const vh=window.innerHeight;
  document.querySelectorAll('.zblizka-pribeh .plovak').forEach(el=>{
    const r=el.getBoundingClientRect();
    const py=((r.top+r.height/2) - vh/2)*-0.06;
    el.style.transform=`translateY(${py.toFixed(1)}px) rotate(${el.dataset.rot||0}deg)`;
  });
}
// postupné odkrytí: prvky ve stejném bloku naběhnou po sobě
function nastavStagger(){
  document.querySelectorAll('.zblizka-pribeh .krok-stred, .zblizka-pribeh .s-hero .wrap, .zblizka-pribeh .s-manifest, .zblizka-pribeh .s-cta').forEach(box=>{
    let i=0;
    box.querySelectorAll(':scope > .odhal').forEach(el=>{ el.style.transitionDelay=(i++*0.09)+'s'; });
  });
  document.querySelectorAll('.zblizka-pribeh .listek, .zblizka-pribeh .polaroid').forEach(el=>{ el.style.transitionDelay='0.2s'; });
  // stagger i v tmavém režimu (karty, projekty)
  document.querySelectorAll('.zvenci-web .d-karty, .zvenci-web .d-proj').forEach(box=>{
    let i=0;
    box.querySelectorAll(':scope > .odhal').forEach(el=>{ el.style.transitionDelay=(i++*0.1)+'s'; });
  });
}
// první návštěva vždy zvenčí; jinak si pamatuj volbu
(function(){ try{ const u=localStorage.getItem('jm-vrstva'); if(u) document.documentElement.dataset.vrstva=u; }catch(e){} })();
// zkopírování e-mailu do schránky (bez otevírání pošty), s vizuální zpětnou vazbou
function zkopirujMail(btn){
  var mail=btn.dataset.mail || btn.querySelector('.mail-kopie-adresa').textContent;
  var stav=btn.querySelector('.mail-kopie-stav');
  var hotovo=function(){
    if(stav) stav.textContent='Zkopírováno ✓';
    btn.classList.add('hotovo');
    clearTimeout(btn._kt);
    btn._kt=setTimeout(function(){ if(stav) stav.textContent='Kliknutím zkopírujete'; btn.classList.remove('hotovo'); }, 2000);
  };
  var nahrada=function(){
    try{ var t=document.createElement('textarea'); t.value=mail; t.style.position='fixed'; t.style.opacity='0';
      document.body.appendChild(t); t.focus(); t.select(); document.execCommand('copy'); document.body.removeChild(t); hotovo(); }catch(e){}
  };
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(mail).then(hotovo).catch(nahrada); }
  else nahrada();
}
// jemné pozvání k přepínači jen při úplně první návštěvě
function lakadloPrepinace(){
  try{
    if(localStorage.getItem('jm-videl-prepinac')) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ localStorage.setItem('jm-videl-prepinac','1'); return; }
    if(document.documentElement.dataset.vrstva!=='zvenci') return;
    const p=document.querySelector('.prepinac'); if(!p) return;
    p.classList.add('laka');
    setTimeout(()=>{ p.classList.remove('laka'); }, 6500);
    localStorage.setItem('jm-videl-prepinac','1');
  }catch(e){}
}
window.addEventListener('scroll',()=>{ spustReveal(); parallax(); pribehScroll(); },{passive:true});
window.addEventListener('DOMContentLoaded',()=>{ nastavAria(); nastavStagger(); animujSlova(); spustReveal(); parallax(); pribehScroll(); lakadloPrepinace(); });
