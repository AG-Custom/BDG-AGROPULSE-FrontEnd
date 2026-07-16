<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Lotes"
      subtitulo="Consulte os lotes de estoque da unidade operacional atual."
    />

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
            class="estoque-lotes__produto"
            :options="produtoOpcoes"
            :loading="carregandoProdutos"
          />

          <q-toggle
            v-model="apenasComSaldo"
            label="Somente com saldo"
            dense
          />
        </div>

        <agro-table-skeleton v-if="carregando && lotes.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && lotes.length === 0"
          titulo="Nenhum lote encontrado"
          :descricao="descricaoVazia"
          icon="qr_code_2"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="estoque-lotes__tabela"
          :rows="lotes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoId="props">
            <q-td :props="props">
              {{ rotuloProduto(props.row.produtoId) }}
            </q-td>
          </template>

          <template #body-cell-quantidade="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</span>
            </q-td>
          </template>

          <template #body-cell-custoUnitario="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.custoUnitario) }}</span>
            </q-td>
          </template>

          <template #body-cell-dataValidade="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataValidade) }}
            </q-td>
          </template>

          <template #body-cell-dataFabricacao="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataFabricacao) }}
            </q-td>
          </template>

          <template #body-cell-localizacao="props">
            <q-td :props="props">
              {{ formatarLocalizacao(props.row) }}
            </q-td>
          </template>

          <template #body-cell-notaFiscalOrigemId="props">
            <q-td :props="props">
              {{ props.row.notaFiscalOrigemId ? props.row.notaFiscalOrigemId.slice(0, 8) + '…' : '—' }}
            </q-td>
          </template>

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
                round
                dense
                icon="account_tree"
                color="primary"
                descricao="Genealogia do lote"
                @click="abrirGenealogia(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogGenealogia">
      <q-card class="dialog-genealogia">
        <q-card-section>
          <h4 class="titulo">Genealogia — {{ loteSelecionado?.numeroLote }}</h4>
        </q-card-section>
        <q-card-section>
          <agro-form-skeleton v-if="carregandoGenealogia" :campos="3" />
          <template v-else-if="genealogia">
            <h5 class="subtitulo">Lotes pai (origem)</h5>
            <empty-state
              v-if="genealogia.pais.length === 0"
              titulo="Sem origem"
              descricao="Nenhum vínculo de matéria-prima."
              icon="account_tree"
            />
            <q-list v-else bordered separator>
              <q-item v-for="v in genealogia.pais" :key="v.id">
                <q-item-section>
                  <q-item-label>{{ v.lotePaiId.slice(0, 8) }}…</q-item-label>
                  <q-item-label caption>
                    {{ v.origem }} · qtd {{ formatarDecimal(v.quantidade) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <h5 class="subtitulo">Lotes filhos (derivados)</h5>
            <empty-state
              v-if="genealogia.filhos.length === 0"
              titulo="Sem derivados"
              descricao="Nenhum lote gerado a partir deste."
              icon="account_tree"
            />
            <q-list v-else bordered separator>
              <q-item v-for="v in genealogia.filhos" :key="v.id">
                <q-item-section>
                  <q-item-label>{{ v.loteFilhoId.slice(0, 8) }}…</q-item-label>
                  <q-item-label caption>
                    {{ v.origem }} · qtd {{ formatarDecimal(v.quantidade) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogGenealogia = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QTableColumn } from 'quasar';
import type { LoteDto } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';

const { lotes, genealogia, carregando, carregandoGenealogia, carregar, obterGenealogia } =
  useEstoqueLotes();
const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  rotuloProduto,
} = useProdutoOpcoesEstoque();

const filtroProduto = ref<string | null>(null);
const apenasComSaldo = ref(true);
const dialogGenealogia = ref(false);
const loteSelecionado = ref<LoteDto | null>(null);

const colunas: QTableColumn<LoteDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
  { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left', sortable: true },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right', sortable: true },
  {
    name: 'custoUnitario',
    label: 'Custo unitário',
    field: 'custoUnitario',
    align: 'right',
    sortable: true,
  },
  {
    name: 'dataValidade',
    label: 'Validade',
    field: 'dataValidade',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dataFabricacao',
    label: 'Fabricação',
    field: 'dataFabricacao',
    align: 'left',
    sortable: true,
  },
  {
    name: 'localizacao',
    label: 'Localização',
    field: 'deposito',
    align: 'left',
  },
  {
    name: 'notaFiscalOrigemId',
    label: 'NF origem',
    field: 'notaFiscalOrigemId',
    align: 'left',
  },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() =>
  filtroProduto.value || apenasComSaldo.value
    ? 'Nenhum lote corresponde aos filtros aplicados.'
    : 'Ainda não há lotes cadastrados nesta unidade.',
);

function formatarLocalizacao(lote: LoteDto): string {
  const partes = [lote.galpao, lote.deposito, lote.corredor, lote.prateleira].filter(
    (parte) => !!parte?.trim(),
  );
  return partes.length > 0 ? partes.join(' / ') : '—';
}

async function abrirGenealogia(lote: LoteDto): Promise<void> {
  loteSelecionado.value = lote;
  dialogGenealogia.value = true;
  await obterGenealogia(lote.id);
}

async function recarregar(): Promise<void> {
  await carregar({
    produtoId: filtroProduto.value || undefined,
    apenasComSaldo: apenasComSaldo.value,
  });
}

watch([filtroProduto, apenasComSaldo], () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.estoque-lotes__produto {
  min-width: min(320px, 100%);
}
.dialog-genealogia {
  min-width: min(440px, 92vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
}
.subtitulo {
  margin: var(--spacing-4) 0 var(--spacing-2);
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
</style>
