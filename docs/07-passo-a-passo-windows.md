# Passo a passo — do zip ao Claude Code rodando

Windows. Você já tem Node.js, Git, VS Code e Claude Code — então nada de instalação aqui.
Tempo total: uns 10 minutos.

---

## Passo 0 — uma decisão antes de tudo: o repositório vai ser privado?

**Deixe privado.** É projeto de cliente, com conversa de WhatsApp, valores comerciais e
contato de terceiros dentro. Não existe motivo pra ser público.

Isso muda uma coisa prática, e é importante: o `.gitignore` que eu mandei ignora a pasta
`materiais/` — que é justamente onde está a conversa transcrita com os 95 áudios. Se o repo
for **privado**, você quer essa pasta versionada, porque é o material que o Claude Code
consulta quando precisa checar o que a Gabriela disse.

No Passo 3 eu mostro o comando pra liberar. Se por algum motivo o repo for público, pule
aquele comando e a pasta fica só na sua máquina.

---

## Passo 1 — baixar o zip

Baixe `gabriela-seleme-handoff.zip` aqui da conversa. Ele cai em `C:\Users\<você>\Downloads`.

---

## Passo 2 — criar a pasta e extrair

Abra o **PowerShell** (tecla Windows, digite `powershell`, Enter).

Cole os comandos abaixo **um bloco de cada vez**.

```powershell
# cria a pasta do projeto e entra nela
mkdir $HOME\Projetos\gseleme -Force
cd $HOME\Projetos\gseleme
```

> **Por que `$HOME\Projetos` e não a Área de Trabalho ou Documentos?**
> No Windows essas duas pastas quase sempre estão sincronizadas com o OneDrive. O OneDrive
> trava arquivos durante a sincronização e o `node_modules` do Next.js tem dezenas de milhares
> de arquivos pequenos — a combinação dá erro de build e lentidão. Caminho curto também evita
> o limite de 260 caracteres do Windows.

```powershell
# extrai o zip aqui dentro
Expand-Archive -Path "$HOME\Downloads\gabriela-seleme-handoff.zip" -DestinationPath . -Force
```

```powershell
# o zip tem uma pasta interna — sobe o conteúdo um nível e remove a casca
Move-Item -Path .\gabriela-seleme-handoff\* -Destination . -Force
Move-Item -Path .\gabriela-seleme-handoff\.gitignore -Destination . -Force
Remove-Item .\gabriela-seleme-handoff -Recurse -Force
```

> A segunda linha existe porque o `*` do PowerShell **não pega arquivos ocultos**, e o
> `.gitignore` começa com ponto. Sem ela, ele ficaria pra trás.

```powershell
# confere: você deve ver CLAUDE.md, README.md, content, docs, ativos, materiais
dir
```

Se aparecer `CLAUDE.md` na lista, deu certo. Se aparecer uma pasta
`gabriela-seleme-handoff`, algum comando não rodou — repita o bloco anterior.

---

## Passo 3 — iniciar o Git

```powershell
git init
```

**Se o repositório for privado** (recomendado), libere a pasta de materiais:

```powershell
(Get-Content .gitignore) -replace '^materiais/$','' | Set-Content .gitignore
```

Depois, o primeiro commit:

```powershell
git add .
git commit -m "Contexto do projeto: briefing, direcao visual, modelo de dados e conteudo real"
```

> Ainda não crie o repositório no GitHub. Faça isso quando houver código — no fim da etapa E0.

---

## Passo 4 — abrir no VS Code

```powershell
code .
```

O ponto significa "a pasta atual". O VS Code abre já com o projeto carregado.

---

## Passo 5 — instalar a extensão do Claude Code

Você tem o `claude` no terminal, mas a extensão do VS Code é melhor pra este projeto:
mostra **diff lado a lado** antes de aceitar cada alteração, deixa você **revisar e editar
o plano** antes dele executar, e permite citar arquivo com `@`.

