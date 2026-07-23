<template>
  <q-page class="agro-page">
    <app-page-header titulo="Receitas / BOM" subtitulo="Fórmulas de produção com tolerâncias.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova receita"
        descricao="Criar receita"
        :to="{ name: 'receita-producao-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && receitas.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && receitas.length === 0"
          titulo="Nenhuma receita"
          descricao="Cadastre a primeira receita/BOM."
          icon="menu_book"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova receita"
            descricao="Criar receita"
            :to="{ name: 'receita-producao-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="receitas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoSaidaId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoSaidaId) }}</q-td>
          </template>
          <template #body-cell-ativa="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativa ? 'Ativa' : 'Inativa'"
                :variant="props.row.ativa ? 'success' : 'default'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :ativo="props.row.ativa"
                :mostrar-visualizar="false"
                :mostrar-status="!props.row.ativa"
                :mostrar-excluir="true"
                excluir-label="Remover"
                :editar-to="{ name: 'receita-producao-editar', params: { id: props.row.id } }"
                :loading-status="salvando"
                :loading-excluir="salvando"
                @ativar="ativar(props.row.id)"
                @excluir="onRemover(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useProdutos } from 'composables/useProdutos';
import { useReceitasProducao } from 'composables/useReceitasProducao';
import type { QTableColumn } from 'quasar';
import type { ReceitaProducaoDto } from 'types/dtos/producao.dto';
import { computed, onMounted } from 'vue';

const { receitas, carregando, salvando, carregar, ativar, remover } = useReceitasProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<ReceitaProducaoDto>[] = [
  { name: 'produtoSaidaId', label: 'Produto saída', field: 'produtoSaidaId', align: 'left' },
  { name: 'versao', label: 'Versão', field: 'versao', align: 'right' },
  { name: 'ativa', label: 'Status', field: 'ativa', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloProduto(id: string): string {
  return mapa.value.get(id) ?? id;
}

async function onRemover(id: string): Promise<void> {
  if (await remover(id)) await carregar();
}

onMounted(() => {
  void carregarProdutos();
  void carregar();
});
</script>

<style scoped>
.acoes {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-1);
}
</style>
