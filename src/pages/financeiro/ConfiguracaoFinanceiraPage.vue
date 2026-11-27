<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Configuração financeira"
      subtitulo="Credenciais e dados da conta Sicoob desta empresa."
    />

    <section class="agro-section configuracao">
      <q-banner v-if="segredoWebhook" rounded class="segredo">
        <p class="segredo__titulo">Segredo do webhook (aparece só agora)</p>
        <code class="segredo__valor">{{ segredoWebhook }}</code>
        <agro-btn
          flat
          dense
          icon="content_copy"
          label="Copiar"
          descricao="Copiar segredo do webhook"
          @click="copiar(segredoWebhook, 'Segredo')"
        />
      </q-banner>

      <agro-card>
        <h3 class="titulo">Sicoob</h3>
        <agro-form-skeleton v-if="carregando && !configuracao" :campos="6" />
        <configuracao-sicoob-form
          v-else
          v-model="formulario"
          :salvando="salvando"
          :possui-token="!!configuracao?.possuiToken"
          :possui-certificado="!!configuracao?.possuiCertificado"
          :possui-webhook-segredo="!!configuracao?.possuiWebhookSegredo"
          :certificado-valido-ate="configuracao?.certificadoValidoAte ?? null"
          @salvar="onSalvar"
        />
      </agro-card>

      <agro-card v-if="configuracao">
        <h3 class="titulo">Webhook</h3>
        <p class="texto">
          Cadastre no Sicoob o endereço público da API seguido do caminho abaixo, enviando o segredo no
          parâmetro <code>token</code>.
        </p>
        <code class="segredo__valor">{{ configuracao.webhookCaminho }}</code>
        <p class="texto">
          Segredo cadastrado: <strong>{{ configuracao.possuiWebhookSegredo ? 'sim' : 'não' }}</strong>
        </p>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ConfiguracaoSicoobForm from 'components/financeiro/ConfiguracaoSicoobForm.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useConfiguracaoFinanceira } from 'composables/useConfiguracaoFinanceira';
import type { ConfiguracaoFinanceiraFormModel } from 'types/dtos/financeiro-gestao.dto';
import { onMounted, ref, watch } from 'vue';

const { configuracao, segredoWebhook, carregando, salvando, carregar, salvar, copiar } =
  useConfiguracaoFinanceira();

const formulario = ref<ConfiguracaoFinanceiraFormModel>({
  sicoobHabilitado: false,
  sicoobHomologacao: true,
  sicoobClientId: '',
  sicoobNumeroCliente: '',
  sicoobNumeroContrato: '',
  sicoobModalidade: 1,
  sicoobNumeroContaCorrente: '',
  sicoobChavePix: '',
  sicoobToken: '',
  sicoobCertificadoSenha: '',
  removerCertificado: false,
  gerarWebhookSegredo: false,
});

watch(
  configuracao,
  (cfg) => {
    if (!cfg) return;
    formulario.value = {
      sicoobHabilitado: cfg.sicoobHabilitado,
      sicoobHomologacao: cfg.sicoobHomologacao,
      sicoobClientId: cfg.sicoobClientId ?? '',
      sicoobNumeroCliente: cfg.sicoobNumeroCliente ?? '',
      sicoobNumeroContrato: cfg.sicoobNumeroContrato ?? '',
      sicoobModalidade: cfg.sicoobModalidade,
      sicoobNumeroContaCorrente: cfg.sicoobNumeroContaCorrente ?? '',
      sicoobChavePix: cfg.sicoobChavePix ?? '',
      sicoobToken: '',
      sicoobCertificadoSenha: '',
      removerCertificado: false,
      gerarWebhookSegredo: false,
    };
  },
  { immediate: true },
);

async function onSalvar(certificado: File | null): Promise<void> {
  await salvar(formulario.value, certificado);
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.configuracao {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-4);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.texto {
  color: var(--color-text-secondary);
}
.segredo {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
}
.segredo__titulo {
  margin: 0 0 var(--spacing-2);
  font-weight: 600;
}
.segredo__valor {
  display: block;
  margin-bottom: var(--spacing-2);
  word-break: break-all;
}
</style>
