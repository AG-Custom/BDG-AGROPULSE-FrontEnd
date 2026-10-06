<template>
  <div class="estados-icms">
    <q-select
      v-model="tributacao.estadosOperacao"
      outlined
      multiple
      use-chips
      emit-value
      map-options
      label="Estados de operação"
      :options="ufsOpcoes"
    />

    <div class="text-h6">Alíquotas de ICMS por UF</div>

    <empty-state
      v-if="tributacao.aliquotasIcms.length === 0"
      titulo="Nenhuma UF selecionada"
      descricao="Selecione os estados de operação para informar as alíquotas."
      icon="percent"
    />

    <div v-else class="estados-icms__lista">
      <div
        v-for="linha in tributacao.aliquotasIcms"
        :key="linha.uf"
        class="row q-col-gutter-md estados-icms__linha"
      >
        <div class="col-12 col-md-2">
          <q-input :model-value="linha.uf" outlined label="UF" readonly />
        </div>
        <div class="col-12 col-md-5">
          <q-input
            v-model="linha.aliquotaInterna"
            outlined
            label="Alíquota interna (%)"
            inputmode="decimal"
          />
        </div>
        <div class="col-12 col-md-5">
          <q-input
            v-model="linha.aliquotaInterestadual"
            outlined
            label="Alíquota interestadual (%)"
            inputmode="decimal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyState from 'components/ui/EmptyState.vue';
import { UFS_BRASIL } from 'constants/ufs';
import type { TributacaoEmpresaFormModel } from 'types/dtos/plataforma.dto';
import { watch } from 'vue';

const tributacao = defineModel<TributacaoEmpresaFormModel>('tributacao', { required: true });

const ufsOpcoes = [...UFS_BRASIL];

watch(
  () => [...tributacao.value.estadosOperacao],
  (ufs) => {
    const atuais = new Map(
      tributacao.value.aliquotasIcms.map((linha) => [linha.uf, linha]),
    );
    tributacao.value.aliquotasIcms = ufs.map((uf) => {
      const existente = atuais.get(uf);
      return (
        existente ?? {
          uf,
          aliquotaInterna: '',
          aliquotaInterestadual: '',
        }
      );
    });
  },
);
</script>

<style scoped>
.estados-icms {
  display: grid;
  gap: var(--spacing-4);
}

.estados-icms__lista {
  display: grid;
  gap: var(--spacing-4);
}
</style>
