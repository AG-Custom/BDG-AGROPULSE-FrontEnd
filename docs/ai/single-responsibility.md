# Responsabilidade Única no Frontend AgroPulse

> Princípio fundamental: **cada arquivo, função e componente deve ter exatamente um motivo para mudar.**

Este documento traduz o Single Responsibility Principle (SRP) para o contexto Vue 3 + Pinia do AgroPulse, com exemplos concretos do projeto e antipadrões a evitar.

---

## Por que SRP importa no frontend?

Frontend "funcional" rapidamente vira monólito de UI quando:

- Componentes acumulam fetch + validação + formatação + navegação
- Hooks/composables viram "god objects" com 300 linhas
- Services disparam toasts e redirecionam rotas
- Stores renderizam lógica de apresentação

**Consequências:** bugs difíceis de rastrear, testes impossíveis, refactors arriscados, IA gerando código cada vez mais acoplado.

**Benefício do SRP:** mudança em regra de API afeta só o service; mudança visual afeta só o componente; mudança de fluxo de auth afeta store + composable, nunca 15 pages.

---

## Mapa de responsabilidades

| Artefato | Responsabilidade única | Muda quando... |
|---|---|---|
| **Componente Vue** | Renderizar UI e emitir eventos | Design, layout, interação visual muda |
| **Page** | Compor tela e conectar composables | Nova tela ou fluxo de navegação da rota |
| **Layout** | Estrutura shell (header, drawer, slot) | Chrome da aplicação muda |
| **Composable** | Expor API reativa conveniente para UI | Forma como UI consome estado/ações muda |
| **Store** | Manter e mutar estado global | Regras de estado compartilhado mudam |
| **Service** | Executar operação de dados (I/O) | Contrato da API muda |
| **Util** | Transformar dados (função pura) | Regra de formatação/validação pura muda |
| **Constant** | Definir valor imutável | Valor de configuração/permissão muda |
| **Router guard** | Controlar acesso a rotas | Regra de auth/permissão de navegação muda |
| **Boot** | Configurar infra na inicialização | Setup de HTTP/plugins muda |

---

## Componentes Vue

### Responsabilidade

**Apresentar dados e capturar interações.** Nada mais.

### Deve conter

- Template declarativo
- Props tipadas (`defineProps`)
- Emits tipados (`defineEmits`) quando necessário
- Estilos scoped
- Estado local **estritamente de UI** (hover, expanded, input buffer antes de submit)
- Chamadas a composables para obter dados/ações

### Não deve conter

- Chamadas HTTP
- Regras de negócio (cálculos de safra, impostos, descontos)
- Acesso direto a localStorage
- Lógica de permissão complexa (usar composable)
- Formatação complexa inline no template

### ✅ Correto — Componente puro

```vue
<!-- components/ui/MetricTile.vue -->
<template>
  <q-card flat bordered class="metric-tile">
    <q-card-section>
      <div class="text-caption text-grey-7">{{ label }}</div>
      <div class="text-h5 text-weight-semibold">{{ value }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>
```

**Por quê está correto:** recebe dados prontos, renderiza. Pode ser usado em dashboard, relatórios, qualquer contexto.

### ❌ Incorreto — Componente busca próprios dados

```vue
<script setup lang="ts">
import { api } from 'boot/axios';
import { onMounted, ref } from 'vue';

const total = ref(0);

onMounted(async () => {
  const { data } = await api.get('/dashboard/metricas');
  total.value = data.pedidos;
});
</script>
```

**Problemas:**
1. Acoplado à API — quebra se endpoint mudar
2. Impossível reutilizar com dados diferentes
3. Dificulta loading/error states centralizados
4. Viola fluxo Component → Composable → Store → Service

### ❌ Incorreto — Regra de negócio no template

```vue
<template>
  <span>
    {{ pedido.itens.reduce((s, i) => s + i.preco * i.qtd, 0) * (1 - pedido.descontoPercentual / 100) }}
  </span>
</template>
```

**Correção:**

