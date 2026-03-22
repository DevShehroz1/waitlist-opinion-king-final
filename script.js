// ====== THEME ======
const root=document.documentElement,tb=document.getElementById('themeBtn');
(function(){const s=localStorage.getItem('ok-t');if(s)root.setAttribute('data-theme',s)})();
tb?.addEventListener('click',()=>{const t=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',t);localStorage.setItem('ok-t',t)});

// ====== NAV ======
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50),{passive:true});
document.getElementById('mobMenu')?.addEventListener('click',function(){this.classList.toggle('active')});

// ====== FULLPAGE SCROLL (one section at a time) ======
(function(){
  const sections=document.querySelectorAll('.hero, .s, .cta, .ft');
  if(!sections.length)return;

  let current=0;
  let isScrolling=false;
  let lastWheelTime=0;
  let wheelAccum=0;
  let wheelTimer=null;
  const cooldown=1100;
  const isMobile=()=>window.innerWidth<=768;

  function goTo(index){
    if(index<0||index>=sections.length||isScrolling)return;
    isScrolling=true;
    current=index;

    const target=sections[current];
    const offset=target.getBoundingClientRect().top+window.scrollY;

    window.scrollTo({top:offset,behavior:'smooth'});

    setTimeout(()=>{isScrolling=false;wheelAccum=0},cooldown);
  }

  function findCurrent(){
    const mid=window.scrollY+window.innerHeight/3;
    for(let i=sections.length-1;i>=0;i--){
      if(sections[i].offsetTop<=mid){current=i;break}
    }
  }

  // Wheel handler — debounced to treat trackpad inertia as ONE gesture
  function onWheel(e){
    e.preventDefault();
    e.stopPropagation();

    if(isScrolling)return;

    const now=Date.now();

    // Reset accumulator if gap between events is large (new gesture)
    if(now-lastWheelTime>200){
      wheelAccum=0;
    }
    lastWheelTime=now;

    // Accumulate delta but don't act yet — wait for gesture to settle
    wheelAccum+=e.deltaY;

    // Clear previous timer
    if(wheelTimer)clearTimeout(wheelTimer);

    // Fire after 50ms of no new wheel events (gesture ended)
    // OR if accumulated delta is strong enough (>30), fire immediately once
    const threshold=30;
    if(Math.abs(wheelAccum)>threshold){
      // Immediately trigger, then lock
      const dir=wheelAccum>0?1:-1;
      wheelAccum=0;
      if(wheelTimer)clearTimeout(wheelTimer);
      goTo(current+dir);
    }else{
      // Small delta — wait to see if more comes
      wheelTimer=setTimeout(()=>{
        if(Math.abs(wheelAccum)>5){
          const dir=wheelAccum>0?1:-1;
          goTo(current+dir);
        }
        wheelAccum=0;
      },80);
    }
  }

  // Keyboard arrows / page up/down
  function onKey(e){
    if(isScrolling)return;

    if(e.key==='ArrowDown'||e.key==='PageDown'||e.key===' '){
      e.preventDefault();
      goTo(current+1);
    }else if(e.key==='ArrowUp'||e.key==='PageUp'){
      e.preventDefault();
      goTo(current-1);
    }
  }

  // Touch support — block native scroll, swipe one section at a time
  let touchStartY=0;
  let touchStartTime=0;
  let touchMoved=false;

  function onTouchStart(e){
    touchStartY=e.touches[0].clientY;
    touchStartTime=Date.now();
    touchMoved=false;
  }

  function onTouchMove(e){
    // Block native scroll so it doesn't fight with our section snapping
    if(!isScrolling){
      e.preventDefault();
      touchMoved=true;
    }
  }

  function onTouchEnd(e){
    if(isScrolling||!touchMoved)return;
    const diff=touchStartY-e.changedTouches[0].clientY;
    const elapsed=Date.now()-touchStartTime;
    // Require min 30px swipe within 600ms
    if(Math.abs(diff)>30&&elapsed<600){
      if(diff>0)goTo(current+1);
      else goTo(current-1);
    }
  }

  // Attach
  window.addEventListener('wheel',onWheel,{passive:false});
  window.addEventListener('keydown',onKey);
  window.addEventListener('touchstart',onTouchStart,{passive:true});
  window.addEventListener('touchmove',onTouchMove,{passive:false});
  window.addEventListener('touchend',onTouchEnd,{passive:true});

  // Sync current on resize
  window.addEventListener('scroll',()=>{if(!isScrolling)findCurrent()},{passive:true});

  // Nav link clicks — go to specific section
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const el=document.querySelector(a.getAttribute('href'));
      if(!el)return;
      e.preventDefault();
      // Find which section index this element is in
      for(let i=0;i<sections.length;i++){
        if(sections[i]===el||sections[i].contains(el)){
          goTo(i);return;
        }
      }
      // Fallback: find closest section
      let closest=0,minDist=Infinity;
      const elTop=el.offsetTop;
      sections.forEach((s,i)=>{
        const d=Math.abs(s.offsetTop-elTop);
        if(d<minDist){minDist=d;closest=i}
      });
      goTo(closest);
    });
  });

  // Init
  findCurrent();
})();

