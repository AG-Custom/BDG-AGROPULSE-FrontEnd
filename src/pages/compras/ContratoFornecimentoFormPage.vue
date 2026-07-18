<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Vigência, fornecedor e itens contratados." />

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && editando" :campos="6" />
      <agro-card v-else>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="numero"
                outlined
                label="Número"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="fornecedorId"
                outlined
                label="Fornecedor"
                class="field-required"
                emit-value
                map-options
                :options="fornecedorOpcoes"
                :disable="editando"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="vigenciaInicio"
                outlined
                label="Vigência início"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="vigenciaFim"
                outlined
                label="Vigência fim"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="valorTotal" outlined label="Valor total" type="number" step="0.01" />
            </div>
            <div class="col-12 col-md-8">
              <q-input v-model="observacao" outlined label="Observação" />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-secao">Itens</h3>
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
              <q-input
                v-model="item.quantidade"
                outlined
                dense
                label="Qtd"
                type="number"
                :rules="[obrigatorio]"
              />
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
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar"
              :to="{ name: 'contratos-fornecimento' }"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="editando ? 'Salvar' : 'Criar'"
              descricao="Salvar contrato"
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
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useContratosFornecimento } from 'composables/useContratosFornecimento';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ItemForm {
  chave: string;
  produtoId: string;
  quantidade: string;
  precoUnitario: string;
}

const route = useRoute();
const router = useRouter();
const { contrato, carregando, salvando, obter, criar, atualizar } = useContratosFornecimento();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();

const id = computed(() => route.params.id as string | undefined);
const editando = computed(() => Boolean(id.value));
const titulo = computed(() =>
  editando.value ? 'Editar contrato de fornecimento' : 'Novo contrato de fornecimento',
);

const numero = ref('');
const fornecedorId = ref('');
const vigenciaInicio = ref('');
const vigenciaFim = ref('');
const valorTotal = ref('');
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

function montarItens() {
  return itens.value.map((i) => ({
    produtoId: i.produtoId,
    quantidade: Number(i.quantidade),
    precoUnitario: Number(i.precoUnitario),
  }));
}

async function salvar(): Promise<void> {
  const valor = valorTotal.value.trim() ? Number(valorTotal.value) : null;
  if (editando.value && id.value) {
    const ok = await atualizar(id.value, {
      numero: numero.value.trim(),
      vigenciaInicio: vigenciaInicio.value,
      vigenciaFim: vigenciaFim.value,
      valorTotal: valor,
      observacao: observacao.value.trim() || null,
      itens: montarItens(),
    });
    if (ok) await router.push({ name: 'contratos-fornecimento' });
    return;
  }

  const criado = await criar({
    fornecedorId: fornecedorId.value,
    numero: numero.value.trim(),
    vigenciaInicio: vigenciaInicio.value,
    vigenciaFim: vigenciaFim.value,
    valorTotal: valor,
    observacao: observacao.value.trim() || null,
    itens: montarItens(),
  });
  if (criado) await router.push({ name: 'contratos-fornecimento' });
}

onMounted(async () => {
  void carregarFornecedores();
  void carregarProdutos();
  if (!id.value) return;
  const ok = await obter(id.value);
  if (!ok || !contrato.value) {
    await router.replace({ name: 'contratos-fornecimento' });
    return;
  }
  numero.value = contrato.value.numero;
  fornecedorId.value = contrato.value.fornecedorId;
  vigenciaInicio.value = contrato.value.vigenciaInicio;
  vigenciaFim.value = contrato.value.vigenciaFim;
  valorTotal.value =
    contrato.value.valorTotal != null ? String(contrato.value.valorTotal) : '';
  observacao.value = contrato.value.observacao ?? '';
  itens.value =
    contrato.value.itens.length > 0
      ? contrato.value.itens.map((i) => ({
          chave: crypto.randomUUID(),
          produtoId: i.produtoId,
          quantidade: String(i.quantidade),
          precoUnitario: String(i.precoUnitario),
        }))
      : [{ chave: crypto.randomUUID(), produtoId: '', quantidade: '1', precoUnitario: '' }];
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}
.titulo-secao {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
