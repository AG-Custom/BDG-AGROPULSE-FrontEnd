<template>
  <q-icon v-bind="attrs" :class="classeIcone">
    <q-tooltip v-if="descricao">{{ descricao }}</q-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  descricao: string;
  clicavel?: boolean;
}>();

const attrs = useAttrs();

const classeIcone = computed(() => ({
  'agro-icon-btn': true,
  'cursor-pointer': props.clicavel !== false,
}));
</script>

<style scoped>
.agro-icon-btn {
  outline: none;
}
</style>
