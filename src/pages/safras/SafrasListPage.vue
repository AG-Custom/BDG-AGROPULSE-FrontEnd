<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Planejamento de safras"
      subtitulo="Cultura, área e época planejada."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova safra"
        descricao="Cadastrar planejamento"
        :to="{ name: 'safra-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && safras.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && safras.length === 0"
          titulo="Nenhuma safra"
          descricao="Cadastre o primeiro planejamento de safra."
          icon="calendar_month"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova safra"
            descricao="Cadastrar"
            :to="{ name: 'safra-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="safras"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-areaPlanejadaHa="props">
            <q-td :props="props" class="text-metric">
              {{
                props.row.areaPlanejadaHa != null
                  ? formatarDecimal(props.row.areaPlanejadaHa)
                  : '—'
              }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-status="false"
                :editar-to="{ name: 'safra-editar', params: { id: props.row.id } }"
                :visualizar-to="{ name: 'safra-visualizar', params: { id: props.row.id } }"
>
                <q-item
                  v-if="podeEncerrar(props.row.status)"
                  v-close-popup
                  clickable
                  class="agro-acoes-menu__item"
                  @click="encerrar(props.row.id)"
                >
                  <q-item-section avatar><q-icon name="flag" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Encerrar</q-item-section>
                </q-item>
                <q-item
                  v-if="podeCancelar(props.row.status)"
                  v-close-popup
                  clickable
                  class="agro-acoes-menu__item"
                  @click="cancelar(props.row.id)"
                >
                  <q-item-section avatar><q-icon name="cancel" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Cancelar</q-item-section>
                </q-item>
              </agro-acoes-menu>
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
import { useSafras } from 'composables/useSafras';
import { StatusSafra, StatusSafraOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { SafraDto } from 'types/dtos/safras.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';


const { safras, carregando, salvando, carregar, encerrar, cancelar } = useSafras();

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusSafraOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<SafraDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cultura', label: 'Cultura', field: 'cultura', align: 'left' },
  { name: 'areaPlanejadaHa', label: 'Área (ha)', field: 'areaPlanejadaHa', align: 'right' },
  { name: 'dataInicio', label: 'Início', field: 'dataInicio', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

function variantStatus(status: string): 'success' | 'warning' | 'default' | 'info' {
  if (status === StatusSafra.Encerrada) return 'success';
  if (status === StatusSafra.EmAndamento) return 'info';
  if (status === StatusSafra.Planejada) return 'warning';
  return 'default';
}

function podeEncerrar(status: string): boolean {
  return status === StatusSafra.Planejada || status === StatusSafra.EmAndamento;
}

function podeCancelar(status: string): boolean {
  return status === StatusSafra.Planejada || status === StatusSafra.EmAndamento;
}

onMounted(() => {
  void carregar();
});

</script>

<style scoped>
.acoes {
  white-space: nowrap;
}
</style>
