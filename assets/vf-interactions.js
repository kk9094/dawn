/* Voxel Forge — interactions
 * - Reveal-on-scroll observer for .vf-reveal
 * - Scroll progress CSS var (--vf-scroll-progress: 0..1) on :root
 * - Tier badge entrance (letter-spacing collapse)
 * - Honors prefers-reduced-motion: reduce
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll progress ─────────────────────────────────────────────── */
  var scrollTarget = document.querySelector('.vf-hero-composite');
  var ticking = false;
  function updateScrollProgress() {
    var maxScroll = (scrollTarget ? scrollTarget.offsetHeight : window.innerHeight) || 1;
    var p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty('--vf-scroll-progress', p.toFixed(3));
    ticking = false;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }
  if (!reduceMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollProgress();
  }

  /* ── Reveal observer ─────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.vf-reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ── Tier badge entrance ─────────────────────────────────────────── */
  if (!reduceMotion) {
    var badges = document.querySelectorAll('.vf-card-tier, .vf-tier-strip__label');
    badges.forEach(function (b) {
      b.style.transition = 'letter-spacing 800ms cubic-bezier(0.2, 0.8, 0.2, 1)';
      b.style.letterSpacing = '0.5em';
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          b.style.letterSpacing = '';
        });
      });
    });
  }

  /* ── Newsletter "Sent." crossfade ────────────────────────────────── */
  document.querySelectorAll('form[action*="/contact"][id*="newsletter"], .newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var span = btn.querySelector('span') || btn;
      var original = span.textContent;
      span.style.transition = 'opacity 300ms';
      span.style.opacity = '0';
      setTimeout(function () {
        span.textContent = 'Sent.';
        span.style.opacity = '1';
        setTimeout(function () {
          span.style.opacity = '0';
          setTimeout(function () {
            span.textContent = original;
            span.style.opacity = '1';
          }, 300);
        }, 2400);
      }, 300);
    }, { passive: true });
  });

  /* ── Search close button teleport ───────────────────────────────────
   *
   * PROBLEM: position:fixed is broken when an ancestor has a CSS transform.
   * Dawn's .header__icons (or sticky-header) has a transform matrix applied,
   * which creates a new containing block — so our fixed button ends up
   * anchored to that element instead of the viewport.
   *
   * SOLUTION: When the search modal opens, move the close button to <body>
   * so it is a direct child of the root stacking context. On close, return it.
   * ─────────────────────────────────────────────────────────────────── */
  (function () {
    var searchDetails = document.querySelector('.header__search details');
    if (!searchDetails) return;

    var closeBtn = document.querySelector('.search-modal__close-button');
    if (!closeBtn) return;

    var originalParent = closeBtn.parentNode;
    var originalNextSibling = closeBtn.nextSibling;
    var isTeleported = false;

    function teleportOut() {
      if (isTeleported) return;
      isTeleported = true;
      document.body.appendChild(closeBtn);
      closeBtn.setAttribute('data-vf-teleported', '1');
    }

    function teleportBack() {
      if (!isTeleported) return;
      isTeleported = false;
      if (originalNextSibling) {
        originalParent.insertBefore(closeBtn, originalNextSibling);
      } else {
        originalParent.appendChild(closeBtn);
      }
      closeBtn.removeAttribute('data-vf-teleported');
    }

    /* Watch the details[open] attribute */
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'open') {
          if (searchDetails.hasAttribute('open')) {
            teleportOut();
          } else {
            teleportBack();
          }
        }
      });
    });

    observer.observe(searchDetails, { attributes: true, attributeFilter: ['open'] });

    /* Edge case: if already open on load */
    if (searchDetails.hasAttribute('open')) teleportOut();
  })();

})();
