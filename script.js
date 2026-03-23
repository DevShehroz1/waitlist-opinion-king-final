// ====== THEME (dark only for this design) ======

// ====== NAV ======
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50),{passive:true});
document.getElementById('mobBtn')?.addEventListener('click',function(){this.classList.toggle('active')});

// ====== FULLPAGE SCROLL ======
(function(){
  const sections=document.querySelectorAll('.hero,.vault,.board,.faq-sec,.foot');
  if(!sections.length)return;
  let current=0,isScrolling=false,lastWheelTime=0,wheelAccum=0,wheelTimer=null;
  const cooldown=1100;
  const isMobile=()=>innerWidth<=768;

  function goTo(i){
    if(i<0||i>=sections.length||isScrolling)return;
    isScrolling=true;current=i;
    scrollTo({top:sections[current].offsetTop,behavior:'smooth'});
    setTimeout(()=>{isScrolling=false;wheelAccum=0},cooldown);
  }
  function findCurrent(){
    const mid=scrollY+innerHeight/3;
    for(let i=sections.length-1;i>=0;i--){if(sections[i].offsetTop<=mid){current=i;break}}
  }

  // Wheel — debounced
  addEventListener('wheel',e=>{
    if(isMobile())return;
    e.preventDefault();e.stopPropagation();
    if(isScrolling)return;
    const now=Date.now();
    if(now-lastWheelTime>200)wheelAccum=0;
    lastWheelTime=now;wheelAccum+=e.deltaY;
    if(wheelTimer)clearTimeout(wheelTimer);
    if(Math.abs(wheelAccum)>30){const d=wheelAccum>0?1:-1;wheelAccum=0;clearTimeout(wheelTimer);goTo(current+d)}
    else{wheelTimer=setTimeout(()=>{if(Math.abs(wheelAccum)>5)goTo(current+(wheelAccum>0?1:-1));wheelAccum=0},80)}
  },{passive:false});

  // Keys
  addEventListener('keydown',e=>{
    if(isScrolling)return;
    if(e.key==='ArrowDown'||e.key==='PageDown'||e.key===' '){e.preventDefault();goTo(current+1)}
    else if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();goTo(current-1)}
  });

  // Touch
  let ty=0,tm=false;
  addEventListener('touchstart',e=>{ty=e.touches[0].clientY;tm=false},{passive:true});
  addEventListener('touchmove',e=>{if(!isScrolling){e.preventDefault();tm=true}},{passive:false});
  addEventListener('touchend',e=>{
    if(isScrolling||!tm)return;
    const d=ty-e.changedTouches[0].clientY;
    if(Math.abs(d)>30){d>0?goTo(current+1):goTo(current-1)}
  },{passive:true});

  addEventListener('scroll',()=>{if(!isScrolling)findCurrent()},{passive:true});

  // Nav clicks
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const el=document.querySelector(a.getAttribute('href'));
      if(!el)return;e.preventDefault();
      for(let i=0;i<sections.length;i++){if(sections[i]===el||sections[i].contains(el)){goTo(i);return}}
      let c=0,m=Infinity;sections.forEach((s,i)=>{const d=Math.abs(s.offsetTop-el.offsetTop);if(d<m){m=d;c=i}});goTo(c);
    });
  });
  findCurrent();
})();

// ====== REVEAL ======
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('revealed');ro.unobserve(x.target)}}),{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>ro.observe(el));

// Staggered
const go=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;Array.from(x.target.children).forEach((c,i)=>{c.classList.add('fade-up');c.style.transitionDelay=i*.08+'s';requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.add('visible')))});go.unobserve(x.target)}),{threshold:.08});
document.querySelectorAll('.vault-grid,.faq-list,.lb-table').forEach(g=>go.observe(g));

// Headers
const ho=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('fade-up');requestAnimationFrame(()=>requestAnimationFrame(()=>x.target.classList.add('visible')));ho.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.sec-tag,.sec-heading,.vault-stat,.faq-heading,.board-heading,.board-live,.hero-left,.hero-right,.lb-cta').forEach(el=>ho.observe(el));

// Bars
const bo=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;const w=x.target.style.width;x.target.style.width='0%';setTimeout(()=>x.target.style.width=w,300);bo.unobserve(x.target)}),{threshold:.3});
document.querySelectorAll('.mc-fill').forEach(el=>bo.observe(el));

// ====== FORM ======
document.getElementById('heroForm')?.addEventListener('submit',function(e){
  e.preventDefault();
  const b=this.querySelector('.btn-gold'),em=this.querySelector('[type=email]');
  if(!em.value)return;
  const o=b.textContent;
  b.textContent='JOINING...';b.style.opacity='.7';b.style.pointerEvents='none';
  setTimeout(()=>{b.textContent='YOU\'RE IN ✓';b.style.background='#22C55E';b.style.opacity='1';em.value='';
    setTimeout(()=>{b.textContent=o;b.style.background='';b.style.pointerEvents=''},3500)},1200);
});
