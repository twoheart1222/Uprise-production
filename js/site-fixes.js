(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ensureAnimationFallbacks() {
    if (!window.AOS) {
      window.AOS = {
        init: function () {},
        refresh: function () {},
        refreshHard: function () {}
      };
    }
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
      document.body.classList.add('exiting');

      window.setTimeout(function () {
        window.location.href = destination;
      }, prefersReducedMotion ? 0 : 420);
    }, true);

    window.addEventListener('pageshow', function () {
      document.body.classList.remove('exiting');
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
    initSafePageTransitions();
    initMobileMenuState();
    hardenLoader();
  }

  ensureAnimationFallbacks();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
