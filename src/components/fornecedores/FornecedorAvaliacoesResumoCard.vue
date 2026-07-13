<template>
  <div class="fornecedor-avaliacoes-resumo">
    <agro-form-skeleton v-if="carregando && !resumo" :campos="4" />

    <template v-else-if="resumo">
      <div class="fornecedor-avaliacoes-resumo__totais">
        <div class="fornecedor-avaliacoes-resumo__metric">
          <div class="fornecedor-avaliacoes-resumo__label">Total de avaliações</div>
          <div class="text-metric fornecedor-avaliacoes-resumo__valor">
            {{ resumo.totalAvaliacoes }}
          </div>
        </div>
        <div class="fornecedor-avaliacoes-resumo__metric">
          <div class="fornecedor-avaliacoes-resumo__label">Média geral</div>
          <div class="text-metric fornecedor-avaliacoes-resumo__valor">
            {{ formatarNota(resumo.medias.geral) }}
          </div>
        </div>
      </div>

      <div class="fornecedor-avaliacoes-resumo__grid">
        <div class="fornecedor-avaliacoes-resumo__metric">
          <div class="fornecedor-avaliacoes-resumo__label">Preço</div>
          <div class="text-metric">{{ formatarNota(resumo.medias.preco) }}</div>
        </div>
        <div class="fornecedor-avaliacoes-resumo__metric">
          <div class="fornecedor-avaliacoes-resumo__label">Prazo</div>
          <div class="text-metric">{{ formatarNota(resumo.medias.prazo) }}</div>
        </div>
        <div class="fornecedor-avaliacoes-resumo__metric">
          <div class="fornecedor-avaliacoes-resumo__label">Qualidade</div>
          <div class="text-metric">{{ formatarNota(resumo.medias.qualidade) }}</div>
        </div>
        <div class="fornecedor-avaliacoes-resumo__metric">
          <div class="fornecedor-avaliacoes-resumo__label">Conformidade</div>
          <div class="text-metric">{{ formatarNota(resumo.medias.conformidade) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import type { FornecedorAvaliacoesResumoDto } from 'types/dtos/fornecedor.dto';
import { formatarDecimal } from 'utils/formatters';

defineProps<{
  resumo: FornecedorAvaliacoesResumoDto | null;
  carregando?: boolean;
}>();

function formatarNota(valor: number): string {
  return formatarDecimal(valor, 1);
}
</script>

<style scoped>
.fornecedor-avaliacoes-resumo {
  display: grid;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.fornecedor-avaliacoes-resumo__totais,
.fornecedor-avaliacoes-resumo__grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.fornecedor-avaliacoes-resumo__label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-1);
}

.fornecedor-avaliacoes-resumo__valor {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}
</style>
