# 06 — Responsividade

---

## Breakpoints

| Nome | Alias | Min-width | Dispositivo típico |
|---|---|---|---|
| Mobile | `xs` | 0 – 599px | Smartphones |
| Tablet | `sm` | 600 – 959px | Tablets, phones landscape |
| Desktop | `md` | 960 – 1279px | Laptops |
| Large Desktop | `lg` | 1280 – 1535px | Monitores |
| Wide | `xl` | 1536px+ | Ultrawide |

Implementação SCSS: `@include bp-sm`, `@include bp-md`, etc. em `src/css/tokens/_breakpoints.scss`.

Quasar: `col-12 col-sm-6 col-md-4` — mobile-first.

---

## Mobile (0 – 599px)

### Layout
- Sidebar: **overlay** (`q-drawer` com `overlay`, fechado por default)
- Header: compacto — logo + menu + ação essencial
- Page padding: `spacing.4` (16px)
- Cards: full width, stack vertical

### Navegação
- Menu hamburger abre drawer overlay
- Fechar drawer ao navegar
- Bottom nav: **não usar** (priorizar drawer — apps agro são desktop-first com suporte mobile)

### Tabelas
- Transformar em **cards list** ou scroll horizontal
- Ocultar colunas secundárias
- Ações em menu `...` (overflow)

### Formulários
- Campos full width (`col-12`)
- Botões full width para ação primária
- Sticky footer com botão salvar (opcional, forms longos)

### Ocultar
- Subtítulos longos de page header → truncar
- Colunas de tabela não essenciais
- Breadcrumbs intermediários (manter atual)
- Métricas secundárias do dashboard

---

## Tablet (600 – 959px)

### Layout
- Sidebar: overlay ou mini (72px) — preferir overlay
- Grid de métricas: 2 colunas
- Page padding: `spacing.6`

### Reorganizar
- Formulários: 2 colunas quando campo curto (nome + documento)
- Filtros: colapsáveis em `q-expansion-item`

---

## Desktop (960 – 1279px)

### Layout
- Sidebar: **fixa expandida** (260px), drawer persistente
- Grid métricas: 3-4 colunas
- Tabelas: todas colunas visíveis

### Espaçamentos
- Page padding: `spacing.6`
- Section gap: `spacing.6`

---

## Large Desktop (1280px+)

### Layout
- Conteúdo limitado a `container.max-width` (1440px)
- Centralizado ou alinhado à esquerda (preferir alinhado — padrão SaaS)
- Grid métricas: 4+ colunas auto-fit
- Espaço extra: margens laterais naturais

### Não fazer
- Esticar tabelas além de 1440px
- Adicionar colunas extras só porque há espaço

---

## Regras gerais

### Ocultar elementos

```vue
<span class="gt-sm">Texto secundário visível apenas tablet+</span>
<q-btn class="lt-md" icon="more_vert" /> <!-- overflow mobile -->
```

Quasar display helpers:
- `lt-sm`, `lt-md`, `lt-lg` — less than
- `gt-xs`, `gt-sm`, `gt-md` — greater than

### Reorganizar layout

| Componente | Mobile | Desktop |
|---|---|---|
| Page header actions | Dropdown menu | Botões inline |
| Filtros | Drawer/modal | Barra horizontal |
| Tabela ações | Icon menu | Botões visíveis |
| Tabs | Scroll horizontal | Inline |

### Navegação

| Breakpoint | Comportamento sidebar |
|---|---|
| < 960px | Overlay, fechado default |
| ≥ 960px | Persistente, aberto default |

### Espaçamentos responsivos

```scss
.agro-page {
  padding: var(--spacing-4);

  @include bp-md {
    padding: var(--spacing-6);
  }
}
```

---

## Testes mínimos

Toda feature deve ser verificada em:
- 375px (iPhone SE)
- 768px (iPad)
- 1280px (Laptop)
- 1440px (Desktop padrão)
