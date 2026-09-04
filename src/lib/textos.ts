import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { ehPendente } from './obras'
import { idiomas, type Idioma } from '@/i18n/routing'

const DIRETORIO = join(process.cwd(), 'content', 'textos')

/**
 * A área editorial — docs/03 §2.
 *
 * Mesma arquitetura das obras, de propósito: frontmatter validado por Zod,
 * corpo em prosa, `estado` declarado por quem escreve e não deduzido pelo
 * código. Quem já sabe editar uma obra sabe editar um texto.
 *
 * `estado: 'rascunho'` está aqui desde a v1 mesmo sem automação nenhuma, porque
 * é a fundação do Diário de Ateliê (fase 2) e a promessa central dele é "nada
 * entra no ar sozinho" (docs/03 §2). Rascunho aparece em desenvolvimento, para
 * quem escreve conferir a diagramação, e NUNCA em produção.
 */

const localizado = z.object({ pt: z.string(), en: z.string().optional() })

export const esquemaTexto = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: localizado,
  /**
   * AAAA-MM-DD. Ordena a listagem e assina a página.
   *
   * O YAML transforma `2026-08-20` sem aspas em Date automaticamente, e com
   * aspas deixa string. Quem escreve conteúdo não deveria precisar saber disso,
   * então os dois entram e viram a mesma string ISO.
   */
  publicadoEm: z.preprocess(
    (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  ),
  estado: z.enum(['rascunho', 'publicado']).default('rascunho'),
  /** Listagem, description, cartão social e card de story saem daqui. */
  resumo: localizado,
  /** Slugs de obra. Liga texto e obra nos dois sentidos (docs/03 §2). */
  obrasRelacionadas: z.array(z.string()).default([]),
})

export type DadosTexto = z.infer<typeof esquemaTexto>

export type Texto = DadosTexto & {
  /** O corpo por idioma. `en` ausente = ainda não traduzido POR ELA. */
  corpo: Partial<Record<Idioma, string>>
  faltando: string[]
}

/**
 * O corpo dos dois idiomas mora no mesmo arquivo, separado por uma linha com
 * `---en---`. Dois arquivos por texto dobrariam a chance de um sair do ar
 * sozinho quando alguém renomeia um slug; e ler os dois lado a lado é como se
 * revisa tradução.
 */
const SEPARADOR = /^---en---$/m

function partirCorpo(bruto: string): Partial<Record<Idioma, string>> {
  const limpo = bruto.replace(/<!--[\s\S]*?-->/g, '').trim()
  const [pt, en] = limpo.split(SEPARADOR)
  const corpo: Partial<Record<Idioma, string>> = {}
  if (pt?.trim() && !ehPendente(pt.trim())) corpo.pt = pt.trim()
  if (en?.trim() && !ehPendente(en.trim())) corpo.en = en.trim()
  return corpo
}

function pendenciasDePublicacao(dados: DadosTexto, corpo: Partial<Record<Idioma, string>>) {
  const faltando: string[] = []
  for (const idioma of idiomas) {
    if (!dados.titulo[idioma]) faltando.push(`titulo.${idioma}`)
    if (!dados.resumo[idioma]) faltando.push(`resumo.${idioma}`)
    if (!corpo[idioma]) faltando.push(`corpo.${idioma}`)
  }
  return faltando
}

let cache: Texto[] | null = null

export function lerTextos(): Texto[] {
  if (cache) return cache
  if (!existsSync(DIRETORIO)) return (cache = [])

  const textos = readdirSync(DIRETORIO)
    // `_` no começo = arquivo de apoio, não conteúdo. É como content/textos/
    // guarda o modelo comentado sem que ele vire uma página em lugar nenhum.
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .map((arquivo) => {
      const { data, content } = matter(readFileSync(join(DIRETORIO, arquivo), 'utf8'))
      const resultado = esquemaTexto.safeParse(data)
      if (!resultado.success) {
        throw new Error(
          `content/textos/${arquivo} — frontmatter inválido:\n` +
            z.prettifyError(resultado.error)
        )
      }

      const corpo = partirCorpo(content)
      const faltando = pendenciasDePublicacao(resultado.data, corpo)

      // Mesmo contrato das obras: declarar 'publicado' é uma AFIRMAÇÃO de que o
      // texto está pronto, e o build cobra a afirmação — no lugar barato, em
      // vez de deixar meia tradução vazar para produção.
      if (resultado.data.estado === 'publicado' && !corpo.pt) {
        throw new Error(
          `content/textos/${arquivo} — declarado 'publicado' e sem corpo em português.`
        )
      }

      return { ...resultado.data, corpo, faltando }
    })

  // Mais recente primeiro. Área editorial se lê de trás para frente.
  cache = textos.sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm))
  return cache
}

/**
 * O que a pessoa vê. Rascunho só aparece rodando `npm run dev` — é a rede de
 * proteção que faz "nada entra no ar sozinho" ser código e não intenção.
 */
export function textosVisiveis(): Texto[] {
  const desenvolvimento = process.env.NODE_ENV === 'development'
  return lerTextos().filter((t) => t.estado === 'publicado' || desenvolvimento)
}

export function acharTexto(slug: string): Texto | undefined {
  return textosVisiveis().find((t) => t.slug === slug)
}

/**
 * O idioma em que o corpo será mostrado, e se isso é o idioma da página.
 *
 * docs/03 §4: sem a versão em inglês, NÃO se traduz automaticamente voz de
 * artista. Mostra o português marcado com `lang="pt"` e avisa. A decisão de
 * traduzir é dela.
 */
export function corpoNoIdioma(texto: Texto, idioma: Idioma) {
  const proprio = texto.corpo[idioma]
  if (proprio) return { corpo: proprio, idiomaReal: idioma, traduzido: true }
  const pt = texto.corpo.pt
  return pt
    ? { corpo: pt, idiomaReal: 'pt' as const, traduzido: false }
    : { corpo: null, idiomaReal: idioma, traduzido: false }
}

/** Campo localizado com queda para o português — título e resumo, nunca corpo. */
export function campo(valor: { pt: string; en?: string }, idioma: Idioma): string {
  return valor[idioma] ?? valor.pt
}
