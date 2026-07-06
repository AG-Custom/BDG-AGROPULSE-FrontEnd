# 11 — Feedback Visual

---

## Hierarquia de feedback

Do menos ao mais intrusivo:

1. **Inline** — erro de campo, badge de status
2. **Banner** — alerta contextual persistente na page
3. **Toast/Notify** — confirmação temporária de ação
4. **Modal** — confirmação destrutiva ou decisão crítica
5. ~~Fullscreen loader~~ — **PROIBIDO**

---

## Toast / Snackbar

**Implementação:** `useNotificacao()` → Quasar `Notify`.

| Tipo | Duração | Posição |
|---|---|---|
| Sucesso | 4000ms | top-right |
| Info | 4000ms | top-right |
| Aviso | 5000ms | top-right |
| Erro | 6000ms | top-right |

### Regras
- Máximo 3 toasts simultâneos
- Mensagem ≤ 80 caracteres
- Ação undo opcional (futuro) — link no toast
- **Sempre** via composable — nunca `Notify.create` direto

```typescript
const { sucesso, erro } = useNotificacao();
sucesso('Safra cadastrada com sucesso.');
erro('Não foi possível salvar. Verifique os campos.');
```

### Quando usar
- Confirmação de CRUD
- Erro genérico de API (sem campo específico)
- Operação em background concluída

### Quando não usar
- Erro de validação de campo (usar inline)
- Alertas persistentes (usar banner)
- Conteúdo > 1 frase (usar modal ou banner)

---

## Alert / Banner (`q-banner`)

Persistente na page até dismiss ou condição resolver.

| Variante | Classe | Uso |
|---|---|---|
| Info | `bg-info-50` + text info | Informação operacional |
| Warning | `bg-warning-50` + text warning | Safra em risco, prazo |
| Error | `bg-error-50` + text error | Falha de integração |
| Success | `bg-success-50` + text success | Migração concluída |

```vue
<q-banner inline-actions rounded class="bg-warning-50 text-warning-700">
  Período de entressafra — dados de produção parcialmente indisponíveis.
  <template #action>
    <q-btn flat label="Entendi" />
  </template>
</q-banner>
```

---

## Loading

| Pattern | Quando |
|---|---|
| Button `:loading` | Submit, ação pontual |
| `AgroTableSkeleton` (props `linhas`/`colunas`) | Primeiro carregamento de listagens |
| `AgroFormSkeleton` (prop `campos`) | Primeiro carregamento de formulários (modo edição) |
| Table `:loading` | Recarga de dados tabulares (filtros, paginação) |
| Skeleton (`q-skeleton`) | Outros layouts conhecidos, fetch > 200ms |
| Inline spinner | Área < 100px, estados pontuais de auth (ConfirmEmail, SelecionarUnidade) |

**Proibido:** overlay fullscreen, `q-inner-loading` em forms/listagens, blur loading, progress falso.

---

## Empty State

Componente dedicado para zero-data.

### Anatomia
1. Ícone 48px (`color.neutral.300`)
2. Título (`typography.h4`)
3. Descrição (`typography.body.sm`, `color.text.secondary`)
4. CTA opcional (button primary)

### Variantes

| Contexto | Mensagem exemplo |
|---|---|
| Lista vazia | "Nenhum cliente cadastrado" |
| Busca vazia | "Nenhum resultado para '{termo}'" |
| Sem permissão | "Você não tem acesso a este módulo" |
| Erro de carga | "Não foi possível carregar os dados" + botão retry |

---

## Error State

Para falha de fetch (diferente de empty):

```vue
<div class="error-state">
  <q-icon name="cloud_off" size="48px" color="grey-5" />
  <div class="text-h6">Falha ao carregar</div>
  <p class="text-body-sm text-grey-7">Verifique sua conexão e tente novamente.</p>
  <q-btn outline color="primary" label="Tentar novamente" @click="recarregar" />
</div>
```

Centralizado no container pai. Sem modal para erro de fetch.

---

## Confirmação destrutiva

Modal persistent:

```vue
<q-dialog v-model="confirmarExclusao" persistent>
  <q-card>
    <q-card-section class="text-h6">Excluir safra?</q-card-section>
    <q-card-section>
      Esta ação não pode ser desfeita. Todos os talhões vinculados serão desassociados.
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" v-close-popup />
      <q-btn color="negative" unelevated label="Excluir" :loading="excluindo" @click="excluir" />
    </q-card-actions>
  </q-card>
</q-dialog>
```

Verbo destrutivo no botão ("Excluir", não "Confirmar"). Cor `negative`.

---

## Progress (operaciones longas)

Para exportação/relatório > 3s: barra de progresso determinada ou indeterminada **inline** na seção — nunca overlay.

```vue
<q-linear-progress v-if="gerando" indeterminate color="primary" class="q-mb-md" />
```
