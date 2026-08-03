<template>
  <agro-card>
    <div class="cotacao">
      <div class="cotacao__info">
        <div class="cotacao__titulo-row">
          <div class="text-caption">Cotação de mercado</div>
          <span v-if="proximaAtualizacaoTexto" class="cotacao__tick">{{ proximaAtualizacaoTexto }}</span>
        </div>

        <div v-if="itens.length > 0" class="cotacao__lista">
          <button
            v-for="item in itens"
            :key="`${item.fonte}-${item.produto}`"
            type="button"
            class="cotacao__item"
            :class="{ 'cotacao__item--ativo': selecionada?.produto === item.produto }"
            @click="selecionar(item)"
          >
            <span class="cotacao__produto">{{ item.produto }}</span>
            <span class="text-metric">{{ formatarPreco(item) }}</span>
            <span class="cotacao__unidade">{{ item.unidade }}</span>
          </button>
        </div>
        <div v-else-if="!loading" class="text-secondary">Nenhuma cotação carregada.</div>

        <p v-if="selecionada?.provedor" class="cotacao__meta">
          {{ rotuloFonte(selecionada.fonte) }} · {{ selecionada.provedor }}
          <span v-if="selecionada.consultadoEm"> · {{ formatarDataHora(selecionada.consultadoEm) }}</span>
        </p>
        <p v-if="selecionada?.aviso || selecionada?.indicativa" class="cotacao__aviso" role="note">
          {{ selecionada.aviso || avisoPadrao }}
        </p>
      </div>

      <div class="acoes">
        <q-select
          v-if="mostrarFonte"
          v-model="fonteLocal"
          outlined
          dense
          emit-value
          map-options
          label="Fonte"
          class="cotacao__fonte"
          :options="fontesOpcoes"
          @update:model-value="onFonte"
        />
        <agro-btn
          flat
          icon="refresh"
          label="Atualizar"
          descricao="Atualizar cotação"
          :loading="loading"
          @click="atualizarAgora"
        />
        <agro-btn
          v-if="mostrarAplicar && selecionada"
          color="primary"
          unelevated
          icon="content_paste"
          label="Aplicar no formulário"
          descricao="Aplicar cotação no formulário"
          @click="$emit('aplicar', selecionada)"
        />
      </div>
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import { FontePreco, type FontePrecoValor } from 'constants/enums';
import type { CotacaoMercadoDto } from 'types/dtos/contrato.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const INTERVALO_MS = 5 * 60 * 1000;

const props = withDefaults(
  defineProps<{
    cotacao: CotacaoMercadoDto | null;
    cotacoes?: CotacaoMercadoDto[];
    loading?: boolean;
    mostrarAplicar?: boolean;
    mostrarFonte?: boolean;
    fonte?: FontePrecoValor;
    autoAtualizar?: boolean;
  }>(),
  {
    cotacoes: () => [],
    loading: false,
    mostrarAplicar: false,
    mostrarFonte: true,
    fonte: FontePreco.Esalq,
    autoAtualizar: true,
  },
);

const emit = defineEmits<{
  atualizar: [];
  aplicar: [cotacao: CotacaoMercadoDto];
  'update:fonte': [fonte: FontePrecoValor];
}>();

const avisoPadrao =
  'Cotação de referência via fonte pública. Pode divergir do indicador oficial CEPEA/ESALQ ou do pregão CBOT. Não utilize como valor jurídico de liquidação sem conferência.';

const fontesOpcoes = [
  { label: 'ESALQ', value: FontePreco.Esalq },
  { label: 'CBOT', value: FontePreco.Cbot },
];

const fonteLocal = ref<FontePrecoValor>(props.fonte);
const selecionada = ref<CotacaoMercadoDto | null>(props.cotacao);
const segundosParaAtualizar = ref(INTERVALO_MS / 1000);

let timerRefresh: ReturnType<typeof setInterval> | null = null;
let timerCountdown: ReturnType<typeof setInterval> | null = null;

const itens = computed(() =>
  props.cotacoes.length > 0 ? props.cotacoes : props.cotacao ? [props.cotacao] : [],
);

const proximaAtualizacaoTexto = computed(() => {
  if (!props.autoAtualizar || props.loading) return '';
  const min = Math.floor(segundosParaAtualizar.value / 60);
  const seg = segundosParaAtualizar.value % 60;
  return `Atualiza em ${min}:${String(seg).padStart(2, '0')}`;
});

watch(
  () => props.fonte,
  (valor) => {
    fonteLocal.value = valor;
  },
);

watch(
  () => [props.cotacao, props.cotacoes] as const,
  () => {
    if (selecionada.value) {
      const aindaExiste = itens.value.find((i) => i.produto === selecionada.value?.produto);
      if (aindaExiste) {
        selecionada.value = aindaExiste;
        return;
      }
    }
    selecionada.value = itens.value[0] ?? props.cotacao;
  },
  { deep: true },
);

function onFonte(valor: FontePrecoValor): void {
  emit('update:fonte', valor);
  atualizarAgora();
}

function selecionar(item: CotacaoMercadoDto): void {
  selecionada.value = item;
}

function atualizarAgora(): void {
  reiniciarContagem();
  emit('atualizar');
}

function reiniciarContagem(): void {
  segundosParaAtualizar.value = INTERVALO_MS / 1000;
}

function rotuloFonte(fonte: FontePrecoValor | string): string {
  if (fonte === FontePreco.Cbot) return 'CBOT';
  if (fonte === FontePreco.Esalq) return 'ESALQ';
  return String(fonte);
}

function formatarPreco(cotacao: CotacaoMercadoDto): string {
  if (cotacao.fonte === FontePreco.Cbot || cotacao.unidade?.startsWith('USD')) {
    return cotacao.preco.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  return formatarMoeda(cotacao.preco);
}

onMounted(() => {
  if (!props.autoAtualizar) return;

  reiniciarContagem();
  timerRefresh = setInterval(() => {
    emit('atualizar');
    reiniciarContagem();
  }, INTERVALO_MS);

  timerCountdown = setInterval(() => {
    if (segundosParaAtualizar.value > 0) {
      segundosParaAtualizar.value -= 1;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerRefresh) clearInterval(timerRefresh);
  if (timerCountdown) clearInterval(timerCountdown);
});
</script>

<style scoped>
.cotacao {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.cotacao__info {
  display: grid;
  gap: var(--spacing-2);
  min-width: min(100%, 28rem);
  flex: 1;
}

.cotacao__titulo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.cotacao__tick {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-variant-numeric: tabular-nums;
}

.cotacao__lista {
  display: grid;
  gap: var(--spacing-2);
}

.cotacao__item {
  display: grid;
  grid-template-columns: 5rem 1fr auto;
  align-items: baseline;
  gap: var(--spacing-3);
  width: 100%;
  margin: 0;
  padding: var(--spacing-2) var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-default);
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--duration-fast);
}

.cotacao__item:hover {
  border-color: var(--color-primary-300);
}

.cotacao__item--ativo {
  border-color: var(--color-primary-500);
  border-left: var(--border-width-accent) solid var(--color-primary-500);
  background: var(--color-primary-50);
}

.cotacao__produto {
  font-family: var(--font-family-display);
  font-weight: var(--font-weight-semibold);
}

.cotacao__unidade {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.cotacao__meta {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.cotacao__aviso {
  margin: 0;
  padding: var(--spacing-2) var(--spacing-3);
  border-left: var(--border-width-accent) solid var(--color-warning-500);
  border-radius: var(--radius-md);
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  font-size: var(--font-size-sm);
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
}

.cotacao__fonte {
  min-width: 8rem;
}
</style>
