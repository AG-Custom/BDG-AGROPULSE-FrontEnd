<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="titulo" subtitulo="Dados da oportunidade no pipeline." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario oportunidade-form" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
          <h3 class="oportunidade-form__secao-titulo">Pipeline</h3>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.clienteId"
                outlined
                label="Cliente"
                emit-value
                map-options
                class="field-required"
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
                clearable
                emit-value
                map-options
                :options="vendedorOpcoes"
                :loading="carregandoUsuarios"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.etapa"
                outlined
                label="Etapa"
                emit-value
                map-options
                :options="EtapaOportunidadeOpcoes"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-3">
              <AgroMoneyInput
                v-model="formulario.valorEstimado"
                label="Valor estimado"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.probabilidade"
                outlined
                label="Probabilidade (%)"
                type="number"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <h3 class="oportunidade-form__secao-titulo">Produto e prazo</h3>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.cultura" outlined label="Cultura"
                :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="formulario.safraRef" outlined label="Safra (ref.)"
                :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.dataPrevista"
                outlined
                label="Data prevista"
                type="date"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoId"
                outlined
                label="Produto"
                clearable
                emit-value
                map-options
                :options="produtoOpcoes"
                :loading="carregandoProdutos"
                @update:model-value="onProdutoChange"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacoes"
                outlined
                label="Observações"
                type="textarea"
                autogrow
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar"
              :to="{ name: 'crm-oportunidades' }"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              descricao="Salvar oportunidade"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'crm-oportunidades' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { useClientes } from 'composables/useClientes';
import {
  oportunidadeDtoParaForm,
  oportunidadeVazia,
  useCrm,
} from 'composables/useCrm';
import { useProdutos } from 'composables/useProdutos';
import { useUsuarios } from 'composables/useUsuarios';
import {
  EtapaOportunidadeOpcoes,
  isPerfilCarteiraVendedor,
  UsuarioStatus,
} from 'constants/enums';
import type { OportunidadeFormModel } from 'types/dtos/crm.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { criarOportunidade, editarOportunidade, obterOportunidade, oportunidade, salvando } =
  useCrm();
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

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'crm-oportunidade-visualizar') {
    return 'visualizar';
  }

  return route.name === 'crm-oportunidade-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');
const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova oportunidade';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar oportunidade';
  }

  return 'Editar oportunidade';
});
const carregandoPagina = ref(modo.value === 'editar' || modo.value === 'visualizar');
const formulario = ref<OportunidadeFormModel>(oportunidadeVazia());

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

function onProdutoChange(produtoId: string | null): void {
  if (!produtoId) {
    formulario.value.produtoNome = '';
    return;
  }
  const produto = produtos.value.find((p) => p.id === produtoId);
  formulario.value.produtoNome = produto?.descricao ?? '';
}

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarOportunidade(formulario.value);
    if (criado) await router.push({ name: 'crm-oportunidades' });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarOportunidade(id, formulario.value);
  if (atualizado) await router.push({ name: 'crm-oportunidades' });
}

onMounted(async () => {
  void carregarClientes();
  void carregarUsuarios();
  void carregarProdutos();
  if (modo.value === 'editar' || modo.value === 'visualizar') {
    const ok = await obterOportunidade(String(route.params.id));
    if (ok && oportunidade.value) {
      formulario.value = oportunidadeDtoParaForm(oportunidade.value);
    }
  }
  carregandoPagina.value = false;
});
</script>

<style scoped>
.oportunidade-form__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}
</style>
