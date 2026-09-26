// 推手影像：前台資料層
// 讀取順序：後台預覽（?preview）→ Firestore pages/{name} → 下方預設值
const CAT_EN = { "品牌形象廣告": "BRAND", "品牌": "BRAND", "產品形象廣告": "PRODUCT", "產品": "PRODUCT", "公部門宣傳影片": "PUBLIC SECTOR", "公部門": "PUBLIC SECTOR", "活動紀錄": "EVENT", "活動": "EVENT", "其他": "OTHER" };
const LEGACY = [["portfolio_brand", "品牌形象廣告"], ["portfolio_product", "產品形象廣告"], ["portfolio_public", "公部門宣傳影片"], ["portfolio_event", "活動紀錄"], ["portfolio_other", "其他"]];

// 經歷類別（後台下拉選單與前台排序共用）
export const CREDIT_TYPES = ["創辦", "學歷", "經歷", "專長", "肯定", "短片導演", "短片剪輯", "短片攝影", "廣告導演", "攝影", "得獎"];

const DEFAULTS = {
  home: {
    hero_word: "推手", hero_text: "推手影像",
    hero_video: "https://res.cloudinary.com/dfnfcyglu/video/upload/v1763893930/hero_bg_ickrbe.mp4", hero_video_mobile: "",
    manifesto: "影像不只是紀錄，而是能被感受、被記住、被分享的故事。",
    intro: "電影級影像製作。從策劃、拍攝到後期，把想法推向更清晰的畫面。",
    services: [
      { title: "需求溝通", description: "深入了解品牌理念、目標受眾與預期成效，量身打造影像策略。" },
      { title: "創意發想", description: "提供獨特的視覺觀點與腳本提案，將抽象概念轉化為具體畫面。" },
      { title: "專業拍攝", description: "運用電影級攝影機與燈光設備，由資深團隊執行高規格拍攝，含 FPV 與空拍。" },
      { title: "後期製作", description: "精細剪輯、調色、特效與音效設計，賦予影像最終的生命力。" }
    ],
    behind_the_scenes: [
      { image: "/uploads/c0105-mp4-20250619-152423-475.jpg" }, { image: "/uploads/line-album-2024-3-18-241010-21.jpg" },
      { image: "/uploads/85c3f506-6a9d-4d62-b523-bd13f0d65315.jpg" }, { image: "/uploads/line-album-2024-3-18-241011-5.jpg" },
      { image: "/uploads/line-album-2024-3-18-241011-6.jpg" }
    ],
    featured: ["https://youtu.be/-wELkE0IQwc", "https://youtu.be/-PwiVNiFrdo", "https://youtu.be/hQEk3IoBtq4", "https://youtu.be/ydvPTXpeDoA"]
  },
  works: {
    portfolio_categories: [
      { name: "品牌形象廣告", items: [
        { title: "「一起、更好」｜前鎮、小港市議員參選人林浤澤", client: "電視競選廣告", link: "https://www.youtube.com/watch?v=hRu-NKRTgfQ" },
        { title: "產品氣泡酒＿上市宣傳片", client: "蜜蜂故事館", link: "https://youtu.be/-PwiVNiFrdo" },
        { title: "台中立委參選人江肇國形象廣告", client: "電視競選廣告", link: "https://youtu.be/usx3hIK_Ns8" }] },
      { name: "產品形象廣告", items: [
        { title: "聯名禮盒形象短影音", client: "BabyfaceX福寶寶", link: "https://youtube.com/shorts/isCUV-_33No" },
        { title: "林源美香舖＿職人採訪紀錄", client: "林源美香舖", link: "https://youtu.be/kfgdTEdD6To" },
        { title: "三立柱電動翻身醫療床產品影片", client: "護樂康", link: "https://youtu.be/VotqHxX2GA4" },
        { title: "SUZUKI x Pilots Crew 飛行日記", client: "SUZUKI x Pilots Crew", link: "https://youtu.be/-wELkE0IQwc" }] },
      { name: "公部門宣傳影片", items: [
        { title: "注入青流＿青年共創影響力", client: "雲林縣古坑鄉華南社區", link: "https://youtu.be/ydvPTXpeDoA" },
        { title: "雲林古坑：教育點亮山村，華南里山永續進行式", client: "雲林縣古坑鄉華南社區", link: "https://youtu.be/GVxGalIH3PA" },
        { title: "蜜蜂與我們的餐桌", client: "蜜蜂故事館", link: "https://youtu.be/MKMvgTELkSs" },
        { title: "看見＿華南產業與生態", client: "雲林縣古坑鄉華南社區", link: "https://youtu.be/vNprFeiDVWE" }] },
      { name: "活動紀錄", items: [
        { title: "甲辰年保境鎮庄祈安遶境大典 紀錄片", client: "高雄市前鎮鎮南宮", link: "https://youtu.be/hQEk3IoBtq4" },
        { title: "兒童節童樂派對", client: "兒童節活動紀錄", link: "https://youtu.be/ayYvxpVfLqA" },
        { title: "中秋夜晚會影片", client: "高雄市前鎮區明孝里", link: "https://youtu.be/pSD-UESA31Y" },
        { title: "台中立委參選人江肇國競選總部成立", client: "台中立委參選人江肇國", link: "https://youtu.be/0SVsgNWDjrA" },
        { title: "芭比路跑活動紀錄", client: "芭比路跑", link: "https://youtu.be/Fy4RQTuXixA" },
        { title: "紙風車＿番薯森林奇遇記", client: "紙風車", link: "https://youtu.be/OUgtuC8esrM" },
        { title: "智慧城市展暨淨零城市展＿南投", client: "智慧城市展暨淨零城市展", link: "https://youtu.be/fBIH2CS56YI" }] },
      { name: "其他", items: [
        { title: "台中立委參選人江肇國政策宣傳影片", client: "台中立委參選人江肇國", link: "https://youtu.be/vXgXWo_2u-s" }] }
    ]
  },
  team: {
    members: [
      { name: "林家佑", role: "導演", avatar: "/images/uploads/line_album_2024.3.18_241011_8.jpg", ig_url: "https://www.instagram.com/harry.lin_jiayou", bio: "推手影像製作有限公司（Uprise-Production）的創辦人與導演。現在就讀臺灣藝術大學電影系碩士。" },
      { name: "傅啓榮", role: "合作導演 Co-director", avatar: "/images/uploads/s__23396358.jpg", ig_url: "https://www.instagram.com/qirong_poo", bio: "五年影像敘事經驗，擅長捕捉人物細膩情感，作品曾獲國內外短片獎項肯定。" },
      { name: "胡庭瀚", role: "合作 導演/攝影/穿越機攝影/空拍攝影", avatar: "/images/uploads/79e26a98-64e1-41ba-8d2e-a2ba95f031ca.jpg", ig_url: "https://www.instagram.com/conan_0906", bio: "以強烈個人美學為核心，結合次文化、色彩衝擊、飛行攝影與互動藝術，打造跨界且具反叛精神的影像世界" }
    ]
  },
  about: {
    title: "關於推手",
    subtitle: "探索我們對影像的熱情與堅持",
    headline: "每一幀畫面，|都有自己的靈魂。",
    body: "推手影像成立於 2025 年，由一群對影像充滿熱情的職人組成。我們相信每一個品牌都有值得被看見的故事。\n\n從品牌形象、公部門專案、活動紀錄到產品影片，我們以電影的標準對待每一次拍攝——策劃、拍攝、後期一條龍完成，含 FPV 穿越機與空拍。"
  },
  contact: {
    title: "有故事？|我們開機。", subtitle: "填寫需求，我們會在兩個工作天內回覆。想直接聊，也歡迎來電。",
    address: "台中市西區臺灣大道二段285號31樓", email: "uprisevideoproduction@gmail.com", phone: "0937-672-279", formspree_id: "movbylbl"
  }
};

