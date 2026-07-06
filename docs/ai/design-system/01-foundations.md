# 01 — Foundations (Fundamentos)

> Base visual do AgroPulse. Todos os valores abaixo existem como tokens em `src/css/tokens/`.

---

## Paleta de cores

### Por que essa paleta?

O agronegócio opera entre **campo, clima e dados**. Cores frias genéricas (cinza azulado de fintech) não comunicam o domínio. A paleta AgroPulse usa verdes naturais e neutros quentes para transmitir solidez, crescimento e confiança — premium SaaS sem perder identidade agro.

---

### Primárias — Verde campo rico

| Token | Hex | Uso |
|---|---|---|
| `color.primary.50` | `#edf7f0` | Background sutil de destaque |
| `color.primary.100` | `#d2ecdb` | Hover leve, badges |
| `color.primary.200` | `#a6d9b9` | Bordas ativas suaves |
| `color.primary.300` | `#72c294` | Ícones secundários, foco sobre fundo escuro |
| `color.primary.400` | `#3fa96a` | Hover de botão primário, gradiente do logo |
| `color.primary.500` | `#1e8a4a` | **Cor principal** — botões, links, focus |
| `color.primary.600` | `#177239` | Hover/active primário |
| `color.primary.700` | `#135c30` | Texto sobre fundo claro |
| `color.primary.800` | `#0f4525` | Headers escuros |
| `color.primary.900` | `#0b2f1a` | Máximo contraste |

### Forest — Shell escuro

Família dedicada ao chrome escuro brand-forward: sidebar e painel de marca do login.

| Token | Hex | Uso |
|---|---|---|
| `color.forest.800` | `#143321` | Início de gradiente do painel de marca |
| `color.forest.900` | `#0f2818` | Background da sidebar (`--color-sidebar-bg`), theme-color |
| `color.forest.950` | `#0a1f12` | Fundo mais profundo (`--color-sidebar-bg-deep`), fim de gradiente |

### Secundárias — Azul profundo

| Token | Hex | Uso |
|---|---|---|
| `color.secondary.500` | `#2f5f73` | Ações secundárias, gráficos, tags info |
| `color.secondary.700` | `#1f3f4d` | Texto sobre fundo info |

Escala completa `50–900` disponível como CSS vars (`--color-secondary-*`).

### Accent — Colheita

| Token | Hex | Uso |
|---|---|---|
| `color.accent.400` | `#e3a03c` | Indicador de nav ativo, ícones sobre fundo escuro (`--color-sidebar-accent`) |
| `color.accent.500` | `#d98a20` | Destaques sazonais, KPIs de safra, CTA secundário |

Escala completa `50–900` disponível como CSS vars (`--color-accent-*`): 50 `#fdf5ea`, 100 `#fae7c9`, 200 `#f4d09a`, 300 `#ecb666`, 400 `#e3a03c`, 500 `#d98a20`, 600 `#ad6b18`, 700 `#8b5514`, 800 `#693f0f`, 900 `#4a2c0b`.

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

Cada semântica possui variantes `.50` (background) e `.700` (texto sobre `.50`). `color.success.700` = `#177239` — alinhado ao `primary.600`.

### Superfícies e interação

| Token | Valor | Uso |
|---|---|---|
| `color.bg.default` | `neutral.50` | Fundo da aplicação |
| `color.bg.auth` | `#eef4ea` | Telas de autenticação |
| `color.surface.default` | `neutral.0` | Cards, panels, modais |
| `color.surface.sunken` | `neutral.100` | Áreas inset (filtros, sidebar sections) |
| `color.overlay` | `rgba(10,31,18,0.5)` | Backdrop de modal — **sem blur** |
| `color.hover` | `rgba(30,138,74,0.06)` | Hover genérico |
| `color.hover.strong` | `rgba(30,138,74,0.1)` | Hover mais evidente |
| `color.active` | `rgba(30,138,74,0.12)` | Estado pressed |
| `color.disabled.bg` | `neutral.100` | Fundo disabled |
| `color.disabled.text` | `neutral.400` | Texto disabled |
| `color.focus.ring` | `rgba(30,138,74,0.35)` | Anel de foco |

### Sidebar (shell verde-floresta)

