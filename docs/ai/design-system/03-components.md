# 03 — Componentes

> Base: **Quasar 2** customizado via tokens AgroPulse. Wrappers customizados em `components/ui/` quando necessário.

## Padrão de documentação

Cada componente segue: Anatomia → Estados → Variantes → Tamanhos → Comportamento → Quando usar/não usar → Exemplo.

## Estados universais

Todos os componentes interativos suportam os estados definidos em [07-states.md](./07-states.md).

---

## Button (`q-btn`)

### Anatomia
Label + ícone opcional (leading/trailing). Sem gradiente.

### Variantes

| Variante | Quasar | Uso |
|---|---|---|
| Primary | `color="primary" unelevated` | Ação principal (Salvar, Confirmar) |
| Secondary | `color="primary" outline` | Ação secundária (Cancelar fluxo alternativo) |
| Ghost | `flat color="primary"` | Ações terciárias, toolbars |
| Danger | `color="negative" unelevated` | Excluir, ações destrutivas |
| Neutral | `outline color="grey-7"` | Cancelar |

### Tamanhos

| Size | Quasar | Altura |
|---|---|---|
| SM | `size="sm"` | 32px |
| MD | default | 40px |
| LG | `size="lg"` | 48px |

### Estados
Default, Hover (`color.hover`), Active, Focus (ring), Disabled, Loading (`:loading="true"`).

### Comportamento
- **Capitalização:** labels em frase/título (`Criar nova`, `Salvar`) — **nunca** caixa alta automática. Global: `.q-btn { text-transform: none }` + `AgroBtn` com `no-caps`
- Loading substitui label por spinner — **nunca** spinner + label simultâneos
- `:disable="loading"` automático
- Transição: `duration.fast`

### Quando usar
Ações que modificam dados, confirmam fluxos, navegam.

### Quando não usar
Links inline (usar `<router-link>` ou `q-btn flat` com `to`).

### ✅ Exemplo
```vue
<q-btn color="primary" unelevated label="Salvar" :loading="salvando" @click="salvar" />
<q-btn flat label="Cancelar" @click="cancelar" />
```

### ❌ Anti-pattern
```vue
<q-btn style="background: #1e8a4a" label="Salvar" />
<q-btn glossy elevated label="Salvar" />
```

---

## Input (`q-input`)

### Anatomia
Label flutuante + field + hint/error + ícone opcional.

### Variantes
- `outlined` — **padrão AgroPulse**
- `filled` — não usar
- `borderless` — filtros inline, search bars

### Tamanhos
- **Formulários** (`.agro-formulario`): ~40px — densidade compacta padrão
- **Filtros / barras**: `dense` explícito
- Login/auth: altura padrão Quasar (mais respiração)

### Estados
Default, Focus (border `color.border.focus`), Error (`error` + `error-message`), Disabled, Readonly.

### Comportamento
- Label sempre visível ( outlined )
- Error message abaixo do field
- `lazy-rules` para validação on blur/submit

### ✅ Exemplo
```vue
<q-input
  v-model="nome"
  outlined
  label="Nome do cliente"
  hint="Razão social ou nome completo"
  :error="!!erros.nome"
  :error-message="erros.nome"
/>
```

---

## TextArea (`q-input type="textarea"`)

Mesmas regras de Input. `autogrow` para textos variáveis. Min-rows: 3.

---

## Checkbox (`q-checkbox`)

### Variantes
Default, indeterminate (seleção parcial em tabelas).

### Comportamento
Label à direita. Área clicável inclui label. Cor: `color="primary"`.

---

## Radio (`q-radio` / `q-option-group`)

Agrupados via `q-option-group`. Sempre com label visível. Vertical stack em forms.

---

## Switch (`q-toggle`)

Para configurações on/off imediatas (sem submit). Label descritivo à esquerda.

---

## Select (`q-select`)

### Variantes
`outlined`, `emit-value`, `map-options` para objetos.

### Comportamento
- Max visible options: 8 (scroll)
- `use-input` + `filter` para listas > 20 itens
- Loading: `:loading` no select, não overlay

---

## Combobox
Implementado via `q-select` com `use-input` e `@filter`. Ver Select.

---

## DatePicker (`q-date` + `q-popup-proxy`)

### Comportamento
- Input readonly + popup — nunca inline exceto filtros de relatório
- Formato display: `DD/MM/YYYY` (pt-BR)
- Range: `q-date range` para filtros de período de safra

---

## Card (`q-card`)

### Anatomia
Container flat com border. Sem imagem hero exceto empty states.

### Variantes
| Variante | Classe | Uso |
|---|---|---|
| Flat | `flat bordered` | **Padrão** — MetricTile, listagens |
| Raised | `.agro-surface-raised` | Modais de confirmação, destaque |

