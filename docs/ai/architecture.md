# Arquitetura do Frontend AgroPulse

> Documento oficial de arquitetura. Leia antes de gerar ou modificar qualquer código.

## Visão geral

O AgroPulse Frontend é uma **SPA (Single Page Application)** construída com:

| Tecnologia | Papel |
|---|---|
| **Vue 3** | Framework de UI com Composition API (`<script setup>`) |
| **Quasar** | Biblioteca de componentes e layout system |
| **Pinia** | Gerenciamento de estado global |
| **Vue Router** | Roteamento e guards de autenticação/permissão |
| **Axios** | Cliente HTTP centralizado |
| **TypeScript** | Tipagem estática em strict mode |
| **Vite** | Bundler e dev server |

### Por que essa stack?

- **Vue 3 + Composition API**: composição explícita de lógica reutilizável via composables, sem a complexidade de class components ou Options API legada.
- **Quasar**: acelera entrega de UI consistente (formulários, tabelas, notificações, layout responsivo) sem reinventar componentes base.
- **Pinia**: store tipada, modular e sem boilerplate — substitui Vuex com API mais simples e melhor inferência TypeScript.
- **Axios centralizado**: um único ponto para interceptors, normalização de erros e configuração de base URL.
- **TypeScript strict**: erros de tipo capturados em build time, contratos claros entre camadas.

---

## Modelo arquitetural

Adotamos uma **arquitetura em camadas inspirada em Clean Architecture**, adaptada ao ecossistema Vue:

```
┌─────────────────────────────────────────────────────────────┐
│  UI (Apresentação)                                          │
│  pages · layouts · components                               │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│  Composables (Orquestração / Adaptadores de UI)             │
│  composables/                                               │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│  Estado Global (Stores Pinia)                                 │
│  stores/                                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│  Serviços (Casos de uso / Acesso a dados)                     │
│  services/                                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│  Infraestrutura HTTP                                          │
│  boot/axios.ts · types/api/                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                      API Backend
```

### Princípio central

**Dependências apontam sempre para baixo.** Camadas superiores conhecem as inferiores; camadas inferiores nunca importam páginas, componentes ou composables.

---

## Camadas e responsabilidades

### 1. UI — Apresentação

**Onde:** `pages/`, `layouts/`, `components/`

**Responsabilidade:** renderizar interface, capturar interações do usuário, delegar ações para composables ou stores.

**Pode:**
- Declarar template, estilos scoped e props/emits
- Manter estado local de UI (ex.: drawer aberto, tab ativa, valor de input antes do submit)
- Chamar composables para obter dados e ações
- Usar componentes Quasar e componentes internos

**Não pode:**
- Chamar `api`, `axios` ou qualquer cliente HTTP diretamente
- Conter regras de negócio (cálculos, validações de domínio, transformações de dados da API)
- Acessar `localStorage`, `sessionStorage` ou cookies diretamente (exceto via composable/store)
- Importar serviços (`services/`) — sempre passar pelo composable ou store

**Por quê:** componentes de UI devem ser substituíveis e testáveis isoladamente. Acoplar HTTP ou regra de negócio torna refatoração e testes unitários impraticáveis.

---

### 2. Composables — Orquestração

**Onde:** `composables/`

**Responsabilidade:** expor API reativa e conveniente para a UI, conectando stores, router, notificações e lógica de fluxo de tela.

**Pode:**
- Encapsular acesso a stores via `storeToRefs`
- Compor outros composables (`useAuth` → `usePermissao`)
- Tratar feedback de UI (notificações, mensagens de erro de formulário)
- Orquestrar navegação pós-ação (redirect após login)
- Expor computed/refs derivados para a UI

**Não pode:**
- Fazer chamadas HTTP diretas (delegar ao store → service)
- Substituir stores para estado compartilhado entre rotas
- Conter lógica de domínio pesada (cálculos agrícolas, regras fiscais, etc.)

**Por quê:** composables são a "cola" entre UI e estado. Mantê-los finos evita duplicação e garante que stores permaneçam a fonte única de verdade para estado global.

**Exemplo real no projeto:**

