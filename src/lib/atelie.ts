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
 * VAZIO HOJE, de propósito. As 12 DSC*.JPG existem no Drive e não puderam ser
 * baixadas. Lista vazia = faixa não renderiza = a página continua íntegra.
 * Quando os arquivos chegarem é acrescentar linha: preenchimento, não redesenho.
 */
export type FaixaAtelie = {
  /** Uma ou duas imagens. Duas viram díptico; uma sangra sozinha, panorâmica. */
  imagens: { src: string; alt: { pt: string; en: string } }[]
  legenda: { pt: string; en: string }
  /** Depois de qual obra a faixa entra, pelo slug. */
  depoisDe: string
}

const FAIXAS: FaixaAtelie[] = []

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
