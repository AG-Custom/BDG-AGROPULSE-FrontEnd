# Estrutura de Pastas — AgroPulse Frontend

> Guia oficial de organização de arquivos. Toda criação de arquivo deve respeitar este documento.

## Árvore atual

```
new_agropulse_frontend/
├── docs/
│   └── ai/                    # Documentação para IA (este diretório)
├── public/                    # Assets estáticos servidos sem processamento
├── src/
│   ├── assets/                # Imagens, fontes, ícones processados pelo Vite
│   ├── boot/                  # Inicialização da aplicação (HTTP, plugins, globals)
│   ├── components/            # Componentes Vue reutilizáveis
│   │   ├── layout/            # Componentes estruturais (sidebar, header parcial)
│   │   ├── shared/            # Componentes compartilhados entre features
│   │   └── ui/                # Componentes visuais puros (tiles, badges, cards)
│   ├── composables/           # Lógica reutilizável com API reativa (Vue hooks)
│   ├── constants/             # Valores fixos, enums, permissões
│   ├── css/                   # Estilos globais e variáveis Quasar
│   ├── layouts/               # Shells de página (MainLayout, AuthLayout)
│   ├── pages/                 # Páginas roteadas (uma por rota principal)
│   ├── router/                # Configuração de rotas e guards
│   ├── services/              # Camada de acesso a dados / API
│   ├── stores/                # Estado global Pinia
│   ├── types/                 # Tipos TypeScript
│   │   ├── api/               # Contratos HTTP (ApiResponse, ApiError)
│   │   └── entidades/         # Modelos de domínio (UsuarioLogado, Cliente, etc.)
│   ├── utils/                 # Funções puras sem dependência de Vue
│   ├── App.vue                # Root component
│   ├── env.d.ts               # Tipos de ambiente Vite
│   └── main.ts                # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Aliases de importação

Configurados em `vite.config.ts` e `tsconfig.json`. **Sempre usar aliases**, nunca caminhos relativos longos (`../../../`).

| Alias | Caminho | Uso |
|---|---|---|
| `assets` | `src/assets` | Imagens, SVGs |
| `boot` | `src/boot` | Inicialização |
| `components` | `src/components` | Componentes Vue |
| `composables` | `src/composables` | Composables |
| `constants` | `src/constants` | Constantes |
| `css` | `src/css` | Estilos globais |
| `layouts` | `src/layouts` | Layouts |
| `pages` | `src/pages` | Páginas |
| `router` | `src/router` | Router |
| `services` | `src/services` | Serviços |
| `stores` | `src/stores` | Stores Pinia |
| `types` | `src/types` | Tipos TS |
| `utils` | `src/utils` | Utilitários |

```typescript
// ✅ Correto
import { useAuth } from 'composables/useAuth';
import type { UsuarioLogado } from 'types/entidades/usuario';