```typescript
// composables/useAuth.ts — facade sobre a store
export function useAuth() {
  const store = useAuthStore();
  const { autenticado, usuario, permissoes } = storeToRefs(store);

  return {
    autenticado,
    usuario,
    permissoes,
    entrarSessaoLocal: store.entrarSessaoLocal,
    possuiPermissao: store.possuiPermissao,
    sair: store.sair,
    verificar: store.verificar,
  };
}
```

---

### 3. Stores (Pinia) — Estado global

**Onde:** `stores/`

**Responsabilidade:** manter estado compartilhado, coordenar chamadas a serviços, expor getters e actions.

**Pode:**
- Definir `state`, `getters` e `actions`
- Chamar serviços dentro de `actions`
- Derivar estado computado (ex.: lista de permissões do usuário)
- Persistir/restaurar sessão (quando implementado)

**Não pode:**
- Manipular DOM ou componentes Quasar diretamente
- Conter lógica de apresentação (formatação visual, labels)
- Importar componentes Vue

**Por quê:** stores são agnósticas de UI. Separar estado de apresentação permite reutilizar a mesma store em diferentes contextos (web, futuro mobile/PWA).

**Exemplo real:**

```typescript
// stores/auth.store.ts
actions: {
  async verificar() {
    this.autenticado = await authService.status();
    this.usuario = this.autenticado ? await authService.usuarioLogado() : null;
    this.verificado = true;
  },
}
```

---

### 4. Serviços — Casos de uso / Gateway de API

**Onde:** `services/`

**Responsabilidade:** encapsular operações de dados — uma função por operação de negócio ou endpoint.

**Pode:**
- Chamar o cliente HTTP (`api` de `boot/axios`)
- Transformar DTOs da API em tipos de domínio (`types/entidades/`)
- Agrupar endpoints relacionados (ex.: `authService`, `clienteService`)
- Retornar dados tipados ou lançar erros normalizados

**Não pode:**
- Acessar stores Pinia
- Usar composables
- Disparar notificações ou navegação
- Manter estado mutável entre chamadas

**Por quê:** serviços são funções puras de I/O. Sem dependência de Vue, podem ser testados com mocks de HTTP e reutilizados fora do ciclo de vida de componentes.

**Exemplo real:**

```typescript
// services/auth.service.ts
export const authService = {
  async usuarioLogado(): Promise<UsuarioLogado> {
    return api.get<UsuarioLogado>('/auth/me').then((response) => response.data);
  },
};
```

---

### 5. Infraestrutura HTTP

**Onde:** `boot/axios.ts`, `types/api/`

**Responsabilidade:** configurar cliente HTTP, interceptors, normalização de erros e tipos de contrato da API.

**Pode:**
- Configurar `baseURL`, headers padrão, timeout
- Interceptar requests/responses (unwrap de `ApiResponse`, injeção de token)
- Normalizar erros para `ApiError` consistente
- Exportar instância `api` singleton

**Não pode:**
- Conter lógica de negócio ou roteamento
- Importar stores (exceto em interceptors de auth, com cuidado para evitar dependência circular)

**Por quê:** centralizar infraestrutura evita configuração duplicada e garante tratamento uniforme de erros em toda a aplicação.

---

## Matriz de dependências permitidas

| De ↓ / Para → | pages | components | composables | stores | services | boot/axios | types | utils |
|---|---|---|---|---|---|---|---|---|
| **pages** | — | ✅ | ✅ | ⚠️ evitar* | ❌ | ❌ | ✅ | ✅ |
| **components** | ❌ | ✅ | ✅ | ⚠️ evitar* | ❌ | ❌ | ✅ | ✅ |
| **composables** | ❌ | ❌ | ✅ | ✅ | ❌** | ❌ | ✅ | ✅ |
| **stores** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌*** | ✅ | ✅ |
| **services** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **boot/axios** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

\* Preferir composables como facade sobre stores. Importar store diretamente em page/componente só em casos excepcionais (ex.: router guard em `router/index.ts`).

\*\* Composables não chamam services diretamente; delegam à store.

\*\*\* Stores importam services, não axios diretamente. O re-export `services/api.ts` existe apenas como alias de conveniência histórica — novos serviços devem importar de `boot/axios`.

---

## Fluxo completo da aplicação

### Bootstrap (inicialização)

