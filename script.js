(function () {
  'use strict';

  /* ============ Site nav ============ */
  var siteNav = document.getElementById('site-nav');
  var heroSection = document.querySelector('.hero');

  if (siteNav && heroSection) {
    function updateNavBackdrop() {
      var scrolledPastHero = heroSection.getBoundingClientRect().bottom <= 0;
      siteNav.classList.toggle('is-scrolled', scrolledPastHero);
    }

    window.addEventListener('scroll', updateNavBackdrop, { passive: true });
    updateNavBackdrop();

    siteNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ============ Scroll fade-ins ============ */
  var fadeSections = document.querySelectorAll('.fade-section');
  var fadeObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  fadeSections.forEach(function (section) { fadeObserver.observe(section); });

  /* ============ Stat counter animation ============ */
  var statsSection = document.getElementById('stats');
  if (statsSection) {
    var statObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    statObserver.observe(statsSection);
  }

  function animateStats() {
    var duration = 700;
    var startTime = null;
    var counters = document.querySelectorAll('.stat-number[data-target]');

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      counters.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var current = Math.round(progress * target);
        if (el.getAttribute('data-stat') === 'ratio') {
          el.textContent = current + ':1';
        } else {
          el.textContent = current;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counters.forEach(function (el) {
          el.textContent = el.getAttribute('data-final');
        });
      }
    }

    requestAnimationFrame(tick);
  }

  /* ============ Waitlist pill counter ============ */
  var quotesSectionEl = document.getElementById('quotes');
  if (quotesSectionEl) {
    var pillObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateWaitlistPill();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    pillObserver.observe(quotesSectionEl);
  }

  function animateWaitlistPill() {
    var counterEl = document.querySelector('.waitlist-pill-count[data-target]');
    if (!counterEl) return;

    var target = parseInt(counterEl.getAttribute('data-target'), 10);
    var duration = 1400;
    var startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      var linearProgress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutCubic(linearProgress);
      counterEl.textContent = Math.round(eased * target);

      if (linearProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        counterEl.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  /* ============ Hero screenshot carousel (3D card flip) ============ */
  var carousel = document.getElementById('hero-carousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    var current = 0;

    function applySlideTransforms() {
      slides.forEach(function (slide, index) {
        var delta = (index - current + 4) % 4;
        var angle;
        if (delta === 0) angle = 0;
        else if (delta === 1) angle = 90;
        else if (delta === 3) angle = -90;
        else angle = 180;

        slide.style.transform = 'rotateY(' + angle + 'deg)';
        slide.style.opacity = delta === 0 ? '1' : '0';
        slide.style.zIndex = delta === 0 ? '2' : '1';
      });
    }

    function goToSlide(index) {
      current = index;
      applySlideTransforms();
    }

    // Static fallback (pre-JS) shows the A&P slide; autoplay starts from the
    // first slide (login) the moment this script runs.
    goToSlide(0);

    var carouselInterval = setInterval(function () {
      goToSlide((current + 1) % slides.length);
    }, 2000);

    // No SPA teardown on a static page, but clear the interval on unload
    // anyway rather than leaving it dangling for the tab's lifetime.
    window.addEventListener('beforeunload', function () {
      clearInterval(carouselInterval);
    });
  }

  /* ============ Phone mockup parallax ============ */
  var heroPhones = document.querySelectorAll('[data-parallax="hero"]');
  var secondaryPhones = document.querySelectorAll('[data-parallax="secondary"], [data-parallax="showcase"]');
  var ticking = false;

  function updateParallax() {
    var scrollY = window.scrollY;
    var heroOffset = -Math.min(24, scrollY * 0.06);
    var subOffset = -Math.min(14, scrollY * 0.015);

    heroPhones.forEach(function (el) {
      el.style.transform = 'translateY(' + heroOffset + 'px)';
    });
    secondaryPhones.forEach(function (el) {
      el.style.transform = 'translateY(' + subOffset + 'px)';
    });

    ticking = false;
  }

  function onScrollParallax() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  [].concat([].slice.call(heroPhones), [].slice.call(secondaryPhones)).forEach(function (el) {
    el.style.transition = 'transform 60ms linear';
  });

  window.addEventListener('scroll', onScrollParallax, { passive: true });
  updateParallax();

  /* ============ Sticky mobile CTA ============ */
  var stickyCta = document.getElementById('sticky-cta');

  function updateStickyCta() {
    var shouldShow = window.scrollY > 480 && window.innerWidth < 760;
    stickyCta.classList.toggle('visible', shouldShow);
  }

  if (stickyCta) {
    window.addEventListener('scroll', updateStickyCta, { passive: true });
    window.addEventListener('resize', updateStickyCta);
    updateStickyCta();
  }

  /* ============ Social proof section toggle ============
     Set to false to hide the "What residents are saying" section entirely. */
  var SHOW_QUOTES_SECTION = true;
  if (!SHOW_QUOTES_SECTION) {
    var quotesSection = document.querySelector('[data-section-flag="quotes"]');
    if (quotesSection) quotesSection.style.display = 'none';
  }
})();