```typescript
// utils/pedidos.ts
export function calcularTotalPedido(pedido: Pedido): number { ... }

// composables/usePedido.ts
const total = computed(() => calcularTotalPedido(pedido.value));
```

---

## Pages

### Responsabilidade

**Orquestrar a composição visual de uma rota.** Conectar composables aos componentes filhos.

### Deve conter

- Layout de seções da tela
- Import de componentes específicos da page
- Handlers que delegam a composables
- Estilos de grid/layout da page

### Não deve conter

- Lógica de fetch
- Transformação de dados da API
- Componentes genéricos reutilizáveis (extrair)

### ✅ Correto — Page enxuta

```vue
<!-- pages/dashboard/DashboardPage.vue -->
<template>
  <q-page class="agro-page">
    <app-page-header titulo="Painel AgroPulse" subtitulo="Visão geral da operação agrícola." />
    <section class="agro-section dashboard-grid">
      <metric-tile label="Clientes" :value="metricas.clientes" />
      <metric-tile label="Produtos" :value="metricas.produtos" />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import MetricTile from 'components/ui/MetricTile.vue';
import { useDashboard } from 'composables/useDashboard';

const { metricas } = useDashboard();
</script>
```

### ❌ Incorreto — Page monolítica (500+ linhas)

Sinais de page com múltiplas responsabilidades:
- 10+ `ref()` para dados de API diferentes
- Funções `salvar`, `excluir`, `validar`, `formatar` no mesmo `<script>`
- Template com 200+ linhas e múltiplos modais inline
- Estilos scoped com 100+ linhas

**Correção:** extrair modais → `components/`, lógica → composable, fetch → store + service.

---

## Composables

### Responsabilidade

**Adaptar stores, router e utilitários para consumo conveniente pela UI.**

Composables são facades — não substituem stores nem services.

### Deve conter

- `storeToRefs` para expor estado reativo
- Composição de outros composables
- `computed` derivados para a UI
- Handlers que combinam ações (ex.: salvar + notificar + navegar)

### Não deve conter

- Chamadas HTTP diretas
- Estado global em `ref` compartilhado (usar Pinia)
- Lógica de domínio pesada

### ✅ Correto — Facade fina

```typescript
// composables/usePermissao.ts
import { useAuth } from './useAuth';

export function usePermissao() {
  const { possuiPermissao } = useAuth();
  return { possuiPermissao };
}
```

**Por quê:** especializa `useAuth` sem duplicar lógica. UI importa `usePermissao` quando só precisa de permissões.

### ✅ Correto — Composable de feedback UI

```typescript
// composables/useNotificacao.ts
import { Notify } from 'quasar';

export function useNotificacao() {
  function sucesso(message: string): void {
    Notify.create({ type: 'positive', message });
  }

  function erro(message: string): void {
    Notify.create({ type: 'negative', message });
  }

  return { sucesso, erro };
}
```

**Por quê:** encapsula Quasar Notify — se trocarmos biblioteca de toast, mudamos um arquivo.

### ❌ Incorreto — Composable "god object"

```typescript
export function useClientes() {
  const clientes = ref<Cliente[]>([]);
  const loading = ref(false);
  const filtro = ref('');
  const pagina = ref(1);

  async function listar() {
    loading.value = true;
    const { data } = await api.get('/clientes', { params: { page: pagina.value } });
    clientes.value = data;
    loading.value = false;
  }

  async function criar(payload: CriarClienteDto) {
    await api.post('/clientes', payload);
    Notify.create({ type: 'positive', message: 'Criado!' });
    await listar();
  }

  function formatarDocumento(doc: string) { ... }
  function validarEmail(email: string) { ... }

  return { clientes, loading, filtro, pagina, listar, criar, formatarDocumento, validarEmail };
}
```

**Problemas múltiplos:**
1. HTTP no composable (deveria ser store → service)
2. Estado global em ref (deveria ser Pinia)
3. Notificação no composable de dados (aceitável em handler, não dentro de fetch)
4. Formatação e validação misturadas (deveriam ser utils)

**Correção:**

