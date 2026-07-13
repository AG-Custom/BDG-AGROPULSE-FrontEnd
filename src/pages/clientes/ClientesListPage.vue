<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Clientes"
      subtitulo="Gerencie os clientes cadastrados na sua empresa."
    >
      <div class="clientes-list__acoes-header">
        <agro-btn
          flat
          icon="table_view"
          label="Excel"
          descricao="Exportar listagem para Excel"
          :loading="exportando"
          @click="exportarLista('excel')"
        />
        <agro-btn
          flat
          icon="picture_as_pdf"
          label="PDF"
          descricao="Exportar listagem para PDF"
          :loading="exportando"
          @click="exportarLista('pdf')"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="add"
          label="Novo cliente"
          descricao="Cadastrar um novo cliente"
          :to="{ name: 'cliente-novo' }"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            hint="Nome, razão social ou documento"
            clearable
            class="clientes-list__busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="filtroAtivo"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            class="clientes-list__status"
            :options="opcoesStatus"
          />

          <q-select
            v-if="!ehVendedor"
            v-model="filtroVendedor"
            outlined
            dense
            label="Vendedor"
            emit-value
            map-options
            clearable
            class="clientes-list__vendedor"
            :options="vendedorOpcoes"
            :loading="carregandoUsuarios"
          />
        </div>

        <agro-table-skeleton v-if="carregando && clientes.length === 0" :colunas="7" />

        <empty-state
          v-else-if="!carregando && clientes.length === 0"
          titulo="Nenhum cliente encontrado"
          :descricao="descricaoVazia"
          icon="groups"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'todos'"
            color="primary"
            unelevated
            label="Cadastrar cliente"
            descricao="Ir para o cadastro de cliente"
            :to="{ name: 'cliente-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="clientes-list__tabela"
          :rows="clientes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-documento="props">
            <q-td :props="props">
              {{ rotuloDocumento(props.row) }}
            </q-td>
          </template>

          <template #body-cell-tipoCliente="props">
            <q-td :props="props">
              {{ rotuloTipoCliente(props.row.tipoCliente) }}
            </q-td>
          </template>

          <template #body-cell-grupoComercial="props">
            <q-td :props="props">
              {{ rotuloGrupoComercial(props.row.grupoComercial) }}
            </q-td>
          </template>

          <template #body-cell-nomeFantasia="props">
            <q-td :props="props">
              {{ props.row.nomeFantasia || '—' }}
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
            <q-td :props="props" class="clientes-list__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Visualizar cliente"
                :to="{ name: 'cliente-visualizar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar cliente"
                :to="{ name: 'cliente-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.ativo"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar cliente"
                :loading="inativando"
                @click="inativarCliente(props.row)"
              />
              <agro-btn
                v-else
                flat
                round
                dense
                icon="check_circle"
                color="positive"
                descricao="Reativar cliente"
                :loading="ativando"
                @click="ativarCliente(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { usePerfilAtual } from 'composables/usePerfilAtual';
import { useUsuarios } from 'composables/useUsuarios';
import {
  GrupoComercialOpcoes,
  PerfilUsuario,
  TipoClienteOpcoes,
  UsuarioStatus,
  type ExportacaoFormatoValor,
  type GrupoComercialValor,
  type TipoClienteValor,
} from 'constants/enums';
import type { ClienteResumoDto, ListarClientesParams } from 'types/dtos/cliente.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const {
  clientes,
  carregando,
  inativando,
  ativando,
  exportando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
  exportar,
  rotuloDocumento,
} = useClientes();

const { ehVendedor } = usePerfilAtual();
const {
  usuarios,
  carregando: carregandoUsuarios,
  carregar: carregarUsuarios,
  nomeCompleto,
} = useUsuarios();

const busca = ref('');
const filtroAtivo = ref<'todos' | 'ativos' | 'inativos'>('ativos');
const filtroVendedor = ref<string | null>(null);

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (usuario) =>
        usuario.status === UsuarioStatus.Ativo &&
        (usuario.perfil === PerfilUsuario.Vendedor ||
          usuario.perfil === PerfilUsuario.Gerente ||
          usuario.perfil === PerfilUsuario.Diretor),
    )
    .map((usuario) => ({
      label: nomeCompleto(usuario),
      value: usuario.id,
    })),
);

const colunas: QTableColumn<ClienteResumoDto>[] = [
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  { name: 'nomeRazao', label: 'Nome / Razão social', field: 'nomeRazao', align: 'left', sortable: true },
  { name: 'nomeFantasia', label: 'Nome fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'tipoCliente', label: 'Tipo', field: 'tipoCliente', align: 'left', sortable: true },
  { name: 'grupoComercial', label: 'Grupo', field: 'grupoComercial', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'todos') {
    return 'Nenhum cliente corresponde aos filtros aplicados.';
  }

  return 'Cadastre clientes para gerenciar vendas e relacionamento comercial.';
});

function montarParams(): ListarClientesParams {
  const params: ListarClientesParams = {};

  if (filtroAtivo.value === 'ativos') {
    params.ativo = true;
  } else if (filtroAtivo.value === 'inativos') {
    params.ativo = false;
  }

  const termo = busca.value.trim();
  if (termo) {
    params.busca = termo;
  }

  if (!ehVendedor.value && filtroVendedor.value) {
    params.vendedorId = filtroVendedor.value;
  }

  return params;
}

function rotuloTipoCliente(tipo: TipoClienteValor): string {
  return TipoClienteOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

function rotuloGrupoComercial(grupo: GrupoComercialValor): string {
  return GrupoComercialOpcoes.find((opcao) => opcao.value === grupo)?.label ?? grupo;
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
}

async function exportarLista(formato: ExportacaoFormatoValor): Promise<void> {
  await exportar(formato, montarParams());
}

async function inativarCliente(cliente: ClienteResumoDto): Promise<void> {
  const sucesso = await solicitarInativacao(cliente);

  if (sucesso) {
    await recarregar();
  }
}

async function ativarCliente(cliente: ClienteResumoDto): Promise<void> {
  const sucesso = await solicitarAtivacao(cliente);

  if (sucesso) {
    await recarregar();
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch([busca, filtroAtivo, filtroVendedor], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void recarregar();
  }, 400);
});

onMounted(() => {
  if (!ehVendedor.value) {
    void carregarUsuarios();
  }

  void recarregar();
});
</script>

<style scoped>
.clientes-list__acoes-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.clientes-list__busca {
  flex: 1;
  min-width: 240px;
}

.clientes-list__status,
.clientes-list__vendedor {
  min-width: 160px;
}

.clientes-list__acoes {
  white-space: nowrap;
}
</style>
