<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina">
      <div class="orcamento-detalhe__acoes">
        <agro-btn
          v-if="ehAberto"
          flat
          icon="edit"
          label="Editar"
          descricao="Editar orçamento"
          :to="{ name: 'orcamento-editar', params: { id: orcamentoId } }"
        />
        <agro-btn
          v-if="ehAberto"
          color="primary"
          unelevated
          label="Converter"
          descricao="Converter em pedido de venda"
          :loading="salvando"
          @click="abrirConverter"
        />
        <agro-btn
          v-if="ehAberto"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar orçamento"
          :loading="salvando"
          @click="cancelarOrcamento"
        />
      </div>
    </app-page-header>

    <section class="agro-section orcamento-detalhe">
      <agro-form-skeleton v-if="carregando && !orcamento" :campos="6" />

      <template v-else-if="orcamento">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <div class="text-caption">Cliente</div>
              <div>{{ rotuloCliente(orcamento.clienteId) }}</div>
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption">Status</div>
              <agro-badge :label="orcamento.status" variant="default" />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption">Total</div>
              <div class="text-metric">{{ formatarMoeda(orcamento.valorTotal) }}</div>
            </div>
            <div v-if="orcamento.observacao" class="col-12">
              <div class="text-caption">Observação</div>
              <div>{{ orcamento.observacao }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="orcamento.itens"
            :columns="colunasItens"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.quantidade) }}
              </q-td>
            </template>
            <template #body-cell-precoUnitario="props">
              <q-td :props="props" class="text-metric">
                {{ formatarMoeda(props.row.precoUnitario) }}
              </q-td>
            </template>
            <template #body-cell-subtotal="props">
              <q-td :props="props" class="text-metric">
                {{ formatarMoeda(props.row.subtotal) }}
              </q-td>
            </template>
          </q-table>
        </agro-card>
      </template>

      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Retornar à listagem" :to="{ name: 'orcamentos' }" />
      </div>
    </section>

    <q-dialog v-model="dialogConverter" persistent>
      <q-card class="orcamento-detalhe__dialog">
        <q-card-section>
          <h4 class="orcamento-detalhe__dialog-titulo">Converter em pedido</h4>
        </q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-select
              v-model="converterForm.condicaoPagamentoId"
              outlined
              label="Condição de pagamento"
              emit-value
              map-options
              :options="condicaoOpcoes"
            />
          </div>
          <div class="col-12">
            <q-select
              v-model="converterForm.formaPagamento"
              outlined
              label="Forma de pagamento"
              emit-value
              map-options
              :options="FormaPagamentoOpcoes"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar diálogo" @click="dialogConverter = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Converter"
            descricao="Confirmar conversão"
            :loading="salvando"
            @click="confirmarConverter"
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
import { useClientes } from 'composables/useClientes';
import { useCondicoesPagamento } from 'composables/useCondicoesPagamento';
import { useOrcamento } from 'composables/useOrcamento';
import { useProdutos } from 'composables/useProdutos';
import {
  FormaPagamento,
  FormaPagamentoOpcoes,
  OrcamentoStatus,
  type FormaPagamentoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { OrcamentoItemDto } from 'types/dtos/orcamento.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { orcamento, carregando, salvando, obter, cancelar, converter } = useOrcamento();
const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { condicaoOpcoes, carregar: carregarCondicoes } = useCondicoesPagamento();

const dialogConverter = ref(false);
const converterForm = reactive({
  condicaoPagamentoId: '',
  formaPagamento: FormaPagamento.Pix as FormaPagamentoValor,
});

const orcamentoId = computed(() => route.params.id as string);
const ehAberto = computed(() => orcamento.value?.status === OrcamentoStatus.Aberto);
const tituloPagina = computed(() => 'Orçamento');
const subtituloPagina = computed(() =>
  orcamento.value ? `Status: ${orcamento.value.status}` : 'Carregando...',
);

const mapaClientes = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeRazao);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});
const colunasItens: QTableColumn<OrcamentoItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapaClientes.value.get(id) ?? id;
}
function rotuloProduto(id: string): string {
  return mapaProdutos.value.get(id) ?? id;
}

function abrirConverter(): void {
  dialogConverter.value = true;
}

async function confirmarConverter(): Promise<void> {
  const pedido = await converter(orcamentoId.value, { ...converterForm });
  if (pedido) {
    dialogConverter.value = false;
    await router.push({ name: 'pedido-venda-detalhe', params: { id: pedido.id } });
  }
}

async function cancelarOrcamento(): Promise<void> {
  await cancelar(orcamentoId.value);
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  void carregarCondicoes();
  const ok = await obter(orcamentoId.value);
  if (!ok) await router.replace({ name: 'orcamentos' });
});
</script>

<style scoped>
.orcamento-detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.orcamento-detalhe__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.orcamento-detalhe__dialog {
  min-width: min(420px, 90vw);
  padding: var(--spacing-2);
}
.orcamento-detalhe__dialog-titulo {
  margin: 0;
  font-family: var(--font-family-display);
}
</style>
