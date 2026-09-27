import { getPage, categories, allWorks, featured, members, ytId, thumb, oneLine } from "./uprise-data.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const lines = (s) => String(s || "").replace(/\r/g, "").split(/\||\n/).map((l, i) => `<span class="mask"><span data-rise="${i * 100}">${esc(l)}</span></span>`).join("");
const PAGE = document.body.dataset.page;
const LOGO = "images/uploads/logo.png";

function nav(on) {
  const L = [["index.html", "Home", "首頁", "home"], ["works.html", "Works", "作品", "works"], ["about.html", "About", "關於", "about"], ["contact.html", "Contact", "聯絡", "contact"]];
  return `<nav class="site-nav"><a class="brand" href="index.html" data-to="Uprise"><img src="${LOGO}" alt="推手影像"><span>UPRISE®</span></a>
  <div class="links">${L.map(([h, to, t, k]) => `<a href="${h}" data-to="${to}"${k === on ? ' class="on"' : ""}>${t}</a>`).join("")}</div></nav>`;
}

function footer(c, cta) {
  return `<footer class="site-foot"><div class="in">
    ${cta ? `<div class="foot-top"><h2 class="h-xl">${lines(cta)}</h2><div style="justify-self:end"><a href="contact.html" data-to="Contact" data-magnet data-cursor="開始" class="circle-cta">開始合作<br>↗</a></div></div>` : ""}
    <div class="foot-grid">
      <div><span class="mute">頁面</span><a href="index.html" data-to="Home">首頁</a><a href="works.html" data-to="Works">作品</a><a href="about.html" data-to="About">關於</a><a href="contact.html" data-to="Contact">聯絡</a></div>
      <div><span class="mute">EMAIL</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
      <div><span class="mute">PHONE</span><a href="tel:${esc(String(c.phone).replace(/[^0-9+]/g, ""))}">${esc(c.phone)}</a></div>
      <div><span class="mute">STUDIO</span><span>${esc(c.address)}</span></div>
    </div>
    <div class="foot-bot"><span>推手影像製作有限公司</span><span>© ${new Date().getFullYear()} UPRISE-PRODUCTION</span></div>
  </div></footer>`;
}

function fixThumbs(root = document) {
  $$("img[data-yt]", root).forEach((img) => {
    if (img.__fx) return; img.__fx = 1;
    const fb = () => { const hq = "https://i.ytimg.com/vi/" + img.dataset.yt + "/hqdefault.jpg"; if (img.src !== hq) img.src = hq; };
    img.addEventListener("error", fb);
    img.addEventListener("load", () => { if (img.naturalWidth <= 120) fb(); });
    if (img.complete && img.naturalWidth && img.naturalWidth <= 120) fb();
  });
}

let fxOpts = {}, entered = false, enterFns = [];
const onEnter = (fn) => { if (entered) fn(); else enterFns.push(fn); };
function startFx(page, extra = {}) {
  fxOpts = { page, onEnter: () => { entered = true; enterFns.forEach((f) => f()); enterFns = []; }, ...extra };
  const go = () => (window.UpriseFX ? UpriseFX.init(fxOpts) : setTimeout(go, 30));
  go();
}

