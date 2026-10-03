import os, io
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "bet-legal-brand-kit")
for d in ["logo", "icons", "antipirataria", "social", "react"]:
    os.makedirs(os.path.join(OUT, d), exist_ok=True)

INTER = TTFont(os.path.join(HERE, "fontsource-inter/files/inter-latin-700-normal.woff2"))
MONO = TTFont(os.path.join(HERE, "fontsource-jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2"))
MONO5 = TTFont(os.path.join(HERE, "fontsource-jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2"))

def text_path(font, s, size, x=0, y=0, ls=0):
    """Converte texto em path SVG. Retorna (d, largura)."""
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font["head"].unitsPerEm
    hmtx = font["hmtx"]; sc = size / upm
    pen = SVGPathPen(gs); cx = x
    for ch in s:
        g = cmap.get(ord(ch))
        if g is None: continue
        tp = TransformPen(pen, (sc, 0, 0, -sc, cx, y))
        gs[g].draw(tp)
        cx += hmtx[g][0] * sc + ls
    return pen.getCommands(), cx - x - ls

# ---------- paleta ----------
C = dict(ink_dark="#fafafa", ink_light="#141416", amber="#f59e0b", amber_l="#d97706",
         red="#f87171", red_l="#dc2626", bg="#0c0c0d", card="#17171a", muted="#8e8e92", muted_l="#6b6b70")

def mark(ink, amber, red):
    return f'''<g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <line x1="30" y1="4" x2="30" y2="62" stroke="{red}" stroke-width="2.5" stroke-dasharray="3 4"/>
  <path d="M4 16 L18 16 L36 46 L56 52" stroke="{ink}" stroke-width="5.5"/>
  <path d="M4 54 L18 52 L36 24 L48 17" stroke="{amber}" stroke-width="5.5"/>
  <circle cx="60" cy="11" r="9" stroke="{red}" stroke-width="3.5"/>
  <line x1="53.6" y1="4.6" x2="66.4" y2="17.4" stroke="{red}" stroke-width="3.5"/>
</g>'''

def logo(theme, descriptor=True):
    ink = C["ink_dark"] if theme == "dark" else C["ink_light"]
    amber = C["amber"] if theme == "dark" else C["amber_l"]
    red = C["red"] if theme == "dark" else C["red_l"]
    muted = C["muted"] if theme == "dark" else C["muted_l"]
    wx = 84
    d_word, w_word = text_path(INTER, "bet legal", 40, wx, 44, -1.2)
    body = f'<g transform="translate(2,4)">{mark(ink, amber, red)}</g>\n<path d="{d_word}" fill="{ink}"/>'
    width = wx + w_word + 4; height = 70
    if descriptor:
        parts = [("OBSERVATÓRIO ", muted), ("CONTRA", red), (" O MERCADO ILEGAL", muted)]
        cx = wx + 2; total = 0
        # ajusta o tamanho do descritor para caber sob o wordmark
        size = 9.6; ls = 1.3
        for t, col in parts:
            d, w = text_path(MONO, t, size, cx, 64, ls)
            body += f'\n<path d="{d}" fill="{col}"/>'
            cx += w + ls
        width = max(width, cx + 4); height = 70
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {height}" width="{width*2:.0f}" height="{height*2}" role="img" aria-label="Bet Legal">\n<title>Bet Legal</title>\n{body}\n</svg>\n'

def symbol(theme):
    ink = C["ink_dark"] if theme == "dark" else C["ink_light"]
    amber = C["amber"] if theme == "dark" else C["amber_l"]
    red = C["red"] if theme == "dark" else C["red_l"]
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 70" width="148" height="140" role="img" aria-label="Bet Legal"><g transform="translate(2,4)">{mark(ink, amber, red)}</g></svg>\n'

