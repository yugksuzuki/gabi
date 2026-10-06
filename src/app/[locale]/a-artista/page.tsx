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
    alternates: alternativas('/a-artista', locale),
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
  // Retrato P&B da sessão profissional — a mesma foto que ELA escolheu para a
  // própria folha. Até 26/08/2026 esta página servia um recorte de 690px tirado
  // da folha de Canva; agora é o original.
  const retrato = dadosDaImagem('/sobre/retrato.jpg')
  const rubrica = dadosDaImagem('/marca/rubrica.png')

  // A tradução ainda não foi aprovada por ela. Em vez de traduzir por conta
  // própria, mostra o original marcado com lang="pt" — docs/03 §4.
  const emPortuguesNoIngles = locale === 'en' && revisaoEn !== 'aprovada'

  /*
   * A diagramação da folha dela (docs/08 §4, A1–A4), na palavra dela: "do
   * jeitinho que tá: o 'Gabriela Seleme' entrando para dentro da foto, a logo
   * em cima". A folha é `ativos/folha-bio-canva.png`:
   *
   *   - a rubrica grande, no alto, à esquerda
   *   - o nome em Cormorant logo abaixo, que ENTRA na foto — a última palavra
   *     já está sobre o retrato
   *   - o retrato à direita, sangrando até a borda
   *   - o texto dela à esquerda do retrato, e depois seguindo
   *
   * O título "A artista" sai da página (A2): na folha não existe título — quem
   * faz esse papel é o nome. "A artista" continua sendo o nome da aba e o
   * <title>. O segundo retrato (o rosto) saiu daqui: a folha tem uma foto só. Ele
   * foi para Contato, que ela pediu "no mesmo formato" desta página (C3).
   *
   * A1–A4 entram aqui. A3, a faixa de vídeo no cabeçalho e no rodapé, é o G8 —
   * bloqueado por material 16:9 (docs/10 §3), não por esta página.
   *
   * O sobreposto é grade, não posição absoluta: o nome e o retrato dividem
   * células da mesma grade e o nome fica por cima (z-10). Assim nada sai do
   * fluxo e a ordem de leitura continua a do código. ATENÇÃO: os dois precisam de
   * coluna INICIAL explícita (`col-start-*`), repetida em cada breakpoint em que
   * há `col-span-*` — o span reescreve o início. Com coluna automática a grade
   * não sobrepõe: empurra o segundo para colunas implícitas fora da tela.
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
            className="col-span-12 row-start-1 mx-[var(--margem-lateral)] h-auto w-[clamp(9rem,40vw,13rem)] md:col-span-5 md:mx-0 md:w-[clamp(12rem,22vw,20rem)]"
          />
        )}

        {/* O nome entra no retrato.

            Na tela larga, como na folha: "Gabriela" ainda no papel, "Seleme"
            já sobre a foto. As duas palavras moram na mesma grade da página
            (subgrid), então a divisa entre elas É a borda do retrato — "Seleme"
            começa onde a foto começa, em qualquer largura.

            "Seleme" vai em tom claro. Na folha impressa o nome é preto sobre a
            madeira, mas em tela isso dá 2,1:1 — medido no arquivo, na faixa em
            que o nome passa. Claro sobre a mesma madeira dá 5:1 ou mais: o nome
            entra na foto e continua legível, que é o que importa nele.

            No celular a foto ocupa a largura toda e não há papel ao lado: o
            nome inteiro entra pelo alto do retrato, também claro. */}
        <h1 className="font-display text-display relative z-10 col-span-12 col-start-1 row-start-2 mx-[var(--margem-lateral)] mt-14 self-start leading-[1] text-[var(--bg)] md:col-span-12 md:col-start-1 md:mx-0 md:mt-4 md:grid md:grid-cols-subgrid">
          <span className="md:col-span-6 md:-mr-10 md:text-right md:text-[var(--ink)]">
            Gabriela
          </span>{' '}
          <span className="md:col-span-6 md:col-start-7 md:pl-1">Seleme</span>
        </h1>

        {retrato && (
          <Image
            src="/sobre/retrato.jpg"
            alt={t('retratoAlt')}
            width={retrato.largura}
            height={retrato.altura}
            placeholder="blur"
            blurDataURL={retrato.lqip}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 52vw"
            className="col-span-12 col-start-1 row-start-2 mt-8 h-auto w-full md:col-span-6 md:col-start-7 md:row-span-3 md:row-start-1 md:mt-0 md:w-[calc(100%_+_var(--margem-lateral))] md:max-w-none md:self-start"
          />
        )}

        <div className="col-span-12 row-start-3 mx-[var(--margem-lateral)] mt-12 md:col-span-6 md:col-start-1 md:mx-0 md:mt-16">
          {emPortuguesNoIngles && (
            <p
              role="status"
              className="border-line-forte text-ink-muted text-legenda mb-10 max-w-[var(--medida-corpo)] border border-dashed px-5 py-3"
            >
              {tp('aviso')} — English translation pending the artist&rsquo;s approval. Shown in
              Portuguese, in her own words.
            </p>
          )}

          <Prosa
            texto={corpo}
            lang={emPortuguesNoIngles ? 'pt' : undefined}
            className="text-corpo max-w-[var(--medida-corpo)]"
          />
        </div>
      </div>
    </div>
  )
}
