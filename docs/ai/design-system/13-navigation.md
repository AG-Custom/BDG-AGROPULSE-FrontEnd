# 13 — Navegação

---

## Modelo híbrido

Sidebar lista **módulos** (~15 itens). Telas-folha ficam na **subnav horizontal** (`AppModuleSubnav`) acima do conteúdo.

Fonte única: `constants/navegacao-modulos.ts` + `composables/useNavegacaoModulos.ts`.

```
┌──────────────┐  ┌────────────────────────────────────────┐
│ AgroPulse    │  │ Header                                 │
│ Nome         │  ├────────────────────────────────────────┤
│ [Unidade ▾]  │  │ Saldos | Lotes | Movimentações | …     │  ← AppModuleSubnav
├──────────────┤  ├────────────────────────────────────────┤
│ ▣ Dashboard  │  │ Page (router-view)                     │
│ ▣ Estoque    │  │                                        │
│ ▣ Financeiro │  │                                        │
│ …            │  │                                        │
│ [⟨] collapse │  │                                        │
└──────────────┘  └────────────────────────────────────────┘
```

---

## Sidebar (`AppSidebar.vue`)

Shell **verde-floresta escuro** (`color.sidebar.bg` = forest.900) — tokens `color.sidebar.*`.

### Estrutura (MainLayout brand block)

1. Logo `inverse` (sem texto no modo collapsed 72px)
2. Nome do usuário (`color.sidebar.text`) — **sem email** na sidebar
3. `UnidadeSwitcher` compacto (oculto quando collapsed)
4. Lista de módulos (`AppSidebar`)
5. Botão collapse no rodapé do drawer

Email do usuário fica no menu de conta do **header**.

### Item de módulo

```vue
<q-item
  clickable
  :to="{ name: modulo.routeNameDestino }"
  class="app-sidebar__item"
  :class="{ 'app-sidebar__item--active': moduloAtivo?.id === modulo.id }"
>
  <q-item-section avatar>
    <q-icon :name="modulo.icon" size="20px" />
  </q-item-section>
  <q-item-section v-if="!collapsed">{{ modulo.label }}</q-item-section>
</q-item>
```

Clique no módulo navega para o **primeiro filho visível**.

### Estados
- Default: texto `color.sidebar.text.secondary`, radius `radius.md`
- Hover: background `color.sidebar.item.hover` (branco 6%), texto `color.sidebar.text`
- Ativo: background `color.sidebar.item.active.bg`, border-left `border.width.accent` `color.sidebar.accent`, texto branco, ícone accent, weight medium
- Collapsed (72px): só ícone + tooltip com o label

### Collapse

Larguras: `260px` expandido / `72px` collapsed (`--sidebar-width` / `--sidebar-width-collapsed`). Estado persistido em `localStorage` (`agropulse.sidebar.collapsed`).

### UnidadeSwitcher

Modo compacto: só o `q-select` (sem label overline). Adaptado ao fundo escuro — fundo `color.sidebar.item.hover`, bordas `color.sidebar.border`, focus `color.primary.300`.

### Permissões e flags

Filhos filtrados por `possuiPermissao` + flags (`fluxoCompleto`, `revenda`, `industria`, `industriaProducao`). Módulo oculto se nenhum filho visível.

### Deduplicação

Contas a receber / Régua / Renegociações / CRM Crédito aparecem **somente** em Cobrança e Crédito (não no Financeiro nem no CRM).

---

## Subnav de módulo (`AppModuleSubnav.vue`)

Barra horizontal acima do `<router-view>` no `MainLayout`.

- Visível apenas se o módulo ativo tiver **mais de 1** filho
- Links com underline accent no item ativo
- Scroll horizontal em viewports estreitas
- Permanece em rotas de detalhe/form do módulo (prefixo de path)

---

## Navbar / Header

`MainLayout.vue` → `q-header` + `q-toolbar`.

| Zona | Conteúdo |
|---|---|
| Left | Menu toggle + logo compacto (mobile) |
| Center | — (vazio, reservado para breadcrumb futuro) |
| Right | Notificações + `EmpresaHeaderLink` + menu conta (nome + email) + logout |

Altura: 56px. Flat, border-bottom — permanece **claro** (contraste intencional com a sidebar escura).

`EmpresaHeaderLink`: chip pill (fundo `color.bg.subtle`, borda `color.border.default`, `radius.full`, ícone `color.primary.600`, hover verde suave) que leva a Empresa/CNPJs.

---

## Breadcrumb

Meta `breadcrumb` em `router/routes.ts`:

```typescript
meta: { breadcrumb: 'Safras / Detalhe' }
```

Futuro: componente `AppBreadcrumb` abaixo do header ou no page header.

Formato: links intermediários + item atual sem link.
Separador: `/` com `color.text.tertiary`.

Mobile: mostrar apenas item atual + back button.

---

## Menu / Dropdown

`q-menu` para ações contextuais:

```vue
<q-btn flat icon="more_vert" aria-label="Mais ações">
  <q-menu>
    <q-list dense>
      <q-item clickable v-close-popup @click="editar">
        <q-item-section avatar><q-icon name="edit" /></q-item-section>
        <q-item-section>Editar</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="confirmarExclusao">
        <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
        <q-item-section class="text-negative">Excluir</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</q-btn>
```

Ações destrutivas: separador + cor negative + último item.

---

## Tabs

Para sub-navegação **dentro de uma página** (não confundir com `AppModuleSubnav`):

```vue
<q-tabs v-model="aba" align="left" active-color="primary" indicator-color="primary">
  <q-tab name="dados" label="Dados gerais" />
  <q-tab name="talhoes" label="Talhões" />
  <q-tab name="historico" label="Histórico" />
</q-tabs>
```

**Regra:** tabs de página para ≤ 6 seções. Navegação entre telas do módulo → `AppModuleSubnav`.

---

## Pagination

Server-side via `@request` do q-table. Controles abaixo da tabela, alinhados à direita.

Mobile: simplificar para prev/next + indicador "Página X de Y".

---

## Fluxo de navegação pós-ação

| Ação | Navegação |
|---|---|
| Criar entidade | Redirect para detalhe ou listagem + toast |
| Editar | Permanece na page + toast |
| Excluir | Redirect para listagem + toast |
| Cancelar form | `router.back()` ou rota definida |

Via composable — nunca router.push no service.

---

## Deep linking

Toda page de detalhe deve ser acessível via URL (`/safras/:id`).
Estado de filtros em query params quando compartilhável: `/clientes?busca=joao&status=ativo`.

---

## Anti-patterns

- Sidebar listando dezenas de telas-folha (usar módulos + subnav)
- Nav item disabled visível (ocultar via permissão)
- Duplicar o mesmo destino em dois módulos sem necessidade
- Breadcrumb com 6+ níveis
- Tabs com scroll horizontal sem indicador visual
- Logout sem confirmação em sessões com operação pendente (futuro)
