<template>
  <q-page class="agro-page">
    <app-page-header titulo="Nova devolução" subtitulo="Informe o pedido e os itens devolvidos." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.pedidoVendaId"
                outlined
                label="ID do pedido de venda"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.observacao" outlined label="Observação" />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionar" />
          </div>

          <div v-for="(item, index) in formulario.itens" :key="item.chave" class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-5">
              <q-select
                v-model="item.produtoId"
                outlined
                dense
                label="Produto"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-4 col-md-2">
              <q-input v-model="item.quantidade" outlined dense label="Qtd" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-3">
              <q-select
                v-model="item.destino"
                outlined
                dense
                label="Destino"
                emit-value
                map-options
                :options="DestinoDevolucaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-2 col-md-2">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                :disable="formulario.itens.length <= 1"
                @click="formulario.itens.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'devolucoes-venda' }" />
            <agro-btn color="primary" unelevated label="Criar" descricao="Criar devolução" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import { useDevolucoesVenda } from 'composables/useDevolucoesVenda';
import { useProdutos } from 'composables/useProdutos';
import { DestinoDevolucaoOpcoes } from 'constants/enums';
import type { DevolucaoItemFormModel, DevolucaoVendaFormModel } from 'types/dtos/devolucao-venda.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

function novoItem(): DevolucaoItemFormModel {
  return { chave: crypto.randomUUID(), produtoId: '', quantidade: '1', destino: '' };
}

const router = useRouter();
const { salvando, criar } = useDevolucoesVenda();
const { produtos, carregar: carregarProdutos } = useProdutos();

const formulario = ref<DevolucaoVendaFormModel>({
  pedidoVendaId: '',
  observacao: '',
  itens: [novoItem()],
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

function adicionar(): void {
  formulario.value.itens.push(novoItem());
}

async function salvar(): Promise<void> {
  const criada = await criar(formulario.value);
  if (criada) await router.push({ name: 'devolucao-venda-detalhe', params: { id: criada.id } });
}

onMounted(() => {
  void carregarProdutos();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
