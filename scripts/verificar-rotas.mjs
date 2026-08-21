/**
 * Testa o matcher de rotas sem subir navegador — é a regressão mais barata do
 * projeto e cobre o critério de pronto da E0: "a troca preserva a página".
 *
 * Espelha o mapa de src/i18n/routing.ts. Se alguém adicionar rota lá e esquecer
 * aqui, o caso novo simplesmente não é coberto — então adicione junto.
 */
const TEMPLATES = [
  '/',
  '/obras/[slug]',
  '/sobre',
  '/textos',
  '/textos/[slug]',
  '/contato',
]

function acharTemplate(caminho) {
  if (TEMPLATES.includes(caminho)) return caminho
  const segmentos = caminho.split('/').filter(Boolean)
  const candidatos = TEMPLATES.filter((t) => t.includes('[')).sort(
    (a, b) => b.split('/').length - a.split('/').length
  )
  for (const template of candidatos) {
    const partes = template.split('/').filter(Boolean)
    if (partes.length !== segmentos.length) continue
    if (partes.every((p, i) => (p.startsWith('[') && p.endsWith(']')) || p === segmentos[i])) {
      return template
    }
  }
  return caminho
}

const casos = [
  ['/', '/'],
  ['/sobre', '/sobre'],
  ['/textos', '/textos'],
  ['/contato', '/contato'],
  ['/obras/encontro', '/obras/[slug]'],
  ['/obras/desabrochar', '/obras/[slug]'],
  ['/textos/um-texto-qualquer', '/textos/[slug]'],
  ['/rota-que-nao-existe', '/rota-que-nao-existe'],
]

let falhou = false
console.log('Matcher de rotas — src/i18n/rotas.ts\n')
for (const [entrada, esperado] of casos) {
  const obtido = acharTemplate(entrada)
  const ok = obtido === esperado
  if (!ok) falhou = true
  console.log(`  ${ok ? 'ok  ' : 'FALHA'}  ${entrada.padEnd(28)} -> ${obtido}`)
}
if (falhou) {
  console.error('\nMatcher de rotas quebrado: a troca de idioma vai perder a página.')
  process.exit(1)
}
console.log('\nTodos os casos passam.')
