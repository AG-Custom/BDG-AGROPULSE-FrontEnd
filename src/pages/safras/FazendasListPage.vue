<template>
  <q-page class="agro-page">
    <app-page-header titulo="Fazendas" subtitulo="Cadastro de propriedades rurais.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova fazenda"
        descricao="Cadastrar fazenda"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && fazendas.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && fazendas.length === 0"
          titulo="Nenhuma fazenda"
          descricao="Cadastre a primeira fazenda."
          icon="agriculture"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="fazendas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-areaTotalHa="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.areaTotalHa != null ? formatarDecimal(props.row.areaTotalHa) : '—' }}
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
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :mostrar-status="props.row.ativo"
                :loading-status="salvando"
                @editar="abrirDialog(props.row)"
                @desabilitar="inativar(props.row.id)"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ somenteLeitura ? 'Visualizar fazenda' : editandoId ? 'Editar fazenda' : 'Nova fazenda' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formulario.nome"
                  outlined
                  label="Nome"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.municipio" outlined label="Município" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-3">
                <q-input v-model="formulario.uf" outlined label="UF" maxlength="2" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model="formulario.areaTotalHa"
                  outlined
                  label="Área total (ha)"
                  type="number"
                  step="0.01" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <agro-select-cadastro
                  v-model="formulario.clienteId"
                  entidade="cliente"
                  label="Cliente"
                  clearable
                  :options="clienteOpcoes"
                  :loading="carregandoClientes"
                  :readonly="somenteLeitura"
                  @atualizar="carregarClientes()"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="dialog = false" />
              </template>
              <template v-else>
                <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
                <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
              </template>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useFazendas } from 'composables/useFazendas';
import type { QTableColumn } from 'quasar';
import type { FazendaDto, FazendaFormModel } from 'types/dtos/safras.dto';
import { formatarDecimal } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const { fazendas, carregando, salvando, carregar, criar, editar, inativar } = useFazendas();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);
const dialog = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<FazendaFormModel>({
  nome: '',
  clienteId: '',
  municipio: '',
  uf: '',
  areaTotalHa: '',
});

const colunas: QTableColumn<FazendaDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'municipio', label: 'Município', field: 'municipio', align: 'left' },
  { name: 'uf', label: 'UF', field: 'uf', align: 'left' },
  { name: 'areaTotalHa', label: 'Área (ha)', field: 'areaTotalHa', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(item?: FazendaDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = {
    nome: item?.nome ?? '',
    clienteId: item?.clienteId ?? '',
    municipio: item?.municipio ?? '',
    uf: item?.uf ?? '',
    areaTotalHa: item?.areaTotalHa != null ? String(item.areaTotalHa) : '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

function abrirDialogVisualizar(item: FazendaDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

onMounted(() => {
  void carregar();
  void carregarClientes();
});
</script>

<style scoped>
.dialog {
  min-width: min(520px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes {
  white-space: nowrap;
}
</style>
