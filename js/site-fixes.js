(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var internalTransitionKey = 'upriseInternalPageTransition';

  function readAndClearInternalTransitionFlag() {
    try {
      if (window.sessionStorage.getItem(internalTransitionKey) !== '1') return false;
      window.sessionStorage.removeItem(internalTransitionKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function markInternalTransition() {
    try {
      window.sessionStorage.setItem(internalTransitionKey, '1');
    } catch (error) {
      // Session storage can be unavailable in strict privacy modes; the transition still works without it.
    }
  }

  function applyInternalNavigationState() {
    if (!readAndClearInternalTransitionFlag() || !document.body) return;

    document.body.classList.add('internal-navigation', 'loaded-state');
    document.body.classList.remove('loading-state');

    var loader = document.querySelector('.loader');
    if (loader) loader.classList.add('hidden');
  }

  function ensureTransitionLogo() {
    var curtain = document.querySelector('.page-transition-curtain');
    if (!curtain) return;

    var logo = curtain.querySelector('.page-transition-logo');
    if (!logo) {
      logo = document.createElement('img');
      logo.className = 'page-transition-logo';
      logo.alt = '';
      logo.setAttribute('aria-hidden', 'true');
      curtain.appendChild(logo);
    }

    var source =
      document.querySelector('.logo img') ||
      document.querySelector('.loader-logo-img') ||
      document.querySelector('link[rel="icon"]');

    if (source) {
      logo.src = source.currentSrc || source.src || source.href || 'siteicon.png';
    } else {
      logo.src = 'siteicon.png';
    }
  }

  function ensureAnimationFallbacks() {
    if (!window.AOS) {
      window.AOS = {
        init: function () {},
        refresh: function () {},
        refreshHard: function () {}
      };
    }
  }

  function revealAosElementsIfNeeded() {
    window.setTimeout(function () {
      if (window.AOS && window.AOS.refresh) window.AOS.refresh();

      var stuckElements = Array.prototype.slice.call(document.querySelectorAll('[data-aos]:not(.aos-animate)'));
      stuckElements.forEach(function (element) {
        element.classList.add('aos-init', 'aos-animate');
      });
    }, 900);
  }

  function allowDefaultUserActions() {
    document.onkeydown = null;
    document.oncontextmenu = null;
    document.documentElement.oncontextmenu = null;

    ['contextmenu', 'copy'].forEach(function (eventName) {
      window.addEventListener(eventName, function (event) {
        event.stopImmediatePropagation();
      }, true);
    });
  }

  function getPageMeta() {
    var rawPage = (window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index').toLowerCase();
    var page = rawPage.replace(/\.html?$/, '') || 'index';
    var map = {
      index: { key: 'home', rail: 'HOME', word: 'UPRISE', kicker: 'Cinematic Production' },
      works: { key: 'works', rail: 'WORKS', word: 'WORKS', kicker: 'Selected Films' },
      team: { key: 'team', rail: 'TEAM', word: 'CREW', kicker: 'Behind The Lens' },
      about: { key: 'about', rail: 'ABOUT', word: 'STORY', kicker: 'Studio Profile' },
      contact: { key: 'contact', rail: 'CONTACT', word: 'BRIEF', kicker: 'Start A Project' },
      member: { key: 'member', rail: 'PROFILE', word: 'PROFILE', kicker: 'Film Profile' },
      success: { key: 'success', rail: 'SENT', word: 'SENT', kicker: 'Message Received' }
    };

    return map[page] || map.index;
  }

  function getHeroElement() {
    return document.querySelector('.hero, .works-hero, .team-hero, .about-hero, .contact-hero, .member-page-header, .success-card');
  }

  function ensureEditorialChrome() {
    var meta = getPageMeta();
    document.body.classList.add('uprise-editorial');
    document.body.setAttribute('data-page', meta.key);

    if (!document.querySelector('.uprise-scroll-progress')) {
      var progress = document.createElement('div');
      progress.className = 'uprise-scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      progress.innerHTML = '<span></span>';
      document.body.appendChild(progress);
    }

    if (!document.querySelector('.uprise-page-rail')) {
      var rail = document.createElement('div');
      rail.className = 'uprise-page-rail';
      rail.setAttribute('aria-hidden', 'true');
      rail.innerHTML = '<span>' + meta.rail + '</span>';
      document.body.appendChild(rail);
    }

    var hero = getHeroElement();
    if (hero) {
      if (!hero.querySelector('.uprise-hero-kicker')) {
        var kicker = document.createElement('div');
        kicker.className = 'uprise-hero-kicker';
        kicker.textContent = meta.kicker;
        hero.insertBefore(kicker, hero.firstChild);
      }

      if (!hero.querySelector('.uprise-hero-word')) {
        var word = document.createElement('div');
        word.className = 'uprise-hero-word';
        word.setAttribute('aria-hidden', 'true');
        word.textContent = meta.word;
        hero.appendChild(word);
      }
    }
  }

  function updateEditorialScroll() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, window.scrollY / max));
    document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
    document.documentElement.style.setProperty('--ui-scroll', Math.round(window.scrollY));
  }

  function initEditorialScroll() {
    var ticking = false;

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        updateEditorialScroll();
      });
    }

    updateEditorialScroll();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function annotateEditorialItems() {
    var groups = [
      '.service-card',
      '.work-card',
      '.member-card',
      '.glass-card',
      '.success-card',
      '.process-item',
      '.bts-item',
      '.category-section'
    ];

    groups.forEach(function (selector) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (element, index) {
        element.setAttribute('data-editorial-index', String(index + 1).padStart(2, '0'));
      });
    });
  }

  function initEditorialSystem() {
    ensureEditorialChrome();
    initEditorialScroll();
    annotateEditorialItems();

    window.setTimeout(function () {
      ensureEditorialChrome();
      annotateEditorialItems();
      updateEditorialScroll();
    }, 700);
  }

  function normalizeUrl(href) {
    try {
      return new URL(href, window.location.href);
    } catch (error) {
      return null;
    }
  }

  function getInternalHtmlUrl(event, link) {
    if (!link || event.defaultPrevented) return false;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;

    var url = normalizeUrl(link.getAttribute('href'));
    if (!url) return false;
    if (url.origin !== window.location.origin) return false;
    if (!/\.html?$/.test(url.pathname) && !url.pathname.endsWith('/')) return false;

    return url;
  }

  function shouldTransition(url) {
    if (!url) return false;

    var current = new URL(window.location.href);
    var samePage = url.pathname === current.pathname && url.search === current.search;
    if (samePage && url.hash) return false;
    if (samePage && !url.hash) return false;

    return true;
  }

  function initSafePageTransitions() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a.page-link, a.logo');
      var url = getInternalHtmlUrl(event, link);
      if (!url) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (!shouldTransition(url)) return;

      var destination = link.href;
      ensureTransitionLogo();
      markInternalTransition();
      document.body.classList.add('exiting');

      window.setTimeout(function () {
        window.location.href = destination;
      }, prefersReducedMotion ? 0 : 760);
    }, true);

    window.addEventListener('pageshow', function () {
      document.body.classList.remove('exiting');
    });
  }

  function initRefinedRevealMotion() {
    var selector = [
      '.section-header',
      '.service-card',
      '.work-card',
      '.member-card',
      '.glass-card',
      '.process-item',
      '.bts-item',
      '.category-section',
      '.footer-content'
    ].join(',');

    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;

    nodes.forEach(function (node, index) {
      if (node.classList.contains('ui-reveal')) return;
      node.classList.add('ui-reveal');
      node.style.setProperty('--reveal-delay', Math.min(index % 6, 5) * 55 + 'ms');
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function initPointerSpotlight() {
    var selector = '.service-card, .work-card, .member-card, .glass-card, .process-item, .bts-item, .category-card, .contact-panel, .interactive-list-item, .editorial-card';
    var cards = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!cards.length || prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    cards.forEach(function (card) {
      if (card.dataset.uiTiltBound === 'true') return;
      card.dataset.uiTiltBound = 'true';
      card.classList.add('ui-tilt');

      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var rotateY = ((x / rect.width) - 0.5) * 5;
        var rotateX = ((0.5 - (y / rect.height)) * 5);

        card.style.setProperty('--spot-x', x + 'px');
        card.style.setProperty('--spot-y', y + 'px');
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.classList.add('is-leaving');
        card.style.transform = '';
        window.setTimeout(function () {
          card.classList.remove('is-leaving');
        }, 620);
      });
    });
  }

  function initMotionRefreshHooks() {
    var refresh = function () {
      window.setTimeout(function () {
        initRefinedRevealMotion();
        initPointerSpotlight();
        annotateEditorialItems();
        updateEditorialScroll();
      }, 120);
    };

    refresh();
    window.addEventListener('load', refresh);

    var targets = ['works-wrapper', 'team-grid', 'services-grid', 'bts-grid', 'process-section', 'member-detail'];
    targets.forEach(function (id) {
      var target = document.getElementById(id);
      if (!target || !('MutationObserver' in window)) return;
      var observer = new MutationObserver(refresh);
      observer.observe(target, { childList: true, subtree: true });
    });
  }

  function initMobileMenuState() {
    var menu = document.getElementById('mobile-menu');
    var hamburger = document.getElementById('hamburger') || document.getElementById('hamburger-btn');
    if (!menu || !hamburger) return;

    if (!hamburger.hasAttribute('type')) hamburger.setAttribute('type', 'button');
    hamburger.setAttribute('aria-controls', menu.id);
    hamburger.setAttribute('aria-expanded', menu.classList.contains('active') ? 'true' : 'false');
    menu.setAttribute('aria-hidden', menu.classList.contains('active') ? 'false' : 'true');

    function syncMenuState() {
      var open = menu.classList.contains('active');
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    hamburger.addEventListener('click', function () {
      window.setTimeout(syncMenuState, 0);
    }, true);

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        window.setTimeout(syncMenuState, 0);
      }
    }, true);

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !menu.classList.contains('active')) return;
      menu.classList.remove('active');
      hamburger.classList.remove('active');
      syncMenuState();
      hamburger.focus();
    });

    syncMenuState();
  }

  function hardenLoader() {
    var loader = document.querySelector('.loader');
    if (!loader) return;

    window.setTimeout(function () {
      if (document.body.classList.contains('loading-state')) {
        loader.classList.add('hidden');
        document.body.classList.remove('loading-state');
        document.body.classList.add('loaded-state');
      }
    }, 2500);
  }

  function init() {
    allowDefaultUserActions();
    initEditorialSystem();
    initSafePageTransitions();
    initMobileMenuState();
    initMotionRefreshHooks();
    revealAosElementsIfNeeded();
    hardenLoader();
  }

  ensureAnimationFallbacks();
  applyInternalNavigationState();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
