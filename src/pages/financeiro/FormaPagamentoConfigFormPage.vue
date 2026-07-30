<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section formas-pagamento-form">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="4" />

        <template v-else>
          <q-form
            ref="formRef"
            greedy
            class="agro-formulario"
            :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.formaPagamento"
                  outlined
                  label="Forma de pagamento"
                  class="field-required"
                  emit-value
                  map-options
                  aria-required="true"
                  :options="FormaPagamentoOpcoes"
                  :rules="[obrigatorio]"
                  :readonly="modo === 'editar' || somenteLeitura"
                />
              </div>
              <div class="col-12 col-md-6 formas-pagamento-form__toggle">
                <q-toggle
                  v-model="formulario.repassarTaxaCliente"
                  label="Repassar taxa ao cliente"
                  :disable="somenteLeitura"
                />
              </div>
            </div>
          </q-form>

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar sem salvar"
              :disable="salvando"
              @click="voltar"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              :loading="salvando"
              @click="salvar"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar para a listagem" @click="voltar" />
          </div>
        </template>
      </agro-card>

      <agro-card v-if="(modo === 'editar' || modo === 'visualizar') && config">
        <template #header>
          <div class="formas-pagamento-form__taxas-header">
            <h3 class="formas-pagamento-form__titulo">Taxas por parcelas</h3>
            <agro-btn
              v-if="!somenteLeitura"
              color="primary"
              unelevated
              icon="add"
              label="Adicionar taxa"
              descricao="Definir taxa para número de parcelas"
              @click="abrirTaxa"
            />
          </div>
        </template>

        <empty-state
          v-if="config.taxas.length === 0"
          titulo="Nenhuma taxa cadastrada"
          descricao="Adicione taxas percentuais e fixas por quantidade de parcelas."
          icon="percent"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          hide-pagination
          :rows="config.taxas"
          :columns="somenteLeitura ? colunasTaxasSemAcoes : colunasTaxas"
          :pagination="{ rowsPerPage: 0 }"
        >
          <template #body-cell-taxaPercentual="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.taxaPercentual) }}%
            </q-td>
          </template>

          <template #body-cell-taxaFixa="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.taxaFixa) }}
            </q-td>
          </template>

          <template v-if="!somenteLeitura" #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-visualizar="false"
                :mostrar-status="false"
                :mostrar-excluir="false"
                editar-label="Editar taxa"
                @editar="abrirTaxa(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogTaxaAberto" persistent>
      <q-card class="formas-pagamento-form__dialog">
        <q-card-section>
          <h4 class="formas-pagamento-form__titulo">Taxa por parcelas</h4>
        </q-card-section>
        <q-card-section>
          <q-form ref="taxaFormRef" greedy>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="taxaForm.parcelas"
                  outlined
                  label="Parcelas"
                  class="field-required"
                  type="number"
                  min="1"
                  step="1"
                  aria-required="true"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="taxaForm.taxaPercentual"
                  outlined
                  label="Taxa %"
                  class="field-required"
                  type="number"
                  min="0"
                  step="0.01"
                  aria-required="true"
                  :rules="[quantidadeNaoNegativa]"
                />
              </div>
              <div class="col-12 col-md-6">
                <AgroMoneyInput
                  v-model="taxaForm.taxaFixa"
                  label="Taxa fixa"
                  class="field-required"
                  aria-required="true"
                  :rules="[quantidadeNaoNegativa]"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogTaxaAberto = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Salvar taxa"
            :loading="salvando"
            @click="salvarTaxaDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFormasPagamentoConfig } from 'composables/useFormasPagamentoConfig';
import { FormaPagamentoOpcoes } from 'constants/enums';
import type { QForm, QTableColumn } from 'quasar';
import type {
  ConfigFormaPagamentoFormModel,
  TaxaFormaPagamentoDto,
  TaxaFormaPagamentoFormModel,
} from 'types/dtos/financeiro.dto';
import { formatarDecimal, formatarMoeda, formatarMoedaParaInput } from 'utils/formatters';
import {
  criarConfigFormaPagamentoFormVazio,
  criarTaxaFormVazia,
} from 'utils/mappers/financeiro.mapper';
import { obrigatorio, quantidadeNaoNegativa } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  config,
  carregando,
  salvando,
  obter,
  criar,
  editar,
  salvarTaxa,
} = useFormasPagamentoConfig();