/* ---------------- HOME ---------------- */
async function home() {
  let frame = null;
  startFx("Uprise", { onFrame: (f) => frame && frame(f) });
  const [h, w, c] = await Promise.all([getPage("home"), getPage("works"), getPage("contact")]);
  const cats = categories(w), feats = featured(h, cats);
  const clients = [...new Set(allWorks(cats).map((x) => x.client).filter(Boolean))].slice(0, 10);
  const word = [...String(h.hero_word || "推手")];
  const video = innerWidth < 768 && h.hero_video_mobile ? h.hero_video_mobile : h.hero_video;
  const poster = (h.behind_the_scenes && h.behind_the_scenes[0] && h.behind_the_scenes[0].image) || "";
  const mq = `<span>${clients.map((x) => `<span>${esc(x)}</span><span>✳</span>`).join("")}</span>`;
  const svc = h.services || [];
  document.getElementById("app").innerHTML = nav("home") + `
  <section class="hero" data-hero><div class="hero-stick">
    <div data-frame class="abs0" style="overflow:hidden;will-change:clip-path"><video data-hero-video autoplay muted loop playsinline webkit-playsinline preload="auto" poster="${esc(poster)}"><source src="${esc(video)}" type="video/mp4"></video></div>
    <div data-knock class="knock"><h1 data-h1 class="hero-word">${word.map((ch, i) => `<span><span data-l${i === word.length - 1 ? " data-origin" : ""}>${esc(ch)}</span></span>`).join("")}</h1></div>
    <div data-dim class="abs0" style="background:#0b0b0b;opacity:0;pointer-events:none"></div>
    <div data-hero-ui class="hero-ui">
      <div style="display:grid;gap:8px"><span style="color:var(--acc);display:flex;align-items:center;gap:8px"><i class="rec"></i>${esc(h.hero_text || "推手影像")} — EST. 2025</span>
      <span class="nl" style="font-family:'Noto Sans TC',sans-serif;font-size:15px;letter-spacing:.04em;line-height:1.7;max-width:22em">${esc(h.intro)}</span></div>
      <span style="justify-self:center;display:flex;flex-direction:column;align-items:center;gap:10px">滑動進入<span data-cue style="width:1px;height:42px;background:linear-gradient(#efece6,transparent);transform-origin:top"></span></span>
    </div>
    <div data-reel class="reel"><div style="display:grid;gap:10px"><span style="display:flex;align-items:center;gap:8px;color:var(--acc)"><i class="rec"></i>SHOWREEL</span>
      <span style="font-family:'Noto Sans TC',sans-serif;font-size:clamp(22px,2.4vw,36px);font-weight:900">${esc(h.hero_text || "推手影像")} 作品精華</span></div>
      <a href="works.html" data-to="Works" data-cursor="作品" style="border-bottom:1px solid #efece6;padding-bottom:4px">看完整作品 →</a></div>
    <button class="sound" data-sound data-cursor="開聲音"><span class="eq"><i style="height:30%"></i><i style="height:70%"></i><i style="height:45%"></i><i style="height:90%"></i></span><span data-sound-t>SOUND OFF</span></button>
    <div data-mani class="mani"><span class="label" style="margin-bottom:28px">01 / 我們相信</span><h2 data-chars>${esc(h.manifesto)}</h2></div>
  </div></section>

  <section class="px" style="padding-top:clamp(110px,18vh,200px);padding-bottom:clamp(40px,6vh,70px)"><div class="wrap" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:28px">
    <div style="display:grid;gap:24px"><span class="label" data-reveal="0">02 / 精選作品</span>
      <h2 style="margin:0;font-family:Archivo,sans-serif;font-weight:900;font-variation-settings:'wdth' 70;font-size:clamp(72px,12vw,200px);line-height:.84;letter-spacing:-.02em;text-transform:uppercase"><span class="mask"><span data-rise="0">Selected</span></span><span class="mask"><span data-rise="90">Works <sup style="font-size:.22em;vertical-align:top;color:var(--acc)">(${pad(feats.length)})</sup></span></span></h2></div>
    <a href="works.html" data-to="Works" data-magnet data-cursor="全部作品" class="pill" style="padding:18px 28px">查看全部 ${allWorks(cats).length} 部作品 →</a>
  </div></section>

  <section class="px" style="padding-bottom:clamp(40px,6vh,70px)"><div class="wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(30px,4vw,70px);align-items:center">
    <div data-reveal="0" style="display:grid;border-bottom:1px solid var(--line)">${feats.map((f, i) => `
      <a href="works.html#${ytId(f.link)}" data-to="Play" data-cursor="▶ 播放" data-fi="${i}" class="feat-row${i === 0 ? " on" : ""}"><span class="n">${pad(i + 1)}</span>
        <span class="t"><b class="nl">${esc(f.title)}</b><span class="mono mute" style="font-size:11px;letter-spacing:.12em">${esc(f.client)}</span></span><span class="tag">${esc(f.cat)}</span></a>`).join("")}</div>
    <div data-reveal="150"><div class="prev">${feats.map((f, i) => `<img data-yt="${ytId(f.link)}" data-pi="${i}" src="${esc(f.image || thumb(f, "maxresdefault"))}" alt="${esc(f.title)}"${i === 0 ? ' class="on"' : ""}>`).join("")}
      <div class="mono" style="position:absolute;left:0;right:0;bottom:0;z-index:10;display:flex;justify-content:space-between;gap:12px;padding:16px 18px;background:linear-gradient(transparent,rgba(11,11,11,.7));font-size:10.5px;letter-spacing:.18em"><span style="display:flex;align-items:center;gap:8px"><i class="rec" style="animation:none"></i>PREVIEW <b data-pn>01</b> / ${pad(feats.length)}</span><span data-pc>${esc(feats[0] ? feats[0].catEn || feats[0].cat : "")}</span></div></div></div>
  </div></section>

  <div style="overflow:hidden;padding:clamp(50px,8vw,110px) 0"><div class="mq-band"><div class="mq" data-marquee>${mq}${mq}</div></div></div>

  <section class="px" style="background:#efece6;color:#0b0b0b;padding-top:clamp(100px,15vh,180px);padding-bottom:clamp(100px,15vh,180px)"><div class="wrap" style="display:grid;gap:clamp(60px,8vw,110px)">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:28px 60px;align-items:end">
      <h2 class="h-xl" style="font-size:clamp(48px,7.5vw,128px);letter-spacing:-.04em">${lines("從一個想法|到最後一格。")}</h2>
      <div data-reveal="150" style="display:grid;gap:22px;justify-items:start"><span class="mono" style="font-size:11px;letter-spacing:.3em;color:#6d6a63">03 / 我們做什麼</span>
        <a href="about.html" data-to="About" data-cursor="認識我們" class="mono" style="color:#0b0b0b;border-bottom:1px solid #0b0b0b;padding-bottom:6px;font-size:12px;letter-spacing:.18em">認識團隊與流程 →</a></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));border-top:1px solid #0b0b0b">${svc.map((s, i) => `
      <div data-reveal="${i * 100}" style="display:grid;gap:14px;align-content:start;padding:28px 24px 28px 0"><span class="mono" style="font-size:12px">(${pad(i + 1)})</span>
        <h3 class="nl" style="margin:0;font-size:clamp(26px,2.4vw,36px);font-weight:900;letter-spacing:-.02em">${esc(s.title)}</h3>
        <p class="nl" style="margin:0;font-size:15px;line-height:1.8;color:#3d3b37">${esc(s.description)}</p></div>`).join("")}</div>
  </div></section>` + footer(c, "有故事？|我們開機。");

  fixThumbs();
  // featured hover
  let cur = 0;
  $$("[data-fi]").forEach((row) => row.addEventListener("mouseenter", () => {
    const i = +row.dataset.fi; if (i === cur) return;
    $$("[data-fi]").forEach((r) => r.classList.toggle("on", r === row));
    $$("[data-pi]").forEach((im) => { const k = +im.dataset.pi; im.classList.toggle("on", k === i); im.classList.toggle("pv", k === cur); });
    $("[data-pn]").textContent = pad(i + 1); $("[data-pc]").textContent = feats[i].catEn || feats[i].cat;
    cur = i;
  }));
  // hero
  const E = { hero: $("[data-hero]"), knock: $("[data-knock]"), h1: $("[data-h1]"), vid: $("[data-hero-video]"), dim: $("[data-dim]"), ui: $("[data-hero-ui]"), mani: $("[data-mani]"), cue: $("[data-cue]"), frame: $("[data-frame]"), reel: $("[data-reel]"), eqs: $$(".eq i") };
  // 影片自動播放：各瀏覽器（特別是 iOS / 省電模式）需要靜音＋行內播放，失敗時在第一次互動再試
  const DEF_VIDEO = "https://res.cloudinary.com/dfnfcyglu/video/upload/v1763893930/hero_bg_ickrbe.mp4";
  const v = E.vid;
  v.muted = true; v.defaultMuted = true; v.playsInline = true;
  v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
  const tryPlay = () => { if (!v.paused) return; const q = v.play(); if (q && q.catch) q.catch(() => {}); };
  v.addEventListener("loadeddata", tryPlay);
  v.addEventListener("canplay", tryPlay);
  let fell = false;
  const fallback = () => { if (fell || (v.currentSrc || "").indexOf(DEF_VIDEO) === 0) return; fell = true; console.warn("[uprise] hero video failed, using default:", v.currentSrc); v.innerHTML = ""; v.src = DEF_VIDEO; v.load(); tryPlay(); };
  v.addEventListener("error", fallback, true);
  const srcEl = v.querySelector("source"); if (srcEl) srcEl.addEventListener("error", fallback);
  setTimeout(() => { if (v.readyState < 2) fallback(); }, 8000);
  const kick = () => { tryPlay(); if (!v.paused) ["touchstart", "click", "scroll", "wheel", "keydown"].forEach((ev) => removeEventListener(ev, kick)); };
  ["touchstart", "click", "scroll", "wheel", "keydown"].forEach((ev) => addEventListener(ev, kick, { passive: true }));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tryPlay(); });
  v.load(); tryPlay();
  onEnter(tryPlay);
  const h2 = $("[data-chars]"), txt = h2.textContent; h2.textContent = "";
  const chars = [...txt].map((ch) => { const s = document.createElement("span"); s.textContent = ch; s.style.opacity = ".2"; h2.appendChild(s); return s; });
  const fit = () => {
    E.knock.style.transform = "none";
    E.h1.style.fontSize = "100px";
    E.h1.style.fontSize = Math.min(100 * innerWidth * 0.9 / E.h1.scrollWidth, 100 * innerHeight * 0.78 / E.h1.scrollHeight) + "px";
    const o = $("[data-origin]").parentElement.getBoundingClientRect(), k = E.knock.getBoundingClientRect();
    E.knock.style.transformOrigin = (o.left + o.width / 2 - k.left) + "px " + (o.top + o.height * 0.52 - k.top) + "px";
  };
  fit();
  document.fonts && document.fonts.ready.then(fit);
  document.fonts && document.fonts.addEventListener && document.fonts.addEventListener("loadingdone", fit);
  [300, 1000, 2500].forEach((t) => setTimeout(() => { if (scrollY < 5) fit(); }, t));
  addEventListener("resize", fit);
  const letters = $$("[data-l]");
  letters.forEach((l) => { l.style.transform = "translateY(105%)"; });
  onEnter(() => letters.forEach((l, i) => { l.style.transition = "transform 1.3s cubic-bezier(.76,0,.24,1) " + i * 90 + "ms"; l.style.transform = "none"; }));
  let sound = false;
  const sb = $("[data-sound]");
  sb.addEventListener("click", () => {
    sound = !sound; E.vid.muted = !sound; if (sound) { const q = E.vid.play(); if (q && q.catch) q.catch(() => {}); }
    $("[data-sound-t]").textContent = sound ? "SOUND ON" : "SOUND OFF"; sb.dataset.cursor = sound ? "靜音" : "開聲音";
  });
  frame = (f) => {
    const cl = f.cl, vh = f.vh, ease = f.ease, hr = E.hero.getBoundingClientRect();
    if (sound) E.eqs.forEach((e, i) => { e.style.height = (25 + 75 * Math.abs(Math.sin(f.t / (6 + i * 2) + i))) + "%"; });
    if (hr.bottom < 0) return;
    const p = cl(-hr.top / (hr.height - vh)), z = cl(p / 0.22), ez = z * z * z;
    E.knock.style.transform = "scale(" + (1 + ez * 38).toFixed(3) + ")";
    E.knock.style.opacity = String(1 - cl((z - 0.75) / 0.25));
    E.vid.style.transform = "scale(" + (1.18 - ease(z) * 0.18).toFixed(3) + ")";
    E.ui.style.opacity = String(1 - cl(z * 4));
    E.cue.style.transform = "scaleY(" + (0.4 + 0.6 * Math.abs(Math.sin(f.t / 40))).toFixed(2) + ")";
    const reelOn = ease(cl((p - 0.2) / 0.08)) * (1 - ease(cl((p - 0.5) / 0.06)));
    E.reel.style.opacity = String(reelOn); E.reel.style.transform = "translateY(" + ((1 - reelOn) * 20).toFixed(1) + "px)";
    E.reel.style.pointerEvents = reelOn > 0.5 ? "auto" : "none";
    const mOn = ease(cl((p - 0.52) / 0.08)) * (1 - ease(cl((p - 0.84) / 0.06)));
    E.mani.style.opacity = String(mOn); E.dim.style.opacity = String(0.38 * mOn);
    const m = cl((p - 0.56) / 0.24) * chars.length;
    chars.forEach((c, i) => { c.style.opacity = String(0.2 + 0.8 * cl(m - i)); });
    E.mani.style.transform = "translateY(" + ((1 - cl((p - 0.52) / 0.08)) * 40 - cl((p - 0.84) / 0.06) * 40).toFixed(1) + "px)";
    const sh = ease(cl((p - 0.88) / 0.12));
    E.frame.style.clipPath = "inset(" + (sh * 14).toFixed(2) + "vh " + (sh * 10).toFixed(2) + "vw round " + (sh * 18).toFixed(1) + "px)";
  };
}

