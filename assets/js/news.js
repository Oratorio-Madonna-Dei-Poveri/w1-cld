/* =========================================================
   Oratorio Madonna dei Poveri — motore Notizie
   ---------------------------------------------------------
   Come funziona (nessuna configurazione manuale richiesta):
   1) Ogni notizia è un file HTML dentro notizie/news/, numerato
      in sequenza: 001.html, 002.html, 003.html, ...
   2) Per pubblicare una nuova notizia basta copiare
      notizie/news/TEMPLATE.html, rinominarlo con il numero
      successivo (es. se l'ultimo è 004.html, il nuovo è 005.html)
      e compilarne i contenuti.
   3) Questo script "scopre" da solo i file presenti provando a
      caricarli in sequenza (nessun elenco da aggiornare a mano).
   ========================================================= */

const NEWS_DIR = 'notizie/news/';
const NEWS_MAX_PROBE = 300;      // numero massimo di file che proviamo a cercare
const NEWS_MAX_MISSES = 6;       // quanti "buchi" consecutivi tolleriamo prima di fermarci
const NEWS_CACHE_KEY = 'mdp-news-cache-v1';
const NEWS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuti

function padId(n) {
    return String(n).padStart(3, '0');
}

function metaContent(doc, name) {
    const el = doc.querySelector(`meta[name="${name}"]`);
    return el ? el.getAttribute('content').trim() : '';
}

async function fetchNewsFile(id) {
    const url = `${NEWS_DIR}${id}.html`;
    let res;
    try {
        res = await fetch(url, { cache: 'no-store' });
    } catch (err) {
        return null;
    }
    if (!res || !res.ok) return null;
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const articleEl = doc.querySelector('article');
    return {
        id,
        url,
        title: metaContent(doc, 'news-title') || doc.title || 'Senza titolo',
        date: metaContent(doc, 'news-date') || '',
        category: metaContent(doc, 'news-category') || 'Notizia',
        excerpt: metaContent(doc, 'news-excerpt') || '',
        image: metaContent(doc, 'news-image') || 'assets/img/news-placeholder.svg',
        content: articleEl ? articleEl.innerHTML : (doc.body ? doc.body.innerHTML : '')
    };
}

function readCache() {
    try {
        const raw = sessionStorage.getItem(NEWS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed.timestamp || Date.now() - parsed.timestamp > NEWS_CACHE_TTL_MS) return null;
        return parsed.items;
    } catch (err) {
        return null;
    }
}

function writeCache(items) {
    try {
        sessionStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), items }));
    } catch (err) {
        /* storage non disponibile: pazienza, si ricaricherà ogni volta */
    }
}

function sortNewsDesc(items) {
    return items.slice().sort((a, b) => {
        const da = Date.parse(a.date);
        const db = Date.parse(b.date);
        if (!isNaN(da) && !isNaN(db) && da !== db) return db - da;
        return Number(b.id) - Number(a.id);
    });
}

/**
 * Scopre e carica tutte le notizie disponibili, dalla più recente.
 * Risultato messo in cache per la durata della sessione del browser.
 */
async function loadAllNews() {
    const cached = readCache();
    if (cached) return cached;

    const items = [];
    let misses = 0;
    for (let n = 1; n <= NEWS_MAX_PROBE; n++) {
        const item = await fetchNewsFile(padId(n));
        if (item) {
            items.push(item);
            misses = 0;
        } else {
            misses++;
            if (misses >= NEWS_MAX_MISSES) break;
        }
    }
    const sorted = sortNewsDesc(items);
    writeCache(sorted);
    return sorted;
}

function formatDateIt(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function newsCardHTML(item) {
    const dateLabel = formatDateIt(item.date);
    return `
    <a href="articolo.html?id=${item.id}" class="news-card group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col" data-category="${item.category}">
        <div class="aspect-[16/10] overflow-hidden bg-slate-100">
            <img src="${item.image}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='assets/img/news-placeholder.svg'">
        </div>
        <div class="p-5 flex flex-col gap-2 flex-1">
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span class="bg-sky-50 text-brand-sky px-2.5 py-1 rounded-full">${item.category}</span>
                ${dateLabel ? `<span>${dateLabel}</span>` : ''}
            </div>
            <h3 class="font-heading text-lg font-bold text-slate-900 leading-snug line-clamp-2">${item.title}</h3>
            <p class="text-sm text-slate-600 leading-relaxed line-clamp-3">${item.excerpt}</p>
            <span class="mt-auto pt-2 text-sm font-semibold text-brand-blue inline-flex items-center gap-1">
                Leggi tutto <i class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </span>
        </div>
    </a>`;
}

function newsSkeletonHTML() {
    return `
    <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden">
        <div class="aspect-[16/10] skeleton-card"></div>
        <div class="p-5 space-y-3">
            <div class="h-4 w-24 rounded skeleton-card"></div>
            <div class="h-5 w-4/5 rounded skeleton-card"></div>
            <div class="h-4 w-full rounded skeleton-card"></div>
            <div class="h-4 w-2/3 rounded skeleton-card"></div>
        </div>
    </div>`;
}

function newsEmptyStateHTML(message) {
    return `
    <div class="col-span-full text-center py-14 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
        <i class="fa-regular fa-newspaper text-3xl text-slate-400 mb-3"></i>
        <p class="text-slate-600 font-medium">${message}</p>
        <p class="text-xs text-slate-400 mt-1">Per pubblicarne una, copia <code>notizie/news/TEMPLATE.html</code> e rinominalo con il numero successivo.</p>
    </div>`;
}
