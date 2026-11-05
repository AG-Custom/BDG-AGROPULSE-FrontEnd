<template>
  <q-table
    flat
    bordered
    row-key="id"
    :rows="arquivos"
    :columns="colunas"
    :loading="carregando"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10, 20, 50]"
    no-data-label="Nenhum arquivo gerado"
  >
    <template #body-cell-tipo="props">
      <q-td :props="props">{{ rotulo(TipoArquivoFiscalOpcoes, props.row.tipo) }}</q-td>
    </template>
    <template #body-cell-finalidade="props">
      <q-td :props="props">{{ rotulo(FinalidadeArquivoFiscalOpcoes, props.row.finalidade) }}</q-td>
    </template>
    <template #body-cell-geradoEm="props">
      <q-td :props="props">{{ formatarDataHora(props.row.geradoEm) }}</q-td>
    </template>
    <template #body-cell-acoes="props">
      <q-td :props="props" auto-width>
        <agro-btn
          flat
          round
          dense
          icon="download"
          :aria-label="`Baixar ${props.row.nomeArquivo}`"
          descricao="Baixar arquivo"
          @click="emit('baixar', props.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <empty-state
        titulo="Nenhum arquivo gerado"
        descricao="Gere um arquivo para a competência desejada e ele ficará registrado aqui."
        icon="description"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import EmptyState from 'components/ui/EmptyState.vue';
import { FinalidadeArquivoFiscalOpcoes, TipoArquivoFiscalOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ArquivoFiscalDto } from 'types/dtos/obrigacao-fiscal.dto';
import { formatarDataHora } from 'utils/formatters';

defineProps<{
  arquivos: ArquivoFiscalDto[];
  carregando: boolean;
}>();

const emit = defineEmits<{ baixar: [arquivo: ArquivoFiscalDto] }>();

const colunas: QTableColumn[] = [
  { name: 'tipo', label: 'Obrigação', field: 'tipo', align: 'left' },
  { name: 'competencia', label: 'Competência', field: 'competencia', align: 'left', sortable: true },
  { name: 'finalidade', label: 'Finalidade', field: 'finalidade', align: 'left' },
  { name: 'nomeArquivo', label: 'Arquivo', field: 'nomeArquivo', align: 'left' },
  { name: 'totalRegistros', label: 'Registros', field: 'totalRegistros', align: 'right' },
  { name: 'geradoEm', label: 'Gerado em', field: 'geradoEm', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'id', align: 'right' },
];

function rotulo(opcoes: { label: string; value: string }[], valor: string): string {
  return opcoes.find((o) => o.value === valor)?.label ?? valor;
}
</script>