### Padding
`var(--card-padding)` = 24px.

### ❌ Anti-pattern
```vue
<q-card class="shadow-10"> <!-- sombra excessiva -->
```

---

## Modal (`q-dialog`)

### Anatomia
Overlay sólido + panel centralizado.

### Config
```vue
<q-dialog v-model="aberto" persistent>
  <q-card style="min-width: 400px; max-width: 560px">
    <q-card-section class="text-h6">Título</q-card-section>
    <q-card-section><!-- conteúdo --></q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" v-close-popup />
      <q-btn color="primary" unelevated label="Confirmar" />
    </q-card-actions>
  </q-card>
</q-dialog>
```

### Comportamento
- Overlay: `color.overlay` — **sem backdrop-filter**
- Animação: fade 180ms — sem scale/bounce
- `persistent` para confirmações destrutivas
- Escape fecha (exceto persistent + operação crítica)

---

## Drawer (`q-drawer`)

Sidebar app + drawers contextuais (filtros). Overlay em mobile, persistente em desktop.

Largura: `260px`. Sem animação slide longa — default Quasar OK (240ms max).

Sidebar do app usa fundo verde-floresta escuro (tokens `color.sidebar.*`) — ver [13-navigation.md](./13-navigation.md).

---

## Dialog
Alias de Modal. Mesmas regras.

---

## Toast / Notify (`Notify` via `useNotificacao`)

### Variantes

| Tipo | Quasar | Uso |
|---|---|---|
| Sucesso | `type: 'positive'` | Operação concluída |
| Erro | `type: 'negative'` | Falha |
| Aviso | `type: 'warning'` | Atenção |
| Info | `type: 'info'` | Informação neutra |

### Comportamento
- Posição: `top-right`
- Duração: 4000ms (sucesso/info), 6000ms (erro)
- Máximo 3 simultâneos
- **Sempre** via `useNotificacao()` — nunca `Notify.create` direto em components

---

## Alert (`q-banner`)

Inline, contextual, persistente. Dentro de forms/páginas — não flutuante.

```vue
<q-banner v-if="aviso" class="bg-warning-50 text-warning-700" rounded>
  Safra em período de entressafra — alguns relatórios podem estar incompletos.
</q-banner>
```

---

## Badge (`q-badge`)

Tamanho SM. Cores semânticas. Máximo 3 chars para contadores numéricos (99+).

---

## Avatar (`q-avatar`)

Círculo (`radius.full`). Fallback: iniciais do nome. Tamanhos: 32, 40, 48px.

---

## Breadcrumb

Futuro: componente `AppBreadcrumb`. Por ora, meta `breadcrumb` nas rotas.

Formato: `Safra 2025 / Clientes / João Silva` — último item não linkável.

---

## Tabs (`q-tabs` + `q-tab-panels`)

### Comportamento
- Horizontal scroll em mobile
- Indicador: linha `color.primary.500`, 2px
- Sem animação de slide entre panels (instant ou fade rápido)
- Ícone + label em desktop, só label em mobile

---

## Accordion (`q-expansion-item`)

Para filtros avançados, FAQs, seções colapsáveis. Um aberto por vez em filtros.

---

## Menu (`q-menu`)

Dropdown de ações. Trigger: botão ghost ou icon button. Sempre com `anchor`/`self` definidos.

---

## Navbar
Implementado via `q-header` + `q-toolbar` em `MainLayout.vue`.

---

## Sidebar
Implementado via `q-drawer` + `AppSidebar.vue`. Ver [13-navigation.md](./13-navigation.md).

---

## Pagination (`q-pagination`)

### Comportamento
- Boundary numbers: 1 ... 5 6 7 ... 20
- Input de página para datasets > 100 páginas
- `max-pages: 7`

---

## Table (`q-table`)

### Anatomia
Header sticky + rows + paginação + slot de filtros acima.

### Config padrão
```vue
<q-table
  flat
  bordered
  row-key="id"
  :rows="rows"
  :columns="columns"
  :loading="loading"
  :pagination="paginacao"
  @request="onRequest"
>
  <template #no-data>
    <app-empty-state titulo="Nenhum registro" />
  </template>
</q-table>
```

### Comportamento
- Primeiro carregamento: `AgroTableSkeleton` no lugar da tabela — **não** `q-inner-loading`
- Recargas: barra linear no topo (`loading` prop) — **não** overlay opaco
- Hover row: `color.hover` com transição
- Header: fundo `color.bg.subtle`, th uppercase xs semibold letter-spacing wide em `color.text.secondary`
- Células: `tabular-nums`; paginação/bottom em `color.text.secondary` sm
- Seleção: checkbox coluna esquerda
- Ações: coluna fixa direita
- Empty: componente Empty State — nunca tabela vazia sem mensagem

