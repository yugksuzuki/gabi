import { expect, test } from '@playwright/test'

/**
 * Cabeçalhos de segurança — padrão Cuoncient (docs/11 §2).
 *
 * Testado no build de produção porque é só ali que o `headers()` do
 * next.config vale de verdade. Um cabeçalho que some numa refatoração do
 * next.config não quebra nada visível — por isso precisa de teste.
 *
 * As rotas cobrem os quatro tipos de resposta do site: página, obra com
 * parâmetro, imagem gerada (/og) e arquivo estático fora do i18n (/wireframe/index.html).
 */

const ROTAS = [
  '/pt',
  '/en/works/encontro',
  '/og/pt/pagina/portfolio.png',
  '/wireframe/index.html',
]

const ESPERADOS: Record<string, string | RegExp> = {
  'x-frame-options': 'DENY',
  'content-security-policy': /frame-ancestors 'none'/,
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': /max-age=\d+/,
  'permissions-policy': /camera=\(\)/,
}

for (const rota of ROTAS) {
  test(`${rota} responde com os cabeçalhos de segurança`, async ({ request }) => {
    const resposta = await request.get(rota)
    expect(resposta.status(), `${rota} não respondeu 200`).toBe(200)

    const cabecalhos = resposta.headers()
    for (const [nome, valor] of Object.entries(ESPERADOS)) {
      const recebido = cabecalhos[nome]
      expect(recebido, `${rota} sem ${nome}`).toBeDefined()
      if (typeof valor === 'string') expect(recebido).toBe(valor)
      else expect(recebido).toMatch(valor)
    }

    // Não anunciar a stack.
    expect(cabecalhos['x-powered-by'], `${rota} anuncia X-Powered-By`).toBeUndefined()
  })
}

test('HSTS não se compromete com preload antes do domínio definitivo', async ({ request }) => {
  const hsts = (await request.get('/pt')).headers()['strict-transport-security'] ?? ''
  expect(hsts).not.toContain('preload')
  expect(hsts).not.toContain('includeSubDomains')
})
