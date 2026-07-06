<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Empresa"
      subtitulo="Dados cadastrais e CNPJs vinculados à sua conta."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo CNPJ"
        descricao="Cadastrar um novo CNPJ na empresa"
        :to="{ name: 'cnpj-novo' }"
      />
    </app-page-header>

    <section class="agro-section empresa-cnpjs">
      <q-inner-loading :showing="carregando" color="primary" />

      <empty-state
        v-if="!carregando && cnpjs.length === 0"
        titulo="Nenhum CNPJ cadastrado"
        descricao="Cadastre o CNPJ da sua empresa para vincular às unidades operacionais."
        icon="business"
      >
        <agro-btn
          color="primary"
          unelevated
          label="Cadastrar CNPJ"
          descricao="Ir para o cadastro de CNPJ"
          :to="{ name: 'cnpj-novo' }"
        />
      </empty-state>

      <template v-else-if="cnpjPrincipal">
        <agro-card class="empresa-cnpjs__principal">
          <template #header>
            <div class="empresa-cnpjs__principal-header">
              <div>
                <span class="empresa-cnpjs__principal-eyebrow">CNPJ principal</span>
                <h2 class="empresa-cnpjs__principal-nome">
                  {{ cnpjPrincipal.razaoSocial }}
                </h2>
              </div>
              <agro-badge label="Principal" variant="accent" />
            </div>
          </template>

          <dl class="empresa-cnpjs__dados">
            <div class="empresa-cnpjs__campo empresa-cnpjs__campo--destaque">
              <dt>CNPJ</dt>
              <dd>{{ formatarCnpj(cnpjPrincipal.numero) }}</dd>
            </div>
            <div class="empresa-cnpjs__campo">
              <dt>Nome fantasia</dt>
              <dd>{{ cnpjPrincipal.nomeFantasia }}</dd>
            </div>
            <div class="empresa-cnpjs__campo">
              <dt>Status</dt>
              <dd>
                <agro-badge
                  :label="cnpjPrincipal.ativo ? 'Ativo' : 'Inativo'"
                  :variant="cnpjPrincipal.ativo ? 'success' : 'default'"
                />
              </dd>
            </div>
          </dl>
        </agro-card>

        <agro-card v-if="outrosCnpjs.length > 0" class="empresa-cnpjs__outros">
          <template #header>
            <div class="empresa-cnpjs__outros-header">
              <h3 class="empresa-cnpjs__outros-titulo">Outros CNPJs</h3>
              <span class="text-caption text-secondary">
                {{ outrosCnpjs.length }} cadastrado{{ outrosCnpjs.length === 1 ? '' : 's' }}
              </span>
            </div>
          </template>

          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="outrosCnpjs"
            :columns="colunas"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-numero="props">
              <q-td :props="props">
                {{ formatarCnpj(props.row.numero) }}
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
          </q-table>
        </agro-card>
      </template>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCnpjs } from 'composables/useCnpjs';
import type { CnpjEmpresaDto } from 'types/dtos/cnpj.dto';
import { formatarCnpj } from 'utils/formatters';
import type { QTableColumn } from 'quasar';
import { computed, onMounted } from 'vue';

const { cnpjs, carregando, carregar } = useCnpjs();

const cnpjPrincipal = computed(
  () => cnpjs.value.find((cnpj) => cnpj.principal) ?? cnpjs.value[0] ?? null,
);

const outrosCnpjs = computed(() =>
  cnpjs.value.filter((cnpj) => cnpj.id !== cnpjPrincipal.value?.id),
);

const colunas: QTableColumn<CnpjEmpresaDto>[] = [
  { name: 'numero', label: 'CNPJ', field: 'numero', align: 'left', sortable: true },
  { name: 'razaoSocial', label: 'Razão social', field: 'razaoSocial', align: 'left', sortable: true },
  { name: 'nomeFantasia', label: 'Nome fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
];

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.empresa-cnpjs {
  display: grid;
  gap: var(--spacing-6);
  position: relative;
}

.empresa-cnpjs__principal {
  border-top: 3px solid var(--color-primary-500);
}

.empresa-cnpjs__principal-header {
  align-items: flex-start;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.empresa-cnpjs__principal-eyebrow {
  color: var(--color-text-secondary);
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-1);
}

.empresa-cnpjs__principal-nome {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  margin: 0;
}

.empresa-cnpjs__dados {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 0;
}

.empresa-cnpjs__campo {
  display: grid;
  gap: var(--spacing-1);
}

.empresa-cnpjs__campo dt {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.empresa-cnpjs__campo dd {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.empresa-cnpjs__campo--destaque dd {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.04em;
}

.empresa-cnpjs__outros-header {
  align-items: baseline;
  display: flex;
  gap: var(--spacing-3);
  justify-content: space-between;
}

.empresa-cnpjs__outros-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
