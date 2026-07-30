# 13 — Navegação

---

## Modelo híbrido (estrutura do legado)

Sidebar espelha o menu do legado React (`Sidebar.tsx`):

1. Badge **Revenda** / **Indústria**
2. **Dashboard** (fora dos grupos)
3. Grupos overline + módulos com ícone
4. Telas-folha na **subnav horizontal** (`AppModuleSubnav`)

Fonte única: `constants/navegacao-modulos.ts` (`NAVEGACAO_GRUPOS`) + `composables/useNavegacaoModulos.ts`.

```
┌──────────────────────┐  ┌────────────────────────────────────────┐
│ AgroPulse            │  │ Header                                 │
│ Nome / Unidade       │  ├────────────────────────────────────────┤
│ [Revenda]            │  │ Pedidos | Orçamentos | PDV | …         │  ← subnav
├──────────────────────┤  ├────────────────────────────────────────┤
│ ▣ Dashboard          │  │ Page                                   │
│ OPERACIONAL          │  │                                        │
│ ▣ Vendas e Pedidos   │  │                                        │
│ ▣ Estoque            │  │                                        │
│ ▣ Compras e Fornec.  │  │                                        │
│ ▣ Logística e Transp.│  │                                        │
│ PRODUÇÃO             │  │                                        │
│ …                    │  │                                        │
└──────────────────────┘  └────────────────────────────────────────┘
```

### Grupos (igual ao legado)

| Grupo | Módulos |
|---|---|
| Operacional | Vendas e Pedidos, Estoque, Compras e Fornecedores, Logística e Transporte |
| Produção | Produção e Beneficiamento *(só indústria)*, Gestão de Safras |
| Financeiro | Financeiro, Fiscal e Tributário, Cobrança e Crédito, Contratos Agrícolas |
| Relacionamento | CRM Agrícola |
| Gestão | RH e Folha, Manutenção e Ativos, BI e Relatórios |
| Base | Cadastros Gerais, Configurações |

---

## Sidebar (`AppSidebar.vue`)

Shell **verde-floresta escuro** (`color.sidebar.bg` = forest.900) — tokens `color.sidebar.*`.

### Estrutura (MainLayout brand block)

1. Logo `inverse` (sem texto no modo collapsed 72px)
2. Nome do usuário (`color.sidebar.text`) — **sem email** na sidebar
3. `UnidadeSwitcher` compacto (oculto quando collapsed)
4. Navegação (`AppSidebar`): badge → Dashboard → grupos
5. Botão collapse no rodapé do drawer

Email do usuário fica no menu de conta do **header**.

### Badge tipo de negócio

Via `usePerfilSafras()` — Revenda (accent) ou Indústria (info). Oculto no collapse e enquanto o perfil não carrega.

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

Labels de grupo: overline uppercase (`color.sidebar.text.muted`).

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

Filhos filtrados por `possuiPermissao` + flags (`fluxoCompleto`, `revenda`, `industria`, `industriaProducao`). Módulo oculto se nenhum filho visível ou se a `flag` do módulo falhar (ex.: Produção e Beneficiamento).

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

---

## Breadcrumb

Meta `breadcrumb` em `router/routes.ts`. Futuro: `AppBreadcrumb`.

---

## Anti-patterns

- Sidebar listando dezenas de telas-folha (usar módulos + subnav)
- Inventar grupos diferentes do legado sem alinhamento com o cliente
- Nav item disabled visível (ocultar via permissão)
- Breadcrumb com 6+ níveis
