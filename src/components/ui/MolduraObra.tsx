import { useTranslations } from 'next-intl'

/**
 * O lugar da fotografia enquanto a fotografia não existe.
 *
 * Duas das três obras não têm uma única foto (docs/06). A moldura ocupa a
 * proporção real que a imagem vai ocupar, então a página já tem hoje o ritmo
 * que terá depois — quando o material chegar é preenchimento, não redesenho.
 * Também evita CLS: a caixa não muda de tamanho ao trocar por <Image>.
 */
export function MolduraObra({
  proporcao = '4 / 5',
  titulo,
}: {
  proporcao?: string
  titulo: string
}) {
  const t = useTranslations('pendente')

  return (
    <div
      role="img"
      aria-label={`${t('rotulo')}: ${titulo}`}
      style={{ aspectRatio: proporcao }}
      className="border-line bg-bg-alt flex w-full items-center justify-center border"
    >
      <span className="legenda px-6 text-center">{t('aviso')}</span>
    </div>
  )
}
