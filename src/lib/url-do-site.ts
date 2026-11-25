/**
 * A URL canônica do site, resolvida do ambiente.
 *
 * Módulo próprio, sem dependência de i18n nem de Next: resolver endereço não
 * tem nada a ver com rota, e isolado assim dá para testar sem subir o framework
 * (scripts/verificar-url.mjs).
 *
 * O domínio é gseleme.com.br (definido pelo Guilherme em 25/11/2026, docs/14).
 * A URL continua vindo do ambiente, não fixa no código: com o domínio marcado
 * como principal na Vercel, VERCEL_PROJECT_PRODUCTION_URL já é ele, e preview
 * de PR segue apontando para o próprio preview.
 */

const LOCAL = 'http://localhost:3000'

/**
 * Primeiro valor que existe DE VERDADE.
 *
 * Variável definida como string vazia é estado normal — a Vercel guarda assim
 * quando o campo é criado sem preencher — e `??` deixaria o vazio passar,
 * porque só null e undefined são nullish. Foi exatamente isso que derrubou o
 * primeiro build de produção, com `new URL('')`.
 */
function primeiraPreenchida(...valores: (string | undefined)[]): string | undefined {
  for (const v of valores) {
    const limpo = v?.trim()
    if (limpo) return limpo
  }
  return undefined
}

export function urlDoSite(): string {
  const bruta = primeiraPreenchida(
    process.env.NEXT_PUBLIC_SITE_URL,
    // Domínio de produção do projeto na Vercel, quando houver.
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    // URL desta implantação — faz preview de PR funcionar sem configurar nada.
    process.env.VERCEL_URL
  )
  if (!bruta) return LOCAL

  // A Vercel entrega host puro, sem esquema.
  const comEsquema = /^https?:\/\//.test(bruta) ? bruta : `https://${bruta}`
  const semBarra = comEsquema.replace(/\/+$/, '')

  // Última rede: valor torto no ambiente vira localhost, não build quebrado.
  // Canônica errada se conserta com um redeploy; build vermelho trava a estreia.
  try {
    new URL(semBarra)
    return semBarra
  } catch {
    console.warn(
      `[url-do-site] valor inválido no ambiente: ${JSON.stringify(bruta)}. ` +
        `Usando ${LOCAL}. Confira NEXT_PUBLIC_SITE_URL.`
    )
    return LOCAL
  }
}
