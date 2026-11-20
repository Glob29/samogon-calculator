/*
 * English landing pages about legislation — high-intent, evergreen queries.
 * Factual content with sources; not legal advice.
 */

module.exports = [
  {
    id: 'laws',
    lang: 'en',
    slug: 'where-is-home-distilling-legal',
    title: 'Where Is Home Distilling Legal? Country List',
    description: 'Home distilling laws by country: New Zealand and Austria allow personal-use spirits, the US ban was ruled unconstitutional, the UK and Australia require a licence.',
    h1: 'Where is home distilling legal?',
    lead: 'Only a handful of countries explicitly allow distilling spirits at home for personal use. New Zealand is the clearest case, Austria allows a generous personal allowance, and the United States is in the middle of a legal fight that may end its 150-year-old ban.',
    sections: [
      {
        h2: 'Country by country',
        html: '<table class="chart"><thead><tr><th>Country</th><th>Spirits at home</th><th>Notes</th></tr></thead><tbody><tr><td>New Zealand</td><td>Legal</td><td>Personal use only, no sale — Customs and Excise Act 1996, s.68B</td></tr><tr><td>Austria</td><td>Legal with limits</td><td>Artisanal production, allowance per household member</td></tr><tr><td>United States</td><td>In litigation</td><td>1868 federal ban ruled unconstitutional in 2024; appeal ongoing</td></tr><tr><td>United Kingdom</td><td>Needs approval</td><td>Personal-use exemption excludes spirits (HMRC APPA)</td></tr><tr><td>Australia</td><td>Not allowed</td><td>ATO grants no licence for personal distilling</td></tr><tr><td>Canada</td><td>Not allowed</td><td>Beer and wine yes, spirits need a licence</td></tr><tr><td>EU (most states)</td><td>Varies</td><td>12 of 27 allow untaxed personal production, usually fruit spirits</td></tr></tbody></table>'
      },
      {
        h2: 'The liberal end of the scale',
        html: '<p><strong>New Zealand</strong> is the outlier: section 68B of the Customs and Excise Act 1996 explicitly exempts beer, wine and <em>spirits</em> made in a private dwelling, as long as they are for the individual’s own use and not for sale.</p><p><strong>Austria</strong> sits next: small-scale distillation of fruit spirits is a registered tradition, with an allowance of roughly 15 litres of pure alcohol plus a few tens of litres per adult household member.</p>'
      },
      {
        h2: 'Why it matters for a calculator',
        html: '<p>Legality changes what you can write about, not what you can calculate. Dilution, sugar content and heads/tails maths are the same everywhere; the difference is whether the guide can say “do this at home” or only “this is how the maths works”.</p><p>This page is a summary, not legal advice. Rules change — check your national customs or tax authority before you build or run a still.</p>'
      }
    ],
    faq: [
      { q: 'Which country is the most permissive about home distilling?', a: 'New Zealand: spirits made at home for personal use are explicitly exempt from excise licensing, and sale is the only hard prohibition.' },
      { q: 'Is home distilling legal in the UK?', a: 'Not for spirits. Since February 2025 producers need HMRC approval, and the personal-consumption exemption explicitly excludes spirits.' },
      { q: 'Can I distil at home in Australia?', a: 'No. The ATO issues no licence to distil for personal consumption; only brewing and fermenting are exempt.' },
      { q: 'Is it legal in the EU?', a: 'It varies. A 2024 study found 12 of 27 member states allow some untaxed personal production, most often fruit spirits at registered distilleries or with an allowance.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'nz',
    lang: 'en',
    slug: 'home-distilling-new-zealand',
    title: 'Home Distilling in New Zealand: What the Law Allows',
    description: 'New Zealand exempts spirits distilled at home for personal use under s.68B of the Customs and Excise Act 1996. What is allowed, what is not, and how to stay compliant.',
    h1: 'Home distilling in New Zealand',
    lead: 'New Zealand is one of the few places where distilling spirits at home is explicitly lawful: section 68B of the Customs and Excise Act 1996 exempts beer, wine and spirits made in a private dwelling for the maker’s own use.',
    sections: [
      {
        h2: 'What the law says',
        html: '<p>Section 68B was inserted on 8 December 2009 by the Customs and Excise Amendment Act 2009. It disapplies the manufacturing-licence requirement for beer, wine and spirits made in an individual’s private house or dwelling place, provided they are “manufactured exclusively for the individual’s personal use and not for sale or other disposition to any other person”.</p><p>The words that matter: <em>private dwelling</em>, <em>personal use</em>, <em>not for sale</em>. A garage still in a residential property qualifies; a shed on a separate title may not.</p>'
      },
      {
        h2: 'What is allowed and what is not',
        html: '<table class="chart"><thead><tr><th>Allowed</th><th>Not allowed</th></tr></thead><tbody><tr><td>Distilling spirits at home for yourself</td><td>Selling or bartering the product</td></tr><tr><td>Giving a bottle to a friend as a gift</td><td>Supplying a business, bar or event</td></tr><tr><td>Any volume for personal use</td><td>Distilling on commercial premises without a licence</td></tr></tbody></table>'
      },
      {
        h2: 'Practical notes',
        html: '<p>Home distilling in NZ is legal but not unregulated in other ways: local fire rules, landlord and body-corporate rules, and insurance still apply. High-proof spirit is flammable, and a rented flat is a poor place for an open flame still.</p><p>Measure strength at 20 °C — a hydrometer reads about five degrees high at 30 °C, which is the difference between 40 % and 35 % once diluted.</p>'
      }
    ],
    faq: [
      { q: 'Is home distilling legal in New Zealand?', a: 'Yes, for personal use. Section 68B of the Customs and Excise Act 1996 exempts spirits made in a private dwelling, provided they are not sold or otherwise disposed of.' },
      { q: 'Since when?', a: 'The exemption was inserted on 8 December 2009 by the Customs and Excise Amendment Act 2009.' },
      { q: 'Can I sell what I make?', a: 'No. The exemption applies only to personal use; sale requires a licensed manufacturing area and excise compliance.' },
      { q: 'Is there a volume limit?', a: 'The Act sets no volume limit — the test is personal use and no disposition to others, not litres.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'us',
    lang: 'en',
    slug: 'is-home-distilling-legal-in-the-us',
    title: 'Is Home Distilling Legal in the US? The Court Ruling',
    description: 'A federal court ruled the 1868 home distilling ban unconstitutional in 2024. What the appeal means for hobby distillers and what is still enforced.',
    h1: 'Is home distilling legal in the US?',
    lead: 'For more than 150 years home distilling was a federal felony in the United States. In July 2024 a district court held that the ban exceeded Congress’s taxing power, and the case has been moving through appeal since — so the answer depends on the date you ask.',
    sections: [
      {
        h2: 'The ban',
        html: '<p>26 U.S.C. § 5601(a)(6) makes it a felony to work in a distilled spirits plant that is not properly bonded and registered, and § 5178(a)(1)(B) prohibits a distilled spirits plant in a dwelling house. Together they criminalise a still at home, even for personal use.</p>'
      },
      {
        h2: 'The 2024 ruling',
        html: '<p>In <em>Hobby Distillers Association v. TTB</em> the Northern District of Texas held that these provisions were not a valid exercise of the taxing power and could not stand. The government appealed.</p><p>In 2026 the Fifth Circuit — covering Texas, Louisiana and Mississippi — sided with the hobbyists, agreeing that the old prohibition does not hold up. That does not automatically settle national enforcement, and the practical picture differs by state.</p>'
      },
      {
        h2: 'What it means in practice',
        html: '<p>Federal law may be shifting, but state and local rules are separate: some states ban home distilling outright, some are silent, and zoning, fire codes and lease terms still apply. Treat this page as a map, not as permission.</p><p>If you want to stay clearly on the right side today, the safest framing is: the maths below works everywhere, the still at home is a legal question for your state and your lawyer.</p>'
      }
    ],
    faq: [
      { q: 'Is home distilling legal in the US now?', a: 'It is unsettled. A Texas court struck down the federal ban in 2024 and the Fifth Circuit agreed on appeal in 2026, but enforcement and state law are separate questions.' },
      { q: 'What was the case called?', a: 'Hobby Distillers Association v. Alcohol and Tobacco Tax and Trade Bureau (TTB).' },
      { q: 'Does the ruling apply in my state?', a: 'The Fifth Circuit covers Texas, Louisiana and Mississippi. Elsewhere the federal question is the same but state rules vary; check your state alcohol board.' },
      { q: 'Can I sell what I distil?', a: 'No. Nothing in the ruling permits commercial production without a licence; federal excise and labelling rules still apply.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  }
];
