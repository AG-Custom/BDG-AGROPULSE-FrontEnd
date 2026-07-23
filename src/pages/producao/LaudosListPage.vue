<template>
  <q-page class="agro-page">
    <app-page-header titulo="Laudos de qualidade" subtitulo="Análises laboratoriais por lote.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo laudo"
        descricao="Criar laudo"
        :to="{ name: 'laudo-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && laudos.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && laudos.length === 0"
          titulo="Nenhum laudo"
          descricao="Registre o primeiro laudo laboratorial."
          icon="biotech"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="laudos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
          </template>
          <template #body-cell-dataAnalise="props">
            <q-td :props="props">{{ formatarData(props.row.dataAnalise) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" variant="default" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Abrir laudo"
                :to="{ name: 'laudo-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLaudos } from 'composables/useLaudos';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { LaudoQualidadeDto } from 'types/dtos/producao.dto';
import { formatarData } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { laudos, carregando, carregar } = useLaudos();
const { produtos, carregar: carregarProdutos } = useProdutos();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<LaudoQualidadeDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'loteId', label: 'Lote', field: 'loteId', align: 'left' },
  { name: 'dataAnalise', label: 'Data', field: 'dataAnalise', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloProduto(id: string): string {
  return mapa.value.get(id) ?? id;
}

onMounted(() => {
  void carregarProdutos();
  void carregar();
});
</script>
