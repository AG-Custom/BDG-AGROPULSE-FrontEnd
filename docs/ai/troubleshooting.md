# Troubleshooting — AgroPulse Frontend

> Registro de problemas conhecidos, sintomas, causas e soluções. Consulte antes de debugar ou ao encontrar comportamento estranho.

Formato de cada entrada:

| Campo | Descrição |
|---|---|
| **ID** | Identificador único |
| **Sintoma** | O que o usuário/dev vê |
| **Causa** | Por que acontece |
| **Solução** | Como corrigir |
| **Prevenção** | Como evitar no futuro |

---

## Navegação e Router

### NAV-001 — Tela branca ao navegar entre páginas (precisa F5)

| | |
|---|---|
| **Sintoma** | Clicar em link interno (`Cadastre-se`, após login, etc.) mostra tela branca. F5 carrega a página corretamente. |
| **Causa** | Vue Router **reutiliza** componentes de layout quando a rota muda mas o componente pai é o mesmo (ou quando duas rotas compartilham `path: '/'`). O `<router-view>` não remonta o filho. Com Quasar `q-layout`, o problema é mais visível. |
| **Solução** | 1. **Nunca** ter dois route records com o mesmo `path` apontando para layouts diferentes.<br>2. Usar paths exclusivos: `/login`, `/cadastro`, `/` (dashboard).<br>3. Adicionar `:key` nos `router-view`:<br>&nbsp;&nbsp;• `App.vue` → key por `meta.layout` (`auth` \| `main`)<br>&nbsp;&nbsp;• `AuthLayout.vue` / `MainLayout.vue` → key por `$route.name` |
| **Prevenção** | Ao criar rotas, cada layout distinto deve ter path único ou `meta.layout` + key no `App.vue`. Ver `src/router/routes.ts` e `src/App.vue`. |
| **Status** | ✅ Corrigido em 2026-07-05 |

**Referência de código:**

```vue
<!-- App.vue -->
<router-view v-slot="{ Component, route }">
  <component :is="Component" :key="layoutKey(route)" />
</router-view>
```

```typescript
// routes.ts — meta.layout distingue auth vs main
meta: { layout: 'auth' }  // rotas /login, /cadastro, /confirm-email
meta: { layout: 'main' }  // rota /
```

---

### NAV-002 — Tela branca após login bem-sucedido

| | |
|---|---|
| **Sintoma** | Login retorna 200, tokens salvos, mas dashboard não aparece até F5. |
| **Causa** | Mesma raiz do NAV-001: transição de `AuthLayout` → `MainLayout` com rotas ambíguas em `/`. Também `router.push('/')` pode conflitar quando auth também estava registrado em `/`. |
| **Solução** | 1. Rotas auth em paths dedicados (`/login`, não filho ambíguo de `/`).<br>2. Após login usar `router.replace({ name: 'dashboard' })` em vez de `router.push('/')`.<br>3. `meta.layout` + key em `App.vue`. |
| **Prevenção** | Sempre redirecionar por **nome de rota** (`name: 'dashboard'`) após auth. |
| **Status** | ✅ Corrigido em 2026-07-05 |

---

### NAV-003 — Usuário autenticado acessa /login ou /cadastro

| | |
|---|---|
| **Sintoma** | Logado e consegue ver tela de login. |
| **Causa** | Rota pública sem guard de convidado. |
| **Solução** | `meta.convidado: true` + guard em `router/index.ts` redireciona para dashboard se autenticado. |
| **Prevenção** | Toda rota só para visitantes deve ter `meta.convidado: true`. |
| **Status** | ✅ Implementado |

---

## API e HTTP

### API-001 — Chamada vai para `/auth/login` em vez de `/api/auth/login`

| | |
|---|---|
| **Sintoma** | Network tab mostra `https://localhost:7206/auth/login` → 404. |
| **Causa** | `VITE_API_URL` ou fallback do axios sem sufixo `/api`. |
| **Solução** | `VITE_API_URL=https://localhost:7206/api` no `.env.local`. Fallback em `boot/axios.ts` deve incluir `/api`. Services usam paths relativos: `/auth/login`. |
| **Prevenção** | URL base = host + prefixo `/api`. Endpoints nos services **sem** repetir `api/`. |
| **Status** | ✅ Corrigido em 2026-07-05 |

---

### API-002 — Erro de conexão / CORS

| | |
|---|---|
| **Sintoma** | Toast "Não foi possível conectar à API". Console: CORS blocked. |
| **Causa** | Backend não permite origem do frontend (`http://localhost:9000`). |
| **Solução** | Configurar CORS no backend para a origem do Vite. Alternativa dev: proxy no `vite.config.ts`. |
| **Prevenção** | Documentar origens permitidas no backend. |
| **Status** | ⚠️ Depende de config backend |

---

### API-003 — Certificado HTTPS inválido (localhost)

