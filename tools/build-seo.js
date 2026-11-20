/*
 * Генератор посадочных страниц под поисковые запросы.
 *
 * Запуск: node tools/build-seo.js
 * Вход:   content/seo-pages.js + index.html (шаблон)
 * Выход:  <slug>.html в корне, sitemap.xml, robots.txt
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const BASE = 'https://glob29.github.io/samogon-calculator/';
const shell = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pages = require(path.join(root, 'content', 'seo-pages.js'));

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function introBlock(p) {
  return [
    '  <article class="seo-article">',
    '    <h1>' + esc(p.h1) + '</h1>',
    '    <p class="lead">' + esc(p.lead) + '</p>',
    '  </article>',
    ''
  ].join('\n');
}

function outroBlock(p) {
  const sections = p.sections.map(function (s) {
    return '    <h2>' + esc(s.h2) + '</h2>\n    ' + s.html;
  }).join('\n\n');

  const faq = p.faq.map(function (f) {
    return '    <details class="faq"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
  }).join('\n');

  return [
    '  <article class="seo-article seo-article--outro">',
    sections,
    '',
    '    <h2>Частые вопросы</h2>',
    faq,
    '  </article>',
    ''
  ].join('\n');
}

function jsonLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map(function (f) {
      return {
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      };
    })
  };
}

function headExtra(p) {
  const url = BASE + p.slug + '.html';
  const blocks = [
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:title" content="' + esc(p.title) + '">',
    '<meta property="og:description" content="' + esc(p.description) + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:image" content="' + BASE + 'assets/icon-512.png">',
    '<meta property="og:site_name" content="Калькулятор самогонщика">',
    '<script type="application/ld+json">' + JSON.stringify(jsonLd(p)) + '</script>'
  ];
  return blocks.join('\n');
}

let built = 0;

pages.forEach(function (p) {
  if (!p.slug || !p.title || !p.h1) throw new Error('у страницы нет slug/title/h1: ' + JSON.stringify(p).slice(0, 80));

  let html = shell;

  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + esc(p.title) + '</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/,
    '<meta name="description" content="' + esc(p.description) + '">');
  html = html.replace('</head>', headExtra(p) + '\n</head>');

  // В шапке h1 заменяем ссылкой на главную — единственный h1 остаётся в статье
  html = html.replace(
    /<h1 data-i18n="app.title">[^<]*<\/h1>/,
    '<a class="brand-title" href="./" data-i18n="app.title">Калькулятор самогонщика</a>'
  );

  html = html.replace('<nav class="tabs"', introBlock(p) + '  <nav class="tabs"');
  html = html.replace('  </main>', outroBlock(p) + '  </main>');

  html = html.replace(
    '<script src="assets/app.js"></script>',
    '<script>window.SEO_PRESET = ' + JSON.stringify(p.preset || null) + ';</script>\n' +
    '<script src="assets/app.js"></script>'
  );

  fs.writeFileSync(path.join(root, p.slug + '.html'), html, 'utf8');
  built++;
  console.log('  ' + p.slug + '.html');
});

/* ---------- sitemap ---------- */

const urls = [
  { loc: BASE, prio: '1.0' },
  { loc: BASE + 'support.html', prio: '0.5' }
].concat(pages.map(function (p) { return { loc: BASE + p.slug + '.html', prio: '0.8' }; }));

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

console.log('\nСобрано страниц: ' + built + ', sitemap.xml и robots.txt обновлены');
