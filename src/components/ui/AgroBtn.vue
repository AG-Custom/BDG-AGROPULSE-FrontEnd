<template>
  <q-btn v-bind="attrsSemLabel" :label="textoLabel" :aria-label="ariaLabel">
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

const textoLabel = computed(() => {
  const label = attrs.label;
  return typeof label === 'string' ? label : undefined;
});

const attrsSemLabel = computed(() => {
  const { label: _label, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const textoDescricao = computed(() => {
  if (props.descricao) {
    return props.descricao;
  }

  return textoLabel.value && textoLabel.value.length > 0 ? textoLabel.value : undefined;
});

const ariaLabel = computed(() => {
  const explicito = attrs['aria-label'];

  if (typeof explicito === 'string' && explicito.length > 0) {
    return explicito;
  }

  return textoDescricao.value;
});
</script>
