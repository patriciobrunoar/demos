(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll state + progress bar ---------- */
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');

  function onScrollUI() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Parallax (rAF throttled) ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));

  function onParallax() {
    if (reducedMotion) return;
    const vh = window.innerHeight;
    const y = window.scrollY;
    for (const el of parallaxEls) {
      const speed = parseFloat(el.dataset.speed) || 0.1;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + y + rect.height / 2;
      const offset = (y + vh / 2 - elCenter) * speed;
      el.style.transform = `translate3d(0, ${offset * -1}px, 0)`;
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScrollUI();
        onParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollUI();
  onParallax();

  /* ---------- Hero image rotation ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1 && !reducedMotion) {
    let activeIndex = 0;
    setInterval(() => {
      heroSlides[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % heroSlides.length;
      heroSlides[activeIndex].classList.add('is-active');
    }, 5500);
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const isYear = el.dataset.format === 'year';
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = (isYear ? val : val.toLocaleString('en-US')) + (isYear ? '' : suffix);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = (isYear ? target : target.toLocaleString('en-US')) + (isYear ? '' : suffix);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['home', 'about', 'products', 'certifications', 'work', 'news', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('[data-nav]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const navEl = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const open = navEl.classList.toggle('menu-open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navEl.classList.remove('menu-open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reducedMotion && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--btn-x', x * 0.25 + 'px');
        btn.style.setProperty('--btn-y', y * 0.35 + 'px');
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--btn-x', '0px');
        btn.style.setProperty('--btn-y', '0px');
      });
    });
  }

  /* ---------- Smooth in-page scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
})();
