# -*- coding: utf-8 -*-
"""
Gera as pranchas do wireframe em public/wireframe/.

Estado: 27/08/2026 — as correções que a Gabriela marcou à mão sobre o
Wireframe 3, mais a lista escrita dela. Cada item carrega o código do
levantamento (G1..G8, H1..H7, O1..O11, A1..A4, E1..E4, C1..C3) para a prancha
poder ser conferida contra a lista, uma linha de cada vez.

Ela pediu explicitamente a correção NO DESENHO antes do código:
"me envia o link do Figma atualizado com as correções visuais antes de ir para
o VS Code". Estas pranchas são esse desenho.
"""
import os, html

SAIDA = 'public/wireframe'

# --- tokens -----------------------------------------------------------------
# G4 Cormorant Garamond. G5 escala comprimida: a razão display/corpo cai de
# 5,5x (104/19) para 2,7x (56/21). G7 respiro maior: margem 96->120, seção
# 160->200.
BASE = """
:root{
  --bg:#f4f2ee; --bg-alt:#eae7e1; --ink:#1a1917; --muted:#635f58;
  --line:#dcd8d1; --forte:#837e76;
  --serif:'Cormorant Garamond',Garamond,Georgia,'Times New Roman',serif;
  --ui:'Inter',system-ui,-apple-system,sans-serif;
  --margem:120px; --respiro:200px;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
     font:400 21px/1.8 var(--serif);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
h1,h2,h3{margin:0;font-family:var(--serif);font-weight:400}
p{margin:0}
.display{font-family:var(--serif);font-size:56px;line-height:1.05;letter-spacing:-.005em}
.titulo{font-family:var(--serif);font-size:34px;line-height:1.15}
.corpo{font-family:var(--serif);font-size:21px;line-height:1.8;text-align:left}
.legenda{font-family:var(--ui);font-size:13px;line-height:1.5;letter-spacing:.07em;
         text-transform:uppercase;color:var(--muted)}
.navlink{font-family:var(--ui);font-size:13px;letter-spacing:.1em;text-transform:uppercase}
.preco{font-family:var(--ui);font-size:15px;letter-spacing:.02em;color:var(--muted)}
.consultar{font-family:var(--ui);font-size:13px;letter-spacing:.12em;text-transform:uppercase;
           border-bottom:1px solid var(--forte);padding-bottom:3px}
.nota{font-family:var(--ui);font-size:11px;line-height:1.5;letter-spacing:.14em;
      text-transform:uppercase;color:var(--forte);border:1px dashed var(--forte);
      padding:5px 9px;display:inline-block}
.faixa{position:relative;width:100%;overflow:hidden}
.faixa img{display:block;width:100%;object-fit:cover}
.faixa .legenda{position:absolute;left:var(--margem);bottom:16px;color:#f4f2ee}
"""

FONTE = ("https://fonts.googleapis.com/css2?"
         "family=Cormorant+Garamond:ital,wght@0,300..600;1,300..500"
         "&family=Inter:wght@400;500&display=swap")

def pagina(titulo, corpo, largura=1440, lang='pt'):
    return f"""<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width={largura}">
<meta name="robots" content="noindex, nofollow">
<title>{titulo}</title>
<link rel="stylesheet" href="{FONTE}">
<style>{BASE}</style>
<style>body{{width:{largura}px;margin:0 auto}}</style>
</head><body>
{corpo}
</body></html>"""

# --- peças compartilhadas ---------------------------------------------------
def cabecalho(ativo='', margem='var(--margem)'):
    """G1 a logo (rubrica) no lugar do wordmark — 'sempre a logo', em toda
    página. G2 Quem sou eu -> A artista. G3 Textos -> Ensaios."""
    itens = [('A artista','QuemSouEu.html'), ('Ensaios','Textos.html'),
             ('Contato','Contato.html')]
    dim = ' style="color:var(--muted)"'
    nav = ''.join(
        '<a href="%s" class="navlink"%s>%s</a>' % (h, dim if n == ativo else '', n)
        for n, h in itens)
    return f"""
<header style="padding:36px {margem} 20px;display:flex;align-items:center;
               justify-content:space-between;gap:32px;">
  <a href="Main.html"><img src="img/rubrica.png" alt="Gabriela Seleme"
     style="display:block;height:52px;width:auto;"></a>
  <nav style="display:flex;align-items:baseline;gap:38px;">{nav}
    <span class="navlink" style="color:var(--muted);"><span style="color:var(--ink);">PT</span> / EN</span>
  </nav>
</header>"""

