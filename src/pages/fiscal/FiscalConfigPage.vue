<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Configuração fiscal"
      subtitulo="Regime tributário, importação de XML e SPED 0200."
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
        <h3 class="titulo">SPED 0200</h3>
        <p class="text-caption">Baixe o arquivo de cadastro de produtos (registro 0200).</p>
        <div class="acoes">
          <agro-btn
            color="primary"
            unelevated
            icon="download"
            label="Baixar SPED 0200"
            descricao="Exportar SPED 0200"
            :loading="exportando"
            @click="exportar"
          />
          <agro-btn
            flat
            icon="open_in_new"
            label="SPED completo"
            descricao="Ir para SPED fiscal"
            :to="{ name: 'fiscal-sped' }"
          />
          <agro-btn
            flat
            icon="calculate"
            label="Cálculo de impostos"
            descricao="Ir para cálculo de impostos"
            :to="{ name: 'fiscal-calculo-impostos' }"
          />
        </div>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Manifestação do destinatário</h3>
        <p class="text-caption">Stub SEFAZ — ciência, confirmação, desconhecimento ou operação não realizada.</p>
        <q-form greedy class="agro-formulario" @submit.prevent="enviarManifestacao">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="manifestacao.chaveAcesso"
                outlined
                label="Chave de acesso"
                class="field-required"
                maxlength="44"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="manifestacao.tipo"
                outlined
                emit-value
                map-options
                label="Tipo"
                class="field-required"
                :options="TipoManifestacaoSefazOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="manifestacao.justificativa"
                outlined
                label="Justificativa"
                type="textarea"
                autogrow
                hint="Obrigatória para desconhecimento / não realizada"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn
              color="primary"
              unelevated
              label="Manifestar"
              descricao="Registrar manifestação SEFAZ"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
        <p v-if="ultimaManifestacao" class="resultado">
          Protocolo: <span class="text-metric">{{ ultimaManifestacao.protocoloStub }}</span>
          · Tipo: {{ ultimaManifestacao.tipo }}
        </p>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useFiscal } from 'composables/useFiscal';
import { RegimeTributarioOpcoes, TipoManifestacaoSefazOpcoes } from 'constants/enums';
import type { ConfiguracaoFiscalFormModel } from 'types/dtos/fiscal.dto';
import type { ManifestarDestinatarioPayload } from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { onMounted, reactive, ref, watch } from 'vue';
import type { TipoManifestacaoSefazValor } from 'constants/enums';

const {
  configuracao,
  ultimaImportacao,
  ultimaManifestacao,
  carregando,
  salvando,
  importando,
  exportando,
  obterConfiguracao,
  salvarConfiguracao,
  importarXml,
  exportarSped0200,
  manifestar,
} = useFiscal();

const formulario = ref<ConfiguracaoFiscalFormModel>({
  regimeTributario: '',
  focusNfeToken: '',
});
const xmlConteudo = ref('');
const manifestacao = reactive({
  chaveAcesso: '',
  tipo: '' as TipoManifestacaoSefazValor | '',
  justificativa: '',
});

watch(
  configuracao,
  (cfg) => {
    if (cfg) {
      formulario.value.regimeTributario = cfg.regimeTributario;
    }
  },
  { immediate: true },
);

async function salvar(): Promise<void> {
  await salvarConfiguracao(formulario.value);
}

async function importar(): Promise<void> {
  await importarXml(xmlConteudo.value);
}

async function exportar(): Promise<void> {
  await exportarSped0200();
}

async function enviarManifestacao(): Promise<void> {
  if (!manifestacao.tipo) return;
  await manifestar({
    chaveAcesso: manifestacao.chaveAcesso.trim(),
    tipo: manifestacao.tipo,
    justificativa: manifestacao.justificativa.trim() || null,
  });
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
