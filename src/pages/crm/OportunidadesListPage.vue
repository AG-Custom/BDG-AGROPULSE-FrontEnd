<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Oportunidades"
      subtitulo="Pipeline comercial por safra, cultura e produto."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova oportunidade"
        descricao="Cadastrar oportunidade"
        :to="{ name: 'crm-oportunidade-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            clearable
            class="filtro-busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="filtroEtapa"
            outlined
            dense
            label="Etapa"
            emit-value
            map-options
            clearable
            :options="EtapaOportunidadeOpcoes"
            class="filtro"
          />
        </div>

        <agro-table-skeleton v-if="carregando && oportunidades.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && filtradas.length === 0"
          titulo="Nenhuma oportunidade"
          descricao="Cadastre a primeira oportunidade ou ajuste os filtros."
          icon="trending_up"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova oportunidade"
            descricao="Cadastrar"
            :to="{ name: 'crm-oportunidade-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="filtradas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valorEstimado="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorEstimado) }}
            </q-td>
          </template>
          <template #body-cell-etapa="props">
            <q-td :props="props">{{ rotuloEtapa(props.row.etapa) }}</q-td>
          </template>
          <template #body-cell-dataPrevista="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataPrevista) || '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-status="false"
                :mostrar-excluir="true"
                excluir-label="Remover"
                :editar-to="{ name: 'crm-oportunidade-editar', params: { id: props.row.id } }"
                :loading-excluir="salvando"
                @excluir="removerOportunidade(props.row.id)"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-close-popup clickable class="agro-acoes-menu__item" @click="abrirEtapa(props.row)">
                  <q-item-section avatar><q-icon name="swap_horiz" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Alterar etapa</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogEtapa" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Alterar etapa</h4>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="novaEtapa"
            outlined
            label="Etapa"
            emit-value
            map-options
            :options="EtapaOportunidadeOpcoes"
          />
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogEtapa = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Salvar"
            descricao="Confirmar etapa"
            :loading="salvando"
            @click="confirmarEtapa"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <agro-entity-details-dialog
      v-model="dialogVisualizar"
      :titulo="tituloDetalhe"
      :registro="registroSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCrm } from 'composables/useCrm';
import { EtapaOportunidadeOpcoes } from 'constants/enums';
import type { EtapaOportunidadeValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { OportunidadeDto } from 'types/dtos/crm.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Oportunidades');

const {
  oportunidades,
  carregando,
  salvando,
  carregarOportunidades,
  alterarEtapaOportunidade,
  removerOportunidade,
} = useCrm();

const busca = ref('');
const filtroEtapa = ref<string | null>(null);
const dialogEtapa = ref(false);
const oportunidadeId = ref<string | null>(null);
const novaEtapa = ref<EtapaOportunidadeValor | ''>('');

const mapaEtapas = computed(() => {
  const m = new Map<string, string>();
  for (const o of EtapaOportunidadeOpcoes) m.set(o.value, o.label);
  return m;
});

const filtradas = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  return oportunidades.value.filter((o) => {
    if (filtroEtapa.value && o.etapa !== filtroEtapa.value) return false;
    if (!termo) return true;
    return [o.cultura, o.produtoNome, o.clienteId, o.safraRef]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(termo));
  });
});

const colunas: QTableColumn<OportunidadeDto>[] = [
  { name: 'cultura', label: 'Cultura', field: 'cultura', align: 'left', sortable: true },
  { name: 'produtoNome', label: 'Produto', field: 'produtoNome', align: 'left' },
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'etapa', label: 'Etapa', field: 'etapa', align: 'left' },
  { name: 'valorEstimado', label: 'Valor', field: 'valorEstimado', align: 'right' },
  { name: 'dataPrevista', label: 'Previsão', field: 'dataPrevista', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloEtapa(etapa: string): string {
  return mapaEtapas.value.get(etapa) ?? etapa;
}

function abrirEtapa(item: OportunidadeDto): void {
  oportunidadeId.value = item.id;
  novaEtapa.value = item.etapa;
  dialogEtapa.value = true;
}

async function confirmarEtapa(): Promise<void> {
  if (!oportunidadeId.value || !novaEtapa.value) return;
  const ok = await alterarEtapaOportunidade(oportunidadeId.value, novaEtapa.value);
  if (ok) dialogEtapa.value = false;
}

onMounted(() => {
  void carregarOportunidades();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.filtro-busca {
  min-width: 220px;
  flex: 1;
}
.filtro {
  min-width: 180px;
}
.dialog {
  min-width: min(420px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes {
  white-space: nowrap;
}
</style>