```
index.html
  → main.ts
    → createApp(App)
    → app.use(Quasar)
    → app.use(pinia)
    → app.use(router)
    → registerBoot(app)        // componentes globais, futuros plugins
    → app.mount('#app')
```

### Fluxo SuperHost (sistema fechado)

```
/login (SuperHost)
  → authService.login → isSuperHost + requiresEmpresaSelection
  → redirect /plataforma

/plataforma
  → plataformaService.listarEmpresas / criarEmpresa (empresa + Diretor)
  → "Acessar" → authService.selecionarEmpresa
  → (opcional) /selecionar-unidade
  → /dashboard no contexto da empresa
```

Cadastro público de usuário/empresa **não existe**. Usuários de cada empresa nascem via `/usuarios` (admin) ou no create da plataforma (primeiro Diretor).

Guards: `precisaConsolePlataforma` bloqueia o app sem empresa selecionada; `requerSuperHost` protege `/plataforma`.

Contrato API (rotas, DTOs, enums): `C:\Users\Guilherme\Documents\new_agropulse_backend\api-contract\` — ver índice em `docs/ai/api.md#contrato-da-api-fonte-da-verdade`.

### Navegação com autenticação

```
Usuário acessa rota protegida
  → router.beforeEach (router/index.ts)
    → authStore.verificar()          // se ainda não verificado
      → authService.status()         // service
        → api.get('/health')         // axios
      → authService.usuarioLogado()  // se autenticado
        → api.get('/auth/me')
    → verifica meta.permissao
    → permite ou redireciona
  → Layout renderiza (MainLayout / AuthLayout)
    → router-view → Page
      → composables fornecem estado/ações
      → components renderizam UI
```

### Fluxo de ação do usuário até a API

```
1. Usuário clica "Salvar" em um formulário
2. Page/Component chama handler local
3. Handler invoca composable (ex.: useCliente().salvar(dados))
4. Composable delega à store (ex.: clienteStore.salvar(dados))
5. Store action chama service (ex.: clienteService.criar(dados))
6. Service faz api.post('/clientes', payload)
7. Interceptor response unwrap ApiResponse<T> → retorna T
8. Service retorna UsuarioLogado / entidade tipada
9. Store atualiza state
10. Composable expõe refs reativas
11. Component re-renderiza automaticamente
```

**Regra de ouro:** nunca pular camadas. Component → Composable → Store → Service → API.

---

## Separação UI × Lógica × Serviços × Infraestrutura

| Concern | Camada | Exemplo AgroPulse |
|---|---|---|
| Botão, formulário, tabela | UI | `LoginPage.vue`, `MetricTile.vue` |
| Feedback, navegação pós-ação | Composable | `useNotificacao`, `useAuth` |
| Estado compartilhado, cache de sessão | Store | `auth.store.ts` |
| CRUD, consultas à API | Service | `auth.service.ts` |
| HTTP, erros, tokens | Infraestrutura | `boot/axios.ts` |
| Contratos de dados | Types | `types/entidades/usuario.ts` |
| Formatação pura | Utils | `utils/formatters.ts` |
| Valores fixos do domínio | Constants | `constants/permissoes.ts` |

---

## Organização por feature (evolução)

O projeto está em fase inicial com pastas globais (`pages/dashboard/`, `services/auth.service.ts`). À medida que crescer, **features** podem ser extraídas:

```
src/features/clientes/
  ├── components/
  ├── composables/
  ├── services/
  ├── stores/        # se estado for exclusivo da feature
  ├── types/
  └── pages/         # ou manter pages/ centralizado com subpastas
```

**Quando extrair para feature:** quando um domínio tiver 3+ componentes, 1+ service, 1+ composable e estado próprio. Até lá, pastas globais por tipo são suficientes e evitam over-engineering prematuro.

---

## Boot e inicialização

**Onde:** `boot/`

Arquivos de boot registram configurações que dependem da instância Vue:

- `boot/axios.ts` — cliente HTTP (não depende de `App`, mas vive em boot por convenção Quasar)
- `boot/components.ts` — registro de componentes globais
- `boot/index.ts` — orquestrador chamado em `main.ts`

**Por quê:** separar boot de `main.ts` mantém o entry point limpo e facilita adicionar plugins (i18n, analytics) sem inflar um único arquivo.

