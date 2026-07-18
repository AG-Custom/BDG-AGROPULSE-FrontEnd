<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova ficha"
        descricao="Criar ficha rural"
        @click="abrirDialog"
      />
    </div>

    <agro-table-skeleton v-if="carregando && fichas.length === 0" :colunas="5" />
    <empty-state
      v-else-if="!carregando && fichas.length === 0"
      titulo="Nenhuma ficha rural"
      descricao="Crie a primeira ficha de análise de crédito rural."
      icon="description"
    >
      <agro-btn color="primary" unelevated label="Nova ficha" descricao="Criar" @click="abrirDialog" />
    </empty-state>
    <q-table
      v-else
      flat
      bordered
      row-key="id"
      :rows="fichas"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-areaCultura="props">
        <q-td :props="props">
          {{ props.row.culturaPrincipal || '—' }}
          <span v-if="props.row.areaPlantadaHa != null" class="text-caption text-secondary">
            · {{ props.row.areaPlantadaHa }} ha
          </span>
        </q-td>
      </template>
      <template #body-cell-rendaEstimada="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.rendaEstimada != null ? formatarMoeda(props.row.rendaEstimada) : '—' }}
        </q-td>
      </template>
      <template #body-cell-endividamentoTotal="props">
        <q-td :props="props" class="text-metric">
          {{
            props.row.endividamentoTotal != null
              ? formatarMoeda(props.row.endividamentoTotal)
              : '—'
          }}
        </q-td>
      </template>
      <template #body-cell-acoes="props">
        <q-td :props="props">
          <agro-btn
            v-if="props.row.analiseCreditoId"
            flat
            dense
            color="primary"
            label="Aplicar limite"
            descricao="Aplicar limite na análise"
            @click="abrirAprovar(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogNova" persistent>
      <q-card class="dialog dialog--wide">
        <q-card-section>
          <h4 class="titulo">Nova ficha de crédito rural</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.clienteId"
                  outlined
                  label="Cliente ID"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.analiseCreditoId"
                  outlined
                  label="Análise de crédito ID"
                  hint="Opcional — necessário para aplicar limite"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.areaPlantadaHa" outlined label="Área plantada (ha)" type="number" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.culturaPrincipal" outlined label="Cultura principal" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.produtividadeEsperada"
                  outlined
                  label="Produtividade esperada"
                  type="number"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.rendaEstimada" outlined label="Renda estimada (R$)" type="number" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.endividamentoTotal"
                  outlined
                  label="Endividamento total (R$)"
                  type="number"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.observacoesGarantias"
                  outlined
                  label="Garantias"
                  type="textarea"
                  autogrow
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogNova = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Criar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogAprovar" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Aplicar limite</h4>
          <p class="text-caption text-secondary">
            Análise: {{ fichaAlvo?.analiseCreditoId }}
          </p>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="limiteAprovado"
            outlined
            label="Limite aprovado (R$)"
            type="number"
            class="q-mb-md"
          />
          <q-toggle v-model="aprovarLimite" label="Aprovar e aplicar limite" />
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogAprovar = false" />
            <agro-btn
              color="primary"
              unelevated
              :label="aprovarLimite ? 'Aprovar' : 'Recusar'"
              :loading="salvando"
              @click="confirmarAprovar"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { fichaVazia, useCobrancaCredito } from 'composables/useCobrancaCredito';
import type { QTableColumn } from 'quasar';
import type { FichaCreditoRuralDto } from 'types/dtos/cobranca-credito.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, reactive, ref } from 'vue';

const { fichas, carregando, salvando, carregarFichas, criarFicha, aplicarLimite } =
  useCobrancaCredito();

const dialogNova = ref(false);
const dialogAprovar = ref(false);
const form = reactive(fichaVazia());
const fichaAlvo = ref<FichaCreditoRuralDto | null>(null);
const limiteAprovado = ref('');
const aprovarLimite = ref(true);

const colunas: QTableColumn<FichaCreditoRuralDto>[] = [
  { name: 'clienteId', label: 'Cliente ID', field: 'clienteId', align: 'left' },
  { name: 'areaCultura', label: 'Cultura / área', field: 'culturaPrincipal', align: 'left' },
  { name: 'rendaEstimada', label: 'Renda', field: 'rendaEstimada', align: 'right' },
  {
    name: 'endividamentoTotal',
    label: 'Endividamento',
    field: 'endividamentoTotal',
    align: 'right',
  },
  {
    name: 'analiseCreditoId',
    label: 'Análise',
    field: 'analiseCreditoId',
    align: 'left',
  },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(): void {
  Object.assign(form, fichaVazia());
  dialogNova.value = true;
}

function abrirAprovar(ficha: FichaCreditoRuralDto): void {
  fichaAlvo.value = ficha;
  limiteAprovado.value = '';
  aprovarLimite.value = true;
  dialogAprovar.value = true;
}

async function salvar(): Promise<void> {
  if (await criarFicha(form)) dialogNova.value = false;
}

async function confirmarAprovar(): Promise<void> {
  const analiseId = fichaAlvo.value?.analiseCreditoId;
  if (!analiseId) return;
  if (
    await aplicarLimite(analiseId, Number(limiteAprovado.value) || 0, aprovarLimite.value)
  ) {
    dialogAprovar.value = false;
  }
}

onMounted(() => {
  void carregarFichas();
});
</script>

<style scoped>
.painel {
  padding: var(--spacing-4);
}

.dialog {
  min-width: min(480px, 92vw);
}

.dialog--wide {
  min-width: min(720px, 94vw);
}

.titulo {
  margin: 0;
  font-size: var(--font-size-lg);
}
</style>