```
utils/validators.ts          → validarEmail
utils/formatters.ts          → formatarDocumento
services/clientes.service.ts → listar, criar
stores/clientes.store.ts     → state, actions
composables/useClientes.ts   → facade + useNotificacao no handler salvar
```

---

## Stores (Pinia)

### Responsabilidade

**Ser a fonte única de verdade para estado compartilhado e coordenar persistência via services.**

### Deve conter

- `state` tipado
- `getters` para derivações
- `actions` async que chamam services e atualizam state

### Não deve conter

- Manipulação de DOM
- Notificações Quasar
- Navegação router
- Formatação visual

### ✅ Correto

```typescript
// stores/auth.store.ts
actions: {
  async verificar() {
    this.autenticado = await authService.status();
    this.usuario = this.autenticado ? await authService.usuarioLogado() : null;
    this.verificado = true;
  },

  possuiPermissao(permissao: string): boolean {
    return this.permissoes.includes(permissao);
  },
},
```

### ❌ Incorreto — Store com UI

```typescript
actions: {
  async salvarCliente(dados: Cliente) {
    try {
      await clienteService.criar(dados);
      Notify.create({ type: 'positive', message: 'Salvo!' });
      router.push('/clientes');
    } catch (e) {
      Notify.create({ type: 'negative', message: 'Erro!' });
    }
  },
},
```

**Correção:** store lança/retorna erro; composable trata feedback e navegação.

```typescript
// composables/useClientes.ts
async function salvar(dados: Cliente) {
  try {
    await store.salvarCliente(dados);
    notificacao.sucesso('Cliente salvo.');
    await router.push({ name: 'clientes' });
  } catch (error) {
    notificacao.erro(tratarErro.mensagem(error));
  }
}
```

---

## Services

### Responsabilidade

**Executar operações de I/O com a API e retornar dados tipados.**

Funções de service devem ser previsíveis: entrada tipada → Promise de saída tipada (ou erro normalizado).

### Deve conter

- Chamadas HTTP via `api` (boot/axios)
- Mapeamento DTO → entidade (quando necessário)
- Tratamento de erro via reject do interceptor (não swallow)

### Não deve conter

- Estado mutável
- Imports de Vue, Pinia, Quasar, vue-router
- Notificações, navegação, acesso a DOM

### ✅ Correto

```typescript
// services/auth.service.ts
export const authService = {
  async usuarioLogado(): Promise<UsuarioLogado> {
    return api.get<UsuarioLogado>('/auth/me').then((response) => response.data);
  },
};
```

### ❌ Incorreto — Service com lógica de interface

```typescript
export const pedidoService = {
  async listar(): Promise<Pedido[]> {
    const pedidos = await api.get('/pedidos').then((r) => r.data);
    return pedidos.map((p) => ({
      ...p,
      statusLabel: p.status === 'A' ? 'Aberto' : 'Fechado',  // PROIBIDO — label é UI
      statusColor: p.status === 'A' ? 'green' : 'red',       // PROIBIDO — cor é UI
    }));
  },
};
```

**Correção:**

```typescript
// constants/pedidos.ts
export const StatusPedido = { A: 'Aberto', F: 'Fechado' } as const;

// components ou composable
const statusLabel = computed(() => StatusPedido[pedido.status]);
```

### ❌ Incorreto — Service acessando store

```typescript
import { useAuthStore } from 'stores/auth.store'; // PROIBIDO

export const pedidoService = {
  async listar() {
    const auth = useAuthStore();
    return api.get('/pedidos', { headers: { Authorization: auth.token } });
  },
};
```

**Correção:** token injetado via interceptor em `boot/axios.ts`.

---

## Providers e Contexts (Vue)

O AgroPulse **não usa** pasta `providers/` nem React-style Context.

| Necessidade | Solução AgroPulse |
|---|---|
| Estado global | Pinia store |
| Config de plugin | `boot/` + `app.use()` |
| Dependência em subtree | `provide/inject` pontual (raro) |
| Config de tema | Quasar + `css/quasar.variables.scss` |

