<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="ICMS"
      subtitulo="CST (regime normal) e CSOSN (Simples Nacional). Relacione, se quiser, um código de saída do mesmo tipo a cada código."
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
            class="icms-list__busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn-toggle
            v-model="tipoFiltro"
            unelevated
            no-caps
            toggle-color="primary"
            :options="opcoesTipo"
          />
        </div>

        <agro-table-skeleton v-if="carregando && itens.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && itens.length === 0"
          titulo="Nenhum código de ICMS"
          descricao="O catálogo oficial ainda não foi carregado."
          icon="receipt_long"
        />
        <q-table
          v-else
          flat
          bordered
          :row-key="chaveLinha"
          :rows="filtrados"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-tipo="props">
            <q-td :props="props">{{ rotuloTipo(props.row.tipo) }}</q-td>
          </template>
          <template #body-cell-codigo="props">
            <q-td :props="props" class="text-metric">{{ props.row.codigo }}</q-td>
          </template>
          <template #body-cell-icmsSaida="props">
            <q-td :props="props">
              <span v-if="props.row.icmsSaida" class="text-metric">{{ props.row.icmsSaida }}</span>
              <span v-if="props.row.icmsSaida"> — {{ props.row.icmsSaidaDescricao }}</span>
              <span v-else>—</span>
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="icms-list__acoes">
              <agro-btn
                flat
                dense
                color="primary"
                label="Relacionar ICMS de saída"
                descricao="Relacionar um ICMS de saída a este código"
                @click="abrirDialog(props.row)"
              />
            </q-td>
          </template>
          <template #no-data>
            <empty-state
              titulo="Nenhum código encontrado"
              descricao="Ajuste a busca ou o tipo."
              icon="search"
            />
          </template>
        </q-table>
      </agro-card>
    </section>

    <relacionar-icms-saida-dialog
      v-model="dialogAberto"
      :icms="icmsSelecionado"
      :opcoes="itens"
      :salvando="salvando"
      @salvar="confirmarVinculo"
    />
  </q-page>
</template>

<script setup lang="ts">
import RelacionarIcmsSaidaDialog from 'components/fiscal/RelacionarIcmsSaidaDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useIcms } from 'composables/useIcms';
import type { QTableColumn } from 'quasar';
import type { IcmsDto, TipoCodigoIcms } from 'types/dtos/fiscal-gestao.dto';
import { computed, onMounted, ref } from 'vue';

type FiltroTipo = TipoCodigoIcms | 'Todos';

const { itens, carregando, salvando, carregar, relacionar } = useIcms();
const busca = ref('');
const tipoFiltro = ref<FiltroTipo>('Todos');
const dialogAberto = ref(false);
const icmsSelecionado = ref<IcmsDto | null>(null);

const opcoesTipo = [
  { label: 'Todos', value: 'Todos' },
  { label: 'CST ICMS', value: 'Cst' },
  { label: 'CSOSN', value: 'Csosn' },
];

const colunas: QTableColumn<IcmsDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
  { name: 'icmsSaida', label: 'ICMS de saída', field: 'icmsSaida', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'codigo', align: 'right' },
];

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  return itens.value
    .filter((item) => tipoFiltro.value === 'Todos' || item.tipo === tipoFiltro.value)
    .filter((item) =>
      !termo
      || item.codigo.includes(termo)
      || item.descricao.toLowerCase().includes(termo)
      || (item.icmsSaida?.includes(termo) ?? false)
      || (item.icmsSaidaDescricao?.toLowerCase().includes(termo) ?? false),
    );
});

function chaveLinha(item: IcmsDto): string {
  return `${item.tipo}-${item.codigo}`;
}

function rotuloTipo(tipo: TipoCodigoIcms): string {
  return tipo === 'Csosn' ? 'CSOSN' : 'CST ICMS';
}

function abrirDialog(item: IcmsDto): void {
  icmsSelecionado.value = item;
  dialogAberto.value = true;
}

async function confirmarVinculo(icmsSaida: string | null): Promise<void> {
  if (!icmsSelecionado.value) return;
  const { tipo, codigo } = icmsSelecionado.value;
  const ok = await relacionar(tipo, codigo, icmsSaida);
  if (ok) dialogAberto.value = false;
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.icms-list__busca {
  flex: 1;
  min-width: 240px;
}

.icms-list__acoes {
  white-space: nowrap;
}
</style>
