/*
 * Калькулятор самогонщика — интерфейс и локализация.
 * Математика в assets/calc.js, словари в assets/i18n.js.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var LANGS = ['ru', 'en', 'zh'];
  var LOCALES = { ru: 'ru-RU', en: 'en-US', zh: 'zh-CN' };
  var LANG_KEY = 'samogon.lang';

  var lang = 'ru';
  try {
    var savedLang = localStorage.getItem(LANG_KEY);
    if (LANGS.indexOf(savedLang) >= 0) lang = savedLang;
  } catch (e) { /* localStorage может быть недоступен */ }

  var nf, nf1, nf3;

  function setFormatters() {
    var loc = LOCALES[lang] || 'ru-RU';
    nf = new Intl.NumberFormat(loc, { maximumFractionDigits: 2 });
    nf1 = new Intl.NumberFormat(loc, { maximumFractionDigits: 1 });
    nf3 = new Intl.NumberFormat(loc, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  }
  setFormatters();

  /* ------------------------------ локализация ------------------------------ */

  function t(key, vars) {
    var dict = (window.I18N && (window.I18N[lang] || window.I18N.ru)) || {};
    var s = dict[key];
    if (s == null) {
      var ru = window.I18N && window.I18N.ru;
      s = (ru && ru[key] != null) ? ru[key] : key;
    }
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }

  function applyStaticText() {
    document.documentElement.lang = lang;
    document.title = t('app.title');

    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
  }

  /* ------------------------------ утилиты ------------------------------ */

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

  /** Крупное значение с единицей измерения. */
  function bigValue(text, unitText) {
    return text + '<small>' + unitText + '</small>';
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

  function renderMessages(notesEl, r) {
    clearNotes(notesEl);
    if (!r.ok) {
      addNote(notesEl, t(r.errorKey), 'err');
      return false;
    }
    (r.warnings || []).forEach(function (key) { addNote(notesEl, t(key), 'warn'); });
    return true;
  }

  function resetCells(ids) {
    ids.forEach(function (id) { setText($(id), '—'); });
  }

  /* ------------------------------ табы ------------------------------ */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-tab');
      tabs.forEach(function (t2) { t2.classList.toggle('is-active', t2 === tab); });
      Array.prototype.forEach.call(document.querySelectorAll('.panel'), function (p) {
        p.classList.toggle('is-active', p.id === 'tab-' + name);
      });
    });
  });

  /* --------------------------- разбавление --------------------------- */

  function renderDilute() {
    var r = Calc.dilute(readNumber($('d-vol-pct')), readNumber($('d-volume')), readNumber($('d-target')));
    var notes = $('d-notes');
    clearNotes(notes);

    if (!r.ok) {
      resetCells(['d-water', 'd-final', 'd-simple', 'd-ethanol', 'd-contraction']);
      addNote(notes, t(r.errorKey), 'err');
      return;
    }

    $('d-water').innerHTML = bigValue(nf.format(r.waterL), t('unit.l'));
    setText($('d-water-note'), t('dilute.note.perL', { ml: nf.format(r.waterMl) + ' ' + t('unit.ml') }));
    setText($('d-final'), nf.format(r.finalL) + ' ' + t('unit.l'));
    setText($('d-simple'), nf.format(r.simpleWaterL) + ' ' + t('unit.l'));
    setText($('d-ethanol'), nf.format(r.massEthanolKg) + ' ' + t('unit.kg'));
    setText($('d-contraction'), nf1.format(r.contractionPct) + ' %');

    addNote(notes, t('dilute.note.compare', { simple: nf.format(r.simpleWaterL) + ' ' + t('unit.l') }));
    addNote(notes, t('dilute.note.ethanol', { eth: nf.format(r.massEthanolKg) + ' ' + t('unit.kg') }));
    (r.warnings || []).forEach(function (key) { addNote(notes, t(key), 'warn'); });
  }

  [$('d-vol-pct'), $('d-volume'), $('d-target')].forEach(function (el) {
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

  function renderMash() {
    var r = Calc.mash(readNumber($('m-sugar')), readNumber($('m-water')),
      $('m-yeast').value, readNumber($('m-temp')));
    var notes = $('m-notes');
    clearNotes(notes);

    if (!r.ok) {
      resetCells(['m-spirit40', 'm-hydro', 'm-sugarpct', 'm-abv', 'm-volume', 'm-alcohol', 'm-days']);
      addNote(notes, t(r.errorKey), 'err');
      return;
    }

    $('m-spirit40').innerHTML = bigValue(nf1.format(r.spirit40L), t('unit.l'));
    setText($('m-hydro'), '1 : ' + nf1.format(r.hydro));
    setText($('m-sugarpct'), nf1.format(r.sugarPct) + ' %');
    setText($('m-abv'), nf1.format(r.abvBraga) + ' %');
    setText($('m-volume'), nf1.format(r.volumeL) + ' ' + t('unit.l'));
    setText($('m-alcohol'), nf1.format(r.alcoholL) + ' ' + t('unit.l'));
    setText($('m-days'), r.days[0] + '–' + r.days[1] + ' ' + t('unit.days'));

    addNote(notes, t('mash.note.capacity', { vol: nf1.format(r.volumeL) + ' ' + t('unit.l') }));
    (r.warnings || []).forEach(function (key) { addNote(notes, t(key), 'warn'); });
  }

  [$('m-sugar'), $('m-water'), $('m-yeast'), $('m-temp')].forEach(function (el) {
    if (el) el.addEventListener('input', renderMash);
  });

  /* ------------------------------- Brix ------------------------------- */

  function renderBrix() {
    var r = Calc.brixWash(readNumber($('b-brix')), readNumber($('b-volume')));
    var notes = $('b-notes');
    clearNotes(notes);

    if (!r.ok) {
      resetCells(['b-abv', 'b-sg', 'b-perl', 'b-total', 'b-alcohol', 'b-spirit', 'b-hydro']);
      addNote(notes, t(r.errorKey), 'err');
      return;
    }

    $('b-abv').innerHTML = bigValue(nf1.format(r.abv), '%');
    setText($('b-sg'), nf3.format(r.sg));
    setText($('b-perl'), nf.format(r.sugarPerL) + ' ' + t('unit.gpl'));
    setText($('b-total'), nf1.format(r.sugarKg) + ' ' + t('unit.kg'));
    setText($('b-alcohol'), nf1.format(r.alcoholL) + ' ' + t('unit.l'));
    setText($('b-spirit'), nf1.format(r.spirit40L) + ' ' + t('unit.l'));
    setText($('b-hydro'), '1 : ' + nf1.format(r.hydro));

    addNote(notes, t('brix.note.direct', { b: nf1.format(r.sugarPct) }));
    addNote(notes, t('brix.note.sg', { sg: nf3.format(r.sg) }));
    (r.warnings || []).forEach(function (key) { addNote(notes, t(key), 'warn'); });
  }

  function renderFerment() {
    var r = Calc.fermentationProgress(readNumber($('bf-start')), readNumber($('bf-now')));
    var notes = $('bf-notes');
    clearNotes(notes);

    if (!r.ok) {
      resetCells(['bf-abv', 'bf-sg', 'bf-sgstart', 'bf-residual', 'bf-residual-pct']);
      setText($('bf-status'), '');
      addNote(notes, t(r.errorKey), 'err');
      return;
    }

    $('bf-abv').innerHTML = bigValue(nf1.format(r.abv), '%');
    setText($('bf-status'), t(r.ready ? 'ferment.ready' : 'ferment.ongoing'));
    setText($('bf-sg'), nf3.format(r.sgNow));
    setText($('bf-sgstart'), nf3.format(r.sgStart));
    setText($('bf-residual'), nf.format(r.residual) + ' ' + t('unit.gpl'));
    setText($('bf-residual-pct'), nf1.format(r.residualPct) + ' %');

    addNote(notes, t('ferment.note.method'));
    if (r.ready) addNote(notes, t('ferment.note.ready'));
    (r.warnings || []).forEach(function (key) { addNote(notes, t(key), 'warn'); });
  }

  [$('b-brix'), $('b-volume')].forEach(function (el) {
    if (el) el.addEventListener('input', renderBrix);
  });
  [$('bf-start'), $('bf-now')].forEach(function (el) {
    if (el) el.addEventListener('input', renderFerment);
  });

  /* ----------------------------- фракции ----------------------------- */

  function renderFractions() {
    var r = Calc.fractions(readNumber($('f-volume')), readNumber($('f-pct')),
      readNumber($('f-heads')), readNumber($('f-tails')));
    var notes = $('f-notes');
    clearNotes(notes);

    if (!r.ok) {
      resetCells(['f-heads-ml', 'f-alcohol', 'f-heads-ac', 'f-body', 'f-tails-l', 'f-heads-strength']);
      addNote(notes, t(r.errorKey), 'err');
      return;
    }

    $('f-heads-ml').innerHTML = bigValue(nf.format(r.heads.volumeL * 1000), t('unit.ml'));
    setText($('f-heads-note'), t('frac.out.headsnote', { p: r.heads.strength + ' %' }));
    setText($('f-alcohol'), nf1.format(r.alcoholL) + ' ' + t('unit.l'));
    setText($('f-heads-ac'), nf1.format(r.heads.alcoholL) + ' ' + t('unit.l'));
    setText($('f-body'), nf1.format(r.body.volumeL) + ' ' + t('unit.l'));
    setText($('f-tails-l'), nf1.format(r.tails.volumeL) + ' ' + t('unit.l'));
    setText($('f-heads-strength'), r.heads.strength + ' %');

    addNote(notes, t('frac.note.body', {
      ac: nf1.format(r.body.alcoholL) + ' ' + t('unit.l'),
      vol: nf1.format(r.body.volumeL) + ' ' + t('unit.l'),
      p: r.body.strength + ' %'
    }));
    addNote(notes, t('frac.note.tails', {
      ac: nf1.format(r.tails.alcoholL) + ' ' + t('unit.l'),
      vol: nf1.format(r.tails.volumeL) + ' ' + t('unit.l'),
      p: r.tails.strength + ' %'
    }));
    addNote(notes, t('frac.note.heads'));
    (r.warnings || []).forEach(function (key) { addNote(notes, t(key), 'warn'); });
  }

  [$('f-volume'), $('f-pct'), $('f-heads'), $('f-tails')].forEach(function (el) {
    if (el) el.addEventListener('input', renderFractions);
  });

  /* ----------------------------- ареометр ----------------------------- */

  var THERMO_TEMPS = [5, 10, 15, 20, 25, 30, 35];

  function renderThermo() {
    var pct = readNumber($('th-pct'));
    var tempC = readNumber($('th-temp'));
    var r = Calc.correctTo20(pct, tempC);
    var notes = $('th-notes');
    clearNotes(notes);

    if (!r.ok) {
      resetCells(['th-true', 'th-corr', 'th-density', 'th-coeff', 'th-delta']);
      addNote(notes, t(r.errorKey), 'err');
      return;
    }

    $('th-true').innerHTML = bigValue(nf1.format(r.truePct), t('unit.pct'));
    setText($('th-note'), Math.abs(r.correction) < 0.05
      ? t('thermo.note.exact')
      : t('thermo.note.measured', { p: nf1.format(pct) + ' %', t: nf1.format(tempC) + ' °C' }));
    setText($('th-corr'), (r.correction > 0 ? '+' : '') + nf1.format(r.correction) + ' %');
    setText($('th-density'), nf3.format(r.density20));
    setText($('th-coeff'), (r.ratePerC > 0 ? '+' : '') + nf.format(r.ratePerC) + ' %/°C');
    setText($('th-delta'), (tempC - 20 > 0 ? '+' : '') + nf1.format(tempC - 20) + ' °C');

    addNote(notes, tempC > 20 ? t('thermo.note.warm') : tempC < 20 ? t('thermo.note.cold') : t('thermo.note.same'));
    if (Math.abs(tempC - 20) > 5) addNote(notes, t('thermo.note.big'), 'warn');
    (r.warnings || []).forEach(function (key) { addNote(notes, t(key), 'warn'); });

    setText($('th-table-hint'), t('thermo.table.hint', { p: nf1.format(pct) + ' %' }));
    var tbody = $('th-table');
    if (tbody) {
      tbody.innerHTML = '';
      THERMO_TEMPS.forEach(function (temp) {
        var row = Calc.correctTo20(pct, temp);
        if (!row.ok) return;
        var tr = document.createElement('tr');
        var c1 = document.createElement('td');
        c1.textContent = temp + ' °C';
        var c2 = document.createElement('td');
        c2.className = 'num';
        c2.textContent = nf1.format(row.truePct) + ' %';
        var c3 = document.createElement('td');
        c3.className = 'num';
        c3.textContent = (row.correction > 0 ? '+' : '') + nf1.format(row.correction) + ' %';
        tr.appendChild(c1); tr.appendChild(c2); tr.appendChild(c3);
        if (Math.abs(temp - tempC) < 0.01) tr.style.background = 'rgba(240,168,60,.06)';
        tbody.appendChild(tr);
      });
    }
  }

  [$('th-pct'), $('th-temp')].forEach(function (el) {
    if (el) el.addEventListener('input', renderThermo);
  });

  /* ------------------------------ сроки ------------------------------ */

  function renderTime() {
    var yeast = $('t-yeast').value;
    var tempC = readNumber($('t-temp'));
    var notes = $('t-notes');
    clearNotes(notes);

    var days = Calc.fermentationDays(yeast, tempC);
    $('t-range').innerHTML = bigValue(days[0] + '–' + days[1], t('unit.days'));
    setText($('t-note'), t(tempC >= 22 && tempC <= 28 ? 'time.note.opt' : 'time.note.adj'));
    setText($('t-factor'), '×' + nf1.format(Calc.tempFactor(tempC)));

    if (tempC < 18) addNote(notes, t('time.note.cold'), 'warn');
    if (tempC > 30) addNote(notes, t('time.note.hot'), 'warn');
    addNote(notes, t('time.note.ready'));

    var tbody = $('t-table');
    if (tbody) {
      tbody.innerHTML = '';
      Object.keys(Calc.FERMENT_BASE).forEach(function (key) {
        var d = Calc.fermentationDays(key, tempC);
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.textContent = t('crop.' + key);
        var td2 = document.createElement('td');
        td2.className = 'num';
        td2.textContent = d[0] + '–' + d[1];
        var td3 = document.createElement('td');
        td3.textContent = t('crop.hint.' + key);
        tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
        if (key === yeast) tr.style.background = 'rgba(240,168,60,.06)';
        tbody.appendChild(tr);
      });
    }
  }

  [$('t-yeast'), $('t-temp')].forEach(function (el) {
    if (el) el.addEventListener('input', renderTime);
  });

  /* ------------------------------ язык ------------------------------ */

  function renderAll() {
    renderDilute();
    renderMash();
    renderBrix();
    renderFerment();
    renderFractions();
    renderThermo();
    renderTime();
  }

  function setLang(next) {
    if (LANGS.indexOf(next) < 0 || next === lang) return;
    lang = next;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* игнорируем */ }
    setFormatters();
    applyStaticText();
    renderAll();
  }

  var langSelect = $('lang-select');
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener('change', function () { setLang(langSelect.value); });
  }

  /* ------------------------------ старт ------------------------------ */

  applyStaticText();
  renderAll();
})();
