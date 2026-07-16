<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Defina insumos, quantidades e tolerâncias." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoSaidaId"
                outlined
                label="Produto de saída"
                class="field-required"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.versao"
                outlined
                label="Versão"
                type="number"
                class="field-required"
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
              />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-sec">Insumos (BOM)</h3>
            <agro-btn flat icon="add" label="Insumo" descricao="Adicionar insumo" @click="adicionar" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md q-mb-sm"
          >
            <div class="col-12 col-md-5">
              <q-select
                v-model="item.produtoInsumoId"
                outlined
                dense
                label="Insumo"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
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
                v-model="item.toleranciaPct"
                outlined
                dense
                label="Tolerância %"
                type="number"
              />
            </div>
            <div class="col-12 col-md-2">
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
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
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
const { produtos, carregar: carregarProdutos } = useProdutos();

const modo = computed(() => (route.name === 'receita-producao-editar' ? 'editar' : 'criar'));
const receitaId = computed(() => route.params.id as string | undefined);
const titulo = computed(() => (modo.value === 'criar' ? 'Nova receita' : 'Editar receita'));

const carregandoPagina = ref(false);
const formulario = ref<ReceitaProducaoFormModel>({
  produtoSaidaId: '',
  versao: '1',
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
  if (modo.value === 'editar' && receitaId.value) {
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
