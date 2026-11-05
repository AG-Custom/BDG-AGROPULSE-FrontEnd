<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="relacionar-icms-dialog">
      <q-card-section>
        <h4 class="relacionar-icms-dialog__titulo">Relacionar ICMS de saída</h4>
      </q-card-section>
      <q-card-section>
        <q-form class="agro-formulario" greedy @submit.prevent="confirmar">
          <q-input
            :model-value="rotuloOrigem"
            outlined
            readonly
            :label="rotuloTipo"
          />
          <q-select
            v-model="icmsSaida"
            outlined
            clearable
            use-input
            input-debounce="200"
            :label="`${rotuloTipo} de saída`"
            :hint="`Somente códigos do tipo ${rotuloTipo}`"
            :options="opcoesFiltradas"
            emit-value
            map-options
            @filter="filtrar"
          />
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
import type { IcmsDto } from 'types/dtos/fiscal-gestao.dto';
import { computed, ref, watch } from 'vue';

interface OpcaoIcms {
  label: string;
  value: string;
}

const props = defineProps<{
  modelValue: boolean;
  icms: IcmsDto | null;
  opcoes: IcmsDto[];
  salvando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [aberto: boolean];
  salvar: [icmsSaida: string | null];
}>();

const icmsSaida = ref<string | null>(null);
const opcoesFiltradas = ref<OpcaoIcms[]>([]);

const rotuloTipo = computed(() => (props.icms?.tipo === 'Csosn' ? 'CSOSN' : 'CST ICMS'));

const rotuloOrigem = computed(() =>
  props.icms ? `${props.icms.codigo} — ${props.icms.descricao}` : '',
);

function montarOpcoes(termo: string): OpcaoIcms[] {
  const atual = props.icms;
  if (!atual) return [];
  const consulta = termo.trim().toLowerCase();
  return props.opcoes
    .filter((item) => item.tipo === atual.tipo && item.codigo !== atual.codigo)
    .filter((item) =>
      consulta.length === 0
      || item.codigo.includes(consulta)
      || item.descricao.toLowerCase().includes(consulta),
    )
    .map((item) => ({
      label: `${item.codigo} — ${item.descricao}`,
      value: item.codigo,
    }));
}

function filtrar(valor: string, update: (callback: () => void) => void): void {
  update(() => {
    opcoesFiltradas.value = montarOpcoes(valor);
  });
}

function confirmar(): void {
  emit('salvar', icmsSaida.value);
}

watch(
  () => props.modelValue,
  (aberto) => {
    if (!aberto) return;
    icmsSaida.value = props.icms?.icmsSaida ?? null;
    opcoesFiltradas.value = montarOpcoes('');
  },
);
</script>

<style scoped>
.relacionar-icms-dialog {
  width: min(640px, 94vw);
}

.relacionar-icms-dialog__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
