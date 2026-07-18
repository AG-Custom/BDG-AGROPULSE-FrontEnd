<template>
  <agro-badge :label="rotulo" :variant="variant" />
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import {
  PrioridadeOrdemServicoManutencao,
  StatusAtivoManutencao,
  StatusChecklistInspecao,
  StatusOrdemServicoManutencao,
  StatusPlanoManutencao,
} from 'constants/enums';
import { computed } from 'vue';

const props = defineProps<{
  valor: string;
  tipo?: 'ativo' | 'os' | 'prioridade' | 'plano' | 'checklist';
}>();

const rotulos: Record<string, string> = {
  [StatusAtivoManutencao.Operacional]: 'Operacional',
  [StatusAtivoManutencao.Manutencao]: 'Em manutenção',
  [StatusAtivoManutencao.Parado]: 'Parado',
  [StatusAtivoManutencao.Sucateado]: 'Sucateado',
  [StatusOrdemServicoManutencao.Aberta]: 'Aberta',
  [StatusOrdemServicoManutencao.EmAndamento]: 'Em andamento',
  [StatusOrdemServicoManutencao.AguardandoPeca]: 'Aguardando peça',
  [StatusOrdemServicoManutencao.Concluida]: 'Concluída',
  [StatusOrdemServicoManutencao.Cancelada]: 'Cancelada',
  [PrioridadeOrdemServicoManutencao.Baixa]: 'Baixa',
  [PrioridadeOrdemServicoManutencao.Media]: 'Média',
  [PrioridadeOrdemServicoManutencao.Alta]: 'Alta',
  [PrioridadeOrdemServicoManutencao.Critica]: 'Crítica',
  [StatusPlanoManutencao.Ok]: 'Ok',
  [StatusPlanoManutencao.Proximo]: 'Próximo',
  [StatusPlanoManutencao.Vencido]: 'Vencido',
  [StatusChecklistInspecao.Aprovado]: 'Aprovado',
  [StatusChecklistInspecao.Reprovado]: 'Reprovado',
  [StatusChecklistInspecao.AprovadoRessalvas]: 'Aprovado c/ ressalvas',
};

const rotulo = computed(() => rotulos[props.valor] ?? props.valor);

const variant = computed(() => {
  const v = props.valor;
  if (
    v === StatusAtivoManutencao.Operacional ||
    v === StatusOrdemServicoManutencao.Concluida ||
    v === StatusPlanoManutencao.Ok ||
    v === StatusChecklistInspecao.Aprovado
  ) {
    return 'success' as const;
  }
  if (
    v === StatusAtivoManutencao.Manutencao ||
    v === StatusOrdemServicoManutencao.EmAndamento ||
    v === StatusOrdemServicoManutencao.AguardandoPeca ||
    v === StatusPlanoManutencao.Proximo ||
    v === StatusChecklistInspecao.AprovadoRessalvas ||
    v === PrioridadeOrdemServicoManutencao.Media ||
    v === PrioridadeOrdemServicoManutencao.Alta
  ) {
    return 'warning' as const;
  }
  if (
    v === StatusAtivoManutencao.Parado ||
    v === StatusAtivoManutencao.Sucateado ||
    v === StatusOrdemServicoManutencao.Cancelada ||
    v === StatusPlanoManutencao.Vencido ||
    v === StatusChecklistInspecao.Reprovado ||
    v === PrioridadeOrdemServicoManutencao.Critica
  ) {
    return 'error' as const;
  }
  if (v === StatusOrdemServicoManutencao.Aberta || v === PrioridadeOrdemServicoManutencao.Baixa) {
    return 'info' as const;
  }
  return 'default' as const;
});
</script>
