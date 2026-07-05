# 13 — Navegação

---

## Sidebar (`AppSidebar.vue`)

### Estrutura

```
┌─────────────────────┐
│ 🌿 AgroPulse        │  ← brand block (MainLayout)
│ Gestão agrícola     │
├─────────────────────┤
│ ▣ Dashboard         │  ← nav items
│ ○ Clientes          │
│ ○ Produtos          │
│ ○ Pedidos           │
│ ○ Safras            │
├─────────────────────┤
│ ⚙ Configurações     │  ← secondary nav (bottom)
└─────────────────────┘
```

### Item de navegação

```vue
<q-item clickable :to="{ name: 'dashboard' }" exact active-class="nav-item--active">
  <q-item-section avatar>
    <q-icon name="dashboard" size="20px" />
  </q-item-section>
  <q-item-section>Dashboard</q-item-section>
</q-item>
```

### Estado ativo
- Background: `color.primary.50`
- Text: `color.primary.600`, weight medium
- Icon: `color.primary.500`
- Border-left: 3px `color.primary.500` (futuro)

### Permissões
Itens filtrados por `usePermissao()` — ocultar módulos sem acesso, não mostrar disabled.

---

## Navbar / Header

`MainLayout.vue` → `q-header` + `q-toolbar`.

| Zona | Conteúdo |
|---|---|
| Left | Menu toggle (lt-md) + título/logo |
| Center | — (vazio, reservado para breadcrumb futuro) |
| Right | Notificações (futuro) + perfil + logout |

Altura: 56px. Flat, border-bottom.

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

Para sub-navegação dentro de módulo:

```vue
<q-tabs v-model="aba" align="left" active-color="primary" indicator-color="primary">
  <q-tab name="dados" label="Dados gerais" />
  <q-tab name="talhoes" label="Talhões" />
  <q-tab name="historico" label="Histórico" />
</q-tabs>
<q-separator />
<q-tab-panels v-model="aba" animated keep-alive>
  <q-tab-panel name="dados">...</q-tab-panel>
</q-tab-panels>
```

**Regra:** tabs para ≤ 6 seções. Mais que isso → sidebar secundária ou accordion.

`keep-alive` para preservar estado ao trocar aba.

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

- Sidebar com 20+ itens sem agrupamento
- Nav item disabled visível (ocultar via permissão)
- Breadcrumb com 6+ níveis
- Tabs com scroll horizontal sem indicador visual
- Logout sem confirmação em sessões com operação pendente (futuro)
