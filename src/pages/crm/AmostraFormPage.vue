<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="titulo" subtitulo="Amostra ou demonstração em campo." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.clienteId"
                entidade="cliente"
                label="Cliente"
                class="field-required"
                :options="clienteOpcoes"
                :loading="carregandoClientes"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
                :desabilitar-cadastro="somenteLeitura"
                @atualizar="carregarClientes()"
              />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.vendedorUsuarioId"
                entidade="usuario"
                label="Vendedor"
                clearable
                :options="vendedorOpcoes"
                :loading="carregandoUsuarios"
                :readonly="somenteLeitura"
                :desabilitar-cadastro="somenteLeitura"
                @atualizar="carregarUsuarios()"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formulario.status"
                outlined
                label="Status"
                emit-value
                map-options
                :options="StatusAmostraCampoOpcoes"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.quantidade"
                outlined
                label="Quantidade"
                type="number"
                step="0.01"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input v-model="formulario.unidade" outlined label="Unidade"
                :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataEntrega"
                outlined
                label="Data entrega"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataRetorno"
                outlined
                label="Data retorno"
                type="date"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.cultura" outlined label="Cultura"
                :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.produtoId"
                entidade="produto"
                label="Produto"
                clearable
                :options="produtoOpcoes"
                :loading="carregandoProdutos"
                :readonly="somenteLeitura"
                :desabilitar-cadastro="somenteLeitura"
                @atualizar="carregarProdutos()"
                @update:model-value="onProdutoChange"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.pedidoVendaId"
                outlined
                label="Pedido de venda"
                clearable
                emit-value
                map-options
                :options="pedidoOpcoes"
                :loading="carregandoPedidos"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.resultado" outlined label="Resultado"
                :readonly="somenteLeitura" />
            </div>
          </div>

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'crm-amostras' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              descricao="Salvar amostra"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'crm-amostras' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useClientes } from 'composables/useClientes';
import { amostraDtoParaForm, amostraVazia, useCrm } from 'composables/useCrm';
import { usePedidosVenda } from 'composables/usePedidosVenda';
import { useProdutos } from 'composables/useProdutos';
import { useUsuarios } from 'composables/useUsuarios';
import {
  isPerfilCarteiraVendedor,
  StatusAmostraCampoOpcoes,
  UsuarioStatus,
} from 'constants/enums';
import type { AmostraCampoFormModel } from 'types/dtos/crm.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { criarAmostra, editarAmostra, obterAmostra, amostra, salvando } = useCrm();
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
  produtos,
  carregando: carregandoProdutos,
  carregar: carregarProdutos,
} = useProdutos();
const {
  pedidos,
  carregando: carregandoPedidos,
  carregar: carregarPedidos,
} = usePedidosVenda();

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'crm-amostra-visualizar') {
    return 'visualizar';
  }

  return route.name === 'crm-amostra-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');
const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova amostra';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar amostra';
  }

  return 'Editar amostra';
});
const carregandoPagina = ref(modo.value === 'editar' || modo.value === 'visualizar');
const formulario = ref<AmostraCampoFormModel>(amostraVazia());

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);

const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (u) =>
        u.status === UsuarioStatus.Ativo &&
        (isPerfilCarteiraVendedor(u.perfil) ||
          u.id === formulario.value.vendedorUsuarioId),
    )
    .map((u) => ({ label: nomeCompleto(u), value: u.id })),
);

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const pedidoOpcoes = computed(() =>
  pedidos.value.map((p) => ({
    label: `${p.id.slice(0, 8)}… · ${formatarMoeda(p.valorTotal)} · ${formatarData(p.createdAt)}`,
    value: p.id,
  })),
);

function onProdutoChange(valor: unknown): void {
  const produtoId = typeof valor === 'string' ? valor : '';

  if (!produtoId) {
    formulario.value.produtoNome = '';
    return;
  }
  const produto = produtos.value.find((p) => p.id === produtoId);
  formulario.value.produtoNome = produto?.descricao ?? '';
}

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarAmostra(formulario.value);
    if (criado) await router.push({ name: 'crm-amostras' });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarAmostra(id, formulario.value);
  if (atualizado) await router.push({ name: 'crm-amostras' });
}

onMounted(async () => {
  void carregarClientes();
  void carregarUsuarios();
  void carregarProdutos();
  void carregarPedidos();
  if (modo.value === 'editar' || modo.value === 'visualizar') {
    const ok = await obterAmostra(String(route.params.id));
    if (ok && amostra.value) formulario.value = amostraDtoParaForm(amostra.value);
  }
  carregandoPagina.value = false;
});
</script>
