<template>
  <agro-badge :label="rotulo" :variant="variant" />
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import {
  StatusCargaLogistica,
  StatusDocTransporteLogistica,
  StatusRomaneioLogistica,
  StatusVeiculoLogistica,
} from 'constants/enums';
import { computed } from 'vue';

const props = defineProps<{
  valor: string;
}>();

const rotulo = computed(() => {
  switch (props.valor) {
    case StatusVeiculoLogistica.Disponivel:
      return 'Disponível';
    case StatusVeiculoLogistica.EmRota:
    case StatusCargaLogistica.EmRota:
    case StatusRomaneioLogistica.EmRota:
      return 'Em rota';
    case StatusVeiculoLogistica.Manutencao:
      return 'Em manutenção';
    case StatusVeiculoLogistica.Inativo:
      return 'Inativo';
    case StatusCargaLogistica.Programado:
      return 'Programado';
    case StatusCargaLogistica.Concluido:
      return 'Concluído';
    case StatusCargaLogistica.Cancelado:
      return 'Cancelado';
    case StatusRomaneioLogistica.Pendente:
      return 'Pendente';
    case StatusRomaneioLogistica.Entregue:
      return 'Entregue';
    case StatusRomaneioLogistica.Ocorrencia:
      return 'Ocorrência';
    case StatusRomaneioLogistica.Devolvido:
      return 'Devolvido';
    case StatusDocTransporteLogistica.Rascunho:
      return 'Rascunho';
    case StatusDocTransporteLogistica.Autorizado:
      return 'Autorizado';
    case StatusDocTransporteLogistica.Cancelado:
      return 'Cancelado';
    default:
      return props.valor;
  }
});

const variant = computed(() => {
  const v = props.valor;
  if (
    v === StatusVeiculoLogistica.Disponivel ||
    v === StatusCargaLogistica.Concluido ||
    v === StatusRomaneioLogistica.Entregue ||
    v === StatusDocTransporteLogistica.Autorizado
  ) {
    return 'success' as const;
  }
  if (
    v === StatusVeiculoLogistica.EmRota ||
    v === StatusCargaLogistica.EmRota ||
    v === StatusRomaneioLogistica.EmRota ||
    v === StatusCargaLogistica.Programado ||
    v === StatusRomaneioLogistica.Pendente ||
    v === StatusDocTransporteLogistica.Rascunho
  ) {
    return 'warning' as const;
  }
  if (
    v === StatusVeiculoLogistica.Inativo ||
    v === StatusVeiculoLogistica.Manutencao ||
    v === StatusCargaLogistica.Cancelado ||
    v === StatusRomaneioLogistica.Ocorrencia ||
    v === StatusRomaneioLogistica.Devolvido ||
    v === StatusDocTransporteLogistica.Cancelado
  ) {
    return 'error' as const;
  }
  return 'default' as const;
});
</script>
