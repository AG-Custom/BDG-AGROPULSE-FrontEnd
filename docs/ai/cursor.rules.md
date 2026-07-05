# Regras Imperativas para IA — AgroPulse Frontend

> Regras objetivas, sem ambiguidade. Violação de qualquer regra abaixo é considerada erro.

Documentação completa: [`docs/ai/`](./)

---

## Arquitetura e camadas

1. **SEMPRE** respeite o fluxo de camadas: `Component/Page → Composable → Store → Service → HTTP Client → API`.
2. **NUNCA** importe `boot/axios`, `services/api` ou qualquer cliente HTTP em arquivos `.vue` (pages, layouts, components).
3. **NUNCA** importe services (`services/`) diretamente em componentes ou pages — use composables ou stores.
4. **NUNCA** importe componentes Vue, Quasar Notify ou vue-router dentro de services.
5. **NUNCA** importe componentes Vue dentro de stores.
6. **SEMPRE** use composables como facade para stores quando a UI precisar de estado/ações.
7. **SEMPRE** centralize guards de autenticação e permissão em `router/index.ts` — nunca duplique em pages.
8. **SEMPRE** use aliases de importação (`composables/`, `types/`, etc.) — nunca caminhos relativos com `../../../`.

---

## TypeScript e tipagem

9. **SEMPRE** utilize tipagem forte — o projeto está em `strict: true`.
10. **NUNCA** utilize `any` sem comentário `// eslint-disable` ou justificativa explícita no PR.
11. **SEMPRE** defina tipos de entidade em `types/entidades/` e tipos de API em `types/api/`.
12. **SEMPRE** tipifique props com `defineProps<{ ... }>()` e emits com `defineEmits<{ ... }>()`.
13. **SEMPRE** tipifique retornos de funções async em services com `Promise<T>`.
14. **NUNCA** use `as any` para silenciar erros de tipo — corrija o tipo na origem.

---

## Responsabilidade única

15. **NUNCA** misture regra de negócio com apresentação no mesmo arquivo.
16. **NUNCA** coloque chamadas HTTP, lógica de domínio ou acesso a storage dentro de componentes.
17. **NUNCA** coloque notificações (Notify) ou navegação (router) dentro de services.
18. **NUNCA** coloque formatação visual (labels, cores) dentro de services — isso é responsabilidade da UI.
19. **SEMPRE** mantenha componentes pequenos — se passar de ~150 linhas, divida.
20. **SEMPRE** divida arquivos grandes em composables, utils e subcomponentes.
21. **NUNCA** crie funções com mais de ~30 linhas — extraia subfunções ou utils.
22. **NUNCA** crie componentes com múltiplas responsabilidades (fetch + form + tabela + modal no mesmo arquivo).
23. **SEMPRE** priorize composição de componentes ao invés de componentes monolíticos.

---

## Estrutura de pastas e nomenclatura

24. **SEMPRE** siga a estrutura de pastas definida em `docs/ai/folder-structure.md`.
25. **SEMPRE** crie pages em `pages/{dominio}/{Nome}Page.vue`.
26. **SEMPRE** crie services em `services/{dominio}.service.ts`.
27. **SEMPRE** crie stores em `stores/{dominio}.store.ts`.
28. **SEMPRE** crie composables em `composables/use{Nome}.ts`.
29. **SEMPRE** use PascalCase para componentes Vue e camelCase para funções/composables.
30. **NUNCA** crie pasta `hooks/` — use `composables/` (convenção Vue).
31. **NUNCA** crie pasta `helpers/` — use `utils/`.
32. **SEMPRE** coloque funções puras (sem Vue) em `utils/`, nunca em composables.

---

## API e HTTP

33. **NUNCA** faça chamadas HTTP fora de `services/` e `boot/axios.ts`.
34. **SEMPRE** use a instância `api` de `boot/axios.ts` — nunca `axios` direto ou `fetch`.
35. **SEMPRE** trate erros propagados como `ApiError` — nunca catch vazio.
36. **SEMPRE** deixe o interceptor responsável por unwrap de `ApiResponse<T>` — não repita `.data.data` nos services.
37. **SEMPRE** separe DTOs da API de entidades de domínio quando houver transformação.
38. **NUNCA** hardcode URLs de API — use `VITE_API_URL` via configuração do axios.
39. **SEMPRE** use `AbortSignal` para requisições canceláveis (busca, autocomplete, filtros).

---

## Reutilização e DRY

40. **NUNCA** duplique lógica — extraia para composable, util ou store.
41. **SEMPRE** reutilize composables existentes antes de criar novos (`useAuth`, `useNotificacao`, `useTratarErroFormulario`).
42. **SEMPRE** reutilize componentes de `components/ui/` e `components/shared/` antes de criar novos.
43. **SEMPRE** centralize constantes de domínio em `constants/` — nunca magic strings espalhadas.
44. **NUNCA** copie/cole blocos de código entre features — abstraia.

---

## Vue e Quasar

45. **SEMPRE** use `<script setup lang="ts">` — nunca Options API.
46. **SEMPRE** use `scoped` em estilos de componente — estilos globais apenas em `css/`.
47. **SEMPRE** prefira import explícito de componentes — registro global apenas via `boot/components.ts` e só para componentes muito frequentes.
48. **SEMPRE** use componentes Quasar (`q-btn`, `q-input`, `q-table`) ao invés de recriar primitivos.
49. **NUNCA** manipule DOM diretamente em components — exceção: download de blob no composable.

---

## Estado

50. **SEMPRE** use Pinia para estado compartilhado entre rotas ou features distantes.
51. **NUNCA** use `ref()` global ou módulo-level para estado compartilhado — use store.
52. **SEMPRE** use `storeToRefs()` no composable para expor state reativo — nunca desestruture store diretamente na UI.
53. **SEMPRE** mantenha estado local de UI (drawer aberto, tab ativa) como `ref` no componente — não polua store.

---

## Segurança e permissões

54. **SEMPRE** defina `meta.permissao` em rotas protegidas usando `constants/permissoes.ts`.
55. **SEMPRE** verifique permissões via `usePermissao()` ou `useAuth()` — nunca compare strings de permissão inline.
56. **NUNCA** commite arquivos `.env`, tokens ou credenciais.

---

## Ao criar código novo

Antes de finalizar, verifique:

- [ ] Nenhum import de `boot/axios` fora de `services/` e `boot/`
- [ ] Tipos definidos em `types/`
- [ ] Service criado se há chamada API
- [ ] Store criada se há estado compartilhado
- [ ] Composable expõe API conveniente para UI
- [ ] Componente/page apenas renderiza e delega
- [ ] Nenhum `any` sem justificativa
- [ ] Aliases de importação usados
- [ ] Nomes seguem convenções do projeto

---

## Design System

Ao criar ou modificar UI, consulte também:

- [Design System](./design-system/README.md)
- Regras Cursor: `.cursor/rules/designsystem/`

## Prioridade de leitura

Ao iniciar qualquer tarefa, consulte nesta ordem:

1. [cursor.rules.md](./cursor.rules.md) (este arquivo)
2. [architecture.md](./architecture.md)
3. [folder-structure.md](./folder-structure.md)
4. [single-responsibility.md](./single-responsibility.md)
5. [api.md](./api.md)
6. [design-system/](./design-system/) — ao trabalhar com UI
