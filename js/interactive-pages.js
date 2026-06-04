(function () {
  "use strict";

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const FIREBASE_PROJECT = "uprise-videoproduction-admin";
  const FIREBASE_KEY = "AIzaSyCyC9CaF36J27mjCl908TFCukNtwAilM4o";

  const text = {
    aboutTitle: "\u95dc\u65bc Uprise",
    aboutSubtitle: "\u6211\u5011\u4ee5\u5f71\u50cf\u70ba\u6a4b\uff0c\u628a\u54c1\u724c\u3001\u4eba\u7269\u8207\u5834\u666f\u7684\u771f\u5be6\u91cd\u91cf\u62cd\u51fa\u4f86\u3002",
    contactTitle: "\u806f\u7d61\u6211\u5011",
    contactSubtitle: "\u544a\u8a34\u6211\u5011\u4f60\u7684\u9700\u6c42\uff0c\u6211\u5011\u6703\u5354\u52a9\u4f60\u628a\u60f3\u6cd5\u8f49\u6210\u53ef\u88ab\u770b\u898b\u7684\u5f71\u50cf\u3002",
    successTitle: "\u8a0a\u606f\u5df2\u9001\u51fa",
    successBody: "\u8b1d\u8b1d\u4f60\u7684\u4f86\u4fe1\uff0c\u6211\u5011\u5df2\u6536\u5230\u4f60\u7684\u9700\u6c42\u3002<br>\u5718\u968a\u6703\u76e1\u5feb\u56de\u8986\uff0c\u548c\u4f60\u4e00\u8d77\u628a\u5c08\u6848\u5f80\u524d\u63a8\u9032\u3002"
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("uprise-interactive-page");
    if (page === "about.html") enhanceAbout();
    if (page === "contact.html") enhanceContact();
    if (page === "index.html" || page === "") enhanceHome();
    if (page === "success.html") enhanceSuccess();
    initInteractiveMotion();
  });

  async function loadPage(pageName) {
    try {
      if (window.loadFirebasePage) {
        const data = await window.loadFirebasePage(pageName);
        if (data) return data;
      }
    } catch (error) {
      console.warn("[interactive] Firebase module fallback", error);
    }
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/pages/${pageName}?key=${FIREBASE_KEY}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const doc = await response.json();
      return firestoreFieldsToObject(doc.fields || {});
    } catch (error) {
      console.warn("[interactive] Firebase REST fallback", error);
      return null;
    }
  }

  function firestoreFieldsToObject(fields) {
    const output = {};
    Object.entries(fields || {}).forEach(([key, value]) => {
      output[key] = firestoreValueToJs(value);
    });
    return output;
  }

  function firestoreValueToJs(value) {
    if (!value) return null;
    if ("stringValue" in value) return value.stringValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return Number(value.doubleValue);
    if ("booleanValue" in value) return value.booleanValue;
    if ("arrayValue" in value) return (value.arrayValue.values || []).map(firestoreValueToJs);
    if ("mapValue" in value) return firestoreFieldsToObject(value.mapValue.fields || {});
    if ("nullValue" in value) return null;
    return null;
  }

  async function enhanceAbout() {
    const main = document.querySelector("main");
    if (!main) return;
    main.classList.add("interactive-main");

    const render = (incoming = {}) => {
      const data = incoming || {};
      const title = clean(data.title) || text.aboutTitle;
      const subtitle = clean(data.subtitle) || text.aboutSubtitle;
      const body = clean(data.body) || "\u5f71\u50cf\u4e0d\u53ea\u662f\u8a18\u9304\uff0c\u4e5f\u662f\u4e00\u7a2e\u7406\u89e3\u3002\u6211\u5011\u5728\u524d\u671f\u7b56\u5283\u3001\u62cd\u651d\u73fe\u5834\u8207\u5f8c\u671f\u88fd\u4f5c\u4e4b\u9593\uff0c\u627e\u5230\u6700\u80fd\u627f\u8f09\u60c5\u7dd2\u8207\u8a0a\u606f\u7684\u7bc0\u594f\u3002";
      const processList = Array.isArray(data.process_list) ? data.process_list : [
        { step: "\u6df1\u5ea6\u7406\u89e3", desc: "\u91d0\u6e05\u5c08\u6848\u76ee\u6a19\u3001\u89c0\u773e\u8207\u8996\u89ba\u8abf\u6027\u3002" },
        { step: "\u7b56\u5283\u62cd\u651d", desc: "\u5efa\u7acb\u5206\u93e1\u3001\u5834\u666f\u8207\u73fe\u5834\u57f7\u884c\u7bc0\u594f\u3002" },
        { step: "\u5f8c\u671f\u5b8c\u6210", desc: "\u4ee5\u526a\u8f2f\u3001\u8272\u5f69\u8207\u8072\u97f3\u5b8c\u6210\u5f71\u50cf\u8a9e\u6c23\u3002" }
      ];

      main.innerHTML = `
        <section class="editorial-hero about-hero">
          <div>
            <span class="editorial-kicker reveal-soft">ABOUT US</span>
            <h1 class="editorial-title reveal-soft" id="page-title">${escapeHtml(title)}<span class="thin">Production</span></h1>
          </div>
          <div class="editorial-deck reveal-soft" id="page-subtitle">${escapeHtml(subtitle)}</div>
        </section>
        <section class="editorial-section editorial-grid">
          <aside class="editorial-card reveal-soft" data-tilt-card>
            <div class="editorial-meta">Studio Note</div>
            <div class="editorial-number">01</div>
            <p class="editorial-copy">\u6211\u5011\u628a\u6bcf\u500b\u6848\u5b50\u7576\u6210\u4e00\u5247\u5c01\u9762\u6545\u4e8b\uff0c\u5148\u627e\u5230\u4e3b\u89d2\u7684\u5149\uff0c\u518d\u8a2d\u8a08\u5c6c\u65bc\u5b83\u7684\u7bc0\u594f\u3002</p>
            <div class="editorial-actions">
              <a class="editorial-button hover-trigger" href="works.html">\u89c0\u770b\u4f5c\u54c1 <i class="fas fa-arrow-right"></i></a>
            </div>
          </aside>
          <article id="cms-body" class="interactive-cms reveal-soft">${renderMarkdown(body)}</article>
        </section>
        <section id="process-section" class="editorial-section">
          <h2 class="block-title reveal-soft">\u5de5\u4f5c\u6d41\u7a0b</h2>
          <div class="interactive-list">
            ${processList.map((item, index) => `
              <div class="interactive-list-item reveal-soft" data-tilt-card>
                <div class="step-num">${String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h3>${escapeHtml(item.step || item.title || "")}</h3>
                  <p>${escapeHtml(item.desc || item.content || "")}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      `;

      refreshAos();
      initInteractiveMotion(main);
    };

    render(await loadPage("about") || {});
    subscribePage("about", render);
  }

  async function enhanceContact() {
    const main = document.querySelector("main");
    if (!main) return;
    main.classList.add("interactive-main");

    const render = (incoming = {}) => {
      const data = incoming || {};
      const title = clean(data.title) || text.contactTitle;
      const subtitle = clean(data.subtitle) || text.contactSubtitle;
      const email = clean(data.email) || "service@uprise.com";
      const phone = clean(data.phone) || "+886 937 672 279";
      const address = clean(data.address) || "\u9ad8\u96c4\u5e02\u524d\u93ae\u5340";
      const formspreeId = clean(data.formspree_id) || "movbylbl";

      main.innerHTML = `
        <section class="editorial-hero contact-hero">
          <div>
            <span class="editorial-kicker reveal-soft">CONTACT</span>
            <h1 class="editorial-title reveal-soft" id="page-title">${escapeHtml(title)}<span class="thin">Let's Talk</span></h1>
          </div>
          <div class="editorial-deck reveal-soft" id="page-subtitle">${escapeHtml(subtitle)}</div>
        </section>
        <section class="contact-interactive-grid">
          <aside class="editorial-card contact-panel reveal-soft" data-tilt-card>
            <div class="editorial-meta">Start a Project</div>
            <p class="editorial-copy">\u5206\u4eab\u4f60\u7684\u76ee\u6a19\u3001\u6642\u7a0b\u8207\u671f\u5f85\u98a8\u683c\uff0c\u6211\u5011\u6703\u5354\u52a9\u6574\u7406\u6210\u53ef\u57f7\u884c\u7684\u5f71\u50cf\u65b9\u6848\u3002</p>
            <div class="contact-method">
              <i class="fas fa-location-dot"></i>
              <div><label>Address</label><p id="info-address">${escapeHtml(address)}</p></div>
            </div>
            <div class="contact-method">
              <i class="fas fa-envelope"></i>
              <div><label>Email</label><a id="info-email" class="hover-trigger" href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a></div>
            </div>
            <div class="contact-method">
              <i class="fas fa-phone"></i>
              <div><label>Phone</label><a id="info-phone" class="hover-trigger" href="tel:${phone.replace(/\D/g, "")}">${escapeHtml(phone)}</a></div>
            </div>
          </aside>
          <article class="editorial-card reveal-soft" data-tilt-card>
            <form id="contact-form" class="editorial-form" action="https://formspree.io/f/${escapeAttr(formspreeId)}" method="POST">
              <input type="hidden" name="_subject" value="Uprise website inquiry">
              <div class="editorial-field">
                <label>\u59d3\u540d / \u516c\u53f8\u540d\u7a31</label>
                <input type="text" name="name" required placeholder="\u8acb\u8f38\u5165\u60a8\u7684\u59d3\u540d">
              </div>
              <div class="editorial-field">
                <label>\u806f\u7d61\u96fb\u8a71</label>
                <input type="tel" name="phone" required placeholder="09xx-xxx-xxx">
              </div>
              <div class="editorial-field">
                <label>Email</label>
                <input type="email" name="email" required placeholder="example@mail.com">
              </div>
              <div class="editorial-field">
                <label>\u9700\u6c42\u5167\u5bb9</label>
                <textarea name="message" required placeholder="\u8acb\u7c21\u55ae\u8aaa\u660e\u5c08\u6848\u985e\u578b\u3001\u6642\u7a0b\u8207\u9810\u7b97\u7bc4\u570d"></textarea>
              </div>
              <button type="submit" id="submit-btn" class="editorial-submit hover-trigger">\u9001\u51fa\u8a0a\u606f</button>
            </form>
          </article>
        </section>
      `;

      const form = document.getElementById("contact-form");
      form?.addEventListener("submit", submitContactForm);
      refreshAos();
      initInteractiveMotion(main);
    };

    render(await loadPage("contact") || {});
    subscribePage("contact", render);
  }

  function enhanceHome() {
    const main = document.querySelector("main");
    if (!main) return;
    main.classList.add("interactive-main");

    const hero = document.getElementById("hero-section");
    hero?.classList.add("interactive-home-hero");

    const services = document.getElementById("services-section");
    if (services && !document.querySelector(".home-editorial-strip")) {
      services.insertAdjacentHTML("beforebegin", `
        <section class="home-editorial-strip reveal-soft">
          <div class="home-editorial-chip" data-tilt-card><span>01</span><p>\u5f9e\u7b56\u5283\u5230\u5f8c\u671f\uff0c\u4ee5\u660e\u78ba\u7bc0\u594f\u5b8c\u6210\u5f71\u50cf\u65b9\u6848\u3002</p></div>
          <div class="home-editorial-chip" data-tilt-card><span>02</span><p>\u4ee5\u96fb\u5f71\u611f\u756b\u9762\u8207\u5546\u696d\u601d\u7dad\uff0c\u653e\u5927\u54c1\u724c\u8a18\u61b6\u9ede\u3002</p></div>
          <div class="home-editorial-chip" data-tilt-card><span>03</span><p>\u8b93\u6bcf\u500b\u93e1\u982d\u90fd\u6709\u529f\u80fd\uff0c\u4e5f\u6709\u53ef\u88ab\u611f\u53d7\u7684\u6eab\u5ea6\u3002</p></div>
        </section>
      `);
    }

    document.querySelectorAll(".services-grid, .bts-grid").forEach(grid => {
      const observer = new MutationObserver(() => prepareDynamicCards(grid));
      observer.observe(grid, { childList: true, subtree: true });
      prepareDynamicCards(grid);
    });

    refreshAos();
    initInteractiveMotion(main);
  }

  function enhanceSuccess() {
    const card = document.querySelector(".success-card");
    if (!card) return;
    card.classList.add("success-interactive-card", "editorial-card");
    card.setAttribute("data-tilt-card", "");
    card.innerHTML = `
      <div class="border-shimmer"></div>
      <div class="success-orbit"></div>
      <div class="success-icon-wrap"><i class="fas fa-check"></i></div>
      <span class="editorial-kicker" style="justify-content:center;margin-bottom:20px">Message Received</span>
      <h1>${text.successTitle}</h1>
      <p>${text.successBody}</p>
      <a href="index.html" class="btn-primary hover-trigger magnetic-btn page-link">\u56de\u5230\u9996\u9801</a>
    `;
    initInteractiveMotion(card);
  }

  async function submitContactForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "\u9001\u51fa\u4e2d...";
    try {
      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Submit failed");
      button.textContent = "\u5df2\u9001\u51fa";
      button.style.background = "#28a745";
      form.reset();
      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.style.background = "";
      }, 2600);
    } catch (error) {
      button.textContent = "\u9001\u51fa\u5931\u6557\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66";
      button.style.background = "#dc3545";
      setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.style.background = "";
      }, 2600);
    }
  }

  function prepareDynamicCards(grid) {
    grid.querySelectorAll(":scope > *").forEach((card, index) => {
      card.classList.add("editorial-card", "reveal-soft");
      card.setAttribute("data-tilt-card", "");
      card.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    });
    revealNow();
    initInteractiveMotion(grid);
  }

  function initInteractiveMotion(scope = document) {
    initSpotlight();
    initTilt(scope);
    initReveal(scope);
  }

  function initSpotlight() {
    if (document.documentElement.dataset.spotlightReady) return;
    document.documentElement.dataset.spotlightReady = "1";
    window.addEventListener("pointermove", event => {
      document.documentElement.style.setProperty("--spot-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--spot-y", `${event.clientY}px`);
      document.documentElement.style.setProperty("--parallax-x", `${event.clientX - window.innerWidth / 2}`);
      document.documentElement.style.setProperty("--parallax-y", `${event.clientY - window.innerHeight / 2}`);
    }, { passive: true });
  }

  function initTilt(scope = document) {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    scope.querySelectorAll("[data-tilt-card]:not([data-tilt-ready])").forEach(card => {
      card.dataset.tiltReady = "1";
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - .5) * 8;
        const rotateX = ((y / rect.height) - .5) * -8;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function initReveal(scope = document) {
    if (!("IntersectionObserver" in window)) {
      scope.querySelectorAll(".reveal-soft").forEach(el => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .16 });
    scope.querySelectorAll(".reveal-soft:not(.is-visible)").forEach(el => observer.observe(el));
  }

  function revealNow() {
    document.querySelectorAll(".reveal-soft").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * .95) el.classList.add("is-visible");
    });
  }

  function refreshAos() {
    setTimeout(() => {
      if (window.AOS && typeof window.AOS.refresh === "function") window.AOS.refresh();
    }, 80);
  }

  function renderMarkdown(value) {
    if (window.showdown) {
      return new window.showdown.Converter({ simpleLineBreaks: true }).makeHtml(value);
    }
    return String(value).split(/\n{2,}/).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("");
  }

  function clean(value) {
    if (typeof value !== "string") return value || "";
    return value.trim();
  }

  function subscribePage(pageName, render) {
    const isPreview = new URLSearchParams(location.search).has("preview");
    if (isPreview || typeof window.subscribeFirebasePage !== "function") return;
    try {
      window.subscribeFirebasePage(pageName, data => render(data || {}));
    } catch (error) {
      console.warn(`[interactive] Unable to subscribe to ${pageName}`, error);
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
})();

