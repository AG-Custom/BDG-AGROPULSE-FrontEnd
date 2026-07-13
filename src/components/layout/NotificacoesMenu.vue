<template>
  <agro-btn
    flat
    round
    dense
    icon="notifications"
    descricao="Notificações"
    class="notificacoes-menu"
  >
    <q-badge
      v-if="quantidadeNaoLidas > 0"
      floating
      color="negative"
      rounded
    >
      {{ quantidadeNaoLidas > 9 ? '9+' : quantidadeNaoLidas }}
    </q-badge>

    <q-menu
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      @show="aoAbrir"
    >
      <q-list class="notificacoes-menu__lista" bordered>
        <q-item-label header>Notificações</q-item-label>

        <q-item v-if="carregando">
          <q-item-section>
            <q-item-label caption>Carregando...</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-else-if="notificacoes.length === 0">
          <q-item-section>
            <q-item-label caption>Nenhuma notificação.</q-item-label>
          </q-item-section>
        </q-item>

        <template v-else>
          <q-item
            v-for="item in notificacoes"
            :key="item.id"
            clickable
            v-close-popup
            :class="{ 'notificacoes-menu__item--lida': item.lida }"
            @click="abrirNotificacao(item)"
          >
            <q-item-section>
              <q-item-label>
                {{ item.titulo }}
                <agro-badge
                  class="notificacoes-menu__prioridade"
                  :label="rotuloPrioridade(item.prioridade)"
                  :variant="variantePrioridade(item.prioridade)"
                />
              </q-item-label>
              <q-item-label caption lines="2">{{ item.mensagem }}</q-item-label>
              <q-item-label caption>{{ formatarDataHora(item.createdAt) }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </agro-btn>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import { useNotificacoes } from 'composables/useNotificacoes';
import {
  NotificacaoPrioridade,
  NotificacaoPrioridadeOpcoes,
  type NotificacaoPrioridadeValor,
} from 'constants/enums';
import type { NotificacaoDto } from 'types/dtos/notificacao.dto';
import { formatarDataHora } from 'utils/formatters';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
  notificacoes,
  quantidadeNaoLidas,
  carregando,
  carregar,
  marcarComoLida,
} = useNotificacoes();

function rotuloPrioridade(prioridade: NotificacaoPrioridadeValor): string {
  return (
    NotificacaoPrioridadeOpcoes.find((item) => item.value === prioridade)?.label ??
    prioridade
  );
}

function variantePrioridade(
  prioridade: NotificacaoPrioridadeValor,
): 'default' | 'warning' | 'error' {
  if (prioridade === NotificacaoPrioridade.Alta) {
    return 'error';
  }

  if (prioridade === NotificacaoPrioridade.Media) {
    return 'warning';
  }

  return 'default';
}

async function aoAbrir(): Promise<void> {
  await carregar();
}

async function abrirNotificacao(item: NotificacaoDto): Promise<void> {
  if (!item.lida) {
    await marcarComoLida(item.id);
  }

  if (item.idReferencia && item.modeloReferencia.toLowerCase().includes('pedido')) {
    await router.push({
      name: 'pedido-venda-detalhe',
      params: { id: item.idReferencia },
    });
  }
}

onMounted(() => {
  void carregar({ apenasNaoLidas: true });
});
</script>

<style scoped>
.notificacoes-menu__lista {
  max-height: 360px;
  max-width: min(360px, 90vw);
  overflow-y: auto;
  width: 360px;
}

.notificacoes-menu__item--lida {
  opacity: 0.7;
}

.notificacoes-menu__prioridade {
  margin-left: var(--spacing-2);
  vertical-align: middle;
}
</style>
