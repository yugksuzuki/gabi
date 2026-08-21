/**
 * Testa a exibição de preço contra o módulo real, sem rede.
 *
 * Existe porque a API do PTAX pode não estar acessível no ambiente de
 * desenvolvimento (e não estava quando isto foi escrito). O que NÃO pode
 * acontecer é o fallback quebrar em silêncio: sem cotação, mostra só o BRL;
 * com cotação, o inglês SEMPRE marca "approx." (docs/03 §5).
 *
 * Roda com --experimental-strip-types: importa o .ts direto, sem transpilador.
 */
import { exibirPreco, formatarBRL, formatarUSD } from '../src/lib/moeda.ts'

const cotacao = { valor: 5.35, data: '2026-08-20' }
const casos = [
  ['PT com cotação',      () => exibirPreco(11230, 'pt', cotacao),  'R$ 11.230'],
  ['PT sem cotação',      () => exibirPreco(11230, 'pt', null),     'R$ 11.230'],
  ['EN com cotação',      () => exibirPreco(11230, 'en', cotacao),  'R$ 11.230 (approx. $2,099)'],
  ['EN sem cotação',      () => exibirPreco(11230, 'en', null),     'R$ 11.230'],
  ['preço null em PT',    () => exibirPreco(null, 'pt', cotacao),   null],
  ['preço null em EN',    () => exibirPreco(null, 'en', cotacao),   null],
  ['formatarBRL',         () => formatarBRL(8350),                  'R$ 8.350'],
  ['formatarUSD',         () => formatarUSD(8350, 5.35),            '$1,561'],
]

let falhou = false
console.log('Moeda — src/lib/moeda.ts\n')
for (const [nome, fn, esperado] of casos) {
  // O Intl usa espaço estreito não separável depois de "R$".
  const obtido = fn()
  const normal = (v) => (typeof v === 'string' ? v.replace(/ | /g, ' ') : v)
  const ok = normal(obtido) === esperado
  if (!ok) falhou = true
  console.log(`  ${ok ? 'ok  ' : 'FALHA'}  ${nome.padEnd(20)} ${JSON.stringify(normal(obtido))}`)
  if (!ok) console.log(`         esperado: ${JSON.stringify(esperado)}`)
}

// A regra que não pode ser quebrada nunca: valor em dólar sem "approx." é
// promessa de preço, e a proposta é clara que frete e imposto são caso a caso.
const en = exibirPreco(11230, 'en', cotacao)
if (en && en.includes('$') && !en.includes('approx.')) {
  console.error('\nFALHA: dólar exibido sem a marca "approx."')
  falhou = true
}

if (falhou) process.exit(1)
console.log('\nTodos os casos passam.')
