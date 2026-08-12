<template>
  <q-form ref="formRef" class="documentos-step" greedy>
    <div class="text-h6">Certificado digital</div>

    <q-select
      v-model="documentos.tipoCertificado"
      outlined
      label="Tipo do certificado"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="TipoCertificadoDigitalOpcoes"
      :rules="[obrigatorio]"
    />

    <div class="text-h6">Ficha do cliente</div>

    <div v-if="fichaAtual" class="documentos-step__atual">
      <span>{{ fichaAtual.nomeOriginal }}</span>
      <a
        v-if="fichaAtual.urlPublica"
        :href="fichaAtual.urlPublica"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir
      </a>
    </div>

    <q-file
      v-model="documentos.arquivoFicha"
      outlined
      label="Ficha do cliente (PDF)"
      accept="application/pdf,.pdf"
      :class="{ 'field-required': exigirFicha }"
      :rules="exigirFicha ? [arquivoObrigatorio] : []"
    />
  </q-form>
</template>

<script setup lang="ts">
import { TipoCertificadoDigitalOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { DocumentosEmpresaFormModel, FichaClientePlataformaDto } from 'types/dtos/plataforma.dto';
import { obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const documentos = defineModel<DocumentosEmpresaFormModel>('documentos', { required: true });

defineProps<{
  exigirFicha?: boolean;
  fichaAtual?: FichaClientePlataformaDto | null;
}>();

const formRef = ref<QForm | null>(null);

function arquivoObrigatorio(valor: File | null): true | string {
  return valor ? true : 'Selecione um arquivo.';
}

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.documentos-step {
  display: grid;
  gap: var(--spacing-4);
  max-width: 560px;
}

.documentos-step__atual {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  color: var(--color-text-secondary);
}

.documentos-step__atual a {
  color: var(--color-primary-500);
}
</style>
