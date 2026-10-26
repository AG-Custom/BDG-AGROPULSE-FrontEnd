<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Perfil EFD-Contribuições</h4>
        <p class="subtitulo">
          Regime, CST de entrada e natureza do crédito são declarados aqui, não deduzidos. Confirme-os com o contador.
          O contabilista é o mesmo do perfil EFD ICMS/IPI, que precisa estar salvo.
        </p>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="emit('submit', { ...formulario })">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.codigoVersaoLeiaute"
                outlined
                mask="###"
                label="Código da versão do leiaute"
                hint="Conforme o período"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-select v-model="formulario.naturezaPessoaJuridica" outlined emit-value map-options label="Natureza da pessoa jurídica" :options="NaturezaPessoaJuridicaOpcoes" />
            </div>
            <div class="col-12">
              <q-select v-model="formulario.indicadorAtividade" outlined emit-value map-options label="Indicador de atividade" :options="IndicadorAtividadeContribuicoesOpcoes" />
            </div>
            <div class="col-12 col-md-5">
              <q-select v-model="formulario.codigoIncidencia" outlined emit-value map-options label="Incidência tributária" :options="IncidenciaContribuicoesOpcoes" />
            </div>
            <div class="col-12 col-md-7">
              <q-select
                v-model="formulario.indicadorRegimeCumulativo"
                outlined
                emit-value
                map-options
                label="Regime de apropriação (cumulativo)"
                :options="IndicadorRegimeCumulativoOpcoes"
                :disable="formulario.codigoIncidencia !== IncidenciaContribuicoes.Cumulativo"
              />
            </div>
            <div class="col-12">
              <q-select v-model="formulario.cstEntrada" outlined emit-value map-options label="CST de PIS/COFINS das entradas" :options="CstEntradaContribuicoesOpcoes" />
            </div>
            <div class="col-12">
              <q-select
                v-model="formulario.naturezaBaseCredito"
                outlined
                emit-value
                map-options
                clearable
                label="Natureza da base de cálculo do crédito"
                hint="Obrigatória para CST 50, 51 e 52"
                :options="NaturezaBaseCreditoOpcoes"
              />
            </div>
            <div class="col-12">
              <q-checkbox v-model="formulario.obrigadoBlocoF" label="Obrigado ao bloco F" />
              <q-checkbox v-model="formulario.obrigadoBlocoI" label="Obrigado ao bloco I" />
              <q-checkbox v-model="formulario.obrigadoBlocoP" label="Obrigado ao bloco P" />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  CstEntradaContribuicoesOpcoes,
  IncidenciaContribuicoes,
  IncidenciaContribuicoesOpcoes,
  IndicadorAtividadeContribuicoesOpcoes,
  IndicadorRegimeCumulativoOpcoes,
  NaturezaBaseCreditoOpcoes,
  NaturezaPessoaJuridicaOpcoes,
} from 'constants/enums';
import type { PerfilContribuicoesDto } from 'types/dtos/obrigacao-fiscal.dto';
import { perfilContribuicoesParaFormulario } from 'utils/mappers/perfil-contribuicoes.mapper';
import { obrigatorio } from 'utils/validators';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  perfil: PerfilContribuicoesDto | null;
  salvando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [form: PerfilContribuicoesDto];
}>();

const formulario = ref<PerfilContribuicoesDto>(perfilContribuicoesParaFormulario(props.perfil));

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) formulario.value = perfilContribuicoesParaFormulario(props.perfil);
  },
);

watch(
  () => formulario.value.codigoIncidencia,
  (incidencia) => {
    if (incidencia === IncidenciaContribuicoes.Cumulativo) {
      formulario.value.indicadorRegimeCumulativo ??= 1;
    } else {
      formulario.value.indicadorRegimeCumulativo = null;
    }
  },
);
</script>

<style scoped>
.dialog {
  min-width: min(720px, 94vw);
}

.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.subtitulo {
  margin: var(--spacing-2) 0 0;
  color: var(--color-text-secondary);
}
</style>
