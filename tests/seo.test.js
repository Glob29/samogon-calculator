/*
 * Проверка посадочных страниц, PWA и разметки для поисковиков.
 * Запуск: node tests/seo.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const BASE = 'https://glob29.github.io/samogon-calculator/';
const pages = require(path.join(root, 'content', 'seo-pages.js'));

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
  m.icons.forEach((i) => {
    assert(fs.existsSync(path.join(root, i.src)), 'нет файла ' + i.src);
  });
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
check('манифест подключён', () => {
  assert(index.includes('rel="manifest"'), 'нет <link rel="manifest">');
});
check('аналитика подключена до app.js', () => {
  const a = index.indexOf('assets/analytics.js');
  const b = index.indexOf('assets/app.js');
  assert(a > 0 && a < b, 'analytics.js должен идти до app.js');
});
check('есть конфиг счётчика', () => {
  assert(index.includes('window.SAMOGON_CONFIG'), 'нет SAMOGON_CONFIG');
});
check('есть ссылка на страницу поддержки', () => {
  assert(index.includes('support.html'), 'нет ссылки на support.html');
});
check('canonical на главной', () => {
  assert(index.includes('<link rel="canonical" href="' + BASE + '">'), 'нет canonical');
});

console.log('\nПосадочные страницы (' + pages.length + ')');
pages.forEach((p) => {
  const file = p.slug + '.html';
  check(file + ' существует', () => {
    assert(fs.existsSync(path.join(root, file)), 'нет файла');
  });
  check(file + ': заголовок, canonical и один h1', () => {
    const html = read(file);
    assert(html.includes('<title>' + p.title.replace(/&/g, '&amp;') + '</title>'), 'не тот title');
    assert(html.includes('rel="canonical" href="' + BASE + file + '"'), 'не тот canonical');
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    assert(h1 === 1, 'h1 найдено: ' + h1);
    assert(html.includes('<meta name="description"'), 'нет description');
  });
  check(file + ': предзаполнение и JSON-LD', () => {
    const html = read(file);
    assert(html.includes('window.SEO_PRESET'), 'нет SEO_PRESET');
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(ld, 'нет JSON-LD');
    const data = JSON.parse(ld[1]);
    assert(data['@type'] === 'FAQPage', 'ожидался FAQPage');
    assert(data.mainEntity.length >= 3, 'мало вопросов: ' + data.mainEntity.length);
  });
});

console.log('\nИндексация');
check('sitemap.xml перечисляет все страницы', () => {
  const sm = read('sitemap.xml');
  assert(sm.includes('<loc>' + BASE + '</loc>'), 'нет главной');
  pages.forEach((p) => assert(sm.includes(BASE + p.slug + '.html'), 'нет ' + p.slug));
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
console.log('SEO и PWA в порядке');
