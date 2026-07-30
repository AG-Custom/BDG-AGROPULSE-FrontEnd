<template>
  <div
    v-if="podeDecidir"
    class="notificacao-item-acoes"
    @click.stop
  >
    <agro-btn
      color="primary"
      unelevated
      dense
      label="Aprovar"
      descricao="Aprovar pedido pelo alerta"
      :loading="salvando"
      :disable="salvando"
      @click="aprovarPedido"
    />
    <agro-btn
      flat
      dense
      color="negative"
      label="Recusar"
      descricao="Recusar pedido pelo alerta"
      :disable="salvando"
      @click="abrirRecusa"
    />

    <pedido-venda-recusar-dialog
      v-model="dialogRecusa"
      :loading="salvando"
      @confirmar="confirmarRecusa"
    />
  </div>
</template>

<script setup lang="ts">
import PedidoVendaRecusarDialog from 'components/pedidos-venda/PedidoVendaRecusarDialog.vue';
import { useAprovacoes } from 'composables/useAprovacoes';
import { useAuth } from 'composables/useAuth';
import { NotificacaoTipo } from 'constants/enums';
import { Permissoes } from 'constants/permissoes';
import type { NotificacaoDto } from 'types/dtos/notificacao.dto';
import { computed, ref } from 'vue';

const props = defineProps<{
  notificacao: NotificacaoDto;
}>();

const emit = defineEmits<{
  decidido: [];
}>();

const { possuiPermissao } = useAuth();
const { salvando, aprovar, solicitarRecusa } = useAprovacoes();

const dialogRecusa = ref(false);

const podeDecidir = computed(() => {
  const tipo = props.notificacao.tipo;
  const ehDecisao =
    tipo === NotificacaoTipo.PedidoAguardandoAprovacao ||
    tipo === NotificacaoTipo.PedidoRetido;

  if (!ehDecisao || !props.notificacao.idReferencia) {
    return false;
  }

  return possuiPermissao(Permissoes.Aprovacoes.Aprovar);
});

async function aprovarPedido(): Promise<void> {
  const ok = await aprovar(props.notificacao.idReferencia);
  if (ok) {
    emit('decidido');
  }
}

function abrirRecusa(): void {
  dialogRecusa.value = true;
}

async function confirmarRecusa(motivo: string): Promise<void> {
  const ok = await solicitarRecusa(props.notificacao.idReferencia, motivo);
  if (ok) {
    dialogRecusa.value = false;
    emit('decidido');
  }
}
</script>

<style scoped>
.notificacao-item-acoes {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
}

.notificacao-item-acoes :deep(.q-btn) {
  font-size: var(--font-size-xs);
  min-height: 28px;
  padding: 0 var(--spacing-3);
}
</style>
