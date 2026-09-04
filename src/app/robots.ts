import type { MetadataRoute } from 'next'
import { urlDoSite } from '@/lib/metadados'

/**
 * FECHADO. Não é descuido — é decisão (docs/01 §7.7).
 *
 * "Site indexado com [PENDENTE] é dano difícil de reverter." Duas das três
 * obras não têm ficha, texto nem uma única fotografia. Enquanto for assim,
 * nada entra em índice de busca.
 *
 * Para abrir na estreia: ABRIR_INDEXACAO=1 no ambiente de produção.
 *
 * A trava deixou de ser tudo-ou-nada. Este arquivo abre o rastreamento; quem
 * decide página a página é `robotsDaPagina()` em src/lib/metadados.ts, e obra
 * que ainda não é `publicada` continua fora do índice mesmo com a chave ligada.
 * Por isso a chave pode ser virada antes de o acervo inteiro fechar: o que tem
 * [PENDENTE] se protege sozinho.
 *
 * `/wireframe/` fica fora do índice nos dois estados. São as pranchas estáticas
 * do desenho, publicadas só para abrir no Figma e para a Gabriela olhar — não
 * são o site e não podem competir com ele em busca.
 */
export default function robots(): MetadataRoute.Robots {
  const aberto = process.env.ABRIR_INDEXACAO === '1'

  return {
    rules: aberto
      ? { userAgent: '*', allow: '/', disallow: '/wireframe/' }
      : { userAgent: '*', disallow: '/' },
    ...(aberto ? { sitemap: `${urlDoSite()}/sitemap.xml` } : {}),
  }
}
