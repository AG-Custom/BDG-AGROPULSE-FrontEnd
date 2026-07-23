<template>
  <agro-card class="fornecedor-contatos">
    <template #header>
      <div class="fornecedor-contatos__header">
        <h3 class="fornecedor-contatos__titulo">Contatos</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar contato"
          descricao="Cadastrar novo contato do fornecedor"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <empty-state
      v-if="contatos.length === 0"
      titulo="Nenhum contato cadastrado"
      descricao="Adicione contatos para facilitar a comunicação com este fornecedor."
      icon="contacts"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="fornecedor-contatos__tabela"
      :rows="contatos"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-principal="props">
        <q-td :props="props">
          <agro-badge
            v-if="props.row.principal"
            label="Principal"
            variant="accent"
          />
          <span v-else class="text-secondary">—</span>
        </q-td>
      </template>

      <template #body-cell-telefone="props">
        <q-td :props="props">
          {{ formatarTelefone(props.row.telefone) }}
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="props">
        <q-td :props="props" class="fornecedor-contatos__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            mostrar-excluir
            :loading-excluir="removendo"
            editar-label="Editar contato"
            excluir-label="Remover contato"
            @editar="abrirDialogEditar(props.row)"
            @excluir="solicitarRemocao(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="fornecedor-contatos__dialog">
        <q-card-section>
          <h4 class="fornecedor-contatos__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Novo contato' : 'Editar contato' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <contato-fornecedor-formulario
            ref="formularioRef"
            v-model:formulario="formContato"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem salvar o contato"
            :disable="salvando"
            @click="fecharDialog"
          />
          <agro-btn
            color="primary"
            unelevated
            :label="modoDialog === 'criar' ? 'Adicionar' : 'Salvar'"
            :descricao="modoDialog === 'criar' ? 'Adicionar contato ao fornecedor' : 'Salvar alterações do contato'"
            :loading="salvando"
            @click="salvarContato"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import ContatoFornecedorFormulario from 'components/fornecedores/ContatoFornecedorFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFornecedorContatos } from 'composables/useFornecedorContatos';
import type { ContatoFornecedorDto } from 'types/dtos/fornecedor.dto';
import {
  contatoDtoParaForm,
  criarContatoFormVazio,
} from 'utils/mappers/fornecedor.mapper';
import { formatarTelefone } from 'utils/formatters';
import type { QTableColumn } from 'quasar';
import { computed, ref, toRef, watch } from 'vue';

const props = defineProps<{
  fornecedorId: string;
  contatosIniciais: ContatoFornecedorDto[];
  somenteLeitura?: boolean;
}>();

const {
  contatos,
  salvando,
  removendo,
  definirContatos,
  adicionar,
  editar,
  solicitarRemocao,
} = useFornecedorContatos(() => props.fornecedorId);

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const contatoEmEdicaoId = ref<string | null>(null);
const formContato = ref(criarContatoFormVazio());
const formularioRef = ref<InstanceType<typeof ContatoFornecedorFormulario> | null>(null);

const colunas = computed(() => {
  const base: QTableColumn<ContatoFornecedorDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left', sortable: true },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left', sortable: true },
  { name: 'principal', label: 'Principal', field: 'principal', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }
  return base;
});

watch(
  toRef(props, 'contatosIniciais'),
  (lista) => {
    definirContatos(lista);
  },
  { immediate: true },
);

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  contatoEmEdicaoId.value = null;
  formContato.value = criarContatoFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(contato: ContatoFornecedorDto): void {
  modoDialog.value = 'editar';
  contatoEmEdicaoId.value = contato.id;
  formContato.value = contatoDtoParaForm(contato);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvarContato(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modoDialog.value === 'criar'
      ? await adicionar(formContato.value)
      : await editar(contatoEmEdicaoId.value!, formContato.value);

  if (sucesso) {
    fecharDialog();
  }
}
</script>

<style scoped>
.fornecedor-contatos__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.fornecedor-contatos__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.fornecedor-contatos__acoes {
  white-space: nowrap;
}

.fornecedor-contatos__dialog {
  min-width: min(480px, 90vw);
  width: 100%;
}

.fornecedor-contatos__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
