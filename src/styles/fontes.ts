import localFont from 'next/font/local'

/**
 * Fontes auto-hospedadas (item 14 do Stack Técnico): zero requisição a
 * terceiro, zero salto de layout.
 *
 * Os arquivos .woff2 estão VERSIONADOS em src/styles/fontes/ e carregados por
 * next/font/local, não baixados de fonts.googleapis.com no build. Motivo: com
 * next/font/google o build depende de rede a cada compilação — se o Google
 * estiver indisponível, ou a máquina estiver atrás de proxy, o build morre e o
 * deploy some. Arquivo no repositório torna o build determinístico e
 * reproduzível offline. O bundle final é idêntico: o next/font/google também
 * termina servindo o arquivo do nosso domínio.
 *
 * Origem dos arquivos: @fontsource-variable/fraunces e
 * @fontsource-variable/inter v5.3.0, subset latin, eixos variáveis completos.
 * Ambas SIL OFL 1.1 — licenças em src/styles/fontes/LICENSE-*.txt.
 *
 * Duas famílias, e só duas (docs/02 §3): serifada editorial para display e
 * título de obra; neutra para interface, ficha técnica e corpo longo.
 *
 * Escolha de partida, não escolha final: um upgrade para família licenciada de
 * foundry é decisão da Catherine junto com a identidade, não do desenvolvedor.
 */

export const fraunces = localFont({
  src: './fontes/fraunces-latin-variavel.woff2',
  display: 'swap',
  variable: '--fonte-fraunces',
  // Arquivo variável completo: eixos opsz, SOFT, WONK e wght.
  // O opsz é o que dá calor à Fraunces em tamanho grande.
  weight: '100 900',
  style: 'normal',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const inter = localFont({
  src: './fontes/inter-latin-variavel.woff2',
  display: 'swap',
  variable: '--fonte-inter',
  weight: '100 900',
  style: 'normal',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})
