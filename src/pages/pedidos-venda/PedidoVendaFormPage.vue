<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section pedido-venda-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />

        <template v-else>
          <pedido-venda-formulario
            ref="formularioRef"
            v-model:formulario="formulario"
          />
        </template>
      </agro-card>

      <pedido-venda-itens-section
        v-if="!carregandoPagina"
        v-model:itens="formulario.itens"
        :cliente-id="formulario.clienteId"
        :tabela-preco-id="formulario.tabelaPrecoId"
      />

      <div v-if="!carregandoPagina" class="agro-form-actions">
        <agro-btn
          flat
          label="Cancelar"
          descricao="Voltar sem salvar"
          :disable="salvando"
          @click="voltar"
        />
        <agro-btn
          color="primary"
          unelevated
          :label="modo === 'criar' ? 'Criar pedido' : 'Salvar'"
          :descricao="modo === 'criar' ? 'Criar pedido em orçamento' : 'Salvar alterações do pedido'"
          :loading="salvando"
          @click="salvar"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import PedidoVendaFormulario from 'components/pedidos-venda/PedidoVendaFormulario.vue';
import PedidoVendaItensSection from 'components/pedidos-venda/PedidoVendaItensSection.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useNotificacao } from 'composables/useNotificacao';
import { usePedidoVenda } from 'composables/usePedidoVenda';
import { usePedidosVenda } from 'composables/usePedidosVenda';
import { PedidoVendaStatus } from 'constants/enums';
import type { PedidoVendaFormModel } from 'types/dtos/pedido-venda.dto';
import {
  criarPedidoVendaFormVazio,
  pedidoDtoParaForm,
} from 'utils/mappers/pedido-venda.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = usePedidosVenda();
const { pedido, obter } = usePedidoVenda();
const { erro } = useNotificacao();

const formularioRef = ref<InstanceType<typeof PedidoVendaFormulario> | null>(null);
const formulario = ref<PedidoVendaFormModel>(criarPedidoVendaFormVazio());
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar'>(() =>
  route.name === 'pedido-venda-editar' ? 'editar' : 'criar',
);

const pedidoId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() =>
  modo.value === 'criar' ? 'Novo pedido de venda' : 'Editar pedido de venda',
);

const subtituloPagina = computed(() =>
  modo.value === 'criar'
    ? 'Crie um orçamento com cliente, pagamento e itens.'
    : 'Atualize o orçamento antes de enviar para aprovação.',
);

async function carregarPedido(): Promise<void> {
  if (!pedidoId.value) {
    return;
  }

  const ok = await obter(pedidoId.value);

  if (!ok || !pedido.value) {
    await router.replace({ name: 'pedidos-venda' });
    return;
  }

  if (pedido.value.status !== PedidoVendaStatus.Orcamento) {
    erro('Pedido só pode ser editado em orçamento.');
    await router.replace({
      name: 'pedido-venda-detalhe',
      params: { id: pedidoId.value },
    });
    return;
  }

  formulario.value = pedidoDtoParaForm(pedido.value);
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar') {
    await carregarPedido();
  } else {
    formulario.value = criarPedidoVendaFormVazio();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'pedidos-venda' });
}

async function salvar(): Promise<void> {
  const cabecalhoValido = (await formularioRef.value?.validar()) ?? false;

  if (!cabecalhoValido) {
    return;
  }

  if (formulario.value.itens.length === 0) {
    erro('Pedido de venda deve possuir ao menos um item.');
    return;
  }

  const resultado =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(pedidoId.value!, formulario.value);

  if (resultado) {
    await router.push({
      name: 'pedido-venda-detalhe',
      params: { id: resultado.id },
    });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.pedido-venda-form-page {
  display: grid;
  gap: var(--spacing-6);
}
</style>
