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
 * subset latin). Cormorant: 38 KB -> 26 KB, mais 28 KB de itálico. Inter:
 * 48 KB -> 30 KB.
 *
 * Ambas SIL OFL 1.1 — licenças em src/styles/fontes/LICENSE-*.txt.
 *
 * ## Por que Cormorant Garamond, e não Fraunces
 *
 * Porque ela pediu. G4 da lista de 27/08 (docs/08 §1) diz "usar Cormorant
 * Garamond", e isso venceu a escolha anterior — que era nossa, não dela.
 * A instrução casa com o material: a folha A3 em que ela mesma diagramou a
 * própria bio já está em Garamond. O site estava numa fonte que ela nunca
 * escolheu.
 *
 * ## A divisão de trabalho mudou junto
 *
 * Antes: serifada para display e título, neutra para todo o resto — inclusive
 * o corpo do texto. Agora a Cormorant carrega TAMBÉM o corpo (21px, no
 * wireframe que ela aprovou), e a Inter recua para a interface: menu, ficha,
 * legenda, preço, Consultar. Texto de artista se lê em serifada; o que é
 * maquinário do site se lê em neutra e não disputa atenção.
 *
 * O itálico não é enfeite: a ficha técnica escreve o nome da peça em itálico,
 * seguindo a prancha que ela diagramou (docs/08 §3, commit 1ec5ae4).
 *
 * Escolha dela, não de partida: um upgrade para família licenciada de foundry
 * seria decisão da Catherine junto com a identidade — mas agora teria de
 * passar pela Gabriela antes, porque esta escolha tem nome e dono.
 */

export const cormorant = localFont({
  src: [
    {
      path: './fontes/cormorant-latin-variavel.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: './fontes/cormorant-latin-italico.woff2',
      weight: '300 700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--fonte-cormorant',
  fallback: ['Garamond', 'Georgia', 'Times New Roman', 'serif'],
})

export const inter = localFont({
  src: './fontes/inter-latin-variavel.woff2',
  display: 'swap',
  variable: '--fonte-inter',
  weight: '300 700',
  style: 'normal',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
})
