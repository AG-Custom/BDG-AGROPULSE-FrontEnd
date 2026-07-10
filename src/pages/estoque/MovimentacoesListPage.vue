<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Movimentações"
      subtitulo="Registre entradas, saídas e ajustes de estoque da unidade atual."
    >
      <div class="estoque-movimentacoes__acoes-header">
        <agro-btn
          color="primary"
          unelevated
          icon="add"
          label="Entrada"
          descricao="Registrar entrada de estoque"
          @click="abrirDialog('entrada')"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="remove"
          label="Saída"
          descricao="Registrar saída de estoque"
          @click="abrirDialog('saida')"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="tune"
          label="Ajuste"
          descricao="Registrar ajuste de lote"
          @click="abrirDialog('ajuste')"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroProduto"
            outlined
            dense
            label="Produto"
            emit-value
            map-options
            clearable
            class="estoque-movimentacoes__produto"
            :options="produtoOpcoes"
            :loading="carregandoProdutos"
          />

          <q-select
            v-model="filtroTipo"
            outlined
            dense
            label="Tipo"
            emit-value
            map-options
            clearable
            class="estoque-movimentacoes__tipo"
            :options="TipoMovimentacaoEstoqueOpcoes"
          />

          <q-select
            v-model="filtroAtalho"
            outlined
            dense
            label="Período"
            emit-value
            map-options
            clearable
            class="estoque-movimentacoes__periodo"
            :options="AtalhoPeriodoEstoqueOpcoes"
          />
        </div>

        <agro-table-skeleton v-if="carregando && movimentacoes.length === 0" :colunas="7" />

        <empty-state
          v-else-if="!carregando && movimentacoes.length === 0"
          titulo="Nenhuma movimentação encontrada"
          :descricao="descricaoVazia"
          icon="swap_vert"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="estoque-movimentacoes__tabela"
          :rows="movimentacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-ocorridoEm="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.ocorridoEm) }}
            </q-td>
          </template>

          <template #body-cell-produtoId="props">
            <q-td :props="props">
              {{ rotuloProduto(props.row.produtoId) }}
            </q-td>
          </template>

          <template #body-cell-tipo="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloTipo(props.row.tipo)"
                :variant="varianteTipo(props.row.tipo)"
              />
            </q-td>
          </template>

          <template #body-cell-origem="props">
            <q-td :props="props">
              {{ rotuloOrigem(props.row.origem) }}
            </q-td>
          </template>

          <template #body-cell-quantidade="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</span>
            </q-td>
          </template>

          <template #body-cell-saldoProdutoApos="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.saldoProdutoApos) }}</span>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="estoque-movimentacoes__dialog">
        <q-card-section>
          <h4 class="estoque-movimentacoes__dialog-titulo">
            {{ tituloDialog }}
          </h4>
        </q-card-section>

        <q-card-section>
          <entrada-estoque-formulario
            v-if="modoDialog === 'entrada'"
            ref="entradaRef"
            v-model:formulario="formEntrada"
          />
          <saida-estoque-formulario
            v-else-if="modoDialog === 'saida'"
            ref="saidaRef"
            v-model:formulario="formSaida"
          />
          <ajuste-estoque-formulario
            v-else
            ref="ajusteRef"
            v-model:formulario="formAjuste"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem salvar a movimentação"
            :disable="salvando"
            @click="fecharDialog"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Registrar"
            descricao="Confirmar movimentação de estoque"
            :loading="salvando"
            @click="salvar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AjusteEstoqueFormulario from 'components/estoque/AjusteEstoqueFormulario.vue';
import EntradaEstoqueFormulario from 'components/estoque/EntradaEstoqueFormulario.vue';
import SaidaEstoqueFormulario from 'components/estoque/SaidaEstoqueFormulario.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useEstoqueMovimentacoes } from 'composables/useEstoqueMovimentacoes';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import {
  AtalhoPeriodoEstoqueOpcoes,
  OrigemMovimentacaoEstoqueOpcoes,
  TipoMovimentacaoEstoque,
  TipoMovimentacaoEstoqueOpcoes,
  type AtalhoPeriodoEstoqueValor,
  type OrigemMovimentacaoEstoqueValor,
  type TipoMovimentacaoEstoqueValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { MovimentacaoEstoqueDto } from 'types/dtos/estoque.dto';
import { formatarDataHora, formatarDecimal } from 'utils/formatters';
import {
  criarAjusteFormVazio,
  criarEntradaFormVazia,
  criarSaidaFormVazia,
} from 'utils/mappers/estoque.mapper';
import { computed, onMounted, ref, watch } from 'vue';

