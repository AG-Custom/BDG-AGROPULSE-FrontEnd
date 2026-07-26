<template>
  <agro-card class="produto-conversoes">
    <template #header>
      <div class="produto-conversoes__header">
        <h3 class="produto-conversoes__titulo">Conversões de unidade</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar conversão"
          descricao="Cadastrar conversão entre unidades de medida"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <empty-state
      v-if="conversoes.length === 0"
      titulo="Nenhuma conversão cadastrada"
      descricao="Configure fatores de conversão entre unidades de medida."
      icon="swap_horiz"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="produto-conversoes__tabela"
      :rows="conversoes"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-unidadeOrigemId="cell">
        <q-td :props="cell">
          {{ rotuloUnidadeMedidaPorId(cell.row.unidadeOrigemId) }}
        </q-td>
      </template>

      <template #body-cell-unidadeDestinoId="cell">
        <q-td :props="cell">
          {{ rotuloUnidadeMedidaPorId(cell.row.unidadeDestinoId) }}
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="cell">
        <q-td :props="cell" class="produto-conversoes__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            mostrar-excluir
            :loading-excluir="removendo"
            editar-label="Editar fator de conversão"
            excluir-label="Remover conversão"
            @editar="abrirDialogEditar(cell.row)"
            @excluir="solicitarRemocao(cell.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="produto-conversoes__dialog">
        <q-card-section>
          <h4 class="produto-conversoes__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Nova conversão' : 'Editar conversão' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <conversao-unidade-formulario
            v-if="modoDialog === 'criar'"
            ref="formularioRef"
            modo="criar"
            v-model:formulario-criar="formCriar"
          />
          <conversao-unidade-formulario
            v-else
            ref="formularioRef"
            modo="editar"
            v-model:formulario-editar="formEditar"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar sem salvar" :disable="salvando" @click="fecharDialog" />
          <agro-btn
            color="primary"
            unelevated
            :label="modoDialog === 'criar' ? 'Adicionar' : 'Salvar'"
            :loading="salvando"
            @click="salvarConversao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import ConversaoUnidadeFormulario from 'components/produtos/ConversaoUnidadeFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useProdutoConversoes } from 'composables/useProdutoConversoes';
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import type {
  ProdutoConversaoEdicaoFormModel,
  ProdutoConversaoUnidadeDto,
} from 'types/dtos/produto.dto';
import {
  conversaoDtoParaEdicaoForm,
  criarConversaoFormVazio,
} from 'utils/mappers/produto.mapper';
import type { QTableColumn } from 'quasar';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  produtoId?: string;
  somenteLeitura?: boolean;
}>();

const conversoes = defineModel<ProdutoConversaoUnidadeDto[]>('conversoes', { required: true });

const {
  salvando,
  removendo,
  definirConversoes,
  adicionar,
  editar,
  solicitarRemocao,
  conversoes: conversoesInternas,
} = useProdutoConversoes(() => props.produtoId);

const {
  unidadesMedida,
  carregar: carregarUnidadesMedida,
  rotuloUnidadeMedida,
} = useUnidadesMedida();

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const conversaoEmEdicaoId = ref<string | null>(null);
const formCriar = ref(criarConversaoFormVazio());
const formEditar = ref<ProdutoConversaoEdicaoFormModel>({ fatorConversao: '' });
const formularioRef = ref<InstanceType<typeof ConversaoUnidadeFormulario> | null>(null);
const sincronizando = ref(false);

const colunas = computed(() => {
  const base: QTableColumn<ProdutoConversaoUnidadeDto>[] = [
  { name: 'unidadeOrigemId', label: 'Origem', field: 'unidadeOrigemId', align: 'left' },
  { name: 'unidadeDestinoId', label: 'Destino', field: 'unidadeDestinoId', align: 'left' },
  { name: 'fatorConversao', label: 'Fator', field: 'fatorConversao', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }
  return base;
});

watch(
  conversoes,
  (lista) => {
    if (sincronizando.value) {
      return;
    }

    definirConversoes(lista);
  },
  { immediate: true },
);

watch(
  conversoesInternas,
  async (lista) => {
    sincronizando.value = true;
    conversoes.value = [...lista];
    await nextTick();
    sincronizando.value = false;
  },
);

function rotuloUnidadeMedidaPorId(unidadeId: string): string {
  const unidade = unidadesMedida.value.find((item) => item.id === unidadeId);
  return unidade ? rotuloUnidadeMedida(unidade) : unidadeId;
}

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  conversaoEmEdicaoId.value = null;
  formCriar.value = criarConversaoFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(conversao: ProdutoConversaoUnidadeDto): void {
  modoDialog.value = 'editar';
  conversaoEmEdicaoId.value = conversao.id;
  formEditar.value = conversaoDtoParaEdicaoForm(conversao);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvarConversao(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modoDialog.value === 'criar'
      ? await adicionar(formCriar.value)
      : await editar(conversaoEmEdicaoId.value!, formEditar.value);

  if (sucesso) {
    fecharDialog();
  }
}

onMounted(() => {
  void carregarUnidadesMedida({ ativo: true });
});
</script>

<style scoped>
.produto-conversoes__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.produto-conversoes__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.produto-conversoes__acoes {
  white-space: nowrap;
}

.produto-conversoes__dialog {
  min-width: min(520px, 90vw);
  width: 100%;
}

.produto-conversoes__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
