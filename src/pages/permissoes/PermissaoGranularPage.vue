<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Permissões granulares"
      :subtitulo="subtitulo"
    />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregando && !permissao" :campos="5" />

        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvarForm">
          <div class="flags">
            <q-toggle v-model="formulario.editarProdutos" label="Editar produtos" />
            <q-toggle v-model="formulario.verCustos" label="Ver custos" />
            <q-toggle v-model="formulario.ajustarEstoque" label="Ajustar estoque" />
            <q-toggle v-model="formulario.emitirNota" label="Emitir nota" />
            <q-toggle v-model="formulario.aprovarPedido" label="Aprovar pedido" />
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Voltar aos usuários" :to="{ name: 'usuarios' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Salvar"
              descricao="Salvar permissões granulares"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { usePermissaoGranular } from 'composables/usePermissaoGranular';
import { useUsuarios } from 'composables/useUsuarios';
import type { PermissaoGranularFormModel } from 'types/dtos/permissao-granular.dto';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { permissao, carregando, salvando, obter, salvar } = usePermissaoGranular();
const { usuarios, carregar: carregarUsuarios, nomeCompleto } = useUsuarios();

const usuarioId = computed(() => route.params.usuarioId as string);

const formulario = ref<PermissaoGranularFormModel>({
  editarProdutos: false,
  verCustos: false,
  ajustarEstoque: false,
  emitirNota: false,
  aprovarPedido: false,
});

const subtitulo = computed(() => {
  const usuario = usuarios.value.find((u) => u.id === usuarioId.value);
  return usuario ? `Usuário: ${nomeCompleto(usuario)}` : 'Configure flags de acesso do usuário.';
});

watch(permissao, (p) => {
  if (!p) return;
  formulario.value = {
    editarProdutos: p.editarProdutos,
    verCustos: p.verCustos,
    ajustarEstoque: p.ajustarEstoque,
    emitirNota: p.emitirNota,
    aprovarPedido: p.aprovarPedido,
  };
});

async function salvarForm(): Promise<void> {
  await salvar(usuarioId.value, formulario.value);
}

onMounted(async () => {
  void carregarUsuarios();
  const ok = await obter(usuarioId.value);
  if (!ok) await router.replace({ name: 'usuarios' });
});
</script>

<style scoped>
.flags {
  display: grid;
  gap: var(--spacing-3);
}
</style>
