<template>
  <agro-btn
    outline
    dense
    no-caps
    color="primary"
    icon="corporate_fare"
    :label="rotulo"
    descricao="Ver dados da empresa e CNPJs"
    class="empresa-header-link"
    :class="{ 'empresa-header-link--icon-only': !rotulo }"
    :to="{ name: 'cnpjs' }"
  />
</template>

<script setup lang="ts">
import { useCnpjs } from 'composables/useCnpjs';
import { computed, onMounted } from 'vue';

const { cnpjs, carregando, carregar } = useCnpjs();

const cnpjPrincipal = computed(
  () => cnpjs.value.find((cnpj) => cnpj.principal) ?? cnpjs.value[0] ?? null,
);

const rotulo = computed(() => {
  if (carregando.value) {
    return '…';
  }

  if (!cnpjPrincipal.value) {
    return 'Empresa';
  }

  const nome = cnpjPrincipal.value.nomeFantasia || cnpjPrincipal.value.razaoSocial;
  return nome.length > 32 ? `${nome.slice(0, 32)}…` : nome;
});

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.empresa-header-link {
  font-weight: var(--font-weight-semibold);
  letter-spacing: normal;
  max-width: 240px;
  text-transform: none;
}

.empresa-header-link :deep(.q-btn__content) {
  min-width: 0;
}

.empresa-header-link :deep(.block) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .empresa-header-link:not(.empresa-header-link--icon-only) :deep(.block) {
    display: none;
  }
}
</style>
