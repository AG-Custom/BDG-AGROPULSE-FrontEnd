<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="titulo" subtitulo="Selecione receita (BOM) ou informe insumos." />

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
                @update:model-value="onProdutoSaida"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.receitaId"
                outlined
                label="Receita / BOM"
                emit-value
                map-options
                clearable
                :options="receitaOpcoes"
                @update:model-value="onReceita"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.quantidadePlanejada"
                outlined
                label="Qtd planejada"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataPrevista" outlined label="Data prevista" type="date" />
            </div>
            <div class="col-12">
              <q-input v-model="formulario.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-sec">Insumos</h3>
            <agro-btn flat icon="add" label="Insumo" descricao="Adicionar insumo" @click="adicionar" />
          </div>

          <div v-for="(item, index) in formulario.itens" :key="item.chave" class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-7">
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
            <div class="col-8 col-md-3">
              <q-input v-model="item.quantidade" outlined dense label="Qtd" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-4 col-md-2">
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
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'ordens-producao' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar ordem"
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
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import { useReceitasProducao } from 'composables/useReceitasProducao';
import type {
  ItemOrdemProducaoFormModel,
  OrdemProducaoFormModel,
} from 'types/dtos/producao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

function novoItem(): ItemOrdemProducaoFormModel {
  return { chave: crypto.randomUUID(), produtoInsumoId: '', quantidade: '1' };
}

const route = useRoute();
const router = useRouter();
const { ordem, salvando, obterOrdem, criarOrdem, editarOrdem } = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { receitas, carregar: carregarReceitas } = useReceitasProducao();

const modo = computed(() => (route.name === 'ordem-producao-editar' ? 'editar' : 'criar'));
const ordemId = computed(() => route.params.id as string | undefined);
const titulo = computed(() =>
  modo.value === 'criar' ? 'Nova ordem de produção' : 'Editar ordem',
);

const carregandoPagina = ref(false);
const formulario = ref<OrdemProducaoFormModel>({
  produtoSaidaId: '',
  receitaId: '',
  quantidadePlanejada: '',
  dataPrevista: '',
  observacao: '',
  itens: [novoItem()],
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const receitaOpcoes = computed(() =>
  receitas.value
    .filter(
      (r) =>
        r.ativa &&
        (!formulario.value.produtoSaidaId || r.produtoSaidaId === formulario.value.produtoSaidaId),
    )
    .map((r) => ({
      label: `v${r.versao}${r.observacao ? ` — ${r.observacao}` : ''}`,
      value: r.id,
    })),
);

function adicionar(): void {
  formulario.value.itens.push(novoItem());
}

function aplicarReceita(receitaId: string): void {
  const receita = receitas.value.find((r) => r.id === receitaId);
  if (!receita) return;
  formulario.value.produtoSaidaId = receita.produtoSaidaId;
  formulario.value.itens = receita.itens.map((i) => ({
    chave: crypto.randomUUID(),
    produtoInsumoId: i.produtoInsumoId,
    quantidade: String(i.quantidade),
  }));
}

function onReceita(receitaId: string | null): void {
  if (receitaId) aplicarReceita(receitaId);
}

function onProdutoSaida(): void {
  if (
    formulario.value.receitaId &&
    !receitas.value.some(
      (r) =>
        r.id === formulario.value.receitaId &&
        r.produtoSaidaId === formulario.value.produtoSaidaId,
    )
  ) {
    formulario.value.receitaId = '';
  }
}

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criada = await criarOrdem(formulario.value);
    if (criada) await router.push({ name: 'ordem-producao-detalhe', params: { id: criada.id } });
    return;
  }
  if (!ordemId.value) return;
  const atualizada = await editarOrdem(ordemId.value, formulario.value);
  if (atualizada) {
    await router.push({ name: 'ordem-producao-detalhe', params: { id: atualizada.id } });
  }
}

onMounted(async () => {
  void carregarProdutos();
  void carregarReceitas();
  if (modo.value === 'editar' && ordemId.value) {
    carregandoPagina.value = true;
    const ok = await obterOrdem(ordemId.value);
    if (!ok || !ordem.value) {
      await router.replace({ name: 'ordens-producao' });
      return;
    }
    formulario.value = {
      produtoSaidaId: ordem.value.produtoSaidaId,
      receitaId: ordem.value.receitaId ?? '',
      quantidadePlanejada: String(ordem.value.quantidadePlanejada),
      dataPrevista: ordem.value.dataPrevista?.slice(0, 10) ?? '',
      observacao: ordem.value.observacao ?? '',
      itens: ordem.value.itens.map((i) => ({
        chave: i.id,
        produtoInsumoId: i.produtoInsumoId,
        quantidade: String(i.quantidade),
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
