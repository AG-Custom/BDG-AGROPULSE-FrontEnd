<template>
  <q-page class="agro-page">
    <app-page-header titulo="Ordem de produção" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.Aberta"
          flat
          icon="edit"
          label="Editar"
          descricao="Editar ordem"
          :to="{ name: 'ordem-producao-editar', params: { id } }"
        />
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.Aberta"
          color="primary"
          unelevated
          label="Iniciar"
          descricao="Iniciar ordem"
          :loading="salvando"
          @click="iniciarOrdem(id)"
        />
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.EmAndamento"
          color="primary"
          unelevated
          label="Concluir"
          descricao="Concluir ordem"
          :loading="salvando"
          @click="abrirConcluir"
        />
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.Aberta || ordem?.status === OrdemProducaoStatus.EmAndamento"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar ordem"
          :loading="salvando"
          @click="cancelarOrdem(id)"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !ordem" :campos="5" />
      <template v-else-if="ordem">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="ordem.status" variant="default" />
            </div>
            <div class="col-md-4">
              <div class="text-caption">Produto saída</div>
              <div>{{ rotuloProduto(ordem.produtoSaidaId) }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">Planejada</div>
              <div class="text-metric">{{ formatarDecimal(ordem.quantidadePlanejada) }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">Produzida</div>
              <div class="text-metric">
                {{ ordem.quantidadeProduzida != null ? formatarDecimal(ordem.quantidadeProduzida) : '—' }}
              </div>
            </div>
          </div>
        </agro-card>

        <agro-card v-if="temCustos">
          <h3 class="titulo-sec">Custos</h3>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Insumos planejado</div>
              <div class="text-metric">{{ moeda(ordem.custoInsumosPlanejado) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Insumos real</div>
              <div class="text-metric">{{ moeda(ordem.custoInsumosReal) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Mão de obra</div>
              <div class="text-metric">{{ moeda(ordem.custoMaoObra) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Overhead</div>
              <div class="text-metric">{{ moeda(ordem.custoOverhead) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Total planejado</div>
              <div class="text-metric">{{ moeda(ordem.custoTotalPlanejado) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Total real</div>
              <div class="text-metric">{{ moeda(ordem.custoTotalReal) }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <h3 class="titulo-sec">Insumos planejados</h3>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="ordem.itens"
            :columns="colunasItens"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoInsumoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoInsumoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
          </q-table>
        </agro-card>

        <agro-card v-if="podeApontar">
          <div class="header">
            <h3 class="titulo-sec">Apontar consumo</h3>
          </div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="consumo.produtoInsumoId"
                outlined
                dense
                label="Insumo"
                emit-value
                map-options
                :options="insumoOpcoes"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="consumo.loteId"
                outlined
                dense
                label="Lote"
                emit-value
                map-options
                clearable
                :options="loteOpcoes"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="consumo.quantidade" outlined dense label="Qtd" type="number" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="consumo.etapa" outlined dense label="Etapa" />
            </div>
            <div class="col-12 col-md-1">
              <agro-btn
                color="primary"
                unelevated
                label="OK"
                descricao="Apontar consumo"
                :loading="salvando"
                @click="salvarConsumo"
              />
            </div>
          </div>
          <q-table
            v-if="(ordem.apontamentosConsumo?.length ?? 0) > 0"
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="ordem.apontamentosConsumo ?? []"
            :columns="colunasConsumo"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoInsumoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoInsumoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
          </q-table>
        </agro-card>

        <agro-card v-if="podeApontar">
          <div class="header">
            <h3 class="titulo-sec">Apontar produção (balança stub)</h3>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <q-input v-model="producaoQtd" outlined dense label="Quantidade" type="number" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="dispositivoId" outlined dense label="Dispositivo (opcional)" />
            </div>
            <div class="col-12 col-md-3">
              <agro-btn
                flat
                label="Ler balança"
                descricao="Stub leitura de peso"
                :loading="lendoPeso"
                @click="lerBalanca"
              />
            </div>
            <div class="col-12 col-md-3">
              <agro-btn
                color="primary"
                unelevated
                label="Apontar"
                descricao="Apontar produção"
                :loading="salvando"
                @click="salvarProducao"
              />
            </div>
          </div>
          <q-table
            v-if="(ordem.apontamentosProducao?.length ?? 0) > 0"
            class="q-mt-md"
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="ordem.apontamentosProducao ?? []"
            :columns="colunasProducao"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
          </q-table>
        </agro-card>
      </template>
      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'ordens-producao' }" />
      </div>
    </section>

    <q-dialog v-model="dialogConcluir" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Concluir ordem</h4></q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="qtdProduzida" outlined label="Quantidade produzida" type="number" />
          </div>
          <div class="col-6">
            <q-input v-model="custoMaoObra" outlined label="Custo mão de obra" type="number" />
          </div>
          <div class="col-6">
            <q-input v-model="custoOverhead" outlined label="Custo overhead" type="number" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogConcluir = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Concluir"
            descricao="Confirmar conclusão"
            :loading="salvando"
            @click="confirmarConcluir"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useEstoqueDispositivos } from 'composables/useEstoqueDispositivos';
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import { OrdemProducaoStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  ApontamentoConsumoDto,
  ApontamentoProducaoDto,
  ItemOrdemProducaoDto,
} from 'types/dtos/producao.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  ordem,
  carregando,
  salvando,
  obterOrdem,
  iniciarOrdem,
  concluirOrdem,
  cancelarOrdem,
  apontarConsumo,
  apontarProducao,
} = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { lotes, carregar: carregarLotes } = useEstoqueLotes();
const { lendoPeso, lerPesoBalanca } = useEstoqueDispositivos();

const id = computed(() => route.params.id as string);
const dialogConcluir = ref(false);
const qtdProduzida = ref('');
const custoMaoObra = ref('');
const custoOverhead = ref('');
const producaoQtd = ref('');
const dispositivoId = ref('');
const consumo = ref({
  produtoInsumoId: '',
  loteId: '',
  quantidade: '',
  etapa: '',
});

const subtitulo = computed(() =>
  ordem.value ? `Status: ${ordem.value.status}` : 'Carregando...',
);

const podeApontar = computed(
  () =>
    ordem.value?.status === OrdemProducaoStatus.Aberta ||
    ordem.value?.status === OrdemProducaoStatus.EmAndamento,
);

const temCustos = computed(
  () =>
    ordem.value?.custoTotalPlanejado != null ||
    ordem.value?.custoTotalReal != null ||
    ordem.value?.custoInsumosPlanejado != null,
);

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});

const insumoOpcoes = computed(() =>
  (ordem.value?.itens ?? []).map((i) => ({
    label: rotuloProduto(i.produtoInsumoId),
    value: i.produtoInsumoId,
  })),
);

const loteOpcoes = computed(() =>
  lotes.value.map((l) => ({
    label: `${l.numeroLote} (${formatarDecimal(l.quantidade)})`,
    value: l.id,
  })),
);

const colunasItens: QTableColumn<ItemOrdemProducaoDto>[] = [
  { name: 'produtoInsumoId', label: 'Insumo', field: 'produtoInsumoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
];

const colunasConsumo: QTableColumn<ApontamentoConsumoDto>[] = [
  { name: 'produtoInsumoId', label: 'Insumo', field: 'produtoInsumoId', align: 'left' },
  { name: 'loteId', label: 'Lote', field: 'loteId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'etapa', label: 'Etapa', field: 'etapa', align: 'left' },
];

const colunasProducao: QTableColumn<ApontamentoProducaoDto>[] = [
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'dispositivoId', label: 'Dispositivo', field: 'dispositivoId', align: 'left' },
  { name: 'apontadoEm', label: 'Quando', field: 'apontadoEm', align: 'left' },
];

function rotuloProduto(pid: string): string {
  return mapa.value.get(pid) ?? pid;
}

function moeda(valor: number | null | undefined): string {
  return valor != null ? formatarMoeda(valor) : '—';
}

function abrirConcluir(): void {
  qtdProduzida.value = String(ordem.value?.quantidadePlanejada ?? '');
  custoMaoObra.value = '';
  custoOverhead.value = '';
  dialogConcluir.value = true;
}

async function confirmarConcluir(): Promise<void> {
  const ok = await concluirOrdem(id.value, {
    quantidadeProduzida: Number(qtdProduzida.value),
    custoMaoObra: custoMaoObra.value ? Number(custoMaoObra.value) : null,
    custoOverhead: custoOverhead.value ? Number(custoOverhead.value) : null,
  });
  if (ok) dialogConcluir.value = false;
}

async function salvarConsumo(): Promise<void> {
  if (!consumo.value.produtoInsumoId || !consumo.value.quantidade) return;
  const ok = await apontarConsumo(id.value, {
    produtoInsumoId: consumo.value.produtoInsumoId,
    loteId: consumo.value.loteId || null,
    quantidade: Number(consumo.value.quantidade),
    etapa: consumo.value.etapa || null,
  });
  if (ok) {
    consumo.value = { produtoInsumoId: '', loteId: '', quantidade: '', etapa: '' };
  }
}

async function lerBalanca(): Promise<void> {
  const leitura = await lerPesoBalanca(dispositivoId.value || undefined);
  if (leitura) producaoQtd.value = String(leitura.peso);
}

async function salvarProducao(): Promise<void> {
  if (!producaoQtd.value) return;
  const ok = await apontarProducao(id.value, {
    quantidade: Number(producaoQtd.value),
    dispositivoId: dispositivoId.value || null,
  });
  if (ok) producaoQtd.value = '';
}

watch(
  () => consumo.value.produtoInsumoId,
  (produtoId) => {
    if (produtoId) void carregarLotes({ produtoId, apenasComSaldo: true });
  },
);

onMounted(async () => {
  void carregarProdutos();
  const ok = await obterOrdem(id.value);
  if (!ok) await router.replace({ name: 'ordens-producao' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}
.titulo-sec {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.dialog {
  min-width: min(420px, 90vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
}
</style>
