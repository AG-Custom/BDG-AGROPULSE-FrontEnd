<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Auditoria"
      subtitulo="Histórico imutável de ações de negócio da empresa."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="filtroModelo"
            outlined
            dense
            label="Modelo"
            hint="Ex.: PedidoVenda"
            clearable
            class="auditoria-list__modelo"
          />
          <q-input
            v-model="filtroRegistroId"
            outlined
            dense
            label="ID do registro"
            clearable
            class="auditoria-list__registro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros de auditoria"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && logs.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && logs.length === 0"
          titulo="Nenhum registro de auditoria"
          descricao="Quando houver ações registradas, elas aparecerão aqui."
          icon="history"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="auditoria-list__tabela"
          :rows="logs"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.createdAt) }}
            </q-td>
          </template>

          <template #body-cell-usuarioId="props">
            <q-td :props="props">
              {{ rotuloUsuario(props.row.usuarioId) }}
            </q-td>
          </template>

          <template #body-cell-descricao="props">
            <q-td :props="props">
              {{ props.row.descricao || '—' }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAuditoria } from 'composables/useAuditoria';
import { useUsuarios } from 'composables/useUsuarios';
import type { LogAuditoriaDto } from 'types/dtos/auditoria.dto';
import { formatarDataHora } from 'utils/formatters';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const { logs, carregando, carregar } = useAuditoria();
const { usuarios, carregar: carregarUsuarios, nomeCompleto } = useUsuarios();

const filtroModelo = ref('');
const filtroRegistroId = ref('');

const colunas: QTableColumn<LogAuditoriaDto>[] = [
  { name: 'createdAt', label: 'Data', field: 'createdAt', align: 'left', sortable: true },
  { name: 'acao', label: 'Ação', field: 'acao', align: 'left', sortable: true },
  { name: 'modeloAfetado', label: 'Modelo', field: 'modeloAfetado', align: 'left', sortable: true },
  { name: 'registroId', label: 'Registro', field: 'registroId', align: 'left' },
  { name: 'usuarioId', label: 'Usuário', field: 'usuarioId', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
];

const mapaUsuarios = computed(() => {
  const mapa = new Map<string, string>();
  for (const usuario of usuarios.value) {
    mapa.set(usuario.id, nomeCompleto(usuario));
  }
  return mapa;
});

function rotuloUsuario(usuarioId: string | null): string {
  if (!usuarioId) {
    return 'Sistema';
  }

  return mapaUsuarios.value.get(usuarioId) ?? usuarioId;
}

async function recarregar(): Promise<void> {
  await carregar({
    modelo: filtroModelo.value.trim() || undefined,
    registroId: filtroRegistroId.value.trim() || undefined,
  });
}

onMounted(() => {
  void carregarUsuarios();
  void recarregar();
});
</script>

<style scoped>
.auditoria-list__modelo,
.auditoria-list__registro {
  min-width: 200px;
}

.auditoria-list__tabela {
  width: 100%;
}
</style>
