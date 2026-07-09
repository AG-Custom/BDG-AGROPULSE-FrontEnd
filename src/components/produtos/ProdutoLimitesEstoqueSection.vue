<template>
  <agro-card class="produto-limites-estoque">
    <template #header>
      <div class="produto-limites-estoque__header">
        <h3 class="produto-limites-estoque__titulo">Limites de estoque</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar limite"
          descricao="Adicionar limite de estoque desta unidade"
          @click="adicionarLinha"
        />
      </div>
    </template>

    <empty-state
      v-if="limites.length === 0"
      titulo="Nenhum limite configurado"
      descricao="Defina estoque mínimo e máximo desta unidade."
      icon="inventory"
    />

    <div v-else class="produto-limites-estoque__lista">
      <div
        v-for="(limite, indice) in limites"
        :key="indice"
        class="produto-limites-estoque__linha row q-col-gutter-md"
      >
        <div class="col-12 col-md-5">
          <q-input
            v-model="limite.estoqueMinimo"
            outlined
            dense
            label="Estoque mínimo"
            class="field-required"
            type="number"
            min="0"
            step="0.01"
            :disable="somenteLeitura"
          />
        </div>
        <div class="col-12 col-md-5">
          <q-input
            v-model="limite.estoqueMaximo"
            outlined
            dense
            label="Estoque máximo"
            type="number"
            min="0"
            step="0.01"
            hint="Opcional"
            :disable="somenteLeitura"
          />
        </div>
        <div v-if="!somenteLeitura" class="col-12 col-md-2 produto-limites-estoque__remover">
          <agro-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            descricao="Remover limite"
            @click="removerLinha(indice)"
          />
        </div>
      </div>
    </div>

    <div v-if="produtoId && limites.length > 0 && !somenteLeitura" class="produto-limites-estoque__acoes">
      <agro-btn
        color="primary"
        unelevated
        label="Salvar limites"
        descricao="Sincronizar limites de estoque do produto"
        :loading="salvando"
        @click="salvar"
      />
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAuth } from 'composables/useAuth';
import { useNotificacao } from 'composables/useNotificacao';
import { useProdutoLimitesEstoque } from 'composables/useProdutoLimitesEstoque';
import type { ProdutoLimiteEstoqueFormModel } from 'types/dtos/produto.dto';
import { criarLimiteEstoqueFormVazio } from 'utils/mappers/produto.mapper';

const props = defineProps<{
  produtoId?: string;
  somenteLeitura?: boolean;
}>();

const limites = defineModel<ProdutoLimiteEstoqueFormModel[]>('limites', { required: true });

const { unidadeId } = useAuth();
const { erro } = useNotificacao();
const { salvando, sincronizar } = useProdutoLimitesEstoque(() => props.produtoId);

function adicionarLinha(): void {
  limites.value = [...limites.value, criarLimiteEstoqueFormVazio(unidadeId.value)];
}

function removerLinha(indice: number): void {
  limites.value = limites.value.filter((_, i) => i !== indice);
}

function validarLimites(): boolean {
  return !limites.value.some(
    (limite) =>
      !limite.estoqueMinimo.trim() ||
      (limite.estoqueMaximo.trim() &&
        Number(limite.estoqueMinimo.replace(',', '.')) >
          Number(limite.estoqueMaximo.replace(',', '.'))),
  );
}

async function salvar(): Promise<void> {
  if (!validarLimites()) {
    return;
  }

  if (!unidadeId.value) {
    erro('Selecione uma unidade operacional para salvar os limites de estoque.');
    return;
  }

  await sincronizar(limites.value);
}

defineExpose({ validarLimites });
</script>

<style scoped>
.produto-limites-estoque__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.produto-limites-estoque__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.produto-limites-estoque__lista {
  display: grid;
  gap: var(--spacing-3);
}

.produto-limites-estoque__remover {
  align-items: center;
  display: flex;
  justify-content: center;
}

.produto-limites-estoque__acoes {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-4);
}
</style>
