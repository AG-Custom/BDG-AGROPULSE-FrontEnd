<template>
  <q-input
    :model-value="model"
    outlined
    prefix="R$"
    inputmode="numeric"
    input-class="text-metric"
    :maxlength="TAMANHO_FORMATADO.MOEDA"
    v-bind="attrs"
    @update:model-value="onUpdate"
  >
    <slot />
  </q-input>
</template>

<script setup lang="ts">
import { TAMANHO_FORMATADO } from 'constants/masks';
import { aplicarMascaraMoeda } from 'utils/formatters';
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ required: true });

const attrs = useAttrs();

function onUpdate(valor: string | number | null): void {
  model.value = aplicarMascaraMoeda(valor == null ? '' : String(valor));
}
</script>
