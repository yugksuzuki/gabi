import type { MetadataRoute } from 'next'
import { urlDoSite } from '@/lib/metadados'

/**
 * FECHADO. Não é descuido — é decisão (docs/01 §7.7).
 *
 * "Site indexado com [PENDENTE] é dano difícil de reverter." Duas das três
 * obras não têm ficha, texto nem uma única fotografia. Enquanto for assim,
 * nada entra em índice de busca.
 *
 * Para abrir na estreia: ABRIR_INDEXACAO=1 no ambiente de produção, e só depois
 * que E5 fechar (nenhum [PENDENTE] em rota publicada).
 */
export default function robots(): MetadataRoute.Robots {
  const aberto = process.env.ABRIR_INDEXACAO === '1'

  return {
    rules: aberto
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    ...(aberto ? { sitemap: `${urlDoSite()}/sitemap.xml` } : {}),
  }
}
