<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="relacionar-cfop-dialog">
      <q-card-section>
        <h4 class="relacionar-cfop-dialog__titulo">Relacionar CFOP de saída</h4>
      </q-card-section>
      <q-card-section>
        <q-form class="agro-formulario" greedy @submit.prevent="confirmar">
          <q-input
            :model-value="rotuloOrigem"
            outlined
            readonly
            label="CFOP"
          />
          <q-select
            v-model="cfopSaida"
            outlined
            clearable
            use-input
            input-debounce="200"
            label="CFOP de saída"
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
import type { CfopDto } from 'types/dtos/fiscal-gestao.dto';
import { computed, ref, watch } from 'vue';

interface OpcaoCfop {
  label: string;
  value: string;
}

const props = defineProps<{
  modelValue: boolean;
  cfop: CfopDto | null;
  opcoes: CfopDto[];
  salvando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [aberto: boolean];
  salvar: [cfopSaida: string | null];
}>();

const cfopSaida = ref<string | null>(null);
const opcoesFiltradas = ref<OpcaoCfop[]>([]);

const rotuloOrigem = computed(() =>
  props.cfop ? `${props.cfop.codigo} — ${props.cfop.descricao}` : '',
);

function montarOpcoes(termo: string): OpcaoCfop[] {
  const atual = props.cfop?.codigo;
  const consulta = termo.trim().toLowerCase();
  return props.opcoes
    .filter((item) => item.codigo !== atual)
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
  emit('salvar', cfopSaida.value);
}

watch(
  () => props.modelValue,
  (aberto) => {
    if (!aberto) return;
    cfopSaida.value = props.cfop?.cfopSaida ?? null;
    opcoesFiltradas.value = montarOpcoes('');
  },
);
</script>

<style scoped>
.relacionar-cfop-dialog {
  width: min(640px, 94vw);
}

.relacionar-cfop-dialog__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
