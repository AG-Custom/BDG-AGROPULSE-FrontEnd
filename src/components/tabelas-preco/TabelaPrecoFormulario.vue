<template>
  <q-form ref="formRef" class="tabela-preco-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<h3 class="tabela-preco-formulario__secao-titulo">Identificação</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="formulario.nome"
          outlined
          label="Nome"
          class="field-required"
          maxlength="200"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.vigenciaInicio"
          outlined
          label="Vigência início"
          type="date"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.vigenciaFim"
          outlined
          label="Vigência fim"
          type="date"
          hint="Opcional"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="tabela-preco-formulario__secao-titulo">Escopo (opcional)</h3>
    <div class="row q-col-gutter-md">
      <div v-if="!clienteIdFixo" class="col-12 col-md-4">
        <agro-select-cadastro
          v-model="formulario.clienteId"
          entidade="cliente"
          label="Cliente"
          clearable
          :options="clienteOpcoes"
          :loading="carregandoClientes"
          :readonly="somenteLeitura"
          :desabilitar-cadastro="somenteLeitura"
          @atualizar="carregarClientes({ ativo: true })"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.grupoComercial"
          outlined
          label="Grupo comercial"
          emit-value
          map-options
          clearable
          :options="GrupoComercialOpcoes"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.canalVenda"
          outlined
          label="Canal de venda"
          emit-value
          map-options
          clearable
          :options="CanalVendaOpcoes"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.regiao"
          outlined
          label="Região"
          maxlength="100"
          :readonly="somenteLeitura"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useClientes } from 'composables/useClientes';
import { CanalVendaOpcoes, GrupoComercialOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { TabelaPrecoFormModel } from 'types/dtos/tabela-preco.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  somenteLeitura?: boolean;
  clienteIdFixo?: string;
}>();

const formulario = defineModel<TabelaPrecoFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

const { clientes, carregando: carregandoClientes, carregar: carregarClientes } = useClientes();

const clienteOpcoes = computed(() =>
  clientes.value
    .filter((cliente) => cliente.ativo || cliente.id === formulario.value.clienteId)
    .map((cliente) => ({
      label: cliente.nomeRazao,
      value: cliente.id,
    })),
);

watch(
  () => props.clienteIdFixo,
  (clienteId) => {
    if (clienteId) {
      formulario.value.clienteId = clienteId;
    }
  },
  { immediate: true },
);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  if (!props.clienteIdFixo) {
    void carregarClientes({ ativo: true });
  }
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

.tabela-preco-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.tabela-preco-formulario__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}
</style>
