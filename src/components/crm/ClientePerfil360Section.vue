<template>
  <agro-card class="perfil-360">
    <template #header>
      <div class="perfil-360__header">
        <div>
          <h3 class="perfil-360__titulo">Perfil 360°</h3>
          <p class="perfil-360__subtitulo">Visão comercial, agronômica e de crédito do cliente.</p>
        </div>
      </div>
    </template>

    <agro-form-skeleton v-if="carregando && !perfil360" :campos="4" />
    <template v-else>
      <q-tabs
        v-model="aba"
        dense
        class="perfil-360__tabs text-primary"
        active-color="primary"
        indicator-color="primary"
        align="left"
        outside-arrows
        mobile-arrows
      >
        <q-tab name="comercial" icon="storefront" label="Comercial" />
        <q-tab name="agronomico" icon="agriculture" label="Agronômico" />
        <q-tab name="visitas" icon="map" label="Visitas" />
        <q-tab name="credito" icon="account_balance" label="Crédito" />
        <q-tab name="preferencias" icon="tune" label="Preferências" />
      </q-tabs>

      <q-tab-panels v-model="aba" animated class="perfil-360__panels">
        <q-tab-panel name="comercial" class="q-pa-none q-pt-md">
          <cliente-historico-comercial-section embutido :cliente-id="clienteId" />
        </q-tab-panel>

        <q-tab-panel name="agronomico" class="q-pa-none q-pt-md">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-3">
              <metric-tile
                label="Área total"
                :value="`${formatarDecimal(carteiraCliente?.areaTotalHa ?? 0)} ha`"
                icon="square_foot"
                accent
              />
            </div>
            <div class="col-6 col-md-3">
              <metric-tile
                label="Fazendas"
                :value="carteiraCliente?.fazendas?.length ?? 0"
                icon="home_work"
              />
            </div>
            <div class="col-6 col-md-3">
              <metric-tile
                label="Oportunidades"
                :value="perfil360?.qtdOportunidades ?? 0"
                icon="trending_up"
              />
            </div>
            <div class="col-6 col-md-3">
              <metric-tile
                label="Amostras"
                :value="perfil360?.qtdAmostras ?? 0"
                icon="science"
              />
            </div>
          </div>

          <div class="perfil-360__bloco q-mb-md">
            <div class="perfil-360__bloco-titulo">Culturas</div>
            <div v-if="culturas.length" class="perfil-360__chips">
              <agro-badge v-for="cultura in culturas" :key="cultura" :label="cultura" variant="accent" />
            </div>
            <p v-else class="perfil-360__vazio">Nenhuma cultura registrada na carteira.</p>
          </div>

          <div class="perfil-360__bloco q-mb-md">
            <div class="perfil-360__bloco-titulo">Fazendas</div>
            <empty-state
              v-if="!fazendas.length"
              titulo="Sem fazendas"
              descricao="Este cliente ainda não tem fazendas na carteira agronômica."
              icon="agriculture"
            />
            <div v-else class="perfil-360__lista">
              <div v-for="fazenda in fazendas" :key="fazenda.id" class="perfil-360__item">
                <div class="perfil-360__item-icone">
                  <q-icon name="landscape" size="20px" />
                </div>
                <div class="perfil-360__item-corpo">
                  <div class="perfil-360__item-nome">{{ fazenda.nome }}</div>
                  <div class="text-caption text-secondary">
                    {{ rotuloLocal(fazenda) }}
                  </div>
                </div>
                <div class="text-metric perfil-360__item-meta">
                  {{
                    fazenda.areaTotalHa != null
                      ? `${formatarDecimal(fazenda.areaTotalHa)} ha`
                      : '—'
                  }}
                </div>
              </div>
            </div>
          </div>

          <div class="perfil-360__acoes">
            <agro-btn
              color="primary"
              unelevated
              icon="open_in_new"
              label="Abrir carteira agronômica"
              descricao="Ir para carteira"
              :to="{ name: 'crm-carteira', query: { clienteId } }"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="visitas" class="q-pa-none q-pt-md">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-4">
              <metric-tile
                label="Visitas técnicas"
                :value="perfil360?.qtdVisitas ?? 0"
                icon="map"
                accent
              />
            </div>
            <div class="col-6 col-md-4">
              <metric-tile
                label="Oportunidades"
                :value="perfil360?.qtdOportunidades ?? 0"
                icon="trending_up"
              />
            </div>
            <div class="col-12 col-md-4">
              <metric-tile
                label="Amostras de campo"
                :value="perfil360?.qtdAmostras ?? 0"
                icon="science"
              />
            </div>
          </div>

          <div class="perfil-360__callout">
            <div class="perfil-360__callout-icone">
              <q-icon name="info" size="22px" />
            </div>
            <div>
              <div class="perfil-360__bloco-titulo">Acompanhamento em Safras</div>
              <p class="perfil-360__callout-texto">
                O histórico detalhado de visitas técnicas, check-in e fotos fica no módulo de Safras.
                Use o atalho abaixo para abrir a lista filtrada deste cliente.
              </p>
            </div>
          </div>

          <div class="perfil-360__acoes">
            <agro-btn
              color="primary"
              unelevated
              icon="open_in_new"
              label="Abrir visitas técnicas"
              descricao="Ir para visitas"
              :to="{ name: 'safras-visitas-tecnicas', query: { clienteId } }"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="credito" class="q-pa-none q-pt-md">
          <template v-if="credito">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6 col-md-3">
                <metric-tile label="Score" :value="credito.score" icon="speed" accent />
              </div>
              <div class="col-6 col-md-3">
                <metric-tile
                  label="Classificação"
                  :value="credito.classificacao || '—'"
                  icon="grade"
                />
              </div>
              <div class="col-6 col-md-3">
                <metric-tile
                  label="Limite aprovado"
                  :value="
                    credito.limiteAprovado != null
                      ? formatarMoeda(credito.limiteAprovado)
                      : '—'
                  "
                  icon="verified"
                />
              </div>
              <div class="col-6 col-md-3">
                <metric-tile
                  label="Limite sugerido"
                  :value="formatarMoeda(credito.limiteSugerido)"
                  icon="request_quote"
                />
              </div>
            </div>

            <div class="perfil-360__bloco">
              <div class="perfil-360__meta-grid">
                <div>
                  <div class="text-caption text-secondary">Status</div>
                  <agro-badge :label="credito.status" variant="info" />
                </div>
                <div>
                  <div class="text-caption text-secondary">Analisado em</div>
                  <div>{{ formatarData(credito.analisadoEm) }}</div>
                </div>
                <div>
                  <div class="text-caption text-secondary">Adimplência</div>
                  <div class="text-metric">
                    {{
                      credito.adimplenciaPct != null
                        ? `${formatarDecimal(credito.adimplenciaPct)}%`
                        : '—'
                    }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-secondary">Parcelas em atraso</div>
                  <div class="text-metric">{{ credito.parcelasAtraso ?? '—' }}</div>
                </div>
              </div>
              <p v-if="credito.observacoes" class="perfil-360__obs">
                {{ credito.observacoes }}
              </p>
            </div>
          </template>
          <empty-state
            v-else
            titulo="Sem análise de crédito"
            descricao="Ainda não há score calculado para este cliente."
            icon="account_balance"
          />
        </q-tab-panel>

        <q-tab-panel name="preferencias" class="q-pa-none q-pt-md">
          <div class="perfil-360__acoes q-mb-md">
            <agro-btn
              color="primary"
              unelevated
              icon="add"
              label="Nova preferência"
              descricao="Adicionar preferência"
              @click="abrirPreferencia()"
            />
          </div>

          <empty-state
            v-if="preferencias.length === 0"
            titulo="Sem preferências"
            descricao="Cadastre preferências comerciais ou agronômicas deste cliente."
            icon="tune"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            :rows="preferencias"
            :columns="colunasPref"
            :rows-per-page-options="[5, 10]"
          >
            <template #body-cell-acoes="props">
              <q-td :props="props" class="acoes">
                <agro-acoes-menu
                  :mostrar-visualizar="false"
                  :mostrar-status="false"
                  mostrar-excluir
                  :loading-excluir="salvando"
                  editar-label="Editar preferência"
                  excluir-label="Remover preferência"
                  @editar="abrirPreferencia(props.row)"
                  @excluir="removerPreferencia(props.row.id, clienteId)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <q-dialog v-model="dialogPref" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="dialog-titulo">
            {{ editandoPrefId ? 'Editar preferência' : 'Nova preferência' }}
          </h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarPreferencia">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formPref.chave"
                  outlined
                  label="Chave"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formPref.valor"
                  outlined
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formPref.observacoes"
                  outlined
                  label="Observações"
                  type="textarea"
                  autogrow
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogPref = false" />
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
  </agro-card>
</template>

<script setup lang="ts">
import ClienteHistoricoComercialSection from 'components/clientes/ClienteHistoricoComercialSection.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MetricTile from 'components/ui/MetricTile.vue';
import { preferenciaVazia, useCrm } from 'composables/useCrm';
import type { QTableColumn } from 'quasar';
import type {
  CarteiraAgronomicaDto,
  FazendaCarteiraDto,
  PreferenciaClienteDto,
  PreferenciaClienteFormModel,
} from 'types/dtos/crm.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  clienteId: string;
}>();

