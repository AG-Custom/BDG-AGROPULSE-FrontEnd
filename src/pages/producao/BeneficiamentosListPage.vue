<template>
  <q-page class="agro-page">
    <app-page-header titulo="Beneficiamentos" subtitulo="Conversão de lotes com rendimento.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo beneficiamento"
        descricao="Registrar beneficiamento"
        :to="{ name: 'beneficiamento-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && beneficiamentos.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && beneficiamentos.length === 0"
          titulo="Nenhum beneficiamento"
          descricao="Registre o primeiro beneficiamento de lote."
          icon="transform"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo beneficiamento"
            descricao="Registrar"
            :to="{ name: 'beneficiamento-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="beneficiamentos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoEntradaId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoEntradaId) }}</q-td>
          </template>
          <template #body-cell-produtoSaidaId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoSaidaId) }}</q-td>
          </template>
          <template #body-cell-rendimentoPercentual="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.rendimentoPercentual) }}%
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status ?? 'Rascunho'" variant="default" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar"
                :to="{ name: 'beneficiamento-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.status !== BeneficiamentoLoteStatus.Confirmado"
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                :loading="salvando"
                @click="onRemover(props.row.id)"
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
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import { BeneficiamentoLoteStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { BeneficiamentoLoteDto } from 'types/dtos/producao.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const {
  beneficiamentos,
  carregando,
  salvando,
  carregarBeneficiamentos,
  removerBeneficiamento,
} = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<BeneficiamentoLoteDto>[] = [
  { name: 'produtoEntradaId', label: 'Entrada', field: 'produtoEntradaId', align: 'left' },
  { name: 'produtoSaidaId', label: 'Saída', field: 'produtoSaidaId', align: 'left' },
  { name: 'rendimentoPercentual', label: 'Rendimento', field: 'rendimentoPercentual', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloProduto(id: string): string {
  return mapa.value.get(id) ?? id;
}

async function onRemover(id: string): Promise<void> {
  const ok = await removerBeneficiamento(id);
  if (ok) await carregarBeneficiamentos();
}

onMounted(() => {
  void carregarProdutos();
  void carregarBeneficiamentos();
});
</script>

<style scoped>
.acoes {
  white-space: nowrap;
}
</style>
