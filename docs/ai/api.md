# API e Chamadas HTTP — AgroPulse Frontend

> Especificação oficial de como toda comunicação com o backend deve ser implementada.

---

## Contrato da API (fonte da verdade)

O contrato oficial de rotas, DTOs, enums e erros **não** fica neste repositório. Está no backend:

| | |
|---|---|
| **Caminho local** | `C:\Users\Guilherme\Documents\new_agropulse_backend\api-contract\` |
| **Projeto irmão** | `new_agropulse_backend/api-contract/` (mesmo nível do frontend) |
| **Índice** | `api-contract/README.md` |

### Arquivos do contrato

| Arquivo | Quando consultar |
|---|---|
| `auth.md` | Login, registro, confirm-email, refresh, seleção de unidade |
| `onboarding.md` | Cadastro de empresa e dashboard inicial |
| `empresas.md` | Empresas, CNPJs, unidades, módulos |
| `enums.md` | Valores de enums (strings na API) |
| `integration.md` | Como integrar o contrato no front-end |
| `CHANGELOG.md` | Alterações recentes do contrato |

### Ambiente de desenvolvimento

| Config | Valor |
|---|---|
| `VITE_API_URL` (`.env.local`) | `/api` (proxy Vite → backend) |
| Frontend (Vite) | `http://localhost:9000` |
| Backend HTTPS | `https://localhost:7206` |
| Swagger (referência ao vivo) | `https://localhost:7206/swagger` |

O Vite faz proxy de `/api` para o backend — cookies HttpOnly funcionam como **same-origin** no dev.

**Regra para IA:** antes de criar ou alterar service/DTO, **ler o `.md` correspondente** em `api-contract/`. Se o backend não estiver no workspace do Cursor, pedir ao usuário para abrir a pasta ou colar o trecho do contrato.

---

## Autenticação (cookies HttpOnly)

**Nunca** persistir JWT em `localStorage` ou `sessionStorage`.

| O quê | Como |
|---|---|
| Tokens | Cookies `HttpOnly` definidos pelo backend no login/refresh |
| Axios | `withCredentials: true` em `boot/axios.ts` |
| Contexto UI | `sessionStorage` só com `usuario`, `empresaId`, `unidadeId`, `expiresAt` |
| Sessão ao recarregar | `GET /auth/session` (cookie enviado automaticamente) |
| Logout | `POST /auth/logout` + limpar contexto local |
| 401 | Interceptor tenta `POST /auth/refresh` (cookie) e repete a request |

**Proibido:** interceptor `Authorization: Bearer` lendo token do storage.

---

## Regra absoluta

**Nunca faça chamadas HTTP diretamente em componentes, pages ou layouts.**

Fluxo obrigatório:

```
Component / Page
       ↓
  Composable
       ↓
     Store (Pinia)        ← quando há estado compartilhado
       ↓
     Service
       ↓
  HTTP Client (axios)
       ↓
     API Backend
```

Quando não há estado compartilhado (operação one-shot sem cache), o composable pode chamar o service diretamente — **mas nunca o axios**.

---

## Cliente HTTP

### Instância centralizada

Localização: `boot/axios.ts`

```typescript
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5293';

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});
```

### Por que singleton?

- Uma única configuração de `baseURL`, timeout e headers
- Interceptors aplicados uniformemente
- Facilita mock em testes (vi.mock('boot/axios'))
- Evita inconsistência entre features

### Re-export

`services/api.ts` re-exporta `api` por compatibilidade. **Novos arquivos devem importar de `boot/axios` diretamente** em services, ou via alias interno do service.

```typescript
// services/auth.service.ts
import { api } from 'boot/axios';
```

---

## Configuração centralizada

### Variáveis de ambiente

