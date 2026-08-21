# Gabriela Seleme — Leitura de contexto (etapa 1)

Documento de compreensão, não de execução. Consolidado a partir do pacote Manus
(conversa de WhatsApp sanitizada com 95 áudios transcritos, briefing, apresentação v2 e proposta v2)
e das instruções de condução do projeto.

Status: **absorvendo contexto**. Nenhuma decisão de código tomada. Aguardando "OK".

---

## 1. O que chegou — e o que não chegou

O pacote recebido contém **8 arquivos de texto**. O `LEIA_PRIMEIRO.md` descreve um pacote
muito maior (348 mensagens, 128 anexos, 95 áudios, 11 imagens, 17 stickers, 4 PDFs, 1 VCF)
organizado em pastas numeradas. Essas pastas **não vieram**.

| Descrito no LEIA_PRIMEIRO | Chegou? | Nome real do arquivo recebido |
|---|---|---|
| `PROMPT_PRONTO_PARA_CLAUDE.md` | sim | `gabriela_prompt_claude.md` |
| `00_BRIEF_PARA_CLAUDE.md` | sim | `gabriela_brief_site.md` |
| `01_conversa/conversa_com_transcricoes_sanitizada.md` | sim | `gabriela_conversa_sanitizada_com_transcricoes.md` |
| `04_documentos_pdf/texto_extraido/*.txt` | parcial | `apresentacao_v2_texto.txt`, `proposta_v2_texto.txt` |
| `04_documentos_pdf/*.pdf` (4 PDFs) | **sim — recebidos depois** | `Apresentacao_PB`, `Apresentacao_v2`, `Proposta_v2`, `Stack_Tecnico` |
| `03_imagens/` (11 JPG) | **não** | — |
| `02_audio_originais/`, `07_transcricoes/` | **não** (transcrições já embutidas na conversa) | — |
| `09_previews/contact_sheet_imagens.jpg` | **não** | — |
| `08_metadados/*.tsv` | sim | `inventario_anexos.tsv`, `mapa_mensagens_anexos.tsv` |

**Atualização:** os 4 PDFs chegaram em envio posterior e foram lidos por completo — incluindo
o **Stack Técnico** (39 ferramentas, com justificativa item a item) e a **Apresentação PB**
(versão de julho, anterior à v2).

**Consequência prática:** entendo o projeto por inteiro, mas **não vi nenhuma imagem de obra**.
Zero ativo visual disponível. Os 11 JPGs do export, segundo o próprio pacote, não são as
fotografias das obras — são material contextual, pessoal e capturas de tela.

### 1.1 O que os dois PDFs novos acrescentaram

**Papéis definidos** (Apresentação PB, p.6): **Catherine — direção e acompanhamento**
(alinhamento, revisão do que sobe, canal aberto). **Guilherme — construção e estratégia**
(site, estrutura bilíngue, performance, busca, estratégia de lançamento).

**Ordem de lançamento declarada ao cliente** (PB, p.5): *primeiro* site e Instagram no ar
juntos; *junto* o portfólio em PDF para galerias; *depois* a linha de produtos ocupa um espaço
que já existe, sem refazer o site. Ou seja: **a linha de produtos já foi prometida como
extensão da mesma estrutura** — o modelo de dados precisa nascer preparado para isso.

**Divergência entre as duas versões da apresentação:** na PB (julho) o site tem **quatro
seções** e o Contato está ligado "ao seu e-mail e ao Instagram" — não há botão Consultar,
não há preço, não há WhatsApp. A v2 (agosto) é que introduz a página de obra com preço
BRL/USD e o botão Consultar → WhatsApp. A v2 é a versão vigente; a PB explica de onde veio
a estrutura de quatro abas.

**Argumentos vendidos ao cliente que viram requisito** (Stack Técnico, "O que isso permite"):
publicar obra nova sozinha sem depender de ninguém; PDF que nunca desatualiza porque sai do
mesmo conteúdo; código versionado e aberto, sem plataforma proprietária, "é o que permite
entrar meio de pagamento e a linha de produtos mais adiante sem refazer nada"; rápido em
Balneário e em Nova York. Isso amarra três decisões de arquitetura: **CMS de verdade**,
**fonte única de conteúdo para site e PDF**, e **modelo extensível para produto**.

