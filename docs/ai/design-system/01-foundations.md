# 01 — Foundations (Fundamentos)

> Base visual do AgroPulse. Todos os valores abaixo existem como tokens em `src/css/tokens/`.

---

## Paleta de cores

### Por que essa paleta?

O agronegócio opera entre **campo, clima e dados**. Cores frias genéricas (cinza azulado de fintech) não comunicam o domínio. A paleta AgroPulse usa verdes naturais e neutros quentes para transmitir solidez, crescimento e confiança — premium SaaS sem perder identidade agro.

---

### Primárias — Verde campo

| Token | Hex | Uso |
|---|---|---|
| `color.primary.50` | `#eef6f1` | Background sutil de destaque |
| `color.primary.100` | `#d5eadc` | Hover leve, badges |
| `color.primary.200` | `#aed9be` | Bordas ativas suaves |
| `color.primary.300` | `#7ec099` | Ícones secundários |
| `color.primary.400` | `#4fa872` | Hover de botão primário |
| `color.primary.500` | `#256d3d` | **Cor principal** — botões, links, focus |
| `color.primary.600` | `#1f5a34` | Hover/active primário |
| `color.primary.700` | `#19482a` | Texto sobre fundo claro |
| `color.primary.800` | `#133620` | Headers escuros |
| `color.primary.900` | `#0d2416` | Máximo contraste |

### Secundárias — Azul profundo

| Token | Hex | Uso |
|---|---|---|
| `color.secondary.500` | `#2f5f73` | Ações secundárias, gráficos, tags info |
| `color.secondary.700` | `#1f3f4d` | Texto sobre fundo info |

### Accent — Colheita

| Token | Hex | Uso |
|---|---|---|
| `color.accent.500` | `#c47f2c` | Destaques sazonais, KPIs de safra, CTA secundário |

**Regra:** accent em no máximo 5% da interface visível. Nunca como cor dominante.

### Neutras

| Token | Hex | Uso |
|---|---|---|
| `color.neutral.0` | `#ffffff` | Surface, cards |
| `color.neutral.50` | `#f6f8f3` | Background app |
| `color.neutral.100` | `#eef2ea` | Background alternativo |
| `color.neutral.200` | `#dce5d8` | Bordas default |
| `color.neutral.300` | `#c2cfc0` | Bordas strong, dividers |
| `color.neutral.400` | `#9aab96` | Texto disabled, placeholders |
| `color.neutral.500` | `#728070` | Texto tertiary |
| `color.neutral.600` | `#566456` | Texto secondary |
| `color.neutral.900` | `#17211a` | Texto primary |

### Semânticas

| Token | Hex | Uso |
|---|---|---|
| `color.success.500` | `#2f7d45` | Operação concluída, status ativo |
| `color.error.500` | `#b3261e` | Erros, exclusão, falha |
| `color.warning.500` | `#b7791f` | Alertas, pendências, safra em risco |
| `color.info.500` | `#2f6f95` | Informações neutras, dicas |

Cada semântica possui variantes `.50` (background) e `.700` (texto sobre `.50`).

### Superfícies e interação

| Token | Valor | Uso |
|---|---|---|
| `color.bg.default` | `neutral.50` | Fundo da aplicação |
| `color.bg.auth` | `#eef4ea` | Telas de autenticação |
| `color.surface.default` | `neutral.0` | Cards, panels, modais |
| `color.surface.sunken` | `neutral.100` | Áreas inset (filtros, sidebar sections) |
| `color.overlay` | `rgba(23,33,26,0.48)` | Backdrop de modal — **sem blur** |
| `color.hover` | `rgba(37,109,61,0.06)` | Hover genérico |
| `color.active` | `rgba(37,109,61,0.12)` | Estado pressed |
| `color.disabled.bg` | `neutral.100` | Fundo disabled |
| `color.disabled.text` | `neutral.400` | Texto disabled |
| `color.focus.ring` | `rgba(37,109,61,0.35)` | Anel de foco |

---

## Tipografia

### Fonte

**Inter** — legibilidade em dashboards densos, números tabulares, amplo suporte latin.

Fallback: `ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif`

Monospace (código, IDs): **JetBrains Mono** — apenas dados técnicos.

### Escala

| Token | Tamanho | px |
|---|---|---|
| `font.size.xs` | 0.75rem | 12 |
| `font.size.sm` | 0.875rem | 14 |
| `font.size.md` | 1rem | 16 |
| `font.size.lg` | 1.125rem | 18 |
| `font.size.xl` | 1.25rem | 20 |
| `font.size.2xl` | 1.5rem | 24 |
| `font.size.3xl` | 1.875rem | 30 |
| `font.size.4xl` | 2.25rem | 36 |

### Font Weight

| Token | Valor | Uso |
|---|---|---|
| `font.weight.regular` | 400 | Body, parágrafos |
| `font.weight.medium` | 500 | Labels, botões |
| `font.weight.semibold` | 600 | Subtítulos, headers de seção |
| `font.weight.bold` | 700 | H1, display, KPIs |

### Line Height

| Token | Valor | Uso |
|---|---|---|
| `line.height.tight` | 1.25 | Display, H1-H2 |
| `line.height.snug` | 1.375 | H3-H4 |
| `line.height.normal` | 1.5 | Body (padrão) |
| `line.height.relaxed` | 1.625 | Textos longos, descrições |

