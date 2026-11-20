/*
 * Прогон интерфейса в jsdom: страница открывается, скрипты работают,
 * ввод пересчитывает результаты, табы переключаются, ошибок в консоли нет.
 * Запуск: node tests/dom.test.js   (нужен npm install)
 */
'use strict';

const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const file = path.join(__dirname, '..', 'index.html');
const errors = [];

function check(name, fn) {
  try {
    fn();
    console.log('  ok   ' + name);
    return true;
  } catch (e) {
    console.log('  FAIL ' + name + ' → ' + e.message);
    return false;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

(async function main() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => errors.push(e.message));
  virtualConsole.on('error', (m) => errors.push(String(m)));

  const dom = await JSDOM.fromFile(file, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole
  });

  const win = dom.window;
  const doc = win.document;

  await new Promise((resolve) => {
    if (doc.readyState === 'complete') resolve();
    else win.addEventListener('load', resolve);
  });

  const text = (id) => (doc.getElementById(id) || {}).textContent || '';

  function input(id, value) {
    const el = doc.getElementById(id);
    el.value = String(value);
    el.dispatchEvent(new win.Event('input', { bubbles: true }));
  }

  let failed = 0;
  const expect = (name, fn) => { if (!check(name, fn)) failed++; };

  console.log('\nЗагрузка');
  expect('calc.js подключён (window.Calc)', () => {
    assert(win.Calc && typeof win.Calc.dilute === 'function', 'нет window.Calc');
  });
  expect('страница отрисована без jsdom-ошибок', () => {
    assert(errors.length === 0, 'ошибки: ' + errors.join(' | '));
  });

  console.log('\nРазбавление');
  expect('по умолчанию 90 % → 40 %: воды 1,3 л', () => {
    assert(text('d-water').indexOf('1,3') === 0, 'получено: ' + text('d-water'));
  });
  expect('итоговый объём 2,25 л', () => {
    assert(text('d-final').indexOf('2,2') === 0, 'получено: ' + text('d-final'));
  });
  expect('пресет 96 % → 40 % даёт 1,4 л', () => {
    const chip = doc.querySelector('.chip[data-v="96"]');
    chip.dispatchEvent(new win.Event('click', { bubbles: true }));
    assert(text('d-water').indexOf('1,4') === 0, 'получено: ' + text('d-water'));
  });
  expect('пересчёт при вводе 70 % → 40 %', () => {
    input('d-vol-pct', 70);
    input('d-target', 40);
    assert(text('d-water').indexOf('0,7') === 0, 'получено: ' + text('d-water'));
  });
  expect('ошибка при желаемой крепости выше исходной', () => {
    input('d-target', 80);
    const notes = text('d-notes');
    assert(notes.indexOf('не повысить') >= 0, 'нет предупреждения: ' + notes);
  });

  console.log('\nБрага');
  expect('5 кг сахара + 20 л воды → 7,5 л самогона 40 %', () => {
    input('d-target', 40);
    assert(text('m-spirit40').indexOf('7,5') === 0, 'получено: ' + text('m-spirit40'));
  });
  expect('сахаристость 20 %', () => {
    assert(text('m-sugarpct').indexOf('20') === 0, 'получено: ' + text('m-sugarpct'));
  });
  expect('пересахар предупреждает', () => {
    input('m-sugar', 10);
    input('m-water', 10);
    assert(text('m-notes').indexOf('22') >= 0, 'нет предупреждения: ' + text('m-notes'));
  });
  expect('срок брожения выводится', () => {
    assert(/\d+–\d+ дн/.test(text('m-days')), 'получено: ' + text('m-days'));
  });

  console.log('\nBrix');
  expect('20 °Bx → потенциал 12 %', () => {
    assert(text('b-abv').indexOf('12') === 0, 'получено: ' + text('b-abv'));
  });
  expect('плотность сусла 1,083', () => {
    assert(text('b-sg') === '1.083' || text('b-sg') === '1,083', 'получено: ' + text('b-sg'));
  });
  expect('пересчёт при 10 °Bx → 6 %', () => {
    input('b-brix', 10);
    assert(text('b-abv').indexOf('6') === 0, 'получено: ' + text('b-abv'));
  });
  expect('ход брожения 20 → 8 °Bx: готово', () => {
    assert(text('bf-status').indexOf('перегонять') >= 0, 'статус: ' + text('bf-status'));
    assert(text('bf-abv').indexOf('10') === 0, 'крепость: ' + text('bf-abv'));
  });
  expect('ход брожения 20 → 18 °Bx: ещё идёт', () => {
    input('bf-now', 18);
    assert(text('bf-status').indexOf('ещё идёт') >= 0, 'статус: ' + text('bf-status'));
  });

  console.log('\nФракции');
  expect('10 л 40 %: головы ≈ 410 мл', () => {
    assert(text('f-heads-ml').indexOf('410') === 0, 'получено: ' + text('f-heads-ml'));
  });
  expect('АС 4 л', () => {
    assert(text('f-alcohol').indexOf('4') === 0, 'получено: ' + text('f-alcohol'));
  });
  expect('масштабируется: 20 л → 820 мл голов', () => {
    input('f-volume', 20);
    assert(text('f-heads-ml').indexOf('820') === 0, 'получено: ' + text('f-heads-ml'));
  });

  console.log('\nСроки');
  expect('таблица по 6 видам сырья', () => {
    const rows = doc.querySelectorAll('#t-table tr');
    assert(rows.length === 6, 'строк: ' + rows.length);
  });
  expect('холодный температурный режим удлиняет срок', () => {
    input('t-temp', 25);
    const warm = text('t-range');
    input('t-temp', 15);
    const cold = text('t-range');
    assert(cold !== warm, 'срок не изменился: ' + cold);
  });

  console.log('\nТабы');
  expect('переключение на «Брага»', () => {
    const tab = doc.querySelector('.tab[data-tab="mash"]');
    tab.dispatchEvent(new win.Event('click', { bubbles: true }));
    assert(doc.getElementById('tab-mash').classList.contains('is-active'), 'панель не активна');
    assert(!doc.getElementById('tab-dilute').classList.contains('is-active'), 'старая панель активна');
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
  console.log('Интерфейс работает');
  win.close();
})().catch((e) => {
  console.error('Тест упал:', e);
  process.exit(1);
});