---

## 2. Quem é a cliente — e a frase que precisa mudar o site

Esta é a parte mais importante do material e ela está enterrada em três áudios de 29/07/26.

Guilherme e Catherine apresentaram o projeto a ela dizendo que "mudou o nicho, agora vai
lançar como artista". Ela **discordou, explicitamente**:

> "Só não tô achando que mudou o nicho, não. Desde o começo era criar peças autorais e é nós."
> "Acima de tudo, somos uma marca de design."

E, no áudio seguinte, o ponto decisivo:

> "Eu me vejo como artista, minha essência. Mas eu acho que se chamar de artista não é um
> negócio que você pode fazer por você mesmo. Primeiro o mundo te reconhece como artista e aí
> você se torna artista. Não é um negócio que você se autointitula."
> "Mas já que a dona Celeste resolveu me chamar de artista, é por isso que eu tô querendo
> aproveitar esse gancho pra botar tudo isso no ar e começar a expor."

**O que isso significa para o site:** ela tem desconforto declarado com o auto-rótulo. Um
hero escrito *"Gabriela Seleme — Artista Plástica"* trabalha contra o que ela sentiu por dois
anos. O site deve deixar a obra fazer a declaração: nome, obra em escala, silêncio. O título
vem do texto de terceiros (curadoria, imprensa, "dona Celeste"), citado — nunca de uma
autodescrição em caixa alta na home.

Isso, felizmente, coincide com a referência: Kelly Wearstler **não anuncia um título**. Ela mostra.

**Pendência de identidade:** existem duas camadas nomeadas no material e elas nunca foram
reconciliadas — *Gabriela Seleme* (a autora) e *GCLM* (a marca de design, ex-"Umbra"). Ver §6.

---

## 3. Requisito confirmado × proposta do fornecedor × hipótese técnica

A distinção mais útil aqui é **quem falou**. Separei pelo que saiu da boca dela.

### 3.1 Confirmado por Gabriela, na voz dela

| Requisito | Onde |
|---|---|
| Portfólio como aba principal; clicar na peça abre detalhes, imagens e vídeo dela | mensagem escrita 24/07/26 |
| Aba "quem sou eu" | mensagem escrita 24/07/26 |
| Uma aba para ela postar os textos dela | mensagem escrita 24/07/26 |
| Português e inglês, com conversor de preço BRL → USD | mensagem escrita 24/07/26 |
| Kelly Wearstler como referência base | mensagem escrita 24/07/26 |
| Preço visível na peça; contato direciona para atendimento no **WhatsApp Business** | áudio 30/07/26 11:13 |
| Sem pagamento dentro do site | áudio 30/07/26 11:13 + 10/07 |
| Site e Instagram no ar **no mesmo dia** | áudio 29/07/26 12:55 |
| Existe um **vídeo de fundo**, dentro da pasta "fotos que podem ser usadas" | áudio 04/08/26 19:03 |
| Loja **dentro** do site, não fora — se e quando existir | áudio 07/08/26 14:18 |
| Encontrar "o limiar da praticidade e da experiência imersiva" | áudio 03/09/24 |
| Ela quer uma cor que seja dela (referência "Vovê Clicou") | áudio 03/09/24 |

### 3.2 Proposto pelo fornecedor, ela não confirmou nem recusou

- Portfólio em PDF gerado do site
- Widgets de Instagram/Facebook
- Diário de Ateliê (fase 2)
- Newsletter quinzenal
- Tráfego pago
- Dados estruturados / SEO técnico / treinamento

Ela leu a proposta v2 em 04/08/26, fez duas video calls (20 min + 18 min) no mesmo dia e disse
"tamo junto". **A conversa não contém uma escolha explícita entre Caminho A e Caminho B.**
Isso é um risco de escopo, não um detalhe. Ver §7.

### 3.3 Hipótese técnica (lista do documento de stack, não é ordem de serviço)

Next.js App Router, TypeScript, React, next-intl, Intl.NumberFormat, conversão PTAX, Sanity, Zod,
MDX, Tailwind, design tokens, next/font, next/image, Sharp, Mux, LQIP/Blurhash, Framer Motion,
Lenis, JSON-LD (VisualArtwork, Person), @react-pdf/renderer, deep link WhatsApp, Resend, GA4,
Search Console, Speed Insights, Vercel, GitHub Actions, Cloudflare DNS, ESLint, Prettier,
Playwright, Lighthouse CI, axe-core / WCAG 2.1 AA.