def faixa_video(altura=240, legenda='Faixa em vídeo &middot; sem som &middot; em loop'):
    """G8 cabeçalho e rodapé dinâmicos nas páginas internas. C1 e C2 pediram
    isso escrito à mão em Contato; A3 pede o mesmo em A artista."""
    return f"""
<section class="faixa">
  <img src="img/hero-wide.jpg" alt="" style="height:{altura}px;">
  <p class="legenda">{legenda}</p>
</section>"""

def rodape(margem='var(--margem)', com_video=True):
    v = faixa_video(200, 'Rodapé em vídeo &middot; mesma faixa da entrada') if com_video else ''
    return f"""{v}
<footer style="margin-top:{'64px' if com_video else 'var(--respiro)'};
               border-top:1px solid var(--line);padding:40px {margem};
               display:flex;flex-wrap:wrap;align-items:baseline;
               justify-content:space-between;gap:12px 32px;">
  <p class="legenda">&copy; 2026 Gabriela Seleme</p>
  <div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:22px;">
    <a href="#" class="legenda">gseleme.design@gmail.com</a>
    <a href="#" class="legenda">@gseleme.design</a>
  </div>
</footer>"""

def nota(txt):
    return f'<p style="padding:14px var(--margem) 0;"><span class="nota">{txt}</span></p>'

# --- 01 Portfólio (home) ----------------------------------------------------
# H1 apagada a lista índice "01 Encontro / 02 Desabrochar / 03 Instante".
# H2 apagadas TODAS as imagens de estudo (díptico de ateliê, mar, folhagem,
#    processo) — ela riscou uma por uma.
# H3 apagados os blocos de legenda e o "VER A OBRA ->".
# H4 cada obra com uma foto só, limpa. H5 hover toca o vídeo no lugar da foto.
# H6 clique abre a página da obra. H7 a logo em escrita dinâmica sobre o vídeo.
OBRAS_HOME = [
    ('Encontro',    'img/encontro-frontal.jpg', 'Obra.html', 'esq'),
    ('Desabrochar', None,                       '#',         'dir'),
    ('Instante',    None,                       '#',         'esq'),
]

def moldura(w, h, texto='[PENDENTE: fotografia]'):
    """Obra sem foto aparece como moldura vazia declarada, nunca com uma
    imagem de outra coisa no lugar. A crítica dela foi exatamente essa:
    'nem as fotos correspondem às obras'. CLAUDE.md, regra 2."""
    return (f'<div style="width:{w}px;height:{h}px;border:1px dashed var(--forte);'
            'display:flex;align-items:center;justify-content:center;'
            'background:var(--bg-alt);">'
            f'<span class="nota" style="border:0;">{texto}</span></div>')

def home():
    blocos = []
    for nome, img, href, lado in OBRAS_HOME:
        col = 'grid-column:1 / span 7' if lado == 'esq' else 'grid-column:6 / span 7'
        ali = 'flex-start' if lado == 'esq' else 'flex-end'
        visual = (f'<img src="{img}" alt="" style="display:block;width:620px;'
                  'height:872px;object-fit:cover;') if img else moldura(620, 872)
        if img:
            visual += '">'
        marca = ('H5 hover &rarr; o vídeo da obra toca aqui' if img
                 else 'Sem foto e sem vídeo &mdash; nada a mostrar ainda')
        blocos.append(f"""
<article style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));
                column-gap:32px;padding:0 var(--margem);">
  <div style="{col};display:flex;flex-direction:column;align-items:{ali};gap:18px;">
    <a href="{href}" style="display:block;position:relative;">
      {visual}
      <span class="nota" style="position:absolute;left:14px;bottom:14px;background:var(--bg);">
        {marca}</span>
    </a>
    <h2 class="titulo"><a href="{href}">{nome}</a></h2>
  </div>
</article>""")
    corpo = f"""<div>{cabecalho()}
<section class="faixa">
  <img src="img/hero-wide.jpg" alt="" style="height:680px;">
  <img src="img/rubrica-clara.png" alt="" style="position:absolute;left:50%;top:50%;
       transform:translate(-50%,-50%);width:400px;height:auto;">
  <p class="legenda">Entrada em vídeo &middot; sem som &middot; em loop</p>
</section>
{nota('H7 a logo entra em escrita dinâmica sobre o vídeo &mdash; o traço sendo desenhado. Arquivo pedido à Catherine')}
{nota('A faixa horizontal ainda depende de material 16:9. O vídeo que existe é 9:16')}

<div style="display:flex;flex-direction:column;gap:var(--respiro);padding-top:var(--respiro);">
{''.join(blocos)}
</div>
{rodape(com_video=False)}
</div>"""
    return pagina('Gabriela Seleme — Portfólio', corpo)

