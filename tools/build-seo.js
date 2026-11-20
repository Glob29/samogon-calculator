/*
 * Генератор посадочных страниц под поисковые запросы (все языки).
 *
 * Запуск: node tools/build-seo.js
 * Вход:   content/seo-pages*.js + index.html (шаблон)
 * Выход:  <slug>.html для ru, en/<slug>.html для en, sitemap.xml, robots.txt
 *
 * Страницы одного смысла связываются через `id` и получают hreflang-альтернативы.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const BASE = 'https://glob29.github.io/samogon-calculator/';
const shellRaw = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const LANGS = [
  { code: 'ru', dir: '', files: ['content/seo-pages.js'], label: 'Русский', htmlLang: 'ru' },
  {
    code: 'en',
    dir: 'en',
    files: ['content/seo-pages.en.js', 'content/seo-pages.en.more.js'],
    label: 'English',
    htmlLang: 'en'
  }
];

const entries = [];
LANGS.forEach(function (lang) {
  (lang.files || []).forEach(function (file) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) return;
    require(full).forEach(function (page) {
      entries.push({
        lang: lang,
        page: page,
        id: page.id || page.slug
      });
    });
  });
});

/* группы переводов по id */
const groups = {};
entries.forEach(function (e) {
  (groups[e.id] = groups[e.id] || []).push(e);
});

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function urlFor(entry) {
  return BASE + (entry.lang.dir ? entry.lang.dir + '/' : '') + entry.page.slug + '.html';
}

function relFor(entry) {
  return entry.lang.dir ? '../' : '';
}

