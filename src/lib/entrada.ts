/**
 * O arquivo da entrada da home, e a única coisa que decide o layout dela:
 * a proporção.
 *
 * A referência abre em vídeo SANGRANDO de borda a borda. Isso só funciona com
 * material horizontal — esticar 9:16 numa faixa de 1440 obriga o `cover` a
 * ampliar 2x e a jogar 70% do quadro fora, e movimento que custa qualidade não
 * entra (docs/02 §5). Então a orientação do arquivo escolhe o tratamento, e o
 * componente não precisa saber de mais nada.
 *
 * HOJE é retrato: o corte veio de um material 9:16, gravado no celular.
 * Ver docs/validacao/entrada-video/.
 *
 * QUANDO O VÍDEO CERTO CHEGAR — `GABI SELEME V1.mp4`, 545 MB, em
 * `GAB/Site gseleme`, que docs/06 já apontava como provável vídeo de entrada —
 * troque os arquivos e as medidas abaixo. Sendo horizontal, o hero passa a
 * sangrar sozinho, nos dois tamanhos de tela. Nenhuma outra linha muda.
 */
export const entrada = {
  mp4: '/entrada/entrada.mp4',
  webm: '/entrada/entrada.webm',
  poster: '/entrada/poster.jpg',
  largura: 720,
  altura: 1280,
} as const

export const entradaEhHorizontal = entrada.largura > entrada.altura
