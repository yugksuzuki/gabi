# Direção visual e sistema de design

Derivado das referências que a cliente escolheu, não de gosto pessoal.
Cada regra aqui tem origem rastreável no material.

---

## 1. O que extrair de cada referência

### Kelly Wearstler — principal

O que ela elogiou **especificamente** (áudio 03/09/24) não foi o site inteiro. Foi a **entrada**:
um vídeo com imagens dela montando uma mesa, apresentando a coleção. *"Acho que tinha que
pensar em fazer alguma coisa nesse sentido."*

Isso conecta direto com o vídeo de fundo que ela já separou. **A home abre em vídeo.**

O que herdamos:

| Atributo | Como se traduz aqui |
|---|---|
| Silêncio visual | Densidade baixa. Uma ideia por tela. Vazio é elemento de composição, não sobra |
| Escala | Tipografia de título muito grande; imagem em full-bleed ou quase |
| Tipografia editorial | Serifada de display com personalidade + neutra para interface |
| Hierarquia | Dois níveis por tela, nunca cinco. O olho sabe onde ir sem esforço |
| Ritmo de rolagem | Blocos alternando respiro e imagem. Nunca cadência uniforme de grade |
| Navegação refinada | Menu discreto, sem barra pesada. Some ou reduz na rolagem |
| Composição assimétrica | Quando fizer sentido — não como maneirismo |

O que **não** herdamos: texto, imagem, código, logotipo, paleta e tipografia proprietária.

### William Guillon — secundária

Minimalismo severo e apresentação de objeto. Herdamos: **a peça isolada, com muito ar em volta,
e legenda pequena**. É o modelo para a página de obra — não para a home.

### Vovê Clicou — cor

Não é referência de layout. Ela mandou porque *"tem o amarelo da Vovê Clicou, aquele negócio
que você vê, cê sabe que é Vovê Clicou"*. **É um pedido de cor assinatura.**

### Bugatti — o contra-exemplo

Enviada como referência de estímulo sonoro, com a crítica junto: *"trava muito, complica pra
pessoa usar"*. Serve para calibrar o teto de movimento e som, não para copiar.

### Zara Home — não recebida

Ela citou em 11/09/24, prometeu mandar e nunca mandou. **Vale pedir** — ver
`04-pendencias-e-coleta.md`.

---

## 2. Cor

**A cor assinatura sai das obras fotografadas. Não invente antes.**

Isso não é cautela — é método. As peças (*Desabrochar*, *Instante*, *Encontro*) têm materiais e
tonalidades próprios. Uma cor escolhida no Figma antes das fotos vai brigar com elas.
Fluxo: fotos chegam → extrair a paleta dominante das peças → propor 2 ou 3 opções de acento
para ela escolher → travar em token.

Até lá, a base — que não depende das obras e pode ser travada agora:

```css
--bg          /* branco quente, tipo osso/papel — NUNCA #fff puro.
                 Branco puro lê como e-commerce e brutaliza a fotografia */
--bg-alt      /* um passo mais escuro, para seções alternadas */
--ink         /* quase-preto quente, NUNCA #000. Preto puro é duro e datado em tela */
--ink-muted   /* legendas, ficha técnica, metadados */
--line        /* filetes, 1px, baixíssimo contraste */
--accent      /* PENDENTE — extraído das obras */
```

Regras:

- A paleta é neutra e a **obra é a cor**. Se a interface competir com a fotografia, a interface perde
- O acento é usado com parcimônia: estado de foco, hover, um detalhe. Nunca em área grande
- Tudo em CSS custom properties num arquivo só (item 13 do Stack Técnico)
- **Contraste mínimo 4.5:1 para texto**, 3:1 para elementos de interface — WCAG 2.1 AA (item 39).
  Quase-preto sobre branco quente passa com folga; verificar o acento antes de travar

Modo escuro: **não na v1.** Galeria de arte tem uma luz. Duplicar a paleta agora é dobrar a
superfície de erro por um ganho que ninguém pediu.

---

## 3. Tipografia

Duas famílias. Serifada editorial para display e títulos de obra; neutra para interface,
ficha técnica e corpo longo.

**Restrição real:** Kelly Wearstler usa tipografia proprietária. Não dá para usar a dela.
A escolha precisa ser própria e com **licença web verificada**.

Recomendação de partida — open source, licença clara, zero custo, zero bloqueio:

| Papel | Sugestão | Por quê |
|---|---|---|
| Display / títulos | **Fraunces** ou **Instrument Serif** | Fraunces tem eixo óptico e calor; Instrument Serif é mais seca e elegante. Ambas SIL OFL |
| Interface / corpo | **Inter** | Neutra, excelente em texto pequeno de ficha técnica, hinting sólido |

Caminho de upgrade, se houver verba e a cliente quiser assinatura tipográfica mais forte:
famílias licenciadas de foundry (Pangram Pangram, Klim, Commercial Type). **Decisão da
Catherine**, junto com a identidade — não do desenvolvedor sozinho.

Implementação: `next/font` com auto-hospedagem e subsetting (item 14). Sem requisição externa,
sem salto de layout. `font-display: swap` e métricas de fallback ajustadas.

### Escala

Fluida com `clamp()`, ancorada em duas âncoras: 390px e 1440px.

