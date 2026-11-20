/*
 * Статическая проверка связки HTML ↔ JS без браузера.
 * Ловит опечатки в id, рассинхрон табов и битые ссылки на файлы.
 * Запуск: node tests/structure.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8');

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

const htmlIds = new Set();
for (const m of html.matchAll(/\sid="([^"]+)"/g)) htmlIds.add(m[1]);

console.log('\nФайлы');
check('style.css существует', () => {
  if (!fs.existsSync(path.join(root, 'assets', 'style.css'))) throw new Error('нет assets/style.css');
});
check('calc.js существует', () => {
  if (!fs.existsSync(path.join(root, 'assets', 'calc.js'))) throw new Error('нет assets/calc.js');
});
check('все скрипты из HTML подключены', () => {
  for (const m of html.matchAll(/<script src="([^"]+)"/g)) {
    if (!fs.existsSync(path.join(root, m[1]))) throw new Error('нет ' + m[1]);
  }
});

console.log('\nИдентификаторы');
const referenced = new Set();
for (const m of appJs.matchAll(/\$\('([^']+)'\)/g)) referenced.add(m[1]);
for (const m of appJs.matchAll(/getElementById\('([^']+)'\)/g)) referenced.add(m[1]);

check('app.js ссылается на существующие id (' + referenced.size + ')', () => {
  const missing = [...referenced].filter((id) => !htmlIds.has(id));
  if (missing.length) throw new Error('не найдено в index.html: ' + missing.join(', '));
});

console.log('\nТабы');
check('каждому табу есть панель', () => {
  const tabs = [...html.matchAll(/data-tab="([^"]+)"/g)].map((m) => m[1]);
  if (!tabs.length) throw new Error('табы не найдены');
  for (const t of tabs) {
    if (!html.includes('id="tab-' + t + '"')) throw new Error('нет панели tab-' + t);
  }
});

check('выбранный по умолчанию таб совпадает с активной панелью', () => {
  const activeTab = html.match(/class="tab is-active"[^>]*data-tab="([^"]+)"/);
  const activePanel = html.match(/class="panel is-active" id="tab-([^"]+)"/);
  if (!activeTab || !activePanel) throw new Error('не найден активный таб или панель');
  if (activeTab[1] !== activePanel[1]) throw new Error(activeTab[1] + ' ≠ ' + activePanel[1]);
});

console.log('\nРазметка');
check('нет незакрытых тегов section', () => {
  const open = (html.match(/<section\b/g) || []).length;
  const close = (html.match(/<\/section>/g) || []).length;
  if (open !== close) throw new Error('section: ' + open + ' открыто, ' + close + ' закрыто');
});
check('нет незакрытых div', () => {
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  if (open !== close) throw new Error('div: ' + open + ' открыто, ' + close + ' закрыто');
});
check('язык страницы русский', () => {
  if (!/<html lang="ru">/.test(html)) throw new Error('нет lang="ru"');
});

console.log('');
if (failed) {
  console.log('Провалено проверок: ' + failed);
  process.exit(1);
}
console.log('Структура в порядке');
