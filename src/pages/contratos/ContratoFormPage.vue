<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Informe cliente, produto e condições." />

    <section class="agro-section">
      <agro-card v-if="cotacao" class="q-mb-md">
        <div class="text-caption">Cotação de mercado</div>
        <div>
          {{ cotacao.produto }} · {{ cotacao.fonte }} ·
          <span class="text-metric">{{ formatarMoeda(cotacao.preco) }}</span>
        </div>
      </agro-card>

      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.clienteId"
                outlined
                label="Cliente"
                class="field-required"
                emit-value
                map-options
                :options="clienteOpcoes"
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
              <q-input v-model="formulario.preco" outlined label="Preço" type="number" step="0.01" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.fontePreco"
                outlined
                label="Fonte do preço"
                emit-value
                map-options
                :options="FontePrecoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataInicio" outlined label="Início" type="date" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataFim" outlined label="Fim" type="date" />
            </div>
            <div class="col-12">
              <q-input v-model="formulario.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'contratos', query: { tipo } }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
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
import { useClientes } from 'composables/useClientes';
import { useContratos } from 'composables/useContratos';
import { useProdutos } from 'composables/useProdutos';
import {
  FontePrecoOpcoes,
  TipoContrato,
  type TipoContratoValor,
} from 'constants/enums';
import type { ContratoFormModel } from 'types/dtos/contrato.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tipo = computed(
  () => (route.query.tipo as TipoContratoValor) || TipoContrato.Cpr,
);
const modo = computed(() => (route.name === 'contrato-editar' ? 'editar' : 'criar'));
const contratoId = computed(() => route.params.id as string | undefined);
const titulo = computed(() =>
  modo.value === 'criar' ? 'Novo contrato' : 'Editar contrato',
);

const { contrato, salvando, obter, criar, editar, cotacao, carregarCotacaoMercado } =
  useContratos(tipo);
const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();

const carregandoPagina = ref(false);
const formulario = ref<ContratoFormModel>({
  clienteId: '',
  produtoId: '',
  quantidade: '',
  preco: '',
  fontePreco: '',
  dataInicio: '',
  dataFim: '',
  observacao: '',
});

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({ label: c.nomeRazao, value: c.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criar(formulario.value);
    if (criado) {
      await router.push({
        name: 'contrato-detalhe',
        params: { id: criado.id },
        query: { tipo: tipo.value },
      });
    }
    return;
  }

  if (!contratoId.value) return;
  const atualizado = await editar(contratoId.value, formulario.value);
  if (atualizado) {
    await router.push({
      name: 'contrato-detalhe',
      params: { id: atualizado.id },
      query: { tipo: tipo.value },
    });
  }
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  void carregarCotacaoMercado();

  if (modo.value === 'editar' && contratoId.value) {
    carregandoPagina.value = true;
    const ok = await obter(contratoId.value);
    if (!ok || !contrato.value) {
      await router.replace({ name: 'contratos', query: { tipo: tipo.value } });
      return;
    }
    formulario.value = {
      clienteId: contrato.value.clienteId,
      produtoId: contrato.value.produtoId,
      quantidade: String(contrato.value.quantidade),
      preco: String(contrato.value.preco),
      fontePreco: contrato.value.fontePreco,
      dataInicio: contrato.value.dataInicio.slice(0, 10),
      dataFim: contrato.value.dataFim?.slice(0, 10) ?? '',
      observacao: contrato.value.observacao ?? '',
    };
    carregandoPagina.value = false;
  }
});
</script>
