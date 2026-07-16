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
          <q-tab name="nfpr" label="NFPR" />
        </q-tabs>

        <q-tab-panels v-model="aba" animated>
          <q-tab-panel name="nfe" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitNfe">
              <q-input
                v-model="pedidoId"
                outlined
                label="Pedido de venda (ID)"
                class="field-required"
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
              <q-input
                v-model="pdvVendaId"
                outlined
                label="Venda PDV (ID)"
                class="field-required"
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
              <q-input
                v-model="devolucaoId"
                outlined
                label="Devolução de venda (ID)"
                class="field-required"
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
                <div class="col-12 col-md-6">
                  <q-input v-model="cte.remetente" outlined label="Remetente" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="cte.destinatario"
                    outlined
                    label="Destinatário"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="cte.valor" outlined label="Valor" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="cte.ufDestino" outlined label="UF destino" maxlength="2" />
                </div>
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
                <div class="col-12 col-md-6">
                  <q-input v-model="mdfe.veiculo" outlined label="Veículo" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="mdfe.ufInicio"
                    outlined
                    label="UF início"
                    maxlength="2"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="mdfe.ufFim"
                    outlined
                    label="UF fim"
                    maxlength="2"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="mdfe.valorCarga"
                    outlined
                    label="Valor carga"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
              </div>
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn color="primary" unelevated label="Emitir MDF-e" type="submit" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="nfpr" class="q-pa-none">
            <q-form greedy class="agro-formulario" @submit.prevent="emitNfpr">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="nfpr.clienteId"
                    outlined
                    label="Cliente ID"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="nfpr.produtoId"
                    outlined
                    label="Produto ID"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="nfpr.quantidade"
                    outlined
                    label="Quantidade"
                    class="field-required"
                    :rules="[obrigatorio]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="nfpr.valor" outlined label="Valor" class="field-required" :rules="[obrigatorio]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="nfpr.cultura" outlined label="Cultura" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="nfpr.safra" outlined label="Safra" />
                </div>
              </div>
              <div class="agro-form-actions">
                <agro-btn flat label="Fechar" @click="emit('update:modelValue', false)" />
                <agro-btn color="primary" unelevated label="Emitir NFPR" type="submit" :loading="loading" />
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type {
  EmitirCteFormModel,
  EmitirMdfeFormModel,
  EmitirNfprFormModel,
} from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { reactive, ref, watch } from 'vue';

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
  nfpr: [form: EmitirNfprFormModel];
}>();

const aba = ref<'nfe' | 'nfce' | 'devolucao' | 'cte' | 'mdfe' | 'nfpr'>('nfe');
const pedidoId = ref('');
const pdvVendaId = ref('');
const devolucaoId = ref('');
const cte = reactive<EmitirCteFormModel>({
  remetente: '',
  destinatario: '',
  valor: '',
  ufDestino: '',
});
const mdfe = reactive<EmitirMdfeFormModel>({
  veiculo: '',
  ufInicio: '',
  ufFim: '',
  valorCarga: '',
});
const nfpr = reactive<EmitirNfprFormModel>({
  clienteId: '',
  produtoId: '',
  quantidade: '',
  valor: '',
  cultura: '',
  safra: '',
});

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    aba.value = 'nfe';
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

function emitNfpr(): void {
  emit('nfpr', { ...nfpr });
}
</script>

<style scoped>
.dialog {
  min-width: min(640px, 96vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
