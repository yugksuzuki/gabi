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
 * Os arquivos são RECORTADOS por scripts/gerar-fontes.py, a partir dos
 * originais em src/styles/fontes/originais/ (@fontsource-variable v5.3.0,
 * subset latin). Fraunces: 121 KB -> 58 KB. Inter: 48 KB -> 30 KB. São 85 KB a
 * menos competindo com a foto da obra na primeira visita, e num 4G isso é
 * tempo de LCP. O que saiu foram glifos fora do latim e os eixos SOFT e WONK,
 * que só existem se alguém escrever font-variation-settings à mão — este site
 * não escreve. O eixo `opsz` FICOU: o navegador o aplica sozinho por tamanho de
 * texto, e é ele que dá calor ao nome da obra em corpo grande.
 *
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
  // Eixos opsz e wght. O opsz entra sozinho, por font-optical-sizing: auto.
  weight: '300 700',
  style: 'normal',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const inter = localFont({
  src: './fontes/inter-latin-variavel.woff2',
  display: 'swap',
  variable: '--fonte-inter',
  weight: '300 700',
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
