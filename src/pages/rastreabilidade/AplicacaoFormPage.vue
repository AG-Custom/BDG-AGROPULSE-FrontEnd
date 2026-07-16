<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Registre aplicação de insumo no talhão." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="12" />
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
                @update:model-value="onProdutoChange"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.quantidade"
                outlined
                label="Quantidade"
                type="number"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.unidadeMedida"
                outlined
                label="Unidade"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.dataAplicacao"
                outlined
                label="Data"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-select
                v-model="formulario.loteId"
                outlined
                label="Lote"
                clearable
                emit-value
                map-options
                :options="loteOpcoes"
                :loading="carregandoLotes"
                :disable="!formulario.produtoId"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.safraId"
                outlined
                label="Safra"
                clearable
                emit-value
                map-options
                :options="safraOpcoes"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.cultura" outlined label="Cultura" />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.doseHa"
                outlined
                label="Dose / ha"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.areaAplicadaHa"
                outlined
                label="Área aplicada (ha)"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.equipamento" outlined label="Equipamento" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.operadorNome" outlined label="Operador" />
            </div>
            <div class="col-4 col-md-2">
              <q-input
                v-model="formulario.temperaturaC"
                outlined
                label="Temp. (°C)"
                type="number"
              />
            </div>
            <div class="col-4 col-md-2">
              <q-input
                v-model="formulario.umidadePct"
                outlined
                label="Umidade (%)"
                type="number"
              />
            </div>
            <div class="col-4 col-md-2">
              <q-input
                v-model="formulario.ventoKmh"
                outlined
                label="Vento (km/h)"
                type="number"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.numeroReceita" outlined label="Nº receita" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.crea" outlined label="CREA" />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacoes"
                outlined
                label="Observações"
                type="textarea"
                autogrow
              />
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
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProdutos } from 'composables/useProdutos';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
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
const { safraOpcoes, carregar: carregarSafras } = useSafras();
const {
  lotes,
  carregando: carregandoLotes,
  carregar: carregarLotes,
} = useEstoqueLotes();

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
  safraId: '',
  safra: '',
  cultura: '',
  numeroReceita: '',
  crea: '',
  doseHa: '',
  areaAplicadaHa: '',
  equipamento: '',
  operadorNome: '',
  temperaturaC: '',
  umidadePct: '',
  ventoKmh: '',
  observacoes: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);
const loteOpcoes = computed(() =>
  lotes.value
    .filter((l) => l.ativo)
    .map((l) => ({
      label: `${l.numeroLote}${l.quantidade != null ? ` (${l.quantidade})` : ''}`,
      value: l.id,
    })),
);

async function onProdutoChange(produtoId: string | null): Promise<void> {
  formulario.value.loteId = '';
  if (!produtoId) {
    lotes.value = [];
    return;
  }
  await carregarLotes({ produtoId, apenasComSaldo: true });
}

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
  void carregarSafras();

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
      safraId: aplicacao.value.safraId ?? '',
      safra: aplicacao.value.safra ?? '',
      cultura: aplicacao.value.cultura ?? '',
      numeroReceita: aplicacao.value.numeroReceita ?? '',
      crea: aplicacao.value.crea ?? '',
      doseHa: aplicacao.value.doseHa != null ? String(aplicacao.value.doseHa) : '',
      areaAplicadaHa:
        aplicacao.value.areaAplicadaHa != null
          ? String(aplicacao.value.areaAplicadaHa)
          : '',
      equipamento: aplicacao.value.equipamento ?? '',
      operadorNome: aplicacao.value.operadorNome ?? '',
      temperaturaC:
        aplicacao.value.temperaturaC != null ? String(aplicacao.value.temperaturaC) : '',
      umidadePct:
        aplicacao.value.umidadePct != null ? String(aplicacao.value.umidadePct) : '',
      ventoKmh: aplicacao.value.ventoKmh != null ? String(aplicacao.value.ventoKmh) : '',
      observacoes: aplicacao.value.observacoes ?? '',
    };
    if (aplicacao.value.produtoId) {
      await carregarLotes({ produtoId: aplicacao.value.produtoId, apenasComSaldo: false });
    }
    carregandoPagina.value = false;
  }
});
</script>
