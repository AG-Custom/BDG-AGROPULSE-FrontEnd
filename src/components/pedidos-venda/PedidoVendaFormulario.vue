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
import { useUsuarios } from 'composables/useUsuarios';
import {
  FormaPagamentoOpcoes,
  PerfilUsuario,
  UsuarioStatus,
} from 'constants/enums';
import type { QForm } from 'quasar';
import type { PedidoVendaFormModel } from 'types/dtos/pedido-venda.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

defineProps<{
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<PedidoVendaFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

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
        (usuario.perfil === PerfilUsuario.Vendedor ||
          usuario.perfil === PerfilUsuario.Gerente ||
          usuario.perfil === PerfilUsuario.Diretor ||
          usuario.id === formulario.value.vendedorUsuarioId),
    )
    .map((usuario) => ({
      label: nomeCompleto(usuario),
      value: usuario.id,
    })),
);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregarClientes({ ativo: true });
  void carregarUsuarios();
  void carregarCondicoes();
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