const {
  perfil360,
  preferencias,
  carregando,
  salvando,
  carregarPerfil360,
  carregarCarteira,
  carteira,
  criarPreferencia,
  editarPreferencia,
  removerPreferencia,
} = useCrm();

const aba = ref('comercial');
const dialogPref = ref(false);
const editandoPrefId = ref<string | null>(null);
const formPref = ref<PreferenciaClienteFormModel>(preferenciaVazia());
const carteiraCliente = ref<CarteiraAgronomicaDto | null>(null);

const credito = computed(() => perfil360.value?.ultimaAnaliseCredito ?? null);
const culturas = computed(() => carteiraCliente.value?.culturas ?? []);
const fazendas = computed(() => carteiraCliente.value?.fazendas ?? []);

const colunasPref: QTableColumn<PreferenciaClienteDto>[] = [
  { name: 'chave', label: 'Chave', field: 'chave', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'left' },
  { name: 'observacoes', label: 'Observações', field: 'observacoes', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloLocal(fazenda: FazendaCarteiraDto): string {
  const municipio = fazenda.municipio?.trim();
  const uf = fazenda.uf?.trim();
  if (municipio && uf) return `${municipio}/${uf}`;
  return municipio || uf || 'Local não informado';
}

async function carregarDados(id: string): Promise<void> {
  await carregarPerfil360(id);
  await carregarCarteira({ clienteId: id });
  carteiraCliente.value = carteira.value;
}

function abrirPreferencia(item?: PreferenciaClienteDto): void {
  editandoPrefId.value = item?.id ?? null;
  formPref.value = item
    ? {
        chave: item.chave,
        valor: item.valor,
        observacoes: item.observacoes ?? '',
      }
    : preferenciaVazia();
  dialogPref.value = true;
}

async function salvarPreferencia(): Promise<void> {
  const ok = editandoPrefId.value
    ? await editarPreferencia(editandoPrefId.value, props.clienteId, formPref.value)
    : await criarPreferencia(props.clienteId, formPref.value);
  if (ok) dialogPref.value = false;
}

watch(
  () => props.clienteId,
  (id) => {
    if (id) void carregarDados(id);
  },
);

onMounted(() => {
  if (props.clienteId) void carregarDados(props.clienteId);
});
</script>

<style scoped>
.perfil-360__header {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.perfil-360__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.perfil-360__subtitulo {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-1) 0 0;
}

.perfil-360__tabs {
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
}

.perfil-360__panels {
  background: transparent;
}

.perfil-360__bloco {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}

.perfil-360__bloco-titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-3);
}

.perfil-360__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.perfil-360__vazio {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.perfil-360__lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.perfil-360__item {
  align-items: center;
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
}

.perfil-360__item-icone {
  align-items: center;
  background: var(--color-icon-bg-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary-600);
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.perfil-360__item-corpo {
  flex: 1;
  min-width: 0;
}

.perfil-360__item-nome {
  font-weight: var(--font-weight-medium);
}

.perfil-360__item-meta {
  flex-shrink: 0;
}

.perfil-360__callout {
  align-items: flex-start;
  background: var(--color-neutral-50);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-left: var(--border-width-accent) solid var(--color-primary-500);
  border-radius: var(--radius-md);
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-4);
}

.perfil-360__callout-icone {
  align-items: center;
  background: var(--color-icon-bg-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary-600);
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.perfil-360__callout-texto {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-1) 0 0;
}

.perfil-360__meta-grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 900px) {
  .perfil-360__meta-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.perfil-360__obs {
  border-top: var(--border-width-thin) solid var(--color-border-default);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-4) 0 0;
  padding-top: var(--spacing-3);
}

.perfil-360__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.dialog {
  min-width: min(480px, 94vw);
}

.dialog-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.acoes {
  white-space: nowrap;
}
</style>