| Variável | Descrição | Default |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:5293` |

Arquivo `.env.local` (não commitado):

```env
VITE_API_URL=https://api.agropulse.exemplo.com
```

**Regra:** nunca hardcodar URLs de API em services ou components. Sempre via `import.meta.env.VITE_API_URL` indiretamente pelo axios instance.

### Configurações futuras recomendadas

```typescript
export const api = axios.create({
  baseURL,
  timeout: 30_000,           // 30 segundos
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
```

---

## Interceptors

### Response — Unwrap de envelope

A API AgroPulse pode retornar dados envelopados em `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}
```

O interceptor extrai automaticamente `.data`:

```typescript
api.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown> | unknown;

    if (data && typeof data === 'object' && 'data' in data) {
      return { ...response, data: (data as ApiResponse<unknown>).data };
    }

    return response;
  },
  (error) => Promise.reject(normalizeApiError(error)),
);
```

**Por quê:** services sempre recebem `response.data` já unwrapped — sem repetir `.data.data` em cada chamada.

### Request — Autenticação

Tokens via **cookies HttpOnly** — o browser envia automaticamente com `withCredentials: true`:

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});
```

**Não** montar header `Authorization` manualmente no frontend.

### Response — Refresh automático (401)

Implementado em `boot/axios.ts`:

```
401 Unauthorized (rota autenticada)
  → POST /auth/refresh (cookie refresh)
  → sucesso: repete request original
  → falha: limpa sessionStorage e rejeita
```

**Regras:**
- Mutex para evitar múltiplos refresh simultâneos
- Máximo 1 retry por request
- Rotas públicas de auth não disparam refresh

---

## Tratamento de erros

### Tipo normalizado

```typescript
// types/api/api.ts
export interface ApiError {
  title: string;
  detail?: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ValidationProblemDetails extends ApiError {
  errors: Record<string, string[]>;
}
```

### Normalização centralizada

```typescript
function normalizeApiError(error: AxiosError<ValidationProblemDetails | ApiError>): ApiError {
  if (!error.response) {
    return {
      title: 'Erro de conexão',
      detail: 'Não foi possível conectar à API do AgroPulse.',
      status: 0,
    };
  }

  const data = error.response.data;

  return {
    title: data?.title ?? 'Erro inesperado',
    detail: data?.detail ?? error.message,
    status: error.response.status,
    errors: 'errors' in (data ?? {}) ? (data as ValidationProblemDetails).errors : undefined,
  };
}
```

**Por quê:** UI e composables sempre tratam `ApiError` previsível — não precisam conhecer estrutura Axios.

### Tratamento por camada

| Camada | Responsabilidade |
|---|---|
| **Interceptor** | Normalizar formato do erro |
| **Service** | Propagar (reject) — não swallow |
| **Store** | Propagar ou mapear para state de erro |
| **Composable** | Converter em mensagem user-friendly |
| **Component** | Exibir mensagem/campo de erro |

### Composable de erro de formulário

```typescript
// composables/useTratarErroFormulario.ts
export function useTratarErroFormulario() {
  function mensagem(error: unknown): string {
    const apiError = error as Partial<ApiError>;
    return apiError.detail ?? apiError.title ?? 'Não foi possível concluir a operação.';
  }

  function errosPorCampo(error: unknown): Record<string, string[]> {
    const apiError = error as Partial<ApiError>;
    return apiError.errors ?? {};
  }

  return { mensagem, errosPorCampo };
}
```

### ❌ Nunca fazer

```typescript
try {
  await clienteService.criar(dados);
} catch (e) {
  // silenciar erro — PROIBIDO
}

try {
  await clienteService.criar(dados);
} catch (e: any) {
  console.log(e); // PROIBIDO — tratar ou propagar tipado
}
```

---

## Timeout

Configurar globalmente no axios instance:

```typescript
timeout: 30_000,
```

Para operações longas (upload, relatórios), override por request:

```typescript
return api.post('/relatorios/gerar', payload, { timeout: 120_000 });
```

**Por quê global + override:** evita requests pendurados infinitamente sem bloquear operações legítimas longas.

---

## Cancelamento de requisições

Usar `AbortController` via signal do axios:

```typescript
// composables/useClientes.ts
let controller: AbortController | null = null;

async function buscar(termo: string) {
  controller?.abort();
  controller = new AbortController();

  return clientesService.buscar(termo, controller.signal);
}

// services/clientes.service.ts
buscar(termo: string, signal?: AbortSignal): Promise<Cliente[]> {
  return api
    .get<Cliente[]>('/clientes', { params: { q: termo }, signal })
    .then((r) => r.data);
}
```

**Quando usar:** autocomplete, filtros com debounce, navegação rápida entre pages.

**Cleanup no composable:**

```typescript
onUnmounted(() => controller?.abort());
```

---

