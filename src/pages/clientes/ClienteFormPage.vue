<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section cliente-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="10" />

        <q-banner
          v-if="!carregandoPagina && clienteInativo"
          rounded
          class="cliente-form-page__aviso"
        >
          Este cliente está inativo e não pode ser editado.
        </q-banner>

        <cliente-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modoFormulario"
          :somente-leitura="somenteLeitura || clienteInativo"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !clienteInativo" class="agro-form-actions">
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
            :descricao="modo === 'criar' ? 'Cadastrar novo cliente' : 'Salvar alterações do cliente'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || clienteInativo)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de clientes"
            @click="voltar"
          />
        </div>
      </agro-card>

      <cliente-enderecos-section
        v-if="(modo === 'editar' || modo === 'visualizar') && (modo === 'visualizar' || clienteAtivo) && clienteCarregado"
        :cliente-id="clienteId!"
        :enderecos-iniciais="clienteCarregado.enderecos"
        :somente-leitura="somenteLeitura"
      />

      <cliente-contatos-section
        v-if="(modo === 'editar' || modo === 'visualizar') && (modo === 'visualizar' || clienteAtivo) && clienteCarregado"
        :cliente-id="clienteId!"
        :contatos-iniciais="clienteCarregado.contatos"
        :somente-leitura="somenteLeitura"
      />

      <cliente-historico-comercial-section
        v-if="(modo === 'editar' || modo === 'visualizar') && clienteCarregado"
        :cliente-id="clienteId!"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ClienteContatosSection from 'components/clientes/ClienteContatosSection.vue';
import ClienteEnderecosSection from 'components/clientes/ClienteEnderecosSection.vue';
import ClienteFormulario from 'components/clientes/ClienteFormulario.vue';
import ClienteHistoricoComercialSection from 'components/clientes/ClienteHistoricoComercialSection.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useClientes } from 'composables/useClientes';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { clienteService } from 'services/cliente.service';
import type { ClienteDto, ClienteFormModel } from 'types/dtos/cliente.dto';
import { clienteDtoParaForm, criarClienteFormVazio } from 'utils/mappers/cliente.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useClientes();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof ClienteFormulario> | null>(null);
const formulario = ref<ClienteFormModel>(criarClienteFormVazio());
const clienteCarregado = ref<ClienteDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'cliente-visualizar') {
    return 'visualizar';
  }

  return route.name === 'cliente-editar' ? 'editar' : 'criar';
});

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const somenteLeitura = computed(() => modo.value === 'visualizar');

const clienteId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo cliente';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar cliente';
  }

  return 'Editar cliente';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre um novo cliente vinculado à unidade selecionada.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados do cliente selecionado.';
  }

  return 'Atualize os dados do cliente selecionado.';
});

const clienteInativo = computed(
  () => modo.value === 'editar' && clienteCarregado.value?.ativo === false,
);

const clienteAtivo = computed(
  () => modo.value === 'editar' && clienteCarregado.value?.ativo === true,
);

async function carregarCliente(): Promise<void> {
  if (!clienteId.value) {
    return;
  }

  try {
    clienteCarregado.value = await clienteService.obter(clienteId.value);
    formulario.value = clienteDtoParaForm(clienteCarregado.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'clientes' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarCliente();
  } else {
    formulario.value = criarClienteFormVazio();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'clientes' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(clienteId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'clientes' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.cliente-form-page {
  display: grid;
  gap: var(--spacing-6);
}

.cliente-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
