<template>
  <q-page class="agro-page">
    <app-page-header titulo="Unidades" subtitulo="Gerencie as unidades da sua empresa.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova unidade"
        descricao="Cadastrar uma nova unidade operacional"
        :to="{ name: 'unidade-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <q-table
          flat
          bordered
          row-key="id"
          class="unidades-table"
          :rows="unidades"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
          no-data-label="Nenhuma unidade cadastrada."
        >
          <template #body-cell-tipo="props">
            <q-td :props="props">
              {{ rotuloTipo(props.row.tipo) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.status"
                :variant="props.row.status === UnidadeStatus.Ativa ? 'success' : 'default'"
              />
            </q-td>
          </template>

          <template #body-cell-matriz="props">
            <q-td :props="props">
              <q-icon
                v-if="props.row.matriz"
                name="check_circle"
                color="primary"
                size="20px"
                aria-label="Unidade matriz"
              >
                <q-tooltip>Unidade matriz</q-tooltip>
              </q-icon>
              <span v-else class="text-secondary">—</span>
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="unidades-table__acoes">
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar unidade"
                :to="{ name: 'unidade-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.status === UnidadeStatus.Ativa"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar unidade"
                @click="abrirConfirmacao(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogInativar" persistent>
      <q-card class="unidades-dialog">
        <q-card-section>
          <div class="text-h6">Inativar unidade</div>
          <p class="text-body2 text-secondary q-mt-sm q-mb-none">
            Deseja inativar a unidade <strong>{{ unidadeSelecionada?.nome }}</strong>?
            Essa ação pode ser revertida editando o status da unidade.
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar sem inativar a unidade" @click="fecharConfirmacao" />
          <agro-btn
            color="negative"
            unelevated
            label="Inativar"
            descricao="Confirmar inativação da unidade"
            :loading="inativando"
            @click="confirmarInativacao"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { TipoUnidadeOpcoes, UnidadeStatus } from 'constants/enums';
import { useUnidades } from 'composables/useUnidades';
import type { UnidadeDto } from 'types/dtos/unidade.dto';
import type { QTableColumn } from 'quasar';
import { onMounted, ref } from 'vue';

const { unidades, carregando, inativando, carregar, inativar } = useUnidades();

const dialogInativar = ref(false);
const unidadeSelecionada = ref<UnidadeDto | null>(null);

const colunas: QTableColumn<UnidadeDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'matriz', label: 'Matriz', field: 'matriz', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloTipo(tipo: string): string {
  return TipoUnidadeOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

function abrirConfirmacao(unidade: UnidadeDto): void {
  unidadeSelecionada.value = unidade;
  dialogInativar.value = true;
}

function fecharConfirmacao(): void {
  dialogInativar.value = false;
  unidadeSelecionada.value = null;
}

async function confirmarInativacao(): Promise<void> {
  if (!unidadeSelecionada.value) {
    return;
  }

  const sucesso = await inativar(unidadeSelecionada.value.id);

  if (sucesso) {
    fecharConfirmacao();
  }
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.unidades-table__acoes {
  white-space: nowrap;
}

.unidades-dialog {
  min-width: 360px;
  width: min(100%, 420px);
}
</style>
