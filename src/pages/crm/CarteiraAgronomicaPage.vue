<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Carteira agronômica"
      subtitulo="Produtores com área, culturas e fazendas vinculadas."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="filtroClienteId"
            outlined
            dense
            label="Cliente ID"
            clearable
            class="filtro"
          />
          <q-input
            v-model="filtroVendedorId"
            outlined
            dense
            label="Vendedor ID"
            clearable
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicarFiltros"
          />
        </div>

        <agro-form-skeleton v-if="carregando && !carteira" :campos="4" />
        <template v-else-if="carteira">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Área total (ha)</div>
              <div class="text-metric">{{ formatarDecimal(carteira.areaTotalHa) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Produtores</div>
              <div class="text-metric">{{ carteira.itens?.length ?? 0 }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption">Culturas</div>
              <div>
                {{ carteira.culturas?.length ? carteira.culturas.join(', ') : '—' }}
              </div>
            </div>
          </div>

          <empty-state
            v-if="!carteira.itens?.length"
            titulo="Nenhum produtor"
            descricao="Ajuste os filtros ou aguarde a sincronização da carteira."
            icon="agriculture"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="clienteId"
            :rows="carteira.itens"
            :columns="colunas"
            :loading="carregando"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-areaTotalHa="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.areaTotalHa) }}
              </q-td>
            </template>
            <template #body-cell-culturas="props">
              <q-td :props="props">
                {{ props.row.culturas?.length ? props.row.culturas.join(', ') : '—' }}
              </q-td>
            </template>
            <template #body-cell-acoes="props">
              <q-td :props="props">
                <agro-btn
                  flat
                  round
                  dense
                  icon="person"
                  color="primary"
                  descricao="Ver cliente"
                  :to="{ name: 'cliente-editar', params: { id: props.row.clienteId } }"
                />
              </q-td>
            </template>
          </q-table>
        </template>
        <empty-state
          v-else
          titulo="Sem carteira"
          descricao="Informe filtros ou aguarde o carregamento."
          icon="agriculture"
        />
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCrm } from 'composables/useCrm';
import type { QTableColumn } from 'quasar';
import type { CarteiraClienteItemDto } from 'types/dtos/crm.dto';
import { formatarDecimal } from 'utils/formatters';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { carteira, carregando, carregarCarteira } = useCrm();
const filtroClienteId = ref('');
const filtroVendedorId = ref('');

const colunas: QTableColumn<CarteiraClienteItemDto>[] = [
  { name: 'clienteNome', label: 'Produtor', field: 'clienteNome', align: 'left', sortable: true },
  { name: 'areaTotalHa', label: 'Área (ha)', field: 'areaTotalHa', align: 'right' },
  { name: 'culturas', label: 'Culturas', field: 'culturas', align: 'left' },
  { name: 'qtdFazendas', label: 'Fazendas', field: 'qtdFazendas', align: 'right' },
  { name: 'safraAtual', label: 'Safra atual', field: 'safraAtual', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'clienteId', align: 'right' },
];

function aplicarFiltros(): void {
  void carregarCarteira({
    clienteId: filtroClienteId.value.trim() || undefined,
    vendedorId: filtroVendedorId.value.trim() || undefined,
  });
}

onMounted(() => {
  const qCliente = route.query.clienteId;
  if (typeof qCliente === 'string' && qCliente) {
    filtroClienteId.value = qCliente;
  }
  aplicarFiltros();
});
</script>

<style scoped>
.filtro {
  min-width: 160px;
}
</style>
