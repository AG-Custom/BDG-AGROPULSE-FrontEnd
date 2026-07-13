<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Configuração de compras"
      subtitulo="Fluxo completo e alçadas de aprovação por valor."
    />

    <section class="agro-section detalhe">
      <agro-card>
        <h3 class="titulo">Fluxo completo</h3>
        <agro-form-skeleton v-if="carregandoConfig && !config" :campos="2" />
        <template v-else>
          <q-toggle
            v-model="fluxoCompleto"
            label="Habilitar solicitação → cotação → aprovação → pedido"
            color="primary"
          />
          <div class="agro-form-actions">
            <agro-btn
              color="primary"
              unelevated
              label="Salvar configuração"
              descricao="Salvar flag do fluxo completo"
              :loading="salvandoConfig"
              @click="salvarConfig"
            />
          </div>
        </template>
      </agro-card>

      <agro-card>
        <div class="alcadas-header">
          <h3 class="titulo">Alçadas de aprovação</h3>
          <agro-btn flat icon="add" label="Alçada" descricao="Adicionar alçada" @click="adicionar" />
        </div>

        <agro-table-skeleton v-if="carregandoAlcadas && alcadasForm.length === 0" :colunas="4" />
        <empty-state
          v-else-if="alcadasForm.length === 0"
          titulo="Nenhuma alçada"
          descricao="Sem alçadas, o pedido vai direto para Enviado."
          icon="rule"
        />
        <div v-else class="alcadas-lista">
          <div v-for="(alcada, index) in alcadasForm" :key="alcada.chave" class="row q-col-gutter-md q-mb-sm">
            <div class="col-12 col-md-2">
              <q-input v-model="alcada.ordem" outlined dense label="Ordem" type="number" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="alcada.valorMinimo" outlined dense label="Valor mínimo" type="number" step="0.01" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="alcada.valorMaximo" outlined dense label="Valor máximo" type="number" step="0.01" />
            </div>
            <div class="col-10 col-md-3">
              <q-input v-model="alcada.perfil" outlined dense label="Perfil" />
            </div>
            <div class="col-2 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover alçada"
                @click="alcadasForm.splice(index, 1)"
              />
            </div>
          </div>
        </div>

        <div class="agro-form-actions">
          <agro-btn
            color="primary"
            unelevated
            label="Salvar alçadas"
            descricao="Salvar alçadas de aprovação"
            :loading="salvandoAlcadas"
            @click="salvarAlcadasForm"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useComprasAprovacoes } from 'composables/useComprasAprovacoes';
import { useComprasConfig } from 'composables/useComprasConfig';
import { onMounted, ref, watch } from 'vue';

interface AlcadaForm {
  chave: string;
  valorMinimo: string;
  valorMaximo: string;
  perfil: string;
  ordem: string;
}

const {
  config,
  carregando: carregandoConfig,
  salvando: salvandoConfig,
  carregar: carregarConfig,
  salvar,
} = useComprasConfig();
const {
  alcadas,
  carregando: carregandoAlcadas,
  salvando: salvandoAlcadas,
  carregarAlcadas,
  salvarAlcadas,
} = useComprasAprovacoes();

const fluxoCompleto = ref(false);
const alcadasForm = ref<AlcadaForm[]>([]);

watch(
  config,
  (valor) => {
    fluxoCompleto.value = valor?.fluxoCompletoHabilitado ?? false;
  },
  { immediate: true },
);

watch(
  alcadas,
  (lista) => {
    alcadasForm.value = lista.map((a) => ({
      chave: a.id,
      valorMinimo: String(a.valorMinimo),
      valorMaximo: String(a.valorMaximo),
      perfil: a.perfil,
      ordem: String(a.ordem),
    }));
  },
  { immediate: true },
);

function adicionar(): void {
  alcadasForm.value.push({
    chave: crypto.randomUUID(),
    valorMinimo: '0',
    valorMaximo: '1000',
    perfil: 'Gerente',
    ordem: String(alcadasForm.value.length + 1),
  });
}

async function salvarConfig(): Promise<void> {
  await salvar({ fluxoCompletoHabilitado: fluxoCompleto.value });
}

async function salvarAlcadasForm(): Promise<void> {
  await salvarAlcadas({
    alcadas: alcadasForm.value.map((a) => ({
      valorMinimo: Number(a.valorMinimo),
      valorMaximo: Number(a.valorMaximo),
      perfil: a.perfil.trim(),
      ordem: Number(a.ordem),
    })),
  });
}

onMounted(async () => {
  await Promise.all([carregarConfig(true), carregarAlcadas()]);
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.alcadas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}
.alcadas-header .titulo {
  margin: 0;
}
</style>