| | |
|---|---|
| **Sintoma** | Falha de rede ao chamar `https://localhost:7206`. |
| **Causa** | Certificado self-signed não confiável pelo browser. |
| **Solução** | Aceitar certificado no browser acessando a API diretamente, ou usar HTTP em dev, ou proxy Vite com `secure: false`. |
| **Prevenção** | `.env.local` com URL correta para ambiente dev. |
| **Status** | ⚠️ Ambiente local |

---

## Autenticação

### AUTH-001 — Login ok mas dashboard bloqueado por permissão

| | |
|---|---|
| **Sintoma** | Autenticado mas redirect loop ou página vazia. |
| **Causa** | `possuiPermissao` falha — login não retorna permissões; mapper usa default temporário. |
| **Solução** | Integrar `/auth/me` para permissões reais, ou garantir mapper em `utils/auth.mapper.ts` inclui permissões necessárias. |
| **Prevenção** | Após login, sincronizar usuário com endpoint `/auth/me` quando disponível. |
| **Status** | ⚠️ Temporário — aguarda `/auth/me` |

---

### AUTH-002 — Link de confirmação de e-mail aponta para porta errada

| | |
|---|---|
| **Sintoma** | Link do e-mail abre app errada ou 404. |
| **Causa** | Backend envia `http://localhost:3000/confirm-email` mas frontend roda na **9000**. |
| **Solução** | Configurar URL do frontend no backend: `http://localhost:9000/confirm-email?userId=...&token=...` |
| **Prevenção** | Variável de ambiente no backend para `FrontendBaseUrl`. |
| **Status** | ⚠️ Config backend |

---

### AUTH-003 — Fluxo SuperHost / sistema fechado

| | |
|---|---|
| **Sintoma** | SuperHost sem empresa cai no dashboard ou usuário tenta cadastro público. |
| **Causa** | Cadastro público e onboarding self-service foram removidos. |
| **Solução** | Guard: `precisaConsolePlataforma` → `/plataforma`. Criar empresa via console; acessar com `POST /auth/selecionar-empresa`. |
| **Prevenção** | Não reintroduzir `/cadastro` nem `/onboarding` self-service. |
| **Status** | ✅ Implementado em 2026-08-03 |

**Fluxo esperado (SuperHost):**

1. `/login` → `isSuperHost` + `requiresEmpresaSelection`
2. `/plataforma` → listar/criar empresas
3. Acessar → `selecionar-empresa` → (opcional) unidade → dashboard

---

## UI / Quasar

### UI-001 — q-layout aninhado ou página sem q-page

| | |
|---|---|
| **Sintoma** | Conteúdo não aparece ou layout quebrado. |
| **Causa** | Páginas dentro de `q-layout` devem usar `<q-page>`. |
| **Solução** | Envolver conteúdo em `<q-page class="...">`. |
| **Prevenção** | Seguir padrão das pages em `pages/auth/` e `pages/dashboard/`. |
| **Status** | 📘 Referência |

---

## Ambiente e Build

### ENV-001 — Variáveis de ambiente não aplicam

| | |
|---|---|
| **Sintoma** | API URL errada mesmo após editar `.env`. |
| **Causa** | Vite só carrega `.env.local` / `.env` na **inicialização**. |
| **Solução** | Reiniciar `npm run dev` após alterar env. |
| **Prevenção** | Copiar `.env.example` → `.env.local` no setup inicial. |
| **Status** | 📘 Referência |

---

## Checklist rápido — "Tela branca"

1. [ ] Duas rotas com mesmo `path` e layouts diferentes? → Separar paths
2. [ ] `App.vue` tem `:key` no router-view por layout?
3. [ ] Layouts têm `:key` no router-view interno?
4. [ ] Após login usa `router.replace({ name: 'dashboard' })`?
5. [ ] Console do browser tem erro JavaScript?
6. [ ] Componente da page usa `<q-page>`?

---

## Como registrar novo problema

Ao resolver um bug recorrente, adicione entrada neste arquivo:

```markdown
### CATEG-XXX — Título curto

| | |
|---|---|
| **Sintoma** | ... |
| **Causa** | ... |
| **Solução** | ... |
| **Prevenção** | ... |
| **Status** | ✅ Corrigido em YYYY-MM-DD |
```

Categorias: `NAV`, `API`, `AUTH`, `UI`, `ENV`.

---

## Histórico (Changelog)

| Data | ID | Descrição |
|---|---|---|
| 2026-07-05 | NAV-001 | Tela branca login ↔ cadastro — rotas unificadas + key |
| 2026-07-05 | NAV-002 | Tela branca pós-login — paths dedicados + meta.layout + replace |
| 2026-07-05 | API-001 | Base URL sem `/api` — fallback corrigido |
| 2026-07-05 | AUTH-003 | Fluxo completo cadastro → confirmação → onboarding → dashboard |

---

## Referências

- [Arquitetura](./architecture.md)
- [Design System](./design-system/README.md)
- Rotas: `src/router/routes.ts`
- Guard: `src/router/index.ts`