### Letter Spacing

| Token | Valor | Uso |
|---|---|---|
| `letter.spacing.tight` | -0.02em | Display, H1 |
| `letter.spacing.normal` | 0 | Body |
| `letter.spacing.wide` | 0.02em | H6, labels |
| `letter.spacing.wider` | 0.05em | Overline, badges |

### Hierarquia

| Elemento | Token composto | Quasar equivalente |
|---|---|---|
| Display | `typography.display` | — (custom `.text-display`) |
| H1 | `typography.h1` | `text-h3` a `text-h4` |
| H2 | `typography.h2` | `text-h5` |
| H3 | `typography.h3` | `text-h6` |
| H4 | `typography.h4` | `text-subtitle1` |
| H5 | `typography.h5` | `text-subtitle2` |
| H6 | `typography.h6` | `text-overline` |
| Body LG | `typography.body.lg` | `text-body1` |
| Body MD | `typography.body.md` | `text-body2` |
| Body SM | `typography.body.sm` | `text-caption` |
| Caption | `typography.caption` | `text-caption text-grey-7` |
| Overline | `typography.overline` | `.text-overline` |

---

## Espaçamentos

### Grid base: **8px**

Micro-ajustes permitidos em múltiplos de **4px** (`spacing.1` = 4px).

| Token | Valor | Uso típico |
|---|---|---|
| `spacing.0` | 0 | Reset |
| `spacing.1` | 4px | Gap ícone-texto |
| `spacing.2` | 8px | Padding interno compacto |
| `spacing.3` | 12px | Gap entre chips |
| `spacing.4` | 16px | Padding de input, gap de form |
| `spacing.5` | 20px | — |
| `spacing.6` | 24px | Padding de page, gap de seção |
| `spacing.8` | 32px | Padding de card, login panel |
| `spacing.10` | 40px | — |
| `spacing.12` | 48px | Separação de blocos |
| `spacing.16` | 64px | Hero sections |

### Aliases semânticos

| Alias | Mapeia para |
|---|---|
| `spacing.xs` | 4px |
| `spacing.sm` | 8px |
| `spacing.md` | 16px |
| `spacing.lg` | 24px |
| `spacing.xl` | 32px |
| `spacing.2xl` | 48px |

### Containers

| Token | Valor | Uso |
|---|---|---|
| `container.max-width` | 1440px | Conteúdo principal |
| `container.narrow` | 640px | Artigos, detalhes |
| `container.form` | 480px | Formulários standalone |

---

## Bordas

### Radius

| Token | Valor | Uso |
|---|---|---|
| `radius.sm` | 4px | Badges, chips pequenos |
| `radius.md` | 8px | **Padrão** — cards, inputs, buttons |
| `radius.lg` | 12px | Modais, panels grandes |
| `radius.xl` | 16px | Feature cards hero |
| `radius.full` | 9999px | Avatares, pills |

### Width

| Token | Valor |
|---|---|
| `border.width.thin` | 1px |
| `border.width.medium` | 2px (focus ring) |

### Border Colors

| Token | Uso |
|---|---|
| `color.border.default` | Bordas padrão |
| `color.border.strong` | Separadores, tabelas |
| `color.border.focus` | Focus state |
| `color.border.error` | Validação |

### Border Styles

Apenas `solid`. Sem dashed/dotted exceto upload zone.

---

## Sombras (Elevation)

Filosofia: **elevação sutil** — premium sem sombras dramáticas.

| Token | Uso |
|---|---|
| `shadow.none` | Flat — tabelas, listas |
| `shadow.xs` | Hover sutil |
| `shadow.sm` | Cards default, metric tiles |
| `shadow.md` | Dropdowns, popovers |
| `shadow.lg` | Modais, drawers |
| `shadow.xl` | Raramente — menus flutuantes grandes |

**Regra:** máximo 1 nível de elevação por viewport. Não empilhar sombras.

---

## Opacidade

| Token | Valor | Uso |
|---|---|---|
| `opacity.disabled` | 0.48 | Elementos disabled |
| `opacity.overlay` | 0.48 | Backdrop modal |

---

## Z-Index

| Token | Valor | Uso |
|---|---|---|
| `z.base` | 0 | Conteúdo |
| `z.dropdown` | 100 | Menus |
| `z.sticky` | 200 | Table headers sticky |
| `z.header` | 300 | App header |
| `z.sidebar` | 350 | Sidebar drawer |
| `z.overlay` | 400 | Backdrop |
| `z.modal` | 500 | Modais |
| `z.popover` | 600 | Popovers |
| `z.toast` | 700 | Notificações |
| `z.tooltip` | 800 | Tooltips |

---

## Breakpoints

| Nome | Token | Min-width |
|---|---|---|
| Mobile | `breakpoint.xs` | 0 |
| Tablet | `breakpoint.sm` | 600px |
| Desktop | `breakpoint.md` | 960px |
| Large Desktop | `breakpoint.lg` | 1280px |
| Wide | `breakpoint.xl` | 1536px |

Ver [06-responsiveness.md](./06-responsiveness.md) para regras detalhadas.

---

## Grid / Layout base

- **12 colunas** implícitas via CSS Grid / Quasar `row/col`
- **Gutter padrão:** `spacing.4` (16px) mobile, `spacing.6` (24px) desktop
- **Page padding:** `spacing.6` (24px), reduz para `spacing.4` em mobile
