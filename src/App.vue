<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="layoutKey(route)" />
  </router-view>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router';

function layoutKey(route: RouteLocationNormalizedLoaded): string {
  const layout = route.meta.layout;

  if (typeof layout === 'string') {
    return layout;
  }

  return route.matched[0]?.path ?? route.fullPath;
}
</script>
