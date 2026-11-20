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

  /* ------------------------- Brix / рефрактометр ------------------------- */

  /**
   * Плотность раствора сахарозы по Brix (20 °C).
   * Стандартная аппроксимация: SG = 1 + B / (258,6 − B/258,2 · 227,1).
   */
  function sgFromBrix(brix) {
    if (!isFinite(brix) || brix <= 0) return 1;
    if (brix > 100) brix = 100;
    return 1 + brix / (258.6 - (brix / 258.2) * 227.1);
  }

  /** Сахар в литре раствора по Brix, г/л. */
  function sugarPerLitre(brix) {
    if (!isFinite(brix) || brix <= 0) return 0;
    return sgFromBrix(brix) * brix * 10;
  }

  /**
   * Сусло по показанию рефрактометра.
   * Brix — массовая доля сахара, %, то есть сахаристость напрямую.
   */
  function brixWash(brix, volumeL) {
    if (!(brix > 0) || !(brix < 100)) {
      return { ok: false, error: 'Brix должен быть больше 0 и меньше 100.' };
    }
    if (!(volumeL > 0)) {
      return { ok: false, error: 'Укажите объём сусла больше нуля.' };
    }

    var sg = sgFromBrix(brix);
    var perL = sugarPerLitre(brix);
    var sugarKg = perL * volumeL / 1000;
    var alcoholL = sugarKg * SUGAR_TO_ALCOHOL;
    var abv = brix * SUGAR_TO_SPIRIT;

    var warnings = [];
    if (brix > 22) warnings.push('Выше 22 Bx дрожжи не осилят весь сахар — часть уйдёт в недоброд.');
    if (brix < 10) warnings.push('Ниже 10 Bx сусло слабое, выхода почти не будет.');

    return {
      ok: true,
      sg: sg,
      sugarPerL: perL,
      sugarKg: sugarKg,
      sugarPct: brix,
      hydro: 100 / brix - 1,          // во сколько раз воды больше, чем сахара
      abv: abv,
      alcoholL: alcoholL,
      spirit40L: alcoholL / 0.4,
      volumeL: volumeL,
      warnings: warnings
    };
  }

  /**
   * Поправка рефрактометра на спирт (формула Шона Террилла).
   * Возвращает текущую плотность по начальному и текущему Brix.
   */
  function sgDuringFermentation(brixInitial, brixCurrent) {
    var bi = brixInitial, bc = brixCurrent;
    return 1.001843
      - 0.002318474 * bi - 0.000007775 * bi * bi - 0.000000034 * bi * bi * bi
      + 0.00574 * bc + 0.00003344 * bc * bc + 0.000000086 * bc * bc * bc;
  }

  /**
   * Ход брожения по двум замерам рефрактометром.
   * Без поправки «текущий Brix» врёт: спирт меняет коэффициент преломления.
   */
  function fermentationProgress(brixInitial, brixCurrent) {
    if (!(brixInitial > 0) || !(brixCurrent >= 0)) {
      return { ok: false, error: 'Введите начальный и текущий Brix.' };
    }
    if (brixCurrent > brixInitial + 0.5) {
      return { ok: false, error: 'Текущий Brix выше начального — проверьте замер.' };
    }

    var sgStart = sgFromBrix(brixInitial);
    var sgNow = sgDuringFermentation(brixInitial, brixCurrent);
    var abv = Math.max(0, (sgStart - sgNow) * 131.25);
    var residual = Math.max(0, (sgNow - 1) * 1000 * 2.6);   // г/л
    var ready = residual < 15;

    var warnings = [];
    if (residual > 40) warnings.push('Остаточного сахара много — брожение ещё идёт.');
    if (abv > 14) warnings.push('Крепость выше 14 % — дрожжи на пределе, возможен останов.');

    return {
      ok: true,
      sgStart: sgStart,
      sgNow: sgNow,
      abv: abv,
      residual: residual,
      residualPct: residual / 10,
      ready: ready,
      warnings: warnings
    };
  }

  /* ------------------------- Фракции при перегонке ------------------------- */

  /** Типичные крепости фракций, % об. */
  var FRACTION_STRENGTH = { heads: 78, body: 70, tails: 25 };

  /**
   * Головы и хвосты от объёма абсолютного спирта.
   *
   * @param {number} volumeL  объём спирта-сырца, л
   * @param {number} volPct   крепость сырца, % об.
   * @param {number} headsPct доля голов, % от АС
   * @param {number} tailsPct доля хвостов, % от АС
   */
  function fractions(volumeL, volPct, headsPct, tailsPct) {
    if (!(volumeL > 0) || !(volPct > 0)) {
      return { ok: false, error: 'Укажите объём и крепость спирта-сырца.' };
    }
    if (!(headsPct >= 0) || !(tailsPct >= 0) || headsPct + tailsPct >= 100) {
      return { ok: false, error: 'Сумма голов и хвостов должна быть меньше 100 % АС.' };
    }

    var alcoholL = volumeL * volPct / 100;
    var headsAlcohol = alcoholL * headsPct / 100;
    var tailsAlcohol = alcoholL * tailsPct / 100;
    var bodyAlcohol = alcoholL - headsAlcohol - tailsAlcohol;

    var warnings = [];
    if (headsPct < 3) warnings.push('Меньше 3 % на головы — риск, что метанол и альдегиды попадут в тело.');
    if (headsPct > 12) warnings.push('Больше 12 % на головы — потеряете много спирта без выигрыша в чистоте.');
    if (volumeL > 25) warnings.push('Большой объём: следите за температурой в кубе и не перегревайте.');

    return {
      ok: true,
      alcoholL: alcoholL,
      heads: {
        alcoholL: headsAlcohol,
        volumeL: headsAlcohol / (FRACTION_STRENGTH.heads / 100),
        strength: FRACTION_STRENGTH.heads
      },
      body: {
        alcoholL: bodyAlcohol,
        volumeL: bodyAlcohol / (FRACTION_STRENGTH.body / 100),
        strength: FRACTION_STRENGTH.body
      },
      tails: {
        alcoholL: tailsAlcohol,
        volumeL: tailsAlcohol / (FRACTION_STRENGTH.tails / 100),
        strength: FRACTION_STRENGTH.tails
      },
      warnings: warnings
    };
  }

  /* ------------------------ Поправка на температуру ------------------------ */

  /**
   * Коэффициент объёмного расширения водно-спиртового раствора, 1/°C.
   * Квадратичная аппроксимация по опорным точкам: вода 0,00021,
   * 40 % об. — 0,00093, 96 % об. — 0,00116.
   */
  function expansionCoeff(volFrac) {
    var c = Math.min(Math.max(volFrac, 0), 1);
    return 0.00021 + 0.002379 * c - 0.001447 * c * c;
  }

  /** Истинная крепость при 20 °C для показания r при температуре T (бисекция). */
  function solveTrueStrength(measuredPct, tempC) {
    var target = densityByVol(measuredPct);
    var dT = tempC - 20;
    if (dT === 0) return measuredPct;
    var lo = 0, hi = 100, mid, f;
    for (var i = 0; i < 80; i++) {
      mid = (lo + hi) / 2;
      f = densityByVol(mid) * (1 - expansionCoeff(mid / 100) * dT) - target;
      if (f > 0) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /**
   * Приведение показания спиртомера к 20 °C.
   *
   * Ареометр плавает по плотности: в тёплой жидкости он тонет глубже
   * и показывает больше, чем есть. Ищем такую истинную крепость c,
   * что плотность раствора при температуре замера равна плотности,
   * которую имеет раствор с показанием r при 20 °C.
   *
   * @param {number} measuredPct показание спиртомера, % об.
   * @param {number} tempC       температура раствора, °C
   */
  function correctTo20(measuredPct, tempC) {
    if (!(measuredPct > 0) || !(measuredPct <= 100)) {
      return { ok: false, error: 'Показание спиртомера должно быть от 0 до 100 % об.' };
    }
    if (!isFinite(tempC) || tempC < -5 || tempC > 45) {
      return { ok: false, error: 'Температура должна быть в диапазоне −5…45 °C.' };
    }

    var truePct = solveTrueStrength(measuredPct, tempC);
    var correction = truePct - measuredPct;

    // Скорость изменения крепости под температурой, %/°C (численно).
    var t1 = Math.min(tempC + 1, 45);
    var t2 = Math.max(tempC - 1, -5);
    var rate = (solveTrueStrength(measuredPct, t1) - solveTrueStrength(measuredPct, t2)) / (t1 - t2);

    var warnings = [];
    if (Math.abs(correction) > 6) {
      warnings.push('Очень большое отклонение: проверьте, тот ли ареометр и та ли шкала.');
    }

    return {
      ok: true,
      truePct: truePct,
      correction: correction,
      ratePerC: rate,
      density20: densityByVol(truePct),
      coeffPerC: expansionCoeff(truePct / 100) * 100,
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
    FRACTION_STRENGTH: FRACTION_STRENGTH,
    densityByMass: densityByMass,
    densityByVol: densityByVol,
    volFractionFromMass: volFractionFromMass,
    massFractionFromVol: massFractionFromVol,
    dilute: dilute,
    mash: mash,
    sgFromBrix: sgFromBrix,
    sugarPerLitre: sugarPerLitre,
    brixWash: brixWash,
    sgDuringFermentation: sgDuringFermentation,
    fermentationProgress: fermentationProgress,
    fractions: fractions,
    expansionCoeff: expansionCoeff,
    correctTo20: correctTo20,
    fermentationDays: fermentationDays,
    tempFactor: tempFactor
  };
});
