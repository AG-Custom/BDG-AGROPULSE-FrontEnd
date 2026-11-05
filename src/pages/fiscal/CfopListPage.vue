<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="CFOP"
      subtitulo="Catálogo oficial. Relacione, se quiser, um CFOP de saída a cada código."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            clearable
            label="Buscar"
            hint="Código ou descrição"
            class="cfop-list__busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <agro-table-skeleton v-if="carregando && itens.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && itens.length === 0"
          titulo="Nenhum CFOP"
          descricao="O catálogo oficial ainda não foi carregado."
          icon="receipt_long"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="codigo"
          :rows="filtrados"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-codigo="props">
            <q-td :props="props" class="text-metric">{{ props.row.codigo }}</q-td>
          </template>
          <template #body-cell-cfopSaida="props">
            <q-td :props="props">
              <span v-if="props.row.cfopSaida" class="text-metric">{{ props.row.cfopSaida }}</span>
              <span v-if="props.row.cfopSaida"> — {{ props.row.cfopSaidaDescricao }}</span>
              <span v-else>—</span>
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="cfop-list__acoes">
              <agro-btn
                flat
                dense
                color="primary"
                label="Relacionar CFOP de saída"
                descricao="Relacionar um CFOP de saída a este código"
                @click="abrirDialog(props.row)"
              />
            </q-td>
          </template>
          <template #no-data>
            <empty-state
              titulo="Nenhum CFOP encontrado"
              descricao="Ajuste a busca por código ou descrição."
              icon="search"
            />
          </template>
        </q-table>
      </agro-card>
    </section>

    <relacionar-cfop-saida-dialog
      v-model="dialogAberto"
      :cfop="cfopSelecionado"
      :opcoes="itens"
      :salvando="salvando"
      @salvar="confirmarVinculo"
    />
  </q-page>
</template>

<script setup lang="ts">
import RelacionarCfopSaidaDialog from 'components/fiscal/RelacionarCfopSaidaDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCfops } from 'composables/useCfops';
import type { QTableColumn } from 'quasar';
import type { CfopDto } from 'types/dtos/fiscal-gestao.dto';
import { computed, onMounted, ref } from 'vue';

const { itens, carregando, salvando, carregar, relacionar } = useCfops();
const busca = ref('');
const dialogAberto = ref(false);
const cfopSelecionado = ref<CfopDto | null>(null);

const colunas: QTableColumn<CfopDto>[] = [
  { name: 'codigo', label: 'CFOP', field: 'codigo', align: 'left', sortable: true },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
  { name: 'cfopSaida', label: 'CFOP de saída', field: 'cfopSaida', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'codigo', align: 'right' },
];

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  if (!termo) return itens.value;
  return itens.value.filter((item) =>
    item.codigo.includes(termo)
    || item.descricao.toLowerCase().includes(termo)
    || (item.cfopSaida?.includes(termo) ?? false)
    || (item.cfopSaidaDescricao?.toLowerCase().includes(termo) ?? false),
  );
});

function abrirDialog(item: CfopDto): void {
  cfopSelecionado.value = item;
  dialogAberto.value = true;
}

async function confirmarVinculo(cfopSaida: string | null): Promise<void> {
  if (!cfopSelecionado.value) return;
  const ok = await relacionar(cfopSelecionado.value.codigo, cfopSaida);
  if (ok) dialogAberto.value = false;
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.cfop-list__busca {
  flex: 1;
  min-width: 240px;
}

.cfop-list__acoes {
  white-space: nowrap;
}
</style>
