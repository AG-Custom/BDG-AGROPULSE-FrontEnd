<template>
  <q-page class="agro-page">
    <app-page-header titulo="Pedido de compra" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="pedido?.status === 'Rascunho'"
          color="primary"
          unelevated
          label="Enviar"
          descricao="Enviar pedido ao fornecedor"
          :loading="salvando"
          @click="enviar"
        />
        <agro-btn
          v-if="pedido?.status === 'Enviado' || pedido?.status === 'RecebidoParcial'"
          color="primary"
          unelevated
          label="Receber"
          descricao="Abrir recebimento do pedido"
          :loading="salvando"
          @click="receber"
        />
        <agro-btn
          v-if="pedido?.status === 'Rascunho' || pedido?.status === 'Enviado' || pedido?.status === 'AguardandoAprovacao'"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar pedido"
          :loading="salvando"
          @click="cancelar"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !pedido" :campos="5" />
      <template v-else-if="pedido">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="rotuloStatus(pedido.status)" variant="default" />
            </div>
            <div class="col-md-3">
              <div class="text-caption">Fornecedor</div>
              <div>{{ rotuloFornecedor(pedido.fornecedorId) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Total</div>
              <div class="text-metric">{{ formatarMoeda(pedido.valorTotal) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Criado em</div>
              <div>{{ formatarDataHora(pedido.createdAt) }}</div>
            </div>
          </div>
        </agro-card>
        <agro-card>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="pedido.itens"
            :columns="colunas"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
            <template #body-cell-precoUnitario="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.precoUnitario) }}</q-td>
            </template>
            <template #body-cell-subtotal="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.subtotal) }}</q-td>
            </template>
          </q-table>
        </agro-card>
      </template>
      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'pedidos-compra' }" />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useCompras } from 'composables/useCompras';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { PedidoCompraStatusOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { PedidoCompraItemDto } from 'types/dtos/compras.dto';
import { formatarDataHora, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  pedido,
  carregando,
  salvando,
  obterPedido,
  enviarPedido,
  cancelarPedido,
} = useCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();

const id = computed(() => route.params.id as string);
const subtitulo = computed(() =>
  pedido.value ? `Status: ${rotuloStatus(pedido.value.status)}` : 'Carregando...',
);

const mapaFornecedores = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<PedidoCompraItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' },
];

function rotuloFornecedor(fid: string): string {
  return mapaFornecedores.value.get(fid) ?? fid;
}
function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}
function rotuloStatus(status: string): string {
  return PedidoCompraStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

async function enviar(): Promise<void> {
  await enviarPedido(id.value);
}

async function receber(): Promise<void> {
  await router.push({
    name: 'recebimento-compra-novo',
    query: { pedidoCompraId: id.value },
  });
}

async function cancelar(): Promise<void> {
  await cancelarPedido(id.value);
}

onMounted(async () => {
  void carregarFornecedores();
  void carregarProdutos();
  const ok = await obterPedido(id.value);
  if (!ok) await router.replace({ name: 'pedidos-compra' });
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
</style>
