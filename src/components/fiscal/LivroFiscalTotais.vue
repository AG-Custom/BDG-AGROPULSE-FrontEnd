<template>
  <div class="livro-totais">
    <agro-card v-for="bloco in blocos" :key="bloco.titulo" class="livro-totais__bloco">
      <h3 class="livro-totais__titulo">{{ bloco.titulo }}</h3>
      <p class="livro-totais__docs">{{ rotuloDocumentos(bloco.totais.documentos) }}</p>
      <dl class="livro-totais__lista">
        <div v-for="linha in linhas(bloco.totais)" :key="linha.rotulo" class="livro-totais__linha">
          <dt>{{ linha.rotulo }}</dt>
          <dd class="text-metric">{{ formatarMoeda(linha.valor) }}</dd>
        </div>
      </dl>
    </agro-card>
  </div>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import type { TotaisEscrituracaoDto } from 'types/dtos/escrituracao.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed } from 'vue';

const props = defineProps<{
  entradas: TotaisEscrituracaoDto;
  saidas: TotaisEscrituracaoDto;
}>();

const blocos = computed(() => [
  { titulo: 'Entradas', totais: props.entradas },
  { titulo: 'Saídas', totais: props.saidas },
]);

function linhas(totais: TotaisEscrituracaoDto): { rotulo: string; valor: number }[] {
  return [
    { rotulo: 'Valor dos documentos', valor: totais.valorTotal },
    { rotulo: 'ICMS', valor: totais.valorIcms },
    { rotulo: 'ICMS ST', valor: totais.valorIcmsSt },
    { rotulo: 'IPI', valor: totais.valorIpi },
    { rotulo: 'PIS', valor: totais.valorPis },
    { rotulo: 'COFINS', valor: totais.valorCofins },
  ];
}

function rotuloDocumentos(quantidade: number): string {
  return quantidade === 1 ? '1 documento regular' : `${quantidade} documentos regulares`;
}
</script>

<style scoped>
.livro-totais {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
}

.livro-totais__titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0;
}

.livro-totais__docs {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-1) 0 var(--spacing-3);
}

.livro-totais__lista {
  display: grid;
  gap: var(--spacing-2);
  margin: 0;
}

.livro-totais__linha {
  display: flex;
  justify-content: space-between;
}

.livro-totais__linha dt {
  color: var(--color-text-secondary);
}

.livro-totais__linha dd {
  margin: 0;
}
</style>
