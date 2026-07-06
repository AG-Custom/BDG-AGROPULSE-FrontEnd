<template>
  <div class="unidades-step">
    <div class="unidades-step__header">
      <div>
        <div class="text-h6">Unidades operacionais</div>
        <div class="text-body2 text-secondary">Cadastre ao menos uma unidade. Marque uma como matriz.</div>
      </div>
      <agro-btn
        outline
        color="primary"
        icon="add"
        label="Adicionar unidade"
        descricao="Incluir mais uma unidade operacional"
        @click="emit('adicionar')"
      />
    </div>

    <q-card v-for="(unidade, index) in unidades" :key="unidade.id" flat bordered class="unidade-card">
      <q-card-section class="unidade-card__header">
        <div class="text-subtitle1">Unidade {{ index + 1 }}</div>
        <agro-btn
          v-if="unidades.length > 1"
          flat
          round
          dense
          icon="delete"
          color="negative"
          descricao="Remover unidade"
          @click="emit('remover', unidade.id)"
        />
      </q-card-section>
      <q-card-section>
        <unidade-form
          :ref="(el) => registrarFormulario(el, index)"
          v-model:unidade="unidades[index]"
          @matriz-change="emit('matriz', $event)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import UnidadeForm from 'components/onboarding/UnidadeForm.vue';
import type { UnidadeFormModel } from 'types/dtos/onboarding.dto';
import type { ComponentPublicInstance } from 'vue';
import { ref, watch } from 'vue';

const unidades = defineModel<UnidadeFormModel[]>('unidades', { required: true });

const emit = defineEmits<{
  adicionar: [];
  remover: [id: string];
  matriz: [id: string];
}>();

type UnidadeFormExpose = ComponentPublicInstance<{ validar: () => Promise<boolean> }>;

const formularios = ref<(UnidadeFormExpose | null)[]>([]);

watch(
  () => unidades.value.length,
  (tamanho) => {
    formularios.value = formularios.value.slice(0, tamanho);
  },
);

function registrarFormulario(el: Element | ComponentPublicInstance | null, index: number): void {
  formularios.value[index] = el as UnidadeFormExpose | null;
}

async function validar(): Promise<boolean> {
  const resultados = await Promise.all(
    formularios.value.map((formulario) => formulario?.validar() ?? Promise.resolve(false)),
  );
  return resultados.length > 0 && resultados.every(Boolean);
}

defineExpose({ validar });
</script>

<style scoped>
.unidades-step {
  display: grid;
  gap: var(--spacing-4);
}

.unidades-step__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.unidade-card {
  border-radius: var(--radius-md);
}

.unidade-card__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0;
}
</style>
