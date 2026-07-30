<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Lote de entrada, saídas tipadas e confirmação.">
      <agro-btn
        v-if="modo === 'editar' && beneficiamento?.status === BeneficiamentoLoteStatus.Rascunho"
        color="primary"
        unelevated
        label="Confirmar"
        descricao="Confirmar beneficiamento"
        :loading="salvando"
        @click="onConfirmar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
        <q-form
          v-else
          greedy
          class="agro-formulario"
          :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
          :disable="somenteLeitura"
          @submit.prevent="salvar"
        >
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
                @update:model-value="onProdutoEntrada"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.loteEntradaId"
                outlined
                label="Lote entrada"
                emit-value
                map-options
                clearable
                :options="loteOpcoes"
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
            <div class="col-12">
              <q-input v-model="formulario.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-sec">Saídas</h3>
            <agro-btn
              v-if="!somenteLeitura"
              flat
              icon="add"
              label="Saída"
              descricao="Adicionar saída"
              @click="adicionarSaida"
            />
          </div>

          <div
            v-for="(saida, index) in formulario.saidas"
            :key="saida.chave"
            class="row q-col-gutter-md q-mb-sm"
          >
            <div class="col-12 col-md-3">
              <q-select
                v-model="saida.tipo"
                outlined
                dense
                label="Tipo"
                emit-value
                map-options
                :options="TipoSaidaBeneficiamentoOpcoes"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="saida.produtoId"
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
              <q-input
                v-model="saida.quantidade"
                outlined
                dense
                label="Qtd"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="saida.numeroLote" outlined dense label="Nº lote" />
            </div>
            <div v-if="saida.tipo === TipoSaidaBeneficiamento.Perda" class="col-10 col-md-3">
              <q-input v-model="saida.destinoPerda" outlined dense label="Destino perda" />
            </div>
            <div class="col-2 col-md-1">
              <agro-btn
                v-if="!somenteLeitura"
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                :disable="formulario.saidas.length <= 1"
                @click="formulario.saidas.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn
              flat
              :label="somenteLeitura ? 'Voltar' : 'Cancelar'"
              descricao="Voltar"
              :to="{ name: 'beneficiamentos' }"
            />
            <agro-btn
              v-if="!somenteLeitura"
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
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import {
  BeneficiamentoLoteStatus,
  TipoSaidaBeneficiamento,
  TipoSaidaBeneficiamentoOpcoes,
} from 'constants/enums';
import type {
  BeneficiamentoLoteFormModel,
  SaidaBeneficiamentoFormModel,
} from 'types/dtos/producao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

function novaSaida(): SaidaBeneficiamentoFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    tipo: TipoSaidaBeneficiamento.Principal,
    numeroLote: '',
    destinoPerda: '',
  };
}

const route = useRoute();
const router = useRouter();
const {
  beneficiamento,
  salvando,
  obterBeneficiamento,
  criarBeneficiamento,
  editarBeneficiamento,
  confirmarBeneficiamento,
} = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { lotes, carregar: carregarLotes } = useEstoqueLotes();

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'beneficiamento-visualizar') {
    return 'visualizar';
  }

  return route.name === 'beneficiamento-editar' ? 'editar' : 'criar';
});
const beneficiamentoId = computed(() => route.params.id as string | undefined);
const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo beneficiamento';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar beneficiamento';
  }

  return 'Editar beneficiamento';
});

const carregandoPagina = ref(false);
const formulario = ref<BeneficiamentoLoteFormModel>({
  produtoEntradaId: '',
  produtoSaidaId: '',
  loteEntradaId: '',
  quantidadeEntrada: '',
  quantidadeSaida: '',
  observacao: '',
  saidas: [novaSaida()],
});

const somenteLeitura = computed(
  () =>
    modo.value === 'visualizar' ||
    beneficiamento.value?.status === BeneficiamentoLoteStatus.Confirmado,
);

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const loteOpcoes = computed(() =>
  lotes.value.map((l) => ({
    label: `${l.numeroLote}`,
    value: l.id,
  })),
);

function adicionarSaida(): void {
  formulario.value.saidas.push(novaSaida());
}

function onProdutoEntrada(produtoId: string): void {
  formulario.value.loteEntradaId = '';
  if (produtoId) void carregarLotes({ produtoId, apenasComSaldo: true });
}

async function salvar(): Promise<void> {
  const principal = formulario.value.saidas.find(
    (s) => s.tipo === TipoSaidaBeneficiamento.Principal,
  );
  formulario.value.produtoSaidaId = principal?.produtoId ?? '';
  formulario.value.quantidadeSaida = principal?.quantidade ?? '0';

  if (modo.value === 'criar') {
    const criado = await criarBeneficiamento(formulario.value);
    if (criado) await router.push({ name: 'beneficiamento-editar', params: { id: criado.id } });
    return;
  }
  if (!beneficiamentoId.value) return;
  const ok = await editarBeneficiamento(beneficiamentoId.value, formulario.value);
  if (ok) await obterBeneficiamento(beneficiamentoId.value);
}

async function onConfirmar(): Promise<void> {
  if (!beneficiamentoId.value) return;
  await confirmarBeneficiamento(beneficiamentoId.value);
}

onMounted(async () => {
  void carregarProdutos();
  if ((modo.value === 'editar' || modo.value === 'visualizar') && beneficiamentoId.value) {
    carregandoPagina.value = true;
    const ok = await obterBeneficiamento(beneficiamentoId.value);
    if (!ok || !beneficiamento.value) {
      await router.replace({ name: 'beneficiamentos' });
      return;
    }
    formulario.value = {
      produtoEntradaId: beneficiamento.value.produtoEntradaId,
      produtoSaidaId: beneficiamento.value.produtoSaidaId,
      loteEntradaId: beneficiamento.value.loteEntradaId ?? '',
      quantidadeEntrada: String(beneficiamento.value.quantidadeEntrada),
      quantidadeSaida: String(beneficiamento.value.quantidadeSaida),
      observacao: beneficiamento.value.observacao ?? '',
      saidas: (() => {
        const saidas = beneficiamento.value.saidas ?? [];
        if (saidas.length > 0) {
          return saidas.map((s) => ({
            chave: s.id,
            produtoId: s.produtoId,
            quantidade: String(s.quantidade),
            tipo: s.tipo,
            numeroLote: s.numeroLote ?? '',
            destinoPerda: s.destinoPerda ?? '',
          }));
        }
        return [
          {
            chave: crypto.randomUUID(),
            produtoId: beneficiamento.value.produtoSaidaId,
            quantidade: String(beneficiamento.value.quantidadeSaida),
            tipo: TipoSaidaBeneficiamento.Principal,
            numeroLote: '',
            destinoPerda: '',
          },
        ];
      })(),
    };
    if (formulario.value.produtoEntradaId) {
      void carregarLotes({
        produtoId: formulario.value.produtoEntradaId,
        apenasComSaldo: true,
      });
    }
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
