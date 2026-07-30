<template>
  <q-page class="agro-page">
    <app-page-header titulo="Contratos" subtitulo="CPR, Barter e Termo com cotação de mercado.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo contrato"
        descricao="Criar contrato"
        :to="{ name: 'contrato-novo', query: { tipo } }"
      />
    </app-page-header>

    <section class="agro-section">
      <cotacao-mercado-card
        class="q-mb-md"
        :cotacao="cotacao"
        mostrar-aplicar
        @atualizar="carregarCotacaoMercado()"
        @aplicar="aplicarCotacaoNoFormulario"
      />

      <alertas-contratos-panel
        class="q-mb-md"
        :alertas="alertas"
        @atualizar="carregarAlertas()"
      />

      <agro-card>
        <q-tabs
          v-model="tipo"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab v-for="op in TipoContratoOpcoes" :key="op.value" :name="op.value" :label="op.label" />
        </q-tabs>
        <q-separator />

        <div class="agro-filter-bar">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Status"
            :options="ContratoStatusOpcoes"
            style="min-width: 180px"
          />
          <q-select
            v-model="filtroSafraId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Safra"
            :options="safraOpcoes"
            style="min-width: 220px"
          />
          <agro-btn flat icon="filter_alt" label="Filtrar" descricao="Aplicar filtros" @click="aplicarFiltros" />
        </div>

        <agro-table-skeleton v-if="carregando && contratos.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && contratosFiltrados.length === 0"
          titulo="Nenhum contrato"
          descricao="Crie o primeiro contrato deste tipo ou ajuste os filtros."
          icon="handshake"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="contratosFiltrados"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-clienteId="props">
            <q-td :props="props">{{ rotuloCliente(props.row.clienteId) }}</q-td>
          </template>
          <template #body-cell-produtoId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
          </template>
          <template #body-cell-preco="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.preco) }}</q-td>
          </template>
          <template #body-cell-quantidadeEntregue="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.quantidadeEntregue ?? 0) }}
            </q-td>
          </template>
          <template #body-cell-saldo="props">
            <q-td :props="props" class="text-metric">{{ formatarDecimal(saldoContrato(props.row)) }}</q-td>
          </template>
          <template #body-cell-dias="props">
            <q-td :props="props">
              <span v-if="diasVencimentoContrato(props.row) != null" class="text-metric">
                {{ diasVencimentoContrato(props.row) }}d
              </span>
              <span v-else>—</span>
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               :visualizar-to="{ name: 'contrato-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AlertasContratosPanel from 'components/contratos/AlertasContratosPanel.vue';
import CotacaoMercadoCard from 'components/contratos/CotacaoMercadoCard.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import {
  diasVencimentoContrato,
  saldoContrato,
  useContratos,
} from 'composables/useContratos';
import { useProdutos } from 'composables/useProdutos';
import { useSafras } from 'composables/useSafras';
import {
  ContratoStatusOpcoes,
  TipoContrato,
  TipoContratoOpcoes,
  type ContratoStatusValor,
  type TipoContratoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ContratoDto, CotacaoMercadoDto } from 'types/dtos/contrato.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';



const route = useRoute();
const router = useRouter();

const tipo = ref<TipoContratoValor>(
  (route.query.tipo as TipoContratoValor) || TipoContrato.Cpr,
);
const filtroStatus = ref<ContratoStatusValor | null>(null);
const filtroSafraId = ref<string | null>(null);

const {
  contratos,
  cotacao,
  alertas,
  carregando,
  carregar,
  carregarCotacaoMercado,
  carregarAlertas,
} = useContratos(tipo);

const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { safraOpcoes, carregar: carregarSafras } = useSafras();

const mapaClientes = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeRazao);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const contratosFiltrados = computed(() => {
  return contratos.value.filter((c) => {
    if (filtroStatus.value && c.status !== filtroStatus.value) return false;
    if (filtroSafraId.value && c.safraId !== filtroSafraId.value) return false;
    return true;
  });
});

const colunas: QTableColumn<ContratoDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'preco', label: 'Preço', field: 'preco', align: 'right' },
  { name: 'quantidadeEntregue', label: 'Entregue', field: 'quantidadeEntregue', align: 'right' },
  { name: 'saldo', label: 'Saldo', field: 'quantidade', align: 'right' },
  { name: 'dias', label: 'Dias venc.', field: 'dataFim', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapaClientes.value.get(id) ?? id;
}
function rotuloProduto(id: string): string {
  return mapaProdutos.value.get(id) ?? id;
}

function aplicarFiltros(): void {
  void carregar({
    status: filtroStatus.value ?? '',
    safraId: filtroSafraId.value ?? '',
  });
}

function aplicarCotacaoNoFormulario(c: CotacaoMercadoDto): void {
  void router.push({
    name: 'contrato-novo',
    query: {
      tipo: tipo.value,
      preco: String(c.preco),
      fonte: c.fonte,
      produtoCotacao: c.produto,
    },
  });
}

watch(tipo, (novo) => {
  void router.replace({ query: { tipo: novo } });
  filtroStatus.value = null;
  filtroSafraId.value = null;
  void carregar();
});

onMounted(() => {
  void carregarClientes();
  void carregarProdutos();
  void carregarSafras();
  void carregar();
  void carregarCotacaoMercado();
  void carregarAlertas();
});

</script>
