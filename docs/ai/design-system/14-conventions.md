# 14 — Convenções

---

## Nome dos componentes

| Tipo | Padrão | Exemplo |
|---|---|---|
| UI primitivo | `{Nome}.vue` PascalCase | `MetricTile.vue` |
| Shared | `App{Nome}.vue` | `AppPageHeader.vue` |
| Layout | `App{Nome}.vue` | `AppSidebar.vue` |
| Feature | `{Dominio}{Tipo}.vue` | `ClienteForm.vue`, `SafraTable.vue` |
| Page | `{Dominio}Page.vue` | `ClientesListPage.vue` |
| Layout shell | `{Contexto}Layout.vue` | `MainLayout.vue` |

Prefixo `App` = usado cross-feature. Sem prefixo = UI primitivo ou feature-specific.

---

## Props

### Nomenclatura
- Português para domínio: `titulo`, `subtitulo`, `cliente`
- Boolean: `carregando`, `desabilitado`, `visivel` (não `isLoading`)
- Eventos: `onSalvar` via emit, não prop

### Tipagem
```typescript
defineProps<{
  titulo: string;
  subtitulo?: string;
  valor: string | number;
}>();
```

### Defaults
Via `withDefaults`:
```typescript
withDefaults(defineProps<{ tamanho?: 'sm' | 'md' | 'lg' }>(), {
  tamanho: 'md',
});
```

### Regras
- Máximo ~8 props por componente — acima disso, agrupar em object prop
- Props de cor: aceitar variantes semânticas (`'primary' | 'negative'`), não hex
- Nunca passar funções de fetch como prop — componente usa composable

---

## Emits

```typescript
const emit = defineEmits<{
  salvar: [payload: ClienteForm];
  cancelar: [];
}>();
```

Nome do emit: verbo infinitivo português (`salvar`, `excluir`, `atualizar`).

---

## Estrutura de arquivo Vue

```vue
<template>
  <!-- markup -->
</template>

<script setup lang="ts">
// 1. imports externos (vue, quasar, router)
// 2. imports internos (composables, components, types)
// 3. props / emits
// 4. composables
// 5. refs / computed
// 6. functions
// 7. lifecycle hooks
</script>

<style scoped>
/* estilos com tokens CSS */
</style>
```

---

## Organização de componentes

```
components/
├── layout/     → chrome da app (sidebar, header parts)
├── shared/     → cross-feature (page header, breadcrumb)
└── ui/         → primitivos visuais (tile, badge, empty state)
```

Feature-specific: colocated com feature ou em `components/{dominio}/` quando 3+ arquivos.

---

## Imports

```typescript
// ✅ Aliases
import MetricTile from 'components/ui/MetricTile.vue';
import { useAuth } from 'composables/useAuth';

// ❌ Relativos longos
import MetricTile from '../../components/ui/MetricTile.vue';
```

Ordem: Vue/Quasar → libs → composables → components → types → utils → constants.

---

## Exports

- Componentes: `export default` via SFC (sem barrel file para components)
- Composables: `export function useX()`
- Utils: named exports
- Constants: named exports com `as const`
- **Evitar** barrel `index.ts` extenso — tree-shaking

---

## CSS / Estilos

1. Preferir classes utilitárias Quasar (`q-pa-md`, `q-gutter-sm`) para spacing rápido
2. Custom styles com tokens CSS var
3. BEM simplificado quando necessário: `.metric-tile`, `.metric-tile__value`
4. Nunca `!important` exceto override Quasar documentado

---

## Quasar customization

- Cores: via `quasar.variables.scss` → tokens
- Densidade: default (comfortable)
- Ícones: Material Icons
- Plugins usados: Notify (via composable)
- Plugins evitados: Loading (fullscreen), Dialog plugin direto (preferir q-dialog component)

---

## i18n (futuro)

Preparar strings visíveis como texto em português. Keys de breadcrumb já usam dot notation (`navegacao.dashboard`).

---

## Documentação de componente novo

Ao criar componente em `components/ui/` ou `components/shared/`:

1. Adicionar entrada em [03-components.md](./03-components.md)
2. Incluir props, estados, exemplo de uso
3. Se wrapper Quasar, documentar mapeamento de props
