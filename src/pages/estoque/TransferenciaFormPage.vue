<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header
      titulo="Nova transferência"
      subtitulo="Cria a transferência em status pendente. Confirme depois para movimentar o estoque."
    />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="transferencia-form" @submit.prevent="salvar">
          <agro-select-cadastro
            v-model="formulario.unidadeDestinoId"
            entidade="unidade"
            label="Unidade destino"
            class="field-required"
            aria-required="true"
            :options="unidadeDestinoOpcoes"
            :loading="carregandoUnidades"
            :rules="[obrigatorio]"
            @atualizar="carregarUnidades({ ativo: true })"
          />

          <q-input
            v-model="formulario.justificativa"
            outlined
            label="Justificativa"
            type="textarea"
            autogrow
            maxlength="1000"
          />

          <div class="transferencia-form__itens-header">
            <h3 class="transferencia-form__titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="transferencia-form__item"
          >
            <agro-select-cadastro
              v-model="item.produtoId"
              entidade="produto"
              dense
              label="Produto"
              class="field-required"
              :options="produtoOpcoes"
              :loading="carregandoProdutos"
              :rules="[obrigatorio]"
              @update:model-value="(valor) => onProdutoItem(index, valor)"
              @atualizar="carregarProdutos()"
            />

            <agro-select-cadastro
              v-model="item.loteId"
              entidade="lote"
              dense
              label="Lote (opcional)"
              clearable
              :loading="carregandoLotes"
              :options="loteOpcoesPorItem[item.chave] ?? []"
              :desabilitar-cadastro="!item.produtoId"
              @atualizar="atualizarLotesItem(index)"
            />

            <q-input
              v-model="item.quantidade"
              outlined
              dense
              label="Quantidade"
              class="field-required"
              type="number"
              min="0"
              step="any"
              :rules="[quantidadePositivaValidator]"
            />

            <agro-btn
              v-if="formulario.itens.length > 1"
              flat
              round
              dense
              icon="delete"
              color="negative"
              descricao="Remover item"
              @click="removerItem(index)"
            />
          </div>

          <div class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar"
              :to="{ name: 'estoque-transferencias' }"
            />
            <agro-btn
              color="primary"
              unelevated
              label="Criar"
              descricao="Criar transferência"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useEstoqueTransferencias } from 'composables/useEstoqueTransferencias';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { useUnidades } from 'composables/useUnidades';
import { useAuthStore } from 'stores/auth.store';
import type { TransferenciaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import {
  criarItemTransferenciaForm,
  criarTransferenciaFormVazia,
} from 'utils/mappers/estoque.mapper';
import { obrigatorio, quantidadePositiva } from 'utils/validators';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const { salvando, criar } = useEstoqueTransferencias();
const { unidades, carregando: carregandoUnidades, carregar: carregarUnidades } = useUnidades();
const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  carregar: carregarProdutos,
} = useProdutoOpcoesEstoque();
const { lotes, carregando: carregandoLotes, carregar: carregarLotes } = useEstoqueLotes();

const formulario = ref<TransferenciaEstoqueFormModel>(criarTransferenciaFormVazia());
const loteOpcoesPorItem = reactive<Record<string, Array<{ label: string; value: string }>>>({});
const quantidadePositivaValidator = quantidadePositiva;

const unidadeDestinoOpcoes = computed(() =>
  unidades.value
    .filter((unidade) => unidade.id !== authStore.unidadeId)
    .map((unidade) => ({
      label: unidade.nome,
      value: unidade.id,
    })),
);

function adicionarItem(): void {
  formulario.value.itens.push(criarItemTransferenciaForm());
}

function removerItem(index: number): void {
  const [removido] = formulario.value.itens.splice(index, 1);
  if (removido) {
    delete loteOpcoesPorItem[removido.chave];
  }
}

async function onProdutoItem(index: number, produtoIdValor: unknown): Promise<void> {
  const item = formulario.value.itens[index];
  if (!item) {
    return;
  }

  item.loteId = '';

  const produtoId = typeof produtoIdValor === 'string' ? produtoIdValor : '';

  if (!produtoId) {
    loteOpcoesPorItem[item.chave] = [];
    return;
  }

  await carregarLotes({ produtoId, apenasComSaldo: true });
  loteOpcoesPorItem[item.chave] = lotes.value.map((lote) => ({
    label: `${lote.numeroLote} — saldo ${formatarDecimal(lote.quantidade)}${
      lote.dataValidade ? ` — val. ${formatarData(lote.dataValidade)}` : ''
    }`,
    value: lote.id,
  }));
}

async function atualizarLotesItem(index: number): Promise<void> {
  const item = formulario.value.itens[index];
  if (!item?.produtoId) {
    return;
  }

  await carregarLotes({ produtoId: item.produtoId, apenasComSaldo: true });
  loteOpcoesPorItem[item.chave] = lotes.value.map((lote) => ({
    label: `${lote.numeroLote} — saldo ${formatarDecimal(lote.quantidade)}${
      lote.dataValidade ? ` — val. ${formatarData(lote.dataValidade)}` : ''
    }`,
    value: lote.id,
  }));
}

async function salvar(): Promise<void> {
  const criada = await criar(formulario.value);
  if (criada) {
    await router.push({ name: 'estoque-transferencia-detalhe', params: { id: criada.id } });
  }
}

onMounted(() => {
  void carregarUnidades({ ativo: true });
});
</script>

<style scoped>
.transferencia-form {
  display: grid;
  gap: var(--spacing-4);
}

.transferencia-form__itens-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.transferencia-form__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.transferencia-form__item {
  align-items: start;
  display: grid;
  gap: var(--spacing-3);
  grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) minmax(0, 1fr) auto;
}

@media (max-width: 900px) {
  .transferencia-form__item {
    grid-template-columns: 1fr;
  }
}
</style>
