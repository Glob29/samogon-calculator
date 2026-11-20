/*
 * Прогон интерфейса в jsdom: расчёты, переключение языка, сохранение выбора.
 * Запуск: node tests/dom.test.js   (нужен npm install)
 *
 * Скрипты подключаются вручную (eval в окно), чтобы у страницы был
 * обычный origin — иначе localStorage в jsdom недоступен.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const errors = [];

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

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  .replace(/<script src="[^"]+"><\/script>\s*/g, '');
const sources = ['i18n.js', 'calc.js', 'app.js']
  .map((f) => fs.readFileSync(path.join(root, 'assets', f), 'utf8'));

const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (e) => errors.push(e.message));
virtualConsole.on('error', (m) => errors.push(String(m)));

const dom = new JSDOM(html, {
  url: 'https://samogon.local/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  virtualConsole
});

const win = dom.window;
const doc = win.document;
sources.forEach((src) => win.eval(src));

const text = (id) => (doc.getElementById(id) || {}).textContent || '';
const dict = (lang) => win.I18N[lang];

function input(id, value) {
  const el = doc.getElementById(id);
  el.value = String(value);
  el.dispatchEvent(new win.Event('input', { bubbles: true }));
}
function selectLang(value) {
  const el = doc.getElementById('lang-select');
  el.value = value;
  el.dispatchEvent(new win.Event('change', { bubbles: true }));
}

console.log('\nЗагрузка');
check('calc.js подключён (window.Calc)', () => {
  assert(win.Calc && typeof win.Calc.dilute === 'function', 'нет window.Calc');
});
check('словари загружены', () => {
  assert(win.I18N && win.I18N.ru && win.I18N.en && win.I18N.zh, 'нет I18N');
});
check('страница отрисована без ошибок', () => {
  assert(errors.length === 0, 'ошибки: ' + errors.join(' | '));
});
check('по умолчанию русский', () => {
  assert(doc.documentElement.lang === 'ru', 'lang=' + doc.documentElement.lang);
  assert(doc.getElementById('lang-select').value === 'ru', 'выбран не ru');
  assert(doc.querySelector('h1').textContent === dict('ru')['app.title'], 'заголовок не из словаря');
});

console.log('\nРазбавление');
check('90 % → 40 %: воды 1,3 л', () => {
  assert(text('d-water').indexOf('1,3') === 0, 'получено: ' + text('d-water'));
});
check('итоговый объём 2,2 л', () => {
  assert(text('d-final').indexOf('2,2') === 0, 'получено: ' + text('d-final'));
});
check('ошибка при желаемой крепости выше исходной', () => {
  input('d-vol-pct', 40);
  input('d-target', 60);
  assert(text('d-notes').includes(dict('ru')['dilute.err.higher']), 'нет сообщения: ' + text('d-notes'));
  input('d-vol-pct', 90);
  input('d-target', 40);
});

console.log('\nБрага');
check('5 кг сахара + 20 л воды → 7,5 л 40 %', () => {
  assert(text('m-spirit40').indexOf('7,5') === 0, 'получено: ' + text('m-spirit40'));
});
check('пересахар предупреждает', () => {
  input('m-sugar', 10);
  input('m-water', 10);
  assert(text('m-notes').includes(dict('ru')['mash.warn.toosweet']), 'нет предупреждения');
  input('m-sugar', 5);
  input('m-water', 20);
});

console.log('\nBrix');
check('20 °Bx → потенциал 12 %', () => {
  assert(text('b-abv').indexOf('12') === 0, 'получено: ' + text('b-abv'));
});
check('ход брожения 20 → 8 °Bx: готово', () => {
  assert(text('bf-status').includes(dict('ru')['ferment.ready']), 'статус: ' + text('bf-status'));
});

console.log('\nФракции, ареометр, сроки');
check('10 л 40 %: головы ≈ 410 мл', () => {
  assert(text('f-heads-ml').indexOf('410') === 0, 'получено: ' + text('f-heads-ml'));
});
check('40 % при 25 °C → 37,3 %', () => {
  assert(text('th-true').indexOf('37,3') === 0, 'получено: ' + text('th-true'));
});
check('таблица поправок на 7 температур', () => {
  assert(doc.querySelectorAll('#th-table tr').length === 7, 'строк: ' + doc.querySelectorAll('#th-table tr').length);
});
check('таблица по 6 видам сырья', () => {
  assert(doc.querySelectorAll('#t-table tr').length === 6, 'строк: ' + doc.querySelectorAll('#t-table tr').length);
});

