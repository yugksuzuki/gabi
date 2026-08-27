# Pendências — o que falta e como coletar

Resposta direta à pergunta "falta ainda material?": **sim, e o que falta é quase todo o
conteúdo.** O que já temos é o entendimento; o que falta é o acervo.

Separado por origem, porque a forma de resolver é diferente.

> **Este documento foi escrito antes do acesso ao Drive.** O quadro atualizado, obra por obra,
> está em `06-inventario-de-ativos.md` — em caso de divergência, o 06 é o vigente.

---

## A. Falta do pacote Manus (com você)

Baixa prioridade — nada disso é obra.

| Item | Situação |
|---|---|
| `03_imagens/` — 11 JPGs da conversa | Não recebidos. O próprio pacote diz que **não são as obras**: são material contextual, pessoal e capturas de tela |
| `09_previews/contact_sheet_imagens.jpg` | Não recebida |
| `05_stickers/` (17 WEBP) | Irrelevante |
| `02_audio_originais/` (95 OPUS) | Desnecessário — as transcrições estão embutidas na conversa |
| `06_contatos/` (1 VCF) | Contato de terceiro. Manter privado |

Vale mandar só a **contact sheet**, para conferir se há alguma foto de peça perdida ali.
Fora isso, o lado do pacote está resolvido: conversa completa, 4 PDFs e inventários, tudo lido.

---

## B. Falta da cliente — bloqueia a estreia

Isto é o caminho crítico do projeto inteiro.

| # | Item | Situação | Bloqueia |
|---|---|---|---|
| 1 | **Fotografias das três obras** | Links do Google Photos citados; **acesso não concedido** | Tudo |
| 2 | **Vídeo de entrada da home** | Existe, na pasta "fotos que podem ser usadas" | Home |
| 3 | **Vídeos do filmmaker** | Existem; estavam sendo organizados pela Catherine | Página de obra |
| 4 | **Ficha técnica das 3 obras** | **Nenhum dado.** Só os títulos | Página de obra, JSON-LD, PDF |
| 5 | **Preços em BRL** | Não informados | Preço e conversão |
| 6 | **Texto de cada obra** | Não existem | Página de obra |
| 7 | **Bio / "Quem sou eu"** | Não existe | Seção Sobre |
| 8 | **1–2 textos editoriais** | Não existem | Seção Textos |
| 9 | **Número do WhatsApp Business** | Só o prefixo `+5547` | Consultar (tem fallback) |
| 10 | **Domínio definitivo** | `gclm.com.br` × nome dela — indefinido | Deploy, hreflang, OG, Search Console |
| 11 | **Logo / rubrica** | Pendente. O registro da marca está parado por causa dela | Identidade, favicon |
| 12 | **Data de estreia** | Nunca travada | Cronograma inteiro |

**Nada disso pode ser inventado.** Ficha técnica errada em site de artista circula para galeria
e curador — o custo do erro é a credibilidade dela, não um bug.

---

## C. Não bloqueia, mas muda o resultado

| Item | Por quê |
|---|---|
| **Acesso à apresentação do Canva** | Ela diz ter escrito ali *"a essência das coisas, de forma enxuta"* e reunido referências. É a voz dela sobre o próprio trabalho — o insumo mais valioso que ainda falta |
| **O link da Zara Home** | Citou em 11/09/24, prometeu mandar, nunca mandou |
| **Cor assinatura** | Deve sair das obras fotografadas. Depende do item 1 |
| **Exposições, prêmios, formação** | Ela menciona *"exposição inteira esperando pra lançar"*. Isso é repertório — é o que separa portfólio de acervo |
| **Quem é "dona Celeste"** | Foi quem a chamou de artista, e é o gancho que ela quis aproveitar. Se for curadora ou galerista, **é a citação que resolve o problema de posicionamento** sem ela precisar se autointitular |
| **GCLM na v1: sim ou não** | Duas camadas de marca nunca reconciliadas |
| **Link duplicado** | Desabrochar e Instante apontam para o **mesmo** álbum do Google Photos. Ou o álbum tem as duas, ou foi engano |

---

## D. Como coletar, sem virar interrogatório

Ela é **respondedora de áudio**. A conversa inteira mostra isso: mensagem longa e escrita
recebe resposta curta; áudio recebe áudio detalhado, com nuance e opinião. Formulário
comprido volta vazio — ou volta em duas semanas.

**Faça assim:**

**1. Os acessos primeiro, porque destravam tudo.** Uma mensagem curta, só isso:
compartilhar os três álbuns do Google Photos e a apresentação do Canva. Aproveite e confirme
o link duplicado. Isso é um pedido de trinta segundos e libera fotos, vídeo de fundo e a voz
dela sobre o trabalho.

**2. Ficha técnica por tabela pequena.** Três linhas, não um formulário:

| Obra | Ano | Técnica | Dimensões (A×L×P cm) | Materiais | Preço BRL | Peça única ou edição? |
|---|---|---|---|---|---|---|
| Desabrochar | | | | | | |
| Instante | | | | | | |
| Encontro | | | | | | |

**3. Texto das obras: peça áudio, não texto.** *"Me manda um áudio por obra: o que essa peça
é, de onde ela veio, o que você quer que a pessoa sinta olhando pra ela."* Transcreve-se e
redige-se a partir dali, e **ela aprova palavra por palavra**. É o formato natural dela e
produz texto muito melhor do que ela escrevendo sob pressão.

**4. Bio: três perguntas, também em áudio.**
Como você começou · O que a sua obra procura · O que você quer que a pessoa sinta ao sair do site.

Uma nota de cuidado para a redação da bio: ela tem desconforto declarado com se autointitular
artista. O texto deve mostrar o percurso, não distribuir rótulo. Se houver a citação da "dona
Celeste" ou de alguma curadoria, **o rótulo vem de lá** — que é exatamente como ela pediu que
funcionasse.

**5. As decisões binárias, numa mensagem só.** Domínio · GCLM aparece? · número do
WhatsApp · data de estreia. Quatro perguntas fechadas, resposta em um minuto.

---

## E. O que fazer enquanto não chega

Não espere. O projeto já parou duas vezes exatamente aqui.

- E0 a E4 do plano são construídas com **placeholder explícito** — `[PENDENTE: técnica]`,
  visível, impossível de confundir com conteúdo real
- Fotos de estudo em proporção correta seguram o layout. Nunca imagem de banco de imagens
  que possa vazar para produção
- `robots.txt` fechado até o conteúdo real subir
- Preço ausente já renderiza "Sob consulta" — que é elegante em galeria, e não uma falha

Quando o material chegar, é preenchimento. Não é construção.
