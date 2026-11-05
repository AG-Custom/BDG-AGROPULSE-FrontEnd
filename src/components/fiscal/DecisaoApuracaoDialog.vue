<template>
  <q-dialog :model-value="documento !== null" persistent @update:model-value="fechar">
    <q-card v-if="documento" class="dialog">
      <q-card-section>
        <h4 class="titulo">Decisão do documento {{ documento.documento }}</h4>
        <p class="descricao">
          Operação de {{ documento.natureza }} com imposto de {{ formatarMoeda(documento.valorImposto) }}.
        </p>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="emit('submit', { ...formulario })">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="formulario.decisao"
                outlined
                emit-value
                map-options
                label="Tratamento na apuração"
                class="field-required"
                :options="opcoes"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.justificativa"
                outlined
                type="textarea"
                autogrow
                maxlength="500"
                label="Justificativa"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="fechar" />
            <agro-btn color="primary" unelevated label="Salvar decisão" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { DecisaoApuracao, DecisaoApuracaoOpcoes } from 'constants/enums';
import type { DecisaoApuracaoFormModel, DocumentoRevisaoDto } from 'types/dtos/apuracao-fiscal.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  documento: DocumentoRevisaoDto | null;
  salvando: boolean;
}>();

const emit = defineEmits<{
  fechar: [];
  submit: [form: DecisaoApuracaoFormModel];
}>();

const formulario = ref<DecisaoApuracaoFormModel>({
  decisao: DecisaoApuracao.Neutro,
  justificativa: '',
});

const opcoes = computed(() =>
  DecisaoApuracaoOpcoes.filter((o) => props.documento?.decisoesPermitidas.includes(o.value)),
);

watch(
  () => props.documento,
  (documento) => {
    if (!documento) return;
    formulario.value = {
      decisao: documento.decisaoAtual ?? documento.decisoesPermitidas[0] ?? DecisaoApuracao.Neutro,
      justificativa: documento.justificativa ?? '',
    };
  },
);

function fechar(): void {
  emit('fechar');
}
</script>

<style scoped>
.dialog {
  min-width: min(520px, 94vw);
}

.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.descricao {
  color: var(--color-text-secondary);
  margin: var(--spacing-2) 0 0;
}
</style>
