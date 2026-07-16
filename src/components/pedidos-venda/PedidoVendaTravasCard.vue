<template>
  <agro-card class="pedido-venda-travas">
    <template #header>
      <div class="pedido-venda-travas__header">
        <h3 class="pedido-venda-travas__titulo">Travas de aprovação</h3>
        <agro-badge
          v-if="travas.length === 0 && !carregando"
          label="Sem travas"
          variant="success"
        />
      </div>
    </template>

    <agro-form-skeleton v-if="carregando" :campos="2" />

    <empty-state
      v-else-if="travas.length === 0"
      titulo="Nenhuma trava"
      descricao="Este pedido não possui bloqueios de margem, crédito, estoque ou atraso."
      icon="verified"
    />

    <div v-else class="pedido-venda-travas__lista">
      <div
        v-for="trava in travas"
        :key="`${trava.tipo}-${trava.motivo}`"
        class="pedido-venda-travas__item"
      >
        <agro-badge :label="rotuloTrava(trava.tipo)" variant="warning" />
        <p class="pedido-venda-travas__motivo">{{ trava.motivo }}</p>
      </div>
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import {
  TravaAprovacaoTipoOpcoes,
  type TravaAprovacaoTipoValor,
} from 'constants/enums';
import type { TravaAprovacaoDto } from 'types/dtos/aprovacao.dto';

defineProps<{
  travas: TravaAprovacaoDto[];
  carregando?: boolean;
}>();

function rotuloTrava(tipo: TravaAprovacaoTipoValor | string): string {
  return (
    TravaAprovacaoTipoOpcoes.find((item) => item.value === tipo)?.label ?? tipo
  );
}
</script>

<style scoped>
.pedido-venda-travas__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-3);
  justify-content: space-between;
}

.pedido-venda-travas__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.pedido-venda-travas__lista {
  display: grid;
  gap: var(--spacing-3);
}

.pedido-venda-travas__item {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
}

.pedido-venda-travas__motivo {
  color: var(--color-text-secondary);
  margin: var(--spacing-2) 0 0;
}
</style>
