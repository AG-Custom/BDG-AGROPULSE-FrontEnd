<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Inventários"
      subtitulo="Inicie e acompanhe inventários de estoque da unidade atual."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="playlist_add_check"
        label="Iniciar inventário"
        descricao="Iniciar novo inventário de estoque"
        :loading="salvando"
        @click="iniciarNovo"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && inventarios.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && inventarios.length === 0"
          titulo="Nenhum inventário encontrado"
          descricao="Inicie um inventário para contar e ajustar o estoque da unidade."
          icon="fact_check"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Iniciar inventário"
            descricao="Iniciar novo inventário de estoque"
            :loading="salvando"
            @click="iniciarNovo"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="estoque-inventarios__tabela"
          :rows="inventarios"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="props.row.status === InventarioStatus.Aberto ? 'accent' : 'success'"
              />
            </q-td>
          </template>

          <template #body-cell-iniciadoEm="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.iniciadoEm) }}
            </q-td>
          </template>

          <template #body-cell-concluidoEm="props">
            <q-td :props="props">
              {{ props.row.concluidoEm ? formatarDataHora(props.row.concluidoEm) : '—' }}
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="estoque-inventarios__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Abrir inventário"
                :to="{ name: 'estoque-inventario-detalhe', params: { id: props.row.id } }"
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
import { useEstoqueInventarios } from 'composables/useEstoqueInventarios';
import { InventarioStatus, InventarioStatusOpcoes, type InventarioStatusValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { InventarioDto } from 'types/dtos/estoque.dto';
import { formatarDataHora } from 'utils/formatters';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { inventarios, carregando, salvando, carregar, iniciar } = useEstoqueInventarios();

const colunas: QTableColumn<InventarioDto>[] = [
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'iniciadoEm', label: 'Iniciado em', field: 'iniciadoEm', align: 'left', sortable: true },
  {
    name: 'concluidoEm',
    label: 'Concluído em',
    field: 'concluidoEm',
    align: 'left',
    sortable: true,
  },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: InventarioStatusValor): string {
  return InventarioStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

async function iniciarNovo(): Promise<void> {
  const criado = await iniciar();

  if (criado) {
    await router.push({ name: 'estoque-inventario-detalhe', params: { id: criado.id } });
  }
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.estoque-inventarios__acoes {
  white-space: nowrap;
}
</style>
