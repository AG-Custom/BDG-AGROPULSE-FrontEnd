<template>
  <agro-card class="geracao-card">
    <div class="geracao-card__topo">
      <q-icon name="description" class="geracao-card__icone" size="1.75rem" />
      <agro-badge v-if="statusPerfil" :label="statusPerfil.label" :variant="statusPerfil.variant" />
    </div>

    <h3 class="geracao-card__titulo">{{ titulo }}</h3>
    <p class="geracao-card__descricao">{{ descricao }}</p>

    <div class="geracao-card__acoes">
      <agro-btn
        color="primary"
        unelevated
        icon="play_arrow"
        :label="`Gerar ${titulo}`"
        :descricao="`Gerar o arquivo ${titulo} da competência selecionada`"
        :loading="gerando"
        :disable="desabilitado"
        @click="emit('gerar')"
      />
      <agro-btn
        v-if="temPerfil"
        flat
        color="primary"
        icon="tune"
        label="Configurar perfil"
        :descricao="`Configurar o perfil da ${titulo}`"
        @click="emit('configurar-perfil')"
      />
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroBtn from 'components/ui/AgroBtn.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { computed } from 'vue';

const props = defineProps<{
  titulo: string;
  descricao: string;
  gerando: boolean;
  desabilitado: boolean;
  temPerfil: boolean;
  perfilConfigurado?: boolean;
}>();

const emit = defineEmits<{
  gerar: [];
  'configurar-perfil': [];
}>();

const statusPerfil = computed(() => {
  if (!props.temPerfil) return null;
  return props.perfilConfigurado
    ? { label: 'Perfil configurado', variant: 'success' as const }
    : { label: 'Perfil pendente', variant: 'warning' as const };
});
</script>

<style scoped>
.geracao-card {
  border-color: var(--color-primary-200);
  height: 100%;
}

.geracao-card__topo {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.geracao-card__icone {
  color: var(--color-primary-600);
}

.geracao-card__titulo {
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-2);
}

.geracao-card__descricao {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-4);
}

.geracao-card__acoes {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
</style>
