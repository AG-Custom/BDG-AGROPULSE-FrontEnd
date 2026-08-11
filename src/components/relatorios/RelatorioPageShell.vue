<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo">
      <agro-btn
        flat
        icon="arrow_back"
        label="Catálogo"
        descricao="Voltar ao catálogo de relatórios"
        :to="{ name: 'relatorios' }"
      />
      <slot name="actions" />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <slot />
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';

defineProps<{
  titulo: string;
  subtitulo: string;
}>();
</script>
