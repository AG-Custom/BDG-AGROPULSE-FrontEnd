<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Regras de comissão"
      subtitulo="Percentual por canal de venda."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova regra"
        descricao="Cadastrar regra de comissão"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroAtivo"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            class="filtro"
            :options="statusOpcoes"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Recarregar regras de comissão"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && regras.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && regras.length === 0"
          titulo="Nenhuma regra cadastrada"
          descricao="Cadastre regras por canal para aplicar comissão no pedido."
          icon="percent"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova regra"
            descricao="Cadastrar regra de comissão"
            @click="abrirDialog()"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="regras"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-canal="props">
            <q-td :props="props">
              {{ rotuloCanal(props.row.canal) }}
            </q-td>
          </template>

          <template #body-cell-percentual="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.percentual) }}%
            </q-td>
          </template>

          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativa' : 'Inativa'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :mostrar-status="false"
                mostrar-excluir
                @editar="abrirDialog(props.row)"
                @visualizar="abrirDialogVisualizar(props.row)"
                @excluir="confirmarExclusao(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ tituloDialog }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form
            greedy
            class="agro-formulario"
            :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
            @submit.prevent="salvar"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="formulario.canal"
                  outlined
                  label="Canal de venda"
                  hint="Vazio = aplica a todos os canais"
                  emit-value
                  map-options
                  clearable
                  :options="CanalVendaOpcoes"
                  :readonly="somenteLeitura"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.percentual"
                  outlined
                  label="Comissão %"
                  class="field-required"
                  type="number"
                  min="0"
                  step="0.01"
                  aria-required="true"
                  :rules="[obrigatorio, percentualZeroACem]"
                  :readonly="somenteLeitura"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="fecharDialog" />
              </template>
              <template v-else>
                <agro-btn
                  flat
                  label="Cancelar"
                  descricao="Fechar sem salvar"
                  :disable="salvando"
                  @click="fecharDialog"
                />
                <agro-btn
                  color="primary"
                  unelevated
                  :label="editandoId ? 'Salvar' : 'Cadastrar'"
                  type="submit"
                  :loading="salvando"
                />
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
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import {
  formVazioRegraComissao,
  regraComissaoParaForm,
  useRegrasComissao,
} from 'composables/useRegrasComissao';
import { CanalVendaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RegraComissaoDto, RegraComissaoFormModel } from 'types/dtos/regra-comissao.dto';
import { formatarDecimal } from 'utils/formatters';
import { obrigatorio, percentualZeroACem } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const { regras, carregando, salvando, carregar, criar, editar, excluir } = useRegrasComissao();
const filtroAtivo = ref<boolean | null>(true);
const dialogAberto = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<RegraComissaoFormModel>(formVazioRegraComissao());

const statusOpcoes = [
  { label: 'Ativas', value: true },
  { label: 'Inativas', value: false },
];

const tituloDialog = computed(() => {
  if (somenteLeitura.value) {
    return 'Visualizar regra de comissão';
  }
  return editandoId.value ? 'Editar regra de comissão' : 'Nova regra de comissão';
});

const colunas: QTableColumn<RegraComissaoDto>[] = [
  { name: 'canal', label: 'Canal', field: 'canal', align: 'left' },
  { name: 'percentual', label: 'Comissão %', field: 'percentual', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCanal(canal: string | null): string {
  if (!canal) {
    return 'Todos';
  }

  return CanalVendaOpcoes.find((opcao) => opcao.value === canal)?.label ?? canal;
}

async function recarregar(): Promise<void> {
  await carregar({
    ativo: filtroAtivo.value === null ? undefined : filtroAtivo.value,
  });
}

function abrirDialog(item?: RegraComissaoDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = item ? regraComissaoParaForm(item) : formVazioRegraComissao();
  dialogAberto.value = true;
}

function abrirDialogVisualizar(item: RegraComissaoDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);

  if (ok) {
    fecharDialog();
    await recarregar();
  }
}

async function confirmarExclusao(id: string): Promise<void> {
  if (await excluir(id)) {
    await recarregar();
  }
}

watch(filtroAtivo, () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.filtro {
  min-width: 180px;
}

.acoes {
  white-space: nowrap;
}

.dialog {
  min-width: min(480px, 94vw);
  max-width: 560px;
}

.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
