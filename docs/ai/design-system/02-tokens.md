# 02 — Design Tokens

> Referência completa. Implementação em `src/css/tokens/`. **Nunca usar valores hardcoded.**

---

## Convenção de nomenclatura

```
{categoria}.{subcategoria}.{variante}.{escala?}
```

Exemplos:
- `color.primary.500`
- `spacing.md`
- `radius.lg`
- `shadow.sm`
- `typography.body.md`
- `duration.fast`

---

## Cores

### Primárias
```
color.primary.50    color.primary.100   color.primary.200
color.primary.300   color.primary.400   color.primary.500  ← base
color.primary.600   color.primary.700   color.primary.800
color.primary.900
```

### Forest (shell escuro)
```
color.forest.800  color.forest.900  color.forest.950
```

### Secundárias
```
color.secondary.50  color.secondary.100  color.secondary.200
color.secondary.300 color.secondary.400  color.secondary.500  ← base
color.secondary.600 color.secondary.700  color.secondary.800
color.secondary.900
```

### Accent
```
color.accent.50   color.accent.100   color.accent.200
color.accent.300  color.accent.400   color.accent.500  ← base
color.accent.600  color.accent.700   color.accent.800
color.accent.900
```

### Neutras
```
color.neutral.0  color.neutral.50   color.neutral.100
color.neutral.200  color.neutral.300  color.neutral.400
color.neutral.500  color.neutral.600  color.neutral.700
color.neutral.800  color.neutral.900
```

### Semânticas
```
color.success.50   color.success.500   color.success.700
color.error.50     color.error.500     color.error.700
color.warning.50   color.warning.500   color.warning.700
color.info.50      color.info.500      color.info.700
```

### Superfícies
```
color.bg.default       color.bg.subtle        color.bg.auth
color.surface.default  color.surface.raised   color.surface.sunken
color.overlay          color.hover            color.hover.strong
color.active           color.disabled.bg      color.disabled.text
color.disabled.border  color.focus.ring
```

### Sidebar (shell verde-floresta)
```
color.sidebar.bg              color.sidebar.bg.deep
color.sidebar.border          color.sidebar.text
color.sidebar.text.secondary  color.sidebar.text.muted
color.sidebar.item.hover      color.sidebar.item.active.bg
color.sidebar.item.active.text  color.sidebar.accent
```

### Texto
```
color.text.primary    color.text.secondary   color.text.tertiary
color.text.disabled   color.text.inverse
color.text.link       color.text.link.hover
```

### Bordas
```
color.border.default  color.border.strong
color.border.focus    color.border.error
```

---

## Tipografia

```
font.family.base          font.family.display       font.family.mono
font.weight.regular       font.weight.medium
font.weight.semibold      font.weight.bold
font.size.xs … font.size.4xl
line.height.tight … line.height.relaxed
letter.spacing.tight … letter.spacing.wider

typography.display
typography.h1 … typography.h6
typography.body.lg   typography.body.md   typography.body.sm
typography.caption   typography.overline
typography.metric.family  typography.metric.weight  typography.metric.letter-spacing
```

`font.family.base` = Inter · `font.family.display` = Sora · `font.family.mono` = JetBrains Mono.
Os tokens `typography.metric.*` alimentam a classe global `.text-metric` (KPIs, moedas).

---

## Espaçamento

```
spacing.0  spacing.1  spacing.2  spacing.3  spacing.4
spacing.5  spacing.6  spacing.8  spacing.10 spacing.12
spacing.16 spacing.20

spacing.xs  spacing.sm  spacing.md  spacing.lg  spacing.xl  spacing.2xl

container.max-width   container.narrow   container.form
sidebar.width         sidebar.width.collapsed
header.height         page.padding       section.gap
card.padding          form.gap
```

---

## Bordas

```
radius.none  radius.sm  radius.md  radius.lg  radius.xl  radius.full
border.width.thin  border.width.medium  border.width.accent
border.style.default
```

`radius.md` = 10px (assinatura visual). `border.width.accent` = 3px (barras de destaque).

---

## Sombras

```
shadow.none  shadow.xs  shadow.sm  shadow.md  shadow.lg  shadow.xl
shadow.card-hover  shadow.brand
opacity.disabled  opacity.overlay
```

Sombras com tint verde-floresta `rgba(10,31,18,…)` — nunca preto puro.

---

## Motion

```
duration.instant  duration.fast  duration.normal  duration.slow
ease.default  ease.in  ease.out  ease.in-out
transition.color  transition.bg  transition.border
transition.opacity  transition.transform  transition.shadow
```

---

## Z-Index

```
z.base  z.dropdown  z.sticky  z.header  z.sidebar
z.overlay  z.modal  z.popover  z.toast  z.tooltip
```

---

## Breakpoints

```
breakpoint.xs  breakpoint.sm  breakpoint.md
breakpoint.lg  breakpoint.xl
```

---

## Como usar nos arquivos

### CSS / SCSS scoped (preferido)

```vue
<style scoped>
.card {
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--card-padding);
  box-shadow: var(--shadow-sm);
}
</style>
```

### SCSS com variáveis (apenas em arquivos de tokens/theme)

```scss
@use 'css/tokens/colors' as *;

.custom {
  color: $color-primary-500;
}
```

### Quasar (cores semânticas mapeadas)

```vue
<q-btn color="primary" />      <!-- mapeia para color.primary.500 -->
<q-banner class="bg-positive" /> <!-- mapeia para color.success.500 -->
```

### ❌ Proibido

```vue
<style scoped>
.card {
  background: #ffffff;        /* PROIBIDO */
  padding: 24px;              /* PROIBIDO — usar var(--spacing-6) */
  border-radius: 8px;         /* PROIBIDO — usar var(--radius-md) */
  box-shadow: 0 2px 8px #000; /* PROIBIDO */
}
</style>
```

---

## Mapeamento Quasar ↔ Tokens

| Quasar var | Token |
|---|---|
| `$primary` | `color.primary.500` |
| `$secondary` | `color.secondary.500` |
| `$accent` | `color.accent.500` |
| `$positive` | `color.success.500` |
| `$negative` | `color.error.500` |
| `$warning` | `color.warning.500` |
| `$info` | `color.info.500` |
| `$dark` | `color.neutral.900` |
| `$generic-border-radius` | `radius.md` |

---

## Extensão de tokens

Ao adicionar novo token:

1. Definir variável SCSS em `src/css/tokens/_*.scss`
2. Exportar como CSS custom property em `:root`
3. Documentar neste arquivo
4. Nunca usar o valor raw fora de `_*.scss`
