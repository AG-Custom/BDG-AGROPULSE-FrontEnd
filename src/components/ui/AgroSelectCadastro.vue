<template>
  <div class="agro-select-cadastro">
    <q-select
      v-bind="attrs"
      :model-value="modelValue"
      outlined
      emit-value
      map-options
      :options="options"
      :loading="loading"
      :label="label"
      @update:model-value="onUpdate"
    />
    <div v-if="mostrarVazio" class="agro-select-cadastro__vazio">
      <span class="agro-select-cadastro__texto">
        Nenhum {{ config.rotulo }} cadastrado.
      </span>
      <button
        type="button"
        class="agro-select-cadastro__link"
        :aria-label="`Cadastrar ${config.rotulo} em nova aba`"
        @click="abrirCadastro"
      >
        Cadastrar
      </button>
      <span class="agro-select-cadastro__sep" aria-hidden="true">·</span>
      <button
        type="button"
        class="agro-select-cadastro__link"
        aria-label="Atualizar lista de opções"
        :disabled="loading"
        @click="emit('atualizar')"
      >
        Atualizar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SelectCadastroEntidadeConfig,
  type SelectCadastroEntidadeValor,
} from 'constants/select-cadastro';
import { computed, useAttrs } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: unknown;
    entidade: SelectCadastroEntidadeValor;
    options?: readonly { label: string; value: unknown }[] | { label: string; value: unknown }[];
    loading?: boolean;
    label?: string;
    desabilitarCadastro?: boolean;
  }>(),
  {
    modelValue: null,
    options: () => [],
    loading: false,
    label: undefined,
    desabilitarCadastro: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
  atualizar: [];
}>();

const attrs = useAttrs();
const router = useRouter();

const config = computed(() => SelectCadastroEntidadeConfig[props.entidade]);

const mostrarVazio = computed(
  () =>
    !props.desabilitarCadastro &&
    !props.loading &&
    (props.options?.length ?? 0) === 0,
);

function onUpdate(value: unknown): void {
  emit('update:modelValue', value);
}

function abrirCadastro(): void {
  const resolved = router.resolve({ name: config.value.routeName });
  window.open(resolved.href, '_blank', 'noopener,noreferrer');
}
</script>

<style scoped>
.agro-select-cadastro {
  display: grid;
  gap: var(--spacing-1);
  width: 100%;
}

.agro-select-cadastro__vazio {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  padding-inline: var(--spacing-1);
}

.agro-select-cadastro__texto {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.agro-select-cadastro__sep {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.agro-select-cadastro__link {
  background: none;
  border: 0;
  color: var(--color-text-link);
  cursor: pointer;
  font: inherit;
  font-size: var(--font-size-xs);
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.agro-select-cadastro__link:hover {
  color: var(--color-text-link-hover);
}

.agro-select-cadastro__link:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>
