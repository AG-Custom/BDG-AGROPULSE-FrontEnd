<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Tesouraria"
      subtitulo="Saldo intraday, projeção e aplicações financeiras."
    />

    <section class="agro-section">
      <q-banner v-if="saldo?.stub || projecao?.stub" rounded class="q-mb-md stub-banner">
        Integração externa em modo stub — saldos/projeção podem ser simulados.
      </q-banner>

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-3">
          <filtro-escopo-select v-model="filtroEscopo" @update:model-value="recarregar" />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model.number="diasProjecao"
            outlined
            dense
            type="number"
            label="Projeção (dias)"
            @update:model-value="recarregar"
          />
        </div>
      </div>

      <agro-card class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">Saldo intraday</h3>
        </template>
        <agro-table-skeleton v-if="carregando && !saldo" :colunas="4" />
        <template v-else-if="saldo">
          <p class="saldo-total text-metric">Total: {{ formatarMoeda(saldo.saldoTotal) }}</p>
          <q-table
            flat
            bordered
            row-key="contaBancariaId"
            :rows="saldo.contas"
            :columns="colunasContas"
            :rows-per-page-options="[10, 25]"
            class="q-mb-md"
          >
            <template #body-cell-saldo="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldo) }}</q-td>
            </template>
            <template #body-cell-alertaSaldoMinimo="props">
              <q-td :props="props">
                <agro-badge
                  v-if="props.row.alertaSaldoMinimo"
                  label="Abaixo do mínimo"
                  variant="warning"
                />
                <span v-else>—</span>
              </q-td>
            </template>
          </q-table>
          <q-table
            flat
            bordered
            row-key="caixaId"
            :rows="saldo.caixas"
            :columns="colunasCaixas"
            :rows-per-page-options="[10, 25]"
          >
            <template #body-cell-saldo="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldo) }}</q-td>
            </template>
          </q-table>
        </template>
        <empty-state
          v-else
          titulo="Sem saldo"
          descricao="Não há saldos intraday disponíveis."
          icon="savings"
        />
      </agro-card>

      <agro-card class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">Projeção</h3>
        </template>
        <agro-table-skeleton v-if="carregando && !projecao" :colunas="4" />
        <q-table
          v-else-if="projecao && projecao.itens.length > 0"
          flat
          bordered
          row-key="data"
          :rows="projecao.itens"
          :columns="colunasProjecao"
          :rows-per-page-options="[15, 30]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-entradasPrevistas="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.entradasPrevistas) }}
            </q-td>
          </template>
          <template #body-cell-saidasPrevistas="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.saidasPrevistas) }}
            </q-td>
          </template>
          <template #body-cell-saldoProjetado="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.saldoProjetado) }}
            </q-td>
          </template>
        </q-table>
        <empty-state
          v-else
          titulo="Sem projeção"
          descricao="Não há projeção para o período."
          icon="timeline"
        />
      </agro-card>

      <agro-card>
        <template #header>
          <div class="header-acoes">
            <h3 class="secao-titulo">Aplicações</h3>
            <agro-btn
              color="primary"
              unelevated
              icon="add"
              label="Nova aplicação"
              descricao="Registrar aplicação"
              @click="dialog = true"
            />
          </div>
        </template>
        <agro-table-skeleton v-if="carregandoApps && aplicacoes.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregandoApps && aplicacoes.length === 0"
          titulo="Nenhuma aplicação"
          descricao="Registre CDB, LCI, fundos e outras aplicações."
          icon="trending_up"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="aplicacoes"
          :columns="colunasApps"
          :loading="carregandoApps"
          :rows-per-page-options="[10, 25]"
        >
          <template #body-cell-valorAplicado="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorAplicado) }}
            </q-td>
          </template>
          <template #body-cell-valorAtual="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorAtual) }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.status"
                :variant="props.row.status === 'Ativa' ? 'success' : 'default'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                v-if="props.row.status === 'Ativa'"
                flat
                dense
                label="Resgatar"
                descricao="Resgatar aplicação"
                :loading="salvandoApps"
                @click="resgatar(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Nova aplicação</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvarApp">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="formApp.contaBancariaId"
                  outlined
                  emit-value
                  map-options
                  label="Conta bancária"
                  class="field-required"
                  :options="contaOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formApp.tipo"
                  outlined
                  emit-value
                  map-options
                  label="Tipo"
                  class="field-required"
                  :options="TipoAplicacaoOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formApp.valorAplicado"
                  outlined
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formApp.descricao"
                  outlined
                  label="Descrição"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formApp.dataAplicacao"
                  outlined
                  type="date"
                  label="Data aplicação"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-6">
                <q-input v-model="formApp.dataVencimento" outlined type="date" label="Vencimento" />
              </div>
              <div class="col-12">
                <q-input v-model="formApp.taxaPercentual" outlined label="Taxa %" />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Salvar"
                type="submit"
                :loading="salvandoApps"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import FiltroEscopoSelect from 'components/financeiro/FiltroEscopoSelect.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAplicacoesFinanceiras } from 'composables/useAplicacoesFinanceiras';
