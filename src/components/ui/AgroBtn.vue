<template>
  <q-btn v-bind="attrs" :aria-label="ariaLabel">
    <slot />
    <q-tooltip v-if="textoDescricao">{{ textoDescricao }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  descricao?: string;
}>();

const attrs = useAttrs();

const textoDescricao = computed(() => {
  if (props.descricao) {
    return props.descricao;
  }

  const label = attrs.label;
  return typeof label === 'string' && label.length > 0 ? label : undefined;
});

const ariaLabel = computed(() => {
  const explicito = attrs['aria-label'];

  if (typeof explicito === 'string' && explicito.length > 0) {
    return explicito;
  }

  return textoDescricao.value;
});
</script>
