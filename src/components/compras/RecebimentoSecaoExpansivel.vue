<template>
  <agro-card class="secao-expansivel">
    <button
      type="button"
      class="secao-expansivel__cabecalho"
      :aria-expanded="aberto"
      @click="aberto = !aberto"
    >
      <div class="secao-expansivel__textos">
        <h3 class="secao-expansivel__titulo">{{ titulo }}</h3>
        <p v-if="subtitulo" class="secao-expansivel__subtitulo">{{ subtitulo }}</p>
      </div>
      <q-icon
        :name="aberto ? 'expand_less' : 'expand_more'"
        class="secao-expansivel__icone"
        aria-hidden="true"
      />
    </button>

    <div v-show="aberto" class="secao-expansivel__corpo">
      <slot />
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';

defineProps<{
  titulo: string;
  subtitulo?: string;
}>();

const aberto = defineModel<boolean>({ default: true });
</script>

<style scoped>
.secao-expansivel__cabecalho {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-3);
  margin: calc(var(--card-padding) * -1);
  margin-bottom: 0;
  padding: var(--card-padding);
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition: background-color var(--duration-fast) ease;
}

.secao-expansivel__cabecalho:hover {
  background: var(--color-neutral-50);
}

.secao-expansivel__textos {
  min-width: 0;
  flex: 1;
}

.secao-expansivel__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.secao-expansivel__subtitulo {
  margin: var(--spacing-1) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.secao-expansivel__icone {
  flex-shrink: 0;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
}

.secao-expansivel__corpo {
  padding-top: var(--spacing-4);
}
</style>
