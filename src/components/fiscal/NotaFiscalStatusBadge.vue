<template>
  <agro-badge :label="rotulo" :variant="variant" />
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import {
  StatusNotaFiscal,
  StatusNotaFiscalOpcoes,
  type StatusNotaFiscalValor,
} from 'constants/enums';
import { computed } from 'vue';

const props = defineProps<{
  valor: string;
}>();

const rotulo = computed(
  () => StatusNotaFiscalOpcoes.find((item) => item.value === props.valor)?.label ?? props.valor,
);

const variant = computed(() => {
  switch (props.valor as StatusNotaFiscalValor) {
    case StatusNotaFiscal.Emitida:
      return 'success' as const;
    case StatusNotaFiscal.Processando:
      return 'info' as const;
    case StatusNotaFiscal.Contingencia:
    case StatusNotaFiscal.ResultadoDesconhecido:
      return 'warning' as const;
    case StatusNotaFiscal.Rejeitada:
    case StatusNotaFiscal.Erro:
      return 'error' as const;
    case StatusNotaFiscal.Cancelada:
    case StatusNotaFiscal.Inutilizada:
      return 'accent' as const;
    default:
      return 'default' as const;
  }
});
</script>
