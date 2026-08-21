import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { idiomas, type Idioma } from '@/i18n/routing'
import geradas from '../../content/imagens.geradas.json'

const DIRETORIO = join(process.cwd(), 'content', 'obras')

/**
 * Largura, altura e LQIP saem do pipeline (scripts/processar-imagens.mjs), não
 * do frontmatter: são dado gerado. Quem edita conteúdo não deveria ter que
 * medir pixel nem colar base64.
 */
type ImagemGerada = { largura: number; altura: number; lqip: string }
const MANIFESTO = geradas as Record<string, ImagemGerada | undefined>

export function dadosDaImagem(src: string): ImagemGerada | undefined {
  return MANIFESTO[src]
}

/**
 * Marca de pendência. É o contrato da regra 2 do CLAUDE.md: placeholder é
 * VISIVELMENTE placeholder. Não existe "texto plausível" neste projeto, então o
 * schema aceita a marca explicitamente em vez de aceitar string vazia — vazio
 * some na página; `[PENDENTE: técnica]` não.
 */
const MARCA_PENDENTE = /^\[PENDENTE/i

// Boolean puro, de propósito: como type predicate (`v is string`) o TypeScript
// estreitaria um campo já tipado como string para `never` no ramo negativo.
export const ehPendente = (v: unknown): boolean =>
  typeof v === 'string' && MARCA_PENDENTE.test(v)

const pendente = z.string().regex(MARCA_PENDENTE)

/** Aceita o valor real ou a marca de pendência. */
const talvez = <T extends z.ZodType>(schema: T) => z.union([schema, pendente])

/** Record<Idioma, T> — ou a marca, quando nem a estrutura existe ainda. */
const localizado = <T extends z.ZodType>(schema: T) =>
  talvez(z.object({ pt: talvez(schema), en: talvez(schema) }))

const dimensoes = z.object({
  altura: z.number().positive().optional(),
  largura: z.number().positive().optional(),
  profundidade: z.number().positive().optional(),
  diametro: z.number().positive().optional(),
  unidade: z.enum(['cm', 'mm', 'm']),
})

const imagem = z.object({
  src: z.string().startsWith('/'),
  papel: z.enum(['principal', 'angulo', 'detalhe', 'escala']),
  /** Descreve a OBRA, não o arquivo. Acessibilidade e SEO — docs/03 §1. */
  alt: localizado(z.string()).optional(),
  largura: z.number().int().positive().optional(),
  altura: z.number().int().positive().optional(),
  lqip: z.string().optional(),
  /** Nome do arquivo no Drive. Rastreabilidade até o original. */
  origem: z.string().optional(),
})

const video = z
  .object({
    fonte: z.enum(['arquivo', 'mux']).optional(),
    src: z.string().optional(),
    /** Obrigatório quando houver src: é o que aparece antes e sem JS. */
    poster: z.string().optional(),
    duracaoSegundos: z.number().positive().optional(),
    legendas: localizado(z.string()).optional(),
    origem: z.string().optional(),
  })
  .nullable()

export const esquemaObra = z.object({
  /** Estável: nunca muda depois de publicado. */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Nome próprio da peça. NÃO traduzir — Guernica é Guernica (docs/03 §1). */
  titulo: z.string().min(1),
  ano: talvez(z.number().int()),
  tecnica: localizado(z.string()),
  materiais: localizado(z.string()),
  dimensoes: talvez(dimensoes),
  edicao: localizado(z.string()).optional(),
  /** Fonte única. USD é sempre derivado, nunca armazenado (docs/03 §5). */
  precoBRL: z.number().positive().nullable(),
  disponibilidade: talvez(z.enum(['disponivel', 'reservada', 'vendida', 'acervo'])),
  legenda: localizado(z.string()),
  imagens: z.array(imagem).default([]),
  video: video.optional(),
  /**
   * Intenção editorial, declarada no frontmatter — não deduzida pelo código.
   * `rascunho` aceita campo vazio; `publicada` é uma afirmação de que a ficha
   * está completa, e o build cobra essa afirmação (docs/03 §1).
   */
  estado: z.enum(['rascunho', 'publicada']).default('rascunho'),
  /** Curadoria da sequência é decisão dela, não ordem alfabética. */
  ordem: z.number().int().nonnegative(),
  destaque: z.boolean().default(false),
  /** De onde o dado veio. Some quando tudo for confirmado com a artista. */
  fonte: z.string().optional(),
})

export type DadosObra = z.infer<typeof esquemaObra>
export type Obra = DadosObra & {
  texto: string
  /** O que ainda falta para esta obra poder ser publicada. Vazio = pronta. */
  faltando: string[]
  prontaParaPublicar: boolean
}

/**
 * O que docs/03 §1 exige de uma obra PUBLICADA: técnica, dimensões, legenda,
 * pelo menos uma imagem `principal`, e `alt` nos dois idiomas.
 *
 * Devolve a lista do que falta em vez de um booleano, porque a lista é o que
 * vira pedido para a cliente (docs/04-pendencias-e-coleta.md).
 */
function pendenciasDePublicacao(o: DadosObra, texto: string): string[] {
  const faltando: string[] = []

  const exigirLocalizado = (campo: string, valor: unknown) => {
    if (ehPendente(valor)) return faltando.push(`${campo} (pt e en)`)
    const v = valor as Record<Idioma, unknown> | undefined
    for (const idioma of idiomas) {
      if (!v?.[idioma] || ehPendente(v[idioma])) faltando.push(`${campo}.${idioma}`)
    }
  }

  exigirLocalizado('tecnica', o.tecnica)
  exigirLocalizado('legenda', o.legenda)
  if (ehPendente(o.dimensoes) || !o.dimensoes) faltando.push('dimensoes')
  if (ehPendente(o.ano)) faltando.push('ano')
  if (ehPendente(o.disponibilidade)) faltando.push('disponibilidade')
  if (MARCA_PENDENTE.test(texto.trim())) faltando.push('texto da obra')

  const principais = o.imagens.filter((i) => i.papel === 'principal')
  if (principais.length === 0) faltando.push('pelo menos uma imagem principal')
  for (const img of o.imagens) {
    // Listada no frontmatter mas ausente do manifesto = arquivo não existe.
    // Melhor derrubar aqui do que servir uma imagem quebrada.
    if (!MANIFESTO[img.src]) faltando.push(`arquivo de ${img.src} (rode npm run imagens)`)
  }
  for (const img of o.imagens) {
    if (!img.alt || ehPendente(img.alt)) {
      faltando.push(`alt de ${img.src} (pt e en)`)
      continue
    }
    for (const idioma of idiomas) {
      const alt = (img.alt as Record<Idioma, unknown>)[idioma]
      if (!alt || ehPendente(alt)) faltando.push(`alt.${idioma} de ${img.src}`)
    }
  }

  return faltando
}

let cache: Obra[] | null = null

export function lerObras(): Obra[] {
  if (cache) return cache

  const arquivos = readdirSync(DIRETORIO).filter((f) => f.endsWith('.mdx'))

  const obras = arquivos.map((arquivo) => {
    const bruto = readFileSync(join(DIRETORIO, arquivo), 'utf8')
    const { data, content } = matter(bruto)

    const resultado = esquemaObra.safeParse(data)
    if (!resultado.success) {
      // Frontmatter malformado é erro de programação, não pendência de
      // conteúdo. Falha alto e cedo, com o caminho do arquivo.
      throw new Error(
        `content/obras/${arquivo} — frontmatter inválido:\n` +
          z.prettifyError(resultado.error)
      )
    }

    const texto = content.replace(/<!--[\s\S]*?-->/g, '').trim()
    const faltando = pendenciasDePublicacao(resultado.data, texto)

    // A promessa do material é literal: "obra sem ficha técnica completa não é
    // publicada". Declarar `publicada` com pendência derruba o build aqui, no
    // lugar barato, em vez de vazar [PENDENTE] para produção.
    if (resultado.data.estado === 'publicada' && faltando.length > 0) {
      throw new Error(
        `content/obras/${arquivo} — declarada 'publicada', mas falta:\n` +
          faltando.map((f) => `  - ${f}`).join('\n') +
          `\n\nOu complete a ficha, ou volte para estado: rascunho.`
      )
    }

    // Costura o manifesto: a imagem só chega ao componente já sabendo o
    // tamanho real. Sem isso não há como evitar salto de layout.
    const imagens = resultado.data.imagens.map((img) => ({
      ...img,
      ...(MANIFESTO[img.src] ?? {}),
    }))

    return {
      ...resultado.data,
      imagens,
      texto,
      faltando,
      prontaParaPublicar: faltando.length === 0,
    }
  })

  cache = obras.sort((a, b) => a.ordem - b.ordem)
  return cache
}

export function acharObra(slug: string): Obra | undefined {
  return lerObras().find((o) => o.slug === slug)
}