// ❌ Incorreto
import { useAuth } from '../../../composables/useAuth';
```

---

## Detalhamento por pasta

### `src/pages/` — Páginas

**Finalidade:** componentes Vue associados a rotas. Representam telas completas.

**Quando criar:** ao adicionar uma nova rota navegável.

**Convenção de nomes:** `{Dominio}Page.vue` — PascalCase com sufixo `Page`.

**Organização:** subpastas por domínio/feature.

```
pages/
├── auth/
│   └── LoginPage.vue
├── dashboard/
│   └── DashboardPage.vue
├── clientes/
│   ├── ClientesListPage.vue
│   └── ClienteDetalhePage.vue
└── ErrorNotFound.vue
```

**O que colocar aqui:**
- Template da tela completa
- Composição de componentes filhos
- Chamadas a composables
- Estilos scoped específicos da página

**O que NÃO colocar:**
- Chamadas HTTP
- Lógica de negócio complexa
- Componentes reutilizáveis (extrair para `components/`)

**Por quê:** separar pages de components evita que componentes genéricos fiquem acoplados a rotas específicas.

---

### `src/layouts/` — Layouts

**Finalidade:** shells estruturais que envolvem grupos de páginas (header, drawer, footer).

**Quando criar:** quando um conjunto de rotas compartilha estrutura visual diferente.

**Exemplos atuais:**
- `MainLayout.vue` — área autenticada (header + sidebar + `<router-view>`)
- `AuthLayout.vue` — telas públicas (login, recuperação de senha)

**Convenção:** `{Contexto}Layout.vue`

**Por quê:** layouts evitam duplicar estrutura de navegação em cada page e permitem lazy-load por área da aplicação.

---

### `src/components/` — Componentes

**Finalidade:** blocos de UI reutilizáveis, organizados por responsabilidade visual.

#### `components/layout/`
Componentes estruturais de navegação e chrome da aplicação.

```
components/layout/
└── AppSidebar.vue
```

#### `components/shared/`
Componentes usados em múltiplas features, com alguma lógica de composição mas sem regra de negócio.

```
components/shared/
└── AppPageHeader.vue
```

#### `components/ui/`
Componentes visuais puros — recebem props, emitem eventos, zero lógica de domínio.

```
components/ui/
└── MetricTile.vue
```

**Quando criar subpasta nova em `components/`:**
- Quando um grupo tem 3+ componentes relacionados (ex.: `components/forms/`, `components/tables/`)
- Quando componentes são exclusivos de uma feature grande (considerar `features/{nome}/components/`)

**Convenção de nomes:** PascalCase — `MetricTile.vue`, `AppPageHeader.vue`

**Registro global:** apenas componentes usados em 80%+ das pages via `boot/components.ts`. Preferir import explícito.

**Por quê:** três níveis (layout/shared/ui) equilibram discoverability sem over-nesting prematuro.

---

### `src/composables/` — Composables (equivalente a "hooks")

**Finalidade:** encapsular lógica reativa reutilizável com API conveniente para componentes.

> No ecossistema Vue, **composables** substituem o termo "hooks" do React. Não criar pasta `hooks/`.

**Quando criar:** quando a mesma lógica reativa é usada em 2+ componentes, ou para facade sobre stores.

**Convenção:** `use{Nome}.ts` — camelCase com prefixo `use`.

```
composables/
├── useAuth.ts
├── usePermissao.ts
├── useNotificacao.ts
├── useTratarErroFormulario.ts
└── useClientes.ts          # futuro
```

**Por quê:** composables são a unidade de composição do Vue 3. Centralizá-los evita duplicação e mantém `<script setup>` enxuto.

---

### `src/services/` — Serviços

**Finalidade:** gateway tipado para a API. Um arquivo por domínio/recurso.

**Quando criar:** ao integrar um novo recurso ou grupo de endpoints da API.

**Convenção:** `{dominio}.service.ts` — exporta objeto com métodos async.

```
services/
├── api.ts                  # re-export de boot/axios (legado — preferir boot/axios)
├── auth.service.ts
├── clientes.service.ts     # futuro
└── pedidos.service.ts      # futuro
```

**Por quê:** serviços isolam contratos HTTP do restante da aplicação. Mudança de endpoint afeta um único arquivo.

---

### `src/stores/` — Stores Pinia

**Finalidade:** estado global compartilhado entre rotas e componentes distantes.

**Quando criar:** quando estado precisa sobreviver a navegação ou ser acessado por múltiplas features.

**Convenção:** `{dominio}.store.ts` — exporta `use{Nome}Store`.

```
stores/
├── index.ts                # createPinia + export
├── auth.store.ts
└── clientes.store.ts       # futuro
```

**Quando NÃO criar store:** estado usado apenas em uma page e seus filhos → `ref`/`computed` local ou composable sem Pinia.

**Por quê:** Pinia é para estado de aplicação, não para cache de formulário de uma tela.

---

### `src/types/` — Tipos TypeScript

**Finalidade:** contratos de dados compartilhados.

#### `types/api/`
Tipos relacionados ao protocolo HTTP — respostas envelope, erros, paginação.

```
types/api/
├── api.ts                  # ApiResponse, ApiError, ValidationProblemDetails
└── paginacao.ts            # futuro: PaginatedResponse<T>
```

#### `types/entidades/`
Modelos de domínio — representam entidades de negócio usadas na aplicação.

```
types/entidades/
├── usuario.ts              # UsuarioLogado
├── cliente.ts              # futuro
└── pedido.ts               # futuro
```

**DTOs vs Entidades:**
- **DTO** (`types/api/` ou `types/dtos/`): formato exato da API (snake_case, campos nullable da API)
- **Entidade** (`types/entidades/`): formato usado internamente na UI (camelCase, campos derivados)

Quando API e domínio forem idênticos, um único tipo em `entidades/` é suficiente. Criar DTO separado quando houver transformação.

**Interfaces vs Types:** preferir `interface` para objetos extensíveis; `type` para unions e utilitários.

**Por quê:** tipos centralizados evitam definições duplicadas e garantem contratos consistentes entre services, stores e components.

---

### `src/constants/` — Constantes

**Finalidade:** valores imutáveis referenciados em múltiplos arquivos.

```
constants/
├── permissoes.ts
├── rotas.ts                # futuro: nomes de rotas tipados
└── config.ts               # futuro: limites, defaults
```

**Convenção:** objetos `as const` ou enums quando necessário.

**Por quê:** magic strings espalhadas causam bugs silenciosos em refactors. Centralizar permite busca e autocomplete.

---

### `src/utils/` — Utilitários

**Finalidade:** funções puras sem efeitos colaterais e sem dependência de Vue.

```
utils/
├── formatters.ts           # formatarNumero, formatarData, formatarMoeda
├── validators.ts           # futuro: validações puras de domínio
└── mappers.ts              # futuro: dtoParaEntidade
```

**Quando criar util vs composable:**
- **Util:** entrada → saída, sem reatividade, testável isoladamente
- **Composable:** precisa de `ref`, `computed`, lifecycle, ou acesso a stores/router

**Por quê:** utils são agnósticos de framework — reutilizáveis em testes, scripts e futuras libs compartilhadas.

---

### `src/boot/` — Boot / Inicialização

**Finalidade:** configuração executada na inicialização da aplicação.

```
boot/
├── axios.ts                # cliente HTTP + interceptors
├── components.ts           # registro de componentes globais
└── index.ts                # registerBoot(app)
```

**Por quê:** padrão Quasar/Vite para separar concerns de setup da lógica de `main.ts`.

---

### `src/router/` — Roteamento

**Finalidade:** definição de rotas, guards e tipos de meta.

```
router/
├── index.ts                # createRouter + beforeEach guards
├── routes.ts               # RouteRecordRaw[]
└── typed-router.d.ts       # extensão de tipos do vue-router (meta)
```

**Por quê:** guards de auth centralizados — nunca reimplementar verificação de sessão por page.

---

### `src/css/` — Estilos globais

**Finalidade:** estilos que afetam toda a aplicação e variáveis de tema Quasar.

```
css/
├── app.scss                # estilos globais, classes utilitárias do projeto
└── quasar.variables.scss   # cores, tipografia Quasar
```

**Regra:** estilos de componente ficam `<style scoped>` no `.vue`. Global só para tokens, resets e utilitários cross-cutting.

---

### `src/assets/` — Assets processados

**Finalidade:** imagens, SVGs, fontes importados via `import` ou `<img src>`.

**Por quê:** Vite otimiza, hasheia e permite tree-shaking de assets importados.

---

## Pastas que NÃO existem (e por quê)

| Pasta comum | Decisão AgroPulse | Alternativa |
|---|---|---|
| `hooks/` | Não usar | `composables/` (convenção Vue) |
| `contexts/` | Não usar | Pinia stores + `provide/inject` pontual |
| `providers/` | Não usar | `boot/` + plugins Vue |
| `models/` | Não usar separado | `types/entidades/` |
| `interfaces/` | Não usar pasta dedicada | Interfaces dentro de `types/` |
| `api/` | Não usar pasta dedicada | `services/` + `boot/axios.ts` |
| `features/` | Ainda não — projeto inicial | Extrair quando domínio crescer |

---

## Organização por feature vs por tipo

### Fase atual — Por tipo (global)

Adequado para projetos pequenos com poucas features:

```
services/auth.service.ts
stores/auth.store.ts
pages/auth/LoginPage.vue
types/entidades/usuario.ts
```

**Vantagem:** fácil encontrar "todos os services". **Desvantagem:** arquivos de uma feature ficam espalhados.

### Fase de crescimento — Por feature (colocation)

Quando um domínio atingir massa crítica (3+ components, service, store, types):

```
src/features/clientes/
├── components/
│   ├── ClienteForm.vue
│   └── ClienteTable.vue
├── composables/
│   └── useClientes.ts
├── services/
│   └── clientes.service.ts
├── stores/
│   └── clientes.store.ts
├── types/
│   └── cliente.ts
└── index.ts                # barrel export público da feature
```

Pages podem permanecer em `pages/clientes/` (roteamento centralizado) ou migrar para dentro da feature.

**Critério de migração:** feature com equipe dedicada, 10+ arquivos relacionados, ou necessidade de lazy-load de módulo inteiro.

---

## Organização compartilhada (shared)

Código usado por 2+ features permanece nas pastas globais:

- `components/shared/` — UI compartilhada
- `components/ui/` — primitivos visuais
- `composables/useNotificacao.ts` — cross-cutting
- `utils/formatters.ts` — funções puras
- `constants/permissoes.ts` — domínio transversal

**Regra:** se um arquivo em `features/X/` é importado por `features/Y/`, movê-lo para pasta shared global.

---

## Convenções de nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Página | PascalCase + `Page` | `ClientesListPage.vue` |
| Layout | PascalCase + `Layout` | `MainLayout.vue` |
| Componente | PascalCase | `MetricTile.vue` |
| Composable | camelCase + prefixo `use` | `useAuth.ts` |
| Store | camelCase + `.store.ts` | `auth.store.ts` |
| Service | camelCase + `.service.ts` | `auth.service.ts` |
| Tipo/Interface | PascalCase | `UsuarioLogado` |
| Constante objeto | PascalCase ou UPPER_SNAKE | `Permissoes`, `API_TIMEOUT` |
| Util | camelCase | `formatarNumero` |
| Arquivo CSS global | kebab-case | `app.scss` |

**Idioma:** nomes de código (arquivos, funções, variáveis) em **português** quando representam domínio do negócio (`useAuth` → `useAutenticacao` é aceitável, mas manter consistência — o projeto atual usa termos como `useAuth`, `entrarSessaoLocal`).

---

## Quando criar uma nova pasta

| Situação | Ação |
|---|---|
| 1 novo componente de UI | Arquivo direto em `components/ui/` ou `shared/` |
| 3+ componentes relacionados | Subpasta `components/{grupo}/` |
| Nova integração API | Arquivo `services/{dominio}.service.ts` |
| Estado compartilhado entre rotas | Arquivo `stores/{dominio}.store.ts` |
| 10+ arquivos de um domínio | Considerar `features/{dominio}/` |
| Tipo usado em 1 service apenas | Pode ficar no service (preferir `types/` se reutilizado) |
| Função pura reutilizada | `utils/{grupo}.ts` |

---

## Exemplos completos

### Adicionar feature "Clientes"

```
1. types/entidades/cliente.ts          → interface Cliente
2. services/clientes.service.ts        → listar, obter, criar, atualizar
3. stores/clientes.store.ts            → state + actions
4. composables/useClientes.ts          → facade reativa
5. components/ui/ClienteCard.vue       → card visual (se reutilizável)
6. pages/clientes/ClientesListPage.vue → tela de listagem
7. router/routes.ts                    → rota + meta.permissao
8. constants/permissoes.ts               → Permissoes.Clientes.*
```

### Adicionar utilitário de formatação

```
1. utils/formatters.ts                 → export function formatarMoeda(valor: number)
2. Usar em componente via import        → import { formatarMoeda } from 'utils/formatters'
```

### Adicionar componente global

```
1. components/shared/NovoComponente.vue
2. boot/components.ts                  → app.component('NovoComponente', ...)
3. Usar em templates como <novo-componente />
```

---

## Antipadrões de organização

### ❌ Service dentro de `components/`

```
components/ClientesService.ts  // PROIBIDO
```

### ❌ Types inline em service sem export

```typescript
// services/clientes.service.ts
interface Cliente { ... }  // PROIBIDO — mover para types/entidades/
```

### ❌ Page com 500 linhas e 10 componentes inline

Extrair para `components/` e `composables/`.

### ❌ Pasta `helpers/` paralela a `utils/`

Unificar em `utils/`. Um único lugar para funções puras.

### ❌ Import cruzado entre features

```
features/clientes/import de features/pedidos/interno  // PROIBIDO
```

Expor API pública via barrel `index.ts` ou mover para shared.

---

## Referências

- [Arquitetura](./architecture.md)
- [API e HTTP](./api.md)
- [Responsabilidade única](./single-responsibility.md)
