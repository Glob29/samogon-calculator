/*
 * Páginas en español para España y Latinoamérica.
 * Temas de cálculo, sin afirmaciones legales.
 */

module.exports = [
  {
    id: 'es-dilute',
    lang: 'es',
    slug: 'diluir-alcohol-90-a-40',
    title: 'Diluir alcohol de 90 a 40: cuánta agua hace falta',
    description: 'Calculadora para diluir alcohol de 90 % a 40 % vol. teniendo en cuenta la contracción. Volumen exacto de agua, volumen final y por qué falla la fórmula simple.',
    h1: 'Cómo diluir alcohol de 90 % a 40 %',
    lead: 'Un litro de alcohol de 90 % necesita unos 1,30 litros de agua. La fórmula clásica dice 1,25 litros, y la diferencia es real: el alcohol y el agua se contraen al mezclarse y el volumen final es menor que la suma de las partes.',
    sections: [
      {
        h2: 'Agua por litro de alcohol',
        html: '<p>La «regla de la cruz» <code>V · (90 / 40 − 1) = 1,25 l</code> supone que los volúmenes se suman. No se suman: el etanol y el agua se empaquetan más densamente y la mezcla se contrae entre un 2 y un 4 %.</p><p>El cálculo exacto hace el balance de masa del alcohol con densidades tabuladas a 20 °C. Para 1 litro de 90 % da <strong>1,30 litros de agua</strong> y un volumen final de unos 2,25 litros. La tabla de Fertman para esos mismos valores da ≈1,31 l: coincide.</p>'
      },
      {
        h2: 'Orden correcto',
        html: '<ol><li>Mida la graduación con el alcoholímetro a 20 °C; si no, se desvía 2–3 grados.</li><li>Ponga primero el agua en el recipiente.</li><li>Añada el alcohol en hilo fino mientras remueve.</li><li>Cierre y deje reposar un día.</li><li>Compruebe la graduación y complete en pasos de 50–100 ml.</li></ol><p>Al revés —agua sobre alcohol— la mezcla suele enturbiarse.</p>'
      },
      {
        h2: 'Por qué no sale exactamente 40 %',
        html: '<p>Incluso el cálculo exacto se queda en ±0,5–1 grado: influyen la pureza del alcohol, la temperatura y la precisión del instrumento. Por eso se añade el 90–95 % del agua calculada, se deja reposar y se mide.</p>'
      }
    ],
    faq: [
      { q: '¿Cuánta agua para 1 litro de alcohol de 90 %?', a: 'Unos 1,30 litros, el valor exacto con contracción. La fórmula simple da 1,25 litros y subestima un 4 %.' },
      { q: '¿Sirve el agua del grifo?', a: 'Mejor no: el cloro y las sales duras provocan turbidez y sedimento. Use agua embotellada blanda o filtrada.' },
      { q: '¿Agua fría o templada?', a: 'A temperatura ambiente. El agua tibia acelera la reacción, pero habrá que esperar para medir.' },
      { q: 'Quedó más fuerte de 40 %, ¿qué hago?', a: 'Añada agua en pasos de 50–100 ml, remueva, deje reposar unas horas y vuelva a medir.' }
    ],
    preset: { tab: 'dilute', values: { 'd-vol-pct': 90, 'd-volume': 1, 'd-target': 40 } }
  },

  {
    id: 'es-sugar',
    lang: 'es',
    slug: 'azucar-para-20-litros-de-mostro',
    title: 'Cuánto azúcar para 20 litros de mosto',
    description: 'Azúcar para mosto: proporción 1:4 y 1:5, contenido de azúcar, graduación del mosto y rendimiento esperado a 40 % para 20 litros de agua.',
    h1: 'Cuánto azúcar para 20 litros de agua',
    lead: 'La proporción clásica del mosto de azúcar es 1:4 o 1:5, es decir, 4–5 kg de azúcar por 20 litros de agua. La elección depende de la levadura: la de panadería no aguanta un mosto fuerte, la de destilería sí.',
    sections: [
      {
        h2: 'Dos variantes que funcionan',
        html: '<p><strong>1:4 — 5 kg de azúcar.</strong> Contenido de azúcar 20 %, graduación esperada del mosto en torno al 12 %. Fermenta en 4–8 días con levadura de destilería.</p><p><strong>1:5 — 4 kg de azúcar.</strong> Contenido 16,7 %, graduación cerca del 10 %. Fermenta más tranquilo y limpio, pero hay más volumen que destilar.</p>'
      },
      {
        h2: 'Cuánto alcohol sale',
        html: '<p>Un kilo de azúcar rinde en la práctica unos 0,6 litros de alcohol puro; el máximo teórico es 0,68. Con 5 kg salen unos 3 litros de alcohol puro, es decir, <strong>unos 7,5 litros de destilado a 40 % vol.</strong></p><p>El rendimiento real suele ser 10–15 % menor: se separan cabezas y colas y algo se pierde en la destilación.</p>'
      },
      {
        h2: 'Lo que no conviene hacer',
        html: '<p>Con levadura normal no pase de 5–5,5 kg por 20 litros: por encima del 22 % de azúcar la levadura muere por su propio alcohol y el azúcar queda en el mosto. Si se pasó, diluya a 1:5 y añada levadura fresca.</p>'
      }
    ],
    faq: [
      { q: '¿Cuánto azúcar para 20 litros de agua?', a: '4–5 kg. Con 1:4 (5 kg) salen unos 12 % y unos 7,5 litros de destilado a 40 %.' },
      { q: '¿Cuántos días fermenta?', a: '4–8 días con levadura de destilería a 22–28 °C. Con levadura de panadería en frío puede tardar dos semanas.' },
      { q: '¿Hay que invertir el azúcar?', a: 'No es obligatorio. Invertir acelera el arranque y reduce la espuma, pero cuesta una hora de trabajo.' },
      { q: '¿Cómo sé que está listo?', a: 'Sin gas, el mosto se aclara, sabor amargo sin dulzor y el densímetro marca 0–1,5 % de azúcar.' }
    ],
    preset: { tab: 'mash', values: { 'm-sugar': 5, 'm-water': 20, 'm-yeast': 'spirit', 'm-temp': 25 } }
  },

  {
    id: 'es-brix',
    lang: 'es',
    slug: 'brix-tabla-densidad-alcohol',
    title: 'Brix: tabla de conversión a densidad y alcohol',
    description: 'Tabla de Brix a densidad y azúcar por litro, y cómo corregir la lectura del refractómetro durante la fermentación por efecto del alcohol.',
    h1: 'Brix: densidad, azúcar y alcohol potencial',
    lead: 'Brix es la fracción másica de azúcar, así que en un mosto de azúcar el valor en °Bx equivale al contenido de azúcar en porcentaje. 20 °Bx son 20 % de azúcar, densidad 1,083 y unos 12 % de alcohol potencial.',
    sections: [
      {
        h2: 'Tabla de conversión',
        html: '<table class="chart"><thead><tr><th>Brix</th><th>Densidad</th><th>Azúcar, g/l</th><th>Alcohol potencial</th></tr></thead><tbody><tr><td>5 °Bx</td><td>1,020</td><td>51</td><td>3,0 %</td></tr><tr><td>10 °Bx</td><td>1,040</td><td>104</td><td>6,0 %</td></tr><tr><td>15 °Bx</td><td>1,061</td><td>159</td><td>9,0 %</td></tr><tr><td>20 °Bx</td><td>1,083</td><td>217</td><td>12,0 %</td></tr><tr><td>25 °Bx</td><td>1,105</td><td>276</td><td>15,0 %</td></tr><tr><td>30 °Bx</td><td>1,129</td><td>339</td><td>18,0 %</td></tr></tbody></table><p>Fórmula: <code>SG = 1 + B / (258,6 − B/258,2 · 227,1)</code>.</p>'
      },
      {
        h2: 'El Brix engaña durante la fermentación',
        html: '<p>El alcohol cambia el índice de refracción, así que el Brix «en bruto» subestima mucho el azúcar restante: parece que el mosto ya está seco cuando aún queda azúcar. Hay que usar dos lecturas y la corrección de Terrill.</p><p>Ejemplo: de 20 a 8 °Bx son unos 10,9 % de alcohol y menos de 1 g/l de azúcar: listo para destilar.</p>'
      },
      {
        h2: 'Cuándo el refractómetro es mejor que el densímetro',
        html: '<p>En el mosto, siempre: una gota alcanza 20 °C mucho antes que una probeta llena. En mosto en fermentación, el refractómetro solo sirve con corrección.</p>'
      }
    ],
    faq: [
      { q: '¿20 Brix cuánta azúcar es?', a: '20 % en masa. Un litro de esa disolución tiene unos 216 g de azúcar y densidad 1,083.' },
      { q: '¿Qué Brix debe tener el mosto?', a: 'Para mosto de azúcar, 16–22 °Bx. Por encima de 22 la levadura no podrá con todo.' },
      { q: '¿Puedo medir mosto en fermentación con refractómetro?', a: 'Sí, pero solo con la corrección por alcohol; sin ella la lectura subestima el azúcar.' },
      { q: '¿Cuánto alcohol da un mosto de 20 Brix?', a: 'Un 12 % teórico; en la práctica 10–11 %.' }
    ],
    preset: { tab: 'brix', values: { 'b-brix': 20, 'b-volume': 20 } }
  },

  {
    id: 'es-fractions',
    lang: 'es',
    slug: 'cuantas-cabezas-y-colas-separar',
    title: 'Cuántas cabezas y colas separar al destilar',
    description: 'Cálculo de cabezas y colas sobre alcohol puro: cuántos mililitros apartar, cómo calcular el alcohol absoluto y cuándo empiezan las colas.',
    h1: 'Cuántas cabezas y colas separar',
    lead: 'Las cabezas se cuentan sobre alcohol puro: normalmente 5–10 % del alcohol para mosto de azúcar y 8–12 % para cereal. Diez litros de destilado bruto a 40 % son 4 litros de alcohol, así que las cabezas son 320 ml de alcohol, unos 410 ml de líquido a 78 %.',
    sections: [
      {
        h2: 'Primero el alcohol absoluto',
        html: '<p><code>AA = volumen · graduación</code>. Diez litros al 40 % son 4 litros de alcohol puro. Los porcentajes de cabezas y colas se toman de esa cifra, no del volumen de líquido.</p>'
      },
      {
        h2: 'Cuántas cabezas',
        html: '<p>Mosto de azúcar: 5–8 % del alcohol. Cereal: 8–10 %. Fruta: hasta 12 %. Menos del 3 % es arriesgado: el metanol y los aldehídos acaban en el cuerpo. Más del 12 % es perder alcohol sin ganar pureza.</p><p>Se recogen gota a gota, 1–2 gotas por segundo, en un recipiente aparte.</p>'
      },
      {
        h2: 'Cuándo empiezan las colas',
        html: '<p>La referencia es que el chorro baje del 45 % vol. Ahí se corta o se recoge aparte: las colas no se tiran, se añaden a la siguiente destilación.</p><p>El volumen depende mucho del alambique, por eso la proporción se introduce a mano y se ajusta tras las dos o tres primeras destilaciones.</p>'
      }
    ],
    faq: [
      { q: '¿Cuántas cabezas con 10 litros al 40 %?', a: 'Al 8 % del alcohol: 320 ml de alcohol, unos 410 ml de líquido a 78 % vol.' },
      { q: '¿Se pueden beber las cabezas?', a: 'No. Contienen metanol, acetaldehído y ésteres: la parte más tóxica del destilado.' },
      { q: '¿Qué hago con las colas?', a: 'Recogerlas aparte y añadirlas a la siguiente destilación; se recupera parte del alcohol.' },
      { q: '¿Por qué cambian los porcentajes?', a: 'Dependen de la materia prima, la levadura y el equipo. El mosto de azúcar es más limpio; cereal y fruta traen más congéneres.' }
    ],
    preset: { tab: 'fractions', values: { 'f-volume': 10, 'f-pct': 40, 'f-heads': 8, 'f-tails': 15 } }
  }
];
