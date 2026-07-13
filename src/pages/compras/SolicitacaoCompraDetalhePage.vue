<template>
  <q-page class="agro-page">
    <app-page-header titulo="Solicitação de compra" :subtitulo="subtitulo">
      <agro-btn
        v-if="podeCancelar"
        color="negative"
        unelevated
        label="Cancelar"
        descricao="Cancelar solicitação"
        :loading="salvando"
        @click="cancelar"
      />
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !solicitacao" :campos="4" />
      <template v-else-if="solicitacao">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-4">
              <div class="text-caption">Status</div>
              <agro-badge :label="solicitacao.status" variant="default" />
            </div>
            <div class="col-md-4">
              <div class="text-caption">Criada em</div>
              <div>{{ formatarDataHora(solicitacao.createdAt) }}</div>
            </div>
            <div v-if="solicitacao.observacao" class="col-12">
              <div class="text-caption">Observação</div>
              <div>{{ solicitacao.observacao }}</div>
            </div>
          </div>
        </agro-card>
        <agro-card>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="solicitacao.itens"
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
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'solicitacoes-compra' }" />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useCompras } from 'composables/useCompras';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { SolicitacaoCompraItemDto } from 'types/dtos/compras.dto';
import { formatarDataHora, formatarDecimal } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { solicitacao, carregando, salvando, obterSolicitacao, cancelarSolicitacao } = useCompras();
const { produtos, carregar: carregarProdutos } = useProdutos();

const id = computed(() => route.params.id as string);
const podeCancelar = computed(
  () => solicitacao.value?.status === 'Aberta' || solicitacao.value?.status === 'EmCotacao',
);
const subtitulo = computed(() =>
  solicitacao.value ? `Status: ${solicitacao.value.status}` : 'Carregando...',
);
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});
const colunas: QTableColumn<SolicitacaoCompraItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
];

function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}

async function cancelar(): Promise<void> {
  await cancelarSolicitacao(id.value);
}

onMounted(async () => {
  void carregarProdutos();
  const ok = await obterSolicitacao(id.value);
  if (!ok) await router.replace({ name: 'solicitacoes-compra' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
</style>
