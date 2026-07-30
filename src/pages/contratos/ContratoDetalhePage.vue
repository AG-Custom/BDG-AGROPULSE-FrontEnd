<template>
  <q-page class="agro-page">
    <app-page-header titulo="Contrato" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="podeEditar"
          flat
          icon="edit"
          label="Editar"
          descricao="Editar contrato"
          :to="{ name: 'contrato-editar', params: { id }, query: { tipo } }"
        />
        <agro-btn
          v-if="podeEntregaParcial"
          color="primary"
          flat
          label="Entrega parcial"
          descricao="Registrar entrega parcial"
          @click="dialogEntrega = true"
        />
        <agro-btn
          v-if="podeLiquidar"
          color="primary"
          unelevated
          label="Liquidar"
          descricao="Liquidar contrato"
          :loading="salvando"
          @click="abrirLiquidacao"
        />
        <agro-btn
          v-if="podeEntregarTotal"
          color="primary"
          unelevated
          label="Entregar total"
          descricao="Marcar como entregue"
          :loading="salvando"
          @click="entregar(id)"
        />
        <agro-btn
          v-if="podeCancelar"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar contrato"
          :loading="salvando"
          @click="cancelar(id)"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !contrato" :campos="8" />
      <template v-else-if="contrato">
        <agro-card class="q-mb-md">
          <div class="row q-col-gutter-md">
            <div class="col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="contrato.status" variant="default" />
            </div>
            <div class="col-md-3">
              <div class="text-caption">Cliente</div>
              <div>{{ rotuloCliente(contrato.clienteId) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Produto</div>
              <div>{{ rotuloProduto(contrato.produtoId) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Preço</div>
              <div class="text-metric">{{ formatarMoeda(contrato.preco) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Quantidade</div>
              <div class="text-metric">{{ formatarDecimal(contrato.quantidade) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Fonte</div>
              <div>{{ contrato.fontePreco }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Início</div>
              <div>{{ formatarData(contrato.dataInicio) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Fim</div>
              <div>{{ formatarData(contrato.dataFim) }}</div>
            </div>
            <div v-if="contrato.safraId" class="col-md-3">
              <div class="text-caption">Safra</div>
              <div>{{ rotuloSafra(contrato.safraId) }}</div>
            </div>
            <div v-if="contrato.numeroCpr" class="col-md-3">
              <div class="text-caption">Nº CPR</div>
              <div>{{ contrato.numeroCpr }}</div>
            </div>
            <div v-if="contrato.tipoOperacao" class="col-md-3">
              <div class="text-caption">Operação</div>
              <div>{{ contrato.tipoOperacao }}</div>
            </div>
            <div v-if="contrato.localEntrega" class="col-md-6">
              <div class="text-caption">Local de entrega</div>
              <div>{{ contrato.localEntrega }}</div>
            </div>
            <div v-if="contrato.qualidadeMinima" class="col-md-6">
              <div class="text-caption">Qualidade mínima</div>
              <div>{{ contrato.qualidadeMinima }}</div>
            </div>
            <div
              v-if="contrato.precoInsumo != null && contrato.quantidadeInsumo != null"
              class="col-md-3"
            >
              <div class="text-caption">Valor insumos</div>
              <div class="text-metric">
                {{ formatarMoeda(contrato.precoInsumo * contrato.quantidadeInsumo) }}
              </div>
            </div>
            <div v-if="contrato.quantidadeGrao != null" class="col-md-3">
              <div class="text-caption">Qtd. grãos</div>
              <div class="text-metric">{{ formatarDecimal(contrato.quantidadeGrao) }}</div>
            </div>
            <div v-if="contrato.ajusteFinanceiro != null" class="col-md-3">
              <div class="text-caption">Ajuste financeiro</div>
              <div class="text-metric">{{ formatarMoeda(contrato.ajusteFinanceiro) }}</div>
            </div>
            <div v-if="contrato.precoLiquidacao != null" class="col-md-3">
              <div class="text-caption">Preço liquidação</div>
              <div class="text-metric">{{ formatarMoeda(contrato.precoLiquidacao) }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card class="q-mb-md">
          <progresso-entrega-bar
            :comprometido="contrato.quantidade"
            :entregue="contrato.quantidadeEntregue ?? 0"
          />
        </agro-card>

        <agro-card v-if="entregas.length > 0" class="q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Entregas</div>
          <q-table
            flat
            bordered
            row-key="id"
            :rows="entregas"
            :columns="colunasEntrega"
            :rows-per-page-options="[5, 10]"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.quantidade) }}
              </q-td>
            </template>
            <template #body-cell-dataEntrega="props">
              <q-td :props="props">{{ formatarData(props.row.dataEntrega) }}</q-td>
            </template>
          </q-table>
        </agro-card>

        <agro-card v-if="vinculos.length > 0" class="q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Vínculos com pedidos</div>
          <q-table
            flat
            bordered
            row-key="id"
            :rows="vinculos"
            :columns="colunasVinculo"
            :rows-per-page-options="[5, 10]"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-valor="props">
              <q-td :props="props" class="text-metric">
                {{ props.row.valor != null ? formatarMoeda(props.row.valor) : '—' }}
              </q-td>
            </template>
          </q-table>
        </agro-card>
      </template>

      <div class="agro-form-actions">
        <agro-btn
          flat
          label="Voltar"
          descricao="Voltar"
          :to="{ name: 'contratos', query: { tipo } }"
        />
      </div>
    </section>

    <entrega-parcial-dialog
      v-model="dialogEntrega"
      :saldo-pendente="saldo"
      :loading="salvando"
      @confirmar="onEntrega"
    />
    <liquidacao-financeira-dialog
      v-model="dialogLiquidacao"
      :cotacao="cotacao"
      :saldo-pendente="saldo"
      :preco-sugerido="contrato?.preco"
      :fonte-sugerida="contrato?.fontePreco"
      :loading="salvando"
      @confirmar="onLiquidar"
    />
  </q-page>
</template>

<script setup lang="ts">
import EntregaParcialDialog from 'components/contratos/EntregaParcialDialog.vue';
import LiquidacaoFinanceiraDialog from 'components/contratos/LiquidacaoFinanceiraDialog.vue';
import ProgressoEntregaBar from 'components/contratos/ProgressoEntregaBar.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useClientes } from 'composables/useClientes';
import { saldoContrato, useContratos } from 'composables/useContratos';
import { useProdutos } from 'composables/useProdutos';
import { useSafras } from 'composables/useSafras';
import {
  ContratoStatus,
  TipoContrato,
  type TipoContratoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  EntregaContratoDto,
  EntregaPayload,
  LiquidarContratoPayload,
  VinculoPedidoContratoDto,
} from 'types/dtos/contrato.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tipo = computed(
  () => (route.query.tipo as TipoContratoValor) || TipoContrato.Cpr,
);
const id = computed(() => route.params.id as string);

const {
  contrato,
  cotacao,
  vinculos,
  entregas,
  carregando,
  salvando,
  obter,
  liquidar,
  entregar,
  criarEntrega,
  cancelar,
  carregarCotacaoMercado,
  carregarVinculos,
  carregarEntregas,
} = useContratos(tipo);

const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { safras, carregar: carregarSafras } = useSafras();

const dialogEntrega = ref(false);
const dialogLiquidacao = ref(false);

const subtitulo = computed(() =>
  contrato.value ? `Status: ${contrato.value.status}` : 'Carregando...',
);

const saldo = computed(() =>
  contrato.value ? saldoContrato(contrato.value) : null,
);

const podeEditar = computed(() => contrato.value?.status === ContratoStatus.Aberto);
const podeLiquidar = computed(() => contrato.value?.status === ContratoStatus.Aberto);
const podeCancelar = computed(() => contrato.value?.status === ContratoStatus.Aberto);
const podeEntregaParcial = computed(() => {
  const s = contrato.value?.status;
  return (
    s === ContratoStatus.Aberto ||
    s === ContratoStatus.Liquidado ||
    s === ContratoStatus.ParcialmenteEntregue
  );
});
const podeEntregarTotal = computed(() => {
  const s = contrato.value?.status;
  return s === ContratoStatus.Liquidado || s === ContratoStatus.ParcialmenteEntregue;
});

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
const mapaSafras = computed(() => {
  const m = new Map<string, string>();
  for (const s of safras.value) m.set(s.id, `${s.nome} (${s.cultura})`);
  return m;
});

const colunasEntrega: QTableColumn<EntregaContratoDto>[] = [
  { name: 'dataEntrega', label: 'Data', field: 'dataEntrega', align: 'left' },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right' },
  { name: 'numeroNfe', label: 'NF', field: 'numeroNfe', align: 'left' },
  { name: 'observacao', label: 'Obs.', field: 'observacao', align: 'left' },
];

const colunasVinculo: QTableColumn<VinculoPedidoContratoDto>[] = [
  { name: 'pedidoNumero', label: 'Pedido', field: 'pedidoNumero', align: 'left' },
  { name: 'tipoVinculo', label: 'Tipo', field: 'tipoVinculo', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];

function rotuloCliente(cid: string): string {
  return mapaClientes.value.get(cid) ?? cid;
}
function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}
function rotuloSafra(sid: string): string {
  return mapaSafras.value.get(sid) ?? sid;
}

async function abrirLiquidacao(): Promise<void> {
  await carregarCotacaoMercado();
  dialogLiquidacao.value = true;
}

async function onEntrega(payload: EntregaPayload): Promise<void> {
  const ok = await criarEntrega(id.value, payload);
  if (ok) dialogEntrega.value = false;
}

async function onLiquidar(payload: LiquidarContratoPayload): Promise<void> {
  const ok = await liquidar(id.value, payload);
  if (ok) dialogLiquidacao.value = false;
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  void carregarSafras();
  const ok = await obter(id.value);
  if (!ok) {
    await router.replace({ name: 'contratos', query: { tipo: tipo.value } });
    return;
  }
  void carregarVinculos(id.value);
  void carregarEntregas(id.value);
});
</script>

<style scoped>
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
</style>
