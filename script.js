/* ================================================================
   OPINION KINGS — Premium JS
   Smooth scroll, GSAP-style scroll animations, slider, form
   ================================================================ */

(function () {
  'use strict';

  /* ======================== LIGHTWEIGHT SMOOTH SCROLL (Lenis-like) ======================== */
  class SmoothScroll {
    constructor() {
      this.targetY = window.scrollY;
      this.currentY = window.scrollY;
      this.ease = 0.08;
      this.running = true;
      this.rafId = null;
      this.listeners = [];

      // Only enable on non-touch devices for performance
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (!this.isTouch) {
        this._init();
      }
    }

    _init() {
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      window.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.targetY += e.deltaY;
        this.targetY = Math.max(0, Math.min(this.targetY, this._maxScroll()));
      }, { passive: false });

      // Handle keyboard scroll
      window.addEventListener('keydown', (e) => {
        const keys = { ArrowDown: 80, ArrowUp: -80, PageDown: 400, PageUp: -400, Space: 400, Home: -Infinity, End: Infinity };
        const key = e.code === 'Space' ? 'Space' : e.key;
        if (keys[key] !== undefined) {
          e.preventDefault();
          if (key === 'Home') this.targetY = 0;
          else if (key === 'End') this.targetY = this._maxScroll();
          else this.targetY = Math.max(0, Math.min(this.targetY + keys[key], this._maxScroll()));
        }
      });

      this._tick();
    }

    _maxScroll() {
      return document.documentElement.scrollHeight - window.innerHeight;
    }

    _tick() {
      this.currentY += (this.targetY - this.currentY) * this.ease;

      // Snap when close enough
      if (Math.abs(this.targetY - this.currentY) < 0.5) {
        this.currentY = this.targetY;
      }

      window.scrollTo(0, this.currentY);

      // Notify listeners
      this.listeners.forEach(fn => fn(this.currentY));

      if (this.running) {
        this.rafId = requestAnimationFrame(() => this._tick());
      }
    }

    scrollTo(y, immediate) {
      this.targetY = Math.max(0, Math.min(y, this._maxScroll()));
      if (immediate) {
        this.currentY = this.targetY;
        window.scrollTo(0, this.currentY);
      }
    }

    onScroll(fn) {
      this.listeners.push(fn);
    }

    // Sync when browser forces scroll (e.g. anchor click)
    sync() {
      this.targetY = window.scrollY;
      this.currentY = window.scrollY;
    }

    destroy() {
      this.running = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    }
  }

  const smoother = new SmoothScroll();

  /* ======================== NAV — Glass blur on scroll ======================== */
  const nav = document.getElementById('nav');
  const navHeight = nav ? nav.offsetHeight : 72;

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ======================== MOBILE MENU ======================== */
  const mobBtn = document.getElementById('mobBtn');
  const mobMenu = document.getElementById('mobMenu');

  if (mobBtn && mobMenu) {
    mobBtn.addEventListener('click', () => {
      mobBtn.classList.toggle('active');
      mobMenu.classList.toggle('open');
      document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobBtn.classList.remove('active');
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ======================== SMOOTH NAV ANCHOR SCROLL ======================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const hash = a.getAttribute('href');
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();

      const y = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      smoother.scrollTo(y);
    });
  });

  /* ======================== HERO WORD-BY-WORD REVEAL ======================== */
  function initWordReveal() {
    document.querySelectorAll('[data-word-reveal]').forEach(el => {
      const text = el.textContent.trim();
      el.textContent = '';

      // Define which words get accent color
      const accentWords = ['CONVICTION.', 'RIGHT.'];

      const words = text.split(/\s+/);
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        if (accentWords.includes(word)) {
          span.classList.add('word--accent');
        }

        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;

        span.appendChild(inner);
        el.appendChild(span);

        // Add line break after specific words to match original layout
        if (word === 'YOUR' || word === 'CONVICTION.' || word === 'BEING') {
          el.appendChild(document.createElement('br'));
        }
      });

      // Animate words with stagger
      const inners = el.querySelectorAll('.word-inner');
      inners.forEach((inner, i) => {
        setTimeout(() => {
          inner.classList.add('revealed');
        }, 200 + i * 90);
      });
    });
  }

  /* ======================== PARALLAX HERO GLOWS ======================== */
  function initParallax() {
    const glows = document.querySelectorAll('[data-parallax]');
    if (!glows.length) return;

    function updateParallax() {
      const scrollY = window.scrollY;
      glows.forEach(glow => {
        const speed = parseFloat(glow.dataset.parallax) || 0;
        const y = scrollY * speed * 100;
        glow.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ======================== SCROLL-TRIGGERED REVEALS ======================== */

  // 1. data-reveal elements (hero elements with directional reveal)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // 2. data-scroll-reveal elements (section headings, stats, etc.)
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('[data-scroll-reveal]').forEach(el => scrollRevealObserver.observe(el));

  // 3. Stagger children (vault grid, faq list)
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const children = Array.from(entry.target.children);
      children.forEach((child, i) => {
        setTimeout(() => {
          child.classList.add('stagger-visible');
        }, i * 100);
      });

      staggerObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('[data-stagger-children]').forEach(el => staggerObserver.observe(el));

  // 4. Animate market card fill bars when visible
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const finalWidth = target.style.width;
      target.style.width = '0%';
      target.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
          target.style.width = finalWidth;
        });
      });

      barObserver.unobserve(target);
    });
  }, {
    threshold: 0.3
  });

  document.querySelectorAll('.mc-fill').forEach(el => barObserver.observe(el));

  /* ======================== MARKET SLIDER ======================== */
  (function () {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.sd');
    const prev = document.getElementById('sliderPrev');
    const next = document.getElementById('sliderNext');
    if (!slides.length) return;

    let cur = 0;
    let autoTimer = null;

    function show(i) {
      slides[cur].classList.remove('active-slide');
      if (dots[cur]) dots[cur].classList.remove('active-dot');

      cur = ((i % slides.length) + slides.length) % slides.length;

      slides[cur].classList.add('active-slide');
      if (dots[cur]) dots[cur].classList.add('active-dot');

      // Re-trigger bar animation for this slide
      const fill = slides[cur].querySelector('.mc-fill');
      if (fill) {
        const w = fill.style.width;
        fill.style.width = '0%';
        fill.style.transition = 'none';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
            fill.style.width = w;
          });
        });
      }

      resetAuto();
    }

    function resetAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => show(cur + 1), 5000);
    }

    if (prev) prev.addEventListener('click', () => show(cur - 1));
    if (next) next.addEventListener('click', () => show(cur + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));

    // Touch / swipe support
    const slider = document.getElementById('marketSlider');
    if (slider) {
      let startX = 0;
      let diffX = 0;

      slider.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      slider.addEventListener('touchmove', e => {
        diffX = e.touches[0].clientX - startX;
      }, { passive: true });

      slider.addEventListener('touchend', () => {
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) show(cur + 1);
          else show(cur - 1);
        }
        diffX = 0;
      });
    }

    resetAuto();
  })();

  /* ======================== FAQ ACCORDION ======================== */
  // Only allow one FAQ item open at a time
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });

  /* ======================== FORM HANDLING ======================== */
  const heroForm = document.getElementById('heroForm');
  if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.btn-primary');
      const emailField = this.querySelector('[type=email]');
      const nameField = this.querySelector('[type=text]');

      if (!emailField || !emailField.value) return;

      const originalText = btn.textContent;
      btn.textContent = 'JOINING...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.textContent = 'YOU\'RE IN';
        btn.style.background = '#22C55E';
        btn.style.opacity = '1';
        emailField.value = '';
        if (nameField) nameField.value = '';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.pointerEvents = '';
        }, 3500);
      }, 1200);
    });
  }

  /* ======================== INIT ======================== */
  function init() {
    initWordReveal();
    initParallax();
  }

  // Wait for fonts + DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Sync smooth scroll on resize
  window.addEventListener('resize', () => {
    smoother.sync();
  });

})();
