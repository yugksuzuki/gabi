/**
 * Gera o ícone do site a partir da rubrica dela.
 *
 *     node scripts/gerar-icone.mjs
 *
 * Rodar quando a rubrica mudar — em especial quando o VETOR chegar da
 * Catherine (CLAUDE.md lista a rubrica em SVG como pendência: hoje só existe
 * raster). Não faz parte do build; a saída está versionada em src/app/.
 *
 * ## Por que só a inicial
 *
 * A rubrica inteira ("GSeleme") é linda em 512 px e vira um borrão a 32, que é
 * o tamanho em que um favicon vive de verdade. O recorte pega os 46% da
 * esquerda — o G com o floreio — que é a parte que continua legível pequena e
 * continua sendo a mão dela.
 *
 * É a resposta possível ao pedido de "uma cor que seja minha": as obras são
 * monocromáticas e não há cor a extrair (CLAUDE.md), então a assinatura visual
 * é o traço, não um acento cromático.
 *
 * ## Por que paleta em vez de PNG cheio
 *
 * É um traço quase preto sobre branco osso: duas cores e o antisserrilhado
 * entre elas. Vinte e quatro tons dão a mesma imagem e levam o arquivo de 34 KB
 * para 2,5 KB. Não é preciosismo — o navegador baixa o ícone cedo, junto com a
 * primeira foto da obra, e num 4G cada KB ali é tempo de LCP (docs/02 §5).
 */
import sharp from 'sharp'

const RUBRICA = 'public/marca/rubrica.png'
const OSSO = '#f4f2ee' // --bg de src/styles/tokens.css
const FATIA_INICIAL = 0.46
const FOLGA = 0.14

const rubrica = await sharp(RUBRICA).trim({ threshold: 10 }).png().toBuffer()
const { width, height } = await sharp(rubrica).metadata()

const inicial = await sharp(rubrica)
  .extract({ left: 0, top: 0, width: Math.round(width * FATIA_INICIAL), height })
  .trim({ threshold: 10 })
  .png()
  .toBuffer()

const medidas = await sharp(inicial).metadata()
const lado = Math.max(medidas.width, medidas.height)
const alvo = lado + Math.round(lado * FOLGA) * 2

const quadrado = await sharp({
  create: { width: alvo, height: alvo, channels: 4, background: OSSO },
})
  .composite([{ input: inicial, gravity: 'centre' }])
  .png()
  .toBuffer()

for (const [arquivo, tamanho] of [
  ['src/app/icon.png', 256],
  ['src/app/apple-icon.png', 180],
]) {
  const info = await sharp(quadrado)
    .resize(tamanho, tamanho)
    // Sem transparência: o ícone tem fundo próprio. Rubrica transparente sobre
    // o tema escuro do navegador sumiria.
    .flatten({ background: OSSO })
    .png({ palette: true, colours: 24, compressionLevel: 9, effort: 10 })
    .toFile(arquivo)
  console.log(`${arquivo}  ${tamanho}px  ${Math.round(info.size / 102.4) / 10} KB`)
}
