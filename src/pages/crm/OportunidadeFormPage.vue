<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Dados da oportunidade no pipeline." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
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
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formulario.etapa"
                outlined
                label="Etapa"
                emit-value
                map-options
                :options="EtapaOportunidadeOpcoes"
              />
            </div>
            <div class="col-6 col-md-4">
              <AgroMoneyInput
                v-model="formulario.valorEstimado"
                label="Valor estimado"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.probabilidade"
                outlined
                label="Probabilidade (%)"
                type="number"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.cultura" outlined label="Cultura" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.safraRef" outlined label="Safra (ref.)" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataPrevista"
                outlined
                label="Data prevista"
                type="date"
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
              />
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
  PerfilUsuario,
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

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() =>
  modo.value === 'criar' ? 'Nova oportunidade' : 'Editar oportunidade',
);
const carregandoPagina = ref(modo.value === 'editar');
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
        (u.perfil === PerfilUsuario.Vendedor ||
          u.perfil === PerfilUsuario.Consultor ||
          u.perfil === PerfilUsuario.Gerente ||
          u.perfil === PerfilUsuario.Diretor ||
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
  if (modo.value === 'editar') {
    const ok = await obterOportunidade(String(route.params.id));
    if (ok && oportunidade.value) {
      formulario.value = oportunidadeDtoParaForm(oportunidade.value);
    }
  }
  carregandoPagina.value = false;
});
</script>
