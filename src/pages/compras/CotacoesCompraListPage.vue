<template>
  <q-page class="agro-page">
    <app-page-header titulo="Cotações de compra" subtitulo="Compare respostas de fornecedores.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova cotação"
        descricao="Criar cotação"
        :to="{ name: 'cotacao-compra-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && cotacoes.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && cotacoes.length === 0"
          titulo="Nenhuma cotação"
          descricao="Crie a primeira cotação de compra."
          icon="compare"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova cotação"
            descricao="Criar cotação"
            :to="{ name: 'cotacao-compra-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="cotacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataLimite="props">
            <q-td :props="props">{{ formatarData(props.row.dataLimite) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-respostas="props">
            <q-td :props="props" class="text-metric">{{ props.row.respostas.length }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               :visualizar-to="{ name: 'cotacao-compra-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCompras } from 'composables/useCompras';
import type { QTableColumn } from 'quasar';
import type { CotacaoCompraDto } from 'types/dtos/compras.dto';
import { formatarData } from 'utils/formatters';
import { onMounted, computed, ref } from 'vue';



const { cotacoes, carregando, carregarCotacoes } = useCompras();

const colunas: QTableColumn<CotacaoCompraDto>[] = [
  { name: 'dataLimite', label: 'Limite', field: 'dataLimite', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'respostas', label: 'Respostas', field: 'id', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregarCotacoes();
});

</script>