# --- 02/03 Obra -------------------------------------------------------------
# O1 uma foto só, destaque absoluto, com zoom. O2 foto e vídeo no mesmo lugar,
# transição por scroll lateral. O3 imagem à direita, texto e ficha à esquerda.
# O4/O5 apagadas as fotos soltas de DETALHE e ESCALA — o zoom as substitui.
# O6 ficha no modelo da prancha dela. O7 sem a linha "Materiais". O8 sem o
# rótulo "Valor". O9 preço cinza e menor. O10 Consultar vira link discreto.
# O11 vale igual nos dois idiomas.
TXT_PT = ["Essa obra é um convite a uma reflexão &mdash;",
 "A perceber como um caminho, sozinho, influencia diretamente o outro. Como um rio, "
 "que transforma a paisagem enquanto é transformado por ela.<br>É sobre perceber como "
 "nada deixa de existir, como feridas que se curam e ganham nova forma.<br>As coisas "
 "simplesmente assentam, camada sobre camada.<br>É esse acúmulo que dá força, que dá "
 "forma, que dá beleza, que dá história.",
 "É um encontro, entre o movimento e a permanência."]

def obra(en=False):
    t = dict(
        ficha=['Gabriela Seleme', 'Encontro, 2026',
               'Oil-based plaster and acrylic paste on canvas' if en
               else 'Gesso e massa acrílica sobre tela', '115 &times; 180'],
        preco='USD 2,050 &middot; approx.' if en else 'R$ 11.230',
        consultar='Enquire' if en else 'Consultar',
        zoom='Click to zoom' if en else 'Clique para ampliar',
        lateral=('Scroll sideways: photo &rarr; video' if en
                 else 'Scroll para o lado: foto &rarr; vídeo'),
        prox='Next work' if en else 'Próxima obra',
        texto=(['<span class="nota">EN translation pending &mdash; '
                'her text has not been translated</span>'] if en else TXT_PT),
    )
    linhas = ''.join(f'<p class="corpo" style="line-height:1.55;">{l}</p>' for l in t['ficha'])
    prosa = ''.join(f'<p class="corpo" style="margin-bottom:22px;">{p}</p>' for p in t['texto'])
    corpo = f"""<div>{cabecalho()}
{faixa_video(200)}

<section style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));
                column-gap:48px;padding:var(--respiro) var(--margem) 0;">

  <!-- O3 texto e ficha à ESQUERDA -->
  <div style="grid-column:1 / span 5;display:flex;flex-direction:column;gap:56px;">
    <div>
      <h1 class="display" style="margin-bottom:8px;">Encontro</h1>
      <p class="legenda">2026</p>
    </div>
    <div style="max-width:44ch;">{prosa}</div>
    <div>{linhas}
      <p class="preco" style="margin-top:26px;">{t['preco']}</p>
      <p style="margin-top:26px;"><a href="#" class="consultar">{t['consultar']}</a></p>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start;">
      <span class="nota">O6 ficha no modelo da prancha dela &mdash; uma linha por informação, sem coluna de rótulos</span>
      <span class="nota">115 &times; 180: falta dizer qual é a altura. A prancha escreve 115x180, o site mostrava 180 &times; 115</span>
      <span class="nota">&ldquo;Peça única&rdquo; e &ldquo;Disponível&rdquo; estavam na tabela riscada. Voltam ou saem?</span>
    </div>
  </div>

  <!-- O1/O2 imagem à DIREITA, com zoom, e vídeo ao lado por scroll lateral -->
  <div style="grid-column:7 / span 6;">
    <div style="display:flex;gap:20px;overflow:hidden;width:660px;">
      <figure style="margin:0;flex:0 0 auto;position:relative;">
        <img src="img/encontro-frontal.jpg" alt="" style="display:block;width:580px;height:1030px;object-fit:cover;">
        <figcaption class="nota" style="position:absolute;right:14px;bottom:14px;background:var(--bg);">
          &#8853; {t['zoom']}</figcaption>
      </figure>
      <figure style="margin:0;flex:0 0 auto;position:relative;">
        <img src="img/entrada-poster.jpg" alt="" style="display:block;width:580px;height:1030px;object-fit:cover;">
      </figure>
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:20px;">
      <span style="width:26px;height:2px;background:var(--ink);display:block;"></span>
      <span style="width:26px;height:2px;background:var(--line);display:block;"></span>
      <span class="legenda" style="margin-left:8px;">{t['lateral']}</span>
    </div>
  </div>
</section>

<nav style="margin-top:var(--respiro);border-top:1px solid var(--line);
            padding:36px var(--margem) 0;display:flex;flex-direction:column;gap:10px;">
  <span class="legenda">{t['prox']}</span><a href="#" class="titulo">Desabrochar &rarr;</a>
</nav>
{rodape()}
</div>"""
    return pagina('Gabriela Seleme — Encontro' + (' (EN)' if en else ''), corpo,
                  lang='en' if en else 'pt')

