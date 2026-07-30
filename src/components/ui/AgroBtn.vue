<template>
  <q-btn
    v-bind="attrsSemLabel"
    no-caps
    :label="textoLabel"
    :type="tipoBotao"
    :aria-label="ariaLabel"
  >
    <slot />
    <q-tooltip v-if="textoDescricao">{{ textoDescricao }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    descricao?: string;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    type: 'button',
  },
);

const attrs = useAttrs();

const textoLabel = computed(() => {
  const label = attrs.label;
  return typeof label === 'string' ? label : undefined;
});

const attrsSemLabel = computed(() => {
  const { label: _label, type: _type, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const tipoBotao = computed(() => props.type);

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