type ModoDialog = 'entrada' | 'saida' | 'ajuste';

const {
  movimentacoes,
  carregando,
  salvando,
  carregar,
  registrarEntrada,
  registrarSaida,
  registrarAjuste,
} = useEstoqueMovimentacoes();

const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  rotuloProduto,
} = useProdutoOpcoesEstoque();

const filtroProduto = ref<string | null>(null);
const filtroTipo = ref<TipoMovimentacaoEstoqueValor | null>(null);
const filtroAtalho = ref<AtalhoPeriodoEstoqueValor | null>(null);

const dialogAberto = ref(false);
const modoDialog = ref<ModoDialog>('entrada');
const formEntrada = ref(criarEntradaFormVazia());
const formSaida = ref(criarSaidaFormVazia());
const formAjuste = ref(criarAjusteFormVazio());
const entradaRef = ref<InstanceType<typeof EntradaEstoqueFormulario> | null>(null);
const saidaRef = ref<InstanceType<typeof SaidaEstoqueFormulario> | null>(null);
const ajusteRef = ref<InstanceType<typeof AjusteEstoqueFormulario> | null>(null);

const colunas: QTableColumn<MovimentacaoEstoqueDto>[] = [
  { name: 'ocorridoEm', label: 'Data', field: 'ocorridoEm', align: 'left', sortable: true },
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'origem', label: 'Origem', field: 'origem', align: 'left', sortable: true },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right', sortable: true },
  {
    name: 'saldoProdutoApos',
    label: 'Saldo após',
    field: 'saldoProdutoApos',
    align: 'right',
    sortable: true,
  },
  {
    name: 'justificativa',
    label: 'Justificativa',
    field: 'justificativa',
    align: 'left',
  },
];

const tituloDialog = computed(() => {
  if (modoDialog.value === 'entrada') {
    return 'Nova entrada';
  }

  if (modoDialog.value === 'saida') {
    return 'Nova saída';
  }

  return 'Novo ajuste';
});

const descricaoVazia = computed(() =>
  filtroProduto.value || filtroTipo.value || filtroAtalho.value
    ? 'Nenhuma movimentação corresponde aos filtros aplicados.'
    : 'Registre a primeira movimentação de estoque desta unidade.',
);

function rotuloTipo(tipo: TipoMovimentacaoEstoqueValor): string {
  return TipoMovimentacaoEstoqueOpcoes.find((item) => item.value === tipo)?.label ?? tipo;
}

function rotuloOrigem(origem: OrigemMovimentacaoEstoqueValor): string {
  return OrigemMovimentacaoEstoqueOpcoes.find((item) => item.value === origem)?.label ?? origem;
}

function varianteTipo(
  tipo: TipoMovimentacaoEstoqueValor,
): 'success' | 'warning' | 'accent' | 'default' {
  if (tipo === TipoMovimentacaoEstoque.Entrada) {
    return 'success';
  }

  if (tipo === TipoMovimentacaoEstoque.Saida) {
    return 'warning';
  }

  return 'accent';
}

async function recarregar(): Promise<void> {
  await carregar({
    produtoId: filtroProduto.value || undefined,
    tipo: filtroTipo.value || undefined,
    atalho: filtroAtalho.value || undefined,
  });
}

function abrirDialog(modo: ModoDialog): void {
  modoDialog.value = modo;
  formEntrada.value = criarEntradaFormVazia();
  formSaida.value = criarSaidaFormVazia();
  formAjuste.value = criarAjusteFormVazio();
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvar(): Promise<void> {
  let valido = false;
  let sucesso = false;

  if (modoDialog.value === 'entrada') {
    valido = (await entradaRef.value?.validar()) ?? false;
    if (valido) {
      sucesso = await registrarEntrada(formEntrada.value);
    }
  } else if (modoDialog.value === 'saida') {
    valido = (await saidaRef.value?.validar()) ?? false;
    if (valido) {
      sucesso = await registrarSaida(formSaida.value);
    }
  } else {
    valido = (await ajusteRef.value?.validar()) ?? false;
    if (valido) {
      sucesso = await registrarAjuste(formAjuste.value);
    }
  }

  if (sucesso) {
    fecharDialog();
  }
}

watch([filtroProduto, filtroTipo, filtroAtalho], () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.estoque-movimentacoes__acoes-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.estoque-movimentacoes__produto,
.estoque-movimentacoes__tipo,
.estoque-movimentacoes__periodo {
  min-width: min(220px, 100%);
}

.estoque-movimentacoes__dialog {
  min-width: min(520px, 90vw);
  width: 100%;
}

.estoque-movimentacoes__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
