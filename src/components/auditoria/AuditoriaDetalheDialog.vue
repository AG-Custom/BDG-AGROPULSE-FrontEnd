<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="auditoria-detalhe" flat bordered>
      <q-card-section class="auditoria-detalhe__cabecalho">
        <div>
          <h4 class="auditoria-detalhe__titulo">Detalhe da alteração</h4>
          <p class="auditoria-detalhe__subtitulo">
            {{ rotuloAcaoAuditoria(log.acao) }} em
            {{ rotuloModeloAuditoria(log.modeloAfetado) }}
          </p>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          aria-label="Fechar detalhe de auditoria"
          @click="emit('update:modelValue', false)"
        />
      </q-card-section>

      <q-card-section class="auditoria-detalhe__meta">
        <div>
          <span class="auditoria-detalhe__label">Quando</span>
          <p>{{ formatarDataHora(log.createdAt) }}</p>
        </div>
        <div>
          <span class="auditoria-detalhe__label">Quem</span>
          <p>{{ log.usuarioNome || (log.usuarioId ? log.usuarioId : 'Sistema') }}</p>
        </div>
        <div>
          <span class="auditoria-detalhe__label">Registro</span>
          <p class="text-metric">{{ log.registroId }}</p>
        </div>
        <div>
          <span class="auditoria-detalhe__label">Descrição</span>
          <p>{{ log.descricao || '—' }}</p>
        </div>
      </q-card-section>

      <q-card-section class="auditoria-detalhe__diffs">
        <div>
          <span class="auditoria-detalhe__label">Antes</span>
          <pre class="auditoria-detalhe__json text-metric">{{
            formatarDiffAuditoria(log.valorAnterior)
          }}</pre>
        </div>
        <div>
          <span class="auditoria-detalhe__label">Depois</span>
          <pre class="auditoria-detalhe__json text-metric">{{
            formatarDiffAuditoria(log.valorNovo)
          }}</pre>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { LogAuditoriaDto } from 'types/dtos/auditoria.dto';
import {
  formatarDiffAuditoria,
  rotuloAcaoAuditoria,
  rotuloModeloAuditoria,
} from 'utils/auditoria-labels';
import { formatarDataHora } from 'utils/formatters';

defineProps<{
  modelValue: boolean;
  log: LogAuditoriaDto;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<style scoped lang="scss">
.auditoria-detalhe {
  width: min(920px, 96vw);
  background: var(--color-surface-default);
}

.auditoria-detalhe__cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
  border-bottom: 1px solid var(--color-border-default);
}

.auditoria-detalhe__titulo {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.auditoria-detalhe__subtitulo {
  margin: var(--spacing-1) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auditoria-detalhe__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-4);
}

.auditoria-detalhe__label {
  display: block;
  margin-bottom: var(--spacing-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.auditoria-detalhe__meta p {
  margin: 0;
  color: var(--color-text-primary);
  word-break: break-word;
}

.auditoria-detalhe__diffs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-4);
  border-top: 1px solid var(--color-border-default);
}

.auditoria-detalhe__json {
  margin: 0;
  padding: var(--spacing-3);
  max-height: 320px;
  overflow: auto;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-sunken);
  white-space: pre-wrap;
  word-break: break-word;
  font-size: var(--font-size-xs);
}

@media (max-width: 720px) {
  .auditoria-detalhe__meta,
  .auditoria-detalhe__diffs {
    grid-template-columns: 1fr;
  }
}
</style>