/* ---------------- WORKS ---------------- */
async function works() {
  document.body.classList.add("lock");
  let tiltFrame = null;
  startFx("Works", { smooth: false, onFrame: (f) => tiltFrame && tiltFrame(f) });
  const [w, c] = await Promise.all([getPage("works"), getPage("contact")]);
  const cats = categories(w), ALL = allWorks(cats);
  const TABS = [{ name: "全部", items: ALL }, ...cats];
  let tab = 0, idx = 0, lock = 0, playing = null;
  const hash = decodeURIComponent(location.hash.slice(1));
  const hit = ALL.findIndex((x) => ytId(x.link) === hash);
  if (hit >= 0) idx = hit;
  const narrow = () => innerWidth < 820;

  document.getElementById("app").innerHTML = nav("works") + `
  <main class="w-stage" data-stage>
    <div class="w-bg" data-bg></div>
    <div class="abs0" style="background:linear-gradient(135deg,#e60012 0%,#ff8c00 55%,#ffd700 100%);mix-blend-mode:soft-light;opacity:.75"></div>
    <div class="abs0" style="background:radial-gradient(ellipse at center,rgba(11,11,11,.1) 0%,rgba(11,11,11,.5) 60%,rgba(11,11,11,.85) 100%)"></div>
    <div style="position:absolute;left:-10vw;bottom:-30vh;width:60vw;height:60vh;border-radius:50%;background:#e60012;filter:blur(120px);opacity:.22;pointer-events:none"></div>
    <div data-tilt class="abs0"></div>
    <div data-tbox style="position:absolute;left:var(--pad);pointer-events:none;z-index:30"></div>
    <div data-ibox style="position:absolute;right:var(--pad);top:50%;width:min(21vw,320px);pointer-events:none;z-index:30"></div>
    <div style="position:absolute;right:var(--pad);bottom:clamp(84px,12vh,120px);width:92px;height:92px;z-index:30;pointer-events:none">
      <svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)"><defs><linearGradient id="brandRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd700"/><stop offset=".5" stop-color="#ff8c00"/><stop offset="1" stop-color="#e60012"/></linearGradient></defs>
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(239,236,230,.2)" stroke-width="1.2"/><circle data-ring cx="50" cy="50" r="47" fill="none" stroke="url(#brandRing)" stroke-width="2" stroke-linecap="round" stroke-dasharray="295.3" stroke-dashoffset="295.3" style="transition:stroke-dashoffset 1.2s var(--ez)"/></svg>
      <div class="abs0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><span data-cur style="font-family:Archivo,sans-serif;font-weight:700;font-size:26px;line-height:1">01</span><span data-cnt class="mono" style="font-size:9.5px;letter-spacing:.16em;color:#c9c5bc">/ 01</span></div>
    </div>
    <div data-hint class="mono" style="position:absolute;left:var(--pad);bottom:clamp(84px,12vh,120px);z-index:30;display:flex;flex-direction:column;gap:10px;font-size:10.5px;letter-spacing:.2em;color:#c9c5bc">
      <button data-prev data-cursor="上一部" style="background:none;border:0;padding:0;text-align:left;letter-spacing:.2em">↑ PREV</button><span>滾動切換</span><button data-next data-cursor="下一部" style="background:none;border:0;padding:0;text-align:left;letter-spacing:.2em">↓ NEXT</button></div>
    <div class="w-cats"><span style="position:absolute;left:var(--pad);right:var(--pad);top:0;height:1px;background:linear-gradient(90deg,#e60012,#ff8c00,#ffd700);opacity:.7"></span>
      <span class="x">+</span>${TABS.map((t, i) => `<button class="w-cat${i === 0 ? " on" : ""}" data-tab="${i}" data-cursor="分類">${esc(t.name)}<small>${pad(t.items.length)}</small></button><span class="x">+</span>`).join("")}</div>
  </main><div data-modal></div>`;

  const stage = $("[data-stage]"), bg = $("[data-bg]"), tilt = $("[data-tilt]"), tbox = $("[data-tbox]"), ibox = $("[data-ibox]");
  const list = () => TABS[tab].items;
  const layout = () => {
    const n = narrow();
    stage.style.setProperty("--bw", n ? "86vw" : "min(50vw, 118vh)");
    stage.style.setProperty("--bh", "calc(var(--bw) * .5625)");
    tbox.style.top = n ? "calc(50% - 86vw * .5625 / 2 - 150px)" : "50%";
    tbox.style.width = n ? "calc(100% - 36px)" : "min(24vw, 400px)";
    ibox.style.display = n ? "none" : "";
    $("[data-hint]").style.display = n ? "none" : "flex";
  };
  const build = () => {
    const L = list();
    bg.innerHTML = L.map((x) => `<img src="${esc(thumb(x))}" alt="">`).join("");
    tilt.innerHTML = L.map((x, i) => `<div class="w-card" data-i="${i}"><img data-yt="${ytId(x.link)}" src="${esc(x.image || thumb(x, "maxresdefault"))}" alt="${esc(x.title)}"></div>`).join("");
    tbox.innerHTML = L.map((x, i) => `<div class="w-txt"><span class="mono" style="font-size:11px;letter-spacing:.24em;color:var(--acc)">${pad(i + 1)} — ${esc(x.catEn || x.cat)}</span><h1 class="nl">${esc(x.title)}</h1></div>`).join("");
    ibox.innerHTML = L.map((x) => `<div class="w-txt" style="gap:10px"><span class="mono" style="font-size:11px;letter-spacing:.2em;color:#c9c5bc">CLIENT</span><span style="font-size:18px;font-weight:700;line-height:1.5">${esc(x.client || "—")}</span><span style="font-size:14px;line-height:1.8;color:#d8d4cb">${esc(x.cat)} · 點擊畫面播放完整影片</span></div>`).join("");
    $$(".w-card", tilt).forEach((el) => el.addEventListener("click", () => { const i = +el.dataset.i; if (i === idx) open(list()[i]); else go(i - idx); }));
    fixThumbs(tilt);
    $("[data-cnt]").textContent = "/ " + pad(L.length);
    update();
  };
  const update = () => {
    const L = list();
    $$(".w-card", tilt).forEach((el, i) => {
      const o = i - idx, a = Math.abs(o), sg = Math.sign(o);
      const k = a === 0 ? 0 : a === 1 ? sg * 0.74 : sg * (0.74 + (a - 1) * 0.36);
      el.style.zIndex = String(20 - a);
      el.style.opacity = a === 0 ? "1" : a === 1 ? ".55" : "0";
      el.style.filter = "brightness(" + (a === 0 ? 1 : 0.7) + ")";
      el.style.transform = "translate(-50%,-50%) translateY(calc(var(--bh) * " + k + ")) scale(" + (a === 0 ? 1 : 0.3) + ")";
      el.style.pointerEvents = a <= 1 ? "auto" : "none";
      el.dataset.cursor = a === 0 ? "▶ 播放" : o < 0 ? "上一部" : "下一部";
      el.firstElementChild.style.transform = "scale(" + (a === 0 ? 1 : 1.25) + ")";
    });
    $$("img", bg).forEach((im, i) => im.classList.toggle("on", i === idx));
    [tbox, ibox].forEach((box, b) => $$(".w-txt", box).forEach((el, i) => {
      const o = i - idx;
      el.style.transform = "translateY(calc(-50% + " + (o === 0 ? 0 : o < 0 ? -60 : 60) + "px))";
      el.style.opacity = o === 0 ? "1" : "0";
      el.style.transitionDelay = o === 0 ? (b ? ".4s" : ".25s") : "0s";
    }));
    $("[data-cur]").textContent = pad(idx + 1);
    $("[data-ring]").setAttribute("stroke-dashoffset", (295.3 * (1 - (idx + 1) / L.length)).toFixed(1));
  };
  const go = (d) => { const n = Math.max(0, Math.min(list().length - 1, idx + d)); if (n !== idx) { idx = n; lock = performance.now(); update(); } };
  const open = (x) => {
    playing = x;
    $("[data-modal]").innerHTML = `<div class="modal"><div class="bar"><div style="display:grid;gap:8px;min-width:0"><span class="mono" style="font-size:11px;letter-spacing:.2em;color:var(--acc)">${esc(x.cat)} · ${esc(x.client)}</span><span style="font-size:clamp(20px,2.4vw,34px);font-weight:900;line-height:1.3">${esc(x.title)}</span></div><button class="x-btn" data-close data-cursor="關閉">✕</button></div>
      <div class="vid"><iframe src="https://www.youtube.com/embed/${ytId(x.link)}?autoplay=1&rel=0&modestbranding=1" title="${esc(x.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></div>`;
    $("[data-close]").addEventListener("click", close);
  };
  const close = () => { playing = null; $("[data-modal]").innerHTML = ""; };
  $$("[data-tab]").forEach((b) => b.addEventListener("click", () => {
    const t = +b.dataset.tab; if (t === tab) return;
    tab = t; idx = 0; lock = performance.now();
    $$("[data-tab]").forEach((x) => x.classList.toggle("on", x === b)); build();
  }));
  $("[data-prev]").addEventListener("click", () => go(-1));
  $("[data-next]").addEventListener("click", () => go(1));
  const busy = () => playing || performance.now() - lock < 1050;
  addEventListener("wheel", (e) => { if (e.target.closest && e.target.closest(".w-cats")) return; e.preventDefault(); if (busy() || Math.abs(e.deltaY) < 12) return; go(e.deltaY > 0 ? 1 : -1); }, { passive: false });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
    if (playing) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(1);
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(-1);
  });
  let ty = null;
  addEventListener("touchstart", (e) => { ty = e.touches[0].clientY; }, { passive: true });
  addEventListener("touchend", (e) => { if (ty == null || busy()) return; const d = ty - e.changedTouches[0].clientY; if (Math.abs(d) > 40) go(d > 0 ? 1 : -1); ty = null; }, { passive: true });
  addEventListener("resize", layout);
  layout(); build();
  if (hit >= 0) onEnter(() => setTimeout(() => open(ALL[hit]), 700));
  let rx = 0, ry = 0;
  tiltFrame = (f) => {
    const tx = (f.my / innerHeight - 0.5) * -5 * f.M, tyy = (f.mx / innerWidth - 0.5) * 7 * f.M;
    rx += (tx - rx) * 0.06; ry += (tyy - ry) * 0.06;
    tilt.style.transform = "perspective(1600px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
  };
}

