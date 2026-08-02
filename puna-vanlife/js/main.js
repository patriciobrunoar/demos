(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Graceful image fallback (assets handling) ---------- */
  function handleImgFallback(img) {
    const wrap = img.closest('[data-media]');
    const fallbackText = img.dataset.fallbackText;
    if (fallbackText) {
      const span = document.createElement('span');
      span.className = 'logo-word';
      if (fallbackText.includes(' ')) {
        span.textContent = fallbackText;
      } else {
        const splitAt = Math.max(1, fallbackText.length - 4);
        span.innerHTML = fallbackText.slice(0, splitAt) + '<span class="accent">' + fallbackText.slice(splitAt) + '</span>';
      }
      img.replaceWith(span);
    } else if (wrap) {
      img.style.display = 'none';
      const siblings = wrap.querySelectorAll('img');
      const allFailed = Array.from(siblings).every((im) => im.style.display === 'none');
      if (allFailed) wrap.classList.add('no-media');
    }
  }

  document.querySelectorAll('[data-media] img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      handleImgFallback(img);
    } else {
      img.addEventListener('error', () => handleImgFallback(img), { once: true });
    }
  });

  /* ---------- Hero background rotation (crossfade) ---------- */
  const heroBgs = document.querySelectorAll('.hero-bg');
  if (heroBgs.length > 1 && !reducedMotion) {
    let heroIdx = 0;
    setInterval(() => {
      heroBgs[heroIdx].classList.remove('is-active');
      heroIdx = (heroIdx + 1) % heroBgs.length;
      heroBgs[heroIdx].classList.add('is-active');
    }, 6500);
  }

  /* ---------- Nav scroll state + progress bar + back-to-top ---------- */
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');
  const toTop = document.getElementById('toTop');

  function onScrollUI() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('visible', y > 700);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ---------- Parallax (rAF throttled) ---------- */
  const parallaxTargets = Array.from(document.querySelectorAll(
    '.hero-media img, .hero-bg, .about-visual img, .cta-media img, [data-speed], [data-parallax]'
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

  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToY(0, reducedMotion ? 0 : 800);
    });
  }

  /* ---------- Smooth Scroll with Responsive Eased Animation Curve ---------- */
  let scrollAnimId = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollToY(targetY, duration = 800) {
    if (scrollAnimId) {
      cancelAnimationFrame(scrollAnimId);
      scrollAnimId = null;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 4) return;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        scrollAnimId = requestAnimationFrame(step);
      } else {
        scrollAnimId = null;
      }
    }

    scrollAnimId = requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || !href) return;
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 76;
        const targetY = Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - navHeight);
        scrollToY(targetY, reducedMotion ? 0 : 850);
      }
    });
  });

  /* ---------- Custom ring cursor (trails with easing, grows on hover) ---------- */
  const ring = document.getElementById('cursorRing');
  if (!reducedMotion && matchMedia('(hover: hover)').matches && ring) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ring.classList.add('is-active');
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    const hoverables = document.querySelectorAll('a, button, input, textarea, [data-media], .product-card, .event-card, .bento-card');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- Magnetic Buttons ---------- */
  const magnetics = document.querySelectorAll('.magnetic');
  if (!reducedMotion && matchMedia('(hover: hover)').matches) {
    magnetics.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--btn-x', `${x * 0.25}px`);
        btn.style.setProperty('--btn-y', `${y * 0.25}px`);
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--btn-x', '0px');
        btn.style.setProperty('--btn-y', '0px');
      });
    });
  }

  /* ---------- IntersectionObserver for Scroll Reveals ---------- */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ---------- Mobile burger menu ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---------- Contact form submit mock ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent!</span>';
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });
  }

})();
