<template>
  <div class="pis-cofins">
    <div class="pis-cofins__cabecalho">
      <div class="text-h6">PIS/COFINS por NCM</div>
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Adicionar NCM"
        descricao="Incluir regra de PIS/COFINS"
        @click="adicionar"
      />
    </div>

    <div
      v-for="(linha, indice) in tributacao.pisCofinsNcm"
      :key="linha.id"
      class="pis-cofins__card"
    >
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="linha.ncm"
            outlined
            label="NCM"
            class="field-required"
            maxlength="8"
            inputmode="numeric"
            :rules="[obrigatorio]"
          />
        </div>
        <div class="col-6 col-md-2">
          <q-input v-model="linha.cstPis" outlined label="CST PIS" class="field-required" :rules="[obrigatorio]" />
        </div>
        <div class="col-6 col-md-2">
          <q-input
            v-model="linha.cstCofins"
            outlined
            label="CST COFINS"
            class="field-required"
            :rules="[obrigatorio]"
          />
        </div>
        <div class="col-6 col-md-2">
          <q-input
            v-model="linha.aliquotaPis"
            outlined
            label="Alíquota PIS"
            class="field-required"
            inputmode="decimal"
            :rules="[obrigatorio]"
          />
        </div>
        <div class="col-6 col-md-3">
          <q-input
            v-model="linha.aliquotaCofins"
            outlined
            label="Alíquota COFINS"
            class="field-required"
            inputmode="decimal"
            :rules="[obrigatorio]"
          />
        </div>
        <div class="col-6 col-md-3">
          <q-input
            v-model="linha.vigenciaInicio"
            outlined
            type="date"
            label="Vigência início"
            class="field-required"
            :rules="[obrigatorio]"
          />
        </div>
        <div class="col-6 col-md-3">
          <q-input v-model="linha.vigenciaFim" outlined type="date" label="Vigência fim" />
        </div>
        <div class="col-12 col-md-4 pis-cofins__acoes">
          <div class="pis-cofins__suspenso">
            <q-toggle v-model="linha.suspenso" label="Suspenso" color="primary" />
            <q-icon
              name="info"
              size="18px"
              class="pis-cofins__info text-tertiary"
              aria-label="Sobre regra suspensa"
            >
              <q-tooltip max-width="280px">
                Marque para desativar esta regra de PIS/COFINS sem apagá-la. Enquanto estiver
                suspensa, o NCM não usa essas alíquotas no cálculo.
              </q-tooltip>
            </q-icon>
          </div>
          <agro-btn
            v-if="tributacao.pisCofinsNcm.length > 1"
            flat
            icon="delete"
            label="Remover"
            descricao="Remover esta regra"
            aria-label="Remover regra PIS/COFINS"
            @click="remover(indice)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { criarPisCofinsNcmVazio, type TributacaoEmpresaFormModel } from 'types/dtos/plataforma.dto';
import { obrigatorio } from 'utils/validators';

const tributacao = defineModel<TributacaoEmpresaFormModel>('tributacao', { required: true });

function adicionar(): void {
  tributacao.value.pisCofinsNcm.push(criarPisCofinsNcmVazio());
}

function remover(indice: number): void {
  tributacao.value.pisCofinsNcm.splice(indice, 1);
}
</script>

<style scoped>
.pis-cofins {
  display: grid;
  gap: var(--spacing-4);
}

.pis-cofins__cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.pis-cofins__card {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}

.pis-cofins__acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.pis-cofins__suspenso {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.pis-cofins__info {
  cursor: help;
  flex-shrink: 0;
}
</style>
