"""
Prepara as fontes do site a partir dos arquivos originais do Google Fonts.

Rodar só quando a tipografia mudar. NÃO faz parte do build — o resultado está
versionado em src/styles/fontes/ e é isso que o build consome.

    pip install fonttools brotli
    python3 scripts/gerar-fontes.py

## O que ele produz, e por quê

**Os woff2 do site** (src/styles/fontes/*.woff2). São os arquivos que a pessoa
baixa, e no orçamento de performance (docs/02 §5) eles competem com a foto da
obra: o next/font os pré-carrega, e numa conexão 4G cada KB de fonte é um KB que
a obra espera para aparecer. Duas passadas cortam mais da metade:

  - Recorte de eixos. A Cormorant Garamond tem um eixo só, wght (300-700), e
    ele fica inteiro: o site usa de 300 a 600. Não há eixo a descartar aqui —
    o corte que sobra é o de glifos.
  - Recorte de glifos para latim + pontuação tipográfica. O subset "latin" do
    Google já é grande; o site escreve português e inglês.

  A Cormorant entra em DUAS faces: normal e itálico. O itálico não é enfeite —
  a ficha técnica da obra escreve o nome da peça em itálico, seguindo a prancha
  que a própria Gabriela diagramou (docs/08 §3).

**Os TTF do cartão social** (src/styles/fontes/og/*.ttf). O Satori, motor por
trás do next/og, não lê woff2 e não interpola eixo variável: precisa de TTF com
o peso já fixado. Estes 74 KB nunca chegam ao navegador — só o build os lê.

Manter os dois no mesmo script é o que garante que a imagem compartilhada e a
página usem o MESMO desenho. Gerados em lugares diferentes, um dia divergem.

## De onde vêm os originais

@fontsource-variable/cormorant-garamond e @fontsource-variable/inter, v5.3.0,
subset latin, arquivo variável completo. Ambas SIL OFL 1.1 (licenças em
src/styles/fontes/LICENSE-*.txt). Para atualizar:

    npm pack @fontsource-variable/cormorant-garamond@<versao>
    tar xzf fontsource-variable-cormorant-garamond-<versao>.tgz
    cp package/files/cormorant-garamond-latin-wght-normal.woff2 \\
       src/styles/fontes/originais/cormorant-garamond-latin.woff2
    cp package/files/cormorant-garamond-latin-wght-italic.woff2 \\
       src/styles/fontes/originais/cormorant-garamond-latin-italico.woff2
"""

from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

RAIZ = Path(__file__).resolve().parent.parent
FONTES = RAIZ / "src" / "styles" / "fontes"
ORIGINAIS = FONTES / "originais"

# Latin-1 estendido cobre português e inglês. A pontuação tipográfica entra
# porque o conteúdo dela usa travessão e aspas curvas — «Encontro», o traço em
# "reflexão —". Nada de CJK, nada de símbolo que este site nunca vai desenhar.
UNICODES = (
    set(range(0x20, 0x7F))
    | set(range(0xA0, 0x180))
    | {
        0x2010, 0x2011, 0x2012, 0x2013, 0x2014,  # hífens e travessões
        0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E,  # aspas curvas
        0x00AB, 0x00BB, 0x2039, 0x203A,  # aspas angulares
        0x2022, 0x2026,  # bolinha, reticências
        0x00A9, 0x00AE,  # © ®
        0x2192, 0x00D7,  # seta, × das dimensões
    }
)


def _completar_gvar(fonte: TTFont) -> None:
    """Dá a todo glifo uma entrada no gvar, nem que seja vazia.

    A Cormorant Garamond traz glifos no cmap que não aparecem no gvar — o
    espaço inquebrável (U+00A0) e o soft hyphen (U+00AD) entre eles. Faz
    sentido para a fonte: são glifos sem contorno, não há o que variar. Mas o
    subsetter do fontTools percorre os glifos que vai manter e busca cada um no
    gvar sem perguntar se existe, e estoura em KeyError: 'uni00A0'.

    Preencher com lista vazia diz exatamente a verdade — este glifo não varia —
    e é o que o subsetter espera encontrar. A alternativa seria tirar os dois do
    subset, mas o U+00A0 é o espaço que segura "R$ 11.230" e "180 × 115 cm"
    numa linha só. Ele fica.
    """
    if "gvar" not in fonte:
        return
    variacoes = fonte["gvar"].variations
    for nome in fonte.getGlyphOrder():
        if nome not in variacoes:
            variacoes[nome] = []


def preparar(
    entrada: Path,
    saida: Path,
    limites: dict,
    formato: str | None,
    contorno_notdef: bool = True,
) -> None:
    fonte = TTFont(entrada)
    fonte = instantiateVariableFont(fonte, limites, inplace=True, updateFontNames=False)
    _completar_gvar(fonte)

    opcoes = Options()
    opcoes.layout_features = [
        "kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk",
    ]
    opcoes.name_IDs = ["*"]
    opcoes.name_legacy = True
    # A Inter guarda variação para o .notdef e o subsetter tropeça nela ao
    # recortar. Ninguém sente falta do quadrado de glifo ausente.
    opcoes.notdef_outline = contorno_notdef
    opcoes.drop_tables += ["DSIG"]

    subsetter = Subsetter(options=opcoes)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(fonte)

    fonte.flavor = formato  # 'woff2' para o site, None (TTF cru) para o Satori
    saida.parent.mkdir(parents=True, exist_ok=True)
    fonte.save(saida)

    eixos = [a.axisTag for a in fonte["fvar"].axes] if "fvar" in fonte else ["fixo"]
    tamanho = saida.stat().st_size // 1024
    print(f"{saida.relative_to(RAIZ)}  {tamanho} KB  eixos: {', '.join(eixos)}")


if __name__ == "__main__":
    cormorant = ORIGINAIS / "cormorant-garamond-latin.woff2"
    cormorant_italico = ORIGINAIS / "cormorant-garamond-latin-italico.woff2"
    inter = ORIGINAIS / "inter-latin.woff2"

    print("Site (vão para o navegador):")
    preparar(
        cormorant,
        FONTES / "cormorant-latin-variavel.woff2",
        {"wght": (300, 700)},
        "woff2",
    )
    preparar(
        cormorant_italico,
        FONTES / "cormorant-latin-italico.woff2",
        {"wght": (300, 700)},
        "woff2",
    )
    preparar(
        inter,
        FONTES / "inter-latin-variavel.woff2",
        {"wght": (300, 700)},
        "woff2",
        contorno_notdef=False,
    )

    print("\nCartão social (só o build lê):")
    preparar(
        cormorant,
        FONTES / "og" / "cormorant-og.ttf",
        {"wght": 400},
        None,
    )
    preparar(
        inter,
        FONTES / "og" / "inter-og.ttf",
        {"wght": 400},
        None,
        contorno_notdef=False,
    )
