/**
 * Contatos confirmados. Fonte legível para humano: content/contato.yml.
 *
 * O WhatsApp ESTÁ aqui desde 25/08/2026, quando o número foi confirmado
 * abrindo wa.me no celular. Até então ele vivia só em variável de ambiente,
 * porque não estava confirmado — e a regra de docs/03 §6 nasceu dessa dúvida,
 * não de sigilo. Agora que o número é certo, deixá-lo apenas no ambiente
 * protegeria nada e arriscaria muito:
 *
 *   - ele vai impresso na página de Contato, visível para qualquer pessoa;
 *   - campo de ambiente criado e não preenchido é estado normal na Vercel, e
 *     foi exatamente o que derrubou o primeiro build de produção. Aqui o
 *     estrago seria silencioso: o Consultar — a única chamada para ação do
 *     site — degradaria para mailto: sem ninguém perceber.
 *
 * NEXT_PUBLIC_WHATSAPP continua existindo e continua tendo PRECEDÊNCIA: é como
 * se aponta o Consultar para um número de teste em preview sem tocar no código.
 */
const contato = {
  email: 'gseleme.design@gmail.com',
  instagram: 'gseleme.design',
  instagramUrl: 'https://instagram.com/gseleme.design',
  /** E.164 sem o `+`, como o wa.me exige. */
  whatsapp: '5544999929186',
  /** Como se escreve para uma pessoa ler. */
  whatsappExibicao: '+55 44 99992-9186',
} as const

export default contato