O documento original (`Gabriela_Seleme_Stack_Tecnico.pdf`) lista **39 ferramentas** em 11
grupos, cada uma com uma linha de justificativa em linguagem de cliente. Ele foi **entregue à
Gabriela** — ou seja, não é rascunho interno, é promessa feita.

Isso muda a leitura: não dá para simplesmente cortar metade da lista. Dá para **sequenciar**.
Duas observações honestas sobre itens específicos:

- **Mux (17)** — streaming adaptativo faz sentido para vídeo longo de obra. Para um vídeo de
  fundo de home, é custo recorrente onde `next/image` + MP4 otimizado resolveria. Vale
  decidir por caso de uso, não por default.
- **Sanity (09)** — o argumento vendido ("você publica sozinha") é legítimo e foi prometido
  em duas páginas do material. Mas para três obras, um CMS pode ser adiado sem quebrar a
  promessa **se** o conteúdo já nascer em formato estruturado e versionado. A decisão real é
  *quando* o painel entra, não *se* entra.

O briefing pede para avaliar o que é necessário na v1. Minha leitura: a v1 precisa entregar
o que foi prometido em **experiência** (bilíngue, preço convertido, obra em página própria,
consultar, PDF, velocidade, acessibilidade) e pode sequenciar o que é **operação**
(painel de publicação, analytics avançado, testes automatizados) sem que a cliente perceba
falta. O plano de execução vai explicitar essa ordem, item a item, contra a lista de 39.

---

## 4. Referências: o que ela realmente elogiou

As duas oficiais são conhecidas. O material contém mais três que não estão no briefing.

**Kelly Wearstler — principal.** O que ela destacou especificamente não foi "o site é bonito",
foi a **entrada**: um vídeo, com imagens dela montando uma mesa, apresentando a coleção.
"Acho que tinha que pensar em fazer alguma coisa nesse sentido." Isso conecta diretamente com
o vídeo de fundo que ela já separou.

**William Guillon — secundária.** Minimalismo, apresentação de objetos. Enviada em 07/08/26.
Guilherme respondeu "minimalismo é mesmo nossa cara".

**Zara Home** — mencionada em 11/09/24 como "um site que eu achei muito legal", com promessa de
enviar o link. **Nunca enviou.** Lacuna recuperável com uma pergunta.

**"Vovê Clicou"** — enviada como referência de *apropriação de cor*: "tem o amarelo da Vovê
Clicou, aquele negócio que você vê, cê sabe que é Vovê Clicou". Não é referência de layout —
é um requisito de sistema de design disfarçado de referência: **ela quer uma cor assinatura.**

**Bugatti** — enviada como referência de *estímulo sonoro*, com ressalva imediata e severa:
"é um site que trava muito, acaba complicando pra pessoa usar". Ou seja: ela trouxe a ideia
de som **e** trouxe o contra-exemplo do que não quer. Regra de movimento do projeto, na
palavra dela: *o limiar entre praticidade e experiência imersiva.*

**Apresentação no Canva** (link no material, requer acesso) — ela diz ter escrito ali "a
essência das coisas, de forma enxuta" e reunido as referências. **É o documento mais valioso
que ainda não temos.** Fotos ali dentro são peças dela, "menos aquele drink".

---

## 5. Arquitetura de informação

Consenso entre o que ela pediu e o que a proposta formalizou. Sem divergência.

```
/                    Portfólio — porta de entrada. Grade de obras: imagem grande, título, ano.
/obra/[slug]         Página da peça: galeria, vídeo, ficha técnica, texto autoral,
                     preço BRL/USD, botão "Consultar" → WhatsApp com o nome da obra.
/sobre               "Quem sou eu" — história como parte da obra, não currículo.
/textos              Área editorial da artista.
/textos/[slug]       Texto individual.
/contato             Compra, exposição, convite, galeria, imprensa.
```

Sequência de navegação, na formulação dos documentos:
**Portfólio → Obra → Detalhe → Consultar.**

