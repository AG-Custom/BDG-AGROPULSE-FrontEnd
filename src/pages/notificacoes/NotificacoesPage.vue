<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Notificações"
      subtitulo="Alertas e avisos do sistema filtrados pelo seu perfil de acesso."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-toggle
            v-model="apenasNaoLidas"
            label="Somente não lidas"
            color="primary"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Recarregar notificações"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && notificacoes.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && notificacoes.length === 0"
          titulo="Nenhuma notificação"
          descricao="Quando houver alertas para o seu perfil, eles aparecerão aqui."
          icon="notifications"
        />

        <q-list v-else bordered class="notificacoes-page__lista">
          <q-item
            v-for="item in notificacoes"
            :key="item.id"
            clickable
            :class="{ 'notificacoes-page__item--lida': item.lida }"
            @click="abrirNotificacao(item)"
          >
            <q-item-section>
              <q-item-label>
                {{ item.titulo }}
                <agro-badge
                  class="notificacoes-page__prioridade"
                  :label="rotuloPrioridade(item.prioridade)"
                  :variant="variantePrioridade(item.prioridade)"
                />
              </q-item-label>
              <q-item-label caption>{{ item.mensagem }}</q-item-label>
              <q-item-label caption>{{ formatarDataHora(item.createdAt) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <agro-btn
                v-if="!item.lida"
                flat
                dense
                label="Marcar lida"
                descricao="Marcar notificação como lida"
                :loading="marcando"
                @click.stop="marcarComoLida(item.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useNotificacoes } from 'composables/useNotificacoes';
import {
  NotificacaoPrioridade,
  NotificacaoPrioridadeOpcoes,
  type NotificacaoPrioridadeValor,
} from 'constants/enums';
import type { NotificacaoDto } from 'types/dtos/notificacao.dto';
import { formatarDataHora } from 'utils/formatters';
import { rotaDaNotificacao } from 'utils/notificacao-navegacao';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
  notificacoes,
  carregando,
  marcando,
  carregar,
  marcarComoLida,
} = useNotificacoes();

const apenasNaoLidas = ref(false);

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

async function recarregar(): Promise<void> {
  await carregar({ apenasNaoLidas: apenasNaoLidas.value || undefined });
}

async function abrirNotificacao(item: NotificacaoDto): Promise<void> {
  if (!item.lida) {
    await marcarComoLida(item.id);
  }

  const destino = rotaDaNotificacao(item);
  if (destino) {
    await router.push(destino);
  }
}

watch(apenasNaoLidas, () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.notificacoes-page__lista {
  border-radius: var(--radius-md);
}

.notificacoes-page__item--lida {
  opacity: 0.7;
}

.notificacoes-page__prioridade {
  margin-left: var(--spacing-2);
  vertical-align: middle;
}
</style>
