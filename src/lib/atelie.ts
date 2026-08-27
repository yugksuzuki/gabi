import { dadosDaImagem } from './obras'

/**
 * O segundo registro da home: fotografia de PROCESSO.
 *
 * A home tinha um registro só — obra em parede branca — e por isso lia como
 * catálogo vazio. O que ela elogiou na Kelly Wearstler (áudio 03/09/24) não foi
 * a vitrine: foi a entrada mostrando o processo, *"imagens dela montando uma
 * mesa, apresentando a coleção"*. É esse registro que entra aqui.
 *
 * Fonte legível para humano: `content/atelie.yml` — mesmo arranjo de
 * `contato.yml`/`contato.ts`, para não acrescentar dependência de YAML só por
 * isto (CLAUDE.md: "toda dependência nova justifica a própria existência").
 *
 * LIGADO em 26/08/2026. Das 12 fotos de ateliê que chegaram, entram as TRÊS
 * realmente em preto e branco — medido, saturação 0,0, contra 9 a 52 das outras
 * nove. Não é gosto: `docs/06 §3` argumenta que P&B de processo e cinza-neutro
 * de obra convivem sem briga, e é dessa convivência que sai o ritmo. Misturar
 * cor no meio quebraria os dois registros de uma vez.
 *
 * Duas faixas, não três. A terceira empurraria a última obra para longe demais
 * da entrada, e o ateliê passaria a competir com o portfólio em vez de dar
 * respiro. As nove restantes ficam em `ativos/` para textos e usos futuros.
 */
export type FaixaAtelie = {
  /** Uma ou duas imagens. Duas viram díptico; uma sangra sozinha, panorâmica. */
  imagens: { src: string; alt: { pt: string; en: string } }[]
  legenda: { pt: string; en: string }
  /** Depois de qual obra a faixa entra, pelo slug. */
  depoisDe: string
}

const FAIXAS: FaixaAtelie[] = [
  {
    // Díptico: uma reta, uma espelhada. Duas espelhadas seguidas viram padrão
    // repetido; alternada com plano reto, a simetria lê como assinatura.
    depoisDe: 'encontro',
    imagens: [
      {
        src: '/atelie/maos.jpg',
        alt: {
          pt: 'Vista de cima do ateliê: as duas mãos dela abertas sobre uma peça em fibra branca, o coque preso com um pincel.',
          en: 'The studio seen from above: both of her hands open on a piece in white fibre, her bun held up by a paintbrush.',
        },
      },
      {
        src: '/atelie/espelhada.jpg',
        alt: {
          pt: 'A mesma cena espelhada no eixo vertical: dois coques e dois pincéis simétricos sobre a fibra branca.',
          en: 'The same scene mirrored on the vertical axis: two buns and two paintbrushes, symmetrical over the white fibre.',
        },
      },
    ],
    legenda: {
      pt: 'Ateliê · trabalho em fibra',
      en: 'Studio · work in fibre',
    },
  },
  {
    // Sozinha e panorâmica: aqui a matéria não tem ninguém em volta.
    depoisDe: 'desabrochar',
    imagens: [
      {
        src: '/atelie/materia.jpg',
        alt: {
          pt: 'A peça em fibra sozinha, espelhada, ocupando toda a largura: lã, fio e enchimento em branco sobre fundo escuro.',
          en: 'The fibre piece alone, mirrored, filling the full width: wool, yarn and stuffing in white against a dark ground.',
        },
      },
    ],
    legenda: {
      pt: 'Ateliê · a matéria',
      en: 'Studio · the material',
    },
  },
]

/**
 * Só devolve faixa cujas imagens realmente existem no manifesto. Uma entrada
 * apontando para arquivo que ninguém processou não vira imagem quebrada na
 * home — ela some, como se não tivesse sido declarada.
 */
export function lerFaixasAtelie(): FaixaAtelie[] {
  return FAIXAS.map((faixa) => ({
    ...faixa,
    imagens: faixa.imagens.filter((im) => dadosDaImagem(im.src)),
  })).filter((faixa) => faixa.imagens.length > 0)
}
