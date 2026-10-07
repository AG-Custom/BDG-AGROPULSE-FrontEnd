<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Emitir documentos</h4>
      </q-card-section>
      <q-card-section>
        <q-tabs v-model="aba" dense align="left" active-color="primary" class="q-mb-md">
          <q-tab name="nfe" label="NF-e" />
          <q-tab name="nfce" label="NFC-e" />
          <q-tab name="devolucao" label="Devolução" />
          <q-tab name="cte" label="CT-e" />
          <q-tab name="mdfe" label="MDF-e" />
        </q-tabs>

        <q-tab-panels v-model="aba" animated>
          <q-tab-panel name="nfe" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitNfe">
              <q-select
                v-model="pedidoId"
                outlined
                label="Pedido de venda"
                emit-value
                map-options
                class="field-required"
                :options="pedidoOpcoes"
                :loading="carregandoPedidos"
                :rules="[obrigatorio]"
              />
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn color="primary" unelevated label="Emitir NF-e" type="submit" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="nfce" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitNfce">
              <q-select
                v-model="pdvVendaId"
                outlined
                label="Venda PDV"
                emit-value
                map-options
                class="field-required"
                :options="pdvOpcoes"
                :loading="carregandoPdv"
                :rules="[obrigatorio]"
              />
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn color="primary" unelevated label="Emitir NFC-e" type="submit" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="devolucao" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitDevolucao">
              <q-select
                v-model="devolucaoId"
                outlined
                label="Devolução de venda"
                emit-value
                map-options
                class="field-required"
                :options="devolucaoOpcoes"
                :loading="carregandoDevolucoes"
                :rules="[obrigatorio]"
              />
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn
                  color="primary"
                  unelevated
                  label="Emitir NF devolução"
                  type="submit"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="cte" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitCte">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-8">
                  <q-input v-model="cte.naturezaOperacao" outlined label="Natureza da operação" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="cte.cfop" outlined label="CFOP" maxlength="4" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="cte.codigoMunicipioEnvio" outlined label="IBGE envio" maxlength="7" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-5">
                  <q-input v-model="cte.municipioEnvio" outlined label="Município envio" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="cte.ufEnvio" outlined label="UF envio" maxlength="2" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="cte.codigoMunicipioInicio" outlined label="IBGE início" maxlength="7" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-5">
                  <q-input v-model="cte.municipioInicio" outlined label="Município início" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="cte.ufInicio" outlined label="UF início" maxlength="2" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="cte.codigoMunicipioFim" outlined label="IBGE fim" maxlength="7" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-5">
                  <q-input v-model="cte.municipioFim" outlined label="Município fim" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="cte.ufFim" outlined label="UF fim" maxlength="2" class="field-required" :rules="[obrigatorio]" />
                </div>
              </div>
              <h5 class="secao">Remetente</h5>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4"><q-input v-model="cte.remetente.documento" outlined label="CPF ou CNPJ" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-8"><q-input v-model="cte.remetente.nome" outlined label="Nome" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-6"><q-input v-model="cte.remetente.logradouro" outlined label="Logradouro" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-2"><q-input v-model="cte.remetente.numero" outlined label="Número" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="cte.remetente.bairro" outlined label="Bairro" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="cte.remetente.cep" outlined label="CEP" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="cte.remetente.codigoMunicipio" outlined label="IBGE" maxlength="7" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="cte.remetente.municipio" outlined label="Município" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-2"><q-input v-model="cte.remetente.uf" outlined label="UF" maxlength="2" class="field-required" :rules="[obrigatorio]" /></div>
              </div>
              <h5 class="secao">Destinatário</h5>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4"><q-input v-model="cte.destinatario.documento" outlined label="CPF ou CNPJ" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-8"><q-input v-model="cte.destinatario.nome" outlined label="Nome" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-6"><q-input v-model="cte.destinatario.logradouro" outlined label="Logradouro" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-2"><q-input v-model="cte.destinatario.numero" outlined label="Número" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="cte.destinatario.bairro" outlined label="Bairro" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="cte.destinatario.cep" outlined label="CEP" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="cte.destinatario.codigoMunicipio" outlined label="IBGE" maxlength="7" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="cte.destinatario.municipio" outlined label="Município" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-2"><q-input v-model="cte.destinatario.uf" outlined label="UF" maxlength="2" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><AgroMoneyInput v-model="cte.valorServico" label="Valor do serviço" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="cte.aliquotaIcms" outlined label="Alíquota ICMS" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><AgroMoneyInput v-model="cte.valorIcms" label="Valor ICMS" class="field-required" :rules="[obrigatorio]" /></div>
              </div>
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn color="primary" unelevated label="Emitir CT-e" type="submit" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="mdfe" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitMdfe">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-3"><q-input v-model="mdfe.ufInicio" outlined label="UF início" maxlength="2" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.ufFim" outlined label="UF fim" maxlength="2" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.codigoMunicipioCarregamento" outlined label="IBGE carregamento" maxlength="7" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.municipioCarregamento" outlined label="Município carregamento" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.codigoMunicipioDescarregamento" outlined label="IBGE descarregamento" maxlength="7" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.municipioDescarregamento" outlined label="Município descarregamento" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.placa" outlined label="Placa" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mdfe.tara" outlined label="Tara (kg)" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-6"><q-input v-model="mdfe.condutorNome" outlined label="Condutor" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="mdfe.condutorCpf" outlined label="CPF do condutor" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><AgroMoneyInput v-model="mdfe.valorCarga" label="Valor da carga" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-md-4"><q-input v-model="mdfe.pesoBruto" outlined label="Peso bruto (kg)" class="field-required" :rules="[obrigatorio]" /></div>
                <div class="col-12">
                  <q-input v-model="mdfe.chaves" outlined type="textarea" autogrow label="Chaves dos documentos" class="field-required" :rules="[obrigatorio]" />
                </div>
              </div>
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn color="primary" unelevated label="Emitir MDF-e" type="submit" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { useDevolucoesVenda } from 'composables/useDevolucoesVenda';
import { usePdv } from 'composables/usePdv';
import { usePedidosVenda } from 'composables/usePedidosVenda';
import type {
  EmitirCteFormModel,
  EmitirMdfeFormModel,
  ParteTransporteFormModel,
} from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, reactive, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  nfe: [pedidoId: string];
  nfce: [pdvVendaId: string];
  devolucao: [devolucaoId: string];
  cte: [form: EmitirCteFormModel];
  mdfe: [form: EmitirMdfeFormModel];
}>();

