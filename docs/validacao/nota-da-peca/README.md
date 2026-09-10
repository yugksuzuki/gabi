# Nota da peça · registro de validação

Pedido dela por WhatsApp, **08/09/2026 às 19:15** — no dia da estreia que passou:

> "Uma coisa q vai ser preciso, na aba principal das peças ter algum lugar p adicionar nota
> p poder colocar por exemplo 'em exposição em…'"
>
> "E dessas todas aliás já da p botar. Estão todas na galeria caos"

## Como ficou

Campo `nota` no schema da obra: **localizado, livre e opcional**.

- **No portfólio** ("a aba principal das peças", que é onde ela pediu), logo abaixo do nome
- **Na página da obra**, acima da ficha técnica

Ordem escolhida de propósito: a ficha diz **o que a obra é** e não muda; a nota diz **onde ela
está**, e muda quando a peça troca de sala.

Livre, e não `{exposição, local, data}`: ela pediu uma *nota* e deu um *exemplo*, não um
formato. A primeira coisa a não caber num formulário seria a segunda nota que ela quisesse
escrever.

Opcional de verdade: não entra em `pendenciasDePublicacao`, então obra sem nota não vira
pendência e o bloco some sozinho.

## O que é dela e o que não é

**Dela:** o fato — as três estão na Galeria Caos — e o formato da frase, "em exposição em…".

**Nosso, e precisa de confirmação dela:**

1. **A grafia.** Ela escreveu "galeria caos" em minúsculas, no correr do WhatsApp.
   "Galeria Caos" é a leitura provável, **não uma confirmação**
2. **O inglês.** `On view at Galeria Caos` foi escrito aqui, não por ela

Os dois estão marcados em comentário nos três `.mdx`. Conferir antes de abrir a indexação.

## Um efeito colateral que vale registrar

A regra 1 do `CLAUDE.md` diz que o site não a chama de artista na primeira pessoa, e que o
reconhecimento, quando aparece, vem citado de terceiro. **Estar em exposição numa galeria é
terceiro falando.** Não resolve a cor assinatura, mas resolve como o site mostra repertório
sem ela precisar se autointitular.

## Verificado

`npm run verificar`, `npm run build` e **44/44 testes** — axe-core sem violação AA nas 9 rotas
em desktop e celular, com a nota no ar.

Capturas: `portfolio` e `obra` em 390 / 768 / 1440.