/** Подстраивает относительные пути шаблона под вложенную папку. */
function localizePaths(html, prefix) {
  if (!prefix) return html;
  return html
    .replace(/href="assets\//g, 'href="' + prefix + 'assets/')
    .replace(/src="assets\//g, 'src="' + prefix + 'assets/')
    .replace(/href="manifest\.webmanifest"/g, 'href="' + prefix + 'manifest.webmanifest"')
    .replace(/href="support\.html"/g, 'href="' + prefix + 'support.html"')
    .replace(/href="\.\//g, 'href="' + prefix + '"');
}

function relUrl(from, to) {
  const sameDir = from.lang.dir === to.lang.dir;
  const file = to.page.slug + '.html';
  if (sameDir) return file;
  if (!to.lang.dir) return '../' + file;
  return to.lang.dir + '/' + file;
}

function alternates(entry) {
  return groups[entry.id].map(function (other) {
    return {
      hreflang: other.lang.htmlLang,
      url: urlFor(other),
      rel: relUrl(entry, other),
      self: other === entry,
      label: other.lang.label
    };
  });
}

function introBlock(entry) {
  const links = alternates(entry).map(function (a) {
    return a.self
      ? '<strong>' + esc(a.label) + '</strong>'
      : '<a href="' + a.rel + '" hreflang="' + a.hreflang + '">' + esc(a.label) + '</a>';
  }).join(' <span class="sep">·</span> ');

  return [
    '  <article class="seo-article">',
    '    <p class="lang-links">' + links + '</p>',
    '    <h1>' + esc(entry.page.h1) + '</h1>',
    '    <p class="lead">' + esc(entry.page.lead) + '</p>',
    '  </article>',
    ''
  ].join('\n');
}

function outroBlock(page) {
  const sections = page.sections.map(function (s) {
    return '    <h2>' + esc(s.h2) + '</h2>\n    ' + s.html;
  }).join('\n\n');

  const faq = page.faq.map(function (f) {
    return '    <details class="faq"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
  }).join('\n');

  return [
    '  <article class="seo-article seo-article--outro">',
    sections,
    '',
    '    <h2>' + (page.lang === 'en' ? 'FAQ' : 'Частые вопросы') + '</h2>',
    faq,
    '  </article>',
    ''
  ].join('\n');
}

function headExtra(entry) {
  const page = entry.page;
  const blocks = [
    '<link rel="canonical" href="' + urlFor(entry) + '">'
  ];

  alternates(entry).forEach(function (a) {
    blocks.push('<link rel="alternate" hreflang="' + a.hreflang + '" href="' + a.url + '">');
  });
  const ruEntry = groups[entry.id].filter(function (x) { return x.lang.code === 'ru'; })[0];
  const fallback = ruEntry || groups[entry.id][0];
  if (fallback) blocks.push('<link rel="alternate" hreflang="x-default" href="' + urlFor(fallback) + '">');

  blocks.push(
    '<meta property="og:type" content="article">',
    '<meta property="og:title" content="' + esc(page.title) + '">',
    '<meta property="og:description" content="' + esc(page.description) + '">',
    '<meta property="og:url" content="' + urlFor(entry) + '">',
    '<meta property="og:image" content="' + BASE + 'assets/icon-512.png">',
    '<meta property="og:site_name" content="Samogon Calculator">',
    '<meta property="og:locale" content="' + (page.lang === 'en' ? 'en_US' : 'ru_RU') + '">',
    '<script type="application/ld+json">' + JSON.stringify(jsonLd(page)) + '</script>'
  );

  return blocks.join('\n');
}

function jsonLd(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: page.lang || 'ru',
    mainEntity: page.faq.map(function (f) {
      return {
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      };
    })
  };
}

let built = 0;

entries.forEach(function (entry) {
  const page = entry.page;
  if (!page.slug || !page.title || !page.h1) throw new Error('нет slug/title/h1 у ' + JSON.stringify(page).slice(0, 80));

  const prefix = relFor(entry);
  let html = localizePaths(shellRaw, prefix);

  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + esc(page.title) + '</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/,
    '<meta name="description" content="' + esc(page.description) + '">');

  // canonical главной не должен остаться: у страницы свой
  html = html.replace(/\s*<link rel="canonical" href="[^"]*">/, '');
  html = html.replace('</head>', headExtra(entry) + '\n</head>');

  html = html.replace(
    /<h1 data-i18n="app.title">[^<]*<\/h1>/,
    '<a class="brand-title" href="' + (prefix || './') + '" data-i18n="app.title">Калькулятор самогонщика</a>'
  );

  html = html.replace('<nav class="tabs"', introBlock(entry) + '  <nav class="tabs"');
  html = html.replace('  </main>', outroBlock(page) + '  </main>');

  const langScript = entry.lang.code === 'ru' ? '' :
    '<script>window.SEO_LANG = ' + JSON.stringify(entry.lang.code) + ';</script>\n';

  // путь к app.js зависит от вложенности страницы, поэтому ищем с необязательным ../
  html = html.replace(/(<script src="(?:\.\.\/)?assets\/app\.js"><\/script>)/, function (tag) {
    return langScript +
      '<script>window.SEO_PRESET = ' + JSON.stringify(page.preset || null) + ';</script>\n' +
      tag;
  });

  html = html.replace('<html lang="ru">', '<html lang="' + entry.lang.htmlLang + '">');

  const outDir = entry.lang.dir ? path.join(root, entry.lang.dir) : root;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, page.slug + '.html'), html, 'utf8');
  built++;
  console.log('  ' + (entry.lang.dir ? entry.lang.dir + '/' : '') + page.slug + '.html');
});

/* ---------- sitemap ---------- */

const urls = [
  { loc: BASE, prio: '1.0' },
  { loc: BASE + 'support.html', prio: '0.5' }
].concat(entries.map(function (e) { return { loc: urlFor(e), prio: '0.8' }; }));

const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(function (u) {
    return '  <url><loc>' + u.loc + '</loc><lastmod>' + today + '</lastmod><priority>' + u.prio + '</priority></url>';
  }).join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');

const robots = 'User-agent: *\nAllow: /\n\nSitemap: ' + BASE + 'sitemap.xml\n';
fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');

console.log('\nСобрано страниц: ' + built + ' (' + entries.length + ' с учётом языков), sitemap обновлён');
