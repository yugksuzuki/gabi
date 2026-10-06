import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import contato from '@/lib/contato'
import { dadosDaImagem, lerObras } from '@/lib/obras'
import { textosVisiveis } from '@/lib/textos'
import { exibirTelefone, linkDeConsulta } from '@/lib/whatsapp'
import type { Idioma } from '@/i18n/routing'

/**
 * O rodapé, no desenho da referência (05/10, docs/13): fundo escuro, uma frase
 * grande à esquerda, as colunas de links à direita com o título em caixa alta
 * larga, e a marca ENORME fechando a página. Na Kelly Wearstler a frase grande
 * é o cadastro de newsletter — fora do escopo da v1 (CLAUDE.md). Aqui ela é o
 * caminho que o site existe para abrir: o e-mail e o WhatsApp dela.
 *
 * A marca grande é a rubrica, clara sobre o grafite: G1, "sempre a logo".
 *
 * No celular as colunas viram sanfonas (+), como na referência. São <details>:
 * abrem sem JavaScript. No computador ficam abertas — por isso existem duas
 * versões das colunas, e cada tamanho de tela esconde a outra.
 */
export function Rodape() {
  const t = useTranslations()
  const locale = useLocale() as Idioma
  const ano = new Date().getFullYear()
  const rubrica = dadosDaImagem('/marca/rubrica.png')
  const obras = lerObras()
  const temEnsaio = textosVisiveis().length > 0
  const { href: whatsapp, canal, numero } = linkDeConsulta('Gabriela Seleme', locale)

  const colunas = [
    {
      titulo: t('rodape.obras'),
      links: obras.map((obra) => ({
        rotulo: obra.titulo,
        interno: { pathname: '/obras/[slug]', params: { slug: obra.slug } } as const,
      })),
    },
    {
      titulo: t('rodape.site'),
      links: [
        { rotulo: t('nav.sobre'), interno: '/a-artista' as const },
        ...(temEnsaio ? [{ rotulo: t('nav.textos'), interno: '/ensaios' as const }] : []),
        { rotulo: t('nav.contato'), interno: '/contato' as const },
      ],
    },
    {
      titulo: t('rodape.siga'),
      links: [
        { rotulo: 'Instagram', externo: contato.instagramUrl },
        { rotulo: t('contato.email'), externo: `mailto:${contato.email}` },
        ...(canal === 'whatsapp' ? [{ rotulo: 'WhatsApp', externo: whatsapp }] : []),
      ],
    },
  ]

  const lista = (links: (typeof colunas)[number]['links']) => (
    <ul className="rodape__links">
      {links.map((link) => (
        <li key={link.rotulo}>
          {'interno' in link && link.interno ? (
            <Link href={link.interno}>{link.rotulo}</Link>
          ) : (
            <a
              href={'externo' in link ? link.externo : undefined}
              {...('externo' in link && link.externo?.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer me' }
                : {})}
            >
              {link.rotulo}
            </a>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <footer className="rodape">
      <div className="rodape__topo">
        <div className="rodape__chamada">
          <p className="rodape__frase">
            <a href={`mailto:${contato.email}`}>{contato.email}</a>
            {canal === 'whatsapp' && numero && (
              <>
                <br />
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  {exibirTelefone(numero)}
                </a>
              </>
            )}
          </p>
        </div>

        {/* Computador: as colunas abertas. */}
        <div className="rodape__colunas hidden md:grid">
          {colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <h2 className="titulo-largo rodape__titulo">{coluna.titulo}</h2>
              {lista(coluna.links)}
            </div>
          ))}
        </div>

        {/* Celular: sanfonas, como na referência. */}
        <div className="md:hidden">
          {colunas.map((coluna) => (
            <details key={coluna.titulo} className="rodape__sanfona">
              <summary>
                <h2 className="titulo-largo rodape__titulo">{coluna.titulo}</h2>
              </summary>
              {lista(coluna.links)}
            </details>
          ))}
        </div>
      </div>

      {rubrica && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/marca/rubrica.png"
          alt="Gabriela Seleme"
          width={rubrica.largura}
          height={rubrica.altura}
          loading="lazy"
          className="rodape__marca"
        />
      )}

      <p className="rodape__base">
        © {ano} Gabriela Seleme. {t('rodape.direitos')}
      </p>
    </footer>
  )
}
