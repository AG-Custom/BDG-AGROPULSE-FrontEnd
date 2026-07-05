<template>
  <q-layout view="hHh lpR fFf" class="auth-layout agro-bg-pattern">
    <q-page-container class="auth-layout__container">
      <div class="auth-layout__split">
        <auth-brand-panel />
        <div class="auth-layout__form">
          <div class="auth-layout__mobile-brand">
            <agro-logo size="md" />
          </div>
          <router-view :key="$route.name ?? $route.path" />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AgroLogo from 'components/shared/AgroLogo.vue';
import AuthBrandPanel from 'components/shared/AuthBrandPanel.vue';
</script>

<style scoped>
.auth-layout__container {
  min-height: 100vh;
}

.auth-layout__split {
  display: flex;
  min-height: 100vh;
}

.auth-layout__form {
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-6);
}

.auth-layout__mobile-brand {
  display: block;
  margin-bottom: var(--spacing-6);
}

@media (min-width: 1024px) {
  .auth-layout__mobile-brand {
    display: none;
  }
}
</style>
