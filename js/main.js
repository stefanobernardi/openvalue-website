/* ============================================================
   OPEN VALUE — Digital Money Edition
   js/main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = navMenu.querySelectorAll('a[href^="#"]');
  const sections    = document.querySelectorAll('section[id]');
  const reveals     = document.querySelectorAll('.reveal');

  /* ---------- Navbar: shrink on scroll ---------- */
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- Active link tracking ---------- */
  function updateActiveLink() {
    var scrollPos = window.scrollY + navbar.offsetHeight + 80;

    sections.forEach(function (sec) {
      var top    = sec.offsetTop;
      var bottom = top + sec.offsetHeight;

      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + sec.id) {
          if (scrollPos >= top && scrollPos < bottom) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    });
  }

  /* ---------- Hamburger menu ---------- */
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    var isOpen = navMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset   = navbar.offsetHeight + 20;
      var position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Image fallback ---------- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      handleImageError(this);
    });
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
  });

  function handleImageError(img) {
    if (!img.parentElement) return;

    var label    = img.getAttribute('data-fallback') || '';
    var initials = img.getAttribute('data-initials') || label.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase();
    var wrapper  = document.createElement('div');
    var parent   = img.parentElement;

    if (img.closest('.speaker-card')) {
      wrapper.className = 'speaker-placeholder';
      wrapper.textContent = initials;
    } else if (img.closest('.partner-card')) {
      img.remove();
      parent.classList.add('placeholder-card');
      return;
    } else if (img.closest('.sponsor-logo-box') || img.closest('.hero-presented-logos')) {
      wrapper.className = 'sponsor-logo-placeholder';
      wrapper.textContent = label;
    } else {
      wrapper.className = 'luogo-image-placeholder';
      wrapper.textContent = label;
    }

    parent.replaceChild(wrapper, img);
  }

})();