**Regra:** se você está criando um "Provider" ou "Context", provavelmente precisa de uma **store Pinia** ou um **composable**.

---

## Utils e Helpers

### Responsabilidade

**Funções puras:** mesma entrada → mesma saída, sem efeitos colaterais.

### Exemplos corretos

```typescript
// utils/formatters.ts
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}
```

### Não deve conter

- Chamadas HTTP
- Acesso a stores
- Uso de `ref`/`reactive`

### ❌ Incorreto — "Util" com side effect

```typescript
export function salvarPreferencia(chave: string, valor: string) {
  localStorage.setItem(chave, valor);
  Notify.create({ message: 'Salvo' });
}
```

**Correção:** split em `utils/storage.ts` (puro) + composable (orquestra notify).

---

## Constants

### Responsabilidade

**Definir valores imutáveis referenciados em múltiplos módulos.**

```typescript
// constants/permissoes.ts
export const Permissoes = {
  Dashboard: {
    Visualizar: 'dashboard.visualizar',
  },
} as const;
```

**Não deve conter:** funções, lógica condicional, dados carregados da API.

---

## Sinais de violação de SRP

Use este checklist ao revisar código (humano ou IA):

- [ ] Arquivo passa de **150 linhas**? Considerar divisão.
- [ ] Função passa de **30 linhas**? Extrair subfunções ou mover para utils.
- [ ] Componente importa `boot/axios` ou `services/`? Violação crítica.
- [ ] Store importa `quasar` ou `vue-router`? Violação.
- [ ] Template contém cálculos com mais de uma operação? Mover para computed.
- [ ] Composable exporta mais de **7-8 membros**? Provavelmente faz demais.
- [ ] Mesma lógica aparece em 2+ arquivos? Extrair para composable, util ou store.
- [ ] Arquivo muda por motivos de UI **e** API ao mesmo tempo? Dividir camadas.

---

## Exemplo completo — Fluxo correto vs incorreto

### ❌ Tudo em um componente (múltiplas responsabilidades)

```vue
<script setup lang="ts">
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';

const clientes = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/clientes');
    clientes.value = data.map((c) => ({ ...c, nome: c.nome.toUpperCase() }));
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao carregar' });
  } finally {
    loading.value = false;
  }
});

async function excluir(id: string) {
  await api.delete(`/clientes/${id}`);
  Notify.create({ type: 'positive', message: 'Excluído' });
  onMounted(); // re-fetch hack
}
</script>
```

### ✅ Responsabilidades separadas

```typescript
// services/clientes.service.ts
export const clientesService = {
  listar(): Promise<Cliente[]> {
    return api.get<Cliente[]>('/clientes').then((r) => r.data);
  },
  excluir(id: string): Promise<void> {
    return api.delete(`/clientes/${id}`).then(() => undefined);
  },
};

// stores/clientes.store.ts
actions: {
  async carregar() {
    this.clientes = await clientesService.listar();
  },
  async excluir(id: string) {
    await clientesService.excluir(id);
    this.clientes = this.clientes.filter((c) => c.id !== id);
  },
},

// composables/useClientes.ts
export function useClientes() {
  const store = useClientesStore();
  const { clientes, loading } = storeToRefs(store);
  const { sucesso, erro } = useNotificacao();

  async function carregar() {
    try {
      await store.carregar();
    } catch (e) {
      erro('Erro ao carregar clientes.');
    }
  }

  async function excluir(id: string) {
    try {
      await store.excluir(id);
      sucesso('Cliente excluído.');
    } catch (e) {
      erro('Erro ao excluir.');
    }
  }

  return { clientes, loading, carregar, excluir };
}

// pages/clientes/ClientesListPage.vue — só composição
const { clientes, loading, carregar, excluir } = useClientes();
onMounted(carregar);
```

---

## Referências

- [Arquitetura](./architecture.md)
- [Estrutura de pastas](./folder-structure.md)
- [API e HTTP](./api.md)
- [Regras para IA](./cursor.rules.md)
