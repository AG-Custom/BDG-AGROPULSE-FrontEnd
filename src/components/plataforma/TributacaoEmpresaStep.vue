<template>
  <q-form ref="formRef" class="tributacao-step" greedy>
    <div class="text-h6">Dados tributários</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-select
          v-model="tributacao.regimeTributario"
          outlined
          label="Regime tributário"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="RegimeTributarioOpcoes"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="tributacao.serieNfe"
          outlined
          label="Série da NF-e"
          class="field-required"
          maxlength="3"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
    </div>

    <estados-icms-section v-model:tributacao="tributacao" />
    <pis-cofins-ncm-section v-model:tributacao="tributacao" />
  </q-form>
</template>

<script setup lang="ts">
import EstadosIcmsSection from 'components/plataforma/EstadosIcmsSection.vue';
import PisCofinsNcmSection from 'components/plataforma/PisCofinsNcmSection.vue';
import { RegimeTributarioOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { TributacaoEmpresaFormModel } from 'types/dtos/plataforma.dto';
import { obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const tributacao = defineModel<TributacaoEmpresaFormModel>('tributacao', { required: true });

const formRef = ref<QForm | null>(null);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.tributacao-step {
  display: grid;
  gap: var(--spacing-4);
}
</style>
