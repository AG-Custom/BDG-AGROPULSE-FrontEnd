<template>
  <agro-card class="cliente-contatos">
    <template #header>
      <div class="cliente-contatos__header">
        <h3 class="cliente-contatos__titulo">Contatos</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar contato"
          descricao="Cadastrar novo contato do cliente"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <empty-state
      v-if="contatos.length === 0"
      titulo="Nenhum contato cadastrado"
      descricao="Adicione contatos para facilitar a comunicação com este cliente."
      icon="contacts"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="cliente-contatos__tabela"
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
          <div class="cliente-contatos__telefone">
            <span>{{ formatarTelefone(props.row.telefone) }}</span>
            <agro-btn
              v-if="props.row.telefone"
              flat
              dense
              size="sm"
              icon="chat"
              aria-label="Abrir WhatsApp"
              descricao="Abrir conversa no WhatsApp"
              @click="abrirWhatsAppContato(props.row)"
            />
          </div>
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="props">
        <q-td :props="props" class="cliente-contatos__acoes">
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
      <q-card class="cliente-contatos__dialog">
        <q-card-section>
          <h4 class="cliente-contatos__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Novo contato' : 'Editar contato' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <contato-cliente-formulario
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
            :descricao="modoDialog === 'criar' ? 'Adicionar contato ao cliente' : 'Salvar alterações do contato'"
            :loading="salvando"
            @click="salvarContato"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import ContatoClienteFormulario from 'components/clientes/ContatoClienteFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClienteContatos } from 'composables/useClienteContatos';
import { useNotificacao } from 'composables/useNotificacao';
import type { ClienteContatoDto } from 'types/dtos/cliente.dto';
import { contatoDtoParaForm, criarContatoFormVazio } from 'utils/mappers/cliente.mapper';
import { formatarTelefone } from 'utils/formatters';
import { abrirWhatsAppWeb } from 'utils/whatsapp-web';
import type { QTableColumn } from 'quasar';
import { computed, ref, toRef, watch } from 'vue';

const props = defineProps<{
  clienteId: string;
  contatosIniciais: ClienteContatoDto[];
  somenteLeitura?: boolean;
}>();

const { erro } = useNotificacao();

const {
  contatos,
  salvando,
  removendo,
  definirContatos,
  adicionar,
  editar,
  solicitarRemocao,
} = useClienteContatos(() => props.clienteId);

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const contatoEmEdicaoId = ref<string | null>(null);
const formContato = ref(criarContatoFormVazio());
const formularioRef = ref<InstanceType<typeof ContatoClienteFormulario> | null>(null);

const colunas = computed(() => {
  const base: QTableColumn<ClienteContatoDto>[] = [
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

function abrirWhatsAppContato(contato: ClienteContatoDto): void {
  if (!contato.telefone) {
    erro('Este contato não possui telefone cadastrado.');
    return;
  }

  const mensagem = contato.nome ? `Olá ${contato.nome},` : undefined;

  if (!abrirWhatsAppWeb(contato.telefone, mensagem)) {
    erro('Telefone inválido para abrir o WhatsApp.');
  }
}

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  contatoEmEdicaoId.value = null;
  formContato.value = criarContatoFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(contato: ClienteContatoDto): void {
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
.cliente-contatos__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.cliente-contatos__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.cliente-contatos__telefone {
  align-items: center;
  display: flex;
  gap: var(--spacing-1);
}

.cliente-contatos__acoes {
  white-space: nowrap;
}

.cliente-contatos__dialog {
  min-width: min(480px, 90vw);
  width: 100%;
}

.cliente-contatos__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