/* ---------------- ABOUT ---------------- */
async function about() {
  let frame = null;
  startFx("About", { onFrame: (f) => frame && frame(f) });
  const [a, h, t, c] = await Promise.all([getPage("about"), getPage("home"), getPage("team"), getPage("contact")]);
  const M = members(t), bts = (h.behind_the_scenes || []).filter((b) => b && b.image);
  const paras = String(a.body || "").replace(/^#+.*$/gm, "").replace(/^>\s?/gm, "").replace(/\*\*/g, "").replace(/\r/g, "").split(/\n[ \t]*\n/).map((s) => s.trim()).filter(Boolean);
  const sizes = [["62vh", "16/10"], ["48vh", "4/5"], ["58vh", "3/2"], ["44vh", "3/4"], ["56vh", "16/10"]];
  const dossier = (m, i) => `<div class="dos-in">
      <span class="mono" style="font-size:11px;letter-spacing:.24em;color:var(--acc)">${pad(i + 1)} — ${esc(m.role)}</span>
      <h3>${esc(m.name)}</h3>${m.roleEn ? `<span class="mono mute" style="font-size:11px;letter-spacing:.16em;margin-top:-14px">${esc(m.roleEn)}</span>` : ""}
      ${m.lead ? `<p class="lead">${esc(m.lead)}</p>` : ""}
      ${m.tags.length ? `<div class="chips">${m.tags.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
      ${m.credits.length ? `<div><span class="mono mute" style="display:block;font-size:10.5px;letter-spacing:.24em;padding-bottom:10px">CREDITS — 經歷與作品</span>${m.credits.map((cr) => `<div class="cr${cr.first ? "" : " cont"}"><span>${esc(cr.label)}</span><span><b>${esc(cr.title)}</b>${cr.note ? `<small>${esc(cr.note)}</small>` : ""}</span></div>`).join("")}</div>` : ""}
      ${m.links.length ? `<div style="display:flex;flex-wrap:wrap;gap:10px">${m.links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener" data-cursor="開啟" class="pill solid">${esc(l.label)} ↗</a>`).join("")}</div>` : ""}
    </div>`;
  const heroImg = bts[0] ? bts[0].image : "";
  document.getElementById("app").innerHTML = nav("about") + `
  <header class="px wrap" style="padding-top:clamp(140px,22vh,230px);padding-bottom:clamp(60px,8vw,110px);display:grid;gap:clamp(40px,5vw,70px)">
    <span class="label" data-reveal="0">${esc(a.title || "關於推手")} — ABOUT</span>
    <h1 class="h-xl" style="font-size:clamp(46px,8.4vw,150px);line-height:1.04">${lines(a.headline || "每一幀畫面，|都有自己的靈魂。")}</h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:30px 60px">${paras.slice(0, 2).map((p, i) => `<p class="nl" data-reveal="${200 + i * 100}" style="margin:0;font-size:${i ? "16px" : "clamp(17px,1.4vw,20px)"};line-height:1.9;color:${i ? "#a8a49b" : "#efece6"};text-wrap:pretty">${esc(p)}</p>`).join("")}</div>
  </header>
  ${heroImg ? `<div style="margin:0 var(--pad)"><div data-clip style="overflow:hidden;height:clamp(320px,70vh,760px)"><img src="${esc(heroImg)}" alt="拍攝現場" data-par="90" style="width:100%;height:130%;object-fit:cover;margin-top:-15%"></div></div>` : ""}
  <section class="px wrap" style="padding-top:clamp(110px,17vh,200px);padding-bottom:clamp(110px,17vh,200px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:clamp(40px,6vw,100px);align-items:start">
    <div data-sticky-wide style="position:sticky;top:16vh;display:grid;gap:24px"><span class="label">01 / 製作流程</span>
      <h2 style="margin:0;font-family:Archivo,sans-serif;font-weight:900;font-variation-settings:'wdth' 70;font-size:clamp(80px,11vw,190px);line-height:.82;letter-spacing:-.02em"><span class="mask"><span data-rise="0">PRO—</span></span><span class="mask"><span data-rise="100">CESS</span></span></h2>
      <p style="margin:0;max-width:22em;font-size:16px;line-height:1.9;color:#a8a49b">從一個想法，到最後一格。每一步都與你同步。</p></div>
    <div>${(h.services || []).map((s, i) => `<div class="step" data-reveal="0"><div style="display:flex;align-items:baseline;gap:20px"><span class="num">${pad(i + 1)}</span><h3>${esc(s.title)}</h3></div><p>${esc(s.description)}</p></div>`).join("")}</div>
  </section>
  ${bts.length ? `<section class="gal" data-gal><div class="gal-stick">
    <div class="px" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:20px"><div style="display:grid;gap:16px"><span class="label">02 / 片場花絮 ON SET</span><h2 class="h-xl" style="font-size:clamp(44px,6vw,104px);letter-spacing:-.04em">${lines("鏡頭之外。")}</h2></div>
      <p style="margin:0;max-width:24em;font-size:15px;line-height:1.85;color:#a8a49b">燈光、走位、一次又一次的 Take——畫面之外的每個細節，都是成片的一部分。</p></div>
    <div class="gal-track" data-gtrack>${bts.map((b, i) => { const s = sizes[i % sizes.length]; return `<figure><div style="height:${s[0]};aspect-ratio:${s[1]}"><img data-gimg src="${esc(b.image)}" alt="${esc(b.caption || "拍攝花絮")}" loading="lazy"></div><figcaption><span>TAKE ${pad(i + 1)}</span><span>${esc(b.caption || "推手影像")}</span></figcaption></figure>`; }).join("")}</div>
  </div></section>` : ""}
  <section id="crew" class="px" style="border-top:1px solid var(--line);padding-top:clamp(100px,15vh,180px);padding-bottom:clamp(100px,15vh,180px)"><div style="max-width:1720px;margin:0 auto;display:grid;gap:clamp(40px,5vw,70px)">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px"><h2 class="h-xl" style="font-size:clamp(52px,8vw,140px)">${lines(t.title && t.title !== "我的團隊" ? t.title : "影像職人")}</h2>
      <span class="mono mute" data-reveal="100" style="font-size:11px;letter-spacing:.3em"><span style="color:var(--acc)">03 / THE CREW</span> — 點選照片，看完整介紹</span></div>
    <div data-crew-wide class="crew">${M.map((m, i) => `<div class="cp${i === 0 ? " on" : ""}" data-cp="${i}" data-cursor="${i === 0 ? esc(m.name) : "展開"}">
        <div class="ph"><img src="${esc(m.img)}" alt="${esc(m.name)}" style="object-position:${m.px}% ${m.py}%"><div class="shade"></div>
          <div class="vt"><b>${[...m.name].map((ch) => `<span>${esc(ch)}</span>`).join("")}</b><span class="mono" style="font-size:11px;letter-spacing:.2em">${pad(i + 1)} +</span></div><span class="rs">${esc(m.roleShort)}</span></div>
        <div class="dos" data-native-scroll>${dossier(m, i)}</div></div>`).join("")}</div>
    <div data-crew-narrow class="crew-m" style="display:none">${M.map((m, i) => `<div class="mb${i === 0 ? " on" : ""}" data-mb="${i}">
      <button type="button" class="mb-head" data-mbh="${i}" aria-expanded="${i === 0}">
        <span class="mb-ph"><img src="${esc(m.img)}" alt="${esc(m.name)}" style="object-position:${m.px}% ${m.py}%"></span>
        <span class="mb-shade"></span>
        <span class="mb-t"><span class="mono" style="font-size:10.5px;letter-spacing:.2em;color:var(--acc)">${pad(i + 1)} — ${esc(m.roleShort || m.role)}</span><b>${esc(m.name)}</b></span>
        <span class="mb-x">+</span>
      </button>
      <div class="mb-body"><div class="mb-in">${dossier(m, i)}</div></div></div>`).join("")}</div>
  </div></section>` + footer(c, "有故事？|我們開機。");

  const cps = $$("[data-cp]");
  const pick = (el) => { if (el.classList.contains("on")) return; cps.forEach((x) => { x.classList.toggle("on", x === el); x.dataset.cursor = x === el ? M[+x.dataset.cp].name : "展開"; }); };
  cps.forEach((el) => { el.addEventListener("click", () => pick(el)); });
  const crewLayout = () => { const n = innerWidth < 900; $("[data-crew-wide]").style.display = n ? "none" : "flex"; $("[data-crew-narrow]").style.display = n ? "grid" : "none"; };
  crewLayout(); addEventListener("resize", crewLayout);
  const mbs = $$("[data-mb]");
  const setMb = () => mbs.forEach((el) => { const b = $(".mb-body", el); b.style.height = el.classList.contains("on") ? $(".mb-in", el).scrollHeight + "px" : "0px"; });
  $$("[data-mbh]").forEach((btn) => btn.addEventListener("click", () => {
    const el = btn.parentElement, was = el.classList.contains("on");
    mbs.forEach((x) => { x.classList.toggle("on", x === el && !was); $(".mb-head", x).setAttribute("aria-expanded", String(x === el && !was)); });
    setMb();
    if (!was) setTimeout(() => { const y = el.getBoundingClientRect().top + scrollY - 70; scrollTo({ top: y, behavior: "smooth" }); }, 420);
  }));
  setMb(); addEventListener("resize", setMb); document.fonts && document.fonts.ready.then(setMb);
  if (location.hash === "#crew") setTimeout(() => { const el = $("#crew"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 40); }, 900);
  const g = $("[data-gal]"), tr = g && $("[data-gtrack]", g);
  frame = (f) => {
    if (!g) return;
    const r = g.getBoundingClientRect();
    if (r.bottom < 0 || r.top > f.vh) return;
    const p = f.cl(-r.top / (r.height - f.vh)), max = Math.max(0, tr.scrollWidth - innerWidth);
    tr.style.transform = "translate3d(" + (-p * max).toFixed(1) + "px,0,0)";
    $$("[data-gimg]", tr).forEach((im) => { const b = im.parentElement.getBoundingClientRect(); const q = (b.left + b.width / 2 - innerWidth / 2) / innerWidth; im.style.transform = "translate3d(" + (-q * 7 * f.M).toFixed(2) + "%,0,0)"; });
  };
}

/* ---------------- CONTACT ---------------- */
async function contact() {
  startFx("Contact");
  const c = await getPage("contact");
  const TYPES = ["品牌形象", "活動紀錄", "產品影片", "公部門專案", "FPV / 空拍", "其他"], BUD = ["10 萬以下", "10–30 萬", "30–60 萬", "60 萬以上", "尚未確定"], TIME = ["一個月內", "1–3 個月", "3 個月以上", "尚未確定"];
  const chips = (name, arr, multi) => `<div style="display:flex;flex-wrap:wrap;gap:10px" data-group="${name}" data-multi="${multi ? 1 : 0}">${arr.map((x) => `<button type="button" class="chip" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
  const leg = (n, t) => `<legend><span class="mono" style="font-size:12px;color:var(--acc)">${n}</span><b>${t}</b></legend>`;
  const title = /[|\n]/.test(String(c.title || "")) ? c.title : "有故事？|我們開機。";
  document.getElementById("app").innerHTML = nav("contact") + `
  <header class="px wrap" style="padding-top:clamp(140px,22vh,230px);padding-bottom:clamp(60px,8vw,100px);display:grid;gap:clamp(40px,5vw,60px)">
    <span class="label" data-reveal="0">聯絡我們 — CONTACT</span>
    <h1 class="h-xl" style="font-size:clamp(60px,11vw,200px);line-height:.98;letter-spacing:-.05em">${lines(title)}</h1>
  </header>
  <main class="px wrap" style="padding-bottom:clamp(100px,15vh,170px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:clamp(50px,7vw,110px);align-items:start">
    <aside data-sticky-wide style="position:sticky;top:16vh;display:grid;gap:34px;font-family:var(--mono);font-size:12.5px;letter-spacing:.06em;line-height:1.9">
      <p class="nl" data-reveal="0" style="margin:0;font-family:'Noto Sans TC',sans-serif;font-size:17px;letter-spacing:0;line-height:1.9;color:#a8a49b;max-width:24em">${esc(c.subtitle)}</p>
      <div data-reveal="80" style="display:grid;border-top:1px solid var(--line);padding-top:18px"><span class="mute">EMAIL</span><a href="mailto:${esc(c.email)}" style="font-size:clamp(15px,1.4vw,19px)">${esc(c.email)}</a></div>
      <div data-reveal="160" style="display:grid;border-top:1px solid var(--line);padding-top:18px"><span class="mute">PHONE</span><a href="tel:${esc(String(c.phone).replace(/[^0-9+]/g, ""))}" style="font-size:clamp(15px,1.4vw,19px)">${esc(c.phone)}</a></div>
      <div data-reveal="240" style="display:grid;border-top:1px solid var(--line);padding-top:18px"><span class="mute">STUDIO</span><a href="https://maps.google.com/?q=${encodeURIComponent(c.address)}" target="_blank" rel="noopener" data-cursor="地圖">${esc(c.address)} ↗</a></div>
    </aside>
    <div data-formbox>
      <form data-form style="display:grid;gap:clamp(44px,5vw,64px)">
        <fieldset data-reveal="0">${leg("01", "專案類型（可複選）")}${chips("type", TYPES, true)}</fieldset>
        <fieldset data-reveal="0">${leg("02", "預算範圍")}${chips("budget", BUD, false)}</fieldset>
        <fieldset data-reveal="0">${leg("03", "預計上線時間")}${chips("timeline", TIME, false)}</fieldset>
        <fieldset data-reveal="0" style="gap:26px">${leg("04", "你的資訊")}
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:26px 24px">
            <label class="f-l">姓名 *<input required name="name" placeholder="王小明"></label>
            <label class="f-l">公司 / 單位<input name="company" placeholder="選填"></label>
            <label class="f-l">EMAIL *<input required type="email" name="email" placeholder="you@company.com"></label>
            <label class="f-l">電話<input type="tel" name="phone" placeholder="選填"></label>
          </div>
          <label class="f-l">想說的話<textarea name="message" rows="4" placeholder="簡單描述你的想法、參考影片或需要的交付格式"></textarea></label>
        </fieldset>
        <div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap"><button type="submit" data-magnet data-cursor="送出" class="circle-cta" data-submit>送出需求<br>↗</button><span data-msg class="mono mute" style="font-size:11px;letter-spacing:.12em;max-width:26em;line-height:1.8">我們會在兩個工作天內回覆。</span></div>
      </form>
    </div>
  </main>
  <div style="overflow:hidden;border-top:1px solid var(--line)"><div data-big style="font-family:'Noto Sans TC',sans-serif;font-weight:900;font-size:24vw;line-height:.9;letter-spacing:-.04em;white-space:nowrap;width:max-content;margin:0 auto;padding-top:.08em;color:var(--acc);transform:translateY(8%)">推手影像</div></div>
  <div class="foot-bot px" style="padding-top:18px;padding-bottom:18px;border-top:1px solid var(--line)"><span>推手影像製作有限公司</span><span>© ${new Date().getFullYear()} UPRISE-PRODUCTION</span></div>`;

  $$("[data-group]").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    if (g.dataset.multi === "1") b.classList.toggle("on");
    else $$(".chip", g).forEach((x) => x.classList.toggle("on", x === b && !x.classList.contains("on")));
  }));
  const big = $("[data-big]");
  const fit = () => { big.style.fontSize = "100px"; big.style.fontSize = (100 * innerWidth * 0.98 / big.scrollWidth) + "px"; };
  fit(); document.fonts && document.fonts.ready.then(fit); [500, 1500, 3000].forEach((t) => setTimeout(fit, t)); addEventListener("resize", fit);
  const form = $("[data-form]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const pickd = (n) => $$(`[data-group="${n}"] .chip.on`).map((x) => x.dataset.v).join("、");
    fd.set("專案類型", pickd("type") || "—"); fd.set("預算範圍", pickd("budget") || "—"); fd.set("預計上線", pickd("timeline") || "—");
    fd.set("_subject", "影像製作需求｜" + (fd.get("company") || fd.get("name") || ""));
    const btn = $("[data-submit]"), msg = $("[data-msg]");
    btn.disabled = true; msg.textContent = "傳送中…";
    let ok = false;
    if (c.formspree_id) {
      try { const r = await fetch("https://formspree.io/f/" + c.formspree_id, { method: "POST", body: fd, headers: { Accept: "application/json" } }); ok = r.ok; } catch (err) { ok = false; }
    }
    if (!ok) {
      const body = [...fd.entries()].filter(([k]) => k[0] !== "_").map(([k, v]) => k + "：" + v).join("\n");
      location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent(fd.get("_subject")) + "&body=" + encodeURIComponent(body);
    }
    $("[data-formbox]").innerHTML = `<div style="display:grid;gap:24px;align-content:start;padding-top:20px"><span class="label">● REC — 已收到</span>
      <h2 class="h-xl" style="font-size:clamp(44px,6vw,96px);line-height:1.05;letter-spacing:-.04em">謝謝，${esc(fd.get("name"))}。<br>我們很快聯絡你。</h2>
      <p style="margin:0;font-size:16px;line-height:1.9;color:#a8a49b;max-width:28em">${ok ? "需求已送出，我們會盡快回覆。" : "已開啟你的郵件程式；若沒有自動開啟，請直接寄信至 " + esc(c.email) + "。"}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap"><a href="works.html" data-to="Works" class="pill">先看看作品 →</a></div></div>`;
    scrollTo({ top: 0, behavior: "smooth" });
  });
}

({ home, works, about, contact }[PAGE] || home)();
