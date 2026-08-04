(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll state + progress bar ---------- */
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
    '.hero-media img, .hero-bg, .about-media img, .panel-media img, .cta-media img, [data-speed], [data-parallax]'
  ));

  function onParallax() {
    if (reducedMotion) return;
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
        const speed = parseFloat(el.dataset.speed) || (isHero ? 0.14 : 0.08);
        const rawY = (elCenter - vpCenter) * speed;
        const translateY = Math.max(-42, Math.min(42, rawY));
        let baseScale = 1.32;
        if (isHero) {
          baseScale = isActive ? 1.20 : 1.12;
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

  /* ---------- Hero background video (YouTube IFrame Player API) ---------- */
  const heroVideoEl = document.getElementById('heroVideo');
  const heroVideoWrap = document.getElementById('heroVideoWrap');
  if (heroVideoEl && heroVideoWrap && !reducedMotion) {
    const videoId = heroVideoEl.dataset.videoId;

    window.onYouTubeIframeAPIReady = function () {
      new YT.Player('heroVideo', {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playlist: videoId,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady(e) {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange(e) {
            if (e.data === YT.PlayerState.PLAYING) {
              heroVideoWrap.classList.add('is-loaded');
            } else if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
        },
      });
    };

    const ytScript = document.createElement('script');
    ytScript.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(ytScript);
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

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['hero', 'about', 'products', 'brands', 'rd', 'news', 'contact']
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

  /* ---------- Bento tile 3D tilt ---------- */
  if (!reducedMotion && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tile').forEach((tile) => {
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        tile.style.transform = `perspective(800px) rotateX(${py * -6}deg) rotateY(${px * 6}deg)`;
      });
      tile.addEventListener('mouseleave', () => {
        tile.style.transform = '';
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

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
