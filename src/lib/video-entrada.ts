import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * O vídeo de entrada da home.
 *
 * CLAUDE.md registra que "existe um vídeo de fundo para a home, já separado por
 * ela". O arquivo ainda não chegou ao repositório, e a página precisa ficar
 * pronta antes dele — senão vira a terceira vez que este projeto para esperando
 * um ativo (set/2024, fev/2025).
 *
 * Por isso a decisão é por EXISTÊNCIA DE ARQUIVO, não por configuração: quando
 * os dois arquivos aparecerem em public/video/, a home passa a abrir com o
 * vídeo. Sem eles, ela abre direto na primeira obra, como hoje. Nenhum código
 * muda, nenhuma variável de ambiente precisa ser lembrada, e nunca existe o
 * estado em que o site aponta para um vídeo que não está lá.
 *
 * O pôster é OBRIGATÓRIO junto com o vídeo (docs/01 §5). É ele que aparece sem
 * JS, com movimento reduzido, e enquanto o vídeo carrega. Vídeo sem pôster
 * abriria a home com um retângulo preto — e "a obra nunca aparece de repente"
 * (docs/02 §5).
 *
 * ## Como preparar os dois arquivos
 *
 * O arquivo sai da câmera com dezenas de MB e o teto de LCP no 4G é 2,5s
 * (docs/02 §5), então ele precisa de uma passada antes de entrar:
 *
 *     ffmpeg -i original.mov -t 12 -an \
 *       -vf "scale=1600:-2" -c:v libx264 -crf 26 -preset slow \
 *       -pix_fmt yuv420p -movflags +faststart public/video/entrada.mp4
 *
 *     ffmpeg -i public/video/entrada.mp4 -frames:v 1 -q:v 3 \
 *       public/video/entrada.jpg
 *
 * `-an` tira o áudio: ele nunca vai tocar (docs/02 §6) e só ocuparia banda.
 * `-movflags +faststart` põe o índice no começo do arquivo, senão o vídeo só
 * começa depois de baixar inteiro. Doze segundos em laço bastam: ninguém fica
 * olhando a entrada, e cada segundo a mais é peso na primeira visita.
 *
 * Mire em 3 MB. Acima de 5 MB, corte a duração antes de baixar a qualidade —
 * granulado em obra monocromática aparece.
 *
 * Mux (item 17) fica para quando houver vídeo LONGO de obra: docs/01 é explícito
 * em que vídeo de fundo de home não justifica custo recorrente.
 */

const VIDEO = '/video/entrada.mp4'
const POSTER = '/video/entrada.jpg'

export type VideoEntrada = { src: string; poster: string }

function existeEmPublic(caminho: string): boolean {
  return existsSync(join(process.cwd(), 'public', caminho))
}

export function videoDeEntrada(): VideoEntrada | null {
  // Sem o par completo, não entra. Um sem o outro é meio caminho, e meio
  // caminho aqui é a home abrindo em preto.
  if (!existeEmPublic(VIDEO) || !existeEmPublic(POSTER)) return null
  return { src: VIDEO, poster: POSTER }
}