console.log('\nЯзыки');
check('переключение на английский', () => {
  selectLang('en');
  assert(doc.documentElement.lang === 'en', 'lang=' + doc.documentElement.lang);
  assert(doc.querySelector('h1').textContent === dict('en')['app.title'], 'заголовок');
  assert(doc.querySelector('.tab[data-tab="mash"] span').textContent === dict('en')['tab.mash'], 'таб');
  assert(text('d-water').indexOf('1.3') === 0, 'число: ' + text('d-water'));
  assert(text('m-hydro').indexOf('1 : 4') === 0, 'гидромодуль: ' + text('m-hydro'));
});
check('выбор сохраняется в localStorage', () => {
  assert(win.localStorage.getItem('samogon.lang') === 'en', 'нет записи в localStorage');
});
check('переключение на китайский', () => {
  selectLang('zh');
  assert(doc.querySelector('h1').textContent === dict('zh')['app.title'], 'заголовок');
  assert(doc.querySelector('footer span').textContent === dict('zh')['footer.line1'], 'футер');
  assert(text('d-water').indexOf('1.3') === 0, 'число: ' + text('d-water'));
});
check('формулы переводятся вместе с интерфейсом', () => {
  selectLang('en');
  const about = doc.querySelector('[data-i18n-html="about.body"]').innerHTML;
  assert(about.includes('Dilution'), 'нет английского текста формул');
  selectLang('zh');
  assert(doc.querySelector('[data-i18n-html="about.body"]').innerHTML.includes('稀释'), 'нет китайского текста формул');
});
check('возврат на русский сохраняет формат чисел', () => {
  selectLang('ru');
  assert(text('d-water').indexOf('1,3') === 0, 'получено: ' + text('d-water'));
  assert(doc.querySelector('h1').textContent === dict('ru')['app.title'], 'заголовок');
});

console.log('\nАнглийская посадочная страница');
check('открывается на английском и с предзаполнением', () => {
  const enFile = path.join(root, 'en', 'dilute-alcohol-90-to-40.html');
  const enHtml = fs.readFileSync(enFile, 'utf8');
  const inline = [...enHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

  const cleaned = enHtml
    .replace(/<script src="[^"]+"><\/script>\s*/g, '')
    .replace(/<script>[\s\S]*?<\/script>/g, '');

  const enDom = new JSDOM(cleaned, {
    url: 'https://samogon.local/en/dilute-alcohol-90-to-40.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole
  });

  inline.forEach((src) => enDom.window.eval(src));
  sources.forEach((src) => enDom.window.eval(src));

  const d = enDom.window.document;
  assert(d.getElementById('lang-select').value === 'en', 'язык: ' + d.getElementById('lang-select').value);
  assert(d.getElementById('d-vol-pct').value === '90', 'нет предзаполнения крепости');
  assert(d.getElementById('tab-dilute').classList.contains('is-active'), 'открыта не та вкладка');
  const water = d.getElementById('d-water').textContent;
  assert(water.indexOf('1.3') === 0, 'расчёт не выполнился: ' + water);
  assert(d.querySelector('h1').textContent.length > 5, 'нет заголовка статьи');
  enDom.window.close();
});

console.log('\nТабы');
check('переключение на «Брага»', () => {
  doc.querySelector('.tab[data-tab="mash"]').dispatchEvent(new win.Event('click', { bubbles: true }));
  assert(doc.getElementById('tab-mash').classList.contains('is-active'), 'панель не активна');
});

console.log('');
if (errors.length) {
  console.log('Ошибки консоли:');
  errors.forEach((e) => console.log('  ' + e));
}
if (failed) {
  console.log('Провалено: ' + failed);
  process.exit(1);
}
console.log('Интерфейс работает, три языка переключаются');
win.close();
