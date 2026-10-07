<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog-visualizar">
      <q-card-section>
        <h4 class="titulo">Visualizar nota fiscal</h4>
      </q-card-section>
      <q-card-section>
        <q-form class="agro-formulario agro-formulario--bloqueado">
          <p v-if="nota?.mensagemErro" class="alerta">{{ nota.codigoSefaz }} {{ nota.mensagemErro }}</p>
          <p v-if="nota?.homologacao != null" class="ambiente">
            Ambiente: {{ nota.homologacao ? 'Homologação' : 'Produção' }}. Protocolo: {{ nota.protocoloAutorizacao ?? 'Aguardando autorização' }}
          </p>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input :model-value="nota ? String(nota.modeloDocumento) : ''" outlined label="Modelo" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="nota?.numero ?? ''" outlined label="Número" readonly />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="nota?.serie ?? ''" outlined label="Série" readonly />
            </div>
            <div class="col-12 col-md-4 campo-status">
              <span class="campo-status__rotulo">Status</span>
              <nota-fiscal-status-badge v-if="nota" :valor="String(nota.status)" />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="nota ? formatarMoeda(nota.valorTotal) : ''" outlined label="Valor total" readonly input-class="text-metric" />
            </div>
            <div class="col-12 col-md-4">
              <q-input :model-value="nota?.emitidaEm ? formatarData(nota.emitidaEm) : '—'" outlined label="Emitida em" readonly />
            </div>
            <div class="col-12">
              <q-input :model-value="nota?.chaveAcesso ?? ''" outlined label="Chave de acesso" readonly />
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="nota?.naturezaOperacao ?? ''" outlined label="Natureza da operação" readonly />
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="nota?.cfop ?? ''" outlined label="CFOP" readonly />
            </div>
          </div>
          <section v-if="nota" class="linha-tempo">
            <h5 class="linha-tempo__titulo">Linha do tempo</h5>
            <nota-fiscal-timeline :itens="itens" />
          </section>
          <div class="agro-form-actions">
            <agro-btn flat label="Fechar" descricao="Fechar" @click="emit('update:modelValue', false)" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import NotaFiscalStatusBadge from 'components/fiscal/NotaFiscalStatusBadge.vue';
import NotaFiscalTimeline from 'components/fiscal/NotaFiscalTimeline.vue';
import type { NotaFiscalGestaoDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { montarLinhaTempo } from 'utils/nfe-timeline';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  nota: NotaFiscalGestaoDto | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const itens = computed(() => (props.nota ? montarLinhaTempo(props.nota) : []));
</script>

<style scoped>
.dialog-visualizar {
  min-width: min(720px, 94vw);
}

.titulo,
.linha-tempo__titulo {
  font-family: var(--font-family-display);
  margin: 0;
}

.titulo {
  font-size: var(--font-size-lg);
}

.campo-status {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  justify-content: flex-end;
}

.campo-status__rotulo {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.ambiente {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-4);
}

.alerta {
  background: var(--color-warning-50);
  border: var(--border-width-thin) solid var(--color-warning-500);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
}

.linha-tempo {
  border-top: var(--border-width-thin) solid var(--color-border-default);
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
}

.linha-tempo__titulo {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-4);
}
</style>