# --- 04 A artista -----------------------------------------------------------
# A1 "utilizar diagramação já disponibilizada" — a folha A3 do Canva dela: a
#    rubrica no alto à esquerda, o retrato flutuando à direita, e o texto
#    correndo numa coluna estreita que ABRE para a largura toda depois que
#    passa do pé da foto. A2 o título vira "A artista". A3 vídeo no cabeçalho
#    e no rodapé. A4 o texto dela não muda uma palavra.
BIO = [
 "Eu cresci imersa em arte, por pessoas que tinham arte como hobby &mdash; pintores, "
 "ceramistas, artesãos e uma mãe arquiteta que sempre passou mais tempo criando com as "
 "próprias mãos do que de qualquer outra forma.",
 "Aos 14 anos, saí de casa para fazer intercâmbio no Canadá e na Holanda.",
 "Ali, eu vi o mundo e sua vastidão pela primeira vez.",
 "No segundo, eu tive minha primeira experiência mais aprofundada com cerâmica e descobri "
 "o transe e a profundidade a que a arte pode nos guiar.",
 "Eu sempre flertei com arte, usei a arte, mas levei muito tempo para enxergá-la como um "
 "caminho meu.",
 "No início da vida adulta, durante a graduação de arquitetura, eu recorri a ela como "
 "forma de terapia, conexão e, principalmente, <strong style=\"font-weight:500;\">expressão</strong>.",
 "Esse caminho,<br>Essas peças,<br>São um reflexo de transformação,<br>De desenvolvimento.",
 "Aqui, eu testo, eu estrago, eu conserto e desenvolvo.",
 "Tudo é um reflexo do tempo e de emoções.",
 "Um reflexo da vida.",
]

def artista():
    prosa = ''.join(f'<p class="corpo" style="margin-bottom:26px;">{p}</p>' for p in BIO)
    corpo = f"""<div>{cabecalho('A artista')}
{faixa_video(200)}

<section style="padding:var(--respiro) var(--margem) 0;">
  <!-- a foto flutua à direita; o texto envolve e depois abre, como na folha dela -->
  <img src="img/retrato-folha.jpg" alt="" style="float:right;width:460px;height:auto;
       margin:0 0 56px 64px;">
  <img src="img/rubrica.png" alt="" style="display:block;width:300px;height:auto;margin-bottom:18px;">
  <h1 class="display" style="margin-bottom:72px;">A artista</h1>
  <div>{prosa}</div>
  <div style="clear:both;"></div>
  <p style="margin-top:40px;"><span class="nota">A1 diagramação da folha A3 dela &mdash; rubrica, retrato à direita, texto envolvendo. A4 o texto não muda</span></p>
</section>
{rodape()}
</div>"""
    return pagina('Gabriela Seleme — A artista', corpo)

