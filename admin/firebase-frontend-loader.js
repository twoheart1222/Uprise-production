/**
 * Firestore-first content loader.
 *
 * Existing pages still request content/*.md. This module keeps that stable
 * interface while serving the matching Firestore document first. If Firebase
 * is unavailable or the document has not been migrated yet, the original
 * Markdown request continues normally.
 */
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCyC9CaF36J27mjCl908TFCukNtwAilM4o",
  authDomain: "uprise-videoproduction-admin.firebaseapp.com",
  projectId: "uprise-videoproduction-admin",
  storageBucket: "uprise-videoproduction-admin.firebasestorage.app",
  messagingSenderId: "180297157082",
  appId: "1:180297157082:web:c352e76d63cac6bc7458e3"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
getAuth(app);
const db = getFirestore(app);
const nativeFetch = window.fetch.bind(window);
const pageAliases = { index: 'home' };

export async function loadFirebasePage(pageName) {
  const previewData = loadLocalPreviewPage(pageName);
  if (previewData) return previewData;
  try {
    const snap = await getDoc(doc(db, 'pages', pageName));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.warn(`[Firebase] Unable to load pages/${pageName}; using Markdown fallback.`, error);
    return null;
  }
}

function loadLocalPreviewPage(pageName) {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('preview')) return null;
    const pages = JSON.parse(localStorage.getItem('uprisePreviewPages') || '{}');
    return pages && pages[pageName] ? stripVolatileImageUrls(pages[pageName]) : null;
  } catch (error) {
    console.warn('Unable to read local preview data.', error);
    return null;
  }
}

function stripVolatileImageUrls(value) {
  if (Array.isArray(value)) return value.map(stripVolatileImageUrls);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, stripVolatileImageUrls(item)]));
  }
  if (typeof value === 'string' && value.startsWith('blob:')) return '';
  return value;
}

function toMarkdown(data) {
  const frontMatter = { ...data };
  const body = typeof frontMatter.body === 'string' ? frontMatter.body : '';
  delete frontMatter.body;
  return `---\n${JSON.stringify(frontMatter, null, 2)}\n---\n${body}`;
}

window.loadFirebasePage = loadFirebasePage;
window.fetch = async function firestoreFirstFetch(input, init) {
  const url = typeof input === 'string' ? input : input && input.url;
  const match = typeof url === 'string' && url.match(/(?:^|\/)content\/([a-z-]+)\.md(?:[?#].*)?$/i);
  if (!match) return nativeFetch(input, init);

  const pageName = pageAliases[match[1]] || match[1];
  const data = await loadFirebasePage(pageName);
  if (!data) return nativeFetch(input, init);

  return new Response(toMarkdown(data), {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'X-Uprise-Source': 'firestore' }
  });
};