# favicons (desenhos otimizados por tamanho)
FAV64 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17171a"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22 L18 22 L34 42 L54 48" stroke="#fafafa" stroke-width="6"/><path d="M8 48 L18 46 L32 28 L38 24" stroke="#f59e0b" stroke-width="6"/><circle cx="47" cy="18" r="9" stroke="#f87171" stroke-width="4"/><line x1="40.6" y1="11.6" x2="53.4" y2="24.4" stroke="#f87171" stroke-width="4"/></g></svg>'''
FAV32 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17171a"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24 L34 42 L54 48" stroke="#fafafa" stroke-width="8"/><path d="M8 48 L30 30" stroke="#f59e0b" stroke-width="8"/><circle cx="45" cy="19" r="11" stroke="#f87171" stroke-width="6"/><line x1="37.2" y1="11.2" x2="52.8" y2="26.8" stroke="#f87171" stroke-width="6"/></g></svg>'''
FAV16 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17171a"/><g fill="none" stroke-linecap="round"><path d="M8 50 L28 32" stroke="#f59e0b" stroke-width="12"/><circle cx="42" cy="22" r="14" stroke="#f87171" stroke-width="9"/><line x1="32" y1="12" x2="52" y2="32" stroke="#f87171" stroke-width="9"/></g></svg>'''
# ícone "full-bleed" para apple-touch/maskable (sem cantos arredondados, com margem segura)
APPLE = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#17171a"/><g transform="translate(6.4 6.4) scale(.8)" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="30" y1="8" x2="30" y2="58" stroke="#f87171" stroke-width="2.5" stroke-dasharray="3 4"/><path d="M8 22 L18 22 L34 42 L54 48" stroke="#fafafa" stroke-width="6"/><path d="M8 48 L18 46 L32 28 L38 24" stroke="#f59e0b" stroke-width="6"/><circle cx="47" cy="18" r="9" stroke="#f87171" stroke-width="4"/><line x1="40.6" y1="11.6" x2="53.4" y2="24.4" stroke="#f87171" stroke-width="4"/></g></svg>'''

def skullban(ink="#fafafa", red="#f87171", size=64):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="{size}" height="{size}" role="img" aria-label="Site pirata">
<g transform="translate(32 32) scale(.68) translate(-32 -30)">
<g stroke="{ink}" stroke-width="6.5" stroke-linecap="round"><line x1="12" y1="42" x2="52" y2="62"/><line x1="12" y1="62" x2="52" y2="42"/></g>
<path fill-rule="evenodd" d="M32 6 C19 6 12 16 12 26 C12 33 16 38 21 40 V47 H43 V40 C48 38 52 33 52 26 C52 16 45 6 32 6 Z M17.5 27 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0 Z M33.5 27 a6.5 6.5 0 1 0 13 0 a6.5 6.5 0 1 0 -13 0 Z M32 33 L29 40 H35 Z" fill="{ink}"/>
</g>
<circle cx="32" cy="32" r="27" fill="none" stroke="{red}" stroke-width="5"/>
<line x1="13" y1="13" x2="51" y2="51" stroke="{red}" stroke-width="5" stroke-linecap="round"/>
</svg>
'''

def ban_icon(color, size=64, fill=False):
    if fill:
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="{size}" height="{size}"><circle cx="32" cy="32" r="29" fill="{color}"/><circle cx="32" cy="32" r="19" fill="none" stroke="#0c0c0d" stroke-width="6"/><line x1="18.6" y1="18.6" x2="45.4" y2="45.4" stroke="#0c0c0d" stroke-width="6" stroke-linecap="round"/></svg>\n'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="{size}" height="{size}"><circle cx="32" cy="32" r="26" fill="none" stroke="{color}" stroke-width="6"/><line x1="13.6" y1="13.6" x2="50.4" y2="50.4" stroke="{color}" stroke-width="6" stroke-linecap="round"/></svg>\n'

def carimbo(domain="brbetbr.com"):
    d1, w1 = text_path(MONO, "SITE PIRATA DETECTADO", 18, 0, 0, 3)
    d2, w2 = text_path(MONO5, "NÃO AUTORIZADO · FORA DE LISTA OFICIAL", 11, 0, 0, 1.2)
    d3, w3 = text_path(MONO5, domain, 13, 0, 0, 0.4)
    W = 340
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 124" width="{W*2}" height="248" role="img" aria-label="Site pirata detectado">
<g transform="rotate(-5 {W/2} 62)">
<rect x="8" y="14" width="{W-16}" height="96" rx="9" fill="none" stroke="#f87171" stroke-width="3.2"/>
<rect x="14" y="20" width="{W-28}" height="84" rx="6" fill="none" stroke="#f87171" stroke-width="1.2" opacity=".6"/>
<path transform="translate({(W-w1)/2} 50)" d="{d1}" fill="#f87171"/>
<path transform="translate({(W-w2)/2} 72)" d="{d2}" fill="#c7c7cb"/>
<path transform="translate({(W-w3)/2} 94)" d="{d3}" fill="#f59e0b"/>
</g></svg>
'''