## Organização de endpoints (Services)

### Um arquivo por domínio

```
services/
├── auth.service.ts
├── clientes.service.ts
├── pedidos.service.ts
└── safras.service.ts
```

### Padrão de export

Objeto com métodos nomeados — verbos descritivos em português:

```typescript
export const clientesService = {
  listar(params?: ListarClientesParams): Promise<PaginatedResult<Cliente>> {
    return api.get('/clientes', { params }).then((r) => r.data);
  },

  obter(id: string): Promise<Cliente> {
    return api.get<Cliente>(`/clientes/${id}`).then((r) => r.data);
  },

  criar(payload: CriarClienteDto): Promise<Cliente> {
    return api.post<Cliente>('/clientes', payload).then((r) => r.data);
  },

  atualizar(id: string, payload: AtualizarClienteDto): Promise<Cliente> {
    return api.put<Cliente>(`/clientes/${id}`, payload).then((r) => r.data);
  },

  excluir(id: string): Promise<void> {
    return api.delete(`/clientes/${id}`).then(() => undefined);
  },
};
```

**Por quê objeto vs classe:** mais simples, tree-shakeable, fácil de mockar, sem `new`.

### ❌ Endpoints espalhados

```typescript
// components/ClienteForm.vue
await api.post('/clientes', form);  // PROIBIDO

// composables/useX.ts
await api.get('/clientes');          // PROIBIDO
```

---

## DTOs vs Models (Entidades)

### DTO — Data Transfer Object

Formato exato enviado/recebido da API.

```typescript
// types/dtos/cliente.dto.ts
export interface CriarClienteDto {
  nome: string;
  documento: string;
  email: string;
}

export interface ClienteApiDto {
  id: string;
  nome: string;
  documento: string;
  email: string;
  criado_em: string;  // snake_case da API
}
```

### Entidade — Modelo de domínio interno

Formato usado na UI e stores.

```typescript
// types/entidades/cliente.ts
export interface Cliente {
  id: string;
  nome: string;
  documento: string;
  email: string;
  criadoEm: Date;
}
```

### Transformação no service

```typescript
// utils/mappers/cliente.mapper.ts
export function clienteDtoParaEntidade(dto: ClienteApiDto): Cliente {
  return {
    id: dto.id,
    nome: dto.nome,
    documento: dto.documento,
    email: dto.email,
    criadoEm: new Date(dto.criado_em),
  };
}

// services/clientes.service.ts
async obter(id: string): Promise<Cliente> {
  const dto = await api.get<ClienteApiDto>(`/clientes/${id}`).then((r) => r.data);
  return clienteDtoParaEntidade(dto);
}
```

**Quando mapear:**
- API usa snake_case e UI camelCase
- Campos precisam de parse (string → Date, string → enum)
- UI precisa de campos derivados

**Quando NÃO mapear:** API e UI idênticos — usar tipo único em `types/entidades/`.

---

## Paginação

### Tipo de resposta paginada

```typescript
// types/api/paginacao.ts
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
```

### Service

```typescript
listar(params: PaginationParams & FiltroClientes): Promise<PaginatedResult<Cliente>> {
  return api.get<PaginatedResult<Cliente>>('/clientes', { params }).then((r) => r.data);
}
```

### Store

```typescript
state: () => ({
  clientes: [] as Cliente[],
  paginacao: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
}),

actions: {
  async listar(filtros?: FiltroClientes) {
    const result = await clientesService.listar({
      page: this.paginacao.page,
      pageSize: this.paginacao.pageSize,
      ...filtros,
    });
    this.clientes = result.items;
    this.paginacao = {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    };
  },
},
```

---

## Filtros e query params

Filtros como interface tipada — nunca `Record<string, unknown>`:

```typescript
export interface FiltroClientes {
  busca?: string;
  ativo?: boolean;
  safraId?: string;
}

listar(params: PaginationParams & FiltroClientes): Promise<PaginatedResult<Cliente>> {
  return api.get('/clientes', { params: limparParamsVazios(params) }).then((r) => r.data);
}
```

Util para remover undefined/null:

```typescript
// utils/params.ts
export function limparParamsVazios<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>;
}
```

---

## Cache e invalidação

O AgroPulse usa **Pinia como cache de aplicação** — não há React Query/SWR.

