<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section tabela-preco-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />

        <q-banner
          v-if="!carregandoPagina && tabelaInativa"
          rounded
          class="tabela-preco-form-page__aviso"
        >
          Esta tabela de preço está inativa e não pode ser editada.
        </q-banner>

        <tabela-preco-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :somente-leitura="somenteLeitura || tabelaInativa"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !tabelaInativa" class="agro-form-actions">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Voltar para a listagem sem salvar"
            :disable="salvando"
            @click="voltar"
          />
          <agro-btn
            color="primary"
            unelevated
            :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
            :descricao="modo === 'criar' ? 'Cadastrar nova tabela' : 'Salvar alterações da tabela'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || tabelaInativa)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de tabelas de preço"
            @click="voltar"
          />
        </div>
      </agro-card>

      <tabela-preco-itens-section
        v-if="(modo === 'editar' || modo === 'visualizar') && (modo === 'visualizar' || tabelaAtiva) && tabelaCarregada"
        :tabela-preco-id="tabelaId!"
        :itens-iniciais="tabelaCarregada.itens"
        :somente-leitura="somenteLeitura"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import TabelaPrecoFormulario from 'components/tabelas-preco/TabelaPrecoFormulario.vue';
import TabelaPrecoItensSection from 'components/tabelas-preco/TabelaPrecoItensSection.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useTabelasPreco } from 'composables/useTabelasPreco';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { tabelaPrecoService } from 'services/tabela-preco.service';
import type { TabelaPrecoDto, TabelaPrecoFormModel } from 'types/dtos/tabela-preco.dto';
import {
  criarTabelaPrecoFormVazia,
  tabelaPrecoDtoParaForm,
} from 'utils/mappers/tabela-preco.mapper';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useTabelasPreco();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof TabelaPrecoFormulario> | null>(null);
const formulario = ref<TabelaPrecoFormModel>(criarTabelaPrecoFormVazia());
const tabelaCarregada = ref<TabelaPrecoDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'tabela-preco-visualizar') {
    return 'visualizar';
  }

  return route.name === 'tabela-preco-editar' ? 'editar' : 'criar';
});


const somenteLeitura = computed(() => modo.value === 'visualizar');

const tabelaId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova tabela de preço';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar tabela de preço';
  }

  return 'Editar tabela de preço';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre a tabela e, em seguida, adicione os itens com preços.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados da tabela selecionada.';
  }

  return 'Atualize os dados e gerencie os itens da tabela.';
});

const tabelaInativa = computed(
  () => modo.value === 'editar' && tabelaCarregada.value?.ativo === false,
);

const tabelaAtiva = computed(
  () => modo.value === 'editar' && tabelaCarregada.value?.ativo === true,
);

async function carregarTabela(): Promise<void> {
  if (!tabelaId.value) {
    return;
  }

  try {
    tabelaCarregada.value = await tabelaPrecoService.obter(tabelaId.value);
    formulario.value = tabelaPrecoDtoParaForm(tabelaCarregada.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'tabelas-preco' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarTabela();
  } else {
    formulario.value = criarTabelaPrecoFormVazia();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'tabelas-preco' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  if (modo.value === 'criar') {
    const criada = await criar(formulario.value);

    if (criada) {
      await router.replace({ name: 'tabela-preco-editar', params: { id: criada.id } });
    }

    return;
  }

  const sucesso = await editar(tabelaId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'tabelas-preco' });
  }
}

watch(
  () => [route.name, route.params.id] as const,
  () => {
    void inicializar();
  },
  { immediate: true },
);
</script>

<style scoped>
.tabela-preco-form-page {
  display: grid;
  gap: var(--spacing-6);
}

.tabela-preco-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
