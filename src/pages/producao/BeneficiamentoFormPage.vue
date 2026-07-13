<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Informe produtos e quantidades de entrada/saída." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoEntradaId"
                outlined
                label="Produto entrada"
                class="field-required"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoSaidaId"
                outlined
                label="Produto saída"
                class="field-required"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.quantidadeEntrada"
                outlined
                label="Qtd entrada"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.quantidadeSaida"
                outlined
                label="Qtd saída"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12">
              <q-input v-model="formulario.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'beneficiamentos' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar beneficiamento"
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
import type { BeneficiamentoLoteFormModel } from 'types/dtos/producao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  beneficiamento,
  salvando,
  obterBeneficiamento,
  criarBeneficiamento,
  editarBeneficiamento,
} = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const modo = computed(() => (route.name === 'beneficiamento-editar' ? 'editar' : 'criar'));
const beneficiamentoId = computed(() => route.params.id as string | undefined);
const titulo = computed(() =>
  modo.value === 'criar' ? 'Novo beneficiamento' : 'Editar beneficiamento',
);

const carregandoPagina = ref(false);
const formulario = ref<BeneficiamentoLoteFormModel>({
  produtoEntradaId: '',
  produtoSaidaId: '',
  quantidadeEntrada: '',
  quantidadeSaida: '',
  observacao: '',
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarBeneficiamento(formulario.value);
    if (criado) await router.push({ name: 'beneficiamentos' });
    return;
  }
  if (!beneficiamentoId.value) return;
  const ok = await editarBeneficiamento(beneficiamentoId.value, formulario.value);
  if (ok) await router.push({ name: 'beneficiamentos' });
}

onMounted(async () => {
  void carregarProdutos();
  if (modo.value === 'editar' && beneficiamentoId.value) {
    carregandoPagina.value = true;
    const ok = await obterBeneficiamento(beneficiamentoId.value);
    if (!ok || !beneficiamento.value) {
      await router.replace({ name: 'beneficiamentos' });
      return;
    }
    formulario.value = {
      produtoEntradaId: beneficiamento.value.produtoEntradaId,
      produtoSaidaId: beneficiamento.value.produtoSaidaId,
      quantidadeEntrada: String(beneficiamento.value.quantidadeEntrada),
      quantidadeSaida: String(beneficiamento.value.quantidadeSaida),
      observacao: beneficiamento.value.observacao ?? '',
    };
    carregandoPagina.value = false;
  }
});
</script>
