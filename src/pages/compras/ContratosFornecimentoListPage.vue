<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Contratos de fornecimento"
      subtitulo="Vigência, itens e alertas de vencimento."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo contrato"
        descricao="Criar contrato de fornecimento"
        :to="{ name: 'contrato-fornecimento-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <alertas-contratos-fornecimento-panel
        class="q-mb-md"
        :alertas="alertas"
        :loading="carregandoAlertas"
        @atualizar="atualizarAlertas"
      />

      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Status"
            :options="statusOpcoes"
            style="min-width: 180px"
          />
          <agro-btn
            flat
            icon="filter_alt"
            label="Filtrar"
            descricao="Aplicar filtros"
            @click="aplicarFiltros"
          />
        </div>

        <agro-table-skeleton v-if="carregando && contratos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && contratos.length === 0"
          titulo="Nenhum contrato"
          descricao="Cadastre o primeiro contrato de fornecimento."
          icon="description"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo contrato"
            descricao="Criar contrato"
            :to="{ name: 'contrato-fornecimento-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="contratos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-fornecedorId="props">
            <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
          </template>
          <template #body-cell-vigenciaInicio="props">
            <q-td :props="props">{{ formatarData(props.row.vigenciaInicio) }}</q-td>
          </template>
          <template #body-cell-vigenciaFim="props">
            <q-td :props="props">{{ formatarData(props.row.vigenciaFim) }}</q-td>
          </template>
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.valorTotal != null ? formatarMoeda(props.row.valorTotal) : '—' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-visualizar="false"
                :mostrar-status="false"
                :editar-to="{ name: 'contrato-fornecimento-editar', params: { id: props.row.id } }"
              >
                <q-item
                  v-if="props.row.status !== 'Cancelado'"
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                  @click="cancelar(props.row.id)"
                >
                  <q-item-section avatar>
                    <span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger">
                      <q-icon name="cancel" size="16px" />
                    </span>
                  </q-item-section>
                  <q-item-section>Cancelar contrato</q-item-section>
                  <q-item-section v-if="salvando" side>
                    <q-spinner size="16px" color="primary" />
                  </q-item-section>
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
import AlertasContratosFornecimentoPanel from 'components/compras/AlertasContratosFornecimentoPanel.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useContratosFornecimento } from 'composables/useContratosFornecimento';
import { useFornecedores } from 'composables/useFornecedores';
import type { QTableColumn } from 'quasar';
import type {
  ContratoFornecimentoDto,
  ContratoFornecimentoStatusValor,
} from 'types/dtos/compras.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { contratos, alertas, carregando, salvando, carregar, cancelar, carregarAlertas } =
  useContratosFornecimento();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();

const filtroStatus = ref<ContratoFornecimentoStatusValor | null>(null);
const carregandoAlertas = ref(false);

const statusOpcoes = [
  { label: 'Vigente', value: 'Vigente' },
  { label: 'Vencido', value: 'Vencido' },
  { label: 'Cancelado', value: 'Cancelado' },
];

const mapaFornecedores = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});

const colunas: QTableColumn<ContratoFornecimentoDto>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left', sortable: true },
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'vigenciaInicio', label: 'Início', field: 'vigenciaInicio', align: 'left' },
  { name: 'vigenciaFim', label: 'Fim', field: 'vigenciaFim', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFornecedor(id: string): string {
  return mapaFornecedores.value.get(id) ?? id;
}

async function aplicarFiltros(): Promise<void> {
  await carregar(filtroStatus.value ? { status: filtroStatus.value } : undefined);
}

async function atualizarAlertas(): Promise<void> {
  carregandoAlertas.value = true;
  try {
    await carregarAlertas(30);
  } finally {
    carregandoAlertas.value = false;
  }
}

onMounted(async () => {
  void carregarFornecedores();
  await Promise.all([carregar(), atualizarAlertas()]);
});
</script>
