import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import contato from '@/lib/contato'
import { dadosDaImagem } from '@/lib/obras'
import { exibirTelefone, linkDeConsulta } from '@/lib/whatsapp'
import { alternativas, cartaoSocial, robotsDaPagina } from '@/lib/metadados'
import type { Idioma } from '@/i18n/routing'

type Props = { params: Promise<{ locale: Idioma }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contato' })
  return {
    title: t('titulo'),
    alternates: alternativas('/contato', locale),
    ...cartaoSocial({ cartao: 'pagina/contato', titulo: t('titulo'), locale }),
    robots: robotsDaPagina(),
  }
}

export default async function Contato({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contato')
  const ts = await getTranslations('sobre')
  const tm = await getTranslations('marca')
  const rubrica = dadosDaImagem('/marca/rubrica.png')
  // O rosto, da mesma sessão do retrato de "A artista". Saiu de lá quando a
  // página passou a seguir a folha dela (uma foto só) e veio para cá.
  const rosto = dadosDaImagem('/sobre/rosto.jpg')

  // Sem obra específica: a consulta é geral. Mesmo mecanismo, mesmo fallback.
  const { href, canal, numero } = linkDeConsulta('Gabriela Seleme', locale)

  const linhas = [
    {
      rotulo: t('email'),
      texto: contato.email,
      href: `mailto:${contato.email}`,
      externo: false,
    },
    {
      rotulo: t('instagram'),
      texto: `@${contato.instagram}`,
      href: contato.instagramUrl,
      externo: true,
    },
    // O número aparece escrito. Um link que só diz "WhatsApp" obriga a pessoa a
    // clicar para descobrir para onde vai — e quem prefere salvar o contato no
    // celular, ou ligar, fica sem o número.
    ...(canal === 'whatsapp' && numero
      ? [{ rotulo: t('whatsapp'), texto: exibirTelefone(numero), href, externo: true }]
      : []),
  ]

  /*
   * C3 da revisão de 27/08: "mesmo formato da página A artista". A mesma grade:
   * a rubrica grande no alto à esquerda, o título, e a foto à direita sangrando
   * até a borda. O conteúdo não muda — e-mail, Instagram e WhatsApp ficam como
   * estavam (docs/08 §6: nada do conteúdo foi riscado).
   *
   * Diferença de propósito: aqui o título NÃO entra na foto. O lado esquerdo do
   * rosto é preto, e texto escuro sobre preto some. Em "A artista" o nome entra
   * no retrato porque ali a borda da foto é madeira clara.
   *
   * C1 e C2, as faixas de vídeo no cabeçalho e no rodapé, são o G8 — bloqueado
   * por material 16:9 (docs/10 §3).
   */
  return (
    <div className="pt-10 pb-[var(--respiro-secao)] md:pt-16">
      <div className="grid grid-cols-12 md:gap-x-12 md:px-[var(--margem-lateral)]">
        {rubrica && (
          <Image
            src="/marca/rubrica.png"
            alt={tm('rubricaAlt')}
            width={rubrica.largura}
            height={rubrica.altura}
            className="col-span-12 mx-[var(--margem-lateral)] h-auto w-[clamp(9rem,40vw,13rem)] md:col-span-5 md:row-start-1 md:mx-0 md:w-[clamp(12rem,22vw,20rem)]"
          />
        )}

        <h1 className="font-display text-display col-span-12 mx-[var(--margem-lateral)] mt-6 leading-[1] md:col-span-5 md:row-start-2 md:mx-0 md:mt-4">
          {t('titulo')}
        </h1>

        <dl className="border-line col-span-12 mx-[var(--margem-lateral)] mt-12 max-w-[46ch] border-t md:col-span-6 md:row-start-3 md:mx-0 md:mt-16">
          {linhas.map((linha) => (
            <div
              key={linha.rotulo}
              className="border-line grid grid-cols-[6.5rem_1fr] gap-x-4 border-b py-4 md:grid-cols-[9rem_1fr]"
            >
              <dt className="legenda pt-1">{linha.rotulo}</dt>
              {/* O e-mail é uma palavra só, comprida: no celular ele quebra
                  em vez de vazar pela borda da tela. */}
              <dd className="text-corpo min-w-0 [overflow-wrap:anywhere]">
                <a
                  href={linha.href}
                  {...(linha.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="decoration-line-forte underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  {linha.texto}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        {rosto && (
          <Image
            src="/sobre/rosto.jpg"
            alt={ts('rostoAlt')}
            width={rosto.largura}
            height={rosto.altura}
            placeholder="blur"
            blurDataURL={rosto.lqip}
            sizes="(max-width: 768px) 100vw, 52vw"
            className="col-span-12 mt-[var(--respiro-secao)] h-auto w-full md:col-span-6 md:col-start-7 md:row-span-3 md:row-start-1 md:mt-0 md:w-[calc(100%_+_var(--margem-lateral))] md:max-w-none md:self-start"
          />
        )}
      </div>
    </div>
  )
}
