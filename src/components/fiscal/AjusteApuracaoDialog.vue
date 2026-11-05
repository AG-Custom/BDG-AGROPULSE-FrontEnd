<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Novo ajuste</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="emit('submit', { ...formulario })">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-7">
              <q-select
                v-model="formulario.tipo"
                outlined
                emit-value
                map-options
                label="Tipo de ajuste"
                class="field-required"
                :options="tipos"
              />
            </div>
            <div class="col-12 col-md-5">
              <agro-money-input
                v-model="formulario.valor"
                label="Valor"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.descricao"
                outlined
                maxlength="255"
                label="Descrição"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.codigoAjuste"
                outlined
                maxlength="8"
                label="Código do ajuste (UF + 6 dígitos)"
                hint="Opcional. Obrigatório para gerar o registro de ajuste no arquivo."
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn color="primary" unelevated label="Adicionar" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { TipoAjusteApuracao, TipoAjusteApuracaoOpcoes, TributoApuracao } from 'constants/enums';
import type { TributoApuracaoValor } from 'constants/enums';
import type { AjusteApuracaoFormModel } from 'types/dtos/apuracao-fiscal.dto';
import { obrigatorio } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  tributo: TributoApuracaoValor;
  salvando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [form: AjusteApuracaoFormModel];
}>();

const tiposIpi: string[] = [
  TipoAjusteApuracao.OutrosDebitos,
  TipoAjusteApuracao.OutrosCreditos,
  TipoAjusteApuracao.SaldoCredorAnterior,
];

const tipos = computed(() =>
  props.tributo === TributoApuracao.Ipi
    ? TipoAjusteApuracaoOpcoes.filter((o) => tiposIpi.includes(o.value))
    : TipoAjusteApuracaoOpcoes,
);

function formularioInicial(): AjusteApuracaoFormModel {
  return {
    tipo: TipoAjusteApuracao.OutrosDebitos,
    valor: '',
    descricao: '',
    codigoAjuste: '',
  };
}

const formulario = ref<AjusteApuracaoFormModel>(formularioInicial());

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) formulario.value = formularioInicial();
  },
);
</script>

<style scoped>
.dialog {
  min-width: min(560px, 94vw);
}

.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
