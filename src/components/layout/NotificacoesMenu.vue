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
      ref="menuRef"
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      class="notificacoes-menu__popup"
      @show="aoAbrir"
    >
      <div class="notificacoes-menu__painel">
        <header class="notificacoes-menu__header">
          <span class="notificacoes-menu__titulo">Notificações</span>
          <router-link
            :to="{ name: 'notificacoes' }"
            class="notificacoes-menu__ver-todas"
            @click.stop
          >
            Ver todas
          </router-link>
        </header>

        <div class="notificacoes-menu__corpo">
          <p v-if="carregando" class="notificacoes-menu__estado">Carregando...</p>
          <p v-else-if="notificacoes.length === 0" class="notificacoes-menu__estado">
            Nenhuma notificação.
          </p>

          <ul v-else class="notificacoes-menu__lista" role="list">
            <li
              v-for="item in notificacoes"
              :key="item.id"
              class="notificacoes-menu__item"
              :class="{
                'notificacoes-menu__item--lida': item.lida,
                'notificacoes-menu__item--nao-lida': !item.lida,
              }"
            >
              <button
                type="button"
                class="notificacoes-menu__botao"
                @click="abrirNotificacao(item)"
              >
                <span
                  class="notificacoes-menu__icone"
                  :class="`notificacoes-menu__icone--${tomIconeDaNotificacao(item.tipo)}`"
                  aria-hidden="true"
                >
                  <q-icon :name="iconeDaNotificacao(item.tipo)" size="18px" />
                </span>

                <span class="notificacoes-menu__conteudo">
                  <span class="notificacoes-menu__topo">
                    <span class="notificacoes-menu__item-titulo">{{ item.titulo }}</span>
                    <agro-badge
                      class="notificacoes-menu__prioridade"
                      :label="rotuloPrioridade(item.prioridade)"
                      :variant="variantePrioridade(item.prioridade)"
                    />
                  </span>
                  <span class="notificacoes-menu__mensagem">{{ item.mensagem }}</span>
                  <span class="notificacoes-menu__meta">{{ formatarDataHora(item.createdAt) }}</span>
                </span>
              </button>

              <notificacao-item-acoes
                class="notificacoes-menu__acoes"
                :notificacao="item"
                @decidido="aoDecidirPedido(item)"
              />
            </li>
          </ul>
        </div>
      </div>
    </q-menu>
  </agro-btn>
</template>

<script setup lang="ts">
import NotificacaoItemAcoes from 'components/notificacoes/NotificacaoItemAcoes.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
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
import type { QMenu } from 'quasar';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuRef = ref<QMenu | null>(null);
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
  menuRef.value?.hide();

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

  await carregar();
}

onMounted(() => {
  void carregar({ apenasNaoLidas: true });
});
</script>

<style scoped>
.notificacoes-menu__painel {
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  max-height: min(420px, 70vh);
  overflow: hidden;
  width: min(340px, 92vw);
}

.notificacoes-menu__header {
  align-items: center;
  background: var(--color-surface-default);
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
}

.notificacoes-menu__titulo {
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.notificacoes-menu__ver-todas {
  color: var(--color-primary-500);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-decoration: none;
}

.notificacoes-menu__ver-todas:hover {
  text-decoration: underline;
}

.notificacoes-menu__corpo {
  overflow-y: auto;
}

.notificacoes-menu__estado {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  margin: 0;
  padding: var(--spacing-6) var(--spacing-4);
  text-align: center;
}

.notificacoes-menu__lista {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notificacoes-menu__item {
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  padding: var(--spacing-3) var(--spacing-4);
}

.notificacoes-menu__item:last-child {
  border-bottom: none;
}

.notificacoes-menu__item--nao-lida {
  background: var(--color-primary-50);
  border-left: var(--border-width-accent) solid var(--color-primary-500);
  padding-left: calc(var(--spacing-4) - var(--border-width-accent));
}

.notificacoes-menu__item--lida {
  opacity: 0.85;
}

.notificacoes-menu__botao {
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  gap: var(--spacing-3);
  padding: 0;
  text-align: left;
  width: 100%;
}

.notificacoes-menu__botao:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.notificacoes-menu__icone {
  align-items: center;
  border-radius: var(--radius-md);
  display: inline-flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.notificacoes-menu__icone--neutral {
  background: var(--color-neutral-100);
  color: var(--color-text-secondary);
}

.notificacoes-menu__icone--success {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.notificacoes-menu__icone--warning {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.notificacoes-menu__icone--error {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.notificacoes-menu__icone--info {
  background: var(--color-info-50);
  color: var(--color-info-700);
}

.notificacoes-menu__conteudo {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 0;
}

.notificacoes-menu__topo {
  align-items: flex-start;
  display: flex;
  gap: var(--spacing-2);
  justify-content: space-between;
}

.notificacoes-menu__item-titulo {
  color: var(--color-text-primary);
  flex: 1;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  min-width: 0;
}

.notificacoes-menu__item--nao-lida .notificacoes-menu__item-titulo {
  font-weight: var(--font-weight-bold);
}

.notificacoes-menu__prioridade {
  flex-shrink: 0;
  padding: var(--spacing-1) var(--spacing-2);
}

.notificacoes-menu__mensagem {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--color-text-secondary);
  display: -webkit-box;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-snug);
  overflow: hidden;
}

.notificacoes-menu__meta {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-tight);
  margin-top: var(--spacing-1);
  opacity: 0.85;
}

.notificacoes-menu__acoes {
  margin-left: calc(32px + var(--spacing-3));
  margin-top: var(--spacing-2);
}
</style>