const formRef = ref<QForm | null>(null);
const taxaFormRef = ref<QForm | null>(null);
const formulario = ref<ConfigFormaPagamentoFormModel>(criarConfigFormaPagamentoFormVazio());
const taxaForm = ref<TaxaFormaPagamentoFormModel>(criarTaxaFormVazia());
const dialogTaxaAberto = ref(false);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'forma-pagamento-config-visualizar') {
    return 'visualizar';
  }

  return route.name === 'forma-pagamento-config-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');

const configId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova forma de pagamento';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar forma de pagamento';
  }

  return 'Editar forma de pagamento';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre a forma e defina se a taxa será repassada ao cliente.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte a forma de pagamento e as taxas por parcelas.';
  }

  return 'Atualize o repasse e gerencie as taxas por parcelas.';
});

const colunasTaxas: QTableColumn<TaxaFormaPagamentoDto>[] = [
  { name: 'parcelas', label: 'Parcelas', field: 'parcelas', align: 'left' },
  { name: 'taxaPercentual', label: 'Taxa %', field: 'taxaPercentual', align: 'right' },
  { name: 'taxaFixa', label: 'Taxa fixa', field: 'taxaFixa', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const colunasTaxasSemAcoes: QTableColumn<TaxaFormaPagamentoDto>[] = [
  { name: 'parcelas', label: 'Parcelas', field: 'parcelas', align: 'left' },
  { name: 'taxaPercentual', label: 'Taxa %', field: 'taxaPercentual', align: 'right' },
  { name: 'taxaFixa', label: 'Taxa fixa', field: 'taxaFixa', align: 'right' },
];

function voltar(): void {
  void router.push({ name: 'formas-pagamento-config' });
}

function abrirTaxa(taxa?: TaxaFormaPagamentoDto): void {
  if (taxa) {
    taxaForm.value = {
      parcelas: String(taxa.parcelas),
      taxaPercentual: String(taxa.taxaPercentual),
      taxaFixa: formatarMoedaParaInput(taxa.taxaFixa),
    };
  } else {
    taxaForm.value = criarTaxaFormVazia();
  }

  dialogTaxaAberto.value = true;
}

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  const valido = (await formRef.value?.validate()) ?? false;

  if (!valido) {
    return;
  }

  if (modo.value === 'criar') {
    const criado = await criar(formulario.value);

    if (criado) {
      await router.replace({
        name: 'forma-pagamento-config-editar',
        params: { id: criado.id },
      });
    }

    return;
  }

  if (configId.value) {
    await editar(configId.value, formulario.value);
  }
}

async function salvarTaxaDialog(): Promise<void> {
  const valido = (await taxaFormRef.value?.validate()) ?? false;

  if (!valido || !configId.value) {
    return;
  }

  const ok = await salvarTaxa(configId.value, taxaForm.value);

  if (ok) {
    dialogTaxaAberto.value = false;
  }
}

onMounted(async () => {
  carregandoPagina.value = true;

  if ((modo.value === 'editar' || modo.value === 'visualizar') && configId.value) {
    const ok = await obter(configId.value);

    if (!ok || !config.value) {
      await router.replace({ name: 'formas-pagamento-config' });
      return;
    }

    formulario.value = {
      formaPagamento: config.value.formaPagamento,
      repassarTaxaCliente: config.value.repassarTaxaCliente,
    };
  } else {
    formulario.value = criarConfigFormaPagamentoFormVazio();
  }

  carregandoPagina.value = false;
});
</script>

<style scoped>
.formas-pagamento-form {
  display: grid;
  gap: var(--spacing-6);
}

.formas-pagamento-form__toggle {
  align-items: center;
  display: flex;
}

.formas-pagamento-form__taxas-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.formas-pagamento-form__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.formas-pagamento-form__dialog {
  min-width: min(420px, 90vw);
  width: 100%;
}
</style>
