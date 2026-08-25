import Link from 'next/link'
import { fraunces, inter } from '@/styles/fontes'
import './globals.css'

/**
 * 404 de FORA do idioma.
 *
 * Só chega aqui endereço que o middleware de i18n não toca — ou seja, caminho
 * com extensão: /favicon.ico, /qualquer.txt, o que um robô ou um leitor de
 * feed inventar. Sem esta página, o Next tentava renderizar o 404 padrão dentro
 * do layout raiz, que é só um repasse sem <html>, e o resultado era erro 500 em
 * vez de 404. Endereço torto virava erro de servidor — e um servidor que
 * responde 500 para /favicon.ico é um servidor que parece quebrado.
 *
 * Como está fora de [locale], monta o próprio documento. Português, que é o
 * padrão do site (docs/03 §4), e sem next-intl: aqui não existe idioma
 * resolvido para consultar.
 */
export default function NaoEncontradoGlobal() {
  return (
    <html lang="pt" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col justify-center px-[var(--margem-lateral)]">
        <h1 className="font-display text-display leading-[0.95]">Página não encontrada</h1>
        <p className="text-ink-muted mt-10 max-w-[46ch] text-corpo">
          O endereço não existe, ou a página mudou de lugar.
        </p>
        <Link href="/pt" className="legenda hover:text-ink mt-10 w-fit">
          Ver o portfólio →
        </Link>
      </body>
    </html>
  )
}
