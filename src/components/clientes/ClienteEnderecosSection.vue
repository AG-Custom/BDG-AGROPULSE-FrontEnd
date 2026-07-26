<template>
  <agro-card class="cliente-enderecos">
    <template #header>
      <div class="cliente-enderecos__header">
        <h3 class="cliente-enderecos__titulo">Endereços</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar endereço"
          descricao="Cadastrar novo endereço do cliente"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <empty-state
      v-if="enderecos.length === 0"
      titulo="Nenhum endereço cadastrado"
      descricao="Adicione endereços de cobrança, entrega ou propriedade rural."
      icon="location_on"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="cliente-enderecos__tabela"
      :rows="enderecos"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-tipo="props">
        <q-td :props="props">
          {{ rotuloTipo(props.row.tipo) }}
        </q-td>
      </template>

      <template #body-cell-endereco="props">
        <q-td :props="props">
          {{ formatarEndereco(props.row) }}
        </q-td>
      </template>

      <template #body-cell-coordenadas="props">
        <q-td :props="props">
          <span v-if="props.row.latitude !== null && props.row.longitude !== null">
            {{ props.row.latitude }}, {{ props.row.longitude }}
          </span>
          <span v-else class="text-secondary">—</span>
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="props">
        <q-td :props="props" class="cliente-enderecos__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            mostrar-excluir
            :loading-excluir="removendo"
            editar-label="Editar endereço"
            excluir-label="Remover endereço"
            @editar="abrirDialogEditar(props.row)"
            @excluir="solicitarRemocao(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="cliente-enderecos__dialog">
        <q-card-section>
          <h4 class="cliente-enderecos__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Novo endereço' : 'Editar endereço' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <endereco-cliente-formulario
            ref="formularioRef"
            v-model:formulario="formEndereco"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem salvar o endereço"
            :disable="salvando"
            @click="fecharDialog"
          />
          <agro-btn
            color="primary"
            unelevated
            :label="modoDialog === 'criar' ? 'Adicionar' : 'Salvar'"
            :descricao="modoDialog === 'criar' ? 'Adicionar endereço ao cliente' : 'Salvar alterações do endereço'"
            :loading="salvando"
            @click="salvarEndereco"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import EnderecoClienteFormulario from 'components/clientes/EnderecoClienteFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { TipoEnderecoClienteOpcoes } from 'constants/enums';
import { useClienteEnderecos } from 'composables/useClienteEnderecos';
import type { ClienteEnderecoDto } from 'types/dtos/cliente.dto';
import type { TipoEnderecoClienteValor } from 'constants/enums';
import {
  criarEnderecoFormVazio,
  enderecoDtoParaForm,
} from 'utils/mappers/cliente.mapper';
import { formatarCep } from 'utils/formatters';
import type { QTableColumn } from 'quasar';
import { computed, ref, toRef, watch } from 'vue';

const props = defineProps<{
  clienteId: string;
  enderecosIniciais: ClienteEnderecoDto[];
  somenteLeitura?: boolean;
}>();

const {
  enderecos,
  salvando,
  removendo,
  definirEnderecos,
  adicionar,
  editar,
  solicitarRemocao,
} = useClienteEnderecos(() => props.clienteId);

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const enderecoEmEdicaoId = ref<string | null>(null);
const formEndereco = ref(criarEnderecoFormVazio());
const formularioRef = ref<InstanceType<typeof EnderecoClienteFormulario> | null>(null);

const colunas = computed(() => {
  const base: QTableColumn<ClienteEnderecoDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'endereco', label: 'Endereço', field: 'endereco', align: 'left' },
  { name: 'coordenadas', label: 'GPS', field: 'latitude', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }
  return base;
});

watch(
  toRef(props, 'enderecosIniciais'),
  (lista) => {
    definirEnderecos(lista);
  },
  { immediate: true },
);

function rotuloTipo(tipo: TipoEnderecoClienteValor): string {
  return TipoEnderecoClienteOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

function formatarEndereco(endereco: ClienteEnderecoDto): string {
  const { logradouro, numero, bairro, cidade, estado, cep } = endereco.endereco;
  return `${logradouro}, ${numero} — ${bairro}, ${cidade}/${estado} — ${formatarCep(cep)}`;
}

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  enderecoEmEdicaoId.value = null;
  formEndereco.value = criarEnderecoFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(endereco: ClienteEnderecoDto): void {
  modoDialog.value = 'editar';
  enderecoEmEdicaoId.value = endereco.id;
  formEndereco.value = enderecoDtoParaForm(endereco);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvarEndereco(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modoDialog.value === 'criar'
      ? await adicionar(formEndereco.value)
      : await editar(enderecoEmEdicaoId.value!, formEndereco.value);

  if (sucesso) {
    fecharDialog();
  }
}
</script>

<style scoped>
.cliente-enderecos__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.cliente-enderecos__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.cliente-enderecos__acoes {
  white-space: nowrap;
}

.cliente-enderecos__dialog {
  min-width: min(640px, 95vw);
  width: 100%;
}

.cliente-enderecos__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