// 後台尚未填寫結構化經歷時使用（依姓名比對）
const CREW_FALLBACK = {
  "林家佑": { role_en: "DIRECTOR / FOUNDER", role_short: "DIRECTOR",
    lead: "推手影像製作有限公司（Uprise-Production）創辦人與導演，現就讀國立臺灣藝術大學電影系碩士，以電影敘事手法拍攝商業廣告與品牌形象影片。",
    tags: ["商業廣告", "品牌形象", "電影製作", "劇情短片"],
    credits: [{ type: "創辦", title: "推手影像製作有限公司", note: "創辦人・導演" }, { type: "學歷", title: "國立臺灣藝術大學 電影系", note: "碩士在學" }, { type: "短片導演", title: "《流量底限》", note: "愛學影展 線上放映" }],
    extra_links: [{ label: "觀看《流量底限》", href: "https://stv.naer.edu.tw/i-fun-filmfestival/movie_view.jsp?unitpost_id=455" }] },
  "傅啓榮": { role_en: "CO-DIRECTOR", role_short: "CO-DIRECTOR", tags: ["影像敘事", "人物紀實", "情感捕捉"],
    credits: [{ type: "經歷", title: "影像敘事 五年", note: "劇情與人物影像創作" }, { type: "專長", title: "人物細膩情感", note: "以鏡頭語言貼近被攝者" }, { type: "肯定", title: "國內外短片獎項", note: "作品曾獲獎項肯定" }] },
  "胡庭瀚": { role_en: "DIRECTOR / DP / FPV / AERIAL", role_short: "DP / FPV", tags: ["FPV 穿越機", "空拍", "次文化", "色彩美學", "互動藝術"],
    credits: [{ type: "短片導演", title: "《那一天你沒回來》", note: "入圍 藝美獎" }, { type: "短片導演", title: "《Noise》", note: "入圍 藝美獎" }, { type: "短片導演", title: "《Heath》", note: "入圍 螺絲起子國際學生短片創作" }, { type: "短片剪輯", title: "《乘客》", note: "入圍 南華大學 113 年教育部生命教育關懷與推廣微電影競賽" }, { type: "短片攝影", title: "《第一人稱六二八》", note: "myfone 行動創作 人氣票選第一名" }] }
};

