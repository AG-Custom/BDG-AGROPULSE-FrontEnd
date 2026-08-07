<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Transferência"
      subtitulo="Confirme para movimentar o estoque ou cancele enquanto estiver pendente."
    >
      <agro-btn
        v-if="transferencia?.status === TransferenciaEstoqueStatus.Pendente"
        flat
        label="Cancelar"
        descricao="Cancelar transferência"
        :loading="salvando"
        @click="cancelarTransferencia"
      />
      <agro-btn
        v-if="transferencia?.status === TransferenciaEstoqueStatus.Pendente"
        color="primary"
        unelevated
        label="Confirmar"
        descricao="Confirmar transferência"
        :loading="salvando"
        @click="confirmarTransferencia"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !transferencia" />

      <agro-card v-else-if="transferencia">
        <div class="transferencia-detalhe__resumo">
          <div>
            <div class="transferencia-detalhe__label">Status</div>
            <agro-badge
              :label="rotuloStatus(transferencia.status)"
              :variant="varianteStatus(transferencia.status)"
            />
          </div>
          <div>
            <div class="transferencia-detalhe__label">Origem</div>
            <div>{{ rotuloUnidade(transferencia.unidadeOrigemId) }}</div>
          </div>
          <div>
            <div class="transferencia-detalhe__label">Destino</div>
            <div>{{ rotuloUnidade(transferencia.unidadeDestinoId) }}</div>
          </div>
        </div>

        <p v-if="transferencia.justificativa" class="transferencia-detalhe__justificativa">
          {{ transferencia.justificativa }}
        </p>

        <q-table
          flat
          bordered
          row-key="id"
          :rows="transferencia.itens"
          :columns="colunas"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoId="props">
            <q-td :props="props">
              {{ rotuloProduto(props.row.produtoId) }}
            </q-td>
          </template>

          <template #body-cell-quantidade="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</span>
            </q-td>
          </template>

          <template #body-cell-custoUnitario="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.custoUnitario) }}</span>
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
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useEstoqueTransferencias } from 'composables/useEstoqueTransferencias';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { useUnidades } from 'composables/useUnidades';
import {
  TransferenciaEstoqueStatus,
  TransferenciaEstoqueStatusOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { TransferenciaEstoqueItemDto } from 'types/dtos/estoque.dto';
import { formatarDecimal } from 'utils/formatters';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { transferencia, carregando, salvando, obter, confirmar, cancelar } =
  useEstoqueTransferencias();
const { unidades, carregar: carregarUnidades } = useUnidades();
const { rotuloProduto } = useProdutoOpcoesEstoque();

const colunas: QTableColumn<TransferenciaEstoqueItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left' },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right' },
  { name: 'custoUnitario', label: 'Custo', field: 'custoUnitario', align: 'right' },
];

function rotuloUnidade(unidadeId: string): string {
  return unidades.value.find((item) => item.id === unidadeId)?.nome ?? unidadeId;
}

function rotuloStatus(status: string): string {
  return TransferenciaEstoqueStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

function varianteStatus(status: string): 'accent' | 'success' | 'default' {
  if (status === TransferenciaEstoqueStatus.Pendente) {
    return 'accent';
  }

  if (status === TransferenciaEstoqueStatus.Concluida) {
    return 'success';
  }

  return 'default';
}

async function confirmarTransferencia(): Promise<void> {
  const id = String(route.params.id);
  await confirmar(id, { emitirNotaFiscal: false });
}

async function cancelarTransferencia(): Promise<void> {
  await cancelar(String(route.params.id));
}

onMounted(() => {
  void carregarUnidades({ ativo: true });
  void obter(String(route.params.id));
});
</script>

<style scoped>
.transferencia-detalhe__resumo {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: var(--spacing-6);
}

.transferencia-detalhe__label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-1);
}

.transferencia-detalhe__justificativa {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-4);
}

@media (max-width: 900px) {
  .transferencia-detalhe__resumo {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
