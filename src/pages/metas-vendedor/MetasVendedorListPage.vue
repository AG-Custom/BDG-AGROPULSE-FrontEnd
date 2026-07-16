<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Metas de vendedores"
      subtitulo="Acompanhe metas mensais e percentual atingido."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input v-model="ano" outlined dense type="number" label="Ano" class="filtro" />
          <q-input v-model="mes" outlined dense type="number" label="Mês" class="filtro" />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Carregar metas"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && metas.length === 0" :colunas="6" />

        <empty-state
          v-else-if="indisponivel && metas.length === 0"
          titulo="Endpoint indisponível"
          descricao="O backend ainda não expõe /metas-vendedor. A tela está pronta para quando o contrato for publicado."
          icon="flag"
        />

        <empty-state
          v-else-if="!carregando && metas.length === 0"
          titulo="Sem metas"
          descricao="Não há metas cadastradas para o período."
          icon="flag"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="metas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valorMeta="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorMeta) }}
            </q-td>
          </template>
          <template #body-cell-valorRealizado="props">
            <q-td :props="props" class="text-metric">
              {{
                props.row.valorRealizado == null
                  ? '—'
                  : formatarMoeda(props.row.valorRealizado)
              }}
            </q-td>
          </template>
          <template #body-cell-percentualAtingido="props">
            <q-td :props="props" class="text-metric">
              {{
                props.row.percentualAtingido == null
                  ? '—'
                  : `${formatarDecimal(props.row.percentualAtingido)}%`
              }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useMetasVendedor } from 'composables/useMetasVendedor';
import type { QTableColumn } from 'quasar';
import type { MetaVendedorDto } from 'types/dtos/comercial-extras.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const { metas, carregando, indisponivel, carregar } = useMetasVendedor();

const agora = new Date();
const ano = ref(String(agora.getFullYear()));
const mes = ref(String(agora.getMonth() + 1));

const colunas: QTableColumn<MetaVendedorDto>[] = [
  {
    name: 'vendedor',
    label: 'Vendedor',
    field: (row) => row.vendedorNome ?? row.vendedorUsuarioId,
    align: 'left',
  },
  { name: 'ano', label: 'Ano', field: 'ano', align: 'right' },
  { name: 'mes', label: 'Mês', field: 'mes', align: 'right' },
  { name: 'valorMeta', label: 'Meta', field: 'valorMeta', align: 'right' },
  { name: 'valorRealizado', label: 'Realizado', field: 'valorRealizado', align: 'right' },
  {
    name: 'percentualAtingido',
    label: 'Atingido %',
    field: 'percentualAtingido',
    align: 'right',
  },
];

async function recarregar(): Promise<void> {
  await carregar({
    ano: Number(ano.value) || undefined,
    mes: Number(mes.value) || undefined,
  });
}

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.filtro {
  min-width: 120px;
}
</style>