function previewData(name) {
  try {
    if (!new URLSearchParams(location.search).has("preview")) return null;
    const p = JSON.parse(localStorage.getItem("uprisePreviewPages") || "{}");
    return p && p[name] ? p[name] : null;
  } catch (e) { return null; }
}

let loaderP = null;
async function remote(name) {
  try {
    loaderP = loaderP || import("../firebase-frontend-loader.js");
    const m = await loaderP;
    return await m.loadFirebasePage(name);
  } catch (e) { console.warn("[uprise] Firestore unavailable, using defaults", e); return null; }
}

const clean = (o) => { const r = {}; Object.keys(o || {}).forEach((k) => { const v = o[k]; if (v !== "" && v != null && !(Array.isArray(v) && !v.length)) r[k] = v; }); return r; };

export async function getPage(name) {
  const d = previewData(name) || (await remote(name));
  return { ...DEFAULTS[name], ...clean(d) };
}

export const ytId = (url) => { const m = String(url || "").match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : ""; };
export const thumb = (it, q) => it.image || (ytId(it.link) ? "https://i.ytimg.com/vi/" + ytId(it.link) + "/" + (q || "hqdefault") + ".jpg" : "");
export const oneLine = (s) => String(s || "").replace(/\s*\n\s*/g, "").trim();

export function categories(w) {
  let cats = Array.isArray(w.portfolio_categories) && w.portfolio_categories.length ? w.portfolio_categories
    : LEGACY.map(([k, name]) => ({ name, items: w[k] || [] }));
  return cats.map((c) => ({ name: c.name || "", en: c.en || CAT_EN[c.name] || "", items: (c.items || []).filter((i) => i && (i.link || i.image)).map((i) => ({ ...i, cat: c.name || "", catEn: c.en || CAT_EN[c.name] || "" })) }))
    .filter((c) => c.items.length);
}
export const allWorks = (cats) => cats.flatMap((c) => c.items);

export function featured(home, cats) {
  const all = allWorks(cats);
  const picks = (Array.isArray(home.featured) ? home.featured : String(home.featured || "").split(/\n+/))
    .map((x) => (typeof x === "string" ? x : x && x.link)).map(ytId).filter(Boolean)
    .map((id) => all.find((w) => ytId(w.link) === id)).filter(Boolean);
  if (picks.length) return picks.slice(0, 6);
  return cats.slice(0, 4).map((c) => c.items[0]);
}

function parseFullBio(md) {
  const out = []; let cat = "";
  String(md || "").split(/\n/).forEach((ln) => {
    const h2 = ln.match(/^##\s+(.+)/), h3 = ln.match(/^###\s+(.+)/);
    if (h2 && !/^#/.test(h2[1]) && h2[1].length <= 10 && !/\*/.test(h2[1])) cat = h2[1].trim();
    else if (h3 && cat) {
      const t = h3[1].replace(/\*\*/g, "").trim(), m = t.match(/^(.*?《[^》]+》)\s*(.*)$/);
      out.push(m ? { type: cat, title: m[1].trim(), note: m[2].trim() } : { type: cat, title: t, note: "" });
    }
  });
  return out;
}

export function groupCredits(list) {
  const order = [], by = {};
  list.forEach((c) => { const k = c.type || "經歷"; if (!by[k]) { by[k] = []; order.push(k); } by[k].push(c); });
  order.sort((a, b) => { const x = CREDIT_TYPES.indexOf(a), y = CREDIT_TYPES.indexOf(b); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); });
  const out = [];
  order.forEach((k) => by[k].forEach((c, i) => out.push({ ...c, label: i === 0 ? k : "", first: i === 0 })));
  return out;
}

export function members(team) {
  return (team.members || []).filter((m) => m && m.name).map((m) => {
    const fb = CREW_FALLBACK[m.name] || {};
    const tags = Array.isArray(m.tags) ? m.tags : String(m.tags || "").split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
    let credits = Array.isArray(m.credits) && m.credits.length ? m.credits.filter((c) => c && c.title) : [];
    if (!credits.length) credits = fb.credits || parseFullBio(m.full_bio);
    const links = [];
    if (m.ig_url) links.push({ label: "Instagram", href: m.ig_url });
    if (m.portfolio_url && !/uprise-videoproduction\.com\/works/.test(m.portfolio_url)) links.push({ label: "作品集", href: m.portfolio_url });
    (Array.isArray(m.links) && m.links.length ? m.links : fb.extra_links || []).forEach((l) => l && l.href && links.push({ label: l.label || "連結", href: l.href }));
    return {
      name: m.name, role: m.role || "", roleEn: m.role_en || fb.role_en || "", roleShort: m.role_short || fb.role_short || (m.role_en || "").split("/")[0] || "",
      img: m.avatar || m.image || "", px: m.photo_x ?? 50, py: m.photo_y ?? 20,
      lead: oneLine(m.lead || fb.lead || m.bio), tags: tags.length ? tags : fb.tags || [],
      credits: groupCredits(credits), links
    };
  });
}
