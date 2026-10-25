/* =========================================================================
   MATH LAB - MOTOR DE GENERACIÓN PARAMÉTRICA DE EJERCICIOS (generadores.js)
   ========================================================================= */

// Utilidad auxiliar para enteros aleatorios
function randomInt(min, max, exclude = []) {
  let res;
  do {
    res = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (exclude.includes(res));
  return res;
}

// 1. BASE DE DATOS DE TEMAS POR NIVEL
const TopicsDatabase = {
  ciclo1: [
    { id: 'enteros_jerarquia', name: 'Jerarquía de Operaciones (PEMDAS)' }
  ],
  ciclo2: [
    { id: 'segundo_grado', name: 'Ecuaciones de 2º Grado (Completas e Incompletas)' },
    { id: 'pitagoras', name: 'Teorema de Pitágoras (Hipotenusa y Catetos)' },
    { id: 'factoriales', name: 'Factoriales y Combinatoria' }
  ],
  bach: [
    { id: 'factoriales', name: 'Factoriales y Simplificación de Expresiones' }
  ]
};

// 2. CATÁLOGO DE GENERADORES CON MÚLTIPLES ARQUETIPOS
const Generators = {

  // =======================================================================
  // TEMA 1: JERARQUÍA DE OPERACIONES (4 Variantes ricas)
  // =======================================================================
  enteros_jerarquia: () => {
    const arquetipos = [
      // Variante A: Potencias + Producto + Resta
      () => {
        const base = randomInt(2, 4);
        const exp = randomInt(2, 3);
        const pot = Math.pow(base, exp);
        const a = randomInt(-5, 5, [0]);
        const b = randomInt(2, 4);
        const res = a + (pot * b);
        return {
          statement: `${a} + ${base}² · (${b}) = ?`.replace('²', exp === 3 ? '³' : '²'),
          hint: `Primero resuelve la potencia (${base}^${exp}), luego multiplica por ${b} y al final suma ${a}.`,
          type: 'single',
          solution: res,
          steps: [
            `1. Potencia: ${base}^${exp} = ${pot}`,
            `2. Multiplicación: ${pot} · (${b}) = ${pot * b}`,
            `3. Suma final: ${a} + (${pot * b}) = ${res}`
          ]
        };
      },

      // Variante B: Raíz cuadrada exacta + División
      () => {
        const raices = [[4, 2], [9, 3], [16, 4], [25, 5], [36, 6]];
        const [rad, r] = raices[randomInt(0, raices.length - 1)];
        const div = randomInt(2, 4);
        const mult = div * randomInt(2, 5);
        const a = randomInt(-4, 6, [0]);
        const res = a + r - (mult / div);
        return {
          statement: `${a} + √${rad} - (${mult} : ${div}) = ?`,
          hint: `Calcula por separado √${rad} y la división (${mult} : ${div}), y opera sumas y restas de izquierda a derecha.`,
          type: 'single',
          solution: res,
          steps: [
            `1. Raíz cuadrada: √${rad} = ${r}`,
            `2. División: ${mult} : ${div} = ${mult / div}`,
            `3. Operación final: ${a} + ${r} - ${mult / div} = ${res}`
          ]
        };
      },

      // Variante C: Corchetes y paréntesis anidados
      () => {
        const k = randomInt(2, 4);
        const x = randomInt(-6, 6, [0]);
        const y = randomInt(2, 5);
        const sumaInt = x + y;
        const res = k * sumaInt;
        return {
          statement: `${k} · [ ${x} + (${y}) ] = ?`,
          hint: 'Prioridad absoluta: resuelve primero el interior del corchete [ ... ] antes de multiplicar.',
          type: 'single',
          solution: res,
          steps: [
            `1. Interior del corchete: [${x} + (${y})] = ${sumaInt}`,
            `2. Multiplicación exterior: ${k} · (${sumaInt}) = ${res}`
          ]
        };
      },

      // Variante D: Doble paréntesis multiplicándose
      () => {
        const a = randomInt(2, 6);
        const b = randomInt(1, 4);
        const c = randomInt(-4, 3, [0]);
        const d = randomInt(2, 5);
        const p1 = a - b;
        const p2 = c + d;
        const res = p1 * p2;
        return {
          statement: `(${a} - ${b}) · (${c} + ${d}) = ?`,
          hint: 'Calcula el valor de cada paréntesis por separado y multiplica los dos números obtenidos.',
          type: 'single',
          solution: res,
          steps: [
            `1. Primer paréntesis: (${a} - ${b}) = ${p1}`,
            `2. Segundo paréntesis: (${c} + ${d}) = ${p2}`,
            `3. Producto final: (${p1}) · (${p2}) = ${res}`
          ]
        };
      }
    ];

    const elegido = arquetipos[randomInt(0, arquetipos.length - 1)]();
    return { tag: 'ARITMÉTICA 1r CICLO', ...elegido };
  },

  // =======================================================================
  // TEMA 2: ECUACIONES DE 2º GRADO (Completas, sin c y sin b)
  // =======================================================================
  segundo_grado: () => {
    const arquetipos = [
      // Variante A: Completa clásica ax² + bx + c = 0
      () => {
        const r1 = randomInt(-5, 5, [0]);
        const r2 = randomInt(-5, 5, [0, r1]);
        const b = -(r1 + r2);
        const c = r1 * r2;
        const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
        return {
          statement: `x² ${bStr}x ${cStr} = 0`,
          hint: 'Fórmula general: x = (-b ± √(b² - 4ac)) / 2a. Escribe ambas soluciones.',
          type: 'double',
          solution: [Math.min(r1, r2), Math.max(r1, r2)],
          steps: [
            `1. Coeficientes: a = 1, b = ${b}, c = ${c}`,
            `2. Discriminante: Δ = (${b})² - 4(1)(${c}) = ${b*b - 4*c}`,
            `3. Raíz: √${b*b - 4*c} = ${Math.sqrt(b*b - 4*c)}`,
            `4. Soluciones: x₁ = ${Math.min(r1, r2)}, x₂ = ${Math.max(r1, r2)}`
          ]
        };
      },

      // Variante B: Incompleta sin c (x² + bx = 0 ➔ factor común x)
      () => {
        const r2 = randomInt(-7, 7, [0]);
        const b = -r2;
        const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        return {
          statement: `x² ${bStr}x = 0`,
          hint: 'Incompleta sin c: saca factor común x(x + b) = 0. Una de las soluciones siempre es 0.',
          type: 'double',
          solution: [Math.min(0, r2), Math.max(0, r2)],
          steps: [
            `1. Sacamos factor común: x · (x ${bStr}) = 0`,
            `2. O bien x = 0`,
            `3. O bien x ${bStr} = 0 ➔ x = ${r2}`,
            `4. Soluciones: x₁ = ${Math.min(0, r2)}, x₂ = ${Math.max(0, r2)}`
          ]
        };
      },

      // Variante C: Incompleta sin b (x² - c = 0 ➔ despeje directo de raíz)
      () => {
        const k = randomInt(2, 8);
        const c = k * k;
        return {
          statement: `x² - ${c} = 0`,
          hint: 'Incompleta sin b: despeja x² = c y aplica la raíz cuadrada con doble signo (±).',
          type: 'double',
          solution: [-k, k],
          steps: [
            `1. Despejamos el término independiente: x² = ${c}`,
            `2. Aplicamos raíz cuadrada a ambos lados: x = ±√${c}`,
            `3. Soluciones simétricas: x₁ = -${k}, x₂ = ${k}`
          ]
        };
      }
    ];

    const elegido = arquetipos[randomInt(0, arquetipos.length - 1)]();
    return { tag: 'ÁLGEBRA 2º CICLO', ...elegido };
  },

  // =======================================================================
  // TEMA 3: TEOREMA DE PITÁGORAS (Hallar Hipotenusa o Cateto)
  // =======================================================================
  pitagoras: () => {
    const ternas = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
      [9, 12, 15],
      [12, 16, 20]
    ];
    const [c1, c2, h] = ternas[randomInt(0, ternas.length - 1)];
    const pedirCateto = Math.random() > 0.5;

    if (pedirCateto) {
      return {
        tag: 'GEOMETRÍA 2º CICLO',
        statement: `Triángulo Rectángulo:\nHipotenusa h = ${h} cm  |  Cateto conocido a = ${c1} cm\nCalcula el otro Cateto (b):`,
        hint: 'Para despejar un cateto se resta: b² = h² - a² ➔ b = √(h² - a²)',
        type: 'single',
        solution: c2,
        steps: [
          `1. Planteamiento: b² = ${h}² - ${c1}²`,
          `2. Operamos cuadrados: b² = ${h*h} - ${c1*c1} = ${c2*c2}`,
          `3. Raíz: b = √${c2*c2} = ${c2} cm`
        ]
      };
    } else {
      return {
        tag: 'GEOMETRÍA 2º CICLO',
        statement: `Triángulo Rectángulo:\nCateto a = ${c1} cm  |  Cateto b = ${c2} cm\nCalcula la Hipotenusa (h):`,
        hint: 'Para hallar la hipotenusa se suma: h² = a² + b² ➔ h = √(a² + b²)',
        type: 'single',
        solution: h,
        steps: [
          `1. Planteamiento: h² = ${c1}² + ${c2}²`,
          `2. Operamos cuadrados: h² = ${c1*c1} + ${c2*c2} = ${h*h}`,
          `3. Raíz: h = √${h*h} = ${h} cm`
        ]
      };
    }
  },

  // =======================================================================
  // TEMA 4: FACTORIALES Y COMBINATORIA (3 Variantes)
  // =======================================================================
  factoriales: () => {
    const arquetipos = [
      // Variante A: Fracción de simplificación n! / (n-k)!
      () => {
        const k = randomInt(4, 7);
        const diff = randomInt(1, 2);
        const n = k + diff;
        let product = 1;
        let factors = [];
        for (let i = n; i > k; i--) {
          product *= i;
          factors.push(i);
        }
        return {
          statement: `Calcula el valor simplificado:\n(${n}!) / (${k}!) = ?`,
          hint: `Descompón ${n}! hasta llegar a ${k}! y cancela términos repetidos.`,
          type: 'single',
          solution: product,
          steps: [
            `1. Desarrollamos: (${factors.join(' · ')} · ${k}!) / (${k}!)`,
            `2. Cancelamos ${k}! en numerador y denominador`,
            `3. Resultado: ${factors.join(' · ')} = ${product}`
          ]
        };
      },

      // Variante B: Operación combinada directa con factoriales pequeños
      () => {
        const n1 = randomInt(3, 5);
        const n2 = randomInt(2, 3);
        const f = (x) => (x <= 1 ? 1 : x * f(x - 1));
        const v1 = f(n1);
        const v2 = f(n2);
        const res = v1 - v2;
        return {
          statement: `${n1}! - ${n2}! = ?`,
          hint: `Calcula el valor numérico de cada factorial por separado y luego resta.`,
          type: 'single',
          solution: res,
          steps: [
            `1. Calculamos ${n1}! = ${v1}`,
            `2. Calculamos ${n2}! = ${v2}`,
            `3. Resta: ${v1} - ${v2} = ${res}`
          ]
        };
      },

      // Variante C: Número combinatorio C(n, 2)
      () => {
        const n = randomInt(4, 7);
        const comb = (n * (n - 1)) / 2;
        return {
          statement: `Número combinatorio:\nC(${n}, 2) = (${n}!) / [ 2! · (${n}-2)! ] = ?`,
          hint: `Recuerda: C(n, 2) equivale a [ n · (n - 1) ] / 2`,
          type: 'single',
          solution: comb,
          steps: [
            `1. Desarrollamos: [ ${n} · ${n-1} · (${n-2})! ] / [ 2 · (${n-2})! ]`,
            `2. Cancelamos (${n-2})!`,
            `3. Operación: (${n} · ${n-1}) / 2 = ${n*(n-1)} / 2 = ${comb}`
          ]
        };
      }
    ];

    const elegido = arquetipos[randomInt(0, arquetipos.length - 1)]();
    return { tag: 'ESTADÍSTICA Y COMBINATORIA', ...elegido };
  }
};