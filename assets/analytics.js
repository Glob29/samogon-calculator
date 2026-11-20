/*
 * Аналитика: тонкая обёртка, которая работает без внешних скриптов.
 *
 * Чтобы включить Яндекс.Метрику, вставьте номер счётчика в index.html:
 *     <script>window.SAMOGON_CONFIG = { ymId: 12345678 };</script>
 * Пока ymId = null, события только копятся в window.dataLayer —
 * их видно в консоли и можно отправить в любой другой счётчик.
 *
 * События (они же цели в Метрике):
 *   tool_open      — открыта вкладка калькулятора
 *   calc_used      — пользователь реально менял значения (не чаще раза в 30 с на инструмент)
 *   preset_use     — нажата кнопка-пресет
 *   lang_change    — переключён язык
 *   support_click  — переход на страницу поддержки
 *   install_pwa    — установлено как приложение
 */
(function () {
  'use strict';

  var CONFIG = window.SAMOGON_CONFIG || {};
  var YM_ID = CONFIG.ymId || null;

  window.dataLayer = window.dataLayer || [];

  /** UTM-метки текущего визита (сохраняются в sessionStorage). */
  function readUTM() {
    try {
      var q = new URLSearchParams(window.location.search);
      var utm = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
        var v = q.get(k);
        if (v) utm[k] = v;
      });
      if (Object.keys(utm).length) {
        sessionStorage.setItem('samogon.utm', JSON.stringify(utm));
        return utm;
      }
      var saved = sessionStorage.getItem('samogon.utm');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  var UTM = readUTM();

  /**
   * Отправить событие.
   * @param {string} name  имя события/цели
   * @param {object} [params] дополнительные параметры
   */
  window.track = function (name, params) {
    var payload = { event: name, ts: Date.now() };
    if (params) {
      Object.keys(params).forEach(function (k) { payload[k] = params[k]; });
    }
    Object.keys(UTM).forEach(function (k) { payload[k] = UTM[k]; });

    window.dataLayer.push(payload);

    if (YM_ID && typeof window.ym === 'function') {
      try { window.ym(YM_ID, 'reachGoal', name, params || {}); } catch (e) { /* счётчик не загрузился */ }
    }
    if (CONFIG.debug && window.console) console.log('[track]', name, params || '');
  };

  window.getUTM = function () { return UTM; };

  /* Установка как приложение: показываем нативную подсказку и запоминаем событие. */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', function () {
    window.track('install_pwa');
  });
  window.promptInstall = function () {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    deferredPrompt = null;
    return true;
  };
})();
