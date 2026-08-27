import Image from 'next/image'
import { dadosDaImagem } from '@/lib/obras'
import type { FaixaAtelie as Dados } from '@/lib/atelie'
import type { Idioma } from '@/i18n/routing'

/**
 * Fotografia de processo, SANGRANDO de borda a borda.
 *
 * Sangra de propósito: é o contraste com a obra, que vive dentro da margem.
 * Dois registros alternados — obra contida, ateliê sangrado — é o que dá ritmo
 * de publicação em vez de cadência de grade (docs/02 §4).
 *
 * Uma imagem vira faixa panorâmica; duas viram díptico. Duas das fotos reais
 * usam composição espelhada (docs/06 §2), então o par não é acaso de layout.
 */
export function FaixaAtelie({ faixa, idioma }: { faixa: Dados; idioma: Idioma }) {
  const dupla = faixa.imagens.length > 1

  return (
    <section className="w-full">
      <div className={dupla ? 'grid grid-cols-1 gap-0.5 md:grid-cols-2' : ''}>
        {faixa.imagens.map((img) => {
          const dados = dadosDaImagem(img.src)
          if (!dados) return null
          return (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt[idioma]}
              width={dados.largura}
              height={dados.altura}
              placeholder="blur"
              blurDataURL={dados.lqip}
              sizes={dupla ? '(max-width: 768px) 100vw, 50vw' : '100vw'}
              className={
                dupla
                  ? 'h-[52vh] w-full object-cover md:h-[62vh]'
                  : 'h-[38vh] w-full object-cover md:h-[46vh]'
              }
            />
          )
        })}
      </div>
      <p className="legenda px-[var(--margem-lateral)] pt-3">{faixa.legenda[idioma]}</p>
    </section>
  )
}
