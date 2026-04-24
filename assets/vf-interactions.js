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

  /* ── Search overlay teleport — Apple/Nike style full-screen ──────────
   *
   * PROBLEM: The .search-modal lives inside the Dawn header's stacking
   * context. No CSS z-index trick can make a child of z:9000 header
   * paint truly above everything at the root level (browser chrome,
   * other fixed elements). Also, overflow/clip on ancestor elements
   * prevents full-viewport coverage.
   *
   * SOLUTION: When search opens, physically move the entire .search-modal
   * div to document.body. At body level it is subject ONLY to the root
   * stacking context — position:fixed; inset:0 then truly means 100vw×100vh.
   * On close, return it to its original parent so Dawn's JS still owns it.
   * ─────────────────────────────────────────────────────────────────── */
  (function () {
    var detailsModal  = document.querySelector('details-modal.header__search');
    var searchDetails = detailsModal && detailsModal.querySelector('details');
    var searchModal   = document.querySelector('.search-modal');

    if (!detailsModal || !searchDetails || !searchModal) return;

    /* Remember where the modal lives in the original DOM */
    var originalParent      = searchModal.parentNode;
    var originalNextSibling = searchModal.nextSibling;
    var isTeleported        = false;

    /* ── Teleport OUT to body ── */
    function teleportOut() {
      if (isTeleported) return;
      isTeleported = true;
      document.body.appendChild(searchModal);

      /* Focus the search input after the modal lands on body */
      var input = searchModal.querySelector('input[type="search"], .search__input');
      if (input) {
        requestAnimationFrame(function () { input.focus(); });
      }
    }

    /* ── Teleport BACK to original position ── */
    function teleportBack() {
      if (!isTeleported) return;
      isTeleported = false;
      if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
        originalParent.insertBefore(searchModal, originalNextSibling);
      } else {
        originalParent.appendChild(searchModal);
      }
    }

    /* ── Wire up the close button (now inside the teleported modal) ──
       Dawn's original handler was bound to detailsModal at construction
       via: this.querySelector('button[type="button"]').addEventListener(...)
       That binding is still alive. After teleport the button is no longer
       a descendant of detailsModal, so we add our own listener that calls
       the same detailsModal.close() method directly. */
    var closeBtn = searchModal.querySelector('.search-modal__close-button');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof detailsModal.close === 'function') {
          detailsModal.close(true);
        }
      });
    }

    /* Also close on backdrop click (clicking the dark area, not the form) */
    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) {
        if (typeof detailsModal.close === 'function') {
          detailsModal.close(true);
        }
      }
    });

    /* ── MutationObserver: watch details[open] ── */
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'open') {
          if (searchDetails.hasAttribute('open')) {
            teleportOut();
          } else {
            teleportBack();
          }
        }
      });
    });

    observer.observe(searchDetails, { attributes: true, attributeFilter: ['open'] });

    /* Edge case: already open on load */
    if (searchDetails.hasAttribute('open')) teleportOut();
  })();

})();