import { useContasBancarias } from 'composables/useContasBancarias';
import { useTesouraria } from 'composables/useTesouraria';
import {
  EscopoFinanceiro,
  TipoAplicacaoOpcoes,
  type EscopoFinanceiroValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  AplicacaoFinanceiraDto,
  AplicacaoFormModel,
  TesourariaProjecaoItemDto,
} from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { saldo, projecao, carregando, carregarSaldo, carregarProjecao } = useTesouraria();
const {
  aplicacoes,
  carregando: carregandoApps,
  salvando: salvandoApps,
  carregar: carregarApps,
  criar,
  resgatar,
} = useAplicacoesFinanceiras();
const { contaOpcoes, carregar: carregarContas } = useContasBancarias();

const filtroEscopo = ref<EscopoFinanceiroValor | null>(EscopoFinanceiro.Unidade);
const diasProjecao = ref(30);
const dialog = ref(false);
const formApp = ref<AplicacaoFormModel>({
  contaBancariaId: '',
  tipo: '',
  descricao: '',
  valorAplicado: '',
  dataAplicacao: new Date().toISOString().slice(0, 10),
  dataVencimento: '',
  taxaPercentual: '',
});

const colunasContas: QTableColumn[] = [
  { name: 'banco', label: 'Banco', field: 'banco', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right' },
  { name: 'alertaSaldoMinimo', label: 'Alerta', field: 'alertaSaldoMinimo', align: 'left' },
];
const colunasCaixas: QTableColumn[] = [
  { name: 'nome', label: 'Caixa', field: 'nome', align: 'left' },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right' },
];
const colunasProjecao: QTableColumn<TesourariaProjecaoItemDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'entradasPrevistas', label: 'Entradas', field: 'entradasPrevistas', align: 'right' },
  { name: 'saidasPrevistas', label: 'Saídas', field: 'saidasPrevistas', align: 'right' },
  { name: 'saldoProjetado', label: 'Saldo', field: 'saldoProjetado', align: 'right' },
];
const colunasApps: QTableColumn<AplicacaoFinanceiraDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'valorAplicado', label: 'Aplicado', field: 'valorAplicado', align: 'right' },
  { name: 'valorAtual', label: 'Atual', field: 'valorAtual', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function recarregar(): Promise<void> {
  const params = { escopo: filtroEscopo.value ?? undefined };
  await Promise.all([
    carregarSaldo(params),
    carregarProjecao({ ...params, dias: diasProjecao.value }),
    carregarApps(params),
  ]);
}

async function salvarApp(): Promise<void> {
  const ok = await criar(formApp.value);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregarContas();
  void recarregar();
});
</script>

<style scoped>
.stub-banner {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
  color: var(--color-text-primary);
}
.secao-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
.saldo-total {
  margin: 0 0 var(--spacing-4);
  font-size: var(--font-size-lg);
}
.header-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--spacing-3);
}
.dialog {
  min-width: min(520px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