### Padrão: cache na store

```typescript
state: () => ({
  clientes: [] as Cliente[],
  carregadoEm: null as Date | null,
}),

actions: {
  async listar(forcar = false) {
    if (!forcar && this.carregadoEm && Date.now() - this.carregadoEm.getTime() < 60_000) {
      return; // cache válido por 60s
    }
    this.clientes = await clientesService.listar();
    this.carregadoEm = new Date();
  },

  invalidarCache() {
    this.carregadoEm = null;
  },
},
```

### Invalidação após mutação

```typescript
async criar(payload: CriarClienteDto) {
  const cliente = await clientesService.criar(payload);
  this.invalidarCache();
  await this.listar(true);
  return cliente;
},
```

**Por quê Pinia vs lib de cache:** simplicidade, controle explícito, sem dependência extra. Reavaliar se app crescer para 50+ endpoints com cache complexo.

---

## Upload de arquivos

```typescript
// services/documentos.service.ts
upload(arquivo: File, metadata: UploadMetadata): Promise<Documento> {
  const formData = new FormData();
  formData.append('arquivo', arquivo);
  formData.append('tipo', metadata.tipo);

  return api
    .post<Documento>('/documentos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000,
      onUploadProgress: metadata.onProgress,
    })
    .then((r) => r.data);
}
```

**Regras:**
- Progress callback passado como parâmetro, não hardcoded
- Timeout maior que default
- Composable conecta progress à barra de UI

---

## Download de arquivos

```typescript
async downloadRelatorio(id: string): Promise<Blob> {
  const response = await api.get(`/relatorios/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
}
```

Composable dispara download no browser:

```typescript
async function baixarRelatorio(id: string) {
  const blob = await relatorioService.download(id);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-${id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
```

**Por quê separar:** service retorna Blob puro; lógica de DOM fica no composable.

---

## Tratamento de respostas por status

| Status | Significado | Ação |
|---|---|---|
| 200-299 | Sucesso | Retornar data |
| 400 | Validação | Propagar `ApiError` com `errors` por campo |
| 401 | Não autenticado | Refresh token ou logout |
| 403 | Sem permissão | Notificar + redirect opcional |
| 404 | Não encontrado | Mensagem específica na UI |
| 409 | Conflito | Mensagem de conflito (ex.: documento duplicado) |
| 422 | Entidade inválida | Similar a 400 |
| 500+ | Erro servidor | Mensagem genérica + log |

Tratamento específico por status fica no **composable**, não no service:

```typescript
catch (error) {
  const apiError = error as ApiError;
  if (apiError.status === 403) {
    erro('Você não tem permissão para esta ação.');
    return;
  }
  erro(tratarErro.mensagem(error));
}
```

---

## Fluxo completo — Exemplo CRUD

```
┌──────────────────────────────────────────────────────────────┐
│ ClientesListPage.vue                                         │
│   @click="excluir(cliente.id)"                               │
│   usa useClientes()                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ useClientes.ts                                               │
│   excluir(id) → try store.excluir → notificacao.sucesso     │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ clientes.store.ts                                            │
│   excluir(id) → clientesService.excluir(id) → atualiza state│
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ clientes.service.ts                                          │
│   excluir(id) → api.delete(`/clientes/${id}`)               │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ boot/axios.ts                                                │
│   interceptor unwrap + normalizeApiError                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
                    API Backend
```

---

## Boas práticas — resumo

- ✅ Um service por domínio
- ✅ Tipagem forte em request e response
- ✅ Erros normalizados via interceptor
- ✅ Token via request interceptor
- ✅ Cancelamento com AbortSignal em buscas
- ✅ DTOs separados quando API ≠ domínio
- ✅ Paginação e filtros tipados

## Antipadrões — resumo

- ❌ `api.get` em componentes
- ❌ `any` nos tipos de response
- ❌ Catch vazio
- ❌ URL hardcoded
- ❌ Lógica de retry duplicada por service
- ❌ Notify/router dentro de service
- ❌ Ignorar envelope `ApiResponse` fora do interceptor

---

## Referências

- [Arquitetura](./architecture.md)
- [Estrutura de pastas](./folder-structure.md)
- [Responsabilidade única](./single-responsibility.md)
- [Regras para IA](./cursor.rules.md)
