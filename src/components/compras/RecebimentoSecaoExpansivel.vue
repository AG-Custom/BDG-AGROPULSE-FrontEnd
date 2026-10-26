<template>
  <agro-card class="secao-expansivel" :class="{ 'secao-expansivel--compacta': compacta }">
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

withDefaults(
  defineProps<{
    titulo: string;
    subtitulo?: string;
    compacta?: boolean;
  }>(),
  {
    compacta: false,
  },
);

const aberto = defineModel<boolean>({ default: true });
</script>

<style scoped>
.secao-expansivel :deep(.agro-card__body) {
  padding: 0;
}

.secao-expansivel__cabecalho {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  margin: 0;
  padding: var(--spacing-4) var(--card-padding);
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
  line-height: 1;
}

.secao-expansivel__corpo {
  padding: 0 var(--card-padding) var(--card-padding);
}

.secao-expansivel--compacta .secao-expansivel__cabecalho {
  padding: var(--spacing-2) var(--spacing-4);
}

.secao-expansivel--compacta .secao-expansivel__textos {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-3);
}

.secao-expansivel--compacta .secao-expansivel__titulo {
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.secao-expansivel--compacta .secao-expansivel__subtitulo {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.secao-expansivel--compacta .secao-expansivel__icone {
  font-size: 1.25rem;
}

.secao-expansivel--compacta .secao-expansivel__corpo {
  padding: 0 var(--spacing-4) var(--spacing-3);
}
</style>
