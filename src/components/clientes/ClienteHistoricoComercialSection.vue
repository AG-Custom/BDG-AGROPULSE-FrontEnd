<template>
  <agro-card v-if="!embutido" class="cliente-historico">
    <template #header>
      <h3 class="cliente-historico__titulo">Histórico comercial</h3>
    </template>
    <historico-comercial-conteudo
      :itens="itens"
      :carregando="carregando"
      :indisponivel="indisponivel"
      :colunas="colunas"
    />
  </agro-card>

  <historico-comercial-conteudo
    v-else
    :itens="itens"
    :carregando="carregando"
    :indisponivel="indisponivel"
    :colunas="colunas"
  />
</template>

<script setup lang="ts">
import HistoricoComercialConteudo from 'components/clientes/HistoricoComercialConteudo.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { useHistoricoComercial } from 'composables/useHistoricoComercial';
import type { QTableColumn } from 'quasar';
import type { HistoricoComercialItemDto } from 'types/dtos/comercial-extras.dto';
import { onMounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    clienteId: string;
    embutido?: boolean;
  }>(),
  {
    embutido: false,
  },
);

const { itens, carregando, indisponivel, carregar } = useHistoricoComercial();

const colunas: QTableColumn<HistoricoComercialItemDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'id', label: 'Referência', field: 'id', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];

watch(
  () => props.clienteId,
  (id) => {
    if (id) void carregar(id);
  },
);

onMounted(() => {
  if (props.clienteId) void carregar(props.clienteId);
});
</script>

<style scoped>
.cliente-historico__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
