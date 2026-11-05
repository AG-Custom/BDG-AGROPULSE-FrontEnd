<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">{{ conta ? 'Editar conta contábil' : 'Nova conta contábil' }}</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="emit('submit', { ...formulario })">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="formulario.paiId"
                outlined
                emit-value
                map-options
                clearable
                label="Conta superior"
                :options="paiOpcoes"
                :readonly="!!conta"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.codigo"
                outlined
                label="Código"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="!!conta"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="formulario.nome"
                outlined
                label="Nome"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.natureza"
                outlined
                emit-value
                map-options
                label="Natureza"
                class="field-required"
                :options="NaturezaContaContabilOpcoes"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-toggle v-model="formulario.analitica" label="Conta analítica (aceita lançamentos)" />
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
import { NaturezaContaContabil, NaturezaContaContabilOpcoes } from 'constants/enums';
import type { ContaContabilDto, ContaContabilFormModel } from 'types/dtos/plano-contas.dto';
import { obrigatorio } from 'utils/validators';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  conta: ContaContabilDto | null;
  salvando: boolean;
  paiOpcoes: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [form: ContaContabilFormModel];
}>();

function formularioInicial(): ContaContabilFormModel {
  return {
    codigo: props.conta?.codigo ?? '',
    nome: props.conta?.nome ?? '',
    natureza: props.conta?.natureza ?? NaturezaContaContabil.Ativo,
    analitica: props.conta?.analitica ?? true,
    paiId: props.conta?.paiId ?? null,
  };
}

const formulario = ref<ContaContabilFormModel>(formularioInicial());

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
