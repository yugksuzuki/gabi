# Modelo de dados, bilíngue e moeda

O conteúdo é o ativo do projeto. O site, o PDF para galerias e — mais adiante — a linha de
produtos saem todos daqui. Se o modelo nascer errado, tudo herda o erro.

Princípio: **uma fonte de verdade.** A apresentação prometeu à cliente que *"o PDF é gerado a
partir do mesmo conteúdo do site"* e que *"não existe versão antiga circulando por e-mail"*.
Isso só é verdade se site e PDF lerem o mesmo objeto.

---

## 1. Obra

```ts
type Idioma = 'pt' | 'en'
type Localizado<T> = Record<Idioma, T>

type Obra = {
  slug: string                    // 'desabrochar' — estável, nunca muda depois de publicado
  titulo: string                  // nome próprio da peça. NÃO traduzir
  ano: number
  tecnica: Localizado<string>     // PENDENTE — não inventar
  materiais: Localizado<string>   // PENDENTE
  dimensoes: {
    altura?: number
    largura?: number
    profundidade?: number
    diametro?: number
    unidade: 'cm' | 'mm' | 'm'
  }                               // PENDENTE
  edicao?: Localizado<string>     // 'peça única' | 'edição de 8' — define a raridade
  precoBRL: number | null         // fonte única. USD é derivado, nunca armazenado
  disponibilidade: 'disponivel' | 'reservada' | 'vendida' | 'acervo'
  legenda: Localizado<string>     // uma frase. É o que aparece no portfólio
  texto: Localizado<string>       // texto autoral da obra (MDX)
  imagens: Imagem[]
  video?: Video
  ordem: number                   // curadoria da sequência é decisão dela, não alfabética
  destaque: boolean
}

type Imagem = {
  src: string
  alt: Localizado<string>         // acessibilidade E SEO. Descreva a obra, não "foto de obra"
  largura: number
  altura: number
  papel: 'principal' | 'angulo' | 'detalhe' | 'escala'
  lqip?: string
}

type Video = {
  fonte: 'arquivo' | 'mux'
  src: string
  poster: string                  // obrigatório: é o que aparece antes e sem JS
  duracaoSegundos?: number
  legendas?: Localizado<string>   // WCAG — se houver fala
}
```

**Decisões embutidas, e por quê**

- **`titulo` não é localizado.** *Desabrochar* é o nome da peça, como *Guernica* é *Guernica*.
  Traduzir nome de obra é erro de catálogo. Se ela quiser uma tradução poética entre
  parênteses no inglês, isso é campo separado, opcional, e decisão dela.
- **`precoBRL` é a única fonte.** USD sempre derivado em runtime. Guardar os dois é garantir
  que um dia divergem.
- **`precoBRL: null` é estado válido.** Obra sem preço definido renderiza "Sob consulta" /
  "Price on request" — que é, aliás, mais elegante do que preço em galeria. O site precisa
  entrar no ar antes dos preços existirem.
- **`disponibilidade`** existe porque peça única vendida não sai do site — ela **prova
  repertório**. "Vendida" é sinal de mercado, não motivo de exclusão.
- **`ordem` é manual.** A sequência das três obras é curadoria.
- **`papel` na imagem** amarra a spec de fotografia (ver `02-direcao-visual.md` §7) ao layout:
  a `principal` vai para o portfólio, `detalhe` alimenta a galeria da página de obra.

**Validação (Zod, item 10 do Stack Técnico).** O documento promete: *"obra sem ficha técnica
completa não é publicada"*. Implemente como dois estados — `rascunho` aceita campos vazios;
`publicada` exige `tecnica`, `dimensoes`, `legenda`, pelo menos uma imagem `principal` e
`alt` nos dois idiomas. O build falha se uma obra publicada estiver incompleta.

---

## 2. Texto (área editorial)

```ts
type Texto = {
  slug: string
  titulo: Localizado<string>
  publicadoEm: string             // ISO
  estado: 'rascunho' | 'publicado'
  resumo: Localizado<string>      // usado em listagem, OG e no card de story
  corpo: Localizado<string>       // MDX (item 11)
  obrasRelacionadas?: string[]    // slugs — liga texto a obra nos dois sentidos
  imagemCapa?: Imagem
}
```

`estado: 'rascunho'` já nasce aqui porque é a fundação do Diário de Ateliê (fase 2) — a promessa
central é *"nada entra no ar sozinho"*. O estado existe desde a v1 mesmo sem automação nenhuma.

### O card de story — o que ela pediu

Trecho selecionado do texto → imagem no formato de story (1080×1920), com a tipografia do site
e o link. Gerado sob demanda a partir do próprio `corpo`, sem serviço externo:
rota de imagem dinâmica do Next (`ImageResponse`), mesma fonte, mesma paleta.

Custo baixo, entrega alta, e é **exatamente** o que ela descreveu em 30/07/26. Não confundir
com o Diário de Ateliê, que é o caminho inverso.

---

## 3. Extensibilidade — a promessa da linha de produtos

A apresentação diz: *"quando a linha estiver pronta, ela ocupa um espaço que já existe. Sem
refazer o site."* E o Stack Técnico: *"é o que permite entrar meio de pagamento e a linha de
produtos mais adiante sem refazer nada."*

Para isso ser verdade e não marketing, `Obra` e um futuro `Produto` precisam compartilhar a
base desde agora:

