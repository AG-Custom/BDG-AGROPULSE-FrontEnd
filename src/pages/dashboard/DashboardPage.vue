<template>
  <q-page class="agro-page">
    <app-page-header titulo="Painel" subtitulo="Visão geral da sua operação." />

    <section class="agro-section dashboard-section">
      <agro-card>
        <empty-state
          titulo="Painel em construção"
          descricao="Em breve você verá aqui indicadores e atividades da sua operação."
          icon="dashboard"
        />
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
</script>

<style scoped>
.dashboard-section {
  width: 100%;
}
</style>
