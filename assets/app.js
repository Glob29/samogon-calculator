/*
 * Калькулятор самогонщика — интерфейс.
 * Вся математика лежит в assets/calc.js; здесь только чтение полей и вывод.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  var nf1 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

  /** Число из поля ввода: пустая строка и запятая обрабатываются. */
  function readNumber(el) {
    if (!el) return NaN;
    var raw = String(el.value).replace(',', '.').replace(/\s+/g, '');
    if (raw === '') return NaN;
    var v = Number(raw);
    return isFinite(v) ? v : NaN;
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function clearNotes(el) {
    while (el && el.firstChild) el.removeChild(el.firstChild);
  }

  function addNote(el, text, kind) {
    if (!el) return;
    var div = document.createElement('div');
    div.className = 'note-item' + (kind ? ' ' + kind : '');
    var ico = document.createElement('span');
    ico.className = 'ico';
    ico.textContent = kind === 'err' ? '✕' : kind === 'warn' ? '!' : 'i';
    var span = document.createElement('span');
    span.textContent = text;
    div.appendChild(ico);
    div.appendChild(span);
    el.appendChild(div);
  }

  /* ------------------------------ табы ------------------------------ */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); });
      Array.prototype.forEach.call(document.querySelectorAll('.panel'), function (p) {
        p.classList.toggle('is-active', p.id === 'tab-' + name);
      });
    });
  });

  /* --------------------------- разбавление --------------------------- */

  var dInputs = [$('d-vol-pct'), $('d-volume'), $('d-target')];

  function renderDilute() {
    var volPct = readNumber($('d-vol-pct'));
    var volumeL = readNumber($('d-volume'));
    var targetPct = readNumber($('d-target'));
    var notes = $('d-notes');
    clearNotes(notes);

    var r = Calc.dilute(volPct, volumeL, targetPct);

    if (!r.ok) {
      setText($('d-water'), '—');
      setText($('d-final'), '—');
      setText($('d-simple'), '—');
      setText($('d-ethanol'), '—');
      setText($('d-contraction'), '—');
      addNote(notes, r.error, 'err');
      return;
    }

    $('d-water').innerHTML = nf.format(r.waterL) + '<small>л</small>';
    setText($('d-water-note'), nf.format(r.waterMl) + ' мл · на каждый литр исходного');
    setText($('d-final'), nf.format(r.finalL) + ' л');
    setText($('d-simple'), nf.format(r.simpleWaterL) + ' л');
    setText($('d-ethanol'), nf.format(r.massEthanolKg) + ' кг');
    setText($('d-contraction'), nf1.format(r.contractionPct) + ' %');

    var diff = r.waterL - r.simpleWaterL;
    addNote(notes, 'Простая формула без учёта сжатия дала бы ' + nf.format(r.simpleWaterL) +
      ' л — разница ' + nf.format(Math.abs(diff)) + ' л. Для точного результата берите верхнее значение.');
    addNote(notes, 'Ориентир: 0,6 л безводного спирта на 1 кг сахара — это как раз ваш объём ' +
      nf.format(r.massEthanolKg) + ' кг.');
    r.warnings.forEach(function (w) { addNote(notes, w, 'warn'); });
  }

  dInputs.forEach(function (el) {
    if (el) el.addEventListener('input', renderDilute);
  });

  var presets = $('d-presets');
  if (presets) {
    presets.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      $('d-vol-pct').value = btn.getAttribute('data-v');
      $('d-volume').value = btn.getAttribute('data-o');
      $('d-target').value = btn.getAttribute('data-t');
      renderDilute();
    });
  }

  /* ------------------------------ брага ------------------------------ */

  var mInputs = [$('m-sugar'), $('m-water'), $('m-yeast'), $('m-temp')];

  function renderMash() {
    var sugarKg = readNumber($('m-sugar'));
    var waterL = readNumber($('m-water'));
    var yeast = $('m-yeast').value;
    var tempC = readNumber($('m-temp'));
    var notes = $('m-notes');
    clearNotes(notes);

    var r = Calc.mash(sugarKg, waterL, yeast, tempC);

    if (!r.ok) {
      setText($('m-spirit40'), '—');
      ['m-hydro', 'm-sugarpct', 'm-abv', 'm-volume', 'm-alcohol', 'm-days'].forEach(function (id) { setText($(id), '—'); });
      addNote(notes, r.error, 'err');
      return;
    }

    $('m-spirit40').innerHTML = nf1.format(r.spirit40L) + '<small>л</small>';
    setText($('m-spirit-note'), 'теоретический выход, реальный на 10–15 % ниже');
    setText($('m-hydro'), '1 : ' + nf1.format(r.hydro));
    setText($('m-sugarpct'), nf1.format(r.sugarPct) + ' %');
    setText($('m-abv'), nf1.format(r.abvBraga) + ' %');
    setText($('m-volume'), nf1.format(r.volumeL) + ' л');
    setText($('m-alcohol'), nf1.format(r.alcoholL) + ' л');
    setText($('m-days'), r.days[0] + '–' + r.days[1] + ' дн.');

    addNote(notes, 'Ориентир по ёмкости: ' + nf1.format(r.volumeL) +
      ' л браги. Заливайте не больше 75–80 % объёма — останется место под пену.');
    r.warnings.forEach(function (w) { addNote(notes, w, 'warn'); });
  }

  mInputs.forEach(function (el) {
    if (el) el.addEventListener('input', renderMash);
  });

  /* ------------------------------ сроки ------------------------------ */

  var TIME_HINTS = {
    bakery: 'Классика на прессованных или сухих хлебопекарных',
    spirit: 'Рабочий вариант сахарной браги',
    turbo: 'Самый быстрый путь, но следите за температурой',
    grain: 'После осахаривания солодом или ферментами',
    fruit: 'Дикие дрожжи: долго и непредсказуемо',
    starch: 'Картофель и крахмал, нужна стабильная температура'
  };

  function renderTime() {
    var yeast = $('t-yeast').value;
    var tempC = readNumber($('t-temp'));
    var notes = $('t-notes');
    clearNotes(notes);

    var days = Calc.fermentationDays(yeast, tempC);
    $('t-range').innerHTML = days[0] + '–' + days[1] + '<small>дней</small>';
    setText($('t-note'), tempC >= 22 && tempC <= 28 ? 'оптимальный режим' : 'с поправкой на температуру');
    setText($('t-factor'), '×' + nf1.format(Calc.tempFactor(tempC)));

    if (tempC < 18) addNote(notes, 'Ниже 18 °C брожение может встать. Утеплите ёмкость или перенесите в тёплое место.', 'warn');
    if (tempC > 30) addNote(notes, 'Выше 30 °C дрожжи угнетены, растёт доля сивушных примесей.', 'warn');
    addNote(notes, 'Срок — только ориентир. Готовность: газ не выделяется, брага осветлилась, вкус горький без сладости, ареометр показывает 0–1,5 % сахара.');

    var tbody = $('t-table');
    if (tbody) {
      tbody.innerHTML = '';
      Object.keys(Calc.FERMENT_BASE).forEach(function (key) {
        var d = Calc.fermentationDays(key, tempC);
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.textContent = Calc.FERMENT_LABELS[key];
        var td2 = document.createElement('td');
        td2.className = 'num';
        td2.textContent = d[0] + '–' + d[1];
        var td3 = document.createElement('td');
        td3.textContent = TIME_HINTS[key] || '';
        tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
        if (key === yeast) tr.style.background = 'rgba(240,168,60,.06)';
        tbody.appendChild(tr);
      });
    }
  }

  [$('t-yeast'), $('t-temp')].forEach(function (el) {
    if (el) el.addEventListener('input', renderTime);
  });

  /* ------------------------------ старт ------------------------------ */

  renderDilute();
  renderMash();
  renderTime();
})();
