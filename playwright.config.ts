import { defineConfig, devices } from '@playwright/test'

/**
 * Testes de navegador — itens 37 e 39 do Stack Técnico.
 *
 * Rodam contra o BUILD DE PRODUÇÃO, não contra o `next dev`. O que muda entre os
 * dois é justamente o que estes testes olham: rota estática, cabeçalho, imagem
 * otimizada e — o que mais importa aqui — texto em rascunho, que aparece em
 * desenvolvimento e não pode aparecer em produção. Testar o dev seria testar
 * outro site.
 *
 * Um navegador só, Chromium. WebKit e Firefox custam download e tempo e ainda
 * não pagariam por si: nada aqui depende de comportamento específico de motor.
 *
 * Antes da primeira execução, uma vez:  npx playwright install chromium
 */
/**
 * Escape para ambiente que já tem um Chromium instalado fora do lugar padrão
 * (CI com imagem própria, contêiner com navegador pré-baixado). Sem a variável,
 * o Playwright usa o navegador que ele mesmo baixou, como de costume.
 */
const navegador = process.env.CHROMIUM_EXECUTAVEL
  ? { launchOptions: { executablePath: process.env.CHROMIUM_EXECUTAVEL } }
  : {}

export default defineConfig({
  testDir: './testes',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: process.env.URL_DE_TESTE ?? 'http://127.0.0.1:3210',
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...navegador } },
    // A maior parte do tráfego vem do Instagram, ou seja, do celular
    // (docs/01 §8). Rodar só em desktop é auditar a minoria das visitas.
    { name: 'celular', use: { ...devices['Pixel 7'], ...navegador } },
  ],

  // Sem URL_DE_TESTE, sobe o próprio servidor. Com ela, aponta para um preview
  // da Vercel — é assim que se audita o que a cliente vai de fato abrir.
  webServer: process.env.URL_DE_TESTE
    ? undefined
    : {
        command: 'npm run build && npx next start -p 3210',
        url: 'http://127.0.0.1:3210/pt',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
})
