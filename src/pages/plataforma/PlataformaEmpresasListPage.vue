<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Console da plataforma"
      subtitulo="Empresas contratadas. Acesse qualquer operação ou cadastre um novo contrato."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova empresa"
        descricao="Cadastrar nova empresa na plataforma"
        :to="{ name: 'plataforma-empresa-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && empresas.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && empresas.length === 0"
          titulo="Nenhuma empresa cadastrada"
          descricao="Cadastre a primeira empresa do contrato para liberar o acesso ao sistema."
          icon="business"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova empresa"
            descricao="Ir para o cadastro de empresa"
            :to="{ name: 'plataforma-empresa-nova' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="empresas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-cnpj="props">
            <q-td :props="props" class="text-metric">
              {{ formatarCnpj(props.row.cnpj) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.status"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-qtdUnidades="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.qtdUnidades }}
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                color="primary"
                unelevated
                dense
                label="Acessar"
                descricao="Entrar na empresa selecionada"
                :loading="acessandoId === props.row.id"
                @click="acessar(props.row.id)"
              />
            </q-td>
          </template>

          <template #no-data>
            <empty-state
              titulo="Nenhuma empresa cadastrada"
              descricao="Cadastre a primeira empresa do contrato."
              icon="business"
            />
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AppPageHeader from 'components/shared/AppPageHeader.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import { usePlataforma } from 'composables/usePlataforma';
import type { EmpresaStatusPlataforma } from 'types/dtos/plataforma.dto';
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';

const { empresas, carregando, acessandoId, carregar, acessar } = usePlataforma();

const colunas: QTableColumn[] = [
  { name: 'nomeFantasia', label: 'Nome fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'razaoSocial', label: 'Razão social', field: 'razaoSocial', align: 'left', sortable: true },
  { name: 'cnpj', label: 'CNPJ', field: 'cnpj', align: 'left' },
  { name: 'tipoOperacao', label: 'Operação', field: 'tipoOperacao', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'qtdUnidades', label: 'Unidades', field: 'qtdUnidades', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function formatarCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) {
    return cnpj;
  }

  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function variantStatus(status: EmpresaStatusPlataforma): 'success' | 'warning' | 'default' {
  if (status === 'Ativo') {
    return 'success';
  }

  if (status === 'Suspenso') {
    return 'warning';
  }

  return 'default';
}

onMounted(() => {
  void carregar();
});
</script>
