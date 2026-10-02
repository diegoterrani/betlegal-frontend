# Bet Legal — Brand Kit v1

Marca: **Direção 1 “Tesoura barrada”** + **Sistema antipirataria**.
Posicionamento: *Observatório contra o mercado ilegal de apostas.*

Abra `index.html` para ver todas as peças.

## Estrutura

```
logo/            logo completa (com descritor), compacta e símbolo — dark e light, SVG + PNG @2x
icons/           favicon.svg, favicon.ico (16/32/48), apple-touch-icon (180), icon-192/512, site.webmanifest
antipirataria/   selo pirata (dark/light/âmbar), proibição (contorno/cheio), badge, CTA, carimbo
social/          og:image da home e template por domínio (SVG editável + PNG 1200×630)
react/           BetLegalLogo, PirateBadge, TakedownBadge, ReportPirateButton, SkullBan, BanIcon
css/             tokens de cor e fonte
```

Todos os textos dos SVGs já estão convertidos em curvas (Inter 700 / JetBrains Mono). Não dependem de fonte instalada.

## Implementação no bet-legal.org

1. Copie `icons/*` para `public/icons/` e `logo/*.svg` para `src/assets/brand/`.
2. No `index.html`:

```html
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icons/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/icons/site.webmanifest">
<meta name="theme-color" content="#0c0c0d">
<meta property="og:image" content="https://bet-legal.org/social/og-image-home.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="Observatório independente contra o mercado ilegal de apostas no Brasil. Acompanhe, com dados oficiais, o crescimento dos sites não autorizados desde a MP de 25/09/2026.">
```

3. Substituições na UI:
   - Hero: `logo-dark-*.png` → `<BetLegalLogo variant="full" />`
   - Header: texto “Início” → `<BetLegalLogo variant="compact" className="h-7 w-auto" />` (ou `symbol` no mobile)
   - Radar / listas: domínio não autorizado → `<PirateBadge domain="…" />`
   - “ficou fora do ar” → `<TakedownBadge />`
   - “Reporte o site” → `<ReportPirateButton />`
   - Marca d’água dos gráficos: texto “Bet-Legal.org” → `bet-legal-symbol-*.svg` com ~12% de opacidade
4. `og:image` dinâmica: `social/og-image-dominio-template.svg` é o layout para as páginas de cada domínio. Gere o PNG no build ou sob demanda (por exemplo, com Satori/resvg), trocando o domínio, a data e os números. Na home, atualize o contador “+692” diariamente.

## Paleta (significado fixo)

| Token | Dark | Light | Uso |
|---|---|---|---|
| `--bl-ink` | `#fafafa` | `#141416` | texto e **mercado legal** |
| `--bl-ilegal` | `#f59e0b` | `#d97706` | **mercado ilegal / sites piratas** (cor protagonista) |
| `--bl-alerta` | `#f87171` | `#dc2626` | **MP, proibição, takedown, CTA de denúncia** |
| `--bl-bg` | `#0c0c0d` | `#f5f5f3` | fundo |
| `--bl-muted` | `#8e8e92` | `#6b6b70` | descritores, legendas |

O azul da logo antiga sai. O verde fica só para status “autorizada” dentro dos dados, nunca na marca.

## Regras de uso

- **Tamanho mínimo:** logo completa com 180 px de largura (abaixo disso, use a compacta); compacta com 24 px de altura; abaixo disso, use o símbolo ou o favicon.
- **Área de respiro:** a altura da letra “b” em volta de toda a logo.
- **Descritor:** “OBSERVATÓRIO **CONTRA** O MERCADO ILEGAL”, com “CONTRA” sempre em vermelho.
- **Caveira sempre barrada.** Nunca usar a caveira sozinha, sem o sinal de proibição.
- Não recolorir o símbolo, não girar, não trocar a ordem das linhas (a branca cai, a âmbar sobe).
- **Não imitar comunicação oficial.** Carimbo e selo nunca levam brasão, “gov.br”, Anatel ou o layout da página de bloqueio oficial.
- **Linguagem:** “site pirata” na comunicação; “não autorizado / fora de lista oficial” nos dados e nas fichas.

## Regerar

`_source/build.py` (requer `npm pack @fontsource/inter @fontsource/jetbrains-mono` e `pip install fonttools brotli cairosvg pillow`) gera todas as peças a partir das fontes. Para mudar os números da og:image da home, edite `og_home()` e rode de novo.
