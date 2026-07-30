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
            <q-item-section avatar>
              <span
                class="notificacoes-page__icone"
                :class="`notificacoes-page__icone--${tomIconeDaNotificacao(item.tipo)}`"
                aria-hidden="true"
              >
                <q-icon :name="iconeDaNotificacao(item.tipo)" size="20px" />
              </span>
            </q-item-section>
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
              <notificacao-item-acoes
                :notificacao="item"
                @decidido="aoDecidirPedido(item)"
              />
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
import NotificacaoItemAcoes from 'components/notificacoes/NotificacaoItemAcoes.vue';
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
import { iconeDaNotificacao, tomIconeDaNotificacao } from 'utils/notificacao-icone';
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

async function aoDecidirPedido(item: NotificacaoDto): Promise<void> {
  if (!item.lida) {
    await marcarComoLida(item.id);
  }

  await recarregar();
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

.notificacoes-page__icone {
  align-items: center;
  border-radius: var(--radius-md);
  display: inline-flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.notificacoes-page__icone--neutral {
  background: var(--color-neutral-100);
  color: var(--color-text-secondary);
}

.notificacoes-page__icone--success {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.notificacoes-page__icone--warning {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.notificacoes-page__icone--error {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.notificacoes-page__icone--info {
  background: var(--color-info-50);
  color: var(--color-info-700);
}
</style>
