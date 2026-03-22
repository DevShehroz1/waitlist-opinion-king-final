// Theme
const root=document.documentElement,tb=document.getElementById('themeBtn');
(function(){const s=localStorage.getItem('ok-t');if(s)root.setAttribute('data-theme',s)})();
tb?.addEventListener('click',()=>{const t=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',t);localStorage.setItem('ok-t',t)});

// Nav
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50),{passive:true});

// Mobile
document.getElementById('mobMenu')?.addEventListener('click',function(){this.classList.toggle('active')});

// Smooth scroll (disable snap during programmatic scroll)
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(!el)return;e.preventDefault();document.documentElement.style.scrollSnapType='none';scrollTo({top:el.getBoundingClientRect().top+scrollY-nav.offsetHeight-20,behavior:'smooth'});setTimeout(()=>{document.documentElement.style.scrollSnapType='y mandatory'},1200)})});

// Reveal
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

// Scroll-triggered content animations
const so=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');so.unobserve(x.target)}}),{threshold:.1,rootMargin:'0px 0px -80px 0px'});
document.querySelectorAll('.scroll-fade,.scroll-scale,.scroll-slide-l,.scroll-slide-r').forEach(el=>so.observe(el));

// Parallax
(function(){const g1=document.querySelector('.g1'),g2=document.querySelector('.g2'),h=document.querySelector('.hero');if(!h)return;addEventListener('scroll',()=>{const y=scrollY;if(y>h.offsetHeight+200)return;if(g1)g1.style.transform='translateY('+y*.1+'px)';if(g2)g2.style.transform='translateY('+y*.06+'px)';},{passive:true})})();

// Forms
document.querySelectorAll('.wl-form').forEach(f=>{f.addEventListener('submit',function(e){e.preventDefault();const i=this.querySelector('.input'),b=this.querySelector('.btn');if(!i.value)return;const o=b.innerHTML;b.textContent='Joining...';b.style.opacity='.7';b.style.pointerEvents='none';setTimeout(()=>{b.innerHTML='You\'re In! ✓';b.style.background='var(--gn)';b.style.opacity='1';i.value='';i.placeholder='Check your inbox';setTimeout(()=>{b.innerHTML=o;b.style.background='';b.style.pointerEvents='';i.placeholder='Enter your email address'},3500)},1200)})});
