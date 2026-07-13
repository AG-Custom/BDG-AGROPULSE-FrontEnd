<template>
  <q-page class="agro-page">
    <app-page-header titulo="Romaneio" subtitulo="Sugestão de lotes FEFO para expedição." />

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !romaneio" :campos="4" />

      <template v-else-if="romaneio">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-6">
              <div class="text-caption">Pedido</div>
              <div>{{ romaneio.pedidoId }}</div>
            </div>
            <div class="col-md-6">
              <div class="text-caption">Cliente</div>
              <div>{{ rotuloCliente(romaneio.clienteId) }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card v-for="item in romaneio.itens" :key="item.produtoId">
          <h3 class="titulo">{{ rotuloProduto(item.produtoId) }}</h3>
          <p class="text-caption">
            Quantidade: <span class="text-metric">{{ formatarDecimal(item.quantidade) }}</span>
          </p>
          <empty-state
            v-if="item.lotesSugeridos.length === 0"
            titulo="Sem lotes sugeridos"
            descricao="Não há lotes disponíveis para este item."
            icon="qr_code_2"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="loteId"
            hide-pagination
            :rows="item.lotesSugeridos"
            :columns="colunasLotes"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-dataValidade="props">
              <q-td :props="props">{{ formatarData(props.row.dataValidade) }}</q-td>
            </template>
            <template #body-cell-quantidadeDisponivel="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.quantidadeDisponivel) }}
              </q-td>
            </template>
            <template #body-cell-quantidadeSugerida="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.quantidadeSugerida) }}
              </q-td>
            </template>
          </q-table>
        </agro-card>
      </template>

      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar à expedição" :to="{ name: 'expedicao' }" />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useExpedicao } from 'composables/useExpedicao';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { RomaneioLoteSugeridoDto } from 'types/dtos/expedicao.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { romaneio, carregando, obterRomaneio } = useExpedicao();
const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();

const pedidoId = computed(() => route.params.pedidoId as string);

const mapaClientes = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeRazao);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});

const colunasLotes: QTableColumn<RomaneioLoteSugeridoDto>[] = [
  { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left' },
  { name: 'dataValidade', label: 'Validade', field: 'dataValidade', align: 'left' },
  { name: 'quantidadeDisponivel', label: 'Disponível', field: 'quantidadeDisponivel', align: 'right' },
  { name: 'quantidadeSugerida', label: 'Sugerida', field: 'quantidadeSugerida', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapaClientes.value.get(id) ?? id;
}
function rotuloProduto(id: string): string {
  return mapaProdutos.value.get(id) ?? id;
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  const ok = await obterRomaneio(pedidoId.value);
  if (!ok) await router.replace({ name: 'expedicao' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-2);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
