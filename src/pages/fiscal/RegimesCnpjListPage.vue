<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Regimes por CNPJ"
      subtitulo="Regime tributário com vigência por CNPJ da empresa."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo regime"
        descricao="Cadastrar regime"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && regimes.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && regimes.length === 0"
          titulo="Nenhum regime"
          descricao="Cadastre regimes tributários por CNPJ."
          icon="business"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="regimes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-cnpjEmpresaId="props">
            <q-td :props="props">
              {{ mapaCnpjs.get(props.row.cnpjEmpresaId) ?? props.row.cnpjEmpresaId }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-status="false"
                @editar="abrirDialog(props.row)"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ somenteLeitura ? 'Visualizar regime' : editandoId ? 'Editar regime' : 'Novo regime por CNPJ' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <agro-select-cadastro
                  v-model="form.cnpjEmpresaId"
                  entidade="cnpj"
                  label="CNPJ empresa"
                  class="field-required"
                  :options="cnpjOpcoes"
                  :loading="carregandoCnpjs"
                  :rules="[obrigatorio]"
                  :readonly="somenteLeitura"
                  @atualizar="carregarCnpjs()"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.regime"
                  outlined
                  emit-value
                  map-options
                  label="Regime"
                  class="field-required"
                  :options="RegimeTributarioOpcoes"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="form.vigenciaInicio"
                  outlined
                  type="date"
                  label="Vigência início"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-3">
                <q-input v-model="form.vigenciaFim" outlined type="date" label="Vigência fim" :readonly="somenteLeitura" />
              </div>
            </div>
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="dialog = false" />
              </template>
              <template v-else>
                <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
                <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
              </template>
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
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCnpjs } from 'composables/useCnpjs';
import { useRegimesCnpj } from 'composables/useRegimesCnpj';
import { RegimeTributarioOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  RegimeTributarioCnpjDto,
  RegimeTributarioCnpjFormModel,
} from 'types/dtos/fiscal-gestao.dto';
import { formatarCnpj } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const { regimes, carregando, salvando, carregar, criar, editar } = useRegimesCnpj();
const { cnpjs, carregando: carregandoCnpjs, carregar: carregarCnpjs } = useCnpjs();
const dialog = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const form = ref<RegimeTributarioCnpjFormModel>({
  cnpjEmpresaId: '',
  regime: '',
  vigenciaInicio: '',
  vigenciaFim: '',
});

const cnpjOpcoes = computed(() =>
  cnpjs.value.map((c) => ({
    label: `${formatarCnpj(c.numero)} — ${c.razaoSocial}`,
    value: c.id,
  })),
);

const mapaCnpjs = computed(() => {
  const m = new Map<string, string>();
  for (const c of cnpjs.value) m.set(c.id, `${formatarCnpj(c.numero)} — ${c.razaoSocial}`);
  return m;
});

const colunas: QTableColumn<RegimeTributarioCnpjDto>[] = [
  { name: 'cnpjEmpresaId', label: 'CNPJ', field: 'cnpjEmpresaId', align: 'left' },
  { name: 'regime', label: 'Regime', field: 'regime', align: 'left' },
  { name: 'vigenciaInicio', label: 'Início', field: 'vigenciaInicio', align: 'left' },
  { name: 'vigenciaFim', label: 'Fim', field: 'vigenciaFim', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(item?: RegimeTributarioCnpjDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  form.value = {
    cnpjEmpresaId: item?.cnpjEmpresaId ?? '',
    regime: (item?.regime as RegimeTributarioCnpjFormModel['regime']) ?? '',
    vigenciaInicio: item?.vigenciaInicio ?? '',
    vigenciaFim: item?.vigenciaFim ?? '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, form.value)
    : await criar(form.value);
  if (ok) dialog.value = false;
}

function abrirDialogVisualizar(item: RegimeTributarioCnpjDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

onMounted(() => {
  void carregar();
  void carregarCnpjs();
});
</script>

<style scoped>
.dialog {
  min-width: min(520px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
