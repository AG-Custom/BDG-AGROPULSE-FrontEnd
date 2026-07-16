<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Cotações / multi-moeda"
      subtitulo="PTAX, cotações manuais e exposição cambial."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova cotação"
        descricao="Registrar cotação"
        @click="dialog = true"
      />
    </app-page-header>

    <section class="agro-section">
      <q-banner
        v-if="temStub"
        rounded
        class="q-mb-md stub-banner"
      >
        Integração externa em modo stub — PTAX/exposição cambial podem ser simulados.
        <span v-if="exposicao?.mensagem"> {{ exposicao.mensagem }}</span>
      </q-banner>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-7">
          <agro-card>
            <agro-table-skeleton v-if="carregando && cotacoes.length === 0" :colunas="5" />
            <empty-state
              v-else-if="!carregando && cotacoes.length === 0"
              titulo="Nenhuma cotação"
              descricao="Registre cotações de moeda ou aguarde a PTAX."
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
        <q-card-section><h4 class="titulo">Nova cotação</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model="formulario.moeda"
                  outlined
                  label="Moeda (ex: USD)"
                  class="field-required"
                  :rules="[obrigatorio]"
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
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCotacoesMoeda } from 'composables/useCotacoesMoeda';
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
  carregar,
  carregarExposicao,
  criar,
} = useCotacoesMoeda();

const dialog = ref(false);
const formulario = ref<CotacaoMoedaFormModel>({
  moeda: 'USD',
  data: new Date().toISOString().slice(0, 10),
  taxaCompra: '',
  taxaVenda: '',
});

const temStub = computed(
  () => cotacoes.value.some((c) => c.stub) || !!exposicao.value?.stub,
);

const colunas: QTableColumn<CotacaoMoedaDto>[] = [
  { name: 'moeda', label: 'Moeda', field: 'moeda', align: 'left' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'taxaCompra', label: 'Compra', field: 'taxaCompra', align: 'right' },
  { name: 'taxaVenda', label: 'Venda', field: 'taxaVenda', align: 'right' },
  { name: 'fonte', label: 'Fonte', field: 'fonte', align: 'left' },
];
const colunasExp: QTableColumn<ExposicaoCambialItemDto>[] = [
  { name: 'moeda', label: 'Moeda', field: 'moeda', align: 'left' },
  { name: 'valorExposto', label: 'Exposto', field: 'valorExposto', align: 'right' },
  { name: 'valorEmReais', label: 'Em R$', field: 'valorEmReais', align: 'right' },
  { name: 'variacaoCambial', label: 'Variação', field: 'variacaoCambial', align: 'right' },
];

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregar();
  void carregarExposicao();
});
</script>

<style scoped>
.stub-banner {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
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
</style>