Tokens dedicados ao chrome escuro — nunca reutilizar tokens de texto/borda claros na sidebar.

| Token | Valor | Uso |
|---|---|---|
| `color.sidebar.bg` | `forest.900` (`#0f2818`) | Background da sidebar |
| `color.sidebar.bg.deep` | `forest.950` (`#0a1f12`) | Fundo mais profundo |
| `color.sidebar.border` | `rgba(255,255,255,0.08)` | Divisores internos |
| `color.sidebar.text` | `#e6f0e8` | Texto principal (nome do usuário) |
| `color.sidebar.text.secondary` | `#a3bfa9` | Texto secundário (email, nav em repouso) |
| `color.sidebar.text.muted` | `#7d9a84` | Labels overline de seção |
| `color.sidebar.item.hover` | `rgba(255,255,255,0.06)` | Hover de nav item |
| `color.sidebar.item.active.bg` | `rgba(63,169,106,0.18)` | Background do nav item ativo |
| `color.sidebar.item.active.text` | `#ffffff` | Texto do nav item ativo |
| `color.sidebar.accent` | `accent.400` (`#e3a03c`) | Indicador border-left e ícone do item ativo |

---

## Tipografia

### Fontes

| Papel | Fonte | Weights (Google Fonts) | Uso |
|---|---|---|---|
| Display/headings | **Sora** | 500/600/700/800 | `typography.display`, H1–H3, wordmark do logo, taglines |
| Corpo | **Inter** | 400/500/600/700 | Body, labels, formulários, tabelas |
| Dados numéricos | **JetBrains Mono** | 500/600 | KPIs, moedas, valores de métricas (`.text-metric`) |

Fallback base: `ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif`

As três famílias são carregadas via Google Fonts em `index.html`.

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
| Metric | `typography.metric` | — (custom `.text-metric`) |

### Metric — valores numéricos de dados

KPIs, moedas e valores de métricas usam JetBrains Mono via classe global `.text-metric` (`app.scss`):

| Token | Valor |
|---|---|
| `typography.metric.family` | `font.family.mono` (JetBrains Mono) |
| `typography.metric.weight` | 600 |
| `typography.metric.letter-spacing` | -0.02em |

A classe inclui `font-variant-numeric: tabular-nums` para alinhamento de dígitos.

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
| `radius.sm` | 6px | Badges, chips pequenos |
| `radius.md` | 10px | **Padrão (assinatura visual)** — cards, inputs, buttons |
| `radius.lg` | 14px | Modais, panels grandes, MetricTile |
| `radius.xl` | 18px | Feature cards hero |
| `radius.full` | 9999px | Avatares, pills, chip da empresa no header |

O `radius.md` (10px) é alinhado às variáveis Quasar `$generic-border-radius`, `$button-border-radius` e `$input-border-radius` — sem divergência entre tokens e Quasar.

### Width

| Token | Valor |
|---|---|
| `border.width.thin` | 1px |
| `border.width.medium` | 2px (focus ring) |
| `border.width.accent` | 3px (barras de destaque: AuthCard, AppPageHeader, nav ativo, card CNPJ principal) |

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

Filosofia: **elevação sutil** — premium sem sombras dramáticas. Todas as sombras usam tint verde-floresta `rgba(10,31,18,…)` em vez de preto puro.

| Token | Uso |
|---|---|
| `shadow.none` | Flat — tabelas, listas |
| `shadow.xs` | Hover sutil |
| `shadow.sm` | Cards default, metric tiles |
| `shadow.md` | Dropdowns, popovers |
| `shadow.lg` | Modais, drawers |
| `shadow.xl` | Raramente — menus flutuantes grandes |
| `shadow.card.hover` | Cards interativos em hover — `0 4px 12px rgba(30,138,74,0.1) + 0 2px 4px rgba(10,31,18,0.04)` |
| `shadow.brand` | Painéis de marca — `0 8px 24px rgba(15,40,24,0.08)` |

**Regra:** máximo 1 nível de elevação por viewport. Não empilhar sombras.

---

## Opacidade

| Token | Valor | Uso |
|---|---|---|
| `opacity.disabled` | 0.48 | Elementos disabled |
| `opacity.overlay` | 0.5 | Backdrop modal |

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
