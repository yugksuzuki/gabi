/**
 * Testa o botão Consultar — a única chamada para ação do site.
 *
 * Existe porque três coisas podem quebrar em silêncio aqui, e nenhuma delas
 * aparece em erro de build:
 *
 *   1. o número perder um dígito e o wa.me abrir "número inválido";
 *   2. a mensagem chegar sem o nome da obra, e a Gabriela receber "olá" solto
 *      sem saber de qual peça a pessoa fala;
 *   3. NEXT_PUBLIC_WHATSAPP ser preenchida com lixo e derrubar o link em vez de
 *      cair no mailto:.
 *
 * O fallback é o ponto: sem número válido, o mesmo botão vira e-mail com o
 * assunto equivalente. Nunca um link morto.
 *
 * Roda com --experimental-strip-types: importa o .ts direto, sem transpilador.
 */
import contato from '../src/lib/contato.ts'
import { exibirTelefone, linkDeConsulta, normalizarNumero } from '../src/lib/whatsapp.ts'

/** O módulo lê process.env na chamada, então dá para testar cada cenário. */
function com(valor, fn) {
  const antes = process.env.NEXT_PUBLIC_WHATSAPP
  if (valor === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP
  else process.env.NEXT_PUBLIC_WHATSAPP = valor
  try {
    return fn()
  } finally {
    if (antes === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP
    else process.env.NEXT_PUBLIC_WHATSAPP = antes
  }
}

const casos = [
  [
    'padrão: número confirmado',
    () => com(undefined, () => linkDeConsulta('Encontro', 'pt').canal),
    'whatsapp',
  ],
  [
    'variável vazia não anula',
    () => com('', () => linkDeConsulta('Encontro', 'pt').canal),
    'whatsapp',
  ],
  [
    'variável tem precedência',
    () => com('5547999998888', () => linkDeConsulta('Encontro', 'pt').numero),
    '5547999998888',
  ],
  // Variável torta NÃO derruba o botão: cai no número confirmado do contato.ts.
  // É a mesma lição do build que morreu com NEXT_PUBLIC_SITE_URL vazia — valor
  // inválido no ambiente é estado normal, e não pode custar a chamada para ação.
  [
    'número curto usa o confirmado',
    () => com('55449992', () => linkDeConsulta('Encontro', 'pt').numero),
    contato.whatsapp,
  ],
  [
    'lixo usa o confirmado',
    () => com('não é telefone', () => linkDeConsulta('Encontro', 'pt').numero),
    contato.whatsapp,
  ],
  // O caminho do mailto: existe para o dia em que não houver número nenhum.
  ['normalizar: curto demais', () => normalizarNumero('55449992'), null],
  ['normalizar: lixo', () => normalizarNumero('não é telefone'), null],
  ['normalizar: vazio', () => normalizarNumero(''), null],
  ['normalizar: ausente', () => normalizarNumero(undefined), null],
  ['normalizar: válido', () => normalizarNumero('+55 44 99992-9186'), '5544999929186'],
  [
    'máscara com + e hífen',
    () => com('+55 (44) 99992-9186', () => linkDeConsulta('Encontro', 'pt').numero),
    contato.whatsapp,
  ],
  [
    'exibição do confirmado',
    () => exibirTelefone(contato.whatsapp),
    contato.whatsappExibicao,
  ],
  ['exibição de outro DDD', () => exibirTelefone('5547988887777'), '+55 47 98888-7777'],
  ['exibição de número de fora', () => exibirTelefone('351912345678'), '+351912345678'],
]

let falhou = false
console.log('Consultar — src/lib/whatsapp.ts\n')
for (const [nome, fn, esperado] of casos) {
  const obtido = fn()
  const ok = obtido === esperado
  if (!ok) falhou = true
  console.log(`  ${ok ? 'ok  ' : 'FALHA'}  ${nome.padEnd(28)} ${JSON.stringify(obtido)}`)
  if (!ok) console.log(`         esperado: ${JSON.stringify(esperado)}`)
}

// O nome da obra tem que chegar na mensagem, nos dois idiomas. Sem ele a
// consulta é indistinguível de qualquer outra e o site não serviu para nada.
for (const idioma of ['pt', 'en']) {
  const { href } = com(undefined, () => linkDeConsulta('Encontro', idioma))
  const texto = decodeURIComponent(href)
  const ok = texto.includes('Encontro')
  if (!ok) falhou = true
  console.log(`  ${ok ? 'ok  ' : 'FALHA'}  ${`nome da obra em ${idioma}`.padEnd(28)}`)
}

// Nunca a palavra "comprar" — regra 3 do CLAUDE.md, e ela vale também para o
// texto que sai daqui e chega no celular dela.
const proibidas = ['comprar', 'compra', 'buy', 'purchase', 'checkout', 'carrinho']
for (const idioma of ['pt', 'en']) {
  const { href } = com(undefined, () => linkDeConsulta('Encontro', idioma))
  const texto = decodeURIComponent(href).toLowerCase()
  const achou = proibidas.find((p) => texto.includes(p))
  if (achou) {
    console.error(`\nFALHA: a mensagem em ${idioma} contém "${achou}"`)
    falhou = true
  }
}

if (falhou) process.exit(1)
console.log('\nTodos os casos passam.')