# --- 05 Ensaios -------------------------------------------------------------
# E1 a página abre com um ensaio JÁ EXPANDIDO, não com listagem.
# E2 tipografia editorial, margens largas, espaçamento generoso.
# E3 menu vertical slim à esquerda, por data, no formato MM.AA — Título.
# E4 ela escreveu "ex:" nos dois títulos. Exemplo não é conteúdo: enquanto não
#    confirmar, o que entra é [PENDENTE], nunca um título plausível inventado
#    (CLAUDE.md, regra 2).
def ensaios():
    itens = ['03.26', '02.26', '01.26']
    menu = ''.join(f"""
    <a href="#" style="display:flex;flex-direction:column;gap:2px;padding:16px 0;
       border-bottom:1px solid var(--line);{'opacity:.45;' if i else ''}">
      <span class="legenda">{d}</span>
      <span class="corpo" style="font-size:18px;line-height:1.3;">[PENDENTE: título]</span>
    </a>""" for i, d in enumerate(itens))
    corpo = f"""<div>{cabecalho('Ensaios')}
{faixa_video(200)}

<section style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));
                column-gap:64px;padding:var(--respiro) var(--margem) 0;">

  <!-- E3 menu slim vertical, por data -->
  <aside style="grid-column:1 / span 3;">
    <p class="legenda" style="margin-bottom:12px;">Ensaios</p>
    <nav style="border-top:1px solid var(--line);">{menu}</nav>
    <p style="margin-top:22px;"><span class="nota">E4 os títulos E as datas vieram com &ldquo;ex:&rdquo;. São reais ou só ilustram o formato MM.AA?</span></p>
  </aside>

  <!-- E1 o ensaio já aberto. E2 margens largas, medida curta, ar. -->
  <article style="grid-column:5 / span 7;max-width:60ch;">
    <p class="legenda" style="margin-bottom:20px;">Março de 2026</p>
    <h1 class="display" style="margin-bottom:56px;">[PENDENTE: título]</h1>
    <p class="corpo" style="margin-bottom:28px;">
      <span class="nota">Os textos dela ainda não chegaram &mdash; &ldquo;logo encaminho os textos organizados&rdquo;, 27/08</span>
    </p>
    <p class="corpo" style="color:var(--muted);margin-bottom:28px;">
      [PENDENTE: corpo do ensaio]</p>
    <p class="corpo" style="color:var(--muted);margin-bottom:28px;">
      A medida da linha fica em torno de 60 caracteres e a entrelinha em 1,8 &mdash;
      é essa proporção que faz o texto longo se ler sem cansar. O corpo do ensaio
      ocupa esta coluna inteira quando chegar.</p>
  </article>
</section>
{rodape()}
</div>"""
    return pagina('Gabriela Seleme — Ensaios', corpo)

# --- 06 Contato -------------------------------------------------------------
# C1 cabeçalho dinâmico, C2 rodapé dinâmico — os dois escritos à mão na p.7.
# C3 mesmo formato de "A artista". Ela não riscou nenhum conteúdo da página.
def contato():
    linhas = [('E-mail','gseleme.design@gmail.com'), ('Instagram','@gseleme.design'),
              ('WhatsApp','Conversar')]
    dl = ''.join(f"""
      <div style="display:grid;grid-template-columns:150px 1fr;column-gap:20px;
                  border-top:1px solid var(--line);padding:20px 0;">
        <dt class="legenda" style="padding-top:6px;">{r}</dt>
        <dd style="margin:0;"><a href="#" class="corpo" style="border-bottom:1px solid var(--line);
            padding-bottom:2px;">{v}</a></dd></div>""" for r, v in linhas)
    corpo = f"""<div>{cabecalho('Contato')}
{faixa_video(200)}

<section style="padding:var(--respiro) var(--margem) 0;">
  <h1 class="display" style="margin-bottom:72px;">Contato</h1>
  <div style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:64px;">
    <div style="grid-column:1 / span 5;">
      <dl style="margin:0;border-bottom:1px solid var(--line);">{dl}</dl>
      <p style="margin-top:20px;"><span class="nota">WhatsApp confirmado &mdash; +55 44 99992-9186</span></p>
    </div>
    <div style="grid-column:7 / span 5;display:flex;flex-direction:column;gap:26px;align-items:flex-start;">
      <p class="corpo" style="max-width:40ch;">Cada peça é única e se negocia por conversa.</p>
      <a href="#" class="consultar">Consultar</a>
      <p class="legenda">Atendimento em português e inglês</p>
      <span class="nota">Este parágrafo é texto meu, não dela. Ou a Gabi escreve, ou sai</span>
    </div>
  </div>
</section>
{rodape()}
</div>"""
    return pagina('Gabriela Seleme — Contato', corpo)

