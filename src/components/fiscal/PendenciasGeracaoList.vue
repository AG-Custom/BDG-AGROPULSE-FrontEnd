<template>
  <agro-card v-if="pendencias.length > 0" class="pendencias-geracao">
    <h2 class="pendencias-geracao__titulo">Pendências que impedem a geração</h2>
    <ul class="pendencias-geracao__lista">
      <li v-for="(pendencia, indice) in pendencias" :key="indice" class="pendencias-geracao__item">
        <agro-badge label="Bloqueante" variant="error" />
        <span>{{ pendencia.descricao }}</span>
      </li>
    </ul>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import type { PendenciaGeracaoArquivoDto } from 'types/dtos/obrigacao-fiscal.dto';

defineProps<{ pendencias: PendenciaGeracaoArquivoDto[] }>();
</script>

<style scoped>
.pendencias-geracao__titulo {
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
  margin: 0 0 var(--spacing-3);
}

.pendencias-geracao__lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.pendencias-geracao__item {
  align-items: center;
  color: var(--color-text-primary);
  display: flex;
  gap: var(--spacing-3);
}
</style>
