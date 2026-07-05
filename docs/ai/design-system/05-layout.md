# 05 — Layout

> Shell premium SaaS orientado ao agronegócio — limpo, eficiente, sem chrome pesado.

---

## Estrutura do app autenticado

```
┌─────────────────────────────────────────────────────────────┐
│ Header (56px) — logo, menu toggle, ações globais, perfil   │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │  Área de conteúdo                               │
│ (260px)  │  ┌────────────────────────────────────────────┐  │
│          │  │ Page Header (título + ações)               │  │
│          │  ├────────────────────────────────────────────┤  │
│          │  │ Seções / Cards / Tabelas                   │  │
│          │  │                                            │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

Implementação: `MainLayout.vue` com `q-layout`, `q-header`, `q-drawer`, `q-page-container`.

---

## Containers

| Token | Valor | Uso |
|---|---|---|
| `container.max-width` | 1440px | Max-width do conteúdo — evita linhas longas em ultrawide |
| `container.narrow` | 640px | Detalhe, wizard |
| `container.form` | 480px | Login, recuperação senha |

Conteúdo principal usa `.agro-page` com `padding: var(--page-padding)`.

**Por quê 1440px:** dashboards agro exibem tabelas largas; 1200px é restritivo. 1440px equilibra densidade e legibilidade.

---

## Header

| Propriedade | Valor |
|---|---|
| Altura | `56px` (`header.height`) |
| Background | `color.surface.default` |
| Borda inferior | `1px color.border.default` |
| Sombra | `shadow.none` (flat premium) |
| z-index | `z.header` |

**Conteúdo:**
- Esquerda: menu toggle (mobile/tablet) + logo/nome
- Direita: ações globais (notificações futuras), perfil, logout

**Regra:** header nunca sticky com sombra pesada. Borda sutil é suficiente.

---

## Sidebar

| Propriedade | Valor |
|---|---|
| Largura expandida | `260px` |
| Largura collapsed | `72px` (futuro) |
| Background | `color.surface.default` |
| Borda | `1px color.border.default` right |
| z-index | `z.sidebar` |

**Seções:**
1. Brand block (logo + tagline) — `padding: spacing.4`
2. Navegação principal — `AppSidebar.vue`
3. Footer sidebar (versão, suporte) — opcional

**Item de nav:**
- Altura: 40px
- Padding: `spacing.2 spacing.4`
- Radius: `radius.sm`
- Ativo: background `color.primary.50`, texto `color.primary.600`, ícone `color.primary.500`
- Hover: background `color.hover`

---

## Footer

Aplicação autenticada: **sem footer global** — maximiza área de dados.

Telas públicas (login): footer mínimo opcional com copyright.

---

## Área de conteúdo

```vue
<q-page class="agro-page">
  <app-page-header titulo="..." subtitulo="..." />
  <section class="agro-section">
    <!-- conteúdo -->
  </section>
</q-page>
```

| Elemento | Token |
|---|---|
| Page padding | `page.padding` (24px) |
| Gap entre seções | `section.gap` (24px) |
| Page header margin-bottom | `spacing.5` (20px) |

---

## Grid

### Dashboard (métricas)

```css
.dashboard-grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
```

### Formulário two-column (desktop)

```html
<div class="row q-col-gutter-md">
  <div class="col-12 col-md-6">...</div>
  <div class="col-12 col-md-6">...</div>
</div>
```

### Tabela + filtros

```
┌─ Filtros (card, full width) ─────────────────────┐
├─ Tabela (card, full width) ──────────────────────┤
└─ Paginação ──────────────────────────────────────┘
```

---

## Layout de autenticação

`AuthLayout.vue` — sem sidebar/header app.

- Background: `color.bg.auth`
- Panel centralizado: max-width `420px`, padding `spacing.8`
- Card: `color.surface.default`, border `color.border.default`, radius `radius.md`

---

## Responsividade

Ver [06-responsiveness.md](./06-responsiveness.md).

Resumo:
- **Mobile:** sidebar overlay, header compacto
- **Tablet:** sidebar overlay ou mini
- **Desktop+:** sidebar fixa, drawer persistente

---

## Premium agro — diretrizes

| Fazer | Evitar |
|---|---|
| Bordas sutis + whitespace | Sombras dramáticas |
| Superfícies brancas sobre fundo sage | Dark mode não solicitado |
| Dados organizados em cards flat | Cards com gradiente |
| Header flat com border-bottom | Header com blur/glass |
| Sidebar limpa com ícones outlined | Sidebar escura pesada |
