<template>
  <agro-card class="fornecedor-avaliacoes">
    <template #header>
      <div class="fornecedor-avaliacoes__header">
        <h3 class="fornecedor-avaliacoes__titulo">Avaliações</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Nova avaliação"
          descricao="Registrar nova avaliação do fornecedor"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <fornecedor-avaliacoes-resumo-card
      :resumo="resumo"
      :carregando="carregandoResumo"
    />

    <empty-state
      v-if="avaliacoes.length === 0"
      titulo="Nenhuma avaliação registrada"
      descricao="Registre avaliações de preço, prazo, qualidade e conformidade deste fornecedor."
      icon="star_rate"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="fornecedor-avaliacoes__tabela"
      :rows="avaliacoes"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-notaPreco="props">
        <q-td :props="props">
          <span class="text-metric">{{ props.row.notaPreco }}</span>
        </q-td>
      </template>

      <template #body-cell-notaPrazo="props">
        <q-td :props="props">
          <span class="text-metric">{{ props.row.notaPrazo }}</span>
        </q-td>
      </template>

      <template #body-cell-notaQualidade="props">
        <q-td :props="props">
          <span class="text-metric">{{ props.row.notaQualidade }}</span>
        </q-td>
      </template>

      <template #body-cell-notaConformidade="props">
        <q-td :props="props">
          <span class="text-metric">{{ props.row.notaConformidade }}</span>
        </q-td>
      </template>

      <template #body-cell-media="props">
        <q-td :props="props">
          <span class="text-metric">{{ formatarMedia(props.row) }}</span>
        </q-td>
      </template>

      <template #body-cell-observacao="props">
        <q-td :props="props">
          {{ props.row.observacao || '—' }}
        </q-td>
      </template>

      <template #body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatarDataHora(props.row.createdAt) }}
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="props">
        <q-td :props="props" class="fornecedor-avaliacoes__acoes">
          <agro-btn
            flat
            round
            dense
            icon="edit"
            color="primary"
            descricao="Editar avaliação"
            @click="abrirDialogEditar(props.row)"
          />
          <agro-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            descricao="Remover avaliação"
            :loading="removendo"
            @click="solicitarRemocao(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="fornecedor-avaliacoes__dialog">
        <q-card-section>
          <h4 class="fornecedor-avaliacoes__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Nova avaliação' : 'Editar avaliação' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <avaliacao-fornecedor-formulario
            ref="formularioRef"
            v-model:formulario="formAvaliacao"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem salvar a avaliação"
            :disable="salvando"
            @click="fecharDialog"
          />
          <agro-btn
            color="primary"
            unelevated
            :label="modoDialog === 'criar' ? 'Registrar' : 'Salvar'"
            :descricao="
              modoDialog === 'criar'
                ? 'Registrar avaliação do fornecedor'
                : 'Salvar alterações da avaliação'
            "
            :loading="salvando"
            @click="salvarAvaliacao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import AvaliacaoFornecedorFormulario from 'components/fornecedores/AvaliacaoFornecedorFormulario.vue';
import FornecedorAvaliacoesResumoCard from 'components/fornecedores/FornecedorAvaliacoesResumoCard.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFornecedorAvaliacoes } from 'composables/useFornecedorAvaliacoes';
import type { QTableColumn } from 'quasar';
import type { AvaliacaoFornecedorDto } from 'types/dtos/fornecedor.dto';
import { formatarDataHora } from 'utils/formatters';
import {
  avaliacaoDtoParaForm,
  criarAvaliacaoFormVazia,
} from 'utils/mappers/fornecedor.mapper';
import { computed, onMounted, ref, toRef, watch } from 'vue';

const props = defineProps<{
  fornecedorId: string;
  avaliacoesIniciais: AvaliacaoFornecedorDto[];
  somenteLeitura?: boolean;
}>();

const {
  avaliacoes,
  resumo,
  carregandoResumo,
  salvando,
  removendo,
  definirAvaliacoes,
  carregarResumo,
  adicionar,
  editar,
  solicitarRemocao,
} = useFornecedorAvaliacoes(() => props.fornecedorId);

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const avaliacaoEmEdicaoId = ref<string | null>(null);
const formAvaliacao = ref(criarAvaliacaoFormVazia());
const formularioRef = ref<InstanceType<typeof AvaliacaoFornecedorFormulario> | null>(null);

const colunas = computed(() => {
  const base: QTableColumn<AvaliacaoFornecedorDto>[] = [
    { name: 'createdAt', label: 'Data', field: 'createdAt', align: 'left', sortable: true },
    { name: 'notaPreco', label: 'Preço', field: 'notaPreco', align: 'center', sortable: true },
    { name: 'notaPrazo', label: 'Prazo', field: 'notaPrazo', align: 'center', sortable: true },
    {
      name: 'notaQualidade',
      label: 'Qualidade',
      field: 'notaQualidade',
      align: 'center',
      sortable: true,
    },
    {
      name: 'notaConformidade',
      label: 'Conformidade',
      field: 'notaConformidade',
      align: 'center',
      sortable: true,
    },
    {
      name: 'media',
      label: 'Média',
      field: (row) => mediaAvaliacao(row),
      align: 'center',
      sortable: true,
    },
    { name: 'observacao', label: 'Observação', field: 'observacao', align: 'left' },
    { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
  ];

  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }

  return base;
});

watch(
  toRef(props, 'avaliacoesIniciais'),
  (lista) => {
    definirAvaliacoes(lista);
  },
  { immediate: true },
);

function mediaAvaliacao(avaliacao: AvaliacaoFornecedorDto): number {
  return (
    (avaliacao.notaPreco +
      avaliacao.notaPrazo +
      avaliacao.notaQualidade +
      avaliacao.notaConformidade) /
    4
  );
}

function formatarMedia(avaliacao: AvaliacaoFornecedorDto): string {
  return mediaAvaliacao(avaliacao).toFixed(1).replace('.', ',');
}

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  avaliacaoEmEdicaoId.value = null;
  formAvaliacao.value = criarAvaliacaoFormVazia();
  dialogAberto.value = true;
}

function abrirDialogEditar(avaliacao: AvaliacaoFornecedorDto): void {
  modoDialog.value = 'editar';
  avaliacaoEmEdicaoId.value = avaliacao.id;
  formAvaliacao.value = avaliacaoDtoParaForm(avaliacao);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvarAvaliacao(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modoDialog.value === 'criar'
      ? await adicionar(formAvaliacao.value)
      : await editar(avaliacaoEmEdicaoId.value!, formAvaliacao.value);

  if (sucesso) {
    fecharDialog();
  }
}

onMounted(() => {
  void carregarResumo();
});
</script>

<style scoped>
.fornecedor-avaliacoes__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.fornecedor-avaliacoes__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.fornecedor-avaliacoes__acoes {
  white-space: nowrap;
}

.fornecedor-avaliacoes__dialog {
  min-width: min(480px, 90vw);
  width: 100%;
}

.fornecedor-avaliacoes__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
