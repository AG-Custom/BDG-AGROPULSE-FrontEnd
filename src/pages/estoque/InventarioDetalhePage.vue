<template>
  <q-page class="agro-page">
    <app-page-header
      :titulo="tituloPagina"
      :subtitulo="subtituloPagina"
    >
      <agro-btn
        v-if="inventarioAberto"
        color="primary"
        unelevated
        label="Concluir inventário"
        descricao="Concluir inventário e gerar ajustes"
        :loading="salvando"
        @click="concluir"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregando && !inventario" :campos="6" />

        <template v-else-if="inventario">
          <div class="estoque-inventario-detalhe__meta">
            <agro-badge
              :label="rotuloStatus(inventario.status)"
              :variant="inventario.status === InventarioStatus.Aberto ? 'accent' : 'success'"
            />
            <span>Iniciado em {{ formatarDataHora(inventario.iniciadoEm) }}</span>
            <span v-if="inventario.concluidoEm">
              · Concluído em {{ formatarDataHora(inventario.concluidoEm) }}
            </span>
          </div>

          <empty-state
            v-if="inventario.itens.length === 0"
            titulo="Nenhum item no inventário"
            descricao="Não há produtos com saldo para contagem neste inventário."
            icon="fact_check"
          />

          <q-table
            v-else
            flat
            bordered
            row-key="id"
            class="estoque-inventario-detalhe__tabela"
            :rows="inventario.itens"
            :columns="colunas"
            :pagination="{ rowsPerPage: 0 }"
            hide-pagination
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">
                {{ rotuloProduto(props.row.produtoId) }}
              </q-td>
            </template>

            <template #body-cell-quantidadeSistema="props">
              <q-td :props="props">
                <span class="text-metric">{{ formatarDecimal(props.row.quantidadeSistema) }}</span>
              </q-td>
            </template>

            <template #body-cell-quantidadeContada="props">
              <q-td :props="props">
                <span v-if="props.row.quantidadeContada !== null" class="text-metric">
                  {{ formatarDecimal(props.row.quantidadeContada) }}
                </span>
                <span v-else class="text-secondary">—</span>
              </q-td>
            </template>

            <template #body-cell-diferenca="props">
              <q-td :props="props">
                <span v-if="props.row.diferenca !== null" class="text-metric">
                  {{ formatarDecimal(props.row.diferenca) }}
                </span>
                <span v-else class="text-secondary">—</span>
              </q-td>
            </template>

            <template #body-cell-ajustado="props">
              <q-td :props="props">
                <agro-badge
                  :label="props.row.ajustado ? 'Ajustado' : 'Pendente'"
                  :variant="props.row.ajustado ? 'success' : 'default'"
                />
              </q-td>
            </template>

            <template v-if="inventarioAberto" #body-cell-acoes="props">
              <q-td :props="props" class="estoque-inventario-detalhe__acoes">
                <agro-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="primary"
                  descricao="Registrar contagem"
                  @click="abrirContagem(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </template>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="estoque-inventario-detalhe__dialog">
        <q-card-section>
          <h4 class="estoque-inventario-detalhe__dialog-titulo">Registrar contagem</h4>
          <p v-if="itemEmEdicao" class="estoque-inventario-detalhe__dialog-produto">
            {{ rotuloProduto(itemEmEdicao.produtoId) }}
          </p>
        </q-card-section>

        <q-card-section>
          <q-form ref="formRef" greedy>
            <q-input
              v-model="formContagem.quantidadeContada"
              outlined
              label="Quantidade contada"
              class="field-required"
              type="number"
              min="0"
              step="0.01"
              aria-required="true"
              :rules="[quantidadeNaoNegativaValidator]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem salvar a contagem"
            :disable="salvando"
            @click="fecharContagem"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Salvar"
            descricao="Salvar contagem do item"
            :loading="salvando"
            @click="salvarContagem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useEstoqueInventarios } from 'composables/useEstoqueInventarios';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { InventarioStatus, InventarioStatusOpcoes, type InventarioStatusValor } from 'constants/enums';
import type { QForm, QTableColumn } from 'quasar';
import type { ContagemInventarioFormModel, InventarioItemDto } from 'types/dtos/estoque.dto';
import { formatarDataHora, formatarDecimal } from 'utils/formatters';
import { criarContagemFormVazia } from 'utils/mappers/estoque.mapper';
import { quantidadeNaoNegativa } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  inventario,
  carregando,
  salvando,
  obter,
  registrarContagem,
  solicitarConclusao,
} = useEstoqueInventarios();
const { rotuloProduto } = useProdutoOpcoesEstoque();

const dialogAberto = ref(false);
const itemEmEdicao = ref<InventarioItemDto | null>(null);
const formContagem = ref<ContagemInventarioFormModel>(criarContagemFormVazia());
const formRef = ref<QForm | null>(null);
const quantidadeNaoNegativaValidator = quantidadeNaoNegativa;

const inventarioId = computed(() => route.params.id as string);

const inventarioAberto = computed(
  () => inventario.value?.status === InventarioStatus.Aberto,
);

const tituloPagina = computed(() =>
  inventarioAberto.value ? 'Inventário em andamento' : 'Inventário',
);

const subtituloPagina = computed(() =>
  inventarioAberto.value
    ? 'Registre as contagens e conclua para gerar os ajustes.'
    : 'Consulta do inventário selecionado.',
);

const colunas = computed(() => {
  const base: QTableColumn<InventarioItemDto>[] = [
    { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
    {
      name: 'quantidadeSistema',
      label: 'Sistema',
      field: 'quantidadeSistema',
      align: 'right',
      sortable: true,
    },
    {
      name: 'quantidadeContada',
      label: 'Contada',
      field: 'quantidadeContada',
      align: 'right',
      sortable: true,
    },
    { name: 'diferenca', label: 'Diferença', field: 'diferenca', align: 'right', sortable: true },
    { name: 'ajustado', label: 'Ajuste', field: 'ajustado', align: 'left', sortable: true },
    { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
  ];

  if (!inventarioAberto.value) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }

  return base;
});

function rotuloStatus(status: InventarioStatusValor): string {
  return InventarioStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

function abrirContagem(item: InventarioItemDto): void {
  itemEmEdicao.value = item;
  formContagem.value = criarContagemFormVazia(
    item.quantidadeContada !== null ? String(item.quantidadeContada) : '',
  );
  dialogAberto.value = true;
}

function fecharContagem(): void {
  dialogAberto.value = false;
  itemEmEdicao.value = null;
}

async function salvarContagem(): Promise<void> {
  const valido = (await formRef.value?.validate()) ?? false;

  if (!valido || !itemEmEdicao.value) {
    return;
  }

  const sucesso = await registrarContagem(
    inventarioId.value,
    itemEmEdicao.value.id,
    formContagem.value,
  );

  if (sucesso) {
    fecharContagem();
  }
}

async function concluir(): Promise<void> {
  await solicitarConclusao(inventarioId.value);
}

onMounted(async () => {
  const ok = await obter(inventarioId.value);

  if (!ok) {
    await router.replace({ name: 'estoque-inventarios' });
  }
});
</script>

<style scoped>
.estoque-inventario-detalhe__meta {
  align-items: center;
  color: var(--color-text-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.estoque-inventario-detalhe__acoes {
  white-space: nowrap;
}

.estoque-inventario-detalhe__dialog {
  min-width: min(420px, 90vw);
  width: 100%;
}

.estoque-inventario-detalhe__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.estoque-inventario-detalhe__dialog-produto {
  color: var(--color-text-secondary);
  margin: var(--spacing-2) 0 0;
}
</style>
