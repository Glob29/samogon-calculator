/*
 * Тесты расчётного ядра. Запуск: node tests/calc.test.js
 * Никаких зависимостей — только assert.
 */
'use strict';

const assert = require('assert');
const Calc = require('../assets/calc.js');

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ok   ' + name);
  } catch (e) {
    failures.push({ name, message: e.message });
    console.log('  FAIL ' + name + ' → ' + e.message);
  }
}

function near(actual, expected, tolerance, label) {
  const d = Math.abs(actual - expected);
  assert.ok(d <= tolerance, `${label}: ${actual} vs ${expected} (отклонение ${d.toFixed(4)} > ${tolerance})`);
}

console.log('\nПересчёт долей');
check('40 % об. ≈ 33,3 % масс.', () => {
  near(Calc.massFractionFromVol(0.40) * 100, 33.3, 0.5, 'массовая доля');
});
check('33,3 % масс. ≈ 40 % об.', () => {
  near(Calc.volFractionFromMass(0.333) * 100, 40, 0.6, 'объёмная доля');
});
check('плотность 40 % об. ≈ 0,948 г/мл', () => {
  near(Calc.densityByVol(40), 0.948, 0.004, 'плотность');
});
check('плотность 96 % об. ≈ 0,807 г/мл', () => {
  near(Calc.densityByVol(96), 0.807, 0.005, 'плотность');
});
check('плотность 0 % = вода', () => {
  near(Calc.densityByVol(0), 0.998, 0.001, 'плотность');
});

console.log('\nРазбавление');
check('90 % → 40 %: 1 л, воды ≈ 1,30 л', () => {
  const r = Calc.dilute(90, 1, 40);
  assert.ok(r.ok, 'должно посчитаться');
  near(r.waterL, 1.30, 0.03, 'вода');
  near(r.simpleWaterL, 1.25, 0.001, 'простая формула');
});
check('90 % → 40 %: итоговый объём ≈ 2,25 л', () => {
  const r = Calc.dilute(90, 1, 40);
  near(r.finalL, 2.25, 0.04, 'итог');
});
check('70 % → 40 %: воды ≈ 0,775 л', () => {
  const r = Calc.dilute(70, 1, 40);
  near(r.waterL, 0.775, 0.03, 'вода');
});
check('60 % → 40 %: воды ≈ 0,535 л', () => {
  const r = Calc.dilute(60, 1, 40);
  near(r.waterL, 0.535, 0.03, 'вода');
});
check('80 % → 40 %: воды ≈ 1,035 л', () => {
  const r = Calc.dilute(80, 1, 40);
  near(r.waterL, 1.035, 0.04, 'вода');
});
check('96 % → 40 %: воды 1,40–1,50 л', () => {
  const r = Calc.dilute(96, 1, 40);
  assert.ok(r.waterL > 1.40 && r.waterL < 1.50, 'получено ' + r.waterL.toFixed(3));
});
check('контракция положительна', () => {
  const r = Calc.dilute(90, 1, 40);
  assert.ok(r.contractionPct > 0.5, 'контракция ' + r.contractionPct);
});
check('масштабируется линейно (3 л 65 % → 40 %)', () => {
  const one = Calc.dilute(65, 1, 40);
  const three = Calc.dilute(65, 3, 40);
  near(three.waterL, one.waterL * 3, 0.001, 'линейность');
});
check('нельзя повысить крепость водой', () => {
  assert.ok(Calc.dilute(40, 1, 50).ok === false, 'должна быть ошибка');
});
check('нулевые данные дают ошибку', () => {
  assert.ok(Calc.dilute(0, 1, 40).ok === false, 'должна быть ошибка');
});

console.log('\nБрага');
check('5 кг сахара + 20 л воды → сахаристость ≈ 20 %', () => {
  const r = Calc.mash(5, 20, 'spirit', 25);
  near(r.sugarPct, 20, 0.2, 'сахаристость');
});
check('5 кг сахара → 3 л АС', () => {
  const r = Calc.mash(5, 20, 'spirit', 25);
  near(r.alcoholL, 3.0, 0.001, 'АС');
});
check('5 кг сахара → 7,5 л самогона 40 %', () => {
  const r = Calc.mash(5, 20, 'spirit', 25);
  near(r.spirit40L, 7.5, 0.001, '40 %');
});
check('крепость браги 1:4 ≈ 12 %', () => {
  const r = Calc.mash(5, 20, 'spirit', 25);
  near(r.abvBraga, 12, 0.3, 'крепость');
});
check('гидромодуль 1:4', () => {
  const r = Calc.mash(5, 20, 'spirit', 25);
  near(r.hydro, 4, 0.001, 'гидромодуль');
});
check('пересахар предупреждает', () => {
  const r = Calc.mash(10, 10, 'bakery', 25);
  assert.ok(r.warnings.length > 0, 'должно быть предупреждение');
});

console.log('\nСроки брожения');
check('холод увеличивает срок', () => {
  const warm = Calc.fermentationDays('spirit', 25);
  const cold = Calc.fermentationDays('spirit', 15);
  assert.ok(cold[1] > warm[1], 'холод должен длиться дольше');
});
check('турбо быстрее хлебопекарных', () => {
  const turbo = Calc.fermentationDays('turbo', 25);
  const bakery = Calc.fermentationDays('bakery', 25);
  assert.ok(turbo[0] < bakery[0], 'турбо быстрее');
});

console.log('');
if (failures.length) {
  console.log('Провалено: ' + failures.length + ' из ' + (passed + failures.length));
  process.exit(1);
}
console.log('Все тесты пройдены: ' + passed);
