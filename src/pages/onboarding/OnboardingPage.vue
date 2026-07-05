<template>
  <q-page class="onboarding-page">
    <section class="onboarding-panel agro-surface-raised">
      <header class="onboarding-panel__header">
        <div class="text-h5">Configure sua operação</div>
        <p class="text-body2 text-grey-7">
          Cadastre sua empresa e as unidades para começar a usar o AgroPulse.
        </p>
      </header>

      <q-stepper v-model="passo" flat animated color="primary">
        <q-step :name="1" title="Empresa" icon="business" :done="passo > 1">
          <empresa-step ref="empresaStepRef" v-model:empresa="empresa" />
          <q-stepper-navigation class="stepper-actions">
            <q-btn color="primary" unelevated label="Continuar" @click="avancarParaUnidades" />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="2" title="Unidades" icon="store" :disable="!empresaValidada">
          <unidades-step
            ref="unidadesStepRef"
            v-model:unidades="unidades"
            @adicionar="adicionarUnidade"
            @remover="removerUnidade"
            @matriz="definirMatriz"
          />
          <q-stepper-navigation class="stepper-actions">
            <q-btn flat label="Voltar" @click="passo = 1" />
            <q-btn
              color="primary"
              unelevated
              label="Concluir cadastro"
              :loading="salvando"
              @click="concluirCadastro"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import EmpresaStep from 'components/onboarding/EmpresaStep.vue';
import UnidadesStep from 'components/onboarding/UnidadesStep.vue';
import { useOnboarding } from 'composables/useOnboarding';
import { ref } from 'vue';

const passo = ref(1);
const empresaValidada = ref(false);
const empresaStepRef = ref<InstanceType<typeof EmpresaStep> | null>(null);
const unidadesStepRef = ref<InstanceType<typeof UnidadesStep> | null>(null);

const { empresa, unidades, salvando, adicionarUnidade, removerUnidade, definirMatriz, salvar } =
  useOnboarding();

async function avancarParaUnidades(): Promise<void> {
  const valido = (await empresaStepRef.value?.validar()) ?? false;
  if (!valido) {
    return;
  }

  empresaValidada.value = true;
  passo.value = 2;
}

async function concluirCadastro(): Promise<void> {
  const valido = (await unidadesStepRef.value?.validar()) ?? false;
  if (!valido) {
    return;
  }

  await salvar();
}
</script>

<style scoped>
.onboarding-page {
  display: flex;
  justify-content: center;
  padding: var(--spacing-6);
}

.onboarding-panel {
  max-width: 960px;
  padding: var(--spacing-6);
  width: 100%;
}

.onboarding-panel__header {
  display: grid;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
}

.stepper-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}
</style>
