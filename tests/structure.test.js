/*
 * Статическая проверка без браузера:
 *  - связка HTML ↔ JS (id, табы, файлы);
 *  - полнота переводов во всех трёх словарях.
 * Запуск: node tests/structure.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(root, 'assets', 'i18n.js'), 'utf8');

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

/* ---------- словари ---------- */

const sandbox = { window: {} };
vm.runInNewContext(i18nSrc, sandbox);
const I18N = sandbox.window.I18N;
const LANGS = Object.keys(I18N);

console.log('\nФайлы');
check('style.css существует', () => {
  assert(fs.existsSync(path.join(root, 'assets', 'style.css')), 'нет style.css');
});
check('calc.js существует', () => {
  assert(fs.existsSync(path.join(root, 'assets', 'calc.js')), 'нет calc.js');
});
check('i18n.js существует и содержит три языка', () => {
  assert(I18N && I18N.ru && I18N.en && I18N.zh, 'ожидались ru/en/zh, получено: ' + LANGS.join(', '));
});
check('все скрипты из HTML существуют', () => {
  for (const m of html.matchAll(/<script src="([^"]+)"/g)) {
    assert(fs.existsSync(path.join(root, m[1])), 'нет ' + m[1]);
  }
});

/* ---------- id ---------- */

const htmlIds = new Set();
for (const m of html.matchAll(/\sid="([^"]+)"/g)) htmlIds.add(m[1]);

const referenced = new Set();
for (const m of appJs.matchAll(/\$\('([^']+)'\)/g)) referenced.add(m[1]);

console.log('\nИдентификаторы');
check('app.js ссылается на существующие id (' + referenced.size + ')', () => {
  const missing = [...referenced].filter((id) => !htmlIds.has(id));
  assert(missing.length === 0, 'не найдено в index.html: ' + missing.join(', '));
});

/* ---------- переводы ---------- */

function keysIn(obj) {
  return new Set(Object.keys(obj));
}

const ruKeys = keysIn(I18N.ru);

console.log('\nПереводы');
check('наборы ключей совпадают во всех языках', () => {
  const problems = [];
  for (const lang of LANGS) {
    const keys = keysIn(I18N[lang]);
    const missing = [...ruKeys].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !ruKeys.has(k));
    if (missing.length) problems.push(lang + ': нет ' + missing.slice(0, 5).join(', '));
    if (extra.length) problems.push(lang + ': лишние ' + extra.slice(0, 5).join(', '));
  }
  assert(problems.length === 0, problems.join(' | '));
});

const htmlKeys = new Set();
for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) htmlKeys.add(m[1]);

check('все ключи из HTML есть в словарях (' + htmlKeys.size + ')', () => {
  const missing = [...htmlKeys].filter((k) => !ruKeys.has(k));
  assert(missing.length === 0, 'нет переводов: ' + missing.join(', '));
});

check('ключи из app.js есть в словарях', () => {
  const used = new Set();
  for (const m of appJs.matchAll(/\bt\('([a-z][a-zA-Z0-9.]*)'/g)) {
    if (!m[1].endsWith('.')) used.add(m[1]);   // 'crop.' собирается из конкатенации
  }
  const missing = [...used].filter((k) => !ruKeys.has(k));
  assert(missing.length === 0, 'нет переводов: ' + missing.join(', '));
});

check('ключи предупреждений calc.js есть в словарях', () => {
  const calcJs = fs.readFileSync(path.join(root, 'assets', 'calc.js'), 'utf8');
  const used = new Set();
  for (const m of calcJs.matchAll(/'(dilute|mash|brix|ferment|frac|thermo)\.[a-z]+\.[a-zA-Z]+'/g)) {
    used.add(m[0].slice(1, -1));
  }
  const missing = [...used].filter((k) => !ruKeys.has(k));
  assert(missing.length === 0, 'нет переводов: ' + missing.join(', '));
});

check('нет пустых переводов', () => {
  const empty = [];
  for (const lang of LANGS) {
    for (const [k, v] of Object.entries(I18N[lang])) {
      if (typeof v !== 'string' || v.trim() === '') empty.push(lang + '.' + k);
    }
  }
  assert(empty.length === 0, 'пустые: ' + empty.slice(0, 10).join(', '));
});

/* ---------- табы и разметка ---------- */

console.log('\nТабы');
check('каждому табу есть панель', () => {
  const tabs = [...html.matchAll(/data-tab="([^"]+)"/g)].map((m) => m[1]);
  assert(tabs.length >= 7, 'ожидалось 7 табов, найдено ' + tabs.length);
  for (const t of tabs) assert(html.includes('id="tab-' + t + '"'), 'нет панели tab-' + t);
});

check('каждый таб имеет подпись через словарь', () => {
  for (const m of html.matchAll(/data-tab="([^"]+)"[\s\S]*?data-i18n="([^"]+)"/g)) {
    assert(ruKeys.has(m[2]), 'нет перевода ' + m[2] + ' для таба ' + m[1]);
  }
});

console.log('\nРазметка');
check('нет незакрытых section', () => {
  const open = (html.match(/<section\b/g) || []).length;
  const close = (html.match(/<\/section>/g) || []).length;
  assert(open === close, 'section: ' + open + '/' + close);
});
check('нет незакрытых div', () => {
  const open = (html.match(/<div\b/g) || []).length;
  const close = (html.match(/<\/div>/g) || []).length;
  assert(open === close, 'div: ' + open + '/' + close);
});
check('есть переключатель языка', () => {
  assert(/id="lang-select"/.test(html), 'нет #lang-select');
  for (const lang of LANGS) assert(html.includes('value="' + lang + '"'), 'нет опции ' + lang);
});

console.log('');
if (failed) {
  console.log('Провалено проверок: ' + failed);
  process.exit(1);
}
console.log('Структура в порядке');
