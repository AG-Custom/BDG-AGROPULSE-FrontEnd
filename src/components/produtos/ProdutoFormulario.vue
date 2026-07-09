<template>
  <q-form ref="formRef" class="produto-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<h3 class="produto-formulario__secao-titulo">Identificação</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.codigo"
          outlined
          label="Código"
          class="field-required"
          maxlength="50"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.descricao"
          outlined
          label="Descrição"
          class="field-required"
          maxlength="300"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.categoriaProdutoId"
          outlined
          label="Categoria"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="categoriaOpcoes"
          :loading="carregandoCategorias"
          :readonly="somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.tipoProduto"
          outlined
          label="Tipo de produto"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="TipoProdutoOpcoes"
          :readonly="somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.unidadeMedidaId"
          outlined
          label="Unidade de medida"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="unidadeMedidaOpcoes"
          :loading="carregandoUnidadesMedida"
          :readonly="somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
    </div>

    <h3 class="produto-formulario__secao-titulo">Controle de estoque</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-toggle
          v-model="formulario.exigeLote"
          label="Exige lote"
          :disable="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-toggle
          v-model="formulario.exigeValidade"
          label="Exige validade"
          :disable="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-toggle
          v-model="formulario.exigeFabricacao"
          label="Exige fabricação"
          :disable="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="produto-formulario__secao-titulo">Comercial</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.margemMinimaPercentual"
          outlined
          label="Margem mínima (%)"
          type="number"
          min="0"
          step="0.01"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-if="modo === 'editar'" class="col-12 col-md-4">
        <q-select
          v-model="formulario.metodoCusteio"
          outlined
          label="Método de custeio"
          emit-value
          map-options
          clearable
          :options="MetodoCusteioOpcoes"
          :readonly="somenteLeitura"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import { MetodoCusteioOpcoes, TipoProdutoOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { ProdutoFormModel } from 'types/dtos/produto.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

defineProps<{
  modo: 'criar' | 'editar';
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<ProdutoFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

const {
  categorias,
  carregando: carregandoCategorias,
  carregar: carregarCategorias,
  rotuloCategoria,
} = useCategoriasProduto();

const {
  unidadesMedida,
  carregando: carregandoUnidadesMedida,
  carregar: carregarUnidadesMedida,
  rotuloUnidadeMedida,
} = useUnidadesMedida();

const categoriaOpcoes = computed(() =>
  categorias.value
    .filter((categoria) => categoria.ativo || categoria.id === formulario.value.categoriaProdutoId)
    .map((categoria) => ({
      label: rotuloCategoria(categoria),
      value: categoria.id,
    })),
);

const unidadeMedidaOpcoes = computed(() =>
  unidadesMedida.value
    .filter(
      (unidade) => unidade.ativo || unidade.id === formulario.value.unidadeMedidaId,
    )
    .map((unidade) => ({
      label: rotuloUnidadeMedida(unidade),
      value: unidade.id,
    })),
);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregarCategorias({ ativo: true });
  void carregarUnidadesMedida({ ativo: true });
});

defineExpose({ validar });
</script>

<style scoped>

.agro-formulario__fieldset {
  border: 0;
  margin: 0;
  min-width: 0;
  padding: 0;
}

.agro-formulario__fieldset:disabled {
  opacity: 1;
}

.produto-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.produto-formulario__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}
</style>
