<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Notas entrada/saída"
      subtitulo="Livro de notas de entrada e saída com filtros por período."
    />

    <section class="agro-section">
      <div class="kpis row q-col-gutter-md q-mb-md">
        <div class="col-6 col-md-3">
          <agro-card class="kpi-card">
            <span class="kpi-label">Qtd. entradas</span>
            <p class="kpi-valor text-metric">{{ kpis.qtdEntradas }}</p>
            <span class="kpi-sub">{{ formatarMoeda(kpis.totalEntradas) }}</span>
          </agro-card>
        </div>
        <div class="col-6 col-md-3">
          <agro-card class="kpi-card">
            <span class="kpi-label">Qtd. saídas</span>
            <p class="kpi-valor text-metric">{{ kpis.qtdSaidas }}</p>
            <span class="kpi-sub">{{ formatarMoeda(kpis.totalSaidas) }}</span>
          </agro-card>
        </div>
        <div class="col-6 col-md-3">
          <agro-card class="kpi-card">
            <span class="kpi-label">Total entradas</span>
            <p class="kpi-valor text-metric">{{ formatarMoeda(kpis.totalEntradas) }}</p>
            <span class="kpi-sub">{{ kpis.qtdEntradas }} notas</span>
          </agro-card>
        </div>
        <div class="col-6 col-md-3">
          <agro-card class="kpi-card">
            <span class="kpi-label">Total saídas</span>
            <p class="kpi-valor text-metric">{{ formatarMoeda(kpis.totalSaidas) }}</p>
            <span class="kpi-sub">{{ kpis.qtdSaidas }} notas</span>
          </agro-card>
        </div>
      </div>

      <agro-card>
        <div class="agro-filter-bar q-mb-md">
          <div class="row q-col-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input
                v-model="busca"
                outlined
                clearable
                label="Buscar"
                placeholder="Nº, série, chave, natureza…"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-5">
              <div class="tipo-toggle">
                <agro-btn
                  :color="filtroTipo === 'todos' ? 'primary' : undefined"
                  :unelevated="filtroTipo === 'todos'"
                  :flat="filtroTipo !== 'todos'"
                  label="Todos"
                  descricao="Todas as notas"
                  @click="onTipo('todos')"
                />
                <agro-btn
                  :color="filtroTipo === TipoNotaFiscal.Entrada ? 'primary' : undefined"
                  :unelevated="filtroTipo === TipoNotaFiscal.Entrada"
                  :flat="filtroTipo !== TipoNotaFiscal.Entrada"
                  label="Entradas"
                  descricao="Filtrar entradas"
                  @click="onTipo(TipoNotaFiscal.Entrada)"
                />
                <agro-btn
                  :color="filtroTipo === TipoNotaFiscal.Saida ? 'primary' : undefined"
                  :unelevated="filtroTipo === TipoNotaFiscal.Saida"
                  :flat="filtroTipo !== TipoNotaFiscal.Saida"
                  label="Saídas"
                  descricao="Filtrar saídas"
                  @click="onTipo(TipoNotaFiscal.Saida)"
                />
              </div>
            </div>
            <div class="col-12 col-md-3 text-right">
              <agro-btn flat label="Limpar tudo" descricao="Limpar filtros" @click="onLimpar" />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-sm">
            <div
              class="col-12 col-md-6"
              :class="{ 'periodo--disabled': filtroTipo === TipoNotaFiscal.Saida }"
            >
              <p class="periodo-titulo">Período de entrada</p>
              <div class="row q-col-gutter-sm items-end">
                <div class="col-12 col-sm-4">
                  <q-select
                    v-model="atalhoEntrada"
                    outlined
                    emit-value
                    map-options
                    label="Atalho"
                    :options="periodoOpcoes"
                    :disable="filtroTipo === TipoNotaFiscal.Saida"
                    @update:model-value="aplicarAtalhoEntrada"
                  />
                </div>
                <div class="col-6 col-sm-4">
                  <q-input
                    v-model="entradaDe"
                    outlined
                    type="date"
                    label="De"
                    :disable="filtroTipo === TipoNotaFiscal.Saida"
                    @update:model-value="atalhoEntrada = ''"
                  />
                </div>
                <div class="col-6 col-sm-4">
                  <q-input
                    v-model="entradaAte"
                    outlined
                    type="date"
                    label="Até"
                    :disable="filtroTipo === TipoNotaFiscal.Saida"
                    @update:model-value="atalhoEntrada = ''"
                  />
                </div>
              </div>
            </div>
            <div
              class="col-12 col-md-6"
              :class="{ 'periodo--disabled': filtroTipo === TipoNotaFiscal.Entrada }"
            >
              <p class="periodo-titulo">Período de saída</p>
              <div class="row q-col-gutter-sm items-end">
                <div class="col-12 col-sm-4">
                  <q-select
                    v-model="atalhoSaida"
                    outlined
                    emit-value
                    map-options
                    label="Atalho"
                    :options="periodoOpcoes"
                    :disable="filtroTipo === TipoNotaFiscal.Entrada"
                    @update:model-value="aplicarAtalhoSaida"
                  />
                </div>
                <div class="col-6 col-sm-4">
                  <q-input
                    v-model="saidaDe"
                    outlined
                    type="date"
                    label="De"
                    :disable="filtroTipo === TipoNotaFiscal.Entrada"
                    @update:model-value="atalhoSaida = ''"
                  />
                </div>
                <div class="col-6 col-sm-4">
                  <q-input
                    v-model="saidaAte"
                    outlined
                    type="date"
                    label="Até"
                    :disable="filtroTipo === TipoNotaFiscal.Entrada"
                    @update:model-value="atalhoSaida = ''"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && filtradas.length === 0" :colunas="8" />
        <empty-state
          v-else-if="!carregando && filtradas.length === 0"
          titulo="Nenhuma nota encontrada"
          descricao="Ajuste os filtros ou aguarde novas notas de entrada e saída."
          icon="swap_vert"
        />
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
          <template #body-cell-tipo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.tipo === TipoNotaFiscal.Entrada ? 'Entrada' : 'Saída'"
                :variant="props.row.tipo === TipoNotaFiscal.Entrada ? 'success' : 'info'"
              />
            </q-td>
          </template>
          <template #body-cell-numeroSerie="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.numero ?? '—' }}/{{ props.row.serie ?? '—' }}
            </q-td>
          </template>
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
          </template>
          <template #body-cell-emitidaEm="props">
            <q-td :props="props">
              {{ props.row.emitidaEm ? formatarData(props.row.emitidaEm) : '—' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="String(props.row.status)" variant="default" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                @visualizar="abrirDetalhe(props.row)"
              >
                <q-item
                  v-if="props.row.chaveAcesso"
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  @click="baixarXml(props.row.id)"
                >
                  <q-item-section avatar>
                    <span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit">
                      <q-icon name="code" size="16px" />
                    </span>
                  </q-item-section>
                  <q-item-section>XML</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogDetalhe">
      <q-card class="dialog-detalhe">
        <q-card-section>
          <h4 class="titulo">
            {{
              notaDetalhe?.tipo === TipoNotaFiscal.Entrada
                ? 'Nota de entrada'
                : 'Nota de saída'
            }}
            <span v-if="notaDetalhe?.numero"> — nº {{ notaDetalhe.numero }}</span>
          </h4>
        </q-card-section>
        <q-card-section v-if="notaDetalhe">
          <q-form class="agro-formulario agro-formulario--bloqueado">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaDetalhe.tipo === TipoNotaFiscal.Entrada ? 'Entrada' : 'Saída'"
                  outlined
                  label="Tipo"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="`${notaDetalhe.numero ?? '—'} / ${notaDetalhe.serie ?? '—'}`"
                  outlined
                  label="Número / Série"
                  readonly
                  input-class="text-metric"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="String(notaDetalhe.status)"
                  outlined
                  label="Status"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="notaDetalhe.naturezaOperacao ?? '—'"
                  outlined
                  label="Natureza"
                  readonly
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  :model-value="notaDetalhe.tipoDestinatario ? String(notaDetalhe.tipoDestinatario) : '—'"
                  outlined
                  label="Tipo destinatário"
                  readonly
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  :model-value="notaDetalhe.ufDestino ?? '—'"
                  outlined
                  label="UF"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaDetalhe.cfop ?? '—'"
                  outlined
                  label="CFOP"
                  readonly
                  input-class="text-metric"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="formatarMoeda(notaDetalhe.valorTotal)"
                  outlined
                  label="Valor total"
                  readonly
                  input-class="text-metric"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaDetalhe.emitidaEm ? formatarData(notaDetalhe.emitidaEm) : '—'"
                  outlined
                  label="Data de emissão"
                  readonly
                />
              </div>
              <div class="col-12">
                <q-input
                  :model-value="notaDetalhe.chaveAcesso ?? '—'"
                  outlined
                  label="Chave de acesso"
                  readonly
                  input-class="text-metric"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogDetalhe = false" />
              <agro-btn
                v-if="notaDetalhe.chaveAcesso"
                color="primary"
                unelevated
                icon="code"
                label="Baixar XML"
                descricao="Baixar XML da nota"
                @click="baixarXml(notaDetalhe.id)"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import {
  useNotasEntradaSaida,
  type FiltroTipoEntradaSaida,
} from 'composables/useNotasEntradaSaida';
import { TipoNotaFiscal } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { NotaFiscalGestaoDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const {
  filtradas,
  kpis,
  carregando,
  busca,
  filtroTipo,
  entradaDe,
  entradaAte,
  saidaDe,
  saidaAte,
  carregar,
  limparFiltros,
  baixarXml,
} = useNotasEntradaSaida();

const dialogDetalhe = ref(false);
const notaDetalhe = ref<NotaFiscalGestaoDto | null>(null);
const atalhoEntrada = ref('');
const atalhoSaida = ref('');

const periodoOpcoes = [
  { label: 'Livre', value: '' },
  { label: 'Hoje', value: 'hoje' },
  { label: 'Esta semana', value: 'semana' },
  { label: 'Este mês', value: 'mes' },
  { label: 'Mês anterior', value: 'mes_anterior' },
  { label: 'Trimestre', value: 'trimestre' },
];

const colunas: QTableColumn<NotaFiscalGestaoDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'numeroSerie', label: 'Nº / Série', field: 'numero', align: 'left' },
  {
    name: 'naturezaOperacao',
    label: 'Natureza',
    field: (row) => row.naturezaOperacao ?? '—',
    align: 'left',
  },
  { name: 'ufDestino', label: 'UF', field: (row) => row.ufDestino ?? '—', align: 'left' },
  { name: 'cfop', label: 'CFOP', field: (row) => row.cfop ?? '—', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
  { name: 'emitidaEm', label: 'Emissão', field: 'emitidaEm', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function calcularPeriodo(atalho: string): { de: string; ate: string } {
  if (!atalho) return { de: '', ate: '' };
  const hoje = new Date();
  const ate = isoLocal(hoje);
  if (atalho === 'hoje') return { de: ate, ate };
  if (atalho === 'semana') {
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7));
    return { de: isoLocal(inicio), ate };
  }
  if (atalho === 'mes') {
    return { de: isoLocal(new Date(hoje.getFullYear(), hoje.getMonth(), 1)), ate };
  }
  if (atalho === 'mes_anterior') {
    const de = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    return { de: isoLocal(de), ate: isoLocal(fim) };
  }
  if (atalho === 'trimestre') {
    const q = Math.floor(hoje.getMonth() / 3) * 3;
    return { de: isoLocal(new Date(hoje.getFullYear(), q, 1)), ate };
  }
  return { de: '', ate: '' };
}

function aplicarAtalhoEntrada(v: string | number | null): void {
  const { de, ate } = calcularPeriodo(String(v ?? ''));
  entradaDe.value = de;
  entradaAte.value = ate;
}

function aplicarAtalhoSaida(v: string | number | null): void {
  const { de, ate } = calcularPeriodo(String(v ?? ''));
  saidaDe.value = de;
  saidaAte.value = ate;
}

async function onTipo(tipo: FiltroTipoEntradaSaida): Promise<void> {
  filtroTipo.value = tipo;
  await carregar();
}

async function onLimpar(): Promise<void> {
  limparFiltros();
  atalhoEntrada.value = '';
  atalhoSaida.value = '';
  await carregar();
}

function abrirDetalhe(nota: NotaFiscalGestaoDto): void {
  notaDetalhe.value = nota;
  dialogDetalhe.value = true;
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.kpi-card {
  padding: var(--spacing-4);
}
.kpi-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
.kpi-valor {
  margin: var(--spacing-1) 0 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
.kpi-sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}
.tipo-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.periodo-titulo {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
.periodo--disabled {
  opacity: 0.45;
  pointer-events: none;
}
.dialog-detalhe {
  min-width: min(640px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
