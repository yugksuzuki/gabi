import { notFound } from 'next/navigation'

/**
 * Rota reservada da área editorial. Existe para que a troca de idioma
 * (/pt/textos/[slug] <-> /en/writing/[slug]) já esteja no mapa de rotas desde
 * E0. Sem texto publicado, qualquer slug é 404 honesto — não uma página falsa.
 */
export default function Texto() {
  notFound()
}
