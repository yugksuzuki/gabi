/**
 * Os arquivos da entrada da home.
 *
 * Desde 05/10/2026 a entrada é o filme dela trabalhando — `GAB/Site gseleme/
 * 0722(1).mp4`, 2558×1440, P&B, 23s: a mão sobre a lã, ela deitada entre as
 * peças vista de cima, os materiais. É o que ela elogiou na Kelly Wearstler:
 * "um vídeo com imagens dela montando uma mesa, apresentando a coleção". Até
 * então a entrada era um recorte de 2,7s de uma janela com a cidade, tirado de
 * um vídeo de Instagram com legenda queimada — era o que havia. Ver
 * docs/validacao/entrada-video/.
 *
 * DOIS CORTES DO MESMO FILME, um por formato de tela:
 *
 * - paisagem (1920×1080) — computador e tablet. O filme como foi feito.
 * - retrato (720×1280) — celular. Recorte central 9:16 do mesmo quadro. As
 *   tomadas de cima são espelhadas no meio, então o recorte central é o que
 *   preserva a composição; a mão sobre a lã cabe inteira.
 *
 * O filme foi girado para COMEÇAR na mão sobre a lã (6s do original): o
 * primeiro quadro é o pôster, e o pôster é a primeira coisa que alguém vê.
 * Loop de 23s, sem áudio, 24fps, VP9 + H.264.
 */
export const entrada = {
  retrato: {
    webm: '/entrada/retrato.webm',
    mp4: '/entrada/retrato.mp4',
    poster: '/entrada/poster-retrato.webp',
    largura: 720,
    altura: 1280,
  },
  paisagem: {
    webm: '/entrada/paisagem.webm',
    mp4: '/entrada/paisagem.mp4',
    poster: '/entrada/poster-paisagem.webp',
    largura: 1920,
    altura: 1080,
  },
  /** A partir daqui vale o corte em paisagem. O mesmo valor do `md:` do Tailwind. */
  aPartirDe: '(min-width: 768px)',
} as const

/**
 * As faixas de vídeo do cabeçalho e do rodapé das páginas internas — G8, A3,
 * C1 e C2 da revisão de 27/08. Saem do mesmo filme da entrada, em recorte
 * horizontal 1600×450, cada uma em ida e volta (o ping-pong da entrada
 * antiga: sem emenda). ~50KB cada.
 *
 * - cabecalho: as nuvens de lã sobre o fundo escuro (21,5–23,4s do original)
 * - rodape: a mão sobre a lã (6,0–8,2s) — a página termina na mão dela
 */
export const faixas = {
  cabecalho: {
    webm: '/faixa/cabecalho.webm',
    mp4: '/faixa/cabecalho.mp4',
    poster: '/faixa/cabecalho.webp',
  },
  rodape: {
    webm: '/faixa/rodape.webm',
    mp4: '/faixa/rodape.mp4',
    poster: '/faixa/rodape.webp',
  },
} as const