- **Display** — nome da obra na página dela, título da home. Muito grande. É o gesto
- **Título** — seções
- **Corpo** — texto da obra e área editorial. Altura de linha generosa (1.6–1.75),
  medida de 60–70 caracteres. Texto de artista se lê devagar
- **Legenda** — ficha técnica, ano, dimensões. Pequeno, com entrelinha maior e leve
  espaçamento entre letras. É o registro de museu

Regra: **nunca mais de dois pesos na mesma tela.**

---

## 4. Grid e composição

**O problema central é que são três obras.** Uma grade de cards com três itens parece um
template inacabado — exatamente o oposto do posicionamento.

**Solução: o portfólio não é grade, é sequência editorial.** Cada obra ocupa um bloco próprio
de tela, com composição alternada (imagem à esquerda / à direita, escala variando entre elas).
Três blocos em sequência lêem como uma publicação. Três cards lêem como catálogo vazio.

Isso escala: quando houver oito obras, a sequência vira agrupamento; a estrutura não precisa
ser refeita.

- Grid base de 12 colunas com vazios intencionais
- Margem lateral generosa em desktop; a obra pode sangrar até a borda quando for o gesto
- Mobile é a maioria do tráfego que vem do Instagram — **desenhe mobile primeiro**, com o
  vídeo de home leve e um pôster estático como fallback

---

## 5. Movimento — com orçamento

A regra é dela: *"o limiar entre praticidade e experiência imersiva"*.

**Permitido**

- Revelação suave da obra na rolagem (opacidade + deslocamento pequeno, 300–500ms)
- Transição entre portfólio e página de obra
- Rolagem com inércia (Lenis, item 20) — leve, sem exagero de amortecimento
- Blur-up na imagem: LQIP/Blurhash (item 18). *"A obra nunca aparece de repente"*

**Proibido**

- Parallax pesado, scroll-jacking, âncora que sequestra a rolagem
- Animação que atrase a leitura do nome da obra ou do preço
- Qualquer efeito que dependa de JS para o conteúdo aparecer — sem JS, o conteúdo está lá
- Cursor customizado, contador de carregamento teatral

**Orçamento de performance — condição de merge, não meta**

| Métrica | Teto |
|---|---|
| LCP (mobile, 4G) | ≤ 2,5s |
| CLS | ≤ 0,05 |
| INP | ≤ 200ms |
| JS na home | ≤ 150KB comprimido |
| Lighthouse Performance (mobile) | ≥ 90 |

Auditado a cada publicação com Lighthouse CI (item 38). Se um efeito estourar o teto, o
efeito sai — não o teto.

`prefers-reduced-motion: reduce` desliga tudo que se move. Não é opcional: é AA.

---

## 6. Som

Ela levantou o assunto (referência Bugatti) e criticou a execução no mesmo áudio.

Recomendação: **fora da v1.** Se entrar depois, as condições são — nunca toca sozinho,
um controle visível, estado lembrado, e o site funciona idêntico com o som desligado.

---

## 7. Fotografia — a spec que precisa sair antes da sessão

O item de maior impacto no resultado final, e o único que o código não resolve.

Kelly Wearstler funciona porque a fotografia é excepcional **e consistente**. Três obras
fotografadas em dias, luzes e fundos diferentes não formam uma galeria — formam três fotos.

Precisa ser combinado com ela e com o fotógrafo, **antes**:

- **Fundo branco** (já é o pedido dela nos documentos) — mesmo branco, mesma luz, nas três
- **Mesma temperatura de cor** e mesmo esquema de iluminação em toda a sessão
- **Proporções fixas** — definir 2 ou 3 e usá-las nas três obras. Sem isso, a sequência
  editorial não fecha
- **Lista de tomadas por obra:** 1 frontal de catálogo · 1 em ângulo · 2 de detalhe/textura ·
  1 de escala ou contexto (a peça habitada, não só isolada)
- **Resolução:** lado maior ≥ 3000px, sem compressão destrutiva no original
- **Nomenclatura:** `desabrochar-01-frontal.jpg`, `desabrochar-02-angulo.jpg` — o pipeline
  depende disso
- **Espaço de cor:** sRGB na entrega para web; manter o original em ProPhoto/AdobeRGB se houver

Pipeline no site: Sharp (item 16) → `next/image` em AVIF e WebP (item 15) → LQIP (item 18).

---

## 8. Checklist de "parece galeria, não template"

Antes de mostrar qualquer tela para a cliente:

- [ ] Existe pelo menos uma tela onde a obra ocupa mais de 70% da área visível
- [ ] Nenhuma tela tem mais de duas hierarquias tipográficas competindo
- [ ] O branco não é `#fff` e o preto não é `#000`
- [ ] A ficha técnica está diagramada como registro de museu, não como especificação de produto
- [ ] O preço não é o elemento mais destacado da página de obra
- [ ] Nenhuma palavra "comprar", "adicionar", "produto", "item" em lugar nenhum
- [ ] Com 3 obras, o portfólio parece completo — não parece esperando mais
- [ ] Screenshot em 390 / 768 / 1440 revisado, não só o desktop
- [ ] Sem JS, a página ainda mostra obra, ficha técnica e contato
