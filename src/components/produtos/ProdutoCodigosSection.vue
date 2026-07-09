<template>
  <agro-card class="produto-codigos">
    <template #header>
      <div class="produto-codigos__header">
        <h3 class="produto-codigos__titulo">Códigos</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar código"
          descricao="Cadastrar novo código do produto"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <empty-state
      v-if="codigos.length === 0"
      titulo="Nenhum código cadastrado"
      descricao="Adicione códigos SKU, EAN ou alternativos."
      icon="qr_code"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="produto-codigos__tabela"
      :rows="codigos"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-tipo="cell">
        <q-td :props="cell">
          {{ rotuloTipo(cell.row.tipo) }}
        </q-td>
      </template>

      <template #body-cell-principal="cell">
        <q-td :props="cell">
          <agro-badge v-if="cell.row.principal" label="Principal" variant="accent" />
          <span v-else class="text-secondary">—</span>
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="cell">
        <q-td :props="cell" class="produto-codigos__acoes">
          <agro-btn
            flat
            round
            dense
            icon="edit"
            color="primary"
            descricao="Editar código"
            @click="abrirDialogEditar(cell.row)"
          />
          <agro-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            descricao="Remover código"
            :loading="removendo"
            @click="aoRemover(cell.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="produto-codigos__dialog">
        <q-card-section>
          <h4 class="produto-codigos__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Novo código' : 'Editar código' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <codigo-produto-formulario ref="formularioRef" v-model:formulario="formCodigo" />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar sem salvar" :disable="salvando" @click="fecharDialog" />
          <agro-btn
            color="primary"
            unelevated
            :label="modoDialog === 'criar' ? 'Adicionar' : 'Salvar'"
            :loading="salvando"
            @click="salvarCodigo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import CodigoProdutoFormulario from 'components/produtos/CodigoProdutoFormulario.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { TipoCodigoProdutoOpcoes } from 'constants/enums';
import type { TipoCodigoProdutoValor } from 'constants/enums';
import { useProdutoCodigos } from 'composables/useProdutoCodigos';
import type { ProdutoCodigoDto } from 'types/dtos/produto.dto';
import { codigoDtoParaForm, criarCodigoFormVazio } from 'utils/mappers/produto.mapper';
import type { QTableColumn } from 'quasar';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  produtoId?: string;
  somenteLeitura?: boolean;
}>();

const codigos = defineModel<ProdutoCodigoDto[]>('codigos', { required: true });

const {
  salvando,
  removendo,
  definirCodigos,
  adicionar,
  editar,
  solicitarRemocao,
  codigos: codigosInternos,
} = useProdutoCodigos(() => props.produtoId);

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const codigoEmEdicaoId = ref<string | null>(null);
const formCodigo = ref(criarCodigoFormVazio());
const formularioRef = ref<InstanceType<typeof CodigoProdutoFormulario> | null>(null);
const sincronizando = ref(false);

const colunas = computed(() => {
  const base: QTableColumn<ProdutoCodigoDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'left', sortable: true },
  { name: 'principal', label: 'Principal', field: 'principal', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }
  return base;
});

watch(
  codigos,
  (lista) => {
    if (sincronizando.value) {
      return;
    }

    definirCodigos(lista);
  },
  { immediate: true, deep: true },
);

watch(
  codigosInternos,
  (lista) => {
    sincronizando.value = true;
    codigos.value = [...lista];
    sincronizando.value = false;
  },
  { deep: true },
);

function rotuloTipo(tipo: TipoCodigoProdutoValor): string {
  return TipoCodigoProdutoOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  codigoEmEdicaoId.value = null;
  formCodigo.value = criarCodigoFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(codigo: ProdutoCodigoDto): void {
  modoDialog.value = 'editar';
  codigoEmEdicaoId.value = codigo.id;
  formCodigo.value = codigoDtoParaForm(codigo);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function aoRemover(codigo: ProdutoCodigoDto): Promise<void> {
  await solicitarRemocao(codigo);
}

async function salvarCodigo(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modoDialog.value === 'criar'
      ? await adicionar(formCodigo.value)
      : await editar(codigoEmEdicaoId.value!, formCodigo.value);

  if (sucesso) {
    fecharDialog();
  }
}
</script>

<style scoped>
.produto-codigos__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.produto-codigos__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.produto-codigos__acoes {
  white-space: nowrap;
}

.produto-codigos__dialog {
  min-width: min(480px, 90vw);
  width: 100%;
}

.produto-codigos__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
