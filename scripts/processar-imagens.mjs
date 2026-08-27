/**
 * Pipeline de imagem — item 16 do Stack Técnico (Sharp) + item 18 (LQIP).
 *
 * Entra o original de `ativos/`, sai o derivado em `public/` mais um manifesto
 * com largura, altura e LQIP reais. O manifesto existe para que o MDX continue
 * legível: dimensão e blur são dado gerado, não conteúdo editorial, e ninguém
 * precisa versionar base64 no frontmatter.
 *
 * Rode depois de trocar qualquer original:
 *   npm run imagens
 *
 * Pode largar o arquivo de câmera CRU em `ativos/` — o script reduz para
 * LARGURA_MAX e respeita a orientação EXIF. Não é preciso preparar nada antes.
 *
 * NOTA sobre os recortes: a rubrica e o retrato estão dentro da folha que a
 * Gabriela montou no Canva, com o nome dela tipografado POR CIMA da foto. Os
 * recortes abaixo foram medidos em cima do arquivo (perfil de tinta por
 * linha/coluna) para tirar o nome sem encostar na rubrica nem na figura.
 * Se a folha for substituída, os números mudam — remeça, não chute.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const RAIZ = join(import.meta.dirname, '..')

/**
 * Teto de largura do derivado.
 *
 * O original de câmera vem em 3213×5712; a maior caixa que o site desenha tem
 * ~1400px, e `next/image` gera as variantes menores a partir daqui. 1800 cobre
 * tela retina com folga e evita commitar dezenas de MB no repositório — que é
 * PÚBLICO.
 *
 * Existe para que ninguém precise redimensionar à mão antes de largar o arquivo
 * em `ativos/`. Imagem menor que o teto passa intacta: `withoutEnlargement`
 * garante que nada é esticado.
 */
const LARGURA_MAX = 1800
const ativo = (f) => join(RAIZ, 'ativos', f)
const publico = (f) => join(RAIZ, 'public', f)

/** Um retângulo branco para tapar o nome tipografado. */
async function tapaBranca(width, height) {
  return sharp({ create: { width, height, channels: 3, background: '#ffffff' } })
    .png()
    .toBuffer()
}

const TRABALHOS = [
  // ---- Obra: Encontro ----------------------------------------------------
  // Agora direto do ORIGINAL de câmera. Antes o site servia a frontal a 900px
  // porque o ativo commitado já vinha encolhido à mão; o original tem 3213 de
  // largura e o pipeline entrega 1800. Dobrou a resolução da imagem mais
  // importante do site sem ninguém tocar em layout.
  {
    origem: 'IMG_7015.JPG',
    destino: '/obras/encontro/frontal.jpg',
    nota: 'obra frontal na parede do ateliê — a principal',
  },
  {
    origem: 'IMG_7017.JPG',
    destino: '/obras/encontro/angulo-1.jpg',
    nota: 'enquadramento aberto, quase de frente, com rodapé',
  },
  {
    origem: 'IMG_7018.JPG',
    destino: '/obras/encontro/angulo-2.jpg',
    nota: 'três quartos, piso à mostra; o relevo lê em profundidade',
  },
  {
    origem: 'IMG_7019.JPG',
    destino: '/obras/encontro/angulo-3.jpg',
    nota: 'três quartos pelo outro lado, mais perto da borda',
  },
  {
    origem: 'IMG_6562.JPG',
    destino: '/obras/encontro/detalhe.jpg',
    nota: 'canto superior, textura e escorrido de prata',
  },
  {
    origem: 'ficha-encontro.jpg',
    destino: '/obras/encontro/escala.jpg',
    // A folha de ficha traz a melhor tomada: obra em parede branca com piso
    // à vista. É a foto de escala que a spec de fotografia pede.
    recorte: { left: 592, top: 0, width: 822, height: 1075 },
    nota: 'recortada da prancha de ficha — obra em contexto, com piso',
  },

  // ---- Ateliê: o segundo registro ----------------------------------------
  // As TRÊS únicas realmente em preto e branco do conjunto de 12 (medido:
  // saturação 0,0; as outras nove ficam entre 9 e 52). docs/06 §3 argumenta
  // que P&B de processo e cinza-neutro de obra convivem sem briga — e é essa
  // convivência que dá o ritmo de publicação à home.
  {
    origem: 'DSC03609 Copy.JPG',
    destino: '/atelie/maos.jpg',
    nota: 'mãos abertas sobre a peça em fibra, coque preso com pincel',
  },
  {
    origem: 'DSC03561 Copy.JPG',
    destino: '/atelie/espelhada.jpg',
    nota: 'composição espelhada — recurso recorrente dela, não acaso',
  },
  {
    origem: 'DSC03574 Copy.JPG',
    destino: '/atelie/materia.jpg',
    nota: 'a matéria sozinha, espelhada. Panorâmica',
  },

  // ---- Retratos ----------------------------------------------------------
  {
    origem: 'GSeleme-74.jpg',
    destino: '/sobre/retrato.jpg',
    // ESTE É O ORIGINAL. Até aqui o retrato era um recorte de 690px tirado da
    // folha de Canva da bio — a mesma foto, de terceira mão. É também a foto
    // que ELA escolheu para a própria folha, então a escolha é dela.
    nota: 'retrato encostada na parede de madeira — o original da sessão',
  },
  {
    origem: 'GSeleme-114.jpg',
    destino: '/sobre/rosto.jpg',
    nota: 'rosto em primeiríssimo plano, metade do quadro',
  },

  // ---- Marca -------------------------------------------------------------
  {
    origem: 'folha-bio-canva.png',
    destino: '/marca/rubrica.png',
    recorte: { left: 80, top: 72, width: 490, height: 444 },
    // Apaga o "Gabriela Seleme" tipografado que divide a caixa com a rubrica.
    // Na folha ele começa em x=375: entre x=250 e x=375 não há tinta nenhuma,
    // então a tapa não encosta no traço.
    apagar: { left: 375 - 80, top: 355 - 72, width: 200, height: 80 },
    formato: 'png',
    // Fundo transparente: o site tem fundo branco-osso, e um PNG com branco
    // chapado apareceria como um retângulo claro em cima dele.
    transparente: true,
    nota: 'rubrica dela, isolada, fundo transparente. RASTER — o vetor ainda falta',
  },
]

