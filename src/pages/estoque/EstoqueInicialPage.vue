<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Estoque inicial"
      subtitulo="Lance o estoque inicial da unidade operacional uma única vez."
    />

    <section class="agro-section estoque-inicial">
      <agro-card>
        <agro-form-skeleton v-if="carregando && !status" :campos="4" />

        <template v-else-if="status">
          <q-banner
            v-if="status.jaLancado"
            rounded
            class="estoque-inicial__aviso"
          >
            Estoque inicial já lançado
            <span v-if="status.lancadoEm">
              em {{ formatarDataHora(status.lancadoEm) }}.
            </span>
            Não é possível lançar novamente nesta unidade.
          </q-banner>

          <template v-else>
            <p class="estoque-inicial__descricao">
              Informe os itens que compõem o estoque inicial. Produtos que exigem lote ou
              validade terão os campos correspondentes obrigatórios.
            </p>

            <div class="estoque-inicial__lista">
              <div
                v-for="(item, index) in itens"
                :key="index"
                class="estoque-inicial__item"
              >
                <div class="estoque-inicial__item-header">
                  <h3 class="estoque-inicial__item-titulo">Item {{ index + 1 }}</h3>
                  <agro-btn
                    v-if="itens.length > 1"
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    descricao="Remover item"
                    @click="removerItem(index)"
                  />
                </div>

                <entrada-estoque-formulario
                  :ref="(el) => definirRefFormulario(el, index)"
                  v-model:formulario="itens[index]"
                />
              </div>
            </div>

            <div class="estoque-inicial__acoes">
              <agro-btn
                flat
                icon="add"
                label="Adicionar item"
                descricao="Incluir outro item no estoque inicial"
                :disable="salvando"
                @click="adicionarItem"
              />
              <agro-btn
                color="primary"
                unelevated
                label="Lançar estoque inicial"
                descricao="Confirmar lançamento do estoque inicial"
                :loading="salvando"
                @click="lancarEstoque"
              />
            </div>
          </template>
        </template>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import EntradaEstoqueFormulario from 'components/estoque/EntradaEstoqueFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useEstoqueInicial } from 'composables/useEstoqueInicial';
import type { EntradaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { formatarDataHora } from 'utils/formatters';
import { criarEntradaFormVazia } from 'utils/mappers/estoque.mapper';
import { onMounted, ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';

type EntradaFormularioExposto = ComponentPublicInstance & {
  validar: () => Promise<boolean>;
};

const { status, carregando, salvando, carregarStatus, lancar } = useEstoqueInicial();

const itens = ref<EntradaEstoqueFormModel[]>([criarEntradaFormVazia()]);
const formulariosRef = ref<Array<EntradaFormularioExposto | null>>([]);

function definirRefFormulario(
  el: Element | ComponentPublicInstance | null,
  index: number,
): void {
  formulariosRef.value[index] = el as EntradaFormularioExposto | null;
}

function adicionarItem(): void {
  itens.value.push(criarEntradaFormVazia());
}

function removerItem(index: number): void {
  itens.value.splice(index, 1);
  formulariosRef.value.splice(index, 1);
}

async function lancarEstoque(): Promise<void> {
  const validacoes = await Promise.all(
    formulariosRef.value.map(async (formulario) => (await formulario?.validar()) ?? false),
  );

  if (validacoes.some((valido) => !valido)) {
    return;
  }

  await lancar(itens.value);
}

onMounted(() => {
  void carregarStatus();
});
</script>

<style scoped>
.estoque-inicial {
  display: grid;
  gap: var(--spacing-6);
}

.estoque-inicial__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.estoque-inicial__descricao {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-4);
}

.estoque-inicial__lista {
  display: grid;
  gap: var(--spacing-4);
}

.estoque-inicial__item {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}

.estoque-inicial__item-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.estoque-inicial__item-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.estoque-inicial__acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: space-between;
  margin-top: var(--spacing-6);
}
</style>
