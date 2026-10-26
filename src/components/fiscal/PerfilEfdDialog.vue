<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Perfil EFD ICMS/IPI</h4>
        <p class="subtitulo">
          Estas informações definem a obrigatoriedade dos blocos do arquivo. Confirme-as com o contador.
        </p>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="emit('submit', { ...formulario })">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select v-model="formulario.perfil" outlined emit-value map-options label="Perfil" :options="PerfilEfdOpcoes" />
            </div>
            <div class="col-12 col-md-8">
              <q-select v-model="formulario.atividade" outlined emit-value map-options label="Atividade" :options="AtividadeEfdOpcoes" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.codigoVersaoLeiaute"
                outlined
                mask="###"
                label="Código da versão do leiaute"
                hint="Ex.: 020 (conforme o período)"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-select v-model="formulario.tipoItemPadrao" outlined emit-value map-options label="Tipo de item padrão" :options="TipoItemSpedOpcoes" />
            </div>
            <div class="col-12">
              <q-checkbox v-model="formulario.obrigadoBlocoG" label="Obrigado ao bloco G (CIAP)" />
              <q-checkbox v-model="formulario.obrigadoBlocoK" label="Obrigado ao bloco K (produção e estoque)" />
              <q-checkbox v-model="formulario.obrigadoInventario" label="Obrigado ao inventário (bloco H)" />
            </div>
            <div class="col-12 col-md-8">
              <q-input v-model="formulario.codigoReceitaIcms" outlined maxlength="30" label="Código de receita do ICMS" hint="Necessário quando houver ICMS a recolher" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.diaVencimentoIcms" outlined mask="##" label="Dia de vencimento do ICMS" />
            </div>
            <div class="col-12 col-md-8">
              <q-input v-model="formulario.contabilistaNome" outlined maxlength="100" label="Contabilista" class="field-required" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.contabilistaCpf" outlined mask="###########" label="CPF do contabilista" class="field-required" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.contabilistaCrc" outlined maxlength="15" label="CRC" class="field-required" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.contabilistaCodigoMunicipio" outlined mask="#######" label="Município (IBGE)" class="field-required" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.contabilistaTelefone" outlined maxlength="20" label="Telefone" />
            </div>
            <div class="col-12">
              <q-input v-model="formulario.contabilistaEmail" outlined maxlength="100" type="email" label="E-mail do contabilista" />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  AtividadeEfdOpcoes,
  PerfilEfdOpcoes,
  TipoItemSpedOpcoes,
} from 'constants/enums';
import type { PerfilEfdDto, PerfilEfdFormModel } from 'types/dtos/obrigacao-fiscal.dto';
import { perfilEfdParaFormulario } from 'utils/mappers/perfil-efd.mapper';
import { obrigatorio } from 'utils/validators';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  perfil: PerfilEfdDto | null;
  salvando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [form: PerfilEfdFormModel];
}>();

const formulario = ref<PerfilEfdFormModel>(perfilEfdParaFormulario(props.perfil));

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) formulario.value = perfilEfdParaFormulario(props.perfil);
  },
);
</script>

<style scoped>
.dialog {
  min-width: min(720px, 94vw);
}

.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.subtitulo {
  margin: var(--spacing-2) 0 0;
  color: var(--color-text-secondary);
}
</style>
