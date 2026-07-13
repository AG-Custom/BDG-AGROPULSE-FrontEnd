<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Registre aplicação de insumo no talhão." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.talhaoId"
                outlined
                label="Talhão"
                class="field-required"
                emit-value
                map-options
                :options="talhaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoId"
                outlined
                label="Produto"
                class="field-required"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.quantidade" outlined label="Quantidade" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.unidadeMedida" outlined label="Unidade" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataAplicacao" outlined label="Data" type="date" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.loteId" outlined label="ID do lote" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.safra" outlined label="Safra" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.cultura" outlined label="Cultura" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.numeroReceita" outlined label="Nº receita" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.crea" outlined label="CREA" />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'aplicacoes' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar aplicação"
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
import { useRastreabilidade } from 'composables/useRastreabilidade';
import type { AplicacaoInsumoFormModel } from 'types/dtos/rastreabilidade.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  aplicacao,
  talhoes,
  salvando,
  obterAplicacao,
  criarAplicacao,
  editarAplicacao,
  carregarTalhoes,
} = useRastreabilidade();
const { produtos, carregar: carregarProdutos } = useProdutos();

const modo = computed(() => (route.name === 'aplicacao-editar' ? 'editar' : 'criar'));
const aplicacaoId = computed(() => route.params.id as string | undefined);
const titulo = computed(() =>
  modo.value === 'criar' ? 'Nova aplicação' : 'Editar aplicação',
);

const carregandoPagina = ref(false);
const formulario = ref<AplicacaoInsumoFormModel>({
  talhaoId: '',
  produtoId: '',
  loteId: '',
  quantidade: '',
  unidadeMedida: '',
  dataAplicacao: '',
  safra: '',
  cultura: '',
  numeroReceita: '',
  crea: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criada = await criarAplicacao(formulario.value);
    if (criada) await router.push({ name: 'aplicacoes' });
    return;
  }
  if (!aplicacaoId.value) return;
  const ok = await editarAplicacao(aplicacaoId.value, formulario.value);
  if (ok) await router.push({ name: 'aplicacoes' });
}

onMounted(async () => {
  void carregarTalhoes();
  void carregarProdutos();

  if (modo.value === 'editar' && aplicacaoId.value) {
    carregandoPagina.value = true;
    const ok = await obterAplicacao(aplicacaoId.value);
    if (!ok || !aplicacao.value) {
      await router.replace({ name: 'aplicacoes' });
      return;
    }
    formulario.value = {
      talhaoId: aplicacao.value.talhaoId,
      produtoId: aplicacao.value.produtoId,
      loteId: aplicacao.value.loteId ?? '',
      quantidade: String(aplicacao.value.quantidade),
      unidadeMedida: aplicacao.value.unidadeMedida,
      dataAplicacao: aplicacao.value.dataAplicacao.slice(0, 10),
      safra: aplicacao.value.safra ?? '',
      cultura: aplicacao.value.cultura ?? '',
      numeroReceita: aplicacao.value.numeroReceita ?? '',
      crea: aplicacao.value.crea ?? '',
    };
    carregandoPagina.value = false;
  }
});
</script>
