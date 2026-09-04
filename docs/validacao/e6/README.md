# E6 — Qualidade

Auditoria de 25/08/2026, sobre o build de produção (`npm run build && next start`),
não sobre o `next dev`.

## Acessibilidade — WCAG 2.1 AA

`npm run testar` roda axe-core em dez rotas, nos dois idiomas, em desktop e em
celular. **44 casos, zero violação AA.**

Cobertura, além do axe:

- **Teclado.** O primeiro Tab cai no "pular para o conteúdo", e todo elemento
  focável mostra foco visível — o teste percorre a lista inteira, um a um.
- **Sem JavaScript.** Com JS desligado, o nome da obra, a ficha técnica e o
  botão Consultar continuam na página. É a regra de docs/02 §5 verificada, não
  presumida.
- **Marca de pendência.** Nenhuma rota publicada mostra `[PENDENTE:` cru. A
  ausência aparece pelo componente `<Pendente />`, que é o desenho combinado.

E o que o axe não vê, `npm run verificar` vê antes: contraste da paleta
(`verificar:cor`), matcher de rotas, formatação de moeda, resolução de URL e o
botão Consultar.

## Lighthouse — celular

Medido com throttling simulado (o padrão do Lighthouse: 4G lento, CPU 4×). É
pessimista de propósito; aparelho real costuma ficar melhor.

| Rota | Performance | Acessibilidade | Boas práticas | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| `/pt` (portfólio) | 87–96 | 100 | 100 | 2,7–3,7s | 0 | 40–170ms |
| `/pt/obras/encontro` | 98 | 100 | 100 | 2,3s | 0 | 80ms |
| `/pt/sobre` | 100 | 100 | 100 | 1,5s | 0 | 60ms |

**O teto de Performance ≥ 90 passa. O de LCP ≤ 2,5s passa na obra e não passa na
home**, que é a página com a foto maior — no portfólio a obra ocupa a largura
inteira. A variação entre execuções (87 a 96 na mesma rota, mesmo build) é da
máquina que mediu, não do site; o número honesto da home é "por volta de 3s
no 4G simulado".

O que já foi cortado para chegar aqui:

- Fontes recortadas por `scripts/gerar-fontes.py`: 169 KB → 88 KB. Saíram
  glifos fora do latim e os eixos SOFT e WONK, que nenhuma linha de CSS usa. O
  eixo `opsz` ficou — o navegador o aplica sozinho e é ele que dá calor ao nome
  da obra em corpo grande.
- `sizes` corrigido: a imagem da sequência não ocupa 100vw, tem margem lateral.
  Declarar 100vw fazia o navegador baixar 750px de largura para desenhar 640.
  A foto do LCP caiu de 87 KB para 66 KB, com o mesmo desenho na tela.
- Ícone com paleta de 24 tons: 34 KB → 2,5 KB. Ele é baixado cedo, junto com a
  primeira foto, e disputava banda com ela.

O caminho que sobra para a home, se alguém quiser insistir, é a própria
fotografia — e ela ainda vai ser refeita na sessão com a spec de docs/02 §7.
Não vale mexer em qualidade de imagem de arte antes disso.

## Erros corrigidos nesta etapa

- **`/favicon.ico` respondia 500.** Endereço com extensão escapa do middleware
  de i18n e caía em `[locale]` com `locale = "favicon.ico"`; o `generateMetadata`
  estourava. Servidor que devolve 500 para `/favicon.ico` parece quebrado para
  qualquer robô. Agora é 404, e existe ícone.
- **404 sem página.** Qualquer endereço errado dentro do idioma caía no 404
  global, que vive fora de `[locale]` e sai sem nav, sem rodapé e sempre em
  português. Um link velho de obra compartilhado no Instagram levava a pessoa
  para fora do site. Agora cai numa página do site, no idioma em que ela estava.

## O que continua fora

Lighthouse CI (item 38) e Speed Insights (item 31) são fase 2 e dependem de
deploy definitivo. As medidas acima são manuais e estão datadas por isso.

## Capturas

`portfolio`, `obra-encontro`, `obra-instante`, `sobre`, `textos`, `contato`,
`obra-en` e `nao-encontrado`, em 390 / 768 / 1440.
