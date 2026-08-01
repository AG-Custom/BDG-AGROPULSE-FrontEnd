<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && (modo === 'editar' || modo === 'visualizar')" :campos="6" />
      <agro-card v-else>
        <q-form
          greedy
          class="agro-formulario"
          :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
          @submit.prevent="salvar"
        >
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="numero"
                outlined
                label="Número"
                class="field-required"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <agro-select-cadastro
                v-model="fornecedorId"
                entidade="fornecedor"
                label="Fornecedor"
                class="field-required"
                :options="fornecedorOpcoes"
                :disable="modo === 'editar' || modo === 'visualizar'"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
                @atualizar="carregarFornecedores()"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="vigenciaInicio"
                outlined
                label="Vigência início"
                type="date"
                class="field-required"
                :readonly="somenteLeitura"
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
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <AgroMoneyInput v-model="valorTotal" label="Valor total" :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="observacao"
                outlined
                label="Observação"
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-secao">Itens</h3>
            <agro-btn
              v-if="!somenteLeitura"
              flat
              icon="add"
              label="Item"
              descricao="Adicionar item"
              @click="adicionar"
            />
          </div>

          <div v-for="(item, index) in itens" :key="item.chave" class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-5">
              <agro-select-cadastro
                v-model="item.produtoId"
                entidade="produto"
                dense
                label="Produto"
                :options="produtoOpcoes"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-4 col-md-2">
              <q-input
                v-model="item.quantidade"
                outlined
                dense
                label="Qtd"
                type="number"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <AgroMoneyInput
                v-model="item.precoUnitario"
                dense
                label="Preço"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
              />
            </div>
            <div v-if="!somenteLeitura" class="col-2 col-md-2">
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

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar"
              :to="{ name: 'contratos-fornecimento' }"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'editar' ? 'Salvar' : 'Criar'"
              descricao="Salvar contrato"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn
              flat
              label="Voltar"
              descricao="Retornar para a listagem"
              :to="{ name: 'contratos-fornecimento' }"
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
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useContratosFornecimento } from 'composables/useContratosFornecimento';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
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

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'contrato-fornecimento-visualizar') {
    return 'visualizar';
  }

  return route.name === 'contrato-fornecimento-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');

const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo contrato de fornecimento';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar contrato de fornecimento';
  }

  return 'Editar contrato de fornecimento';
});

const subtitulo = computed(() => {
  if (modo.value === 'visualizar') {
    return 'Consulte vigência, fornecedor e itens contratados.';
  }

  return 'Vigência, fornecedor e itens contratados.';
});

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
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
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
    precoUnitario: parseMascaraMoeda(i.precoUnitario) ?? 0,
  }));
}

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  const valor = parseMascaraMoeda(valorTotal.value);
  if (modo.value === 'editar' && id.value) {
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
  if (modo.value !== 'editar' && modo.value !== 'visualizar') return;
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
  valorTotal.value = formatarMoedaParaInput(contrato.value.valorTotal);
  observacao.value = contrato.value.observacao ?? '';
  itens.value =
    contrato.value.itens.length > 0
      ? contrato.value.itens.map((i) => ({
          chave: crypto.randomUUID(),
          produtoId: i.produtoId,
          quantidade: String(i.quantidade),
          precoUnitario: formatarMoedaParaInput(i.precoUnitario),
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
