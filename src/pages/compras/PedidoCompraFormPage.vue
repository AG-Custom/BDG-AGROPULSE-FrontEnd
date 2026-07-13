<template>
  <q-page class="agro-page">
    <app-page-header titulo="Novo pedido de compra" subtitulo="Informe fornecedor e itens." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="fornecedorId"
                outlined
                label="Fornecedor"
                class="field-required"
                emit-value
                map-options
                :options="fornecedorOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="observacao" outlined label="Observação" />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionar" />
          </div>

          <div v-for="(item, index) in itens" :key="item.chave" class="row q-col-gutter-md q-mb-sm">
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
              <q-input
                v-model="item.precoUnitario"
                outlined
                dense
                label="Preço"
                type="number"
                step="0.01"
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
                :disable="itens.length <= 1"
                @click="itens.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'pedidos-compra' }" />
            <agro-btn color="primary" unelevated label="Criar" descricao="Criar pedido" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import { useCompras } from 'composables/useCompras';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

interface ItemForm {
  chave: string;
  produtoId: string;
  quantidade: string;
  precoUnitario: string;
}

const router = useRouter();
const { salvando, criarPedido } = useCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();

const fornecedorId = ref('');
const observacao = ref('');
const itens = ref<ItemForm[]>([
  { chave: crypto.randomUUID(), produtoId: '', quantidade: '1', precoUnitario: '' },
]);

const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

function adicionar(): void {
  itens.value.push({
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    precoUnitario: '',
  });
}

async function salvar(): Promise<void> {
  const criado = await criarPedido({
    fornecedorId: fornecedorId.value,
    observacao: observacao.value.trim() || null,
    itens: itens.value.map((i) => ({
      produtoId: i.produtoId,
      quantidade: Number(i.quantidade),
      precoUnitario: Number(i.precoUnitario),
    })),
  });
  if (criado) await router.push({ name: 'pedido-compra-detalhe', params: { id: criado.id } });
}

onMounted(() => {
  void carregarFornecedores();
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
