<template>
  <q-page class="agro-page">
    <app-page-header titulo="Devolução de venda" :subtitulo="subtitulo">
      <agro-btn
        v-if="devolucao?.status === 'Pendente'"
        color="primary"
        unelevated
        label="Processar"
        descricao="Processar devolução"
        :loading="salvando"
        @click="processarDevolucao"
      />
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !devolucao" :campos="4" />
      <template v-else-if="devolucao">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-4">
              <div class="text-caption">Status</div>
              <agro-badge :label="devolucao.status" variant="default" />
            </div>
            <div class="col-md-4">
              <div class="text-caption">Pedido</div>
              <div>{{ devolucao.pedidoVendaId }}</div>
            </div>
            <div class="col-md-4">
              <div class="text-caption">Criada em</div>
              <div>{{ formatarDataHora(devolucao.createdAt) }}</div>
            </div>
          </div>
        </agro-card>
        <agro-card>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="devolucao.itens"
            :columns="colunas"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
          </q-table>
        </agro-card>
      </template>
      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'devolucoes-venda' }" />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useDevolucoesVenda } from 'composables/useDevolucoesVenda';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { ItemDevolucaoDto } from 'types/dtos/devolucao-venda.dto';
import { formatarDataHora, formatarDecimal } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { devolucao, carregando, salvando, obter, processar } = useDevolucoesVenda();
const { produtos, carregar: carregarProdutos } = useProdutos();

const id = computed(() => route.params.id as string);
const subtitulo = computed(() =>
  devolucao.value ? `Status: ${devolucao.value.status}` : 'Carregando...',
);
const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});
const colunas: QTableColumn<ItemDevolucaoDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'destino', label: 'Destino', field: 'destino', align: 'left' },
];

function rotuloProduto(pid: string): string {
  return mapa.value.get(pid) ?? pid;
}

async function processarDevolucao(): Promise<void> {
  await processar(id.value);
}

onMounted(async () => {
  void carregarProdutos();
  const ok = await obter(id.value);
  if (!ok) await router.replace({ name: 'devolucoes-venda' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
</style>
