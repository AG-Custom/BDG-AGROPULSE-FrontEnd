<template>
  <div class="painel">
    <agro-form-skeleton v-if="carregando && !config" :campos="8" />
    <template v-else>
      <agro-card class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">Bloqueio e alçadas</h3>
        </template>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.maxConcentracaoPct"
              outlined
              label="% concentração máxima"
              type="number"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.scoreMinimoRevisao"
              outlined
              label="Score mínimo para revisão"
              type="number"
            />
          </div>
          <div class="col-12 col-md-4">
            <AgroMoneyInput v-model="form.limiteGerente" label="Alçada gerente" />
          </div>
          <div class="col-12 col-md-4">
            <AgroMoneyInput v-model="form.limiteDiretor" label="Alçada diretor" />
          </div>
          <div class="col-12 col-md-4">
            <AgroMoneyInput v-model="form.limiteCeo" label="Alçada CEO" />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.diasAtrasoBloqueioPorPerfil"
              outlined
              label="Dias de atraso por perfil (JSON)"
              type="textarea"
              autogrow
              hint='Ex.: {"Gerente":60,"Diretor":90,"Ceo":120}'
            />
          </div>
          <div class="col-12">
            <q-toggle v-model="form.bloqueioEfetivo" label="Bloqueio efetivo de pedidos por atraso" />
          </div>
        </div>
      </agro-card>

      <agro-card class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">Pesos do score (devem somar 100)</h3>
        </template>
        <div class="row q-col-gutter-md">
          <div class="col-6 col-md-3">
            <q-input
              v-model="form.pesoHistoricoPagamento"
              outlined
              label="Histórico pagamento %"
              type="number"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="form.pesoTempoRelacionamento"
              outlined
              label="Tempo relacionamento %"
              type="number"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="form.pesoVolumeCompras"
              outlined
              label="Volume compras %"
              type="number"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-input
              v-model="form.pesoDadosCadastrais"
              outlined
              label="Dados cadastrais %"
              type="number"
            />
          </div>
        </div>
        <p class="text-caption q-mt-sm" :class="{ 'text-negative': somaPesos !== 100 }">
          Total: <span class="text-metric">{{ somaPesos }}%</span>
          <span v-if="somaPesos !== 100"> — deve somar 100</span>
        </p>
      </agro-card>

      <agro-card class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">PDD — % por faixa</h3>
        </template>
        <div class="row q-col-gutter-md">
          <div class="col-6 col-md-4">
            <q-input v-model="form.pddFaixa1a15" outlined label="1–15 dias %" type="number" />
          </div>
          <div class="col-6 col-md-4">
            <q-input v-model="form.pddFaixa16a30" outlined label="16–30 dias %" type="number" />
          </div>
          <div class="col-6 col-md-4">
            <q-input v-model="form.pddFaixa31a60" outlined label="31–60 dias %" type="number" />
          </div>
          <div class="col-6 col-md-4">
            <q-input v-model="form.pddFaixa61a90" outlined label="61–90 dias %" type="number" />
          </div>
          <div class="col-6 col-md-4">
            <q-input v-model="form.pddFaixa91a180" outlined label="91–180 dias %" type="number" />
          </div>
          <div class="col-6 col-md-4">
            <q-input v-model="form.pddFaixaAcima180" outlined label="Acima 180 %" type="number" />
          </div>
        </div>
      </agro-card>

      <div class="agro-form-actions q-mb-lg">
        <agro-btn
          color="primary"
          unelevated
          label="Salvar configuração"
          descricao="Salvar"
          :loading="salvando"
          :disable="somaPesos !== 100"
          @click="onSalvar"
        />
        <agro-btn
          flat
          icon="autorenew"
          label="Revisar limites"
          descricao="Revisar limites"
          :loading="salvando"
          @click="revisarLimites"
        />
      </div>

      <agro-card v-if="revisaoLimites.length" class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">Clientes para revisão</h3>
        </template>
        <q-table
          flat
          bordered
          row-key="clienteId"
          :rows="revisaoLimites"
          :columns="colunasRevisao"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-limiteCredito="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.limiteCredito) }}
            </q-td>
          </template>
          <template #body-cell-utilizado="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.utilizado) }}</q-td>
          </template>
        </q-table>
      </agro-card>

      <agro-card class="q-mb-md">
        <template #header>
          <div class="header-flex">
            <h3 class="secao-titulo">Bureau Serasa / SPC</h3>
            <agro-badge label="Stub" variant="warning" />
          </div>
        </template>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-5">
            <q-select
              v-model="bureauClienteId"
              outlined
              label="Cliente"
              clearable
              emit-value
              map-options
              :options="clienteOpcoes"
              :loading="carregandoClientes"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="bureauTipo"
              outlined
              label="Bureau"
              :options="BureauCreditoOpcoes"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-4">
            <agro-btn
              color="primary"
              unelevated
              label="Consultar"
              descricao="Consultar bureau"
              :loading="salvando"
              :disable="!bureauClienteId"
              @click="onBureau"
            />
          </div>
        </div>
        <div v-if="bureauResultado" class="q-mt-md">
          <agro-badge label="Stub" variant="warning" class="q-mr-sm" />
          Score externo:
          <span class="text-metric">{{ bureauResultado.scoreExterno }}</span>
          — {{ bureauResultado.mensagem }}
        </div>
      </agro-card>

      <agro-card>
        <template #header>
          <div class="header-flex">
            <h3 class="secao-titulo">Crédito bancário rural</h3>
            <agro-badge label="Stub" variant="warning" />
          </div>
        </template>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-select
              v-model="bancoClienteId"
              outlined
              label="Cliente"
              clearable
              emit-value
              map-options
              :options="clienteOpcoes"
              :loading="carregandoClientes"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="bancoInstituicao"
              outlined
              label="Instituição"
              :options="InstituicaoCreditoBancarioOpcoes"
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="bancoTipoOperacao" outlined label="Tipo operação" />
          </div>
          <div class="col-12 col-md-2">
            <AgroMoneyInput v-model="bancoValor" label="Valor" />
          </div>
          <div class="col-12 col-md-2">
            <agro-btn
              color="primary"
              unelevated
              label="Solicitar"
              descricao="Stub bancário"
              :loading="salvando"
              :disable="!bancoClienteId"
              @click="onBanco"
            />
          </div>
        </div>
        <div v-if="creditoBancario.length" class="q-mt-md">
          <div v-for="c in creditoBancario" :key="c.id" class="text-caption q-mb-xs">
            <agro-badge v-if="c.stub" label="Stub" variant="warning" class="q-mr-sm" />
            {{ c.instituicao }} · {{ c.tipoOperacao }} ·
            {{ c.referenciaExterna || c.status }}
            <span v-if="c.mensagem"> — {{ c.mensagem }}</span>
          </div>
        </div>
      </agro-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { useClientes } from 'composables/useClientes';
