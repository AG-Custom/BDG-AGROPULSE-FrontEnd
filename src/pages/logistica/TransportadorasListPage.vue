<template>
  <q-page class="agro-page">
    <app-page-header titulo="Transportadoras" subtitulo="Cadastro e tabela de fretes.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova"
        descricao="Cadastrar transportadora"
        @click="abrirCriar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input v-model="busca" outlined dense label="Buscar" clearable class="filtro-busca">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <agro-table-skeleton v-if="carregando && transportadoras.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && filtrados.length === 0"
          titulo="Nenhuma transportadora"
          descricao="Cadastre a primeira transportadora."
          icon="business"
        >
          <agro-btn color="primary" unelevated label="Nova" descricao="Cadastrar" @click="abrirCriar" />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="filtrados"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-fretes="props">
            <q-td :props="props" class="text-metric">{{ props.row.fretes?.length ?? 0 }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogCriar" persistent>
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">Nova transportadora</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form greedy @submit.prevent="salvar">
            <q-input
              v-model="formulario.nome"
              outlined
              label="Nome"
              class="field-required q-mb-md"
              :rules="[obrigatorio]"
            />
            <q-input
              v-model="formulario.cnpj"
              outlined
              label="CNPJ"
              class="field-required q-mb-md"
              :rules="[obrigatorio]"
            />
            <q-input v-model="formulario.rntrc" outlined label="RNTRC" class="q-mb-md" />
            <q-input v-model="formulario.telefone" outlined label="Telefone" class="q-mb-md" />
            <q-input v-model="formulario.email" outlined label="E-mail" class="q-mb-md" />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogCriar = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Cadastrar"
                descricao="Salvar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <agro-entity-details-dialog
      v-model="dialogVisualizar"
      :titulo="tituloDetalhe"
      :registro="registroSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { transportadoraVazia, useLogistica } from 'composables/useLogistica';
import type { QTableColumn } from 'quasar';
import type {
  TransportadoraLogisticaDto,
  TransportadoraLogisticaFormModel,
} from 'types/dtos/logistica.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Transportadoras');

const router = useRouter();
const { transportadoras, carregando, salvando, carregarTransportadoras, criarTransportadora } =
  useLogistica();
const busca = ref('');
const dialogCriar = ref(false);
const formulario = ref<TransportadoraLogisticaFormModel>(transportadoraVazia());

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  if (!termo) return transportadoras.value;
  return transportadoras.value.filter((t) =>
    [t.nome, t.cnpj, t.rntrc, t.telefone, t.email]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(termo)),
  );
});

const colunas: QTableColumn<TransportadoraLogisticaDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cnpj', label: 'CNPJ', field: 'cnpj', align: 'left' },
  { name: 'rntrc', label: 'RNTRC', field: 'rntrc', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'fretes', label: 'Fretes', field: (r) => r.fretes?.length ?? 0, align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirCriar(): void {
  formulario.value = transportadoraVazia();
  dialogCriar.value = true;
}

async function salvar(): Promise<void> {
  const criado = await criarTransportadora(formulario.value);
  if (criado) {
    dialogCriar.value = false;
    await carregarTransportadoras();
    await router.push({ name: 'logistica-transportadora-detalhe', params: { id: criado.id } });
  }
}

onMounted(() => {
  void carregarTransportadoras();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.filtro-busca {
  min-width: 220px;
  flex: 1;
}
.dialog-card {
  min-width: min(480px, 92vw);
  background: var(--color-surface-default);
}
</style>
