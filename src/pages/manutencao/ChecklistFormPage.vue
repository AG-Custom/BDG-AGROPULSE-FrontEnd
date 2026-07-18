<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Checklist de inspeção"
      subtitulo="Inspeção diária do ativo."
    />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.ativoId"
                outlined
                label="Ativo"
                emit-value
                map-options
                class="field-required"
                :options="ativoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.data"
                outlined
                label="Data"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.operadorNome"
                outlined
                label="Operador"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.horimetro"
                outlined
                label="Horímetro"
                type="number"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.status"
                outlined
                label="Status"
                emit-value
                map-options
                class="field-required"
                :options="StatusChecklistInspecaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-sec">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md q-mb-sm items-center"
          >
            <div class="col-12 col-md-5">
              <q-input
                v-model="item.descricao"
                outlined
                dense
                label="Descrição"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-btn-toggle
                v-model="item.ok"
                unelevated
                toggle-color="primary"
                :options="[
                  { label: 'OK', value: true },
                  { label: 'NOK', value: false },
                ]"
              />
            </div>
            <div class="col-10 col-md-3">
              <q-input v-model="item.observacao" outlined dense label="Observação" />
            </div>
            <div class="col-2 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover item"
                :disable="formulario.itens.length <= 1"
                @click="formulario.itens.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'manutencao-checklists' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Salvar"
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
import { checklistVazio, useManutencao } from 'composables/useManutencao';
import { StatusChecklistInspecaoOpcoes } from 'constants/enums';
import type { ChecklistManutencaoFormModel } from 'types/dtos/manutencao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { criarChecklist, salvando, ativos, carregarAtivos } = useManutencao();
const carregandoPagina = ref(true);
const formulario = ref<ChecklistManutencaoFormModel>(checklistVazio());

const ativoOpcoes = computed(() =>
  ativos.value.map((a) => ({ label: a.nome, value: a.id })),
);

function adicionarItem(): void {
  formulario.value.itens.push({
    chave: crypto.randomUUID(),
    descricao: '',
    ok: true,
    observacao: '',
  });
}

async function salvar(): Promise<void> {
  const criado = await criarChecklist(formulario.value);
  if (criado) await router.push({ name: 'manutencao-checklists' });
}

onMounted(async () => {
  await carregarAtivos();
  carregandoPagina.value = false;
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--spacing-4) 0 var(--spacing-3);
}
.titulo-sec {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
