# Come pubblicare una notizia

Il sito legge automaticamente i file dentro `notizie/news/`. Per pubblicare una
nuova notizia:

1. Copia `notizie/news/TEMPLATE.html`.
2. Rinomina la copia con il numero successivo a 3 cifre (es. se l'ultima è
   `004.html`, la nuova si chiama `005.html`).
3. Apri il file e modifica solo:
   - i 4 tag `<meta name="news-...">` nella `<head>` (titolo, data, categoria,
     estratto, immagine)
   - il titolo `<h1>` e il testo dentro `<article>`
4. Salva. Fatto: la notizia compare da sola in home (fra le ultime 3) e nella
   pagina `notizie.html`, ordinata per data.

Non serve creare o modificare nessun altro file. Non serve un "elenco" delle
notizie da tenere aggiornato a mano.

## Come funziona "sotto il cofano"

Le pagine `index.html`, `notizie.html` e `articolo.html` caricano
`assets/js/news.js`, che prova a scaricare in sequenza `001.html`, `002.html`,
`003.html`... da `notizie/news/` finché non trova 6 numeri consecutivi mancanti
(così tollera anche qualche "buco" se in futuro cancelli una notizia). Ordina
poi tutto per la data indicata in `news-date`.

**Unico vincolo:** i file vanno numerati in sequenza, senza saltare troppi
numeri di fila (max 5 buchi consecutivi) altrimenti lo script smette di
cercare oltre quel punto. Se cancelli una notizia vecchia, non serve
rinumerare le altre: è solo un ID interno, invisibile ai visitatori.

## Se in futuro cambi hosting

Questo meccanismo funziona su qualunque hosting statico reale (Netlify,
GitHub Pages, un normale spazio web, ecc.) perché usa solo `fetch()` su URL
relativi — **non funziona aprendo i file con doppio click da `file://`**,
serve un vero server web (anche in locale, es. `python -m http.server`).

Se il tuo hosting supporta il "listing" automatico delle cartelle, si può in
futuro sostituire la logica di ricerca sequenziale con una lettura diretta
della cartella: fammelo sapere e adatto lo script.
