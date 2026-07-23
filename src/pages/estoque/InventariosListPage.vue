<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Inventários"
      subtitulo="Inicie inventários gerais ou cíclicos (por categoria/localização)."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="playlist_add_check"
        label="Iniciar inventário"
        descricao="Iniciar novo inventário de estoque"
        :loading="salvando"
        @click="dialogoAberto = true"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && inventarios.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && inventarios.length === 0"
          titulo="Nenhum inventário encontrado"
          descricao="Inicie um inventário para contar e ajustar o estoque da unidade."
          icon="fact_check"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Iniciar inventário"
            descricao="Iniciar novo inventário de estoque"
            :loading="salvando"
            @click="dialogoAberto = true"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="estoque-inventarios__tabela"
          :rows="inventarios"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="props.row.status === InventarioStatus.Aberto ? 'accent' : 'success'"
              />
            </q-td>
          </template>

          <template #body-cell-escopo="props">
            <q-td :props="props">
              {{ formatarEscopo(props.row) }}
            </q-td>
          </template>

          <template #body-cell-iniciadoEm="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.iniciadoEm) }}
            </q-td>
          </template>

          <template #body-cell-concluidoEm="props">
            <q-td :props="props">
              {{ props.row.concluidoEm ? formatarDataHora(props.row.concluidoEm) : '—' }}
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="estoque-inventarios__acoes">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{ name: 'estoque-inventario-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogoAberto" persistent>
      <q-card class="estoque-inventarios__dialogo">
        <q-card-section>
          <h3 class="estoque-inventarios__dialogo-titulo">Iniciar inventário</h3>
          <p class="estoque-inventarios__dialogo-texto">
            Deixe os filtros vazios para inventário geral. Preencha para inventário cíclico.
          </p>
        </q-card-section>

        <q-card-section class="estoque-inventarios__filtros">
          <q-select
            v-model="filtros.categoriaProdutoId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Categoria"
            :options="categoriaOpcoes"
            :loading="carregandoCategorias"
          />
          <q-input v-model="filtros.deposito" outlined dense label="Depósito" maxlength="50" />
          <q-input v-model="filtros.galpao" outlined dense label="Galpão" maxlength="50" />
          <q-input v-model="filtros.corredor" outlined dense label="Corredor" maxlength="50" />
          <q-input v-model="filtros.prateleira" outlined dense label="Prateleira" maxlength="50" />
        </q-card-section>

        <q-card-actions align="right" class="agro-form-actions">
          <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogoAberto = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Iniciar"
            descricao="Iniciar inventário"
            :loading="salvando"
            @click="iniciarNovo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useEstoqueInventarios } from 'composables/useEstoqueInventarios';
import { InventarioStatus, InventarioStatusOpcoes, type InventarioStatusValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { InventarioDto } from 'types/dtos/estoque.dto';
import { formatarDataHora } from 'utils/formatters';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { inventarios, carregando, salvando, carregar, iniciar } = useEstoqueInventarios();
const {
  categorias,
  carregando: carregandoCategorias,
  carregar: carregarCategorias,
} = useCategoriasProduto();

const dialogoAberto = ref(false);
const filtros = reactive({
  categoriaProdutoId: null as string | null,
  deposito: '',
  galpao: '',
  corredor: '',
  prateleira: '',
});

const categoriaOpcoes = computed(() =>
  categorias.value.map((categoria) => ({
    label: categoria.nome,
    value: categoria.id,
  })),
);

const colunas: QTableColumn<InventarioDto>[] = [
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'escopo', label: 'Escopo', field: 'id', align: 'left' },
  { name: 'iniciadoEm', label: 'Iniciado em', field: 'iniciadoEm', align: 'left', sortable: true },
  {
    name: 'concluidoEm',
    label: 'Concluído em',
    field: 'concluidoEm',
    align: 'left',
    sortable: true,
  },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: InventarioStatusValor): string {
  return InventarioStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

function formatarEscopo(inventario: InventarioDto): string {
  const partes: string[] = [];

  if (inventario.categoriaProdutoId) {
    const categoria = categorias.value.find((item) => item.id === inventario.categoriaProdutoId);
    partes.push(categoria?.nome ?? 'Categoria');
  }

  for (const parte of [
    inventario.galpao,
    inventario.deposito,
    inventario.corredor,
    inventario.prateleira,
  ]) {
    if (parte?.trim()) {
      partes.push(parte.trim());
    }
  }

  return partes.length > 0 ? partes.join(' · ') : 'Geral';
}

async function iniciarNovo(): Promise<void> {
  const criado = await iniciar({
    categoriaProdutoId: filtros.categoriaProdutoId,
    deposito: filtros.deposito.trim() || null,
    galpao: filtros.galpao.trim() || null,
    corredor: filtros.corredor.trim() || null,
    prateleira: filtros.prateleira.trim() || null,
  });

  if (criado) {
    dialogoAberto.value = false;
    await router.push({ name: 'estoque-inventario-detalhe', params: { id: criado.id } });
  }
}

onMounted(() => {
  void carregar();
  void carregarCategorias({ ativo: true });
});
</script>

<style scoped>
.estoque-inventarios__acoes {
  white-space: nowrap;
}

.estoque-inventarios__dialogo {
  background: var(--color-surface-default);
  max-width: 520px;
  width: 100%;
}

.estoque-inventarios__dialogo-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-2);
}

.estoque-inventarios__dialogo-texto {
  color: var(--color-text-secondary);
  margin: 0;
}

.estoque-inventarios__filtros {
  display: grid;
  gap: var(--spacing-4);
}
</style>
