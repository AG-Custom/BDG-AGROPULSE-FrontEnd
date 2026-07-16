<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Representantes"
      subtitulo="Consultores e representantes com carteira comercial."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            clearable
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Carregar representantes"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && representantes.length === 0" :colunas="5" />

        <empty-state
          v-else-if="indisponivel && representantes.length === 0"
          titulo="Endpoint indisponível"
          descricao="O backend ainda não expõe /representantes. A listagem está tipada e pronta."
          icon="handshake"
        />

        <empty-state
          v-else-if="!carregando && representantes.length === 0"
          titulo="Sem representantes"
          descricao="Nenhum representante cadastrado."
          icon="handshake"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="representantes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                :variant="props.row.ativo ? 'success' : 'default'"
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
import { useRepresentantes } from 'composables/useMetasVendedor';
import type { QTableColumn } from 'quasar';
import type { RepresentanteDto } from 'types/dtos/comercial-extras.dto';
import { onMounted, ref } from 'vue';

const { representantes, carregando, indisponivel, carregar } = useRepresentantes();
const busca = ref('');

const colunas: QTableColumn<RepresentanteDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
];

async function recarregar(): Promise<void> {
  await carregar({
    busca: busca.value.trim() || undefined,
    ativo: true,
  });
}

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.filtro {
  min-width: 220px;
  flex: 1;
}
</style>
