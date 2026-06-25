<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-white text-dark">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>AgroPulse</q-toolbar-title>
        <q-btn flat dense icon="logout" label="Sair" @click="sair" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" bordered :width="260">
      <div class="q-pa-md">
        <div class="text-subtitle1 text-weight-semibold">AgroPulse</div>
        <div class="text-caption text-grey-7">Gestão agrícola integrada</div>
      </div>
      <app-sidebar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppSidebar from 'components/layout/AppSidebar.vue';
import { useAuth } from 'composables/useAuth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const router = useRouter();
const { sair: sairAuth } = useAuth();

function sair(): void {
  sairAuth();
  void router.push({ name: 'login' });
}
</script>
