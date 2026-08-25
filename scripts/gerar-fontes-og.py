"""
Gera os TTF que o cartão social usa, a partir dos MESMOS woff2 que o site serve.

Rodar só quando a tipografia mudar. NÃO faz parte do build — o resultado está
versionado em src/styles/fontes/og/ e é isso que o build consome.

    pip install fonttools brotli
    python3 scripts/gerar-fontes-og.py

Por que existe:
  O Satori (motor por trás do next/og) não lê woff2 e não interpola eixo
  variável. Precisa de TTF com peso já fixado. Converter na mão e esquecer como
  foi feito é como um arquivo de fonte vira órfão — daqui a um ano ninguém sabe
  de onde veio nem se bate com o site.

O que ele faz, e por quê:
  - fixa a instância: Fraunces em opsz 72 (é texto grande no cartão, e é o eixo
    óptico que dá calor a ela nesse tamanho), SOFT e WONK em 0, peso 400.
    Inter em peso 400. É o mesmo desenho que a página mostra.
  - subseta para latim + pontuação tipográfica. Sem isso são ~1,5 MB no
    repositório para desenhar nomes de obra em português e inglês.

Resultado: 74 KB que nunca chegam ao navegador. Só o build os lê.
"""

from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "src" / "styles" / "fontes"
DESTINO = ORIGEM / "og"

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


def gerar(entrada: Path, saida: Path, instancia: dict[str, float]) -> None:
    fonte = TTFont(entrada)
    fonte = instantiateVariableFont(fonte, instancia, inplace=True, updateFontNames=False)

    opcoes = Options()
    opcoes.layout_features = [
        "kern", "liga", "clig", "calt", "ccmp", "locl", "mark", "mkmk",
    ]
    opcoes.name_IDs = ["*"]
    opcoes.name_legacy = True
    opcoes.notdef_outline = True
    opcoes.drop_tables += ["DSIG"]

    subsetter = Subsetter(options=opcoes)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(fonte)

    fonte.flavor = None  # TTF cru: o Satori não aceita woff nem woff2.
    saida.parent.mkdir(parents=True, exist_ok=True)
    fonte.save(saida)
    print(f"{saida.relative_to(RAIZ)}  {saida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    gerar(
        ORIGEM / "fraunces-latin-variavel.woff2",
        DESTINO / "fraunces-og.ttf",
        {"wght": 400, "opsz": 72, "SOFT": 0, "WONK": 0},
    )
    gerar(
        ORIGEM / "inter-latin-variavel.woff2",
        DESTINO / "inter-og.ttf",
        {"wght": 400},
    )
