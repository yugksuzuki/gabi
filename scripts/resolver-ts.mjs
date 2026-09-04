/**
 * Resolve import relativo SEM extensão para o arquivo .ts correspondente.
 *
 * O código do site escreve `import contato from './contato'`, que é o que o
 * TypeScript e o bundler do Next esperam. O Node, rodando o .ts direto com
 * --experimental-strip-types, exige a extensão e falha com ERR_MODULE_NOT_FOUND.
 *
 * Este hook fecha essa diferença só para os scripts de verificação. Assim eles
 * testam o MÓDULO REAL, o mesmo que vai para produção, em vez de uma cópia que
 * pode divergir — que é o único jeito de um teste desses valer alguma coisa.
 */
export async function resolve(especificador, contexto, proximo) {
  if (especificador.startsWith('.') && !/\.[mc]?[jt]s$/.test(especificador)) {
    try {
      return await proximo(`${especificador}.ts`, contexto)
    } catch {
      // Não é um .ts: deixa o Node seguir o caminho normal (pasta, .js, etc).
    }
  }
  return proximo(especificador, contexto)
}
