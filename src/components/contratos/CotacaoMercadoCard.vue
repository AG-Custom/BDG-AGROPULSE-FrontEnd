<template>
  <agro-card>
    <div class="cotacao">
      <div>
        <div class="text-caption">Cotação de mercado</div>
        <div v-if="cotacao">
          {{ cotacao.produto }} · {{ cotacao.fonte }} ·
          <span class="text-metric">{{ formatarMoeda(cotacao.preco) }}</span>
        </div>
        <div v-else class="text-secondary">Nenhuma cotação carregada.</div>
      </div>
      <div class="acoes">
        <agro-btn
          flat
          icon="refresh"
          label="Atualizar"
          descricao="Atualizar cotação"
          :loading="loading"
          @click="$emit('atualizar')"
        />
        <agro-btn
          v-if="mostrarAplicar && cotacao"
          color="primary"
          unelevated
          icon="content_paste"
          label="Aplicar no formulário"
          descricao="Aplicar cotação no formulário"
          @click="$emit('aplicar', cotacao)"
        />
      </div>
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import type { CotacaoMercadoDto } from 'types/dtos/contrato.dto';
import { formatarMoeda } from 'utils/formatters';

withDefaults(
  defineProps<{
    cotacao: CotacaoMercadoDto | null;
    loading?: boolean;
    mostrarAplicar?: boolean;
  }>(),
  {
    loading: false,
    mostrarAplicar: false,
  },
);

defineEmits<{
  atualizar: [];
  aplicar: [cotacao: CotacaoMercadoDto];
}>();
</script>

<style scoped>
.cotacao {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
</style>