# --- 07 Celular -------------------------------------------------------------
# Mesmas regras, 390px. O ponto aberto de H5: hover não existe em celular, e o
# celular é a maior parte do tráfego que vem do Instagram. A prancha propõe o
# vídeo tocando sozinho, sem som, ao entrar na viewport — e o toque abrindo a
# obra, para não gastar o primeiro toque só para tocar o vídeo.
def celular():
    partes = []
    for nome, img, _, _ in OBRAS_HOME:
        visual = (f'<img src="{img}" alt="" style="display:block;width:100%;'
                  'height:462px;object-fit:cover;">') if img else moldura(350, 462)
        marca = ('vídeo toca ao entrar na tela' if img
                 else 'Sem foto e sem vídeo ainda')
        partes.append(f"""
<article style="padding:0 20px;display:flex;flex-direction:column;gap:14px;">
  <a href="#" style="display:block;position:relative;">
    {visual}
    <span class="nota" style="position:absolute;left:10px;bottom:10px;background:var(--bg);">
      {marca}</span>
  </a>
  <h2 class="titulo" style="font-size:26px;">{nome}</h2>
</article>""")
    blocos = ''.join(partes)
    corpo = f"""<div>
<header style="padding:22px 20px 14px;display:flex;align-items:center;justify-content:space-between;">
  <img src="img/rubrica.png" alt="Gabriela Seleme" style="display:block;height:38px;width:auto;">
  <span class="navlink">&#9776;</span>
</header>
<section class="faixa" style="--margem:20px;">
  <img src="img/entrada-poster.jpg" alt="" style="height:520px;">
  <img src="img/rubrica-clara.png" alt="" style="position:absolute;left:50%;top:50%;
       transform:translate(-50%,-50%);width:230px;height:auto;">
  <p class="legenda">Entrada em vídeo</p>
</section>
<p style="padding:12px 20px 0;"><span class="nota">O vídeo que existe é 9:16 &mdash; no celular ele serve inteiro, sem corte</span></p>
<div style="display:flex;flex-direction:column;gap:80px;padding-top:80px;">{blocos}</div>
<p style="padding:28px 20px 0;"><span class="nota">Sem hover no celular: o vídeo toca sozinho, sem som, e o toque abre a obra. prefers-reduced-motion desliga</span></p>
{rodape(margem='20px')}
</div>"""
    return pagina('Gabriela Seleme — Celular', corpo, largura=390)

# --- índice -----------------------------------------------------------------
TELAS = [('Portfólio','Main.html','1440'), ('Obra — Encontro','Obra.html','1440'),
         ('Obra — Encontro (EN)','ObraEN.html','1440'), ('A artista','QuemSouEu.html','1440'),
         ('Ensaios','Textos.html','1440'), ('Contato','Contato.html','1440'),
         ('Home no celular','Celular.html','390')]

