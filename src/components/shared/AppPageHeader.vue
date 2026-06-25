<template>
  <div class="app-page-header">
    <div>
      <div class="text-h5 text-weight-semibold">{{ titulo }}</div>
      <div v-if="subtitulo" class="text-body2 text-grey-7">{{ subtitulo }}</div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  titulo: string;
  subtitulo?: string;
}>();
</script>

<style scoped>
.app-page-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
