/*
 * English landing pages. Same schema as content/seo-pages.js.
 * `id` links translations together (hreflang alternates).
 */

module.exports = [
  {
    id: 'dilute90',
    lang: 'en',
    slug: 'dilute-alcohol-90-to-40',
    title: 'Dilute 90% Alcohol to 40%: How Much Water',
    description: 'Dilution calculator for 90% alcohol to 40% ABV that accounts for volume contraction. Exact water volume, final volume, and why the simple formula is off.',
    h1: 'How to dilute 90% alcohol to 40%',
    lead: 'One litre of 90% spirit needs about 1.30 litres of water. The classic cross-rule formula says 1.25 litres — and that gap is real: alcohol and water contract on mixing, so the final volume is smaller than the sum of the parts.',
    sections: [
      {
        h2: 'Water per litre of spirit',
        html: '<p>The "cross rule" — <code>V · (90 / 40 − 1) = 1.25 L</code> — assumes volumes add up linearly. They do not: ethanol and water pack more densely together and the mixture shrinks by roughly 2–4 %.</p><p>The exact calculation balances the mass of alcohol using tabulated densities of ethanol-water solutions at 20 °C. For 1 litre of 90% spirit it gives <strong>1.30 litres of water</strong> and a final volume of about 2.25 litres. The Fertman table for the same numbers shows ≈1.31 L, so the result matches the classic reference.</p>'
      },
      {
        h2: 'How to mix',
        html: '<ol><li>Measure strength with a hydrometer at 20 °C — otherwise you are 2–3 degrees off.</li><li>Pour the water into the vessel first.</li><li>Add the spirit in a thin stream while stirring.</li><li>Close and let it rest for a day.</li><li>Check the strength and top up in 50–100 ml steps if needed.</li></ol><p>Pouring water into spirit instead is the usual reason a batch goes cloudy.</p>'
      },
      {
        h2: 'Why it is not exactly 40%',
        html: '<p>Even an exact calculation lands within about 0.5–1 degree: spirit purity, temperature and hydrometer accuracy all contribute. That is why you add 90–95 % of the calculated water, let it settle, then measure.</p>'
      }
    ],
    faq: [
      { q: 'How much water for 1 litre of 90% alcohol?', a: 'About 1.30 litres — the exact figure that accounts for contraction. The simple formula gives 1.25 litres and understates the water by roughly 4%.' },
      { q: 'Can I use tap water?', a: 'Not recommended: chlorine and hard salts cause haze and sediment. Use soft bottled or filtered water.' },
      { q: 'Warm or cold water?', a: 'Room temperature. Warm water speeds the reaction, but you will have to wait for the liquid to cool before measuring.' },
      { q: 'The result is stronger than 40% — what now?', a: 'Add water in 50–100 ml steps, stir, let it stand a few hours and measure again.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'sugar20',
    lang: 'en',
    slug: 'how-much-sugar-for-20-litres-of-wash',
    title: 'How Much Sugar for 20 Litres of Wash',
    description: 'Sugar wash calculator: 1:4 and 1:5 ratios, sugar content, wash strength and expected 40% spirit yield for 20 litres of water.',
    h1: 'How much sugar for 20 litres of water',
    lead: 'The classic sugar wash ratio is 1:4 or 1:5 — that is, 4–5 kg of sugar per 20 litres of water. The choice depends on yeast: bakery yeast will not survive a strong wash, distiller’s yeast will.',
    sections: [
      {
        h2: 'Two working options',
        html: '<p><strong>1:4 — 5 kg of sugar.</strong> Sugar content 20 %, expected wash strength about 12 %. Ferments in 4–8 days on distiller’s yeast. This is the standard that maximises yield without stalling.</p><p><strong>1:5 — 4 kg of sugar.</strong> Sugar content 16.7 %, strength about 10 %. Ferments more cleanly and steadily, but you distil a larger volume.</p>'
      },
      {
        h2: 'How much spirit you get',
        html: '<p>One kilogram of sugar yields roughly 0.6 litres of pure alcohol — a practical figure; the theoretical maximum is 0.68. Five kilograms give about 3 litres of pure alcohol, that is <strong>about 7.5 litres of 40% spirit</strong>.</p><p>Real output is usually 10–15 % lower: heads and tails are cut away and some is lost in distillation.</p>'
      },
      {
        h2: 'What not to do',
        html: '<p>Do not go above 5–5.5 kg per 20 litres with ordinary yeast: above 22 % sugar they die from their own alcohol and sugar stays unfermented. If you overshoot, dilute to 1:5 and pitch fresh yeast.</p>'
      }
    ],
    faq: [
      { q: 'How much sugar for 20 litres of water?', a: '4–5 kg. At 1:4 (5 kg) you get a wash around 12% and about 7.5 litres of 40% spirit. At 1:5 (4 kg) it is gentler and more stable.' },
      { q: 'How long does it ferment?', a: '4–8 days on distiller’s yeast at 22–28 °C. Bakery yeast in a cool room can take two weeks.' },
      { q: 'Do I need to invert the sugar?', a: 'Not required. Inverting speeds up the start and reduces foaming but adds an hour of work.' },
      { q: 'How do I know it is done?', a: 'No gas, the top layer clears, the taste is bitter without sweetness, and a hydrometer reads 0–1.5%.' }
    ],
    preset: { tab: 'mash', values: { 'm-sugar': 5, 'm-water': 20, 'm-yeast': 'spirit', 'm-temp': 25 } }
  },

  {
    id: 'brix',
    lang: 'en',
    slug: 'brix-to-density-and-alcohol',
    title: 'Brix for Wash: Density, Sugar and Potential Alcohol',
    description: 'Convert refractometer Brix to density, sugar per litre and potential alcohol. Includes the alcohol correction for monitoring fermentation.',
    h1: 'Brix for wash: density, sugar and potential alcohol',
    lead: 'Brix is the sugar mass fraction, so for a sugar wash the °Bx value equals the sugar content in percent. 20 °Bx means 20 % sugar by mass, a density of 1.083 and roughly 12 % potential alcohol.',
    sections: [
      {
        h2: 'Brix to density',
        html: '<p>The standard formula: <code>SG = 1 + B / (258.6 − B/258.2 · 227.1)</code>. Typical values: 10 °Bx → 1.040; 15 °Bx → 1.061; 20 °Bx → 1.083; 25 °Bx → 1.105; 30 °Bx → 1.129.</p><p>Sugar per litre is <code>SG · B · 10</code> grams: at 20 °Bx that is 216 g/L.</p>'
      },
      {
        h2: 'Brix lies during fermentation',
        html: '<p>Alcohol changes the refractive index, so the raw current Brix badly underestimates residual sugar. To judge progress you need two readings and a correction: density is computed from the initial and current Brix pair (Terrill), then the alcohol accumulated and the sugar left.</p><p>For example, going from 20 to 8 °Bx means about 10.9 % alcohol and less than 1 g/L of sugar — the wash is ready.</p>'
      },
      {
        h2: 'When a refractometer beats a hydrometer',
        html: '<p>On wort, always: a drop of liquid reaches 20 °C much faster. On fermenting wash a refractometer is useless without correction, and with it is about half as accurate as a hydrometer.</p>'
      }
    ],
    faq: [
      { q: '20 Brix — how much sugar is that?', a: '20 % by mass. A litre of such a solution holds about 216 g of sugar and has a density of 1.083.' },
      { q: 'What Brix should a wash have?', a: 'For a sugar wash, 16–22 °Bx. Above 22 °Bx yeast will not consume all the sugar.' },
      { q: 'Can I measure fermenting wash with a refractometer?', a: 'Yes, but only with the alcohol correction — without it the reading understates residual sugar.' },
      { q: 'How much alcohol from 20 Brix?', a: 'About 12 % ABV theoretically, 10–11 % in practice.' }
    ],
    preset: { tab: 'brix', values: { 'b-brix': 20, 'b-volume': 20 } }
  },

  {
    id: 'fractions',
    lang: 'en',
    slug: 'how-much-heads-and-tails-to-collect',
    title: 'How Much Heads and Tails to Collect When Distilling',
    description: 'Heads and tails calculator based on pure alcohol: how many millilitres to collect, how to compute ABV, and when tails begin.',
    h1: 'How much heads and tails to collect',
    lead: 'Heads are counted from pure alcohol: usually 5–10 % of the alcohol for a sugar wash and 8–12 % for grain. Ten litres of 40 % low wines hold 4 litres of alcohol, so heads are 320 ml of alcohol — about 410 ml of liquid at 78 %.',
    sections: [
      {
        h2: 'Compute pure alcohol first',
        html: '<p><code>AA = volume · strength</code>. Ten litres at 40 % is 4 litres of pure alcohol. Head and tail percentages are taken from this number, not from the liquid volume.</p>'
      },
      {
        h2: 'How much heads',
        html: '<p>Sugar wash — 5–8 % of alcohol. Grain — 8–10 %. Fruit — up to 12 %. Below 3 % is risky: methanol and aldehydes end up in the body. Above 12 % you lose spirit without gaining purity.</p><p>Collect drop by drop, 1–2 drops per second, into a separate jar, never mixed with the body.</p>'
      },
      {
        h2: 'When tails start',
        html: '<p>The usual marker is the stream dropping below 45 % ABV. Stop there or collect separately: tails are not poured away, they go into the next run with a fresh batch.</p><p>Tail volume depends heavily on the still, which is why the share is a manual input — tune it over your first two or three runs.</p>'
      }
    ],
    faq: [
      { q: 'How many heads from 10 litres of 40% low wines?', a: 'At 8% of the alcohol — 320 ml of alcohol, about 410 ml of liquid at 78% ABV.' },
      { q: 'Can you drink heads?', a: 'No. They contain methanol, acetaldehyde and esters — the most toxic part of the distillate.' },
      { q: 'What to do with tails?', a: 'Collect separately and add to the next run; redistilling recovers the alcohol left in them.' },
      { q: 'Why do the recommended percentages differ?', a: 'They depend on raw material, yeast and equipment. Sugar washes are cleaner; grain and fruit carry more congeners.' }
    ],
    preset: { tab: 'fractions', values: { 'f-volume': 10, 'f-pct': 40, 'f-heads': 8, 'f-tails': 15 } }
  }
];
