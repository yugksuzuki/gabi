import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { dadosDaImagem } from '@/lib/obras'
import { lerSobre } from '@/lib/sobre'
import { alternativas, cartaoSocial, robotsDaPagina } from '@/lib/metadados'
import { Prosa } from '@/components/ui/Prosa'
import type { Idioma } from '@/i18n/routing'

type Props = { params: Promise<{ locale: Idioma }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sobre' })
  return {
    title: t('titulo'),
    alternates: alternativas('/sobre', locale),
    ...cartaoSocial({ cartao: 'pagina/sobre', titulo: t('titulo'), locale }),
    robots: robotsDaPagina(),
  }
}

export default async function Sobre({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('sobre')
  const tp = await getTranslations('pendente')
  const tm = await getTranslations('marca')
  const { corpo, revisaoEn } = lerSobre()
  // Retrato P&B da sessão profissional. Até 26/08/2026 esta página servia um
  // recorte de 690px tirado da folha de Canva da bio — a mesma foto, de
  // terceira mão. Agora é o original, e continua sendo a foto que ELA escolheu
  // para a própria folha: a escolha permanece dela, só a fonte melhorou.
  const retrato = dadosDaImagem('/sobre/retrato.jpg')
  const rosto = dadosDaImagem('/sobre/rosto.jpg')
  const rubrica = dadosDaImagem('/marca/rubrica.png')

  // A tradução ainda não foi aprovada por ela. Em vez de traduzir por conta
  // própria, mostra o original marcado com lang="pt" — docs/03 §4.
  const emPortuguesNoIngles = locale === 'en' && revisaoEn !== 'aprovada'

  return (
    <div className="px-[var(--margem-lateral)] pt-[var(--respiro-secao)]">
      {/* A folha que ela montou abre com a rubrica acima do nome. Manter a
          ordem dela é o mais próximo de identidade que existe hoje — a cor
          assinatura que ela pediu não sai das obras, que são monocromáticas. */}
      {rubrica && (
        <Image
          src="/marca/rubrica.png"
          alt={tm('rubricaAlt')}
          width={rubrica.largura}
          height={rubrica.altura}
          priority
          className="mb-6 h-auto w-[clamp(9rem,18vw,13rem)]"
        />
      )}

      <h1 className="font-display text-display leading-[0.95]">{t('titulo')}</h1>

      {emPortuguesNoIngles && (
        <p
          role="status"
          className="border-line-forte text-ink-muted mt-10 max-w-[var(--medida-corpo)] border border-dashed px-5 py-3 text-legenda"
        >
          {tp('aviso')} — English translation pending the artist&rsquo;s approval. Shown in
          Portuguese, in her own words.
        </p>
      )}

      {/* Composição assimétrica: o texto ocupa a coluna estreita da esquerda e
          o retrato sobe na direita, do jeito que a folha dela faz. */}
      <div className="mt-14 grid grid-cols-12 gap-y-12 md:gap-x-12">
        <Prosa
          texto={corpo}
          lang={emPortuguesNoIngles ? 'pt' : undefined}
          className="col-span-12 max-w-[var(--medida-corpo)] text-corpo md:col-span-7"
        />

        {/* Duas imagens na coluna da direita, espaçadas. A bio tem dez
            parágrafos: com um retrato só, a metade de baixo da página ficava
            com texto de um lado e nada do outro. A segunda entra mais abaixo e
            fecha a coluna — não é enfeite, é o que dá ritmo à leitura longa. */}
        {retrato && (
          <div className="col-span-12 flex flex-col gap-[var(--respiro-secao)] md:col-span-4 md:col-start-9">
            <Image
              src="/sobre/retrato.jpg"
              alt={t('retratoAlt')}
              width={retrato.largura}
              height={retrato.altura}
              placeholder="blur"
              blurDataURL={retrato.lqip}
              sizes="(max-width: 768px) 100vw, 32vw"
              className="h-auto w-full"
            />

            {rosto && (
              <Image
                src="/sobre/rosto.jpg"
                alt={t('rostoAlt')}
                width={rosto.largura}
                height={rosto.altura}
                placeholder="blur"
                blurDataURL={rosto.lqip}
                sizes="(max-width: 768px) 100vw, 32vw"
                className="h-auto w-full"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