// ====== REVEAL ANIMATIONS ======
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('revealed');ro.unobserve(x.target)}}),{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('[data-reveal]').forEach(el=>ro.observe(el));

// Staggered grids
const go=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;Array.from(x.target.children).forEach((c,i)=>{c.classList.add('fade-up');c.style.transitionDelay=i*.08+'s';requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.add('visible')))});go.unobserve(x.target)}),{threshold:.08});
document.querySelectorAll('.mgrid,.grid3,.grid3x2,.rw-grid,.faq-list').forEach(g=>go.observe(g));

// Section headers
const ho=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('fade-up');requestAnimationFrame(()=>requestAnimationFrame(()=>x.target.classList.add('visible')));ho.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.sl,.st,.ss,.compliance,.cta-inner,.mgrid-note').forEach(el=>{if(!el.hasAttribute('data-reveal'))ho.observe(el)});

// Bar fills
const bo=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;const w=x.target.style.width;x.target.style.width='0%';setTimeout(()=>x.target.style.width=w,200);bo.unobserve(x.target)}),{threshold:.2});
document.querySelectorAll('.mc-fill').forEach(el=>bo.observe(el));

// Scroll content animations
const so=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');so.unobserve(x.target)}}),{threshold:.1,rootMargin:'0px 0px -80px 0px'});
document.querySelectorAll('.scroll-fade,.scroll-scale,.scroll-slide-l,.scroll-slide-r').forEach(el=>so.observe(el));

// ====== PARALLAX ======
(function(){const g1=document.querySelector('.g1'),g2=document.querySelector('.g2'),h=document.querySelector('.hero');if(!h)return;addEventListener('scroll',()=>{const y=scrollY;if(y>h.offsetHeight+200)return;if(g1)g1.style.transform='translateY('+y*.1+'px)';if(g2)g2.style.transform='translateY('+y*.06+'px)';},{passive:true})})();

// ====== FORMS ======
document.querySelectorAll('.wl-form').forEach(f=>{f.addEventListener('submit',function(e){e.preventDefault();const i=this.querySelector('.input'),b=this.querySelector('.btn');if(!i.value)return;const o=b.innerHTML;b.textContent='Joining...';b.style.opacity='.7';b.style.pointerEvents='none';setTimeout(()=>{b.innerHTML='You\'re In! ✓';b.style.background='var(--gn)';b.style.opacity='1';i.value='';i.placeholder='Check your inbox';setTimeout(()=>{b.innerHTML=o;b.style.background='';b.style.pointerEvents='';i.placeholder='Enter your email address'},3500)},1200)})});
