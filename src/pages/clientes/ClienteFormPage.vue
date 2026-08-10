<template>
  <q-page class="agro-page agro-page--form">
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

        <div
          v-if="!carregandoPagina && modo === 'criar' && podeEditarTabelasPreco"
          class="cliente-form-page__tabela-preco"
        >
          <q-toggle
            v-model="vincularTabelaPreco"
            label="Deseja vincular tabela de preço ao cliente"
            :disable="salvando"
          />

          <div v-if="vincularTabelaPreco" class="cliente-form-page__tabela-lista">
            <div class="agro-filter-bar">
              <q-input
                v-model="buscaTabela"
                outlined
                dense
                clearable
                label="Buscar tabela"
                :disable="salvando"
                @update:model-value="agendarBuscaTabelas"
              />
            </div>

            <agro-table-skeleton v-if="carregandoTabelas && tabelas.length === 0" :colunas="4" />

            <empty-state
              v-else-if="!carregandoTabelas && tabelas.length === 0"
              titulo="Nenhuma tabela encontrada"
              descricao="Cadastre uma tabela de preço ou ajuste a busca."
              icon="sell"
            />

            <q-table
              v-else
              flat
              bordered
              row-key="id"
              hide-pagination
              class="cliente-form-page__tabela"
              :rows="tabelas"
              :columns="colunasTabelas"
              :loading="carregandoTabelas"
              :pagination="{ rowsPerPage: 0 }"
            >
              <template #body-cell-selecao="props">
                <q-td :props="props">
                  <q-radio
                    v-model="tabelaSelecionadaId"
                    :val="props.row.id"
                    color="primary"
                    :disable="salvando"
                    :aria-label="`Selecionar ${props.row.nome}`"
                  />
                </q-td>
              </template>

              <template #body-cell-vigencia="props">
                <q-td :props="props">
                  {{ formatarVigencia(props.row) }}
                </q-td>
              </template>

              <template #body-cell-ativo="props">
                <q-td :props="props">
                  <agro-badge
                    :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                    :variant="props.row.ativo ? 'success' : 'default'"
                  />
                </q-td>
              </template>

              <template #body-cell-acoes="props">
                <q-td :props="props">
                  <agro-acoes-menu
                    :mostrar-editar="false"
                    :mostrar-status="false"
                    :visualizar-to="{ name: 'tabela-preco-visualizar', params: { id: props.row.id } }"
                    visualizar-label="Visualizar tabela de preço"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </div>

        <div
          v-if="!carregandoPagina && modo !== 'visualizar' && !clienteInativo && podeEditarCliente"
          class="agro-form-actions"
        >
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

        <div
          v-else-if="!carregandoPagina && (modo === 'visualizar' || clienteInativo || !podeEditarCliente)"
          class="agro-form-actions"
        >
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

      <cliente-tabelas-preco-section
        v-if="
          podeVerTabelasPreco
          && (modo === 'editar' || modo === 'visualizar')
          && (modo === 'visualizar' || clienteAtivo)
          && clienteCarregado
        "
        :cliente-id="clienteId!"
        :somente-leitura="somenteLeitura || !podeEditarTabelasPreco"
      />

      <cliente-perfil360-section
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
import ClienteTabelasPrecoSection from 'components/clientes/ClienteTabelasPrecoSection.vue';
import ClientePerfil360Section from 'components/crm/ClientePerfil360Section.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAuth } from 'composables/useAuth';
import { useClientes } from 'composables/useClientes';
import { useNotificacao } from 'composables/useNotificacao';
import { useTabelasPreco } from 'composables/useTabelasPreco';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { Permissoes } from 'constants/permissoes';
import { clienteService } from 'services/cliente.service';
import type { ClienteDto, ClienteFormModel } from 'types/dtos/cliente.dto';
import type { TabelaPrecoResumoDto } from 'types/dtos/tabela-preco.dto';
import { clienteDtoParaForm, criarClienteFormVazio } from 'utils/mappers/cliente.mapper';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando: salvandoCliente, criar, editar } = useClientes();
const {
  tabelas,
  carregando: carregandoTabelas,
  salvando: salvandoTabela,
  carregar: carregarTabelas,
  vincularCliente,
} = useTabelasPreco();
const { possuiPermissao } = useAuth();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof ClienteFormulario> | null>(null);
const formulario = ref<ClienteFormModel>(criarClienteFormVazio());
const clienteCarregado = ref<ClienteDto | null>(null);
const carregandoPagina = ref(true);
const vincularTabelaPreco = ref(false);
const tabelaSelecionadaId = ref<string | null>(null);
const buscaTabela = ref('');
let buscaTabelaTimer: ReturnType<typeof setTimeout> | null = null;

const salvando = computed(() => salvandoCliente.value || salvandoTabela.value);

const podeVerTabelasPreco = computed(() =>
  possuiPermissao(Permissoes.TabelasPreco.Visualizar),
);

const podeEditarTabelasPreco = computed(() =>
  possuiPermissao(Permissoes.TabelasPreco.Editar),
);

const podeEditarCliente = computed(() =>
  possuiPermissao(Permissoes.Clientes.Editar),
);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'cliente-visualizar') {
    return 'visualizar';
  }

  return route.name === 'cliente-editar' ? 'editar' : 'criar';
});

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const somenteLeitura = computed(
  () => modo.value === 'visualizar' || !podeEditarCliente.value,
);

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

const colunasTabelas: QTableColumn<TabelaPrecoResumoDto>[] = [
  { name: 'selecao', label: '', field: 'id', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'vigencia', label: 'Vigência', field: 'vigenciaInicio', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function formatarVigencia(tabela: TabelaPrecoResumoDto): string {
  if (tabela.vigenciaFim) {
    return `${tabela.vigenciaInicio} — ${tabela.vigenciaFim}`;
  }

  return `${tabela.vigenciaInicio} — em aberto`;
}

async function carregarListaTabelas(): Promise<void> {
  await carregarTabelas({
    ativo: true,
    busca: buscaTabela.value.trim() || undefined,
  });
}

function agendarBuscaTabelas(): void {
  if (buscaTabelaTimer) {
    clearTimeout(buscaTabelaTimer);
  }

  buscaTabelaTimer = setTimeout(() => {
    void carregarListaTabelas();
  }, 400);
}

watch(vincularTabelaPreco, (ativo) => {
  if (!ativo) {
    tabelaSelecionadaId.value = null;
    return;
  }

  void carregarListaTabelas();
});

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
    vincularTabelaPreco.value = false;
    tabelaSelecionadaId.value = null;
    buscaTabela.value = '';
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

  if (modo.value === 'criar') {
    if (vincularTabelaPreco.value && !tabelaSelecionadaId.value) {
      erro('Selecione uma tabela de preço para vincular ao cliente.');
      return;
    }

    const cliente = await criar(formulario.value);

    if (!cliente) {
      return;
    }

    if (vincularTabelaPreco.value && tabelaSelecionadaId.value) {
      const vinculado = await vincularCliente(tabelaSelecionadaId.value, cliente.id);

      if (!vinculado) {
        await router.push({ name: 'cliente-editar', params: { id: cliente.id } });
        return;
      }
    }

    await router.push({ name: 'clientes' });
    return;
  }

  const sucesso = await editar(clienteId.value!, formulario.value);

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

.cliente-form-page__tabela-preco {
  display: grid;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

.cliente-form-page__tabela-lista {
  display: grid;
  gap: var(--spacing-4);
}

.cliente-form-page__tabela {
  width: 100%;
}
</style>
