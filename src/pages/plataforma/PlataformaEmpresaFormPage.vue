<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Nova empresa"
      subtitulo="Cadastre empresa, unidades iniciais e convide o primeiro Diretor por e-mail."
    />

    <section class="agro-section">
      <agro-card>
        <q-stepper v-model="passo" flat animated color="primary" class="plataforma-form__stepper">
          <q-step :name="1" title="Empresa" icon="business" :done="passo > 1">
            <empresa-step ref="empresaStepRef" v-model:empresa="empresa" />
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Voltar à lista de empresas" :to="{ name: 'plataforma' }" />
              <agro-btn
                color="primary"
                unelevated
                label="Continuar"
                descricao="Avançar para unidades"
                @click="avancar(2)"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Unidades" icon="store" :done="passo > 2">
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
                descricao="Avançar para o administrador"
                @click="avancar(3)"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Diretor" icon="person">
            <div class="plataforma-form__admin">
              <p class="text-body-md text-secondary">
                Informe o e-mail do Diretor. Ele receberá um convite para definir a senha no primeiro
                acesso.
              </p>
              <q-input
                v-model="admin.nome"
                outlined
                label="Nome"
                class="field-required"
                :rules="[obrigatorio]"
              />
              <q-input
                v-model="admin.sobrenome"
                outlined
                label="Sobrenome"
                class="field-required"
                :rules="[obrigatorio]"
              />
              <q-input
                v-model="admin.email"
                outlined
                label="E-mail"
                type="email"
                class="field-required"
                :rules="[obrigatorio, emailValidator]"
              />
            </div>
            <q-stepper-navigation class="agro-form-actions">
              <agro-btn flat label="Voltar" descricao="Retornar às unidades" @click="passo = 2" />
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
import EmpresaStep from 'components/onboarding/EmpresaStep.vue';
import UnidadesStep from 'components/onboarding/UnidadesStep.vue';
import AppPageHeader from 'components/shared/AppPageHeader.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { useNotificacao } from 'composables/useNotificacao';
import { usePlataforma } from 'composables/usePlataforma';
import { TipoOperacaoEmpresa } from 'constants/enums';
import {
  criarAdminVazio,
  type AdminEmpresaFormModel,
} from 'types/dtos/plataforma.dto';
import {
  criarUnidadeVazia,
  type EmpresaFormModel,
  type UnidadeFormModel,
} from 'types/dtos/onboarding.dto';
import { apenasDigitos } from 'utils/formatters';
import { email as emailValidator, obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const { salvando, criar } = usePlataforma();
const { erro } = useNotificacao();

const passo = ref(1);
const empresaStepRef = ref<InstanceType<typeof EmpresaStep> | null>(null);
const unidadesStepRef = ref<InstanceType<typeof UnidadesStep> | null>(null);

const empresa = ref<EmpresaFormModel>({
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  tipoOperacao: TipoOperacaoEmpresa.Revenda,
});
const unidades = ref<UnidadeFormModel[]>([criarUnidadeVazia(true)]);
const admin = ref<AdminEmpresaFormModel>(criarAdminVazio());

function adicionarUnidade(): void {
  unidades.value.push(criarUnidadeVazia(false));
}

function removerUnidade(id: string): void {
  unidades.value = unidades.value.filter((unidade) => unidade.id !== id);
}

function definirMatriz(id: string): void {
  unidades.value = unidades.value.map((unidade) => ({
    ...unidade,
    matriz: unidade.id === id,
  }));
}

async function avancar(destino: number): Promise<void> {
  if (destino === 2) {
    const valido = (await empresaStepRef.value?.validar()) ?? false;
    if (!valido) {
      return;
    }
  }

  if (destino === 3) {
    const valido = (await unidadesStepRef.value?.validar()) ?? false;
    if (!valido) {
      return;
    }

    const matrizes = unidades.value.filter((unidade) => unidade.matriz);
    if (matrizes.length !== 1) {
      erro('Selecione exatamente uma unidade como matriz.');
      return;
    }
  }

  passo.value = destino;
}

async function concluir(): Promise<void> {
  if (!admin.value.nome.trim() || !admin.value.sobrenome.trim() || !admin.value.email.trim()) {
    erro('Preencha os dados do Diretor.');
    return;
  }

  if (emailValidator(admin.value.email) !== true) {
    erro('Revise o e-mail do Diretor.');
    return;
  }

  await criar({
    razaoSocial: empresa.value.razaoSocial.trim(),
    nomeFantasia: empresa.value.nomeFantasia.trim(),
    cnpj: apenasDigitos(empresa.value.cnpj),
    tipoOperacao: empresa.value.tipoOperacao,
    unidades: unidades.value.map(({ id: _id, ...unidade }) => ({
      ...unidade,
      telefone: apenasDigitos(unidade.telefone),
      cep: apenasDigitos(unidade.cep),
      numero: apenasDigitos(unidade.numero),
      estado: unidade.estado.trim().toUpperCase(),
      complemento: unidade.complemento?.trim() || null,
    })),
    admin: {
      nome: admin.value.nome.trim(),
      sobrenome: admin.value.sobrenome.trim(),
      email: admin.value.email.trim(),
    },
  });
}
</script>

<style scoped>
.plataforma-form__stepper {
  background: transparent;
}

.plataforma-form__admin {
  display: grid;
  gap: var(--spacing-4);
  max-width: 480px;
}
</style>
