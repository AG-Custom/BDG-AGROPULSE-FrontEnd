<template>
  <q-form ref="formRef" class="conversao-unidade-formulario" greedy>
    <template v-if="modo === 'criar'">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="unidadeOrigemId"
            outlined
            label="Unidade origem"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="unidadeMedidaOpcoes"
            :loading="carregandoUnidadesMedida"
            :rules="[obrigatorio]"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="unidadeDestinoId"
            outlined
            label="Unidade destino"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="unidadeMedidaOpcoes"
            :loading="carregandoUnidadesMedida"
            :rules="[obrigatorio]"
          />
        </div>
      </div>
    </template>

    <q-input
      v-model="fatorConversao"
      outlined
      label="Fator de conversão"
      class="field-required"
      type="number"
      min="0"
      step="any"
      hint="Ex.: 1 SC = 60 KG → fator 60"
      aria-required="true"
      :rules="[obrigatorio]"
    />
  </q-form>
</template>

<script setup lang="ts">
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import type { QForm } from 'quasar';
import type {
  ProdutoConversaoEdicaoFormModel,
  ProdutoConversaoFormModel,
} from 'types/dtos/produto.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar';
}>();

const formularioCriar = defineModel<ProdutoConversaoFormModel>('formularioCriar', {
  required: false,
});

const formularioEditar = defineModel<ProdutoConversaoEdicaoFormModel>('formularioEditar', {
  required: false,
});

const formRef = ref<QForm | null>(null);

const {
  unidadesMedida,
  carregando: carregandoUnidadesMedida,
  carregar: carregarUnidadesMedida,
  rotuloUnidadeMedida,
} = useUnidadesMedida();

const unidadeMedidaOpcoes = computed(() =>
  unidadesMedida.value
    .filter((unidade) => unidade.ativo)
    .map((unidade) => ({
      label: rotuloUnidadeMedida(unidade),
      value: unidade.id,
    })),
);

const unidadeOrigemId = computed({
  get() {
    return formularioCriar.value?.unidadeOrigemId ?? '';
  },
  set(valor: string) {
    if (formularioCriar.value) {
      formularioCriar.value.unidadeOrigemId = valor;
    }
  },
});

const unidadeDestinoId = computed({
  get() {
    return formularioCriar.value?.unidadeDestinoId ?? '';
  },
  set(valor: string) {
    if (formularioCriar.value) {
      formularioCriar.value.unidadeDestinoId = valor;
    }
  },
});

const fatorConversao = computed({
  get() {
    return props.modo === 'criar'
      ? formularioCriar.value?.fatorConversao ?? ''
      : formularioEditar.value?.fatorConversao ?? '';
  },
  set(valor: string) {
    if (props.modo === 'criar' && formularioCriar.value) {
      formularioCriar.value.fatorConversao = valor;
    } else if (formularioEditar.value) {
      formularioEditar.value.fatorConversao = valor;
    }
  },
});

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregarUnidadesMedida({ ativo: true });
});

defineExpose({ validar });
</script>

<style scoped>
.conversao-unidade-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
