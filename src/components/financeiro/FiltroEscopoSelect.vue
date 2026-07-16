<template>
  <q-select
    :model-value="modelValue"
    outlined
    dense
    emit-value
    map-options
    label="Escopo"
    :options="EscopoFinanceiroOpcoes"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { EscopoFinanceiroOpcoes, type EscopoFinanceiroValor } from 'constants/enums';

defineProps<{
  modelValue: EscopoFinanceiroValor | null;
}>();

defineEmits<{
  'update:modelValue': [value: EscopoFinanceiroValor | null];
}>();
</script>
