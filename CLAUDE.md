# Gabriela Seleme — site

Memória de projeto. Leia antes de escrever qualquer linha de código.
Contexto completo em `docs/00-leitura-de-contexto.md`.

---

## O que este projeto é

A presença digital de **Gabriela Seleme**, autora de peças de design/escultura, em Balneário
Camboriú (SC). Público: compradores, colecionadores, galerias, curadores, arquitetos,
designers de interiores e imprensa — no Brasil e fora.

**Não é** uma loja, um portfólio genérico ou um template bonito. A referência de resultado é
uma **galeria ou publicação de arte contemporânea**.

Time: **Guilherme** (construção e estratégia) e **Catherine** (direção, acompanhamento e
identidade visual). A cliente fala com os dois.

---

## As cinco regras invioláveis

**1. O site não chama a Gabriela de artista na primeira pessoa.**
Ela disse, textualmente: *"ser artista é uma coisa que primeiro o mundo te reconhece e aí você
se torna artista. Não é um negócio que você se autointitula."* Nada de hero com
"Gabriela Seleme — Artista Plástica". O título, quando aparecer, vem citado de terceiro
(curadoria, imprensa) ou não aparece. A obra declara.

**2. Não invente conteúdo.** Nunca gere biografia, ficha técnica, ano, técnica, dimensão,
preço, texto de obra ou release. Não existe "texto placeholder plausível" neste projeto —
placeholder é visivelmente placeholder (`[PENDENTE: técnica]`), nunca ficção que possa vazar
para produção. Ver `docs/04-pendencias-e-coleta.md`.

**3. Sem carrinho, sem checkout, sem "comprar".** O caminho é
**Portfólio → Obra → Detalhe → Consultar**, e Consultar abre o WhatsApp com o nome da obra na
mensagem. Peça única se negocia por conversa. Um botão de compra puxa o posicionamento para
loja e destrói o projeto inteiro.

**4. O limiar entre praticidade e experiência imersiva.**
Frase da cliente. Ela mandou o site da Bugatti como referência de estímulo sonoro e já veio com
a crítica junto: *"trava muito, acaba complicando pra pessoa usar."* Movimento é bem-vindo;
movimento que custa performance, não. Orçamento em `docs/02-direcao-visual.md` — e ele é
condição de merge, não sugestão.

**5. Referência é atmosfera, nunca cópia.** Kelly Wearstler e William Guillon entram como
hierarquia, escala, ritmo e silêncio. Nunca como texto, imagem, código, logotipo ou tipografia
licenciada de terceiro. Toda fonte usada precisa de licença web verificada e registrada em
`docs/02-direcao-visual.md`.

---

## Decisões travadas (confirmadas pela cliente, na voz dela)

- Portfólio é a página principal; cada obra abre em página própria com imagens, vídeo, ficha
  técnica e texto
- Abas: **Portfólio · Quem sou eu · Textos · Contato**
- Bilíngue **PT/EN**, troca visível em qualquer página
- Preço armazenado em **BRL**, exibido convertido em **USD** no inglês (informativo)
- Contato direciona para **WhatsApp Business**
- Sem pagamento dentro do site
- **Site e Instagram entram no ar no mesmo dia**
- Existe um **vídeo de fundo** para a home, já separado por ela
- Se houver loja algum dia, ela é **dentro** do site — ela recusou a ideia de janela externa
  (Nuvemshop): *"não me parece tão interessante ter essa janela fora do site"*
- Ela quer uma **cor assinatura** (referência: "o amarelo da Vovê Clicou")

## Obras iniciais

**Desabrochar · Instante · Encontro.** Três. O layout precisa parecer deliberado em três —
não uma grade de vinte com dezessete buracos.

**Estado real do acervo** (levantado no Drive — ver `docs/06-inventario-de-ativos.md`):

| Obra | Fotos | Ficha | Texto | Preço |
|---|---|---|---|---|
| Encontro | 5 | completa | completo | R$ 11.230 |
| Desabrochar | **0** (só vídeo) | — | — | R$ 8.350 |
| Instante | **0** | — | — | — |

Só **uma** das três obras está pronta. Construa para três, publique com o que existir.

## As obras são monocromáticas

Gesso e massa acrílica sobre tela: relevo em branco osso, cinza, grafite e escorrido de prata.
A amostragem das fotos dá `#c7c6c2 · #cbcac6 · #c5c4bf` — neutro do começo ao fim.

**Não existe cor a extrair das obras.** A paleta do site é a paleta do trabalho: branco osso,
cinza quente, grafite. O pedido dela de "uma cor que seja minha" precisa de outra resposta —
a assinatura dela é a **rubrica + a textura + o P&B do ateliê**, não um acento cromático.
Conversa a ter com ela; não decida sozinho.

## Conteúdo que já existe no repositório

`content/sobre.mdx` — a bio **escrita por ela**, transcrita literal. Não reescreva.
`content/obras/encontro.mdx` — ficha e texto reais, transcritos da prancha dela.
`content/contato.yml` — e-mail, Instagram e o WhatsApp **com ressalva** (leia antes de usar).
`ativos/rubrica-gseleme.png` — a rubrica. Raster; precisa virar SVG a partir do original.

