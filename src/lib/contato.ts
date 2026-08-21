/**
 * Contatos confirmados. Fonte legível para humano: content/contato.yml.
 *
 * O WhatsApp NÃO está aqui de propósito. O número informado
 * (+55 44 9992-9186) tem 8 dígitos onde celular brasileiro tem 9, e
 * `content/contato.yml` marca `confirmado: false`. Enquanto ninguém abrir
 * wa.me no celular e confirmar, ele vive só em variável de ambiente
 * (docs/03 §6: "número em variável de ambiente, nunca no código").
 */
const contato = {
  email: 'gseleme.design@gmail.com',
  instagram: 'gseleme.design',
  instagramUrl: 'https://instagram.com/gseleme.design',
} as const

export default contato
