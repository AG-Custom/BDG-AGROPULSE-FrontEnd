<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Transferências"
      subtitulo="Transfira estoque entre unidades operacionais."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova transferência"
        descricao="Criar transferência de estoque"
        :to="{ name: 'estoque-transferencia-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && transferencias.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && transferencias.length === 0"
          titulo="Nenhuma transferência"
          descricao="Crie uma transferência para mover estoque entre unidades."
          icon="swap_horiz"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova transferência"
            descricao="Criar transferência de estoque"
            :to="{ name: 'estoque-transferencia-nova' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="transferencias"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="varianteStatus(props.row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-unidadeOrigemId="props">
            <q-td :props="props">
              {{ rotuloUnidade(props.row.unidadeOrigemId) }}
            </q-td>
          </template>

          <template #body-cell-unidadeDestinoId="props">
            <q-td :props="props">
              {{ rotuloUnidade(props.row.unidadeDestinoId) }}
            </q-td>
          </template>

          <template #body-cell-itens="props">
            <q-td :props="props">
              <span class="text-metric">{{ props.row.itens.length }}</span>
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               :visualizar-to="{ name: 'estoque-transferencia-detalhe', params: { id: props.row.id } }"
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
import { useEstoqueTransferencias } from 'composables/useEstoqueTransferencias';
import { useUnidades } from 'composables/useUnidades';
import {
  TransferenciaEstoqueStatus,
  TransferenciaEstoqueStatusOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { TransferenciaEstoqueDto } from 'types/dtos/estoque.dto';
import { onMounted, computed, ref } from 'vue';



const { transferencias, carregando, carregar } = useEstoqueTransferencias();
const { unidades, carregar: carregarUnidades } = useUnidades();

const colunas: QTableColumn<TransferenciaEstoqueDto>[] = [
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  {
    name: 'unidadeOrigemId',
    label: 'Origem',
    field: 'unidadeOrigemId',
    align: 'left',
  },
  {
    name: 'unidadeDestinoId',
    label: 'Destino',
    field: 'unidadeDestinoId',
    align: 'left',
  },
  { name: 'itens', label: 'Itens', field: 'id', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloUnidade(unidadeId: string): string {
  return unidades.value.find((item) => item.id === unidadeId)?.nome ?? unidadeId;
}

function rotuloStatus(status: string): string {
  return TransferenciaEstoqueStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

function varianteStatus(status: string): 'accent' | 'success' | 'default' {
  if (status === TransferenciaEstoqueStatus.Pendente) {
    return 'accent';
  }

  if (status === TransferenciaEstoqueStatus.Concluida) {
    return 'success';
  }

  return 'default';
}

onMounted(() => {
  void carregar();
  void carregarUnidades({ ativo: true });
});

</script>
