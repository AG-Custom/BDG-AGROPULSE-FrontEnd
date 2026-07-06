<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Novo CNPJ"
      subtitulo="Cadastre um novo CNPJ vinculado à sua empresa."
    />

    <section class="agro-section">
      <agro-card>
        <q-inner-loading :showing="carregandoPagina" color="primary" />

        <cnpj-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :desabilitar-principal="possuiPrincipal"
        />

        <div class="cnpj-form-page__acoes">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Voltar para a listagem sem salvar"
            :disable="salvando"
            @click="voltar"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Cadastrar"
            descricao="Cadastrar novo CNPJ na empresa"
            :loading="salvando"
            @click="salvar"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import CnpjFormulario from 'components/cnpjs/CnpjFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { useCnpjs } from 'composables/useCnpjs';
import type { CnpjFormModel } from 'types/dtos/cnpj.dto';
import { criarCnpjFormVazia } from 'utils/mappers/cnpj.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { cnpjs, carregando, salvando, carregar, criar } = useCnpjs();

const formularioRef = ref<InstanceType<typeof CnpjFormulario> | null>(null);
const formulario = ref<CnpjFormModel>(criarCnpjFormVazia());
const carregandoPagina = ref(true);

const possuiPrincipal = computed(() => cnpjs.value.some((cnpj) => cnpj.principal));

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  await carregar();
  formulario.value = criarCnpjFormVazia(!possuiPrincipal.value);

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'cnpjs' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso = await criar(formulario.value);

  if (sucesso) {
    await router.push({ name: 'cnpjs' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.cnpj-form-page__acoes {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
}
</style>