Sem carrinho, sem checkout, sem "comprar". Duplicado em PT e EN, com o valor acompanhando
o idioma.

**Obras iniciais:** Desabrochar, Instante, Encontro.

**Nota de verificação:** na mensagem de 24/07/26, os links do Google Photos de *Desabrochar*
e de *Instante* são **idênticos** (`.../v8pQarVuts149PkQA`). Ou o álbum contém as duas obras,
ou um link foi colado duas vezes. Precisa ser conferido antes de qualquer organização de ativos.

---

## 6. Identidade e domínio — o nó não resolvido

Cronologia extraída da conversa:

1. A marca se chamaria **Umbra**. Toda a direção visual foi pensada sob esse nome (2024).
2. 02/12/24 — "deu um monte de problema e eu acabei tendo que mudar pra **GCLM**". Empresa
   contratada, nome disponível, registro pendente **da logo**.
3. Ela comprou o domínio **gclm.com.br**. "A gente vai manter a mesma coisa de parte visual,
   só vai trocar a logo pela **minha rubrica**."
4. 24/07/26 — os contatos que ela passa para o site são **@gseleme.design** e
   **gseleme.design@gmail.com**.
5. 30/07/26 — Guilherme: "o domínio tu já tem, aqueles 40 pila por ano". A proposta v2 registra
   "Domínio ~R$40/ano — já contratado por você".

Ninguém amarrou as pontas. Perguntas que precisam de resposta da cliente antes do deploy:

- O site vai no ar em **gclm.com.br**, em um domínio com o nome dela, ou em outro?
- **GCLM aparece no site v1?** Se sim, como — assinatura de rodapé, marca da linha de produtos,
  nada?
- A logo é a **rubrica** dela. Ela existe? Em vetor? Quem entrega — Catherine?

Isso não é burocracia: define URL canônica, hreflang, Open Graph, e-mail de contato, favicon e
o nome que o Google vai indexar. Errar aqui custa mais depois.

---

## 7. Riscos

**O projeto já morreu duas vezes esperando material.** Set/2024: parou aguardando a identidade
visual. Fev/2025: parou de novo. Julho/2026: retomou. O padrão é sempre o mesmo — a base do
site fica "praticamente pronta" e o projeto trava esperando ativo que não chega.
→ **Recomendação estrutural: o site precisa nascer funcionando com placeholders dignos.**
Se a arquitetura só fizer sentido com as fotos finais, ele para pela terceira vez.

**A fotografia decide o resultado, não o código.** O site da Kelly Wearstler funciona porque
a fotografia é excepcional e consistente. Três obras fotografadas com fundos, luzes e
enquadramentos diferentes destroem qualquer grade editorial. Precisamos de uma **spec de
fotografia** (fundo, proporção, distância focal, lista de tomadas por obra) **antes** da
sessão, não depois. Isso é barato agora e caro depois.

**Galeria vazia.** Um site de galeria com três obras precisa ser desenhado *para três obras* e
parecer deliberado nesse número. Uma grade dimensionada para vinte peças com três dentro
parece um template inacabado — o oposto exato do posicionamento.

**Movimento e travamento.** Ela mesma trouxe o contra-exemplo. Scroll suave e transições
precisam de orçamento de performance definido antes de escolher biblioteca.

**Escopo.** Loja, linha Ramy, Diário de Ateliê, PDF, widgets e tráfego pago estão todos
circulando. A v1 é o site. Cada item extra empurra a estreia.

**Comercial não fechado.** Não há registro de escolha entre Caminho A e Caminho B.
Widgets, automação e tráfego pertencem a um contrato que a conversa não mostra assinado.
Construir isso agora é trabalhar de graça ou entregar o que não foi contratado.

**Diário de Ateliê — viabilidade técnica real.** A proposta descreve ler *stories*
automaticamente. Stories só são acessíveis via API para a conta que você mesmo administra,
com Instagram Business, permissões específicas e revisão do app pela Meta. Não é "programar
um robozinho". É um projeto próprio, com aprovação de terceiro no caminho crítico. Vender
prazo sobre isso é arriscado.

**Direito autoral da referência.** Atmosfera, hierarquia e ritmo são livres. Texto, imagem,
código, logo e tipografia licenciada não são. Kelly Wearstler usa fontes proprietárias — a
escolha tipográfica precisa ser própria, com licença verificada para web.