def badge(domain="brbetbr.com"):
    d, w = text_path(MONO5, domain + " · pirata", 12, 0, 0, 0.2)
    W = w + 44
    sk = skullban("#f59e0b", "#f87171").split("\n", 1)[1].rsplit("</svg>", 1)[0]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} 28" width="{W*2:.0f}" height="56">
<rect x=".75" y=".75" width="{W-1.5:.1f}" height="26.5" rx="13.25" fill="rgba(245,158,11,.08)" stroke="rgba(245,158,11,.5)" stroke-width="1.5"/>
<svg x="6" y="4" width="20" height="20" viewBox="0 0 64 64">{sk}</svg>
<path transform="translate(32 18.5)" d="{d}" fill="#f59e0b"/>
</svg>
'''

def cta():
    d, w = text_path(INTER, "Denunciar site pirata", 15, 0, 0, 0)
    W = w + 60
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} 44" width="{W*2:.0f}" height="88">
<rect width="{W:.1f}" height="44" rx="10" fill="#f87171"/>
<g transform="translate(16 13) scale(.28)"><circle cx="32" cy="32" r="26" fill="none" stroke="#0c0c0d" stroke-width="7"/><line x1="14" y1="14" x2="50" y2="50" stroke="#0c0c0d" stroke-width="7" stroke-linecap="round"/></g>
<path transform="translate(42 27.5)" d="{d}" fill="#0c0c0d"/>
</svg>
'''

def og_home():
    lg = logo("dark").split("\n", 2)[2].rsplit("</svg>", 1)[0]
    t1, _ = text_path(INTER, "+692", 150, 0, 0, -6)
    t2, _ = text_path(INTER, "sites de apostas não autorizados online", 34, 0, 0, -0.5)
    t3, _ = text_path(MONO5, "DESDE A MP DE 25.09.2026  ·  248 AUTORIZADAS SAEM DO AR EM 06.10", 17, 0, 0, 1)
    t4, _ = text_path(MONO, "BET-LEGAL.ORG", 18, 0, 0, 2)
    sk = skullban("#fafafa", "#f87171").split("\n", 1)[1].rsplit("</svg>", 1)[0]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<rect width="1200" height="630" fill="#0c0c0d"/>
<g opacity=".18" fill="none" stroke-linecap="round" stroke-linejoin="round">
 <path d="M720 250 L850 250 L960 470 L1200 520" stroke="#fafafa" stroke-width="14"/>
 <path d="M720 580 L850 560 L960 330 L1200 230" stroke="#f59e0b" stroke-width="14"/>
