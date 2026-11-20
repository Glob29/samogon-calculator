/*
 * Проверка посадочных страниц (все языки), PWA и разметки для поисковиков.
 * Запуск: node tests/seo.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const BASE = 'https://glob29.github.io/samogon-calculator/';

const LANGS = [
  { code: 'ru', dir: '', files: ['content/seo-pages.js'], htmlLang: 'ru' },
  {
    code: 'en',
    dir: 'en',
    files: ['content/seo-pages.en.js', 'content/seo-pages.en.more.js'],
    htmlLang: 'en'
  }
];

const entries = [];
LANGS.forEach((lang) => {
  lang.files.forEach((rel) => {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) return;
    require(file).forEach((page) => entries.push({ lang, page, id: page.id || page.slug }));
  });
});

const byId = {};
entries.forEach((e) => { (byId[e.id] = byId[e.id] || []).push(e); });

let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log('  ok   ' + name);
  } catch (e) {
    failed++;
    console.log('  FAIL ' + name + ' → ' + e.message);
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const fileFor = (e) => (e.lang.dir ? e.lang.dir + '/' : '') + e.page.slug + '.html';
const urlFor = (e) => BASE + fileFor(e);

console.log('\nPWA');
check('manifest.webmanifest — валидный JSON', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  assert(m.name && m.start_url && m.display === 'standalone', 'не хватает обязательных полей');
});
check('в манифесте есть иконки 192 и 512', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  const sizes = m.icons.map((i) => i.sizes);
  assert(sizes.includes('192x192'), 'нет 192x192');
  assert(sizes.includes('512x512'), 'нет 512x512');
  m.icons.forEach((i) => assert(fs.existsSync(path.join(root, i.src)), 'нет файла ' + i.src));
});
check('есть maskable-иконка', () => {
  const m = JSON.parse(read('manifest.webmanifest'));
  assert(m.icons.some((i) => i.purpose === 'maskable'), 'нет purpose=maskable');
});
check('sw.js кеширует основные файлы', () => {
  const sw = read('sw.js');
  assert(sw.includes('index.html') && sw.includes('assets/app.js'), 'в precache нет ключевых файлов');
  assert(/const CACHE = 'samogon-v\d+'/.test(sw), 'нет версии кеша');
});

console.log('\nПодключение в index.html');
const index = read('index.html');
check('манифест подключён', () => assert(index.includes('rel="manifest"'), 'нет манифеста'));
check('аналитика подключена до app.js', () => {
  const a = index.indexOf('assets/analytics.js');
  const b = index.indexOf('assets/app.js');
  assert(a > 0 && a < b, 'analytics.js должен идти до app.js');
});
check('есть конфиг счётчика', () => assert(index.includes('window.SAMOGON_CONFIG'), 'нет SAMOGON_CONFIG'));
check('есть ссылка на страницу поддержки', () => assert(index.includes('support.html'), 'нет ссылки'));
check('canonical на главной', () => {
  assert(index.includes('<link rel="canonical" href="' + BASE + '">'), 'нет canonical');
});

console.log('\nГруппы переводов');
check('базовые темы имеют русскую и английскую пару', () => {
  const paired = Object.keys(byId).filter((id) => byId[id].length === 2);
  assert(paired.length === 4, 'страниц с парой: ' + paired.length);
  paired.forEach((id) => {
    const langs = byId[id].map((x) => x.lang.code).sort().join(',');
    assert(langs === 'en,ru', id + ': переводы ' + langs);
  });
});
check('одноязычные страницы тоже допустимы', () => {
  const single = Object.keys(byId).filter((id) => byId[id].length === 1);
  assert(single.length === 12, 'одноязычных: ' + single.length);
});
check('всего страниц: 7 русских + 13 английских', () => {
  assert(entries.length === 20, 'страниц: ' + entries.length);
});

console.log('\nПосадочные страницы');
entries.forEach((e) => {
  const file = fileFor(e);
  check(file, () => {
    assert(fs.existsSync(path.join(root, file)), 'файла нет');
    const html = read(file);

    const canonicals = html.match(/rel="canonical"/g) || [];
    assert(canonicals.length === 1, 'canonical-тегов: ' + canonicals.length);
    assert(html.includes('rel="canonical" href="' + urlFor(e) + '"'), 'не тот canonical');

    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    assert(h1 === 1, 'h1 найдено: ' + h1);

    assert(html.includes('<title>' + e.page.title.replace(/&/g, '&amp;') + '</title>'), 'не тот title');
    assert(html.includes('<meta name="description"'), 'нет description');
    assert(html.includes('<html lang="' + e.lang.htmlLang + '">'), 'не тот lang у html');

    // hreflang на все языки группы
    byId[e.id].forEach((other) => {
      assert(html.includes('hreflang="' + other.lang.htmlLang + '" href="' + urlFor(other) + '"'),
        'нет hreflang ' + other.lang.htmlLang);
    });
    assert(html.includes('hreflang="x-default"'), 'нет x-default');

    // переключатель языка ведёт относительной ссылкой
    assert(html.includes('class="lang-links"'), 'нет переключателя языка');

    // предзаполнение и JSON-LD
    assert(html.includes('window.SEO_PRESET'), 'нет SEO_PRESET');
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(ld, 'нет JSON-LD');
    const data = JSON.parse(ld[1]);
    assert(data['@type'] === 'FAQPage', 'ожидался FAQPage');
    assert(data.mainEntity.length >= 3, 'мало вопросов');

    if (e.lang.dir) {
      assert(html.includes('href="../assets/style.css"'), 'ассеты не переписаны на ../');
      assert(html.includes('window.SEO_LANG = "en"'), 'нет SEO_LANG для английской страницы');
    }
  });
});

console.log('\nИндексация');
check('sitemap.xml перечисляет все страницы', () => {
  const sm = read('sitemap.xml');
  assert(sm.includes('<loc>' + BASE + '</loc>'), 'нет главной');
  entries.forEach((e) => assert(sm.includes(urlFor(e)), 'нет ' + fileFor(e)));
  assert(sm.includes('support.html'), 'нет support.html');
});
check('robots.txt указывает на sitemap', () => {
  const rb = read('robots.txt');
  assert(rb.includes('Sitemap: ' + BASE + 'sitemap.xml'), 'нет ссылки на sitemap');
});

console.log('\nСтраница поддержки');
check('support.html существует и имеет h1', () => {
  const s = read('support.html');
  assert(/<h1[^>]*>/.test(s), 'нет h1');
  assert(s.includes('assets/analytics.js'), 'нет аналитики');
});

console.log('');
if (failed) {
  console.log('Провалено: ' + failed);
  process.exit(1);
}
console.log('SEO и PWA в порядке: ' + entries.length + ' страниц на ' + LANGS.length + ' языках');
