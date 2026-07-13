<template>
  <q-page class="agro-page">
    <app-page-header titulo="PDV" subtitulo="Registrar venda rápida com baixa de estoque." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.clienteId"
                outlined
                label="Cliente (opcional)"
                emit-value
                map-options
                clearable
                :options="clienteOpcoes"
                :loading="carregandoClientes"
              />
            </div>
          </div>

          <div class="pdv-vender__itens-header">
            <h3 class="pdv-vender__titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md pdv-vender__item"
          >
            <div class="col-12 col-md-4">
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
            <div class="col-6 col-md-2">
              <q-input v-model="item.quantidade" outlined dense label="Qtd" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-2">
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
            <div class="col-6 col-md-2">
              <q-input v-model="item.numeroLote" outlined dense label="Nº lote" />
            </div>
            <div class="col-6 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover item"
                :disable="formulario.itens.length <= 1"
                @click="removerItem(index)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Ver vendas" descricao="Ir para listagem" :to="{ name: 'pdv-vendas' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Finalizar venda"
              descricao="Registrar venda no PDV"
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
import { useClientes } from 'composables/useClientes';
import { usePdv } from 'composables/usePdv';
import { useProdutos } from 'composables/useProdutos';
import type { PdvItemFormModel, PdvVendaFormModel } from 'types/dtos/pdv.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

function novoItem(): PdvItemFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    precoUnitario: '',
    numeroLote: '',
    loteId: '',
  };
}

const router = useRouter();
const { salvando, vender } = usePdv();
const { clientes, carregando: carregandoClientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();

const formulario = ref<PdvVendaFormModel>({ clienteId: '', itens: [novoItem()] });

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({ label: c.nomeRazao, value: c.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

function adicionarItem(): void {
  formulario.value.itens.push(novoItem());
}
function removerItem(index: number): void {
  if (formulario.value.itens.length > 1) formulario.value.itens.splice(index, 1);
}

async function salvar(): Promise<void> {
  const venda = await vender(formulario.value);
  if (venda) await router.push({ name: 'pdv-venda-detalhe', params: { id: venda.id } });
}

onMounted(() => {
  void carregarClientes();
  void carregarProdutos();
});
</script>

<style scoped>
.pdv-vender__itens-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--spacing-6) 0 var(--spacing-3);
}
.pdv-vender__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.pdv-vender__item {
  margin-bottom: var(--spacing-2);
}
</style>
