# SEITtec GmbH — Website

Static website for **SEITtec GmbH**, an inhabergeführter Handwerksbetrieb in Essen.
Four trades from one source: Sicherheits-, Elektro-, Informations- und Telekommunikationstechnik.

Live: [www.seittec.de](https://www.seittec.de/)

## Project structure

```
seitec/
├── index.html                          Homepage
├── impressum.html
├── datenschutz.html
├── leistung-elektrotechnik.html
├── leistung-informationstechnik.html
├── leistung-sicherheitstechnik.html
├── leistung-telekommunikation.html
├── css/styles.css                      Single stylesheet (design tokens + variable fonts)
├── js/chrome.js                        Shared chrome (nav, marquee, IntersectionObserver, mobile menu)
├── fonts/                              Self-hosted variable woff2
│   ├── BricolageGrotesque-VF.woff2
│   ├── DMSans-VF.woff2
│   ├── DMSans-Italic-VF.woff2
│   └── JetBrainsMono-VF.woff2
├── media/                              Photos, favicon, stylized OSM static map
└── project/                            Original Claude Design handoff (reference only)
```

## Local development

The site is fully static — no build step, no dependencies. Open `index.html`
directly, or serve the folder:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Brand

- **Type** — Bricolage Grotesque (display), DM Sans (body, italic), JetBrains Mono (labels)
- **Palette** — petrol `#095873`, petrol-on-dark `#5BB0CF`, italic accent `#F1D8A6`, paper `#F4F0E7`, dark `#0C1218`
- **Photography** — on-site shots of the team

## External resources

The site loads **zero external resources at runtime** — all fonts, images, and
icons are self-hosted from `fonts/` and `media/`. The few outbound `https://`
links that remain are:

- Legally-required references in Impressum/Datenschutz (HwO, EU-ODR, LDI NRW)
- Social profile links (Facebook, Instagram)
- The map's "Route berechnen" CTA (Google Maps directions)
- Metadata (`<link rel="canonical">`, `<meta property="og:url">`)

None of these are fetched until the user explicitly clicks.

## Credits

- Map basemap: © [CartoDB Positron](https://carto.com/attributions) (data © OpenStreetMap contributors)
- Initial design handoff: [Claude Design](https://claude.ai/design)
