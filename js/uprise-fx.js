(function () {
  const cl = (v, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v));
  function init(o) {
    o = o || {};
    if (window.__upfx) window.__upfx.destroy();
    const M = o.motion == null ? 1 : o.motion;
    const root = document.documentElement;
    root.style.setProperty("--acc", o.accent || "#ff8c00");
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    const made = [];
    const mk = (css, html) => { const d = document.createElement("div"); d.style.cssText = css; if (html) d.innerHTML = html; document.body.appendChild(d); made.push(d); return d; };
    const fine = matchMedia("(hover: hover)").matches;
    if (fine) root.classList.add("upfx");

    // page curtain
    const curtain = mk("position:fixed;inset:0;z-index:400;background:#0b0b0b;color:#efece6;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:clamp(20px,3vw,40px);box-sizing:border-box;pointer-events:none;will-change:transform;",
      '<span data-cn style="font-family:Archivo,sans-serif;font-weight:900;font-variation-settings:\'wdth\' 70;font-size:clamp(64px,13vw,220px);line-height:.8;letter-spacing:-.02em;text-transform:uppercase"></span><span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.24em;color:var(--acc);padding-bottom:.6em">● REC</span>');
    const cn = curtain.querySelector("[data-cn]");
    cn.textContent = o.page || "";
    const enter = () => o.onEnter && o.onEnter();
    let t1;
    let first = false;
    // 從外部進站（網址列、搜尋、社群連結）或重新整理首頁時都播放開場
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      const internal = ref && ref.origin === location.origin;
      const reload = performance.getEntriesByType && (performance.getEntriesByType("navigation")[0] || {}).type === "reload";
      first = !internal || (reload && o.page === "Uprise");
    } catch (e) { first = true; }
    let intro = null;
    if (first && o.intro !== false) {
      // Apple 風格開場：模糊→清晰、柔和光澤掃過、淡出放大
      const AP = "cubic-bezier(.16,1,.3,1)";
      intro = document.createElement("div");
      intro.style.cssText = "position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(22px,3.4vh,36px);background:#000;transition:opacity 1s " + AP + ",transform 1.4s " + AP + ",filter 1s " + AP;
      intro.innerHTML =
        '<div data-il style="position:relative;width:clamp(120px,15vw,210px);opacity:0;filter:blur(24px);transform:scale(1.14);transition:opacity 1.6s ' + AP + ',filter 1.8s ' + AP + ',transform 2.2s ' + AP + '">' +
          '<img src="images/uploads/logo.png" alt="" style="display:block;width:100%;height:auto">' +
          '<span data-ish style="position:absolute;inset:0;-webkit-mask:url(images/uploads/logo.png) center/contain no-repeat;mask:url(images/uploads/logo.png) center/contain no-repeat;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.85) 50%,transparent 65%);background-size:250% 100%;background-position:120% 0;transition:background-position 1.6s cubic-bezier(.45,0,.2,1) 1.1s"></span>' +
        '</div>' +
        '<div style="display:grid;justify-items:center;gap:12px">' +
          '<span data-intro-t style="font-family:\'Noto Sans TC\',sans-serif;font-weight:700;font-size:clamp(22px,2.6vw,34px);letter-spacing:.6em;padding-left:.6em;color:#f5f5f7;opacity:0;filter:blur(8px);transition:opacity 1.4s ' + AP + ' .7s,letter-spacing 2s ' + AP + ' .7s,padding-left 2s ' + AP + ' .7s,filter 1.4s ' + AP + ' .7s">推手影像</span>' +
          '<span data-intro-s style="font-family:-apple-system,BlinkMacSystemFont,\'SF Pro Text\',\'Helvetica Neue\',sans-serif;font-weight:500;font-size:11px;letter-spacing:.32em;color:#86868b;opacity:0;transform:translateY(6px);transition:opacity 1.2s ' + AP + ' 1.2s,transform 1.2s ' + AP + ' 1.2s">UPRISE PRODUCTION</span>' +
        '</div>';
      curtain.style.background = "#000";
      curtain.appendChild(intro);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const il = intro.querySelector("[data-il]"); il.style.opacity = "1"; il.style.filter = "blur(0)"; il.style.transform = "none";
        intro.querySelector("[data-ish]").style.backgroundPosition = "-20% 0";
        const t = intro.querySelector("[data-intro-t]"); t.style.opacity = "1"; t.style.filter = "blur(0)"; t.style.letterSpacing = ".18em"; t.style.paddingLeft = ".18em";
        const st = intro.querySelector("[data-intro-s]"); st.style.opacity = "1"; st.style.transform = "none";
      }));
    }
    const hold = intro ? 2900 : 450;
    if (o.transition === false && !intro) { curtain.style.transform = "translateY(-100%)"; enter(); }
    else if (intro) t1 = setTimeout(() => {
      intro.style.opacity = "0"; intro.style.transform = "scale(1.06)"; intro.style.filter = "blur(10px)";
      curtain.style.transition = "opacity 1.2s cubic-bezier(.16,1,.3,1)";
      curtain.style.opacity = "0";
      setTimeout(enter, 250);
      setTimeout(() => { if (intro) { intro.remove(); intro = null; } curtain.style.transition = "none"; curtain.style.transform = "translateY(-100%)"; curtain.style.opacity = "1"; curtain.style.background = "#0b0b0b"; }, 1300);
    }, hold);
    else t1 = setTimeout(() => {
      curtain.style.transition = "transform 1.1s cubic-bezier(.76,0,.24,1)";
      curtain.style.transform = "translateY(-100%)";
      setTimeout(enter, 300);
    }, hold);
    const onClick = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target) return;
      const h = a.getAttribute("href");
      if (/^https?:|^mailto:|^tel:|^#|admin\//.test(h) || !/\.html(#.*)?$/.test(h)) return;
      if (h.split("#")[0] === location.pathname.split("/").pop() && h.includes("#")) return;
      e.preventDefault();
      if (o.transition === false) { location.href = h; return; }
      if (intro) { intro.remove(); intro = null; }
      curtain.style.opacity = "1"; curtain.style.background = "#0b0b0b";
      cn.textContent = a.dataset.to || "";
      curtain.style.transition = "none";
      curtain.style.transform = "translateY(100%)";
      curtain.offsetHeight;
      curtain.style.transition = "transform .8s cubic-bezier(.76,0,.24,1)";
      curtain.style.transform = "translateY(0)";
      setTimeout(() => { location.href = h; }, 820);
    };
    document.addEventListener("click", onClick);
    const onShow = (e) => { if (e.persisted) { curtain.style.transition = "none"; curtain.style.transform = "translateY(-100%)"; } };
    addEventListener("pageshow", onShow);

    // progress, cursor, floating preview
    const bar = mk("position:fixed;top:0;left:0;height:2px;width:0;background:var(--acc);z-index:160;pointer-events:none");
    let dot = null, lab = null;
    if (fine) {
      dot = mk("position:fixed;top:0;left:0;z-index:350;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#efece6;mix-blend-mode:difference;pointer-events:none;display:flex;align-items:center;justify-content:center;transition:width .35s cubic-bezier(.76,0,.24,1),height .35s cubic-bezier(.76,0,.24,1),margin .35s cubic-bezier(.76,0,.24,1)",
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.14em;color:#0b0b0b;opacity:0;transition:opacity .2s;white-space:nowrap"></span>');
      lab = dot.firstChild;
    }
    const flt = document.createElement("img");
    flt.alt = "";
    flt.style.cssText = "position:fixed;top:0;left:0;z-index:90;width:clamp(240px,26vw,380px);aspect-ratio:16/10;object-fit:cover;pointer-events:none;opacity:0;clip-path:inset(50% 0 50% 0);transition:opacity .3s ease,clip-path .55s cubic-bezier(.76,0,.24,1)";
    document.body.appendChild(flt); made.push(flt);
    const onOver = (e) => {
      const t = e.target; if (!t || !t.closest) return;
      if (dot) {
        const c = t.closest("[data-cursor]");
        const s = c ? 92 : (t.closest("a,button,label") ? 40 : 12);
        dot.style.width = dot.style.height = s + "px";
        dot.style.margin = (-s / 2) + "px 0 0 " + (-s / 2) + "px";
        lab.textContent = c ? c.dataset.cursor : ""; lab.style.opacity = c ? "1" : "0";
      }
      const p = fine && t.closest("[data-preview]");
      if (p) {
        if (flt.dataset.src !== p.dataset.preview) { flt.src = p.dataset.preview; flt.dataset.src = p.dataset.preview; }
        flt.style.opacity = "1"; flt.style.clipPath = "inset(0 0 0 0)";
      } else { flt.style.opacity = "0"; flt.style.clipPath = "inset(50% 0 50% 0)"; }
    };
    document.addEventListener("mouseover", onOver);

    // nav effects
    const nav = document.querySelector("nav");
    const EZ = "cubic-bezier(.76,0,.24,1)";
    if (nav && !nav.dataset.fx) {
      nav.dataset.fx = "1";
      nav.style.transition = "transform .9s " + EZ;
      Array.from(nav.lastElementChild ? nav.lastElementChild.querySelectorAll("a") : []).forEach((a) => {
        if (a.querySelector("img")) return;
        const txt = a.textContent.trim();
        a.textContent = "";
        const w = document.createElement("span");
        w.style.cssText = "display:inline-flex;overflow:hidden;height:1.4em;line-height:1.4em;vertical-align:top";
        [...txt].forEach((ch, i) => {
          const c = document.createElement("span");
          c.textContent = ch;
          c.style.cssText = "display:inline-block;text-shadow:0 1.4em 0 currentColor;transition:transform .7s " + EZ + " " + (i * 45) + "ms";
          w.appendChild(c);
        });
        a.appendChild(w);
        a.addEventListener("mouseenter", () => w.querySelectorAll("span").forEach((c) => { c.style.transform = "translateY(-1.4em)"; }));
        a.addEventListener("mouseleave", () => w.querySelectorAll("span").forEach((c) => { c.style.transform = "none"; }));
        a.setAttribute("data-magnet", "");
      });
      const logo = nav.querySelector("a img");
      if (logo) {
        logo.style.transition = "transform 1s " + EZ;
        const la = logo.closest("a");
        la.addEventListener("mouseenter", () => { logo.style.transform = "rotate(180deg)"; });
        la.addEventListener("mouseleave", () => { logo.style.transform = "none"; });
      }
    }
    let navHidden = false, navLast = scrollY;
    const stickyFix = () => {
      const wide = innerWidth >= 900;
      $$("[data-sticky-wide]").forEach((el) => { el.style.position = wide ? "sticky" : "relative"; el.style.top = wide ? "" : "auto"; if (wide) el.style.top = el.dataset.top || "16vh"; });
    };
    stickyFix();
    addEventListener("resize", stickyFix);

    // reveals
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const tg = e.target, list = (tg.__rise || []).slice();
      if (!tg.__rise || tg.hasAttribute("data-reveal")) list.push(tg);
      list.forEach((el) => {
        if (el.hasAttribute("data-rise")) el.style.transform = "none";
        else if (el.hasAttribute("data-clip")) el.style.clipPath = "inset(0 0 0 0)";
        else { el.style.opacity = "1"; el.style.transform = "none"; }
      });
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    const scan = () => {
      $$("[data-reveal]:not([data-rv])").forEach((el) => {
        el.dataset.rv = "1"; const d = +el.dataset.reveal || 0;
        el.style.opacity = "0"; el.style.transform = "translateY(" + (40 * M) + "px)";
        el.style.transition = "opacity 1.3s cubic-bezier(.76,0,.24,1) " + d + "ms, transform 1.5s cubic-bezier(.76,0,.24,1) " + d + "ms";
        io.observe(el);
      });
      $$("[data-rise]:not([data-rv])").forEach((el) => {
        el.dataset.rv = "1"; const d = +el.dataset.rise || 0;
        el.style.transform = "translateY(110%)";
        el.style.transition = "transform 1.5s cubic-bezier(.76,0,.24,1) " + d + "ms";
        const p = el.parentElement || el; (p.__rise = p.__rise || []).push(el); io.observe(p);
      });
      $$("[data-clip]:not([data-rv])").forEach((el) => {
        el.dataset.rv = "1"; const d = +el.dataset.clip || 0;
        el.style.clipPath = "inset(100% 0 0 0)";
        el.style.transition = "clip-path 1.6s cubic-bezier(.76,0,.24,1) " + d + "ms";
        const p = el.parentElement || el; (p.__rise = p.__rise || []).push(el); io.observe(p);
      });
    };
    scan();
    const scanT = setInterval(scan, 400);

    // loop
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, fx = mx, fy = my, gx = 0, gy = 0;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const smooth = o.smooth !== false && fine;
    let tgt = scrollY, cur = scrollY, sm = false;
    const onWheel = (e) => {
      if (!smooth || e.ctrlKey || document.body.style.overflow === "hidden") return;
      if (e.target.closest && e.target.closest("textarea,[data-native-scroll]")) return;
      e.preventDefault();
      if (!sm) tgt = cur = scrollY;
      tgt = cl(tgt + e.deltaY * (e.deltaMode === 1 ? 32 : 1), 0, document.documentElement.scrollHeight - innerHeight);
      sm = true;
    };
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("mousemove", onMove);
    let lastY = scrollY, vel = 0, mqx = 0, lastSec = -1, t = 0, raf;
    const loop = () => {
      t++;
      if (sm) { cur += (tgt - cur) * 0.075; if (Math.abs(tgt - cur) < 0.4) { cur = tgt; sm = false; } scrollTo(0, cur); }
      const vh = innerHeight, sy = scrollY;
      vel += ((sy - lastY) - vel) * 0.12; lastY = sy;
      if (nav) {
        const d = sy - navLast;
        if (Math.abs(d) > 4) {
          const hide = d > 0 && sy > 160;
          if (hide !== navHidden) { navHidden = hide; nav.style.transform = hide ? "translateY(-120%)" : "none"; }
          navLast = sy;
        }
      }
      const max = document.documentElement.scrollHeight - vh;
      bar.style.width = (max > 0 ? sy / max * 100 : 0) + "%";
      if (dot) { cx += (mx - cx) * 0.22; cy += (my - cy) * 0.22; dot.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)"; }
      fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
      flt.style.transform = "translate3d(" + (fx + 28) + "px," + (fy - 120) + "px,0) rotate(" + cl((mx - fx) * 0.05, -7, 7).toFixed(2) + "deg)";
      $$("[data-par]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const q = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = "translate3d(0," + (-q * parseFloat(el.dataset.par) * M).toFixed(1) + "px,0)";
      });
      $$("[data-magnet]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const ox = +(el.dataset.gx || 0), oy = +(el.dataset.gy || 0);
        const dx = mx - (r.left + r.width / 2 - ox), dy = my - (r.top + r.height / 2 - oy);
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9;
        const nx = ox + ((near ? dx * 0.35 * M : 0) - ox) * 0.15, ny = oy + ((near ? dy * 0.35 * M : 0) - oy) * 0.15;
        el.dataset.gx = nx; el.dataset.gy = ny;
        el.style.transform = "translate3d(" + nx.toFixed(1) + "px," + ny.toFixed(1) + "px,0)";
      });
      $$("[data-marquee]").forEach((el) => {
        const half = el.scrollWidth / 2; if (!half) return;
        mqx -= (1 + Math.abs(vel) * 0.35) * (M || 0.3) * (vel < -0.5 ? -1 : 1);
        if (mqx < -half) mqx += half; if (mqx > 0) mqx -= half;
        el.style.transform = "translate3d(" + mqx.toFixed(1) + "px,0,0) skewX(" + cl(-vel * 0.2 * M, -12, 12).toFixed(1) + "deg)";
      });
      const now = new Date();
      if (now.getSeconds() !== lastSec) {
        lastSec = now.getSeconds();
        const s = now.toLocaleTimeString("zh-TW", { timeZone: "Asia/Taipei", hour12: false }) + " GMT+8";
        $$("[data-clock]").forEach((c) => { c.textContent = s; });
      }
      if (o.onFrame) o.onFrame({ vel, mx, my, t, M, vh, sy, cl, ease });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const api = {
      destroy() {
        cancelAnimationFrame(raf); clearTimeout(t1); clearInterval(scanT); io.disconnect();
        document.removeEventListener("click", onClick); document.removeEventListener("mouseover", onOver);
        removeEventListener("mousemove", onMove); removeEventListener("wheel", onWheel); removeEventListener("resize", stickyFix); removeEventListener("pageshow", onShow);
        made.forEach((d) => d.remove()); root.classList.remove("upfx");
        if (window.__upfx === api) window.__upfx = null;
      }
    };
    window.__upfx = api;
    return api;
  }
  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  window.UpriseFX = { init, clamp: cl, ease };
})();
