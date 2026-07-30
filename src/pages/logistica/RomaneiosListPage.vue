<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Romaneios"
      subtitulo="Entregas operacionais, rastreio e ocorrências."
    />

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
            :options="StatusRomaneioLogisticaOpcoes"
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && romaneios.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && romaneios.length === 0"
          titulo="Nenhum romaneio"
          descricao="Não há romaneios com os filtros atuais."
          icon="assignment"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="romaneios"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataPrevista="props">
            <q-td :props="props">{{ formatarData(props.row.dataPrevista) }}</q-td>
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
               :visualizar-to="{ name: 'logistica-romaneio-detalhe', params: { id: props.row.id } }"
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
import { StatusRomaneioLogisticaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RomaneioLogisticaDto } from 'types/dtos/logistica.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { onMounted, ref, computed } from 'vue';



const { romaneios, carregando, carregarRomaneios } = useLogistica();
const filtroStatus = ref<string | null>(null);

const colunas: QTableColumn<RomaneioLogisticaDto>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left', sortable: true },
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'cidade', label: 'Cidade', field: (r) => `${r.cidade}/${r.uf}`, align: 'left' },
  { name: 'codigoRastreamento', label: 'Rastreio', field: 'codigoRastreamento', align: 'left' },
  { name: 'dataPrevista', label: 'Prevista', field: 'dataPrevista', align: 'left' },
  { name: 'pesoKg', label: 'Peso', field: 'pesoKg', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function aplicar(): void {
  void carregarRomaneios({
    status: (filtroStatus.value as '' | undefined) || undefined,
  });
}

onMounted(aplicar);

</script>

<style scoped>
.filtro {
  min-width: 180px;
}
</style>
