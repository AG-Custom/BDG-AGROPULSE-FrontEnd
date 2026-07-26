<template>
  <agro-card class="perfil-360">
    <template #header>
      <h3 class="perfil-360__titulo">Perfil 360°</h3>
    </template>

    <agro-form-skeleton v-if="carregando && !perfil360" :campos="4" />
    <template v-else>
      <q-tabs
        v-model="aba"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="comercial" label="Comercial" />
        <q-tab name="agronomico" label="Agronômico" />
        <q-tab name="visitas" label="Visitas" />
        <q-tab name="credito" label="Crédito" />
        <q-tab name="preferencias" label="Preferências" />
      </q-tabs>

      <q-tab-panels v-model="aba" animated class="perfil-360__panels">
        <q-tab-panel name="comercial" class="q-pa-none q-pt-md">
          <cliente-historico-comercial-section :cliente-id="clienteId" />
        </q-tab-panel>

        <q-tab-panel name="agronomico" class="q-pt-md">
          <div v-if="carteiraCliente" class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Área total (ha)</div>
              <div class="text-metric">
                {{ formatarDecimal(carteiraCliente.areaTotalHa) }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Fazendas</div>
              <div class="text-metric">{{ carteiraCliente.fazendas?.length ?? 0 }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption">Culturas</div>
              <div>
                {{
                  carteiraCliente.culturas?.length
                    ? carteiraCliente.culturas.join(', ')
                    : '—'
                }}
              </div>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-4">
              <div class="text-caption">Oportunidades</div>
              <div class="text-metric">{{ perfil360?.qtdOportunidades ?? 0 }}</div>
            </div>
            <div class="col-6 col-md-4">
              <div class="text-caption">Amostras</div>
              <div class="text-metric">{{ perfil360?.qtdAmostras ?? 0 }}</div>
            </div>
            <div class="col-6 col-md-4">
              <div class="text-caption">Visitas</div>
              <div class="text-metric">{{ perfil360?.qtdVisitas ?? 0 }}</div>
            </div>
          </div>
          <agro-btn
            color="primary"
            unelevated
            label="Abrir carteira agronômica"
            descricao="Ir para carteira"
            :to="{ name: 'crm-carteira', query: { clienteId } }"
          />
        </q-tab-panel>

        <q-tab-panel name="visitas" class="q-pt-md">
          <p class="text-body2">
            Visitas técnicas ficam no módulo de Safras. Total de visitas:
            <span class="text-metric">{{ perfil360?.qtdVisitas ?? 0 }}</span>
            · Oportunidades:
            <span class="text-metric">{{ perfil360?.qtdOportunidades ?? 0 }}</span>
            · Amostras:
            <span class="text-metric">{{ perfil360?.qtdAmostras ?? 0 }}</span>
          </p>
          <agro-btn
            color="primary"
            unelevated
            label="Abrir visitas técnicas"
            descricao="Ir para visitas"
            :to="{ name: 'safras-visitas-tecnicas' }"
          />
        </q-tab-panel>

        <q-tab-panel name="credito" class="q-pt-md">
          <div v-if="perfil360?.ultimaAnaliseCredito" class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Score</div>
              <div class="text-metric">{{ perfil360.ultimaAnaliseCredito.score }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Classificação</div>
              <div>{{ perfil360.ultimaAnaliseCredito.classificacao || '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Limite aprovado</div>
              <div class="text-metric">
                {{
                  perfil360.ultimaAnaliseCredito.limiteAprovado != null
                    ? formatarMoeda(perfil360.ultimaAnaliseCredito.limiteAprovado)
                    : '—'
                }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Limite sugerido</div>
              <div class="text-metric">
                {{ formatarMoeda(perfil360.ultimaAnaliseCredito.limiteSugerido) }}
              </div>
            </div>
          </div>
          <empty-state
            v-else
            titulo="Sem análise de crédito"
            descricao="Ainda não há score calculado para este cliente."
            icon="account_balance"
          />
        </q-tab-panel>

        <q-tab-panel name="preferencias" class="q-pt-md">
          <div class="preferencias-acoes q-mb-md">
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
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { preferenciaVazia, useCrm } from 'composables/useCrm';
import type { QTableColumn } from 'quasar';
import type {
  CarteiraAgronomicaDto,
  PreferenciaClienteDto,
  PreferenciaClienteFormModel,
} from 'types/dtos/crm.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref, watch } from 'vue';

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

const colunasPref: QTableColumn<PreferenciaClienteDto>[] = [
  { name: 'chave', label: 'Chave', field: 'chave', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'left' },
  { name: 'observacoes', label: 'Observações', field: 'observacoes', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

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
.perfil-360__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.perfil-360__panels {
  background: transparent;
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
