<template>
  <agro-card>
    <div class="nota">
      <div class="nota__info">
        <div class="text-caption">NFC-e</div>
        <agro-badge :label="rotulo" :variant="variante" />
        <p v-if="nota?.chaveAcesso" class="nota__texto text-metric">Chave: {{ nota.chaveAcesso }}</p>
        <p v-if="nota?.mensagemErro" class="nota__texto">{{ nota.mensagemErro }}</p>
      </div>
      <agro-btn
        v-if="podeEmitir && precisaEmitir"
        color="primary"
        unelevated
        icon="receipt_long"
        :label="nota?.status ? 'Tentar novamente' : 'Emitir NFC-e'"
        descricao="Emitir NFC-e desta venda"
        :loading="emitindo"
        @click="emit('emitir')"
      />
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import type { PdvNotaFiscalDto } from 'types/dtos/pdv.dto';
import { computed } from 'vue';

const props = defineProps<{
  nota: PdvNotaFiscalDto | null;
  podeEmitir: boolean;
  emitindo: boolean;
}>();
const emit = defineEmits<{ emitir: [] }>();

const REEMITIVEIS = ['Rascunho', 'Erro', 'Rejeitada', 'ResultadoDesconhecido'];

const precisaEmitir = computed(() => !props.nota?.status || REEMITIVEIS.includes(props.nota.status));

const rotulo = computed(() => props.nota?.status ?? 'Não emitida');

const variante = computed<'success' | 'warning' | 'error' | 'default'>(() => {
  const status = props.nota?.status;
  if (status === 'Emitida') return 'success';
  if (status === 'Processando' || status === 'Contingencia') return 'warning';
  if (status === 'Erro' || status === 'Rejeitada') return 'error';
  return 'default';
});
</script>

<style scoped>
.nota {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}
.nota__texto {
  margin: var(--spacing-2) 0 0;
  color: var(--color-text-secondary);
  word-break: break-all;
}
</style>
