/**
 * Regressão do build de produção que morreu com `new URL('')`.
 *
 * Variável de ambiente definida como string vazia é estado normal — a Vercel
 * guarda assim quando o campo é criado sem preencher. O fallback tem que
 * tratar vazio como ausente, e nenhum valor de ambiente pode derrubar o build.
 */
import { urlDoSite } from '../src/lib/url-do-site.ts'

const LOCAL = 'http://localhost:3000'

const casos = [
  ['tudo ausente', {}, LOCAL],
  ['NEXT_PUBLIC_SITE_URL vazia', { NEXT_PUBLIC_SITE_URL: '' }, LOCAL],
  ['só espaços', { NEXT_PUBLIC_SITE_URL: '   ' }, LOCAL],
  ['valor normal', { NEXT_PUBLIC_SITE_URL: 'https://gseleme.design' }, 'https://gseleme.design'],
  [
    'com barra no fim',
    { NEXT_PUBLIC_SITE_URL: 'https://gseleme.design/' },
    'https://gseleme.design',
  ],
  [
    'vazia, cai na Vercel',
    { NEXT_PUBLIC_SITE_URL: '', VERCEL_PROJECT_PRODUCTION_URL: 'gabi.vercel.app' },
    'https://gabi.vercel.app',
  ],
  [
    'preview: só VERCEL_URL',
    { VERCEL_URL: 'gabi-abc123.vercel.app' },
    'https://gabi-abc123.vercel.app',
  ],
  ['valor torto não derruba', { NEXT_PUBLIC_SITE_URL: 'não é uma url' }, LOCAL],
]

let falhou = false
console.log('URL do site — src/lib/url-do-site.ts\n')

for (const [nome, ambiente, esperado] of casos) {
  for (const k of ['NEXT_PUBLIC_SITE_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_URL']) {
    delete process.env[k]
  }
  Object.assign(process.env, ambiente)

  let obtido
  try {
    obtido = urlDoSite()
  } catch (erro) {
    obtido = `LANÇOU ${erro.constructor.name}: ${erro.message}`
  }

  const ok = obtido === esperado
  if (!ok) falhou = true
  console.log(`  ${ok ? 'ok  ' : 'FALHA'}  ${nome.padEnd(26)} ${obtido}`)
  if (!ok) console.log(`         esperado: ${esperado}`)
}

if (falhou) {
  console.error('\nurlDoSite pode derrubar o build. Corrija antes de publicar.')
  process.exit(1)
}
console.log('\nNenhum valor de ambiente derruba o build.')
