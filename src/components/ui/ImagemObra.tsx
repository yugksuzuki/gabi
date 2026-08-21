import Image from 'next/image'
import { dadosDaImagem } from '@/lib/obras'
import { MolduraObra } from './MolduraObra'

type Props = {
  src: string
  alt: string | null
  titulo: string
  /** A imagem principal da página de obra carrega sem esperar a rolagem. */
  prioridade?: boolean
  sizes?: string
  className?: string
}

/**
 * A fotografia quando ela existe; a moldura quando não existe.
 *
 * Uma porta só: nenhuma página precisa saber se a foto chegou. Quando o
 * material da Gabriela entrar, o componente troca sozinho — que é o que
 * CLAUDE.md pede ao dizer que a chegada do material tem que ser preenchimento,
 * e não redesenho.
 *
 * `largura`/`altura` reais vêm do manifesto, então o espaço já está reservado
 * antes do byte chegar: CLS ≤ 0,05 é teto de merge, não meta.
 */
export function ImagemObra({ src, alt, titulo, prioridade, sizes, className }: Props) {
  const dados = dadosDaImagem(src)

  // Sem arquivo processado, ou sem alt aprovado, a moldura assume. Uma foto de
  // obra sem descrição é falha de acessibilidade, não detalhe de conteúdo.
  if (!dados || !alt) {
    return (
      <MolduraObra
        titulo={titulo}
        proporcao={dados ? `${dados.largura} / ${dados.altura}` : undefined}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={dados.largura}
      height={dados.altura}
      placeholder="blur"
      blurDataURL={dados.lqip}
      priority={prioridade}
      sizes={sizes ?? '100vw'}
      className={className ?? 'h-auto w-full'}
    />
  )
}