/** LQIP: 20px de largura em base64. É o borrão que aparece antes da foto. */
async function gerarLQIP(entrada) {
  const buf = await sharp(entrada).resize(20).webp({ quality: 20 }).toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

const manifesto = {}

for (const t of TRABALHOS) {
  let img = sharp(ativo(t.origem)).rotate()
  if (t.recorte) img = img.extract(t.recorte)
  // Depois do recorte, nunca antes: as coordenadas de recorte foram medidas
  // sobre o original, e reduzir primeiro invalidaria todas elas.
  img = img.resize({ width: LARGURA_MAX, withoutEnlargement: true })
  if (t.apagar) {
    const tapa = await tapaBranca(t.apagar.width, t.apagar.height)
    img = sharp(await img.toBuffer()).composite([
      { input: tapa, left: t.apagar.left, top: t.apagar.top },
    ])
  }

  const saida = publico(t.destino)
  await mkdir(dirname(saida), { recursive: true })

  let buf
  if (t.transparente) {
    // Tinta preta vira opacidade: o cinza invertido do original passa a ser o
    // canal alfa, então o traço fica sólido e o papel some por completo.
    const base = await img.png().toBuffer()
    const { width: lw, height: lh } = await sharp(base).metadata()
    const alfa = await sharp(base).greyscale().negate().toColourspace('b-w').raw().toBuffer()
    buf = await sharp({
      create: { width: lw, height: lh, channels: 3, background: '#1a1917' },
    })
      .joinChannel(alfa, { raw: { width: lw, height: lh, channels: 1 } })
      .png({ compressionLevel: 9 })
      .toBuffer()
  } else if (t.formato === 'png') {
    buf = await img.png({ compressionLevel: 9 }).toBuffer()
  } else {
    buf = await img.jpeg({ quality: 90, mozjpeg: true }).toBuffer()
  }
  await writeFile(saida, buf)

  const { width, height } = await sharp(buf).metadata()
  manifesto[t.destino] = {
    largura: width,
    altura: height,
    lqip: await gerarLQIP(buf),
    origem: t.origem,
    nota: t.nota,
  }

  console.log(`  ${t.destino.padEnd(28)} ${width}x${height}  (${t.origem})`)
}

const destinoManifesto = join(RAIZ, 'content', 'imagens.geradas.json')
await writeFile(destinoManifesto, JSON.stringify(manifesto, null, 2) + '\n')
console.log(`\nManifesto: content/imagens.geradas.json (${Object.keys(manifesto).length} imagens)`)
