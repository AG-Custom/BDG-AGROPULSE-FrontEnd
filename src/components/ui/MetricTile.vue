<template>
  <q-card flat bordered class="metric-tile">
    <q-card-section>
      <div class="text-caption text-grey-7">{{ label }}</div>
      <div class="text-h5 text-weight-semibold">{{ value }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>

<style scoped>
.metric-tile {
  border-radius: 8px;
}
</style>
