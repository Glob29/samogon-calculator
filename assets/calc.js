/*
 * Калькулятор самогонщика — расчётное ядро.
 *
 * Чистые функции без DOM: используются и в браузере (window.Calc),
 * и в тестах (module.exports).
 *
 * Физика:
 *  - плотности водно-спиртовых растворов при 20 °C (г/мл) по массовой доле;
 *  - разбавление считается по балансу массы, а не по «правилу креста»,
 *    поэтому учитывается контракция (сжатие смеси).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Calc = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /** Плотность безводного этанола при 20 °C, г/мл. */
  var RHO_ETHANOL = 0.78934;
  /** Плотность воды при 20 °C, г/мл. */
  var RHO_WATER = 0.99823;

  /**
   * Плотность водно-спиртового раствора при 20 °C (г/мл)
   * в зависимости от массовой доли спирта, %.
   */
  var DENSITY_TABLE = [
    [0, 0.99823], [5, 0.98938], [10, 0.98187], [15, 0.97514],
    [20, 0.96864], [25, 0.96168], [30, 0.95382], [35, 0.94494],
    [40, 0.93518], [45, 0.92472], [50, 0.91384], [55, 0.90258],
    [60, 0.89113], [65, 0.87948], [70, 0.86766], [75, 0.85564],
    [80, 0.84344], [85, 0.83100], [90, 0.81797], [95, 0.80424],
    [100, 0.78934]
  ];

  /** Линейная интерполяция плотности по массовой доле, %. */
  function densityByMass(massPct) {
    if (!isFinite(massPct)) return NaN;
    if (massPct <= 0) return DENSITY_TABLE[0][1];
    if (massPct >= 100) return DENSITY_TABLE[DENSITY_TABLE.length - 1][1];
    for (var i = 1; i < DENSITY_TABLE.length; i++) {
      if (massPct <= DENSITY_TABLE[i][0]) {
        var x0 = DENSITY_TABLE[i - 1][0], y0 = DENSITY_TABLE[i - 1][1];
        var x1 = DENSITY_TABLE[i][0], y1 = DENSITY_TABLE[i][1];
        return y0 + (y1 - y0) * (massPct - x0) / (x1 - x0);
      }
    }
    return DENSITY_TABLE[DENSITY_TABLE.length - 1][1];
  }

  /** Объёмная доля (0..1) по массовой доле (0..1). */
  function volFractionFromMass(massFrac) {
    return massFrac * densityByMass(massFrac * 100) / RHO_ETHANOL;
  }

  /**
   * Массовая доля (0..1) по объёмной доле (0..1).
   * Обратной формулы нет — решаем бисекцией, функция монотонная.
   */
  function massFractionFromVol(volFrac) {
    if (!isFinite(volFrac) || volFrac <= 0) return 0;
    if (volFrac >= 1) return 1;
    var lo = 0, hi = 1, mid;
    for (var i = 0; i < 60; i++) {
      mid = (lo + hi) / 2;
      if (volFractionFromMass(mid) < volFrac) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /** Плотность раствора по объёмной доле, %. */
  function densityByVol(volPct) {
    var w = massFractionFromVol(volPct / 100);
    return densityByMass(w * 100);
  }

  /**
   * Разбавление спиртосодержащей жидкости водой.
   *
   * @param {number} volPct    исходная крепость, % об.
   * @param {number} volumeL   объём исходной жидкости, л
   * @param {number} targetPct желаемая крепость, % об.
   * @returns {object} результаты обоих методов и предупреждения
   */
  function dilute(volPct, volumeL, targetPct) {
    var warnings = [];
    if (!(volPct > 0) || !(volumeL > 0) || !(targetPct > 0)) {
      return { ok: false, error: 'Введите крепость, объём и желаемую крепость больше нуля.' };
    }
    if (targetPct > volPct) {
      return { ok: false, error: 'Водой крепость не повысить: желаемая крепость выше исходной.' };
    }
    if (targetPct < 1) {
      warnings.push('Желаемая крепость ниже 1 % — это уже не напиток, а промывка.');
    }
    if (volPct > 96.5) {
      warnings.push('Выше 96,5 % об. в домашних условиях крепость не поднять — это предел азеотропа.');
    }

    var v1 = volPct / 100, v2 = targetPct / 100;
    var w1 = massFractionFromVol(v1);
    var w2 = massFractionFromVol(v2);
    var rho1 = densityByMass(w1 * 100);
    var rho2 = densityByMass(w2 * 100);

    var mass1 = volumeL * rho1;            // кг, исходный раствор
    var massEthanol = mass1 * w1;          // кг, безводный спирт
    var mass2 = massEthanol / w2;          // кг, конечный раствор
    var waterAddKg = mass2 - mass1;        // кг, доливаемая вода
    var waterAddL = waterAddKg / RHO_WATER;
    var finalL = mass2 / rho2;

    var simpleL = volumeL * (volPct / targetPct - 1);
    var contractionPct = (volumeL + waterAddL - finalL) / (volumeL + waterAddL) * 100;

    if (waterAddL <= 0) {
      warnings.push('Воды не требуется: исходная крепость уже не выше желаемой.');
    }
    if (volumeL + waterAddL > 0 && Math.abs(waterAddL - simpleL) / (simpleL || 1) > 0.02) {
      warnings.push('Простая формула даёт заметно другой объём воды — так работает контракция, ориентируйтесь на точный расчёт.');
    }

    return {
      ok: true,
      waterL: waterAddL,
      waterMl: waterAddL * 1000,
      finalL: finalL,
      simpleWaterL: simpleL,
      massEthanolKg: massEthanol,
      contractionPct: contractionPct,
      massFractionIn: w1 * 100,
      massFractionOut: w2 * 100,
      warnings: warnings
    };
  }

  /**
   * Брага: сахар, вода, дрожжи.
   * 1 кг сахара -> ~0,6 л абсолютного спирта (практика; теория 0,68).
   */
  var SUGAR_TO_ALCOHOL = 0.6;   // л АС на кг сахара
  var SUGAR_VOLUME = 0.6;       // л прироста объёма на кг растворённого сахара
  var SUGAR_TO_SPIRIT = 0.6;    // % об. браги на 1 % массовой сахаристости

  function mash(sugarKg, waterL, yeast, tempC) {
    var warnings = [];
    if (!(sugarKg > 0) || !(waterL > 0)) {
      return { ok: false, error: 'Укажите массу сахара и объём воды больше нуля.' };
    }

    var volumeL = waterL + sugarKg * SUGAR_VOLUME;
    var sugarPct = sugarKg / (sugarKg + waterL) * 100;
    var hydro = waterL / sugarKg;
    var abvBraga = sugarPct * SUGAR_TO_SPIRIT;
    var alcoholL = sugarKg * SUGAR_TO_ALCOHOL;
    var spirit40L = alcoholL / 0.4;
    var ferm = fermentationDays(yeast, tempC);

    if (hydro < 3) {
      warnings.push('Гидромодуль короче 1:3 — обычные дрожжи такого не вытянут, нужны турбо и подкормка.');
    }
    if (hydro > 6) {
      warnings.push('Гидромодуль длиннее 1:6 — брага будет слабой, а перегонять придётся больше объёма.');
    }
    if (sugarPct > 22) {
      warnings.push('Сахаристость выше 22 % — дрожжи погибнут от спирта раньше, чем съедят весь сахар.');
    }
    if (sugarPct < 10) {
      warnings.push('Сахаристость ниже 10 % — выход будет мизерным.');
    }
    if (abvBraga > 14) {
      warnings.push('Расчётная крепость браги выше 14 % — реальная будет меньше: дрожжи не дойдут до конца.');
    }
    if (tempC && tempC < 18) {
      warnings.push('Ниже 18 °C брожение затягивается, риск скисания.');
    }
    if (tempC && tempC > 30) {
      warnings.push('Выше 30 °C дрожжи страдают и дают больше сивушных примесей.');
    }

    return {
      ok: true,
      volumeL: volumeL,
      sugarPct: sugarPct,
      hydro: hydro,
      abvBraga: abvBraga,
      alcoholL: alcoholL,
      spirit40L: spirit40L,
      days: ferm,
      warnings: warnings
    };
  }

  /** Ориентировочные сроки брожения, дней: [мин, макс]. */
  var FERMENT_BASE = {
    bakery: [5, 10],   // сахарная на хлебопекарных
    spirit: [4, 8],    // сахарная на спиртовых
    turbo: [3, 5],     // сахарная на турбо
    grain: [3, 7],     // зерновая с осахариванием
    fruit: [10, 21],   // фруктовая/ягодная на диких
    starch: [7, 14]    // крахмальная (картофель)
  };

  var FERMENT_LABELS = {
    bakery: 'Сахарная, хлебопекарные дрожжи',
    spirit: 'Сахарная, спиртовые дрожжи',
    turbo: 'Сахарная, турбо-дрожжи',
    grain: 'Зерновая (с осахариванием)',
    fruit: 'Фруктовая / ягодная (дикие дрожжи)',
    starch: 'Крахмальная (картофель)'
  };

  /** Поправка на температуру брожения. */
  function tempFactor(tempC) {
    if (!isFinite(tempC) || tempC <= 0) return 1;
    if (tempC < 16) return 1.8;
    if (tempC < 19) return 1.45;
    if (tempC < 22) return 1.2;
    if (tempC <= 26) return 1.0;
    if (tempC <= 29) return 0.85;
    if (tempC <= 32) return 0.75;
    return 0.7;
  }

  function fermentationDays(yeast, tempC) {
    var base = FERMENT_BASE[yeast] || FERMENT_BASE.spirit;
    var k = tempFactor(tempC);
    return [Math.max(2, Math.round(base[0] * k)), Math.max(3, Math.round(base[1] * k))];
  }

  return {
    RHO_ETHANOL: RHO_ETHANOL,
    RHO_WATER: RHO_WATER,
    SUGAR_TO_ALCOHOL: SUGAR_TO_ALCOHOL,
    FERMENT_BASE: FERMENT_BASE,
    FERMENT_LABELS: FERMENT_LABELS,
    densityByMass: densityByMass,
    densityByVol: densityByVol,
    volFractionFromMass: volFractionFromMass,
    massFractionFromVol: massFractionFromVol,
    dilute: dilute,
    mash: mash,
    fermentationDays: fermentationDays,
    tempFactor: tempFactor
  };
});
