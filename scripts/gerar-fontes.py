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

  - Recorte de eixos. A Fraunces vem com quatro eixos variáveis: opsz, wght,
    SOFT e WONK. O `opsz` FICA — o navegador o aplica sozinho por tamanho de
    texto (font-optical-sizing: auto é o padrão), e é ele que dá calor ao nome
    da obra em corpo grande. SOFT e WONK SAEM: só funcionam com
    font-variation-settings escrito à mão, e este site não escreve. Peso morto.
  - Recorte de glifos para latim + pontuação tipográfica. O subset "latin" do
    Google já é grande; o site escreve português e inglês.

  Fraunces: 121 KB -> 58 KB. Inter: 48 KB -> 26 KB. São 85 KB a menos na
  primeira visita, sem uma diferença visível de desenho.

**Os TTF do cartão social** (src/styles/fontes/og/*.ttf). O Satori, motor por
trás do next/og, não lê woff2 e não interpola eixo variável: precisa de TTF com
o peso já fixado. Estes 74 KB nunca chegam ao navegador — só o build os lê.

Manter os dois no mesmo script é o que garante que a imagem compartilhada e a
página usem o MESMO desenho. Gerados em lugares diferentes, um dia divergem.

## De onde vêm os originais

@fontsource-variable/fraunces e @fontsource-variable/inter, v5.3.0, subset latin,
arquivo variável completo. Ambas SIL OFL 1.1 (licenças em
src/styles/fontes/LICENSE-*.txt). Para atualizar:

    npm pack @fontsource-variable/fraunces@<versao>
    tar xzf fontsource-variable-fraunces-<versao>.tgz
    cp package/files/fraunces-latin-full-normal.woff2 \\
       src/styles/fontes/originais/fraunces-latin.woff2
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


def preparar(
    entrada: Path,
    saida: Path,
    limites: dict,
    formato: str | None,
    contorno_notdef: bool = True,
) -> None:
    fonte = TTFont(entrada)
    fonte = instantiateVariableFont(fonte, limites, inplace=True, updateFontNames=False)

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
    fraunces = ORIGINAIS / "fraunces-latin.woff2"
    inter = ORIGINAIS / "inter-latin.woff2"

    print("Site (vão para o navegador):")
    preparar(
        fraunces,
        FONTES / "fraunces-latin-variavel.woff2",
        {"SOFT": 0, "WONK": 0, "opsz": (9, 144), "wght": (300, 700)},
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
        fraunces,
        FONTES / "og" / "fraunces-og.ttf",
        {"wght": 400, "opsz": 72, "SOFT": 0, "WONK": 0},
        None,
    )
    preparar(
        inter,
        FONTES / "og" / "inter-og.ttf",
        {"wght": 400},
        None,
        contorno_notdef=False,
    )
