<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar status Power BI"
        :loading="carregando"
        @click="atualizar"
      />
    </div>

    <agro-form-skeleton v-if="carregando && !powerBi" :campos="2" />
    <empty-state
      v-else-if="!carregando && !powerBi"
      titulo="Power BI indisponível"
      descricao="Não foi possível obter o status da integração."
      icon="bar_chart"
    />
    <agro-card v-else-if="powerBi" class="power-bi-card">
      <div class="power-bi-card__header">
        <div class="text-h6">Integração Power BI</div>
        <agro-badge
          v-if="powerBi.stub"
          label="Stub"
          variant="warning"
        />
      </div>
      <p class="power-bi-card__mensagem">{{ powerBi.mensagem }}</p>
      <dl v-if="!powerBi.stub && (powerBi.embedUrl || powerBi.workspaceId)" class="power-bi-meta">
        <div v-if="powerBi.workspaceId">
          <dt>Workspace</dt>
          <dd class="text-metric">{{ powerBi.workspaceId }}</dd>
        </div>
        <div v-if="powerBi.embedUrl">
          <dt>Embed URL</dt>
          <dd>
            <a :href="powerBi.embedUrl" target="_blank" rel="noopener noreferrer">
              Abrir relatório
            </a>
          </dd>
        </div>
      </dl>
    </agro-card>
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import { onMounted } from 'vue';

const { powerBi, carregando, carregarPowerBi } = useRelatorios();

async function atualizar(): Promise<void> {
  await carregarPowerBi();
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
.power-bi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}
.power-bi-card__mensagem {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-4);
}
.power-bi-meta {
  display: grid;
  gap: var(--spacing-3);
  margin: 0;
}
.power-bi-meta dt {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
.power-bi-meta dd {
  margin: var(--spacing-1) 0 0;
}
.power-bi-meta a {
  color: var(--color-primary-600);
}
</style>
