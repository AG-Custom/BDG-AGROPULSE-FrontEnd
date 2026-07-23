<template>
  <q-page class="agro-page">
    <app-page-header :titulo="'Venda PDV'" :subtitulo="subtitulo">
      <agro-btn
        v-if="podeEmitirNfce"
        color="primary"
        unelevated
        label="Emitir NFC-e"
        descricao="Emitir NFC-e (stub fiscal)"
        :loading="emitindoNfce"
        @click="emitir"
      />
      <agro-btn
        v-if="podeCancelar"
        color="negative"
        unelevated
        label="Cancelar venda"
        descricao="Cancelar venda e estornar estoque"
        :loading="salvando"
        @click="cancelarVenda"
      />
    </app-page-header>

    <section class="agro-section pdv-detalhe">
      <agro-form-skeleton v-if="carregando && !venda" :campos="5" />

      <template v-else-if="venda">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="venda.status" variant="default" />
            </div>
            <div class="col-12 col-md-3">
              <div class="text-caption">Total</div>
              <div class="text-metric">{{ formatarMoeda(venda.valorTotal) }}</div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-caption">Cliente</div>
              <div>{{ rotuloClienteExibicao }}</div>
            </div>
            <div class="col-12 col-md-3">
              <div class="text-caption">Criada em</div>
              <div>{{ formatarDataHora(venda.createdAt) }}</div>
            </div>
            <div v-if="venda.troco != null" class="col-12 col-md-3">
              <div class="text-caption">Troco</div>
              <div class="text-metric">{{ formatarMoeda(venda.troco) }}</div>
            </div>
            <div v-if="venda.aPrazo" class="col-12 col-md-3">
              <div class="text-caption">Condição</div>
              <div>A prazo</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="venda.itens"
            :columns="colunas"
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
        <agro-btn flat label="Voltar" descricao="Retornar às vendas" :to="{ name: 'pdv-vendas' }" />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useClientes } from 'composables/useClientes';
import { usePdv } from 'composables/usePdv';
import { useProdutos } from 'composables/useProdutos';
import { PdvVendaStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { PdvVendaItemDto } from 'types/dtos/pdv.dto';
import { formatarDataHora, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { venda, carregando, salvando, emitindoNfce, obterVenda, cancelar, emitirNfce } =
  usePdv();
const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();

const vendaId = computed(() => route.params.id as string);
const podeCancelar = computed(() => venda.value?.status === PdvVendaStatus.Concluida);
const podeEmitirNfce = computed(() => venda.value?.status === PdvVendaStatus.Concluida);
const subtitulo = computed(() =>
  venda.value ? `Status: ${venda.value.status}` : 'Carregando...',
);

const rotuloClienteExibicao = computed(() => {
  if (!venda.value) {
    return '—';
  }
  if (venda.value.clienteId) {
    return rotuloCliente(venda.value.clienteId);
  }
  if (venda.value.clienteNomeAvulso || venda.value.clienteDocumentoAvulso) {
    return [venda.value.clienteNomeAvulso, venda.value.clienteDocumentoAvulso]
      .filter(Boolean)
      .join(' — ');
  }
  return '—';
});

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

const colunas: QTableColumn<PdvVendaItemDto>[] = [
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

async function cancelarVenda(): Promise<void> {
  await cancelar(vendaId.value);
}

async function emitir(): Promise<void> {
  await emitirNfce(vendaId.value);
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  const ok = await obterVenda(vendaId.value);
  if (!ok) await router.replace({ name: 'pdv-vendas' });
});
</script>

<style scoped>
.pdv-detalhe {
  display: grid;
  gap: var(--spacing-6);
}
</style>