---

## Em aberto — não decida sozinho

| Questão | Por que trava |
|---|---|
| **Domínio** | Ela comprou `gclm.com.br` (dez/2024). Os contatos são `@gseleme.design`. Ninguém amarrou. Define URL canônica, hreflang, OG, e-mail |
| **GCLM aparece na v1?** | GCLM é a marca de design (ex-"Umbra"); Gabriela Seleme é a autora. Duas camadas nunca reconciliadas |
| **Logo** | A rubrica **existe** (`ativos/rubrica-gseleme.png`), mas em raster. Falta o vetor — peça o original à Catherine |
| **Número do WhatsApp** | Informado `+55 44 9992-9186` — 8 dígitos onde celular tem 9. Provável: `+55 44 99992-9186` → `5544999929186`. Teste abrindo `wa.me/5544999929186` no celular. Ver `content/contato.yml` |
| **Cor assinatura** | As obras são monocromáticas — não há cor a extrair. Precisa de outra resposta ao pedido dela |
| **Data de estreia** | Nunca travada. O cronograma é desenhado de trás para frente a partir dela |
| **Caminho A ou B** | A conversa não registra escolha entre contratação avulsa e assessoria. **Não construa widgets, automação ou tráfego** antes disso estar claro |

---

## Fora do escopo da v1

Loja/e-commerce · linha de produtos **Ramy** (peça com vela em pó recarregável) · Diário de
Ateliê · newsletter · tráfego pago · widgets de Instagram/Facebook.

Mas: a apresentação prometeu à cliente que *"a linha de produtos ocupa um espaço que já existe,
sem refazer o site"*. **O modelo de dados nasce extensível.** Ver `docs/03-modelo-de-dados.md`.

### O pedido dela que a proposta não respondeu

30/07/26, escrito por ela: quer compartilhar **um trecho de texto do site para o story**, de
forma bonita, com link de volta. Isso é **site → Instagram**: gerar um card a partir do próprio
conteúdo. É barato e cabe na v1.

O "Diário de Ateliê" é o caminho **inverso** (Instagram → site), depende de app aprovado pela
Meta para ler stories, e é outro projeto. Não confunda os dois — hoje estão misturados sob o
rótulo "automação".

---

## Nunca no site, nem no repositório

Valores de serviço, comparativo Caminho A × B, taxas, custos operacionais, dados bancários,
links de pagamento, a negociação de 2024. Assuntos pessoais da conversa. Nada disso em página,
metadado, PDF, commit ou README público.

> As quatro faixas de valor estavam escritas aqui no handoff. Foram removidas na primeira
> versão comitada: **este repositório é público** e a regra vale para a própria regra.
> Os números seguem na proposta original, em `materiais/` (fora do git).

O repositório **é público** (`yugksuzuki/gabi`, verificado em 21/08/2026). `materiais/` está no
`.gitignore` desde o primeiro commit e continua só na máquina de quem clonou o handoff.
Não versione nada de lá — nem citando, nem resumindo.

---

## Como trabalhar neste projeto

- **Placeholders dignos desde o dia um.** O projeto já parou duas vezes (set/2024, fev/2025)
  esperando ativo que não chegou. Se a arquitetura só fizer sentido com as fotos finais, ele
  para pela terceira vez. Tudo precisa renderizar bem vazio.
- **A fotografia decide o resultado, não o código.** Três obras com fundos e luzes diferentes
  destroem qualquer grade editorial. A spec de fotografia sai antes da sessão.
- **Valide olhando.** Screenshot em 390px, 768px e 1440px a cada etapa visual. Um site desta
  categoria não se verifica lendo diff.
- **Toda dependência nova justifica a própria existência** em uma linha no PR. A lista de 39
  ferramentas do Stack Técnico é referência de arquitetura, não ordem de compra —
  o sequenciamento está em `docs/01-plano-de-execucao.md`.

## Documentos

| Arquivo | Conteúdo |
|---|---|
| `docs/00-leitura-de-contexto.md` | O que o material diz, com citações e riscos |
| `docs/01-plano-de-execucao.md` | Arquitetura, stack sequenciada, etapas, SEO, deploy |
| `docs/02-direcao-visual.md` | Tipografia, cor, escala, grid, movimento, performance |
| `docs/03-modelo-de-dados.md` | Schema de obras e textos, i18n, moeda, WhatsApp |
| `docs/04-pendencias-e-coleta.md` | O que falta e como pedir |
| `docs/05-formulario-gabriela.md` | Documento para enviar à cliente |
| `docs/06-inventario-de-ativos.md` | O que existe de verdade no Drive, obra por obra |
| `content/` | Bio, ficha e texto de Encontro, contato — conteúdo real, já transcrito |
| `ativos/` | Rubrica, folha da bio, ficha de Encontro, 2 fotos da obra |
| `materiais/` | Conversa transcrita, PDFs originais, inventários |
