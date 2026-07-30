<template>
  <q-form
    ref="formRef"
    class="pedido-venda-formulario agro-formulario"
    greedy
    :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
  >
    <fieldset class="agro-formulario__fieldset">
      <h3 class="pedido-venda-formulario__secao-titulo">Cabeçalho</h3>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.clienteId"
            outlined
            label="Cliente"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="clienteOpcoes"
            :loading="carregandoClientes"
            :rules="[obrigatorio]"
            :readonly="somenteLeitura"
            @update:model-value="onClienteChange"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.vendedorUsuarioId"
            outlined
            label="Vendedor"
            hint="Opcional — se vazio, usa o usuário autenticado"
            emit-value
            map-options
            clearable
            :options="vendedorOpcoes"
            :loading="carregandoUsuarios"
            :readonly="somenteLeitura"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.tabelaPrecoId"
            outlined
            label="Tabela de preço"
            hint="Opcional — resolve preço automático nos itens"
            emit-value
            map-options
            clearable
            :options="tabelaOpcoes"
            :loading="carregandoTabelas"
            :readonly="somenteLeitura"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.contratoId"
            outlined
            label="Contrato (trava de preço)"
            hint="Opcional — CPR/Barter/Termo trava o preço do produto do contrato"
            emit-value
            map-options
            clearable
            :options="contratoOpcoes"
            :loading="carregandoContratos"
            :readonly="somenteLeitura"
            :disable="!formulario.clienteId"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.condicaoPagamentoId"
            outlined
            label="Condição de pagamento"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="condicaoOpcoes"
            :loading="carregandoCondicoes"
            :rules="[obrigatorio]"
            :readonly="somenteLeitura"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.formaPagamento"
            outlined
            label="Forma de pagamento"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="FormaPagamentoOpcoes"
            :rules="[obrigatorio]"
            :readonly="somenteLeitura"
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="formulario.observacao"
            outlined
            label="Observação"
            type="textarea"
            maxlength="1000"
            counter
            autogrow
            :readonly="somenteLeitura"
          />
        </div>
      </div>
    </fieldset>
  </q-form>
</template>

<script setup lang="ts">
import { useClientes } from 'composables/useClientes';
import { useCondicoesPagamento } from 'composables/useCondicoesPagamento';
import {
  listarContratosAbertosPorCliente,
  type ContratoComTipo,
} from 'composables/useContratos';
import { usePrecificacao } from 'composables/usePrecificacao';
import { useUsuarios } from 'composables/useUsuarios';
import {
  FormaPagamentoOpcoes,
  isPerfilCarteiraVendedor,
  UsuarioStatus,
} from 'constants/enums';
import type { QForm } from 'quasar';
import type { PedidoVendaFormModel } from 'types/dtos/pedido-venda.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

defineProps<{
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<PedidoVendaFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const contratosCliente = ref<ContratoComTipo[]>([]);
const carregandoContratos = ref(false);

const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();

const {
  usuarios,
  carregando: carregandoUsuarios,
  carregar: carregarUsuarios,
  nomeCompleto,
} = useUsuarios();

const {
  condicaoOpcoes,
  carregando: carregandoCondicoes,
  carregar: carregarCondicoes,
} = useCondicoesPagamento();

const {
  tabelaOpcoes,
  tabelaPadraoId,
  carregandoTabelas,
  carregarTabelasPermitidas,
} = usePrecificacao();

const clienteOpcoes = computed(() =>
  clientes.value
    .filter((cliente) => cliente.ativo || cliente.id === formulario.value.clienteId)
    .map((cliente) => ({
      label: cliente.nomeRazao,
      value: cliente.id,
    })),
);

const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (usuario) =>
        usuario.status === UsuarioStatus.Ativo &&
        (isPerfilCarteiraVendedor(usuario.perfil) ||
          usuario.id === formulario.value.vendedorUsuarioId),
    )
    .map((usuario) => ({
      label: nomeCompleto(usuario),
      value: usuario.id,
    })),
);

const contratoOpcoes = computed(() =>
  contratosCliente.value.map((contrato) => ({
    label: `${contrato.tipoRotulo} — ${formatarMoeda(contrato.preco)} — ${contrato.id.slice(0, 8)}…`,
    value: contrato.id,
  })),
);

async function carregarContratosCliente(clienteId: string): Promise<void> {
  if (!clienteId) {
    contratosCliente.value = [];
    return;
  }

  carregandoContratos.value = true;

  try {
    contratosCliente.value = await listarContratosAbertosPorCliente(clienteId);
  } catch {
    contratosCliente.value = [];
  } finally {
    carregandoContratos.value = false;
  }
}

async function onClienteChange(clienteId: string): Promise<void> {
  formulario.value.contratoId = '';
  await Promise.all([
    carregarTabelasPermitidas({ clienteId: clienteId || null }),
    carregarContratosCliente(clienteId),
  ]);
  if (!formulario.value.tabelaPrecoId && tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
}

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

watch(
  () => formulario.value.clienteId,
  (clienteId) => {
    if (clienteId) {
      void carregarTabelasPermitidas({ clienteId });
      void carregarContratosCliente(clienteId);
    } else {
      contratosCliente.value = [];
    }
  },
);

onMounted(() => {
  void carregarClientes({ ativo: true });
  void carregarUsuarios();
  void carregarCondicoes();
  void carregarTabelasPermitidas({
    clienteId: formulario.value.clienteId || null,
  });
  if (formulario.value.clienteId) {
    void carregarContratosCliente(formulario.value.clienteId);
  }
});

defineExpose({ validar });
</script>

<style scoped>
.agro-formulario__fieldset {
  border: 0;
  margin: 0;
  min-width: 0;
  padding: 0;
}

.pedido-venda-formulario__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-4);
}
</style>