const {
  pedidos,
  carregando: carregandoPedidos,
  carregar: carregarPedidos,
} = usePedidosVenda();
const {
  vendas: vendasPdv,
  carregando: carregandoPdv,
  carregarVendas: carregarPdv,
} = usePdv();
const {
  devolucoes,
  carregando: carregandoDevolucoes,
  carregar: carregarDevolucoes,
} = useDevolucoesVenda();

function parteVazia(): ParteTransporteFormModel {
  return {
    documento: '',
    nome: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cep: '',
    codigoMunicipio: '',
    municipio: '',
    uf: '',
  };
}

const aba = ref<'nfe' | 'nfce' | 'devolucao' | 'cte' | 'mdfe'>('nfe');
const pedidoId = ref('');
const pdvVendaId = ref('');
const devolucaoId = ref('');
const cte = reactive<EmitirCteFormModel>({
  naturezaOperacao: '',
  cfop: '',
  codigoMunicipioEnvio: '',
  municipioEnvio: '',
  ufEnvio: '',
  codigoMunicipioInicio: '',
  municipioInicio: '',
  ufInicio: '',
  codigoMunicipioFim: '',
  municipioFim: '',
  ufFim: '',
  remetente: parteVazia(),
  destinatario: parteVazia(),
  valorServico: '',
  aliquotaIcms: '',
  valorIcms: '',
});
const mdfe = reactive<EmitirMdfeFormModel>({
  ufInicio: '',
  ufFim: '',
  codigoMunicipioCarregamento: '',
  municipioCarregamento: '',
  codigoMunicipioDescarregamento: '',
  municipioDescarregamento: '',
  placa: '',
  tara: '',
  condutorNome: '',
  condutorCpf: '',
  valorCarga: '',
  pesoBruto: '',
  chaves: '',
});

const pedidoOpcoes = computed(() =>
  pedidos.value.map((p) => ({
    label: `${p.id.slice(0, 8)}… · ${formatarMoeda(p.valorTotal)} · ${formatarData(p.createdAt)}`,
    value: p.id,
  })),
);

const pdvOpcoes = computed(() =>
  vendasPdv.value.map((v) => ({
    label: `${v.id.slice(0, 8)}… · ${formatarMoeda(v.valorTotal)} · ${formatarData(v.createdAt)}`,
    value: v.id,
  })),
);

const devolucaoOpcoes = computed(() =>
  devolucoes.value.map((d) => ({
    label: `${d.id.slice(0, 8)}… · ${d.status} · ${formatarData(d.createdAt)}`,
    value: d.id,
  })),
);

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    aba.value = 'nfe';
    void carregarPedidos();
    void carregarPdv();
    void carregarDevolucoes();
  },
);

function emitNfe(): void {
  emit('nfe', pedidoId.value.trim());
}

function emitNfce(): void {
  emit('nfce', pdvVendaId.value.trim());
}

function emitDevolucao(): void {
  emit('devolucao', devolucaoId.value.trim());
}

function emitCte(): void {
  emit('cte', { ...cte });
}

function emitMdfe(): void {
  emit('mdfe', { ...mdfe });
}
</script>

<style scoped>
.dialog {
  min-width: min(880px, 96vw);
}
.titulo,
.secao {
  margin: 0;
  font-family: var(--font-family-display);
}
.titulo {
  font-size: var(--font-size-lg);
}
.secao {
  margin-top: var(--spacing-4);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}
</style>
