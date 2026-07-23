<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Amostras de campo"
      subtitulo="Demonstrações e amostras entregues ao produtor."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova amostra"
        descricao="Cadastrar amostra"
        :to="{ name: 'crm-amostra-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            clearable
            class="filtro-busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            :options="StatusAmostraCampoOpcoes"
            class="filtro"
          />
        </div>

        <agro-table-skeleton v-if="carregando && amostras.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && filtradas.length === 0"
          titulo="Nenhuma amostra"
          descricao="Cadastre a primeira amostra ou ajuste os filtros."
          icon="science"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova amostra"
            descricao="Cadastrar"
            :to="{ name: 'crm-amostra-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="filtradas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-quantidade="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.quantidade }}
              {{ props.row.unidade ? props.row.unidade : '' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">{{ rotuloStatus(props.row.status) }}</q-td>
          </template>
          <template #body-cell-dataEntrega="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataEntrega) || '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-visualizar="false"
                :mostrar-status="false"
                :mostrar-excluir="true"
                excluir-label="Remover"
                :editar-to="{ name: 'crm-amostra-editar', params: { id: props.row.id } }"
                :loading-excluir="salvando"
                @excluir="removerAmostra(props.row.id)"
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
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCrm } from 'composables/useCrm';
import { StatusAmostraCampoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { AmostraCampoDto } from 'types/dtos/crm.dto';
import { formatarData } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { amostras, carregando, salvando, carregarAmostras, removerAmostra } = useCrm();
const busca = ref('');
const filtroStatus = ref<string | null>(null);

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusAmostraCampoOpcoes) m.set(o.value, o.label);
  return m;
});

const filtradas = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  return amostras.value.filter((a) => {
    if (filtroStatus.value && a.status !== filtroStatus.value) return false;
    if (!termo) return true;
    return [a.produtoNome, a.cultura, a.clienteId, a.resultado]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(termo));
  });
});

const colunas: QTableColumn<AmostraCampoDto>[] = [
  { name: 'produtoNome', label: 'Produto', field: 'produtoNome', align: 'left', sortable: true },
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'cultura', label: 'Cultura', field: 'cultura', align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'dataEntrega', label: 'Entrega', field: 'dataEntrega', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

onMounted(() => {
  void carregarAmostras();
});
</script>

<style scoped>
.filtro-busca {
  min-width: 220px;
  flex: 1;
}
.filtro {
  min-width: 180px;
}
.acoes {
  white-space: nowrap;
}
</style>