---

## 8. O que ela pediu e a proposta não respondeu

30/07/26, mensagem escrita dela:

> "Na aba de texto, seria legal alguma forma fácil de compartilhar parte do texto no insta que
> direcionasse de um jeito bonito p site. (...) Sabe aqueles posts de texto? Algo daquele tipo
> pros stories que jogasse diretamente na página do site."

Isso é **site → Instagram**: pegar um trecho do texto e gerar um card bonito para story, com
link para a página.

O Diário de Ateliê responde o caminho **inverso** — Instagram → site. É outro problema, muito
mais caro, com dependência de aprovação da Meta.

O que ela pediu é barato, cabe na v1, e é geração de imagem a partir do próprio conteúdo do
site. Vale separar as duas coisas explicitamente na conversa com ela, porque hoje estão
misturadas sob o rótulo "automação".

---

## 9. Inventário de conteúdo: o que existe e o que falta

### Bloqueia a estreia

| Item | Situação |
|---|---|
| Fotografias das obras | Links do Google Photos citados; **acesso não concedido**; nenhum arquivo em mãos |
| Vídeo de fundo (home) | Existe, dentro da pasta "fotos que podem ser usadas" — não recebido |
| Vídeos do filmmaker | Existem; estavam sendo organizados em pastas por Catherine — não recebidos |
| Ficha técnica das 3 obras (nome, ano, técnica, dimensão) | **Nenhum dado.** Só os títulos |
| Preços em BRL | **Não informados** |
| Texto de cada obra | **Não existem** |
| Texto "Quem sou eu" / bio | **Não existe** |
| 1–2 textos para a área editorial | **Não existem** |
| Número de WhatsApp Business | Ela disse que ia comprar. Conhecido apenas o prefixo `+5547` |
| Domínio definitivo | Indefinido (ver §6) |
| Logo / rubrica | Pendente. Registro da marca parado por causa dela |
| Data-alvo de estreia | Nunca travada |

### Não bloqueia, mas melhora muito

- Acesso à apresentação do Canva (a essência escrita por ela)
- O link da Zara Home que ela nunca mandou
- Definição da cor assinatura
- Exposições, prêmios, formação, quem é "dona Celeste" (curadoria? galerista? a citação que
  destrava o posicionamento)
- Decisão sobre GCLM / linha Ramy aparecerem ou não na v1

### Forma objetiva de coletar

Um único documento para ela preencher, em vez de perguntas soltas por WhatsApp:

1. **Ficha por obra** — uma tabela de 3 linhas: título, ano, técnica, dimensões (A × L × P cm),
   materiais, preço BRL, uma frase-legenda, um parágrafo de texto. Se ela preferir falar,
   grava-se um áudio por obra e a redação é feita a partir dele — é o formato em que ela já
   se comunica melhor.
2. **Acesso aos álbuns** — compartilhamento dos três links do Google Photos, mais a confirmação
   sobre o link duplicado de Desabrochar/Instante.
3. **Bio** — três perguntas, não um formulário: como começou, o que a obra procura, o que ela
   quer que a pessoa sinta ao sair do site.
4. **Decisões binárias** — domínio, GCLM sim/não, número do WhatsApp, data de estreia.

---

## 10. Informação comercial — não vai para o site

Confidencial, apenas contexto interno: valores de serviço (site, automação, tráfego, assessoria),
comparativo Caminho A × Caminho B, taxas de parcelamento, custos operacionais, dados bancários,
links de pagamento, negociação de 2024. Nada disso aparece em página, metadado, PDF de portfólio
ou repositório público.

Também fora do site: assuntos pessoais presentes na conversa (contatos de terceiros, eventos
não relacionados, questões familiares e pessoais de ambos os lados).

---

## 11. Onde estamos

Contexto absorvido. Aguardando o restante dos materiais.

Quando vier o **OK**, entrego o plano de execução: arquitetura de informação, direção visual,
sistema de design, modelo de dados de obras e textos, estratégia bilíngue, plano de conteúdo,
stack recomendada com justificativa item a item, estrutura de pastas, etapas de implementação,
validação visual, acessibilidade, SEO, publicação na Vercel e checklist de aprovação da cliente.
