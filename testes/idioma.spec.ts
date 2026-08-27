import { expect, test } from '@playwright/test'

/**
 * A troca de idioma preserva a página — item 37, e docs/03 §4 chama isto de
 * PRIORIDADE de teste com todas as letras.
 *
 * O motivo é concreto: "isso quebra em quase todo site bilíngue e é
 * perceptível". Quem está lendo uma obra em português e clica EN espera a mesma
 * obra em inglês, não a home. E o modo como quebra é silencioso — rota estática
 * funciona por coincidência (em PT o caminho visível é igual ao interno) e rota
 * com parâmetro não. Já quebrou uma vez neste projeto; src/i18n/rotas.ts existe
 * por causa disso. Este teste é o que impede a terceira.
 */

const PARES = [
  ['/pt', '/en'],
  ['/pt/sobre', '/en/about'],
  ['/pt/textos', '/en/writing'],
  ['/pt/contato', '/en/contact'],
  ['/pt/obras/encontro', '/en/works/encontro'],
  ['/pt/obras/instante', '/en/works/instante'],
] as const

for (const [rotaPt, rotaEn] of PARES) {
  test(`${rotaPt} troca para ${rotaEn} e volta`, async ({ page }) => {
    await page.goto(rotaPt)
    await page.getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${rotaEn}$`))
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.getByRole('link', { name: 'PT', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${rotaPt}$`))
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt')
  })
}

test('o slug da obra é o mesmo nos dois idiomas', async ({ page }) => {
  // Nome de peça não se traduz: Guernica é Guernica (docs/03 §1). Só o segmento
  // de seção muda — obras/works.
  await page.goto('/en/works/encontro')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Encontro')
})

test('a canônica e o hreflang apontam para o par certo', async ({ page }) => {
  await page.goto('/pt/obras/encontro')

  const canonica = page.locator('link[rel="canonical"]')
  await expect(canonica).toHaveAttribute('href', /\/pt\/obras\/encontro$/)

  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    /\/en\/works\/encontro$/
  )
  // x-default aponta para PT, o padrão do site (docs/03 §4).
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    /\/pt\/obras\/encontro$/
  )
})

test('a raiz redireciona por idioma do navegador, com PT como padrão', async ({ browser }) => {
  const emIngles = await browser.newContext({ locale: 'en-US' })
  const p1 = await emIngles.newPage()
  await p1.goto('/')
  await expect(p1).toHaveURL(/\/en$/)
  await emIngles.close()

  const emPortugues = await browser.newContext({ locale: 'pt-BR' })
  const p2 = await emPortugues.newPage()
  await p2.goto('/')
  await expect(p2).toHaveURL(/\/pt$/)
  await emPortugues.close()
})

test('nenhuma rota publicada mostra a marca de pendência sem aviso', async ({ page }) => {
  // Placeholder é visivelmente placeholder (regra 2), mas a MARCA crua
  // `[PENDENTE: ...]` é anotação de conteúdo, não texto de site. Ela nunca deve
  // vazar para a página — o componente <Pendente /> é quem mostra a ausência.
  for (const rota of ['/pt', '/en', '/pt/obras/encontro', '/pt/obras/instante', '/pt/sobre']) {
    await page.goto(rota)
    const corpo = await page.locator('body').innerText()
    expect(corpo, `${rota} vazou a marca de pendência`).not.toMatch(/\[PENDENTE/i)
  }
})
