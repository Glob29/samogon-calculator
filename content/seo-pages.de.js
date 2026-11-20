/*
 * Deutsche Landingpages für den Markt DE/AT.
 * Rechtliche Angaben vorsichtig formuliert, Stand 2026, keine Rechtsberatung.
 */

module.exports = [
  {
    id: 'de-dilute',
    lang: 'de',
    slug: 'alkohol-verduennen-90-auf-40',
    title: 'Alkohol 90 auf 40 verdünnen: wie viel Wasser',
    description: 'Rechner zum Verdünnen von 90-prozentigem Alkohol auf 40 % vol. — exakte Wassermenge mit Kontraktion, Endvolumen und Vergleich zur einfachen Formel.',
    h1: 'Alkohol 90 % auf 40 % verdünnen',
    lead: 'Für einen Liter 90-prozentigen Spiritus braucht man etwa 1,30 Liter Wasser. Die klassische Mischungsformel sagt 1,25 Liter — und das ist ein echter Unterschied: Alkohol und Wasser ziehen sich beim Mischen zusammen, das Endvolumen ist kleiner als die Summe der Teile.',
    sections: [
      {
        h2: 'Wasser pro Liter Spiritus',
        html: '<p>Die „Kreuzregel" <code>V · (90 / 40 − 1) = 1,25 l</code> geht davon aus, dass sich Volumina einfach addieren. Das tun sie nicht: Ethanol und Wasser packen sich dichter, die Mischung schrumpft um etwa 2–4 %.</p><p>Die exakte Rechnung bilanziert die Alkoholmasse über tabellierte Dichten von Ethanol-Wasser-Lösungen bei 20 °C. Für 1 Liter 90 % ergibt das <strong>1,30 Liter Wasser</strong> und ein Endvolumen von rund 2,25 Litern. Die Fertman-Tabelle zeigt für dieselben Werte ≈1,31 l — das Ergebnis passt zur klassischen Referenz.</p>'
      },
      {
        h2: 'So wird gemischt',
        html: '<ol><li>Stärke mit der Spindel bei 20 °C messen — sonst liegt man 2–3 Grad daneben.</li><li>Zuerst das Wasser in das Gefäß geben.</li><li>Den Spiritus in dünnem Strahl unter Rühren zugeben.</li><li>Verschließen und einen Tag stehen lassen.</li><li>Stärke prüfen und bei Bedarf in 50–100-ml-Schritten nachfüllen.</li></ol><p>Umgekehrt — Wasser in den Alkohol — wird die Mischung häufig trüb.</p>'
      },
      {
        h2: 'Warum es nicht exakt 40 % werden',
        html: '<p>Auch die exakte Rechnung liegt etwa 0,5–1 Grad daneben: Reinheit des Spiritus, Temperatur und Genauigkeit der Spindel spielen mit. Deshalb gibt man 90–95 % der berechneten Wassermenge zu, lässt stehen und misst nach.</p>'
      }
    ],
    faq: [
      { q: 'Wie viel Wasser für 1 Liter 90-prozentigen Alkohol?', a: 'Etwa 1,30 Liter — der exakte Wert inklusive Kontraktion. Die einfache Formel nennt 1,25 Liter und unterschätzt damit rund 4 %.' },
      { q: 'Kann ich Leitungswasser nehmen?', a: 'Eher nicht: Chlor und harte Salze führen zu Trübung und Sediment. Besser weiches Flaschen- oder gefiltertes Wasser.' },
      { q: 'Warmes oder kaltes Wasser?', a: 'Zimmertemperatur. Warmes Wasser beschleunigt die Reaktion, aber die Messung muss bis zum Abkühlen warten.' },
      { q: 'Das Ergebnis ist stärker als 40 % — was nun?', a: 'In 50–100-ml-Schritten Wasser zugeben, umrühren, einige Stunden stehen lassen und erneut messen.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'de-sugar',
    lang: 'de',
    slug: 'zucker-fuer-20-liter-maische',
    title: 'Wie viel Zucker für 20 Liter Maische',
    description: 'Zucker für Zuckermaische: Verhältnis 1:4 und 1:5, Zuckergehalt, Maischestärke und erwartete Ausbeute bei 40 % für 20 Liter Wasser.',
    h1: 'Zucker für 20 Liter Wasser',
    lead: 'Das klassische Verhältnis für Zuckermaische ist 1:4 oder 1:5 — also 4 bis 5 kg Zucker auf 20 Liter Wasser. Die Wahl hängt von der Hefe ab: Backhefe hält eine starke Maische nicht durch, Brennhefe schon.',
    sections: [
      {
        h2: 'Zwei bewährte Varianten',
        html: '<p><strong>1:4 — 5 kg Zucker.</strong> Zuckergehalt 20 %, erwartete Maischestärke etwa 12 %. Gärt mit Brennhefe in 4–8 Tagen. Der Standard, der Ausbeute und Sicherheit gut verbindet.</p><p><strong>1:5 — 4 kg Zucker.</strong> Zuckergehalt 16,7 %, Stärke etwa 10 %. Gärt ruhiger und sauberer, dafür mehr Volumen zum Brennen.</p>'
      },
      {
        h2: 'Wie viel Alkohol dabei herauskommt',
        html: '<p>Ein Kilogramm Zucker ergibt praktisch etwa 0,6 Liter reinen Alkohol — theoretisch sind 0,68 Liter möglich. Aus 5 kg werden also rund 3 Liter reiner Alkohol, das sind <strong>etwa 7,5 Liter Destillat mit 40 % vol.</strong></p><p>Real liegt die Ausbeute 10–15 % darunter: Vor- und Nachlauf werden abgetrennt, ein Teil geht beim Brennen verloren.</p>'
      },
      {
        h2: 'Was man nicht tun sollte',
        html: '<p>Mit gewöhnlicher Hefe nicht über 5–5,5 kg auf 20 Liter gehen: ab 22 % Zucker sterben die Hefen am eigenen Alkohol und der Zucker bleibt in der Maische. Wenn es doch passiert ist — auf 1:5 verdünnen und frische Hefe zugeben.</p>'
      }
    ],
    faq: [
      { q: 'Wie viel Zucker auf 20 Liter Wasser?', a: '4–5 kg. Bei 1:4 (5 kg) ergibt das etwa 12 % und rund 7,5 Liter Destillat mit 40 %.' },
      { q: 'Wie lange gärt das?', a: '4–8 Tage mit Brennhefe bei 22–28 °C. Backhefe in kühlem Raum braucht bis zu zwei Wochen.' },
      { q: 'Muss der Zucker invertiert werden?', a: 'Nicht zwingend. Invertieren beschleunigt den Start und reduziert Schaum, kostet aber eine Stunde Arbeit.' },
      { q: 'Woran erkennt man, dass es fertig ist?', a: 'Kein Gas mehr, die Maische klart auf, der Geschmack ist bitter ohne Süße, die Spindel zeigt 0–1,5 %.' }
    ],
    preset: { tab: 'mash', values: { 'm-sugar': 5, 'm-water': 20, 'm-yeast': 'spirit', 'm-temp': 25 } }
  },

  {
    id: 'de-law',
    lang: 'de',
    slug: 'selbstbrennen-oesterreich-deutschland',
    title: 'Selbstbrennen in Österreich und Deutschland: die Regeln',
    description: 'Was Hausbrennen in Österreich und Deutschland erlaubt: Anmeldung, Freimengen, Steuer und warum die Regeln in den beiden Ländern unterschiedlich sind.',
    h1: 'Selbstbrennen in Österreich und Deutschland',
    lead: 'Österreich gilt als das liberalste Pflaster für kleines Brennen in der EU: Hausbrand ist dort eine gepflegte Tradition mit Anmeldung und Freimenge. Deutschland ist strenger — ohne Erlaubnis ist Brennen strafbar, auch für den Eigenbedarf.',
    sections: [
      {
        h2: 'Österreich',
        html: '<p>Das Brennen von Obst zu Hause ist traditionell verankert und für kleine Mengen mit Anmeldung beim Zoll möglich. Eine europäische Übersicht von 2024 nennt für Österreich rund 15 Liter reinen Alkohol für den Brenner plus weitere Liter je erwachsenem Haushaltsmitglied.</p><p>Wer legal brennen will, meldet die Anlage an, führt Aufzeichnungen und zahlt die Alkoholsteuer auf die Menge über der Freigrenze.</p>'
      },
      {
        h2: 'Deutschland',
        html: '<p>Ohne Erlaubnis darf niemand Alkohol destillieren — auch nicht für den Eigenbedarf. Es gibt registrierte Kleinbrennereien (Abfindungsbrennerei), die für Private brennen; die Menge wird pauschal abgefunden.</p><p>Ein eigener Kessel im Hobbyraum ist damit nicht abgedeckt. Wer baut, riskiert Bußgeld und Steuernachforderung.</p>'
      },
      {
        h2: 'Was das für Rechner heißt',
        html: '<p>Die Mathematik ist überall gleich: Verdünnen, Zuckergehalt, Vor- und Nachlauf. Unterschiedlich ist nur, ob man daraus „so brenne ich zu Hause" machen darf.</p><p>Diese Seite ist eine Zusammenfassung, keine Rechtsberatung. Stand 2026 — Vorschriften ändern sich, vor dem Bau einer Anlage beim zuständigen Zollamt nachfragen.</p>'
      }
    ],
    faq: [
      { q: 'Ist Selbstbrennen in Österreich erlaubt?', a: 'Für kleine Mengen ja, mit Anmeldung und Freimenge; darüber wird Alkoholsteuer fällig.' },
      { q: 'Und in Deutschland?', a: 'Ohne Erlaubnis nicht — auch nicht für den Eigenbedarf. Es gibt registrierte Kleinbrennereien, die für Private brennen.' },
      { q: 'Ist das Rechnen mit dem Rechner erlaubt?', a: 'Ja. Die App rechnet nur; sie ersetzt keine Genehmigung.' },
      { q: 'Ändern sich die Regeln?', a: 'Regelmäßig. Prüfen Sie vor jedem Projekt die aktuellen Vorgaben beim Zoll.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  }
];
