<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Liquidação financeira</h4>
        <p class="text-caption text-secondary">
          Confirme a cotação aplicada para liquidar o saldo pendente.
        </p>
      </q-card-section>
      <q-card-section>
        <div v-if="cotacao" class="cotacao-box q-mb-md">
          <div class="text-caption">Cotação sugerida</div>
          <div>
            {{ cotacao.produto }} · {{ cotacao.fonte }} ·
            <span class="text-metric">{{ formatarMoeda(cotacao.preco) }}</span>
          </div>
          <agro-btn
            flat
            dense
            label="Usar cotação"
            descricao="Aplicar cotação sugerida"
            @click="usarCotacao"
          />
        </div>

        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <AgroMoneyInput
                v-model="form.precoLiquidacao"
                label="Preço de liquidação"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.fontePreco"
                outlined
                label="Fonte do preço"
                emit-value
                map-options
                :options="FontePrecoOpcoes"
              />
            </div>
            <div class="col-12">
              <q-input v-model="form.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
            <div v-if="valorEstimado != null" class="col-12">
              <div class="text-caption">Valor estimado da liquidação</div>
              <div class="text-metric">{{ formatarMoeda(valorEstimado) }}</div>
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="$emit('update:modelValue', false)" />
            <agro-btn
              color="primary"
              unelevated
              label="Liquidar"
              descricao="Confirmar liquidação"
              type="submit"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { FontePrecoOpcoes, type FontePrecoValor } from 'constants/enums';
import type {
  CotacaoMercadoDto,
  LiquidacaoFormModel,
  LiquidarContratoPayload,
} from 'types/dtos/contrato.dto';
import { formatarMoeda, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  cotacao?: CotacaoMercadoDto | null;
  saldoPendente?: number | null;
  precoSugerido?: number | null;
  fonteSugerida?: FontePrecoValor | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirmar: [payload: LiquidarContratoPayload];
}>();

const form = reactive<LiquidacaoFormModel>({
  precoLiquidacao: '',
  fontePreco: '',
  observacao: '',
});

const valorEstimado = computed(() => {
  const preco = parseMascaraMoeda(form.precoLiquidacao);
  if (preco === null || props.saldoPendente == null) return null;
  return preco * props.saldoPendente;
});

function reset(): void {
  form.precoLiquidacao =
    props.precoSugerido != null
      ? formatarMoedaParaInput(props.precoSugerido)
      : props.cotacao
        ? formatarMoedaParaInput(props.cotacao.preco)
        : '';
  form.fontePreco = props.fonteSugerida ?? props.cotacao?.fonte ?? '';
  form.observacao = '';
}

function usarCotacao(): void {
  if (!props.cotacao) return;
  form.precoLiquidacao = formatarMoedaParaInput(props.cotacao.preco);
  form.fontePreco = props.cotacao.fonte;
}

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) reset();
  },
);

function confirmar(): void {
  const preco = parseMascaraMoeda(form.precoLiquidacao);
  emit('confirmar', {
    precoLiquidacaoManual: preco !== null && preco > 0 ? preco : null,
  });
}
</script>

<style scoped>
.dialog {
  max-width: 520px;
  width: 100%;
}

.titulo {
  margin: 0 0 var(--spacing-2);
}

.cotacao-box {
  align-items: flex-start;
  background: var(--color-surface-sunken);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  display: grid;
  gap: var(--spacing-1);
  padding: var(--spacing-3);
}
</style>
