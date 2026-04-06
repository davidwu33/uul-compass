# Stitch Design System Notes

## Key Design Decisions from Stitch Export

### Fonts
- **Headlines:** Newsreader (serif) — large editorial feel, NOT italic
- **Body/Labels:** Inter (sans-serif)
- **Monospace data:** JetBrains Mono (task codes, timestamps)

### Icons
- Material Symbols Outlined (Google) — NOT Lucide
- `font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24`
- Active nav icons use `'FILL' 1`

### Color Palette (Material 3 inspired)
- Background: #0b1325 (deep navy)
- Surface: #1a2235 (card)
- Surface Container Low: #131b2d
- Surface Container: #171f32
- Surface Container High: #222a3d
- Surface Container Highest: #2d3448
- Primary: #b4c5ff (periwinkle blue)
- Primary Container: #00389a (deep blue)
- Tertiary: #dfc299 (gold — used for accents, section labels)
- Error: #ffb4ab
- On Surface: #dbe2fb / #e8eaf0

### Typography Patterns
- Page titles: `text-5xl md:text-7xl serif-heading` — very large, editorial
- Section labels: `text-[10px] uppercase tracking-[0.2em] text-tertiary font-bold`
- Card titles: `font-headline text-lg` (Newsreader)
- Micro labels: `text-[10px] uppercase tracking-widest text-slate-500`
- Data values: `tabular-nums font-semibold`
- Task codes: `font-mono text-xs text-slate-500`

### Layout Patterns
- Sidebar: bg-slate-950, blue-900/30 active bg, border-l-4 border-blue-500 active
- Cards: bg-surface-container-low, border-t-2 for accent color, rounded-lg
- Bento grid for dashboards
- Asymmetric 2-column layouts (8+4 or 7+5 grid splits)
- Phase timeline: 3-segment horizontal bar
- Risk cards: full-width with border-l-[6px], 2-column internal (2/3 content + 1/3 metadata)

### Navigation
- Top nav: "Global Attaché" branding, tab-style links with border-b-2 active
- Sidebar nav: Serif heading, Material icons, border-l-4 active indicator
- Bottom nav: 5 tabs with active bg-blue-900/40 pill

### Key Branding
- App name in top nav: "Global Attaché"  
- Sidebar heading: "HQ Command / Global Logistics"
- App identity: "UUL Compass"
- Tertiary gold used for section labels ("Strategic performance", "Operator Queue")
