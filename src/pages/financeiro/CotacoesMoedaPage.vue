<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Cotações / multi-moeda"
      subtitulo="PTAX do Banco Central, cotações manuais e exposição cambial."
    >
      <q-select
        v-model="moedaPtax"
        outlined
        dense
        emit-value
        map-options
        label="Moeda PTAX"
        class="moeda-ptax-select"
        :options="MoedaCotacaoOpcoes"
        :disable="sincronizando"
      />
      <agro-btn
        flat
        icon="sync"
        label="Atualizar PTAX"
        descricao="Sincronizar PTAX no Banco Central"
        :loading="sincronizando"
        @click="atualizarPtax"
      />
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova cotação"
        descricao="Registrar cotação"
        @click="abrirNovaCotacao"
      />
    </app-page-header>

    <section class="agro-section">
      <q-banner
        v-if="temAlerta"
        rounded
        class="q-mb-md alerta-banner"
      >
        {{ textoAlerta }}
      </q-banner>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-7">
          <agro-card>
            <agro-table-skeleton v-if="carregando && cotacoes.length === 0" :colunas="6" />
            <empty-state
              v-else-if="!carregando && cotacoes.length === 0"
              titulo="Nenhuma cotação"
              descricao="Atualize a PTAX ou registre uma cotação manual."
              icon="currency_exchange"
            />
            <q-table
              v-else
              flat
              bordered
              row-key="id"
              :rows="cotacoes"
              :columns="colunas"
              :loading="carregando"
              :rows-per-page-options="[10, 25, 50]"
            >
              <template #body-cell-data="props">
                <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
              </template>
              <template #body-cell-taxaCompra="props">
                <q-td :props="props" class="text-metric">
                  {{ props.row.taxaCompra.toFixed(4) }}
                </q-td>
              </template>
              <template #body-cell-taxaVenda="props">
                <q-td :props="props" class="text-metric">
                  {{ props.row.taxaVenda.toFixed(4) }}
                </q-td>
              </template>
              <template #body-cell-acoes="props">
                <q-td :props="props" class="acoes">
                  <agro-acoes-menu
                    :mostrar-visualizar="false"
                    :ativo="true"
                    :loading-status="salvando"
                    @editar="abrirEditar(props.row)"
                    @desabilitar="solicitarInativacao(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </agro-card>
        </div>

        <div class="col-12 col-lg-5">
          <agro-card>
            <template #header>
              <div class="header-acoes">
                <h3 class="secao-titulo">Exposição cambial</h3>
                <agro-btn
                  flat
                  icon="refresh"
                  label="Atualizar"
                  descricao="Recarregar exposição"
                  :loading="carregando"
                  @click="carregarExposicao"
                />
              </div>
            </template>
            <empty-state
              v-if="!exposicao || exposicao.itens.length === 0"
              titulo="Sem exposição"
              descricao="Não há saldos em moeda estrangeira."
              icon="public"
            />
            <template v-else>
              <p class="text-metric q-mb-md">
                Total (R$): {{ formatarMoeda(exposicao.totalExpostoReais) }}
              </p>
              <q-table
                flat
                bordered
                row-key="moeda"
                :rows="exposicao.itens"
                :columns="colunasExp"
                :rows-per-page-options="[10, 25]"
              >
                <template #body-cell-valorExposto="props">
                  <q-td :props="props" class="text-metric">
                    {{ props.row.valorExposto.toFixed(2) }}
                  </q-td>
                </template>
                <template #body-cell-valorEmReais="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.valorEmReais) }}
                  </q-td>
                </template>
                <template #body-cell-variacaoCambial="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.variacaoCambial) }}
                  </q-td>
                </template>
              </q-table>
            </template>
          </agro-card>
        </div>
      </div>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar cotação' : 'Nova cotação' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  v-model="formulario.moeda"
                  outlined
                  emit-value
                  map-options
                  label="Moeda"
                  class="field-required"
                  :options="MoedaCotacaoOpcoes"
                  :rules="[obrigatorio]"
                  :readonly="!!editandoId"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formulario.data"
                  outlined
                  type="date"
                  label="Data"
                  class="field-required"
                  :rules="[obrigatorio]"
                  :readonly="!!editandoId"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formulario.taxaCompra"
                  outlined
                  label="Taxa compra"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formulario.taxaVenda"
                  outlined
                  label="Taxa venda"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="fecharDialog" />
              <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCotacoesMoeda } from 'composables/useCotacoesMoeda';
import { MoedaCotacao, MoedaCotacaoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  CotacaoMoedaDto,
  CotacaoMoedaFormModel,
  ExposicaoCambialItemDto,
} from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const {
  cotacoes,
  exposicao,
  carregando,
  salvando,
  sincronizando,
  carregar,
  carregarExposicao,
  criar,
  atualizar,
  solicitarInativacao,
  sincronizarPtax,
} = useCotacoesMoeda();

const dialog = ref(false);
const editandoId = ref<string | null>(null);
const moedaPtax = ref(MoedaCotacao.Usd);
const formulario = ref<CotacaoMoedaFormModel>({
  moeda: MoedaCotacao.Usd,
  data: new Date().toISOString().slice(0, 10),
  taxaCompra: '',
  taxaVenda: '',
});

const temAlerta = computed(() => !!exposicao.value?.cotacaoPendente);

const textoAlerta = computed(
  () =>
    exposicao.value?.mensagem ??
    'Há títulos em moeda estrangeira sem cotação. Atualize a PTAX.',
);

const colunas: QTableColumn<CotacaoMoedaDto>[] = [
  { name: 'moeda', label: 'Moeda', field: 'moeda', align: 'left' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'taxaCompra', label: 'Compra', field: 'taxaCompra', align: 'right' },
  { name: 'taxaVenda', label: 'Venda', field: 'taxaVenda', align: 'right' },
  { name: 'fonte', label: 'Fonte', field: 'fonte', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
const colunasExp: QTableColumn<ExposicaoCambialItemDto>[] = [
  { name: 'moeda', label: 'Moeda', field: 'moeda', align: 'left' },
  { name: 'valorExposto', label: 'Exposto', field: 'valorExposto', align: 'right' },
  { name: 'valorEmReais', label: 'Em R$', field: 'valorEmReais', align: 'right' },
  { name: 'variacaoCambial', label: 'Variação', field: 'variacaoCambial', align: 'right' },
];

function abrirNovaCotacao(): void {
  editandoId.value = null;
  formulario.value = {
    moeda: moedaPtax.value,
    data: new Date().toISOString().slice(0, 10),
    taxaCompra: '',
    taxaVenda: '',
  };
  dialog.value = true;
}

function abrirEditar(row: CotacaoMoedaDto): void {
  editandoId.value = row.id;
  formulario.value = {
    moeda: row.moeda,
    data: row.data.slice(0, 10),
    taxaCompra: String(row.taxaCompra),
    taxaVenda: String(row.taxaVenda),
  };
  dialog.value = true;
}

function fecharDialog(): void {
  dialog.value = false;
  editandoId.value = null;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await atualizar(editandoId.value, formulario.value)
    : await criar(formulario.value);
  if (ok) fecharDialog();
}

async function atualizarPtax(): Promise<void> {
  await sincronizarPtax({ moeda: moedaPtax.value });
}

onMounted(() => {
  void carregar();
  void carregarExposicao();
});
</script>

<style scoped>
.alerta-banner {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
}
.moeda-ptax-select {
  min-width: 220px;
}
.secao-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
.header-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.dialog {
  min-width: min(440px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes {
  white-space: nowrap;
}
</style>
