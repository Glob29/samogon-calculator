/*
 * English landing pages, part 2 — wider search coverage.
 * Loaded together with content/seo-pages.en.js.
 *
 * Pages here are English-only: у них нет русской пары, поэтому в hreflang
 * остаётся только собственный язык и x-default.
 */

module.exports = [
  {
    id: 'proofing',
    lang: 'en',
    slug: 'proofing-calculator',
    title: 'Proofing Calculator: Alcohol Proof and ABV',
    description: 'Convert ABV to US proof and back, and calculate how much water to add to spirit to reach a target proof. Includes the proof-to-ABV formula.',
    h1: 'Proofing calculator: proof and ABV',
    lead: 'In the US, proof is simply twice the ABV: 40 % ABV is 80 proof, 45 % is 90 proof. In the UK the historical proof scale is different, so always check which one you mean. To reach a target proof, water is calculated exactly the same way as for a target ABV.',
    sections: [
      {
        h2: 'The formula',
        html: '<p><code>proof (US) = ABV × 2</code> and <code>ABV = proof / 2</code>. A 100-proof spirit is 50 % alcohol by volume at 20 °C. Degrees under the old British system are roughly <code>ABV × 1.75</code>, but that scale is obsolete for labelling.</p><p>Alcohol by weight (ABW) is not the same as ABV: 40 % ABV is about 33.3 % ABW, because ethanol is lighter than water.</p>'
      },
      {
        h2: 'Reaching a target proof',
        html: '<p>Water volume is calculated from a mass balance, not from simple proportions. For 1 litre of 90 % ABV to reach 80 proof (40 % ABV) you need about 1.30 litres of water — the classic cross-rule formula gives 1.25 litres and understates it by 4 %.</p><p>Enter the starting strength and the target in the calculator above; the result accounts for contraction automatically.</p>'
      },
      {
        h2: 'Common mistakes',
        html: '<ul><li>Measuring strength at the wrong temperature: a hydrometer at 30 °C reads about 5 points high.</li><li>Confusing proof with ABV in recipes written for the other country.</li><li>Adding all the water at once and overshooting — add 90–95 %, rest, then top up.</li></ul>'
      }
    ],
    faq: [
      { q: 'What is 40% ABV in proof?', a: '80 proof in the US system. Proof is exactly twice the ABV there.' },
      { q: 'How much water to turn 90% into 80 proof?', a: 'About 1.30 litres per litre of spirit — the exact figure that accounts for contraction.' },
      { q: 'Is 100 proof 50% alcohol?', a: 'Yes, in the US system 100 proof is 50% ABV.' },
      { q: 'Does proof depend on temperature?', a: 'ABV is defined at 20 °C. Measuring warmer or colder shifts the reading, so a temperature correction is needed.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'dilution-chart',
    lang: 'en',
    slug: 'alcohol-dilution-chart',
    title: 'Alcohol Dilution Chart: Water per Litre of Spirit',
    description: 'How much water to add to one litre of spirit at 95, 90, 80, 70, 60 and 50% ABV to reach 40, 45 or 50% ABV. Values account for contraction.',
    h1: 'Alcohol dilution chart',
    lead: 'Litres of water to add to one litre of spirit. The numbers come from a mass balance with tabulated densities at 20 °C, so they include contraction — the simple cross-rule formula underestimates each value by 3–5 %.',
    sections: [
      {
        h2: 'Table',
        html: '<table class="chart"><thead><tr><th>Starting ABV</th><th>→ 40 %</th><th>→ 45 %</th><th>→ 50 %</th></tr></thead><tbody><tr><td>95 %</td><td>1.44 L</td><td>1.17 L</td><td>0.95 L</td></tr><tr><td>90 %</td><td>1.30 L</td><td>1.06 L</td><td>0.86 L</td></tr><tr><td>80 %</td><td>1.04 L</td><td>0.82 L</td><td>0.63 L</td></tr><tr><td>70 %</td><td>0.78 L</td><td>0.59 L</td><td>0.42 L</td></tr><tr><td>60 %</td><td>0.54 L</td><td>0.36 L</td><td>0.21 L</td></tr><tr><td>50 %</td><td>0.26 L</td><td>0.11 L</td><td>—</td></tr></tbody></table>'
      },
      {
        h2: 'How to read it',
        html: '<p>Find the starting strength in the first column and the target in the header. The cell is the water volume for one litre of spirit; multiply by your actual volume. Three litres of 70 % need <code>0.78 × 3 = 2.34 L</code> of water to become 40 %.</p>'
      },
      {
        h2: 'Why not the simple formula',
        html: '<p>The cross rule <code>V · (C₁/C₂ − 1)</code> assumes volumes add up. They do not: mixing ethanol and water releases heat and the total volume shrinks. For 90 → 40 the difference is about 50 ml per litre — enough to land 1–2 degrees off if you are chasing an exact strength.</p>'
      }
    ],
    faq: [
      { q: 'How much water to dilute 1 litre of 95% to 40%?', a: 'About 1.44 litres. The value includes contraction; the simple formula gives 1.375 litres.' },
      { q: 'Do I add water to spirit or spirit to water?', a: 'Spirit into water, in a thin stream while stirring. The reverse order is the usual cause of cloudiness.' },
      { q: 'Does the chart work for any volume?', a: 'Yes, it is linear: multiply the table value by your volume in litres.' },
      { q: 'Why do charts differ by a few millilitres?', a: 'Different reference temperatures and rounding. At 20 °C the values above match the Fertman table within 10 ml.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'dilute96',
    lang: 'en',
    slug: 'dilute-96-alcohol-to-40',
    title: 'Dilute 96% Alcohol to 40%: How Much Water',
    description: 'Diluting 96% rectified spirit to 40% ABV: exact water volume per litre, final volume, and why the result is not exactly 40 degrees.',
    h1: 'How to dilute 96% alcohol to 40%',
    lead: 'One litre of 96 % spirit becomes 40 % with about 1.44 litres of water. It is the strongest starting point you will normally have at home: above 96.5 % the ethanol-water mixture is an azeotrope and simple distillation cannot go further.',
    sections: [
      {
        h2: 'Water per litre',
        html: '<p>Exact calculation gives <strong>1.44 L</strong> of water and a final volume of about 2.47 L. The cross-rule formula says 1.40 L — 40 ml less, which is roughly 0.6 degrees of error.</p>'
      },
      {
        h2: 'Practical notes',
        html: '<p>Rectified spirit at 96 % is hygroscopic: it pulls moisture from the air, so a bottle left open drifts down by a degree or two. Measure right before diluting.</p><p>Use soft water at room temperature, add 90–95 % of the calculated volume, rest for a day and check with a hydrometer before topping up.</p>'
      },
      {
        h2: 'What you get',
        html: '<p>Two litres of 40 % spirit is a standard vodka-strength base for infusions. At 40 % the mixture is already below the strength where most oils and sugars dissolve well, so add flavourings after dilution, not before.</p>'
      }
    ],
    faq: [
      { q: 'How much water for 1 litre of 96%?', a: 'About 1.44 litres to reach 40% ABV, giving roughly 2.47 litres of final product.' },
      { q: 'Can I go above 96.5%?', a: 'Not by simple distillation — that is the azeotrope. Higher strengths need drying agents or molecular sieves.' },
      { q: 'Why does my 96% measure 94%?', a: 'Either the spirit absorbed moisture or the hydrometer is reading at the wrong temperature.' },
      { q: 'Should I filter the water?', a: 'Soft filtered or bottled water is best; hard water causes haze and sediment.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 96, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'abv-proof',
    lang: 'en',
    slug: 'abv-to-proof-conversion',
    title: 'ABV to Proof: Conversion and Why They Differ',
    description: 'ABV to proof conversion table: US proof, British degrees proof, and alcohol by weight. Formulas for both directions.',
    h1: 'ABV to proof conversion',
    lead: 'US proof equals twice the ABV, so the conversion is trivial. British degrees proof use a different base and give a larger number — 40 % ABV is 80 proof in the US but about 70 degrees proof in the old British system.',
    sections: [
      {
        h2: 'Formulas',
        html: '<p>US: <code>proof = ABV × 2</code>. British: <code>degrees proof ≈ ABV × 1.75</code>. Alcohol by weight: <code>ABW ≈ ABV × 0.79</code> at 40 % ABV (the exact factor depends on strength because of the density curve).</p>'
      },
      {
        h2: 'Conversion table',
        html: '<table class="chart"><thead><tr><th>ABV</th><th>US proof</th><th>British °proof</th><th>ABW</th></tr></thead><tbody><tr><td>37.5 %</td><td>75</td><td>≈66</td><td>≈29.8 %</td></tr><tr><td>40 %</td><td>80</td><td>≈70</td><td>≈33.3 %</td></tr><tr><td>43 %</td><td>86</td><td>≈75</td><td>≈35.3 %</td></tr><tr><td>50 %</td><td>100</td><td>≈87.5</td><td>≈42.5 %</td></tr><tr><td>60 %</td><td>120</td><td>≈105</td><td>≈52.1 %</td></tr></tbody></table>'
      },
      {
        h2: 'Which one to use',
        html: '<p>For home distilling, work in ABV only. Proof exists for labelling and for US recipes; mixing the two is the most common source of dilution errors. If a recipe says "80 proof", it means 40 % ABV.</p>'
      }
    ],
    faq: [
      { q: 'Is 80 proof the same as 40%?', a: 'Yes in the US system. In the old British system 80 degrees proof is about 45.7% ABV.' },
      { q: 'How do I convert proof to ABV?', a: 'Divide by two for US proof: 100 proof is 50% ABV.' },
      { q: 'What is ABW?', a: 'Alcohol by weight — a mass percentage. 40% ABV is about 33.3% ABW because ethanol is lighter than water.' },
      { q: 'Why does the UK use different numbers?', a: 'The British proof scale was defined by the density of a gunpowder solution and predates ABV; it is now obsolete for labelling.' }
    ],
    preset: { tab: 'thermo', values: { 'th-pct': 40, 'th-temp': 20 } }
  },

  {
    id: 'foreshots',
    lang: 'en',
    slug: 'how-much-foreshots-to-discard',
    title: 'How Much Foreshots to Discard (and How Much Heads)',
    description: 'Foreshots and heads calculator: how many millilitres to throw away per litre of pure alcohol, and why the number depends on the wash.',
    h1: 'How much foreshots to discard',
    lead: 'Foreshots are the first, most toxic fraction. A practical rule is to discard 5–10 % of the pure alcohol in the still as heads, and the very first 50–100 ml separately as foreshots, regardless of batch size.',
    sections: [
      {
        h2: 'Counting from pure alcohol',
        html: '<p>Ten litres of 40 % low wines contain 4 litres of pure alcohol. At 8 % that is 320 ml of alcohol in the heads — roughly 410 ml of liquid at 78 % ABV. The calculator above does this arithmetic and shows both numbers.</p>'
      },
      {
        h2: 'Foreshots vs heads',
        html: '<p><strong>Foreshots</strong> — the first 50–100 ml, high in methanol and acetaldehyde. Discard entirely. <strong>Heads</strong> — the following fraction, still rich in esters and aldehydes but holding usable alcohol. Collect separately and either discard or redistill with the next batch, depending on how clean you want the product.</p>'
      },
      {
        h2: 'When tails start',
        html: '<p>Watch the stream strength: below 45 % ABV the tails begin. They are not waste — collect and add to the next run. Tails from a sugar wash are usually dirtier than from grain.</p>'
      }
    ],
    faq: [
      { q: 'How many ml of foreshots per litre of alcohol?', a: 'Roughly 10–20 ml of the very first fraction, then 5–10% of the total alcohol as heads.' },
      { q: 'Can I drink the heads?', a: 'No. They carry methanol, acetaldehyde and esters — the most harmful part of the run.' },
      { q: 'Does the amount depend on the wash?', a: 'Yes: sugar washes need about 5–8% of the alcohol, grain 8–10%, fruit up to 12%.' },
      { q: 'What if I collect too much heads?', a: 'You lose yield but gain purity. Most distillers err on this side rather than risk a harsh spirit.' }
    ],
    preset: { tab: 'fractions', values: { 'f-volume': 10, 'f-pct': 40, 'f-heads': 8, 'f-tails': 15 } }
  },

  {
    id: 'brix-sg',
    lang: 'en',
    slug: 'brix-to-specific-gravity',
    title: 'Brix to Specific Gravity: Chart and Formula',
    description: 'Convert Brix to specific gravity and back with a formula and a chart for 5–30 Brix. Includes sugar per litre and potential alcohol.',
    h1: 'Brix to specific gravity',
    lead: 'Brix is the sugar mass fraction; specific gravity is the density relative to water. For a sucrose solution one converts to the other with a closed formula, and the chart below covers the range used in washes.',
    sections: [
      {
        h2: 'Formula',
        html: '<p><code>SG = 1 + B / (258.6 − B/258.2 × 227.1)</code>, where B is Brix. The reverse direction has no clean inverse, but a good approximation is <code>B ≈ (SG − 1) × 258.6</code> for the 0–30 Brix range.</p>'
      },
      {
        h2: 'Chart',
        html: '<table class="chart"><thead><tr><th>Brix</th><th>SG</th><th>Sugar, g/L</th><th>Potential ABV</th></tr></thead><tbody><tr><td>5 °Bx</td><td>1.020</td><td>51</td><td>3.0 %</td></tr><tr><td>10 °Bx</td><td>1.040</td><td>104</td><td>6.0 %</td></tr><tr><td>15 °Bx</td><td>1.061</td><td>159</td><td>9.0 %</td></tr><tr><td>20 °Bx</td><td>1.083</td><td>217</td><td>12.0 %</td></tr><tr><td>25 °Bx</td><td>1.105</td><td>276</td><td>15.0 %</td></tr><tr><td>30 °Bx</td><td>1.129</td><td>339</td><td>18.0 %</td></tr></tbody></table>'
      },
      {
        h2: 'Readings during fermentation',
        html: '<p>A refractometer on fermenting wash is skewed by alcohol. Use the two-reading correction (initial and current Brix) to get density and residual sugar; a single reading without correction will tell you the wash is drier than it is.</p>'
      }
    ],
    faq: [
      { q: 'What is 20 Brix in specific gravity?', a: 'About 1.083, which is roughly 217 g of sugar per litre.' },
      { q: 'Is Brix the same as Plato?', a: 'Nearly: Plato is defined by weight and differs by less than 0.1 °P in the wash range.' },
      { q: 'Can I use a hydrometer instead?', a: 'Yes, but a hydrometer needs a full sample at 20 °C, while a refractometer needs two drops.' },
      { q: 'Why is my Brix reading unstable?', a: 'Alcohol, suspended yeast and temperature. Filter or let the sample settle before measuring.' }
    ],
    preset: { tab: 'brix', values: { 'b-brix': 20, 'b-volume': 20 } }
  },

  {
    id: 'sugar-ratio',
    lang: 'en',
    slug: 'sugar-wash-ratio-1-4',
    title: 'Sugar Wash Ratio 1:4 — Sugar and Water per Volume',
    description: 'Sugar wash 1:4 ratio explained: how much sugar for 10, 20, 30 and 50 litres of water, expected strength and 40% spirit yield.',
    h1: 'Sugar wash ratio 1:4',
    lead: 'A 1:4 ratio means one kilogram of sugar per four litres of water. It is the strongest practical ratio for ordinary distiller’s yeast: the wash reaches about 12 % ABV, the upper limit before fermentation stalls.',
    sections: [
      {
        h2: 'Amounts',
        html: '<table class="chart"><thead><tr><th>Water</th><th>Sugar</th><th>Wash ABV</th><th>40% spirit</th></tr></thead><tbody><tr><td>10 L</td><td>2.5 kg</td><td>≈12 %</td><td>≈3.8 L</td></tr><tr><td>20 L</td><td>5 kg</td><td>≈12 %</td><td>≈7.5 L</td></tr><tr><td>30 L</td><td>7.5 kg</td><td>≈12 %</td><td>≈11.3 L</td></tr><tr><td>50 L</td><td>12.5 kg</td><td>≈12 %</td><td>≈18.8 L</td></tr></tbody></table>'
      },
      {
        h2: 'When to use 1:5 instead',
        html: '<p>With bakery yeast, in a cool room, or when the vessel is small, use 1:5 — it ferments steadier and cleaner, at the cost of a larger volume to distil. 1:3 is for turbo yeast with nutrients only.</p>'
      },
      {
        h2: 'Sugar volume matters',
        html: '<p>One kilogram of dissolved sugar adds about 0.6 litres of volume, so a 20-litre wash with 5 kg of sugar occupies about 23 litres. Fill the fermenter to no more than 75–80 % to leave room for foam.</p>'
      }
    ],
    faq: [
      { q: 'How much sugar for a 1:4 wash at 20 litres?', a: '5 kg. That gives about 12% ABV and roughly 7.5 litres of 40% spirit.' },
      { q: 'Is 1:4 better than 1:5?', a: 'It yields more per litre of water but is closer to the yeast’s limit. 1:5 is safer in cool rooms and with bakery yeast.' },
      { q: 'Can I use 1:3?', a: 'Only with high-tolerance turbo yeast and nutrients; ordinary yeast will stall.' },
      { q: 'How much does the sugar add to the volume?', a: 'About 0.6 litres per kilogram of dissolved sugar.' }
    ],
    preset: { tab: 'mash', values: { 'm-sugar': 5, 'm-water': 20, 'm-yeast': 'spirit', 'm-temp': 25 } }
  },

  {
    id: 'hydrometer-temp',
    lang: 'en',
    slug: 'hydrometer-temperature-correction',
    title: 'Hydrometer Temperature Correction for Alcohol',
    description: 'Hydrometers read true only at 20 °C. Correction table and calculator: how many degrees a spirit hydrometer is off at 5–35 °C.',
    h1: 'Hydrometer temperature correction',
    lead: 'A spirit hydrometer is calibrated at 20 °C. Warm liquid is less dense, the instrument sinks deeper and reads higher than the truth — at 30 °C a 40 % spirit shows about 45 %, a five-degree error.',
    sections: [
      {
        h2: 'How big is the error',
        html: '<table class="chart"><thead><tr><th>Temperature</th><th>Reading</th><th>True ABV</th><th>Correction</th></tr></thead><tbody><tr><td>10 °C</td><td>40 %</td><td>45.5 %</td><td>+5.5</td></tr><tr><td>15 °C</td><td>40 %</td><td>42.8 %</td><td>+2.8</td></tr><tr><td>20 °C</td><td>40 %</td><td>40.0 %</td><td>0</td></tr><tr><td>25 °C</td><td>40 %</td><td>37.3 %</td><td>−2.7</td></tr><tr><td>30 °C</td><td>40 %</td><td>34.5 %</td><td>−5.5</td></tr></tbody></table>'
      },
      {
        h2: 'How the correction is computed',
        html: '<p>The device floats according to density, so the reading corresponds to a density, not a concentration. The true strength c solves <code>ρ₂₀(c) · (1 − α(c)·(T − 20)) = ρ₂₀(r)</code>, where α is the volumetric expansion coefficient of the solution and r is the reading. The calculator above solves it numerically.</p>'
      },
      {
        h2: 'The simple answer',
        html: '<p>Let the sample reach room temperature before measuring. A 200 ml sample cools in 10–15 minutes; that removes the correction entirely, which is better than trusting an approximate table.</p>'
      }
    ],
    faq: [
      { q: 'How much does temperature affect a hydrometer?', a: 'About 0.55 degrees of ABV per °C at 40%, so a 5 °C difference is roughly 2.7 degrees.' },
      { q: 'My reading is high — is the spirit stronger?', a: 'Only if it is warm. Check the temperature first; a warm sample always reads high.' },
      { q: 'Can I measure hot distillate?', a: 'Technically yes, but the correction grows and accuracy drops. Let it cool.' },
      { q: 'Do sugar hydrometers need correction too?', a: 'Yes, they are calibrated at 20 °C as well, and the correction direction is the same.' }
    ],
    preset: { tab: 'thermo', values: { 'th-pct': 40, 'th-temp': 25 } }
  },

  {
    id: 'moonshine-calc',
    lang: 'en',
    slug: 'moonshine-calculator',
    title: 'Moonshine Calculator: Dilution, Wash and Fractions',
    description: 'Free moonshine calculator: dilute spirit with contraction, sugar wash ratios, Brix readings, heads and tails by pure alcohol, hydrometer temperature correction.',
    h1: 'Moonshine calculator',
    lead: 'Six calculators in one page: dilution with contraction, sugar wash, Brix, heads and tails, hydrometer correction and fermentation timing. No sign-up, works offline, free and open source.',
    sections: [
      {
        h2: 'What each tab does',
        html: '<ul><li><strong>Dilution</strong> — exact water volume to reach a target ABV, with contraction accounted for.</li><li><strong>Mash</strong> — sugar and water amounts, sugar content, expected strength and yield.</li><li><strong>Brix</strong> — refractometer readings, density, sugar per litre and fermentation progress.</li><li><strong>Fractions</strong> — heads and tails in millilitres, counted from pure alcohol.</li><li><strong>Hydrometer</strong> — temperature correction for spirit readings.</li><li><strong>Timing</strong> — expected fermentation time by raw material and temperature.</li></ul>'
      },
      {
        h2: 'Why contraction matters',
        html: '<p>Most dilution calculators use <code>V · (C₁/C₂ − 1)</code>, which ignores that ethanol and water shrink on mixing. For 90 → 40 % that is a 4 % error — around 1.5 degrees of final strength. This calculator balances the mass of alcohol through tabulated densities instead.</p>'
      },
      {
        h2: 'Works everywhere',
        html: '<p>The app is a static site: it runs in any browser, installs as an app on a phone and keeps working without a connection. Interface languages: English, Russian and Chinese.</p>'
      }
    ],
    faq: [
      { q: 'Is this calculator free?', a: 'Yes, completely, with no ads and no registration. The source is open under the MIT licence.' },
      { q: 'Can I use it offline?', a: 'Yes. Install it from the browser menu or save the page; after the first visit it works without a connection.' },
      { q: 'Does it work in other languages?', a: 'Yes: English, Russian and Chinese, switchable in the header.' },
      { q: 'How accurate are the numbers?', a: 'Densities are tabulated at 20 °C with ±1% accuracy, which is tighter than a household hydrometer.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  }
];
