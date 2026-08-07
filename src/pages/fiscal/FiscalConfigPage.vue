<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Configuração fiscal"
      subtitulo="Regime tributário e importação de XML."
    />

    <section class="agro-section fiscal">
      <agro-card>
        <h3 class="titulo">Configuração</h3>
        <agro-form-skeleton v-if="carregando && !configuracao" :campos="3" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.regimeTributario"
                outlined
                label="Regime tributário"
                class="field-required"
                emit-value
                map-options
                :options="RegimeTributarioOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.focusNfeToken"
                outlined
                label="Token Focus NFe"
                :hint="configuracao?.possuiTokenFocus ? 'Token já cadastrado — informe para substituir' : undefined"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-toggle
                v-model="formulario.focusNfeHomologacao"
                label="Ambiente de homologação Focus"
                color="primary"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn
              color="primary"
              unelevated
              label="Salvar configuração"
              descricao="Salvar configuração fiscal"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Importar XML de lote</h3>
        <q-input
          v-model="xmlConteudo"
          outlined
          label="Conteúdo XML"
          type="textarea"
          autogrow
          class="q-mb-md"
        />
        <div class="acoes">
          <agro-btn
            color="primary"
            unelevated
            label="Importar XML"
            descricao="Importar XML fiscal"
            :loading="importando"
            :disable="!xmlConteudo.trim()"
            @click="importar"
          />
        </div>
        <div v-if="ultimaImportacao" class="resultado">
          <p>
            Itens: <span class="text-metric">{{ ultimaImportacao.itensProcessados }}</span>
            · Produtos:
            <span class="text-metric">{{ ultimaImportacao.produtosAtualizados }}</span>
            · Entradas:
            <span class="text-metric">{{ ultimaImportacao.entradasEstoque }}</span>
          </p>
          <ul v-if="ultimaImportacao.avisos.length">
            <li v-for="(aviso, i) in ultimaImportacao.avisos" :key="i">{{ aviso }}</li>
          </ul>
        </div>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Ferramentas</h3>
        <div class="acoes">
          <agro-btn
            flat
            icon="calculate"
            label="Cálculo de impostos"
            descricao="Ir para cálculo de impostos"
            :to="{ name: 'fiscal-calculo-impostos' }"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useFiscal } from 'composables/useFiscal';
import { RegimeTributarioOpcoes } from 'constants/enums';
import type { ConfiguracaoFiscalFormModel } from 'types/dtos/fiscal.dto';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref, watch } from 'vue';

const {
  configuracao,
  ultimaImportacao,
  carregando,
  salvando,
  importando,
  obterConfiguracao,
  salvarConfiguracao,
  importarXml,
} = useFiscal();

const formulario = ref<ConfiguracaoFiscalFormModel>({
  regimeTributario: '',
  focusNfeToken: '',
  focusNfeHomologacao: true,
});
const xmlConteudo = ref('');

watch(
  configuracao,
  (cfg) => {
    if (cfg) {
      formulario.value.regimeTributario = cfg.regimeTributario;
      formulario.value.focusNfeHomologacao = cfg.focusNfeHomologacao ?? true;
    }
  },
  { immediate: true },
);

async function salvar(): Promise<void> {
  const ok = await salvarConfiguracao(formulario.value);
  if (ok) {
    formulario.value.focusNfeToken = '';
  }
}

async function importar(): Promise<void> {
  await importarXml(xmlConteudo.value);
}

onMounted(() => {
  void obterConfiguracao();
});
</script>

<style scoped>
.fiscal {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-4);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.resultado {
  margin-top: var(--spacing-4);
  color: var(--color-text-secondary);
}
</style>
