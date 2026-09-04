import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * WCAG 2.1 AA — item 39 do Stack Técnico.
 *
 * AA não é bônus neste projeto: foi PROMETIDO POR ESCRITO à cliente
 * (docs/01 §5). Então é condição de merge, e falha aqui é falha de build.
 *
 * O axe não substitui olhar. Ele pega o que é mecânico — rótulo ausente, nível
 * de cabeçalho pulado, contraste insuficiente, imagem sem alt — e é justamente
 * isso que passa despercebido numa revisão visual. O que ele NÃO pega está no
 * teste de teclado abaixo e na checagem sem JS.
 */

const ROTAS = [
  ['portfólio', '/pt'],
  ['portfólio (en)', '/en'],
  ['obra completa', '/pt/obras/encontro'],
  ['obra em rascunho', '/pt/obras/instante'],
  ['obra (en)', '/en/works/encontro'],
  ['quem sou eu', '/pt/sobre'],
  ['about (en, texto em pt)', '/en/about'],
  ['textos vazio', '/pt/textos'],
  ['contato', '/pt/contato'],
  ['contact (en)', '/en/contact'],
] as const

for (const [nome, rota] of ROTAS) {
  test(`${nome} não tem violação AA`, async ({ page }) => {
    await page.goto(rota)

    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // A mensagem precisa dizer O QUE quebrou e ONDE. Uma contagem de violações
    // manda quem for consertar abrir o relatório inteiro para descobrir.
    const resumo = resultado.violations
      .map((v) => `${v.id} (${v.impact}) — ${v.help}\n    ${v.nodes[0]?.target.join(' ')}`)
      .join('\n  ')

    expect(resultado.violations, `\n  ${resumo}`).toEqual([])
  })
}

test('a página inteira se navega só com teclado', async ({ page }) => {
  await page.goto('/pt/obras/encontro')

  // O primeiro Tab tem que cair no "pular para o conteúdo". É o atalho de quem
  // navega por teclado e não quer atravessar o menu em toda página.
  await page.keyboard.press('Tab')
  const primeiro = page.locator(':focus')
  await expect(primeiro).toHaveAttribute('href', '#conteudo')

  // Todo elemento focável precisa de foco VISÍVEL: outline removido sem
  // substituto é a falha de acessibilidade mais comum em site bonito
  // (docs/01 §5).
  const focaveis = page.locator('a[href], button, [tabindex]:not([tabindex="-1"])')
  const total = await focaveis.count()
  expect(total).toBeGreaterThan(3)

  for (let i = 0; i < total; i++) {
    const alvo = focaveis.nth(i)
    await alvo.focus()
    const contorno = await alvo.evaluate((el) => {
      const s = getComputedStyle(el, ':focus-visible')
      return {
        outline: s.outlineStyle,
        largura: s.outlineWidth,
        sombra: s.boxShadow,
      }
    })
    const temFoco =
      (contorno.outline !== 'none' && contorno.largura !== '0px') || contorno.sombra !== 'none'
    expect(temFoco, `elemento ${i} não mostra foco`).toBe(true)
  }
})

test('o conteúdo existe sem JavaScript', async ({ browser }) => {
  // "Qualquer efeito que dependa de JS para o conteúdo aparecer" é proibido
  // (docs/02 §5). O jeito de saber é desligando o JS, não confiando no diff.
  const contexto = await browser.newContext({ javaScriptEnabled: false })
  const pagina = await contexto.newPage()

  await pagina.goto('/pt/obras/encontro')
  await expect(pagina.getByRole('heading', { level: 1 })).toHaveText('Encontro')
  await expect(pagina.getByRole('link', { name: /consultar/i })).toBeVisible()
  await expect(pagina.getByText('Gesso e massa acrílica sobre tela')).toBeVisible()

  await pagina.goto('/pt')
  await expect(pagina.getByRole('link', { name: 'Encontro' }).first()).toBeVisible()

  await contexto.close()
})
