<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="SPED Fiscal"
      subtitulo="A geração de arquivos SPED e o envio ao escritório não fazem parte desta versão."
    />
    <section class="agro-section">
      <empty-state
        titulo="SPED indisponível"
        descricao="Os arquivos fiscais oficiais continuam na nota autorizada. A escrituração fica com o contador."
        icon="description"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import EmptyState from 'components/ui/EmptyState.vue';
</script>
