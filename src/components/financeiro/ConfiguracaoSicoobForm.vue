<template>
  <q-form greedy class="agro-formulario" @submit.prevent="emit('salvar', certificado)">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-toggle v-model="modelo.sicoobHabilitado" color="primary" label="Integração Sicoob habilitada" />
      </div>
      <div class="col-12 col-md-6">
        <q-toggle
          v-model="modelo.sicoobHomologacao"
          color="primary"
          label="Ambiente de testes (sandbox)"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input v-model="modelo.sicoobClientId" outlined label="Client ID" />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-if="modelo.sicoobHomologacao"
          v-model="modelo.sicoobToken"
          outlined
          type="password"
          autocomplete="new-password"
          label="Token do sandbox"
          :hint="possuiToken ? 'Token já cadastrado — informe para substituir' : undefined"
        />
        <q-file
          v-else
          v-model="certificado"
          outlined
          accept=".pfx,.p12"
          label="Certificado digital (.pfx)"
          :hint="hintCertificado"
        />
      </div>
      <div v-if="!modelo.sicoobHomologacao" class="col-12 col-md-6">
        <q-input
          v-model="modelo.sicoobCertificadoSenha"
          outlined
          type="password"
          autocomplete="new-password"
          label="Senha do certificado"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="modelo.sicoobNumeroCliente" outlined label="Número do cliente" inputmode="numeric" />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="modelo.sicoobNumeroContrato" outlined label="Número do contrato" inputmode="numeric" />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model.number="modelo.sicoobModalidade" outlined type="number" label="Modalidade" />
      </div>
      <div class="col-12 col-md-6">
        <q-input v-model="modelo.sicoobNumeroContaCorrente" outlined label="Conta corrente" inputmode="numeric" />
      </div>
      <div class="col-12 col-md-6">
        <q-input v-model="modelo.sicoobChavePix" outlined label="Chave Pix (opcional)" />
      </div>
      <div class="col-12">
        <q-toggle
          v-model="modelo.gerarWebhookSegredo"
          color="primary"
          :label="possuiWebhookSegredo ? 'Gerar novo segredo do webhook' : 'Gerar segredo do webhook'"
        />
      </div>
    </div>
    <div class="agro-form-actions">
      <agro-btn
        color="primary"
        unelevated
        type="submit"
        label="Salvar configuração"
        descricao="Salvar configuração financeira"
        :loading="salvando"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { ConfiguracaoFinanceiraFormModel } from 'types/dtos/financeiro-gestao.dto';
import { formatarData } from 'utils/formatters';
import { computed, ref } from 'vue';

const props = defineProps<{
  salvando: boolean;
  possuiToken: boolean;
  possuiCertificado: boolean;
  possuiWebhookSegredo: boolean;
  certificadoValidoAte: string | null;
}>();
const emit = defineEmits<{ salvar: [certificado: File | null] }>();
const modelo = defineModel<ConfiguracaoFinanceiraFormModel>({ required: true });

const certificado = ref<File | null>(null);

const hintCertificado = computed(() => {
  if (!props.possuiCertificado) return undefined;
  const validade = props.certificadoValidoAte ? ` (válido até ${formatarData(props.certificadoValidoAte)})` : '';
  return `Certificado já cadastrado${validade} — envie outro para substituir`;
});
</script>
