import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

/**
 * A bio. Escrita pela PRÓPRIA Gabriela e transcrita literal da folha que ela
 * fez no Canva (22/07/2026). Autoria dela — não reescrever, não resumir, não
 * "melhorar". O inglês está pendente e continua pendente até ela aprovar:
 * docs/03 §4 é explícito em não traduzir automaticamente voz de artista.
 *
 * Também vale a regra 1 do CLAUDE.md aqui: o site não a chama de artista na
 * primeira pessoa. Esta página é "Quem sou eu", não "A artista".
 */
export function lerSobre() {
  const caminho = join(process.cwd(), 'content', 'sobre.mdx')
  const { data, content } = matter(readFileSync(caminho, 'utf8'))

  return {
    corpo: content.trim(),
    revisaoEn: (data.revisao_en as string | undefined) ?? 'pendente',
    fonte: data.fonte as string | undefined,
  }
}
