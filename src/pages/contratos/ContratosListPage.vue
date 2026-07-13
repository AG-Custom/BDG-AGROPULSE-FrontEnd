<template>
  <q-page class="agro-page">
    <app-page-header titulo="Contratos" subtitulo="CPR, Barter e Termo com cotação de mercado.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo contrato"
        descricao="Criar contrato"
        :to="{ name: 'contrato-novo', query: { tipo } }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card v-if="cotacao" class="q-mb-md">
        <div class="cotacao">
          <div>
            <div class="text-caption">Cotação de mercado</div>
            <div>
              {{ cotacao.produto }} · {{ cotacao.fonte }} ·
              <span class="text-metric">{{ formatarMoeda(cotacao.preco) }}</span>
            </div>
          </div>
          <agro-btn
            flat
            icon="refresh"
            label="Atualizar"
            descricao="Atualizar cotação"
            @click="carregarCotacaoMercado()"
          />
        </div>
      </agro-card>

      <agro-card>
        <q-tabs
          v-model="tipo"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab v-for="op in TipoContratoOpcoes" :key="op.value" :name="op.value" :label="op.label" />
        </q-tabs>
        <q-separator />

        <agro-table-skeleton v-if="carregando && contratos.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && contratos.length === 0"
          titulo="Nenhum contrato"
          descricao="Crie o primeiro contrato deste tipo."
          icon="handshake"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="contratos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-clienteId="props">
            <q-td :props="props">{{ rotuloCliente(props.row.clienteId) }}</q-td>
          </template>
          <template #body-cell-produtoId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
          </template>
          <template #body-cell-preco="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.preco) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Ver contrato"
                :to="{ name: 'contrato-detalhe', params: { id: props.row.id }, query: { tipo } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useContratos } from 'composables/useContratos';
import { useProdutos } from 'composables/useProdutos';
import { TipoContrato, TipoContratoOpcoes, type TipoContratoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ContratoDto } from 'types/dtos/contrato.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tipo = ref<TipoContratoValor>(
  (route.query.tipo as TipoContratoValor) || TipoContrato.Cpr,
);

const {
  contratos,
  cotacao,
  carregando,
  carregar,
  carregarCotacaoMercado,
} = useContratos(tipo);

const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();

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

const colunas: QTableColumn<ContratoDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'preco', label: 'Preço', field: 'preco', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapaClientes.value.get(id) ?? id;
}
function rotuloProduto(id: string): string {
  return mapaProdutos.value.get(id) ?? id;
}

watch(tipo, (novo) => {
  void router.replace({ query: { tipo: novo } });
  void carregar();
});

onMounted(() => {
  void carregarClientes();
  void carregarProdutos();
  void carregar();
  void carregarCotacaoMercado();
});
</script>

<style scoped>
.cotacao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}
</style>
