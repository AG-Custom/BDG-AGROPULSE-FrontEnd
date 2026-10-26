<template>
  <agro-card v-if="pendencias.length > 0">
    <h3 class="apuracao-pendencias__titulo">Pendências da apuração</h3>
    <ul class="apuracao-pendencias__lista">
      <li v-for="(pendencia, indice) in pendencias" :key="indice" class="apuracao-pendencias__item">
        <agro-badge
          :label="pendencia.gravidade === 'Bloqueante' ? 'Bloqueante' : 'Alerta'"
          :variant="pendencia.gravidade === 'Bloqueante' ? 'error' : 'warning'"
        />
        <span>{{ pendencia.descricao }}</span>
      </li>
    </ul>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import type { PendenciaApuracaoDto } from 'types/dtos/apuracao-fiscal.dto';

defineProps<{ pendencias: PendenciaApuracaoDto[] }>();
</script>

<style scoped>
.apuracao-pendencias__titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-3);
}

.apuracao-pendencias__lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.apuracao-pendencias__item {
  align-items: center;
  display: flex;
  gap: var(--spacing-3);
}
</style>
