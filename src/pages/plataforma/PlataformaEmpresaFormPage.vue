<template>
  <q-page class="agro-page">
    <app-page-header
      :titulo="editando ? 'Editar empresa' : 'Nova empresa'"
      :subtitulo="
        editando
          ? 'Atualize dados cadastrais, tributação e documentos da empresa.'
          : 'Cadastre empresa, tributação, documentos, unidades iniciais e convide o primeiro Diretor.'
      "
    />

    <section class="agro-section">
      <agro-form-skeleton v-if="carregandoDetalhe" :campos="8" />
      <agro-card v-else>
        <q-stepper v-model="passo" flat animated color="primary" class="plataforma-form__stepper">
          <q-step :name="1" title="Empresa" icon="business" :done="passo > 1">
            <empresa-step ref="empresaStepRef" v-model:empresa="empresa" :cnpj-somente-leitura="editando" />
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Voltar à lista de empresas" :to="{ name: 'plataforma' }" />
              <agro-btn
                color="primary"
                unelevated
                label="Continuar"
                descricao="Avançar"
                @click="avancar(editando ? 3 : 2)"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step v-if="!editando" :name="2" title="Unidades" icon="store" :done="passo > 2">
            <unidades-step
              ref="unidadesStepRef"
              v-model:unidades="unidades"
              @adicionar="adicionarUnidade"
              @remover="removerUnidade"
              @matriz="definirMatriz"
            />
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Voltar" descricao="Retornar aos dados da empresa" @click="passo = 1" />
              <agro-btn
                color="primary"
                unelevated
                label="Continuar"
                descricao="Avançar para tributação"
                @click="avancar(3)"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Tributação" icon="account_balance" :done="passo > 3">
            <tributacao-empresa-step ref="tributacaoStepRef" v-model:tributacao="tributacao" />
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Voltar" descricao="Retornar" @click="passo = editando ? 1 : 2" />
              <agro-btn
                color="primary"
                unelevated
                label="Continuar"
                descricao="Avançar para documentos"
                @click="avancar(4)"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="4" title="Documentos" icon="folder" :done="!editando && passo > 4">
            <documentos-empresa-step
              ref="documentosStepRef"
              v-model:documentos="documentos"
              :exigir-ficha="!editando || !detalhe?.fichaCliente"
              :ficha-atual="detalhe?.fichaCliente"
            />
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Voltar" descricao="Retornar à tributação" @click="passo = 3" />
              <agro-btn
                v-if="editando"
                color="primary"
                unelevated
                label="Salvar"
                descricao="Salvar alterações da empresa"
                :loading="salvando"
                @click="salvarEdicao"
              />
              <agro-btn
                v-else
                color="primary"
                unelevated
                label="Continuar"
                descricao="Avançar para o diretor"
                @click="avancar(5)"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step v-if="!editando" :name="5" title="Diretor" icon="person">
            <diretor-empresa-step ref="diretorStepRef" v-model:admin="admin" />
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Voltar" descricao="Retornar aos documentos" @click="passo = 4" />
              <agro-btn
                color="primary"
                unelevated
                label="Cadastrar empresa"
                descricao="Salvar empresa e diretor na plataforma"
                :loading="salvando"
                @click="concluir"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import DiretorEmpresaStep from 'components/plataforma/DiretorEmpresaStep.vue';
import DocumentosEmpresaStep from 'components/plataforma/DocumentosEmpresaStep.vue';
import TributacaoEmpresaStep from 'components/plataforma/TributacaoEmpresaStep.vue';
import EmpresaStep from 'components/onboarding/EmpresaStep.vue';
import UnidadesStep from 'components/onboarding/UnidadesStep.vue';
import AppPageHeader from 'components/shared/AppPageHeader.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { usePlataformaEmpresaForm } from 'composables/usePlataformaEmpresaForm';
import { ref } from 'vue';

const empresaStepRef = ref<InstanceType<typeof EmpresaStep> | null>(null);
const unidadesStepRef = ref<InstanceType<typeof UnidadesStep> | null>(null);
const tributacaoStepRef = ref<InstanceType<typeof TributacaoEmpresaStep> | null>(null);
const documentosStepRef = ref<InstanceType<typeof DocumentosEmpresaStep> | null>(null);
const diretorStepRef = ref<InstanceType<typeof DiretorEmpresaStep> | null>(null);

const {
  editando,
  carregandoDetalhe,
  salvando,
  detalhe,
  passo,
  empresa,
  unidades,
  tributacao,
  documentos,
  admin,
  adicionarUnidade,
  removerUnidade,
  definirMatriz,
  avancar,
  concluir,
  salvarEdicao,
} = usePlataformaEmpresaForm({
  empresaStep: empresaStepRef,
  unidadesStep: unidadesStepRef,
  tributacaoStep: tributacaoStepRef,
  documentosStep: documentosStepRef,
  diretorStep: diretorStepRef,
});
</script>

<style scoped>
.plataforma-form__stepper {
  background: transparent;
}
</style>
