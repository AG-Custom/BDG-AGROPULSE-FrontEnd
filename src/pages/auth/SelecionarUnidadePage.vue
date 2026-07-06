<template>
  <q-page class="auth-page">
    <auth-card subtitulo="Escolha a unidade para continuar">
      <h1 class="selecionar-unidade__titulo text-h2">Selecione a unidade</h1>
      <p class="selecionar-unidade__desc text-body-md text-secondary">
        Você tem acesso a mais de uma unidade. Escolha em qual deseja operar.
      </p>

      <div v-if="carregandoLista" class="selecionar-unidade__loading">
        <q-skeleton v-for="n in 3" :key="n" type="rect" height="72px" />
      </div>

      <empty-state
        v-else-if="unidades.length === 0"
        titulo="Nenhuma unidade disponível"
        descricao="Entre em contato com o administrador da sua empresa."
        icon="business"
      />

      <ul v-else class="selecionar-unidade__lista">
        <li v-for="unidade in unidades" :key="unidade.id">
          <button
            type="button"
            class="selecionar-unidade__item"
            :disabled="carregando"
            :aria-busy="unidadeSelecionandoId === unidade.id"
            @click="escolher(unidade.id)"
          >
            <div class="selecionar-unidade__item-info">
              <span class="selecionar-unidade__item-nome">{{ unidade.nome }}</span>
              <span class="selecionar-unidade__item-codigo text-caption text-secondary">
                {{ unidade.codigo }}
              </span>
            </div>
            <q-badge v-if="unidade.matriz" color="primary" label="Matriz" />
            <q-spinner v-if="unidadeSelecionandoId === unidade.id" size="20px" color="primary" />
            <q-icon v-else name="chevron_right" class="text-secondary" />
          </button>
        </li>
      </ul>
    </auth-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthCard from 'components/shared/AuthCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAuth } from 'composables/useAuth';
import { useContextoUnidade } from 'composables/useContextoUnidade';
import type { UnidadeDisponivelDto } from 'types/dtos/auth.dto';
import { computed, onMounted, ref } from 'vue';

const { unidadesDisponiveis } = useAuth();
const { carregando, unidadeSelecionandoId, listarUnidades, selecionarUnidadeInicial } =
  useContextoUnidade();

const carregandoLista = ref(false);
const unidadesCarregadas = ref<UnidadeDisponivelDto[]>([]);

const unidades = computed(() => {
  if (unidadesDisponiveis.value && unidadesDisponiveis.value.length > 0) {
    return unidadesDisponiveis.value;
  }

  return unidadesCarregadas.value;
});

onMounted(async () => {
  if (unidades.value.length > 0) {
    return;
  }

  carregandoLista.value = true;

  try {
    unidadesCarregadas.value = await listarUnidades();
  } finally {
    carregandoLista.value = false;
  }
});

async function escolher(unidadeId: string): Promise<void> {
  await selecionarUnidadeInicial(unidadeId);
}
</script>

<style scoped>
.selecionar-unidade__titulo {
  margin: 0;
}

.selecionar-unidade__desc {
  margin: 0;
}

.selecionar-unidade__loading {
  display: grid;
  gap: var(--spacing-3);
}

.selecionar-unidade__lista {
  display: grid;
  gap: var(--spacing-3);
  list-style: none;
  margin: 0;
  padding: 0;
}

.selecionar-unidade__item {
  align-items: center;
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  text-align: left;
  transition: border-color var(--duration-fast), background-color var(--duration-fast);
  width: 100%;
}

.selecionar-unidade__item:hover:not(:disabled) {
  background: var(--color-primary-50);
  border-color: var(--color-primary-200);
}

.selecionar-unidade__item:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.selecionar-unidade__item-info {
  display: grid;
  flex: 1;
  gap: var(--spacing-1);
}

.selecionar-unidade__item-nome {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}
</style>