---

## Roteamento e permissões

Rotas definidas em `router/routes.ts` com meta:

```typescript
meta: {
  publica: true,                              // bypass de auth
  permissao: Permissoes.Dashboard.Visualizar, // guard de permissão
  breadcrumb: 'navegacao.dashboard',          // futuro i18n
}
```

Guards centralizados em `router/index.ts` — **nunca** duplicar lógica de auth em cada page.

---

## Boas práticas

### ✅ Correto — Page delega ao composable

```vue
<script setup lang="ts">
import { useAuth } from 'composables/useAuth';

const { sair } = useAuth();

function handleSair(): void {
  sair();
  void router.push({ name: 'login' });
}
</script>
```

### ✅ Correto — Service retorna tipo de domínio

```typescript
async usuarioLogado(): Promise<UsuarioLogado> {
  return api.get<UsuarioLogado>('/auth/me').then((r) => r.data);
}
```

### ✅ Correto — Componente puro de apresentação

```vue
<!-- components/ui/MetricTile.vue -->
<script setup lang="ts">
defineProps<{ label: string; value: string | number }>();
</script>
```

### ✅ Correto — Constantes de domínio centralizadas

```typescript
export const Permissoes = {
  Dashboard: { Visualizar: 'dashboard.visualizar' },
} as const;
```

---

## Más práticas (antipadrões)

### ❌ HTTP direto no componente

```vue
<script setup lang="ts">
import { api } from 'boot/axios'; // PROIBIDO em pages/components

async function carregar() {
  const { data } = await api.get('/clientes');
}
</script>
```

**Problema:** impossível testar, duplica endpoints, ignora normalização de erros da store.

### ❌ Regra de negócio no template

```vue
<template>
  <span>{{ pedido.valor * 1.12 + pedido.frete - pedido.desconto }}</span>
</template>
```

**Correção:** mover cálculo para composable, getter de store ou `utils/`.

### ❌ Store importando componente

```typescript
import MetricTile from 'components/ui/MetricTile.vue'; // PROIBIDO
```

### ❌ Service com lógica de UI

```typescript
export const clienteService = {
  async criar(dados: CriarClienteDto) {
    const result = await api.post('/clientes', dados);
    Notify.create({ type: 'positive', message: 'Salvo!' }); // PROIBIDO
    return result.data;
  },
};
```

**Correção:** notificação no composable após action da store.

### ❌ Composable fazendo fetch direto

```typescript
export function useClientes() {
  async function listar() {
    return api.get('/clientes'); // PROIBIDO — usar store + service
  }
}
```

### ❌ Estado global em composable com `ref` solto

```typescript
const clientes = ref([]); // compartilhado entre instâncias — usar Pinia
```

---

## Decisões arquiteturais e trade-offs

| Decisão | Benefício | Trade-off |
|---|---|---|
| Pinia em vez de estado no composable | Estado compartilhado previsível, DevTools | Boilerplate mínimo extra por feature |
| Composable como facade da store | UI não acopla à implementação da store | Camada adicional (justificada em apps médias/grandes) |
| Services como objetos `{ fn }` | Simples, tree-shakeable, fácil mock | Sem injeção de dependência formal |
| Axios singleton | Configuração única | Testes precisam mockar módulo |
| Strict TypeScript | Segurança em refactors | Curva inicial maior |
| Quasar global | Produtividade | Bundle maior (mitigável com auto-import futuro) |

---

## Checklist antes de implementar uma feature

- [ ] Tipos definidos em `types/entidades/` ou `types/api/`
- [ ] Service criado em `services/` com métodos tipados
- [ ] Store (se estado compartilhado) em `stores/`
- [ ] Composable expõe API conveniente para UI
- [ ] Page/componente apenas renderiza e delega
- [ ] Rota registrada com `meta.permissao` se protegida
- [ ] Nenhum import de `boot/axios` fora de `services/` e `boot/`

---

## Referências internas

- [Troubleshooting / Problemas conhecidos](./troubleshooting.md)
- [Estrutura de pastas](./folder-structure.md)
- [Chamadas HTTP e API](./api.md)
- [Responsabilidade única](./single-responsibility.md)
- [Regras para IA](./cursor.rules.md)
