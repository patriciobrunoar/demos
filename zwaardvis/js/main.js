(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Graceful image fallback (assets not yet uploaded) ---------- */
  function handleImgFallback(img) {
    const wrap = img.closest('[data-media]');
    const fallbackText = img.dataset.fallbackText;
    if (fallbackText) {
      const span = document.createElement('span');
      span.className = 'logo-word';
      span.innerHTML = fallbackText.replace('ZWAARDVIS', 'ZWAARD<span class="accent">VIS</span>');
      img.replaceWith(span);
    } else if (wrap) {
      wrap.classList.add('no-media');
      img.style.display = 'none';
    }
  }
  document.querySelectorAll('[data-media] img').forEach((img) => {
    // the image may have already failed to load before this script (at the
    // end of body) runs, since <img> requests fire during HTML parsing —
    // a late-attached 'error' listener would miss that. Check first.
    if (img.complete && img.naturalWidth === 0) {
      handleImgFallback(img);
    } else {
      img.addEventListener('error', () => handleImgFallback(img), { once: true });
    }
  });

  /* ---------- Same fallback for the hero video (unsupported codec/format) ---------- */
  document.querySelectorAll('[data-media] video').forEach((video) => {
    const wrap = video.closest('[data-media]');
    const fallback = () => wrap && wrap.classList.add('no-media');
    video.addEventListener('error', fallback, { once: true });
    video.addEventListener('stalled', fallback, { once: true });
    // codec/decode failures don't always fire 'error' — if nothing has
    // loaded after a few seconds, treat it as failed.
    setTimeout(() => { if (video.readyState === 0) fallback(); }, 3000);
  });

  /* ---------- Nav scroll state + progress bar + back-to-top ---------- */
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');
  const toTop = document.getElementById('toTop');

  function onScrollUI() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('visible', y > 700);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Parallax (rAF throttled) ---------- */
  const parallaxTargets = Array.from(document.querySelectorAll(
    '.hero-media img, .hero-bg, .about-visual img, .panel-media img, .collection-visual img, .cta-media img, [data-speed], [data-parallax]'
  ));

  function onParallax() {
    if (reducedMotion || window.innerWidth <= 768) {
      for (let i = 0; i < parallaxTargets.length; i++) {
        parallaxTargets[i].style.transform = '';
      }
      return;
    }
    const vh = window.innerHeight;
    for (let i = 0; i < parallaxTargets.length; i++) {
      const el = parallaxTargets[i];
      const parent = el.parentElement;
      if (!parent) continue;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom > -100 && rect.top < vh + 100) {
        const elCenter = rect.top + rect.height / 2;
        const vpCenter = vh / 2;
        const isHero = el.classList.contains('hero-bg') || el.closest('.hero-media');
        const isActive = el.classList.contains('is-active');
        const speed = parseFloat(el.dataset.speed) || (isHero ? 0.18 : 0.1);
        const translateY = (elCenter - vpCenter) * speed;
        let baseScale = 1.15;
        if (isHero) {
          baseScale = isActive ? 1.08 : 1.05;
        }
        el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${baseScale})`;
      }
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

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Custom ring cursor (trails with easing, grows on hover) ---------- */
  const ring = document.getElementById('cursorRing');
  if (!reducedMotion && matchMedia('(hover: hover)').matches && ring) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      ring.classList.add('is-active');
    }, { passive: true });
    window.addEventListener('mouseleave', () => ring.classList.remove('is-active'));

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    document.querySelectorAll('a, button, .family-tile, .panel-card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
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

  /* ---------- Animated stat counter (years in business) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['home', 'about', 'rv-tables', 'marine-tables', 'marine-seats', 'contact']
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
        btn.style.setProperty('--btn-x', x * 0.22 + 'px');
        btn.style.setProperty('--btn-y', y * 0.32 + 'px');
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

  /* ---------- Legal links (not part of this concept redesign) ---------- */
  document.querySelectorAll('[data-legal]').forEach((link) => {
    link.addEventListener('click', (e) => e.preventDefault());
  });
})();
