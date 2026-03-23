// ====== THEME (dark only for this design) ======

// ====== NAV ======
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50),{passive:true});
document.getElementById('mobBtn')?.addEventListener('click',function(){this.classList.toggle('active')});

// ====== SMOOTH SCROLL NAV ======
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));
    if(!el)return;e.preventDefault();
    scrollTo({top:el.offsetTop-nav.offsetHeight-16,behavior:'smooth'});
  });
});

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

// ====== MARKET SLIDER ======
(function(){
  const slides=document.querySelectorAll('.slide');
  const dots=document.querySelectorAll('.sd');
  const prev=document.getElementById('sliderPrev');
  const next=document.getElementById('sliderNext');
  if(!slides.length)return;
  let cur=0;

  function show(i){
    slides[cur].classList.remove('active-slide');
    dots[cur]?.classList.remove('active-dot');
    cur=(i+slides.length)%slides.length;
    slides[cur].classList.add('active-slide');
    dots[cur]?.classList.add('active-dot');
  }

  prev?.addEventListener('click',()=>show(cur-1));
  next?.addEventListener('click',()=>show(cur+1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>show(i)));

  // Auto-advance every 5s
  setInterval(()=>show(cur+1),5000);
})();

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