---

## Data Grid
Alias de Table com colunas configuráveis, filtros avançados e export. Mesmas regras + virtual scroll para > 500 rows.

---

## Tooltip (`q-tooltip`)

Delay: 400ms. Max-width: 240px. Apenas informação complementar — nunca conteúdo essencial.

---

## Popover
Implementado via `q-menu` com conteúdo rico. Max-width: 320px.

---

## Skeleton (`q-skeleton`, `AgroTableSkeleton`, `AgroFormSkeleton`)

### Wrappers AgroPulse

| Componente | Props | Uso |
|---|---|---|
| `AgroTableSkeleton` (`components/ui/`) | `linhas` (default 5), `colunas` (default 5) | Primeiro carregamento de listagens — imita tabela com header `bg.subtle` e linhas de 52px |
| `AgroFormSkeleton` (`components/ui/`) | `campos` (default 6) | Primeiro carregamento de formulários — grid 2 colunas ≥960px, label + QInput skeleton |

```vue
<agro-table-skeleton v-if="carregandoInicial" :colunas="4" />
<q-table v-else flat bordered ... />
```

### Quando usar
Carregamento de conteúdo com layout conhecido (cards, tabela, formulário, header).

### Quando não usar
- Ações de botão (usar `:loading`)
- Tela inteira (usar skeleton por seção)
- Dados que carregam < 200ms (não mostrar skeleton)
- Recargas de tabela (usar `:loading` linear do q-table)

### Comportamento
- Animação: fade/pulse sutil — sem shimmer pesado
- Formato espelha conteúdo final (retângulo para texto, quadrado para avatar)

---

## Spinner (`q-spinner`)

### Quando usar
Dentro de botões (`:loading`), inline em estados pontuais de auth (ConfirmEmail, SelecionarUnidade).

### Quando não usar
- Fullscreen overlay — **proibido**
- `q-inner-loading` em páginas de formulário/listagem — usar `AgroFormSkeleton`/`AgroTableSkeleton`
- Substituir skeleton em layouts conhecidos
- Múltiplos spinners na mesma viewport

Tamanho padrão inline: 24px. Cor: `color.primary.500`.

---

## Empty State

Componente custom `AppEmptyState` (criar em `components/ui/`).

### Anatomia
Ícone 48px (neutral.300) + título H4 + descrição body + ação opcional.

### Quando usar
Listas vazias, buscas sem resultado, módulos sem dados configurados.

### ✅ Exemplo
```vue
<div class="empty-state">
  <q-icon name="agriculture" size="48px" color="grey-4" />
  <div class="text-h6">Nenhuma safra cadastrada</div>
  <p class="text-body-sm text-grey-7">Cadastre sua primeira safra para começar.</p>
  <q-btn color="primary" unelevated label="Nova safra" :to="{ name: 'safra-nova' }" />
</div>
```

---

## MetricTile (`MetricTile.vue`)

Componente existente — tile de KPI para dashboards.

Props: `label`, `value`, `icon`, `trend?`, `accent?`.

- Ícone 24px em container 44px (`icon.bg.primary` ou `icon.bg.accent` com `accent`)
- Valor em JetBrains Mono (`typography.metric.*`) com `tabular-nums`
- Card `flat bordered` com `radius.lg` + `.agro-card-interactive`

---

## AgroLogo (`AgroLogo.vue`)

Marca AgroPulse — quadrado com gradiente `primary.400 → forest.900`, folha translúcida branca (16%) e linha de pulso (ECG) branca; wordmark em Sora com "Pulse" em `primary.600`.

Props: `size` (`sm`/`md`/`lg`), `showText` (default `true`), `inverse` (default `false`).

- `inverse` — para fundos escuros (sidebar, painel de marca): texto em `sidebar.text`, "Pulse" em `primary.300`
- Favicon derivado da marca em `public/favicon.svg`; `<meta name="theme-color" content="#0f2818">` (forest.900)

---

## AppPageHeader (`AppPageHeader.vue`)

Componente existente — título + subtítulo + slot de ações à direita, com barra de destaque `border.width.accent`.

---

## Hierarquia de componentes

```
Quasar primitivo (q-btn, q-input)
  ↓ customização via tokens/quasar.variables
AgroPulse wrapper (MetricTile, AppEmptyState) — quando padrão se repete 3+ vezes
  ↓ composição
Feature component (ClienteForm, SafraTable) — em components/ ou features/
  ↓ composição
Page
```
