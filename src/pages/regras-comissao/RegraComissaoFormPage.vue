<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="2" />

        <q-form v-else ref="formRef" greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.canal"
                outlined
                label="Canal de venda"
                hint="Vazio = aplica a todos os canais"
                emit-value
                map-options
                clearable
                :options="CanalVendaOpcoes"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.percentual"
                outlined
                label="Comissão %"
                class="field-required"
                type="number"
                min="0"
                step="0.01"
                aria-required="true"
                :rules="[obrigatorio, percentualZeroACem]"
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar sem salvar"
              :disable="salvando"
              @click="voltar"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              :descricao="
                modo === 'criar' ? 'Cadastrar regra de comissão' : 'Salvar alterações'
              "
              :loading="salvando"
              @click="salvar"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'regras-comissao' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import {
  formVazioRegraComissao,
  regraComissaoParaForm,
  useRegrasComissao,
} from 'composables/useRegrasComissao';
import { CanalVendaOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { RegraComissaoFormModel } from 'types/dtos/regra-comissao.dto';
import { obrigatorio, percentualZeroACem } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { regra, salvando, obter, criar, editar } = useRegrasComissao();

const formRef = ref<QForm | null>(null);
const formulario = ref<RegraComissaoFormModel>(formVazioRegraComissao());
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'regra-comissao-visualizar') {
    return 'visualizar';
  }

  return route.name === 'regra-comissao-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');

const regraId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova regra de comissão';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar regra de comissão';
  }

  return 'Editar regra de comissão';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Defina canal e percentual de comissão.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte a regra de comissão selecionada.';
  }

  return 'Atualize a regra de comissão selecionada.';
});

function voltar(): void {
  void router.push({ name: 'regras-comissao' });
}

async function salvar(): Promise<void> {
  const valido = (await formRef.value?.validate()) ?? false;
  if (!valido) {
    return;
  }

  if (modo.value === 'criar') {
    const criado = await criar(formulario.value);
    if (criado) {
      await router.push({ name: 'regras-comissao' });
    }
    return;
  }

  if (!regraId.value) {
    return;
  }

  const atualizado = await editar(regraId.value, formulario.value);
  if (atualizado) {
    await router.push({ name: 'regras-comissao' });
  }
}

onMounted(async () => {
  carregandoPagina.value = true;

  if ((modo.value === 'editar' || modo.value === 'visualizar') && regraId.value) {
    const ok = await obter(regraId.value);
    if (!ok || !regra.value) {
      await router.replace({ name: 'regras-comissao' });
      return;
    }

    formulario.value = regraComissaoParaForm(regra.value);
  } else {
    formulario.value = formVazioRegraComissao();
  }

  carregandoPagina.value = false;
});
</script>
