<template>
  <q-page class="agro-page">
    <app-page-header titulo="Nova cotação" subtitulo="Defina prazo e itens para cotar." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input v-model="dataLimite" outlined label="Data limite" type="date" class="field-required" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-8">
              <q-input v-model="observacao" outlined label="Observação" />
            </div>
          </div>

          <div class="cotacao-form__header">
            <h3 class="cotacao-form__titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionar" />
          </div>

          <div v-for="(item, index) in itens" :key="item.chave" class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-7">
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
            <div class="col-8 col-md-3">
              <q-input v-model="item.quantidade" outlined dense label="Quantidade" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-4 col-md-2">
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
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'cotacoes-compra' }" />
            <agro-btn color="primary" unelevated label="Criar" descricao="Criar cotação" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import { useCompras } from 'composables/useCompras';
import { useProdutos } from 'composables/useProdutos';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

interface ItemForm {
  chave: string;
  produtoId: string;
  quantidade: string;
}

const router = useRouter();
const { salvando, criarCotacao } = useCompras();
const { produtos, carregar: carregarProdutos } = useProdutos();

const dataLimite = ref('');
const observacao = ref('');
const itens = ref<ItemForm[]>([{ chave: crypto.randomUUID(), produtoId: '', quantidade: '1' }]);

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

function adicionar(): void {
  itens.value.push({ chave: crypto.randomUUID(), produtoId: '', quantidade: '1' });
}

async function salvar(): Promise<void> {
  const criada = await criarCotacao({
    dataLimite: dataLimite.value,
    observacao: observacao.value.trim() || null,
    itens: itens.value.map((i) => ({
      produtoId: i.produtoId,
      quantidade: Number(i.quantidade),
    })),
  });
  if (criada) await router.push({ name: 'cotacao-compra-detalhe', params: { id: criada.id } });
}

onMounted(() => {
  void carregarProdutos();
});
</script>

<style scoped>
.cotacao-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}
.cotacao-form__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
