<template>
  <agro-card>
    <div class="pedido-venda-resumo__meta">
      <agro-badge
        :label="rotuloPedidoVendaStatus(pedido.status)"
        :variant="variantePedidoVendaStatus(pedido.status)"
      />
      <span>Criado em {{ formatarDataHora(pedido.createdAt) }}</span>
      <span v-if="pedido.dataExpiracao">
        · Expira em {{ formatarData(pedido.dataExpiracao) }}
      </span>
      <span v-if="pedido.aprovadoEm">
        · Aprovado em {{ formatarDataHora(pedido.aprovadoEm) }}
      </span>
      <span v-if="pedido.recusadoEm">
        · Recusado em {{ formatarDataHora(pedido.recusadoEm) }}
      </span>
      <span v-if="pedido.expiradoEm">
        · Expirado em {{ formatarDataHora(pedido.expiradoEm) }}
      </span>
      <span v-if="pedido.faturadoEm">
        · Faturado em {{ formatarDataHora(pedido.faturadoEm) }}
      </span>
    </div>

    <div class="pedido-venda-resumo__grid">
      <div>
        <div class="pedido-venda-resumo__label">Cliente</div>
        <div>{{ rotuloCliente }}</div>
      </div>
      <div>
        <div class="pedido-venda-resumo__label">Vendedor</div>
        <div>{{ rotuloVendedor }}</div>
      </div>
      <div>
        <div class="pedido-venda-resumo__label">Condição de pagamento</div>
        <div>
          {{ rotuloCondicao }}
          <span class="pedido-venda-resumo__hint">
            ({{ pedido.numeroParcelas }}x / {{ pedido.intervaloDias }} dias)
          </span>
        </div>
      </div>
      <div>
        <div class="pedido-venda-resumo__label">Forma de pagamento</div>
        <div>{{ rotuloFormaPagamento(pedido.formaPagamento) }}</div>
      </div>
      <div>
        <div class="pedido-venda-resumo__label">Valor total</div>
        <div class="text-metric">{{ formatarMoeda(pedido.valorTotal) }}</div>
      </div>
      <div>
        <div class="pedido-venda-resumo__label">Estoque reservado</div>
        <div>{{ pedido.estoqueBaixado ? 'Sim' : 'Não' }}</div>
      </div>
    </div>

    <div v-if="pedido.observacao" class="pedido-venda-resumo__observacao">
      <div class="pedido-venda-resumo__label">Observação</div>
      <div>{{ pedido.observacao }}</div>
    </div>

    <q-banner
      v-if="pedido.motivoRecusa"
      rounded
      class="pedido-venda-resumo__motivo"
    >
      Motivo da recusa: {{ pedido.motivoRecusa }}
    </q-banner>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import type { PedidoVendaDto } from 'types/dtos/pedido-venda.dto';
import { formatarData, formatarDataHora, formatarMoeda } from 'utils/formatters';
import {
  rotuloFormaPagamento,
  rotuloPedidoVendaStatus,
  variantePedidoVendaStatus,
} from 'utils/pedido-venda.helpers';

defineProps<{
  pedido: PedidoVendaDto;
  rotuloCliente: string;
  rotuloVendedor: string;
  rotuloCondicao: string;
}>();
</script>

<style scoped>
.pedido-venda-resumo__meta {
  align-items: center;
  color: var(--color-text-secondary);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.pedido-venda-resumo__grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.pedido-venda-resumo__label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-1);
}

.pedido-venda-resumo__hint {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.pedido-venda-resumo__observacao {
  margin-top: var(--spacing-4);
}

.pedido-venda-resumo__motivo {
  background: var(--color-error-50);
  color: var(--color-error-700);
  margin-top: var(--spacing-4);
}
</style>