```ts
type Peca = {                     // base comum
  slug, titulo, ano, imagens, video?,
  legenda, texto, ordem, destaque
}

type Obra    = Peca & { tecnica, materiais, dimensoes, edicao?, precoBRL, disponibilidade }
type Produto = Peca & { precoBRL, estoque?, variantes?, recorrente?: boolean }
```

`recorrente` existe por causa da **linha Ramy**: ela mencionou uma peça-escultura que acompanha
**vela em pó** com aroma criado por ela — *"a peça é escultura, mas a vela eventualmente vai
acabar"*. Consumível é recompra, e recompra é a única razão pela qual uma loja faria sentido
neste site.

**Sem implementar `Produto` agora.** Só não feche a porta.

Lembrete: ela **recusou** a loja em janela externa. Se um dia existir, é dentro do site.

---

## 4. Estratégia bilíngue

**Rotas explícitas nos dois idiomas** (next-intl, item 04):

```
/pt                    /en
/pt/obras/[slug]       /en/works/[slug]
/pt/sobre              /en/about
/pt/textos             /en/writing
/pt/textos/[slug]      /en/writing/[slug]
/pt/contato            /en/contact
```

- `/` redireciona por `Accept-Language`, com `pt` como padrão. O redirect nunca é canônico
- **Slug da obra é o mesmo nos dois idiomas** (`desabrochar`), porque o nome da peça não traduz.
  Só o segmento de seção muda (`obras` / `works`)
- `hreflang` recíproco em todas as páginas + `x-default` apontando para PT (item 06)
- `<link rel="canonical">` por idioma (item 25)
- A troca de idioma **mantém a página**: quem está em `/pt/obras/instante` vai para
  `/en/works/instante`, não para a home. Isso quebra em quase todo site bilíngue e é
  perceptível — teste automatizado do Playwright (item 37)
- `<html lang>` correto em cada rota

**Conteúdo faltando em um idioma.** Se o texto em inglês não existir, a decisão é da cliente,
não do código: ou some a seção, ou aparece o PT com marca explícita de idioma
(`<span lang="pt">`). Não traduza automaticamente texto autoral de artista — é a voz dela.

---

## 5. Moeda

```
precoBRL (fonte)
   └─> PT: R$ 12.500          Intl.NumberFormat('pt-BR')      (item 05)
   └─> EN: approx. US$ 2,300  Intl.NumberFormat('en-US')      cotação PTAX (item 07)
```

- Cotação do **PTAX do Banco Central** — pública e auditável
- Revalidação por ISR (item 08), uma vez por dia é suficiente. Cotação de arte não é câmbio
  de day trade
- **Sempre marcado como aproximado** no inglês: *"approx."*. O valor é informativo; a
  proposta é clara que frete internacional, seguro e imposto são caso a caso
- **Fallback obrigatório:** se a API do BC falhar, exiba só o BRL. Nunca mostre cotação velha
  sem aviso, nunca quebre a página. Cachear a última cotação boa com carimbo de data
- `precoBRL: null` → "Sob consulta" / "Price on request"

---

## 6. Botão Consultar

```
https://wa.me/<E164_SEM_MAIS>?text=<mensagem codificada>
```

Mensagem pré-preenchida, por idioma:

- **PT** — `Olá, Gabriela. Vim pelo site e gostaria de saber mais sobre a obra «Desabrochar».`
- **EN** — `Hello, Gabriela. I came through your website and would like to know more about "Desabrochar".`

**O número não está confirmado.** O informado (`+55 44 9992-9186`) tem 8 dígitos onde celular
brasileiro tem 9, e o DDD não bate com a cidade. Ver `06-inventario-de-ativos.md` §4. Portanto:

- Número em variável de ambiente, nunca no código
- **Fallback digno:** sem número configurado, o botão vira `mailto:` para
  `gseleme.design@gmail.com` com assunto e corpo equivalentes. O site entra no ar sem o
  WhatsApp e ninguém percebe falta
- Nada de `+` no `wa.me` — só dígitos
- `rel="noopener"` e evento de analytics no clique: saber qual obra gera consulta é o dado
  mais valioso que este site produz

---

## 7. Dados estruturados

- `schema.org/VisualArtwork` por obra (item 21): `name`, `creator`, `dateCreated`,
  `artMedium`, `artform`, `width`, `height`, `image`, `inLanguage`. `offers` **só se** houver
  preço público e disponibilidade — e mesmo assim, sem sinalizar checkout
- `schema.org/Person` para a Gabriela (item 22), com `sameAs` para o Instagram — é o que
  habilita painel de conhecimento
- `BreadcrumbList` nas páginas de obra
- Open Graph e Twitter Cards por página (item 24), com imagem própria por obra. O link é
  compartilhado no Instagram e no WhatsApp — é ali que o card é visto

---

## 8. Onde o conteúdo mora

**Decisão a tomar no início da implementação, não depois.**

O Stack Técnico promete Sanity (item 09) com o argumento *"você publica sozinha"* — e isso foi
vendido em duas páginas do material. É promessa feita, não sugestão.

Mas há um caminho que honra a promessa sem bloquear a estreia: começar com **conteúdo em
arquivo versionado** (MDX + frontmatter validado por Zod), com o mesmo schema acima, e plugar
o painel quando o fluxo estabilizar. Como o modelo é o mesmo, a migração é de origem de dados,
não de arquitetura.

Critério objetivo para decidir: **se a Gabriela vai cadastrar obra sozinha antes da estreia,
o painel entra agora. Se quem cadastra é você até a estreia, o painel entra depois.**

O que **não** pode acontecer é o conteúdo nascer solto em componente React. Aí não há migração
possível — há reescrita.