Num projeto onde a regra número dois é "não invente conteúdo da artista", ver o diff antes
de aceitar não é conforto — é controle de qualidade.

No VS Code: `Ctrl + Shift + X` → busque **"Claude Code"** → **Install**
(publisher: **Anthropic**).

Se a extensão não aparecer depois de instalar, use `Ctrl + Shift + P` →
"Developer: Reload Window".

---

## Passo 6 — abrir o Claude e conferir se ele leu o contexto

Abra o painel do Claude Code (ícone da faísca no canto superior direito do editor, com um
arquivo aberto) ou, se preferir terminal: no VS Code, `Ctrl + Shift + '` abre um terminal
novo — digite `claude` e Enter.

**Antes de mandar ele construir qualquer coisa, faça este teste.** Cole exatamente isto:

```
Leia o CLAUDE.md deste projeto e responda em no máximo 5 linhas:
1) qual das três obras está completa e por quê
2) qual a paleta do site e de onde ela saiu
3) o que o site NÃO pode fazer
Não escreva código ainda.
```

**Resposta esperada:** Encontro é a única completa (tem ficha, texto, preço e 5 fotos);
a paleta é branco osso, cinza quente e grafite, tirada das próprias obras, que são
monocromáticas; e o site não pode ter carrinho, nem chamar a Gabriela de artista na
primeira pessoa.

Se ele responder isso, o contexto carregou e você pode seguir com confiança.
Se ele responder genérico ou disser que não achou o arquivo, você está na pasta errada —
saia (`/exit`), confira com `dir` se o `CLAUDE.md` está ali, e abra de novo.

---

## Passo 7 — a primeira instrução de verdade

```
Vamos começar a etapa E0 do docs/01-plano-de-execucao.md.

Antes de rodar qualquer comando, me apresente o plano: quais pacotes você vai instalar,
qual estrutura de pastas vai criar, e o que exatamente o `npm create next-app` vai gerar.
Quero aprovar antes.

Atenção: já existe conteúdo em content/ e ativos/ — o scaffold não pode sobrescrever
nem apagar esses arquivos.
```

O motivo do "me apresente o plano antes": `npm create next-app` num diretório que já tem
arquivos pode reclamar ou sobrescrever. Ver o plano primeiro custa trinta segundos e evita
perder o `content/` que a gente acabou de montar.

---

## Passo 8 — quando terminar a E0, aí sim o GitHub

```powershell
gh repo create gseleme --private --source=. --remote=origin --push
```

Se você não usa o `gh`, crie o repositório privado pelo site do GitHub e siga as instruções
de "push an existing repository" que ele mostra.

Depois: vercel.com → Add New → Project → importe o repositório → Deploy.
A Vercel reconhece Next.js sozinha, não precisa configurar build.

---

## Se algo travar

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `claude` não é reconhecido | terminal aberto antes da instalação | feche e abra o PowerShell de novo |
| Claude responde genérico sobre o projeto | você está na pasta errada | `dir` e confirme que o `CLAUDE.md` está ali |
| Erro de build com caminho longo | pasta muito funda | mantenha em `$HOME\Projetos\gseleme` |
| Build lento ou arquivo travado | pasta sincronizada no OneDrive | mova o projeto pra fora do OneDrive |
| Claude não encontra a conversa em `materiais/` | ficou no `.gitignore` | rode o comando do Passo 3 |

---

## O que fazer em paralelo, sem depender de código

Enquanto a E0 roda, essas duas destravam a estreia:

1. **Fotografar Desabrochar e Instante.** Encontro tem 5 fotos; as outras duas não têm
   nenhuma. Repita o esquema de Encontro: parede branca, luz difusa, 4 ângulos e 1 detalhe.
   A spec completa está em `docs/02-direcao-visual.md`, seção 7 — mande pro fotógrafo.
2. **Confirmar o WhatsApp.** Abra `wa.me/5544999929186` no celular. Se abrir a conversa da
   Gabriela, é esse número.
