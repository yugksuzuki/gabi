import { routing, type CaminhoInterno } from './routing'

/**
 * Recupera o TEMPLATE de rota a partir do caminho interno já resolvido.
 *
 * Por que isso existe: `usePathname()` do next-intl devolve o caminho interno
 * com os parâmetros já substituídos ('/obras/instante'), não o template
 * ('/obras/[slug]'). Como o mapa de `pathnames` é indexado pelo template, quem
 * passa o caminho resolvido não encontra a tradução — e o link cai no caminho
 * interno prefixado.
 *
 * O sintoma é exatamente o que docs/03 §4 manda testar: em /en/works/instante o
 * seletor apontava para /en/obras/instante. Rota estática funcionava por
 * coincidência (em PT o caminho visível é igual ao interno), rota com parâmetro
 * não. Este matcher fecha o buraco para os dois casos.
 */
export function acharTemplate(caminhoInterno: string): CaminhoInterno {
  const templates = Object.keys(routing.pathnames) as CaminhoInterno[]

  // Caminho sem parâmetro: casa direto.
  if (templates.includes(caminhoInterno as CaminhoInterno)) {
    return caminhoInterno as CaminhoInterno
  }

  // Com parâmetro: compara segmento a segmento. Mais específico primeiro, para
  // que '/textos/[slug]' nunca perca para um template mais curto.
  const segmentos = caminhoInterno.split('/').filter(Boolean)
  const candidatos = templates
    .filter((t) => t.includes('['))
    .sort((a, b) => b.split('/').length - a.split('/').length)

  for (const template of candidatos) {
    const partes = template.split('/').filter(Boolean)
    if (partes.length !== segmentos.length) continue
    const casa = partes.every(
      (parte, i) => (parte.startsWith('[') && parte.endsWith(']')) || parte === segmentos[i]
    )
    if (casa) return template
  }

  // Rota fora do mapa (404, por exemplo): devolve como veio.
  return caminhoInterno as CaminhoInterno
}