import {
  configDtoParaForm,
  configVazia,
  useCobrancaCredito,
} from 'composables/useCobrancaCredito';
import {
  BureauCredito,
  BureauCreditoOpcoes,
  InstituicaoCreditoBancario,
  InstituicaoCreditoBancarioOpcoes,
} from 'constants/enums';
import type { BureauCreditoValor, InstituicaoCreditoBancarioValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RevisaoLimiteItemDto } from 'types/dtos/cobranca-credito.dto';
import { formatarMoeda, parseMascaraMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const {
  config,
  carregando,
  salvando,
  bureauResultado,
  creditoBancario,
  revisaoLimites,
  carregarConfig,
  salvarConfig,
  consultarBureau,
  solicitarCreditoBancario,
  revisarLimites,
} = useCobrancaCredito();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();

const form = reactive(configVazia());
const bureauClienteId = ref<string | null>('');
const bureauTipo = ref<BureauCreditoValor>(BureauCredito.Serasa);
const bancoClienteId = ref<string | null>('');
const bancoInstituicao = ref<InstituicaoCreditoBancarioValor>(
  InstituicaoCreditoBancario.BancoDoBrasil,
);
const bancoTipoOperacao = ref('Custeio');
const bancoValor = ref('');

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);

const somaPesos = computed(
  () =>
    Number(form.pesoHistoricoPagamento || 0) +
    Number(form.pesoTempoRelacionamento || 0) +
    Number(form.pesoVolumeCompras || 0) +
    Number(form.pesoDadosCadastrais || 0),
);

const colunasRevisao: QTableColumn<RevisaoLimiteItemDto>[] = [
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'limiteCredito', label: 'Limite', field: 'limiteCredito', align: 'right' },
  { name: 'utilizado', label: 'Utilizado', field: 'utilizado', align: 'right' },
  { name: 'maiorAtrasoDias', label: 'Atraso', field: 'maiorAtrasoDias', align: 'right' },
  { name: 'scoreRecente', label: 'Score', field: 'scoreRecente', align: 'right' },
  { name: 'motivo', label: 'Motivo', field: 'motivo', align: 'left' },
];

watch(
  config,
  (c) => {
    if (c) Object.assign(form, configDtoParaForm(c));
  },
  { immediate: true },
);

async function onSalvar(): Promise<void> {
  await salvarConfig(form);
}

async function onBureau(): Promise<void> {
  const id = bureauClienteId.value?.trim();
  if (!id) return;
  await consultarBureau(id, bureauTipo.value);
}

async function onBanco(): Promise<void> {
  const id = bancoClienteId.value?.trim();
  if (!id) return;
  await solicitarCreditoBancario(
    id,
    bancoInstituicao.value,
    bancoTipoOperacao.value.trim() || 'Custeio',
    parseMascaraMoeda(bancoValor.value) ?? 0,
  );
}

onMounted(() => {
  void carregarConfig();
  void carregarClientes();
});
</script>

<style scoped>
.painel {
  padding: var(--spacing-4);
}

.secao-titulo {
  margin: 0;
  font-size: var(--font-size-md);
}

.header-flex {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}
</style>
