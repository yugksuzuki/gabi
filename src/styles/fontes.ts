import { Fraunces, Inter } from 'next/font/google'

/**
 * Auto-hospedadas pelo next/font (item 14 do Stack Técnico): zero requisição a
 * terceiro, zero salto de layout, subsetting automático.
 *
 * Duas famílias, e só duas (docs/02 §3): serifada editorial para display e
 * título de obra; neutra para interface, ficha técnica e corpo longo.
 * Ambas SIL OFL — licença web verificada, sem custo e sem bloqueio.
 *
 * Escolha de partida, não escolha final: um upgrade para família licenciada de
 * foundry é decisão da Catherine junto com a identidade, não do desenvolvedor.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fonte-fraunces',
  // Eixo óptico: o que dá calor à Fraunces em tamanho grande.
  axes: ['SOFT', 'WONK', 'opsz'],
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fonte-inter',
})
