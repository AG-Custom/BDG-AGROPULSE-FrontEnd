<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Custeio de safra"
      subtitulo="Custos por hectare — insumos, mão de obra e serviços."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo custeio"
        descricao="Registrar custeio"
        @click="abrirDialog"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroSafraId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Safra"
            class="filtro"
            :options="safraOpcoes"
            @update:model-value="aplicarFiltros"
          />
          <q-select
            v-model="filtroTalhaoId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Talhão"
            class="filtro"
            :options="talhaoOpcoes"
            @update:model-value="aplicarFiltros"
          />
        </div>

        <div v-if="resumo" class="metricas">
          <div class="metrica">
            <div class="text-caption">Total</div>
            <div class="text-metric valor">{{ formatarMoeda(resumo.total) }}</div>
          </div>
          <div class="metrica destaque">
            <div class="text-caption">Custo / ha</div>
            <div class="text-metric valor">
              {{ resumo.custoPorHa != null ? formatarMoeda(resumo.custoPorHa) : '—' }}
            </div>
          </div>
          <div
            v-for="cat in resumo.porCategoria"
            :key="cat.categoria"
            class="metrica"
          >
            <div class="text-caption">{{ rotuloCategoria(cat.categoria) }}</div>
            <div class="text-metric valor">{{ formatarMoeda(cat.total) }}</div>
          </div>
        </div>

        <div v-if="produtividade" class="produtividade text-caption">
          Produtividade: planejada
          {{
            produtividade.produtividadePlanejada != null
              ? formatarDecimal(produtividade.produtividadePlanejada)
              : '—'
          }}
          · realizada
          {{
            produtividade.produtividadeRealizada != null
              ? formatarDecimal(produtividade.produtividadeRealizada)
              : '—'
          }}
          <template v-if="produtividade.diferencaPct != null">
            ({{ formatarDecimal(produtividade.diferencaPct) }}%)
          </template>
        </div>

        <agro-table-skeleton v-if="carregando && custeios.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && custeios.length === 0"
          titulo="Nenhum custeio"
          descricao="Registre custos vinculados à safra."
          icon="payments"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="custeios"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
          class="q-mt-md"
        >
          <template #body-cell-categoria="props">
            <q-td :props="props">{{ rotuloCategoria(props.row.categoria) }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valor) }}
            </q-td>
          </template>
          <template #body-cell-data="props">
            <q-td :props="props">
              {{ props.row.data ? formatarData(props.row.data) : '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
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

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Novo custeio</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.safraId"
                  outlined
                  label="Safra"
                  class="field-required"
                  emit-value
                  map-options
                  :options="safraOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.categoria"
                  outlined
                  label="Categoria"
                  class="field-required"
                  emit-value
                  map-options
                  :options="CategoriaCusteioSafraOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.descricao"
                  outlined
                  label="Descrição"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-6 col-md-4">
                <AgroMoneyInput
                  v-model="formulario.valor"
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-6 col-md-4">
                <q-input v-model="formulario.data" outlined label="Data" type="date" />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="formulario.talhaoId"
                  outlined
                  label="Talhão"
                  clearable
                  emit-value
                  map-options
                  :options="talhaoOpcoes"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Salvar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCusteioSafra } from 'composables/useCusteioSafra';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
import { CategoriaCusteioSafraOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CusteioSafraDto, CusteioSafraFormModel } from 'types/dtos/safras.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const {
  custeios,
  resumo,
  produtividade,
  carregando,
  salvando,
  carregar,
  carregarProdutividade,
  criar,
  remover,
} = useCusteioSafra();
const { safraOpcoes, carregar: carregarSafras } = useSafras();
const { talhoes, carregarTalhoes } = useRastreabilidade();

const filtroSafraId = ref<string | null>(null);
const filtroTalhaoId = ref<string | null>(null);
const dialog = ref(false);
const formulario = ref<CusteioSafraFormModel>({
  safraId: '',
  talhaoId: '',
  categoria: '',
  descricao: '',
  valor: '',
  data: '',
  quantidade: '',
  unidade: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);

const mapaCategorias = computed(() => {
  const m = new Map<string, string>();
  for (const o of CategoriaCusteioSafraOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<CusteioSafraDto>[] = [
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCategoria(cat: string): string {
  return mapaCategorias.value.get(cat) ?? cat;
}

function paramsFiltro() {
  return {
    safraId: filtroSafraId.value || undefined,
    talhaoId: filtroTalhaoId.value || undefined,
  };
}

function aplicarFiltros(): void {
  void carregar(paramsFiltro());
  if (filtroSafraId.value) void carregarProdutividade(filtroSafraId.value);
}

function abrirDialog(): void {
  formulario.value = {
    safraId: filtroSafraId.value ?? '',
    talhaoId: filtroTalhaoId.value ?? '',
    categoria: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().slice(0, 10),
    quantidade: '',
    unidade: '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) {
    dialog.value = false;
    filtroSafraId.value = formulario.value.safraId;
    aplicarFiltros();
  }
}

async function onRemover(id: string): Promise<void> {
  await remover(id, paramsFiltro());
}

watch(filtroSafraId, (id) => {
  if (id) void carregarProdutividade(id);
});

onMounted(() => {
  void carregarSafras();
  void carregarTalhoes();
  void carregar();
});
</script>

<style scoped>
.filtro {
  min-width: 180px;
  max-width: 260px;
}
.metricas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-3);
  margin: var(--spacing-4) 0;
}
.metrica {
  padding: var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
}
.metrica.destaque {
  border-left: var(--border-width-accent) solid var(--color-primary-500);
}
.valor {
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-1);
}
.produtividade {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-3);
}
.dialog {
  min-width: min(520px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
