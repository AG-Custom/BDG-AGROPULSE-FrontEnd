<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header titulo="Nova solicitação" subtitulo="Informe os produtos e quantidades desejadas." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="urgencia"
                outlined
                label="Urgência"
                emit-value
                map-options
                :options="UrgenciaCompraOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="justificativa"
                outlined
                label="Justificativa"
                type="textarea"
                autogrow
                :hint="urgencia === 'Urgente' ? 'Obrigatória para urgência Urgente' : undefined"
                :rules="urgencia === 'Urgente' ? [obrigatorio] : []"
              />
            </div>
            <div class="col-12">
              <q-input v-model="observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>

          <div class="solicitacao-form__header">
            <h3 class="solicitacao-form__titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionar" />
          </div>

          <div v-for="(item, index) in itens" :key="item.chave" class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-7">
              <agro-select-cadastro
                v-model="item.produtoId"
                entidade="produto"
                dense
                label="Produto"
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
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
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'solicitacoes-compra' }" />
            <agro-btn color="primary" unelevated label="Criar" descricao="Criar solicitação" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useCompras } from 'composables/useCompras';
import { useProdutos } from 'composables/useProdutos';
import { UrgenciaCompra, UrgenciaCompraOpcoes } from 'constants/enums';
import type { UrgenciaCompraValor } from 'types/dtos/compras.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

interface ItemForm {
  chave: string;
  produtoId: string;
  quantidade: string;
}

const router = useRouter();
const { salvando, criarSolicitacao } = useCompras();
const { produtos, carregar: carregarProdutos } = useProdutos();

const observacao = ref('');
const urgencia = ref<UrgenciaCompraValor>(UrgenciaCompra.Normal);
const justificativa = ref('');
const itens = ref<ItemForm[]>([{ chave: crypto.randomUUID(), produtoId: '', quantidade: '1' }]);

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

function adicionar(): void {
  itens.value.push({ chave: crypto.randomUUID(), produtoId: '', quantidade: '1' });
}

async function salvar(): Promise<void> {
  const criada = await criarSolicitacao({
    observacao: observacao.value.trim() || null,
    urgencia: urgencia.value,
    justificativa: justificativa.value.trim() || null,
    itens: itens.value.map((i) => ({
      produtoId: i.produtoId,
      quantidade: Number(i.quantidade),
    })),
  });
  if (criada) await router.push({ name: 'solicitacao-compra-detalhe', params: { id: criada.id } });
}

onMounted(() => {
  void carregarProdutos();
});
</script>

<style scoped>
.solicitacao-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}
.solicitacao-form__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
