<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
        <q-form
          v-else
          greedy
          class="agro-formulario"
          :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
          @submit.prevent="salvar"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.produtoSaidaId"
                entidade="produto"
                label="Produto de saída"
                class="field-required"
                :options="produtoOpcoes"
                :loading="carregandoProdutos"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.versao"
                outlined
                label="Versão"
                type="number"
                class="field-required"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacao"
                outlined
                label="Observação"
                type="textarea"
                autogrow
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-sec">Insumos (BOM)</h3>
            <agro-btn
              v-if="!somenteLeitura"
              flat
              icon="add"
              label="Insumo"
              descricao="Adicionar insumo"
              @click="adicionar"
            />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md q-mb-sm"
          >
            <div class="col-12 col-md-5">
              <agro-select-cadastro
                v-model="item.produtoInsumoId"
                entidade="produto"
                dense
                label="Insumo"
                :options="produtoOpcoes"
                :loading="carregandoProdutos"
                :readonly="somenteLeitura"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-6 col-md-2">
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
              <q-input
                v-model="item.toleranciaPct"
                outlined
                dense
                label="Tolerância %"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div v-if="!somenteLeitura" class="col-12 col-md-2">
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

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'receitas-producao' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar receita"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'receitas-producao' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useProdutos } from 'composables/useProdutos';
import { useReceitasProducao } from 'composables/useReceitasProducao';
import type { ItemReceitaFormModel, ReceitaProducaoFormModel } from 'types/dtos/producao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

function novoItem(): ItemReceitaFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoInsumoId: '',
    quantidade: '1',
    toleranciaPct: '',
  };
}

const route = useRoute();
const router = useRouter();
const { receita, salvando, obter, criar, editar } = useReceitasProducao();
const { produtos, carregando: carregandoProdutos, carregar: carregarProdutos } = useProdutos();

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'receita-producao-visualizar') {
    return 'visualizar';
  }

  return route.name === 'receita-producao-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');
const receitaId = computed(() => route.params.id as string | undefined);

const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova receita';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar receita';
  }

  return 'Editar receita';
});

const subtitulo = computed(() => {
  if (modo.value === 'visualizar') {
    return 'Consulte insumos, quantidades e tolerâncias.';
  }

  return 'Defina insumos, quantidades e tolerâncias.';
});

const carregandoPagina = ref(false);
const formulario = ref<ReceitaProducaoFormModel>({
  produtoSaidaId: '',
  versao: '1',
  observacao: '',
  itens: [novoItem()],
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

function adicionar(): void {
  formulario.value.itens.push(novoItem());
}

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  if (modo.value === 'criar') {
    const criada = await criar(formulario.value);
    if (criada) await router.push({ name: 'receitas-producao' });
    return;
  }
  if (!receitaId.value) return;
  const ok = await editar(receitaId.value, formulario.value);
  if (ok) await router.push({ name: 'receitas-producao' });
}

onMounted(async () => {
  void carregarProdutos();
  if ((modo.value === 'editar' || modo.value === 'visualizar') && receitaId.value) {
    carregandoPagina.value = true;
    const ok = await obter(receitaId.value);
    if (!ok || !receita.value) {
      await router.replace({ name: 'receitas-producao' });
      return;
    }
    formulario.value = {
      produtoSaidaId: receita.value.produtoSaidaId,
      versao: String(receita.value.versao),
      observacao: receita.value.observacao ?? '',
      itens: receita.value.itens.map((i) => ({
        chave: i.id,
        produtoInsumoId: i.produtoInsumoId,
        quantidade: String(i.quantidade),
        toleranciaPct: i.toleranciaPct != null ? String(i.toleranciaPct) : '',
      })),
    };
    carregandoPagina.value = false;
  }
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-6) 0 var(--spacing-3);
}
.titulo-sec {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
