<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Orçamento financeiro"
      subtitulo="Versões R0/R1/R2, DRE orçado vs realizado e alertas."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo orçamento"
        descricao="Criar orçamento"
        @click="dialog = true"
      />
    </app-page-header>

    <section class="agro-section">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-5">
          <agro-card>
            <agro-table-skeleton v-if="carregando && orcamentos.length === 0" :colunas="4" />
            <empty-state
              v-else-if="!carregando && orcamentos.length === 0"
              titulo="Nenhum orçamento"
              descricao="Crie versões anuais do orçamento financeiro."
              icon="pie_chart"
            />
            <q-table
              v-else
              flat
              bordered
              row-key="id"
              :rows="orcamentos"
              :columns="colunas"
              :loading="carregando"
              :rows-per-page-options="[10, 25]"
            >
              <template #body-cell-ativo="props">
                <q-td :props="props">
                  <agro-badge
                    :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                    :variant="props.row.ativo ? 'success' : 'default'"
                  />
                </q-td>
              </template>
              <template #body-cell-acoes="props">
                <q-td :props="props">
                  <agro-btn
                    flat
                    dense
                    label="DRE"
                    descricao="Ver DRE"
                    @click="verDre(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </agro-card>
        </div>

        <div class="col-12 col-lg-7">
          <agro-card>
            <template #header>
              <h3 class="secao-titulo">DRE — orçado vs realizado</h3>
            </template>
            <empty-state
              v-if="!dre"
              titulo="Selecione um orçamento"
              descricao="Clique em DRE para carregar a demonstração."
              icon="analytics"
            />
            <template v-else>
              <div class="resumo row q-col-gutter-md q-mb-md">
                <div class="col-6">
                  <span class="label">Total orçado</span>
                  <p class="text-metric">{{ formatarMoeda(dre.totalOrcado) }}</p>
                </div>
                <div class="col-6">
                  <span class="label">Total realizado</span>
                  <p class="text-metric">{{ formatarMoeda(dre.totalRealizado) }}</p>
                </div>
              </div>
              <q-table
                flat
                bordered
                row-key="conta"
                :rows="dre.linhas"
                :columns="colunasDre"
                :rows-per-page-options="[15, 30]"
              >
                <template #body-cell-orcado="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.orcado) }}
                  </q-td>
                </template>
                <template #body-cell-realizado="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.realizado) }}
                  </q-td>
                </template>
                <template #body-cell-variacaoPercentual="props">
                  <q-td :props="props" class="text-metric">
                    {{ props.row.variacaoPercentual.toFixed(1) }}%
                  </q-td>
                </template>
                <template #body-cell-alertas="props">
                  <q-td :props="props">
                    <agro-badge v-if="props.row.alerta100" label="100%" variant="error" />
                    <agro-badge
                      v-else-if="props.row.alerta80"
                      label="80%"
                      variant="warning"
                    />
                    <span v-else>—</span>
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
        <q-card-section><h4 class="titulo">Novo orçamento</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model="formulario.ano"
                  outlined
                  label="Ano"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-6">
                <q-select
                  v-model="formulario.versao"
                  outlined
                  emit-value
                  map-options
                  label="Versão"
                  class="field-required"
                  :options="VersaoOrcamentoFinanceiroOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.descricao"
                  outlined
                  label="Descrição"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="formulario.unidadeId"
                  outlined
                  label="Unidade"
                  clearable
                  emit-value
                  map-options
                  :options="unidadeOpcoes"
                  :loading="carregandoUnidades"
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
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useOrcamentoFinanceiro } from 'composables/useOrcamentoFinanceiro';
import { useUnidades } from 'composables/useUnidades';
import { UnidadeStatus, VersaoOrcamentoFinanceiroOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  DreLinhaDto,
  OrcamentoFinanceiroDto,
  OrcamentoFinanceiroFormModel,
} from 'types/dtos/financeiro-gestao.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const { orcamentos, dre, carregando, salvando, carregar, criar, carregarDre } =
  useOrcamentoFinanceiro();
const {
  unidades,
  carregando: carregandoUnidades,
  carregar: carregarUnidades,
} = useUnidades();

const dialog = ref(false);
const formulario = ref<OrcamentoFinanceiroFormModel>({
  ano: String(new Date().getFullYear()),
  versao: 'R0',
  descricao: '',
  unidadeId: '',
});

const unidadeOpcoes = computed(() =>
  unidades.value
    .filter((u) => u.status === UnidadeStatus.Ativa || u.id === formulario.value.unidadeId)
    .map((u) => ({ label: u.nome, value: u.id })),
);

const colunas: QTableColumn<OrcamentoFinanceiroDto>[] = [
  { name: 'ano', label: 'Ano', field: 'ano', align: 'left' },
  { name: 'versao', label: 'Versão', field: 'versao', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
const colunasDre: QTableColumn<DreLinhaDto>[] = [
  { name: 'conta', label: 'Conta', field: 'conta', align: 'left' },
  { name: 'orcado', label: 'Orçado', field: 'orcado', align: 'right' },
  { name: 'realizado', label: 'Realizado', field: 'realizado', align: 'right' },
  { name: 'variacaoPercentual', label: 'Variação', field: 'variacaoPercentual', align: 'right' },
  { name: 'alertas', label: 'Alertas', field: 'conta', align: 'left' },
];

async function verDre(id: string): Promise<void> {
  await carregarDre(id);
}

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregar();
  void carregarUnidades();
});
</script>

<style scoped>
.secao-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
.label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.dialog {
  min-width: min(480px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
