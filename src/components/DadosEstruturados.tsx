/**
 * O bloco JSON-LD da página. Um por página, sempre um só (docs/03 §7).
 *
 * O `replace` não é paranoia decorativa: o conteúdo vem do frontmatter, e um
 * `</script>` dentro de um título ou de uma legenda fecharia a tag e o resto
 * viraria HTML executável. Trocar cada `<` pelo escape unicode equivalente é
 * JSON válido, o parser do Google lê igual, e o navegador nunca chega a ver a
 * sequência que fecha a tag.
 */
export function DadosEstruturados({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  )
}
