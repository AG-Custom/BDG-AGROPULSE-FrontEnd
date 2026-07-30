<template>
  <q-page class="agro-page">
    <app-page-header titulo="Cargas" subtitulo="Programação e acompanhamento de cargas.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova carga"
        descricao="Programar carga"
        :to="{ name: 'logistica-carga-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            :options="StatusCargaLogisticaOpcoes"
            class="filtro"
          />
          <q-input v-model="filtroDe" outlined dense label="De" type="date" class="filtro-data" />
          <q-input v-model="filtroAte" outlined dense label="Até" type="date" class="filtro-data" />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && cargas.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && cargas.length === 0"
          titulo="Nenhuma carga"
          descricao="Programe a primeira carga ou ajuste os filtros."
          icon="inventory_2"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova carga"
            descricao="Programar"
            :to="{ name: 'logistica-carga-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="cargas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataHoraSaida="props">
            <q-td :props="props">{{ formatarDataHora(props.row.dataHoraSaida) }}</q-td>
          </template>
          <template #body-cell-pesoKg="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.pesoKg != null ? formatarDecimal(props.row.pesoKg) : '—' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <logistica-status-badge :valor="props.row.status" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               :visualizar-to="{ name: 'logistica-carga-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import LogisticaStatusBadge from 'components/logistica/LogisticaStatusBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLogistica } from 'composables/useLogistica';
import { StatusCargaLogisticaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CargaLogisticaDto } from 'types/dtos/logistica.dto';
import { formatarDataHora, formatarDecimal } from 'utils/formatters';
import { onMounted, ref, computed } from 'vue';



const { cargas, carregando, carregarCargas } = useLogistica();
const filtroStatus = ref<string | null>(null);
const filtroDe = ref('');
const filtroAte = ref('');

const colunas: QTableColumn<CargaLogisticaDto>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left', sortable: true },
  { name: 'regiao', label: 'Região', field: 'regiao', align: 'left' },
  { name: 'motoristaNome', label: 'Motorista', field: 'motoristaNome', align: 'left' },
  { name: 'dataHoraSaida', label: 'Saída', field: 'dataHoraSaida', align: 'left' },
  { name: 'qtdParadas', label: 'Paradas', field: 'qtdParadas', align: 'right' },
  { name: 'pesoKg', label: 'Peso (kg)', field: 'pesoKg', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function aplicar(): void {
  void carregarCargas({
    status: (filtroStatus.value as '' | undefined) || undefined,
    de: filtroDe.value || undefined,
    ate: filtroAte.value || undefined,
  });
}

onMounted(aplicar);

</script>

<style scoped>
.filtro {
  min-width: 180px;
}
.filtro-data {
  min-width: 140px;
}
</style>
