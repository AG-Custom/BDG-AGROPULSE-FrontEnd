# AgroPulse Frontend

SPA Vue 3 + Quasar 2 + Pinia + Vue Router + Axios, TypeScript `strict`, Vite. Consome a API do `new_agropulse_backend`.

Visão geral do workspace e fluxo BE + FE: `../CLAUDE.md`.

## Regras sempre ativas (vindas do Cursor)

@.cursor/rules/agropulse-core.mdc
@.cursor/rules/agropulse-business-rules-backend.mdc
@.cursor/rules/agropulse-no-inline-comments.mdc
@.cursor/rules/designsystem/agropulse-design-core.mdc

## Regras por área — leia antes de editar

| Ao editar | Ler |
|---|---|
| `src/services/**`, `src/boot/axios.ts`, `src/stores/**` | `.cursor/rules/agropulse-api.mdc`, `docs/ai/api.md` |
| `src/**/*.vue`, `src/composables/**` | `.cursor/rules/agropulse-vue.mdc`, `docs/ai/single-responsibility.md` |
| `src/components/**`, `src/pages/**`, `src/layouts/**` | `.cursor/rules/designsystem/agropulse-design-components.mdc`, `docs/ai/design-system/03-components.md` |
| `<style>` em `.vue` e `src/css/**` | `.cursor/rules/designsystem/agropulse-design-tokens.mdc`, `docs/ai/design-system/02-tokens.md` |
| Formulários | `docs/ai/design-system/10-forms.md` (máscaras de `constants/masks.ts`, `field-required`) |
| Tabelas, cards, métricas | `docs/ai/design-system/12-data-display.md` |
| `src/router/**`, `src/App.vue`, `src/layouts/**` | `.cursor/rules/agropulse-router.mdc`, `docs/ai/troubleshooting.md` (NAV-001/002) |
| Estrutura de pastas nova | `docs/ai/folder-structure.md` |

Checklist e regras numeradas completas: `docs/ai/cursor.rules.md`. Problemas conhecidos (tela branca, `/api` faltando, CORS, SuperHost): `docs/ai/troubleshooting.md`.

## Contrato do backend

O contrato HTTP fica em `../new_agropulse_backend/api-contract/` (as regras do Cursor citam o caminho antigo `C:\Users\Guilherme\Documents\new_agropulse_backend\api-contract\`; o caminho correto agora é dentro de `Agropulse/`). Antes de criar ou alterar service ou DTO, leia o `.md` do módulo. Se o campo ou comportamento não existe no contrato, ele precisa ser criado no backend primeiro.

## Como o código está escrito hoje (prevalece sobre os docs quando divergem)

Copie o padrão de uma feature vizinha. Exemplo recente e completo: tela de CFOP (`pages/fiscal/CfopListPage.vue`, `components/fiscal/RelacionarCfopSaidaDialog.vue`, `composables/useCfops.ts`, `services/fiscal-gestao.service.ts`, `types/dtos/fiscal-gestao.dto.ts`).

- **Composables de feature chamam o service diretamente** e mantêm o estado local (`ref`/`shallowRef`, `carregando`, `salvando`), com feedback via `useNotificacao()` e erros via `useTratarErroFormulario()`. Stores Pinia existem só para estado global (`auth`, `notificacao`, `onboarding`, `plataforma`). Crie store apenas quando o estado for compartilhado entre rotas. Pages e components continuam proibidos de importar `services/` ou `boot/axios`.
- **DTOs da API** ficam em `types/dtos/{dominio}.dto.ts`; `types/api/` guarda o envelope (`ApiResponse`, `ApiError`) e `types/entidades/` os tipos de domínio quando diferem do DTO.
- **Services** em `services/{dominio}.service.ts` como objeto literal (`export const xService = { ... }`), paths sem `/api` (o `baseURL` já inclui), retornando `Promise<T>` com o interceptor já fazendo unwrap.
- **Rotas** em `router/routes.ts` com `meta.permissao: Permissoes.X.Y` (de `constants/permissoes.ts`) e `meta.layout`; item de menu em `constants/navegacao-modulos.ts`.
- **Funções puras** em `utils/` (formatters, mappers, labels). Não criar `helpers/` nem `hooks/`.
- Nada de comentários inline ou narrativos.

## Design system

Identidade, tokens e componentes em `docs/ai/design-system/`. Pontos que mais quebram:

- Nunca hardcodar cor, spacing, radius, shadow — sempre `var(--*)` de `src/css/tokens/`.
- Reutilizar `components/ui/` (`AgroBtn`, `AgroCard`, `AgroBadge`, `AgroMoneyInput`, `AgroSelectCadastro`, `AgroAcoesMenu`, `AgroIconBtn`, `EmptyState`, `MetricTile`, `AgroTableSkeleton`, `AgroFormSkeleton`) e `components/shared/` (`AppPageHeader`, `AgroLogo`) antes de criar.
- Primeiro carregamento com skeleton; nunca `q-inner-loading` nem spinner fullscreen.
- Confirmação destrutiva via `messageService.confirmar()` (SweetAlert2) num composable, nunca `q-dialog` na page.
- Componentes até ~150 linhas; dividir em subcomponentes/composables.

## Comandos

```bash
npm run dev
npm run build
```

`npm run build` roda `vue-tsc --noEmit` + `vite build` e é a verificação de tipos do projeto (não há suíte de testes nem lint configurados). Dev server na porta 9000, com proxy de `/api` para `https://localhost:7206` (backend local). `VITE_API_URL` no `.env.local` (exemplo em `.env.example`).

## Segurança

Tokens só em cookies HttpOnly (`withCredentials: true`); nunca JWT em `localStorage`/`sessionStorage`. Nunca commitar `.env*` com valores.