</g>
<line x1="905" y1="230" x2="905" y2="600" stroke="#f87171" stroke-width="3" stroke-dasharray="8 10" opacity=".5"/>
<g transform="translate(80 70) scale(1.6)">{lg}</g>
<path transform="translate(76 360)" d="{t1}" fill="#f59e0b"/>
<path transform="translate(82 420)" d="{t2}" fill="#fafafa"/>
<path transform="translate(82 470)" d="{t3}" fill="#8e8e92"/>
<svg x="1000" y="60" width="130" height="130" viewBox="0 0 64 64">{sk}</svg>
<path transform="translate(82 560)" d="{t4}" fill="#c7c7cb"/>
</svg>
'''

def og_domain(domain="brbetbr.com"):
    lg = logo("dark", descriptor=False).split("\n", 2)[2].rsplit("</svg>", 1)[0]
    c = carimbo(domain).split("\n", 1)[1].rsplit("</svg>", 1)[0]
    t1, _ = text_path(MONO, domain, 64, 0, 0, 0)
    t2, _ = text_path(INTER, "não consta em nenhuma lista oficial de autorização", 30, 0, 0, -0.4)
    t3, _ = text_path(MONO5, "DETECTADO PELO RADAR BET LEGAL  ·  27.09.2026", 16, 0, 0, 1)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<rect width="1200" height="630" fill="#0c0c0d"/>
<g transform="translate(80 64) scale(1.2)">{lg}</g>
<path transform="translate(80 300)" d="{t1}" fill="#f59e0b"/>
<path transform="translate(82 352)" d="{t2}" fill="#fafafa"/>
<path transform="translate(82 396)" d="{t3}" fill="#8e8e92"/>
<svg x="640" y="400" width="500" height="182" viewBox="0 0 340 124">{c}</svg>
</svg>
'''

def w(path, s):
    with open(os.path.join(OUT, path), "w", encoding="utf-8") as f: f.write(s)

def png(svg, path, size=None, wh=None):
    kw = {}
    if size: kw = dict(output_width=size, output_height=size)
    if wh: kw = dict(output_width=wh[0], output_height=wh[1])
    cairosvg.svg2png(bytestring=svg.encode(), write_to=os.path.join(OUT, path), **kw)

# logos
w("logo/bet-legal-logo-dark.svg", logo("dark"))
w("logo/bet-legal-logo-light.svg", logo("light"))
w("logo/bet-legal-logo-dark-compact.svg", logo("dark", False))
w("logo/bet-legal-logo-light-compact.svg", logo("light", False))
w("logo/bet-legal-symbol-dark.svg", symbol("dark"))
w("logo/bet-legal-symbol-light.svg", symbol("light"))
png(logo("dark"), "logo/bet-legal-logo-dark@2x.png"); png(logo("light"), "logo/bet-legal-logo-light@2x.png")

# icons
w("icons/favicon.svg", FAV64)
p16, p32, p48 = [os.path.join(OUT, f"icons/_f{s}.png") for s in (16, 32, 48)]
png(FAV16, "icons/_f16.png", 16); png(FAV32, "icons/_f32.png", 32); png(FAV64, "icons/_f48.png", 48)
imgs = [Image.open(p) for p in (p16, p32, p48)]
imgs[2].save(os.path.join(OUT, "icons/favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[:2])
for p in (p16, p32, p48): os.remove(p)
png(APPLE, "icons/apple-touch-icon.png", 180)
png(APPLE, "icons/icon-192.png", 192); png(APPLE, "icons/icon-512.png", 512)
w("icons/site.webmanifest", '''{
  "name": "Bet Legal — Observatório contra o mercado ilegal de apostas",
  "short_name": "Bet Legal",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "theme_color": "#0c0c0d",
  "background_color": "#0c0c0d",
  "display": "standalone"
}
''')

# antipirataria
w("antipirataria/selo-pirata-dark.svg", skullban("#fafafa", "#f87171"))
w("antipirataria/selo-pirata-light.svg", skullban("#141416", "#dc2626"))
w("antipirataria/selo-pirata-ambar.svg", skullban("#f59e0b", "#f87171"))
w("antipirataria/proibicao-contorno.svg", ban_icon("#f87171"))
w("antipirataria/proibicao-cheio-derrubado.svg", ban_icon("#f87171", fill=True))
w("antipirataria/badge-site-pirata.svg", badge())
w("antipirataria/cta-denunciar.svg", cta())
w("antipirataria/carimbo-site-pirata.svg", carimbo())

# social
png(og_home(), "social/og-image-home.png", wh=(1200, 630)); w("social/og-image-home.svg", og_home())
png(og_domain(), "social/og-image-dominio-exemplo.png", wh=(1200, 630)); w("social/og-image-dominio-template.svg", og_domain())
print("ok")
