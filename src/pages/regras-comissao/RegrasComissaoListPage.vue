<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Regras de comissão"
      subtitulo="Percentual por canal de venda."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova regra"
        descricao="Cadastrar regra de comissão"
        @click="irParaNovo"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroAtivo"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            class="filtro"
            :options="statusOpcoes"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Recarregar regras de comissão"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && regras.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && regras.length === 0"
          titulo="Nenhuma regra cadastrada"
          descricao="Cadastre regras por canal para aplicar comissão no pedido."
          icon="percent"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="regras"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-canal="props">
            <q-td :props="props">
              {{ rotuloCanal(props.row.canal) }}
            </q-td>
          </template>

          <template #body-cell-percentual="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.percentual) }}%
            </q-td>
          </template>

          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativa' : 'Inativa'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :mostrar-status="false"
                mostrar-excluir
                :visualizar-to="{ name: 'regra-comissao-visualizar', params: { id: props.row.id } }"
                @editar="irParaEditar(props.row.id)"
                @excluir="confirmarExclusao(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRegrasComissao } from 'composables/useRegrasComissao';
import { CanalVendaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RegraComissaoDto } from 'types/dtos/regra-comissao.dto';
import { formatarDecimal } from 'utils/formatters';
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';



const router = useRouter();
const { regras, carregando, carregar, excluir } = useRegrasComissao();
const filtroAtivo = ref<boolean | null>(true);

const statusOpcoes = [
  { label: 'Ativas', value: true },
  { label: 'Inativas', value: false },
];

const colunas: QTableColumn<RegraComissaoDto>[] = [
  { name: 'canal', label: 'Canal', field: 'canal', align: 'left' },
  { name: 'percentual', label: 'Comissão %', field: 'percentual', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCanal(canal: string | null): string {
  if (!canal) {
    return 'Todos';
  }

  return CanalVendaOpcoes.find((opcao) => opcao.value === canal)?.label ?? canal;
}

async function recarregar(): Promise<void> {
  await carregar({
    ativo: filtroAtivo.value === null ? undefined : filtroAtivo.value,
  });
}

function irParaNovo(): void {
  void router.push({ name: 'regra-comissao-nova' });
}

function irParaEditar(id: string): void {
  void router.push({ name: 'regra-comissao-editar', params: { id } });
}

async function confirmarExclusao(id: string): Promise<void> {
  if (await excluir(id)) {
    await recarregar();
  }
}

watch(filtroAtivo, () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});

</script>

<style scoped>
.filtro {
  min-width: 180px;
}

.acoes {
  white-space: nowrap;
}
</style>