def indice():
    li = ''.join(f"""
    <li><a href="{h}"><span class="num">{i:02d}</span>
      <span class="nome">{n}</span><span class="larg">{w}</span></a></li>"""
      for i, (n, h, w) in enumerate(TELAS, 1))
    corpo = f"""
<style>
  body{{padding:clamp(24px,6vw,96px)}}
  h1{{font:400 clamp(40px,6vw,64px)/1.05 var(--serif);margin:0 0 10px}}
  .sub{{color:var(--muted);max-width:62ch;margin:0 0 8px}}
  ul{{list-style:none;padding:0;margin:0;border-top:1px solid var(--line);max-width:70ch}}
  li{{border-bottom:1px solid var(--line)}}
  li a{{display:grid;grid-template-columns:52px 1fr auto;gap:20px;align-items:baseline;padding:20px 0}}
  li a:hover .nome{{opacity:.55}}
  .num{{font-family:var(--ui);font-size:13px;letter-spacing:.18em;color:var(--muted)}}
  .nome{{font-family:var(--serif);font-size:28px;line-height:1.1;transition:opacity .2s}}
  .larg{{font-family:var(--ui);font-size:13px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}}
  footer{{margin-top:64px;color:var(--muted);font-family:var(--ui);font-size:14px;line-height:1.65;max-width:70ch}}
  code{{background:var(--bg-alt);padding:2px 6px;font-size:13px}}
</style>
<img src="img/rubrica.png" alt="Gabriela Seleme" style="display:block;height:84px;width:auto;margin-bottom:26px;">
<h1>Wireframe &mdash; revisão de 27/08</h1>
<p class="sub">Sete telas com as correções que você marcou sobre o Wireframe 3,
   mais a lista escrita. Para importar no Figma pelo plugin
   <strong>html.to.design</strong>, na aba de <strong>URL</strong>: cole o endereço
   de uma tela por vez.</p>
<p style="margin:20px 0 44px;"><span class="nota">Material de trabalho &mdash; não é o site publicado</span></p>
<ul>{li}</ul>
<footer>
  <p><strong>O que mudou nesta revisão.</strong> A logo substituiu o nome tipografado e
     aparece em todas as páginas. &ldquo;Quem sou eu&rdquo; virou <strong>A artista</strong> e
     &ldquo;Textos&rdquo; virou <strong>Ensaios</strong>. A tipografia é
     <strong>Cormorant Garamond</strong> e a escala foi comprimida &mdash; o display caiu de
     104px para 56px, e a razão entre ele e o corpo do texto foi de 5,5&times; para 2,7&times;.
     O respiro cresceu: margem de 96 para 120px, intervalo entre seções de 160 para 200px.
     As páginas internas ganharam faixa de vídeo no cabeçalho e no rodapé.</p>
  <p>Na home saíram a lista índice, todas as imagens de estudo e os blocos de legenda:
     cada obra é uma foto só, e o vídeo dela toca no hover. A página da obra virou
     texto e ficha à esquerda, imagem à direita, com zoom e com a passagem foto&rarr;vídeo
     por scroll lateral; a ficha segue o modelo da sua prancha, sem coluna de rótulos,
     sem a linha Materiais, sem o rótulo Valor, com o preço em cinza menor e o Consultar
     como link. Ensaios abre com um ensaio expandido e menu por data à esquerda.</p>
  <p><strong>As caixas tracejadas são perguntas para você</strong>, não são parte do
     desenho: a altura de 115&times;180, se &ldquo;Peça única&rdquo; e &ldquo;Disponível&rdquo;
     voltam, se os dois títulos de ensaio são reais ou exemplos, e o parágrafo do Contato
     que foi escrito por nós.</p>
  <p>Cor <code>#f4f2ee</code> fundo &middot; <code>#1a1917</code> tinta &middot;
     <code>#635f58</code> tinta suave &middot; <code>#dcd8d1</code> filete.</p>
</footer>"""
    return pagina('Gabriela Seleme — Wireframe', corpo, largura=0).replace(
        'width:0px;margin:0 auto', 'max-width:1100px;margin:0 auto').replace(
        '<meta name="viewport" content="width=0">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">')

if __name__ == '__main__':
    os.makedirs(SAIDA, exist_ok=True)
    for nome, gerar in [('Main', home), ('Obra', lambda: obra(False)),
                        ('ObraEN', lambda: obra(True)), ('QuemSouEu', artista),
                        ('Textos', ensaios), ('Contato', contato),
                        ('Celular', celular), ('index', indice)]:
        caminho = os.path.join(SAIDA, nome + '.html')
        with open(caminho, 'w', encoding='utf-8') as f:
            f.write(gerar())
        print('%-14s %6d B' % (nome + '.html', os.path.getsize(caminho)))
