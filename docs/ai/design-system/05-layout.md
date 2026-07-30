# 05 — Layout

> Shell premium SaaS orientado ao agronegócio — limpo, eficiente, sem chrome pesado.

---

## Estrutura do app autenticado

```
┌─────────────────────────────────────────────────────────────┐
│ Header (56px) — menu, ações, conta (email), logout          │
├──────────┬──────────────────────────────────────────────────┤
│          │  Module subnav (telas do módulo)                 │
│ Sidebar  ├──────────────────────────────────────────────────┤
│ módulos  │  Page Header (título + ações)                    │
│ 260/72px │  Seções / Cards / Tabelas                        │
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
| `container.form-page` | 920px | Páginas de cadastro padrão (`.agro-page--form`) |
| `container.form-page-wide` | 1200px | Cadastros com tabelas de itens / muitas colunas (`.agro-page--form-wide`) |

Conteúdo principal usa `.agro-page` com `padding: var(--page-padding)`.

**Por quê 1440px:** dashboards agro exibem tabelas largas; 1200px é restritivo. 1440px equilibra densidade e legibilidade.

### Páginas de formulário

Cadastros autenticados **não** usam a página full-bleed. Aplicar sempre:

```vue
<!-- Padrão (~920px) -->
<q-page class="agro-page agro-page--form">

<!-- Wide (~1200px) — produto, pedido, ordem de produção, tabela de preço, etc. -->
<q-page class="agro-page agro-page--form-wide">
```

As classes limitam `.app-page-header` e `.agro-section` via `--page-form-width` (centralizados). Opt-out pontual: `.agro-section--wide` (`max-width: none`) quando uma section específica precisar estourar o container.

Modais de formulário: `min-width: 400px; max-width: 560px` (ver [03-components.md](./03-components.md) e [10-forms.md](./10-forms.md)).

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

**Contraste intencional:** o header permanece claro (surface + border-bottom) enquanto a sidebar é verde-floresta escura — a marca vive no chrome lateral, o conteúdo respira em superfícies claras.

---

## Sidebar

Shell **verde-floresta escuro** — assinatura visual brand-forward do AgroPulse.

| Propriedade | Valor |
|---|---|
| Largura expandida | `260px` (`--sidebar-width`) |
| Largura collapsed | `72px` (`--sidebar-width-collapsed`) — ícones + tooltip |
| Background | `color.sidebar.bg` (forest.900) |
| Borda | sem border-right — contraste com o conteúdo é suficiente |
| z-index | `z.sidebar` |

**Seções do drawer:**
1. Brand block (logo `inverse` + nome do usuário em `color.sidebar.text`) — **sem email**; divisor `color.sidebar.border`
2. `UnidadeSwitcher` compacto — `q-select` adaptado ao fundo escuro (ícone storefront); oculto no collapse
3. Navegação de **módulos agrupados** (estrutura do legado) — `AppSidebar.vue` / `constants/navegacao-modulos.ts`
   - Badge Revenda/Indústria
   - Dashboard
   - Grupos: Operacional, Produção, Financeiro, Relacionamento, Gestão, Base
4. Botão collapse no rodapé

**Área de conteúdo:** `AppModuleSubnav` (filhos do módulo ativo) acima do `<router-view>` — ver [13-navigation.md](./13-navigation.md).

**Item de nav (módulo):**
- Altura: 40px
- Radius: `radius.md`
- Default: texto `color.sidebar.text.secondary`
- Hover: background `color.sidebar.item.hover` (branco 6%), texto `color.sidebar.text`
- Ativo: background `color.sidebar.item.active.bg` (verde translúcido), border-left `border.width.accent` `color.sidebar.accent` (accent.400), texto branco, ícone `color.sidebar.accent`

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

### Formulário — grid por tipo de campo

```html
<div class="row q-col-gutter-md">
  <div class="col-12 col-md-6">...</div>
  <div class="col-12 col-md-6">...</div>
</div>
```

| Tipo de campo | Classes |
|---|---|
| Texto / nome / select | `col-12 col-md-6` |
| Código / sigla | `col-12 col-md-3` |
| Data | `col-12 col-md-3` |
| Quantidade / percentual | `col-12 col-md-2` ou `col-md-3` |
| Valor monetário | `col-12 col-md-3` |
| Descrição / observação / textarea | `col-12` |

### Tabela + filtros

```
┌─ Filtros (card, full width) ─────────────────────┐
├─ Tabela (card, full width) ──────────────────────┤
└─ Paginação ──────────────────────────────────────┘
```

---

## Layout de autenticação

`AuthLayout.vue` — sem sidebar/header app.

- Painel de marca (`AuthBrandPanel`, ≥1024px): gradiente `forest.800 → forest.950`, logo `inverse`, tagline Sora 2xl clara + subtagline, features com ícones `accent.400` em containers brancos translúcidos (8%) com borda `color.sidebar.border`, decoração SVG "linhas de plantio" em `primary.300` opacity 0.14 + glow radial — **sem blur**
- Área do formulário: background `color.bg.auth`
- Card (`AuthCard`): `color.surface.default`, border `color.border.default`, barra de destaque `border.width.accent`, max-width `420px`, padding `spacing.8`

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
| Superfícies brancas sobre fundo sage | Dark mode não solicitado no conteúdo |
| Dados organizados em cards flat | Cards com gradiente |
| Header flat com border-bottom | Header com blur/glass |
| Sidebar verde-floresta com tokens `color.sidebar.*` | Sidebar escura com cinza genérico ou hex hardcoded |
