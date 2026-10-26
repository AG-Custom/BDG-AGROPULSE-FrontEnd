<template>
  <agro-card>
    <h3 class="apuracao-totais__titulo">Resultado da apuração</h3>
    <dl class="apuracao-totais__lista">
      <div
        v-for="linha in linhas"
        :key="linha.rotulo"
        class="apuracao-totais__linha"
        :class="{ 'apuracao-totais__linha--destaque': linha.destaque }"
      >
        <dt>{{ linha.rotulo }}</dt>
        <dd class="text-metric">{{ formatarMoeda(linha.valor) }}</dd>
      </div>
    </dl>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import type { TotaisApuracaoDto } from 'types/dtos/apuracao-fiscal.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed } from 'vue';

const props = defineProps<{ totais: TotaisApuracaoDto }>();

const linhas = computed(() => [
  { rotulo: 'Débitos pelos documentos', valor: props.totais.totalDebitos },
  { rotulo: 'Outros débitos (ajustes)', valor: props.totais.outrosDebitos },
  { rotulo: 'Estorno de créditos', valor: props.totais.estornosCreditos },
  { rotulo: 'Créditos pelos documentos', valor: props.totais.totalCreditos },
  { rotulo: 'Outros créditos (ajustes)', valor: props.totais.outrosCreditos },
  { rotulo: 'Estorno de débitos', valor: props.totais.estornosDebitos },
  { rotulo: 'Saldo credor do período anterior', valor: props.totais.saldoCredorAnterior },
  { rotulo: 'Saldo apurado', valor: props.totais.saldoApurado, destaque: true },
  { rotulo: 'Deduções', valor: props.totais.deducoes },
  { rotulo: 'Imposto a recolher', valor: props.totais.impostoARecolher, destaque: true },
  { rotulo: 'Saldo credor a transportar', valor: props.totais.saldoCredorATransportar, destaque: true },
]);
</script>

<style scoped>
.apuracao-totais__titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-3);
}

.apuracao-totais__lista {
  display: grid;
  gap: var(--spacing-2);
  margin: 0;
}

.apuracao-totais__linha {
  display: flex;
  justify-content: space-between;
}

.apuracao-totais__linha dt {
  color: var(--color-text-secondary);
}

.apuracao-totais__linha dd {
  margin: 0;
}

.apuracao-totais__linha--destaque {
  border-top: 1px solid var(--color-border-default);
  font-weight: var(--font-weight-semibold);
  padding-top: var(--spacing-2);
}

.apuracao-totais__linha--destaque dt {
  color: var(--color-text-primary);
}
</style>
