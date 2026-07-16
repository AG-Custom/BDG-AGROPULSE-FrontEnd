<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="SPED Fiscal"
      subtitulo="Exportação EFD ICMS/IPI, contribuições, contábil e envio ao escritório."
    />

    <section class="agro-section grid">
      <agro-card>
        <h3 class="titulo">Exportar</h3>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input v-model="periodo.dataInicio" outlined type="date" label="Data início" />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="periodo.dataFim" outlined type="date" label="Data fim" />
          </div>
        </div>
        <div class="acoes q-mt-md">
          <agro-btn
            color="primary"
            unelevated
            icon="download"
            label="EFD ICMS/IPI"
            descricao="Exportar EFD ICMS/IPI"
            :loading="exportando"
            @click="onExportar('efd-icms-ipi')"
          />
          <agro-btn
            color="primary"
            unelevated
            icon="download"
            label="EFD Contribuições"
            descricao="Exportar EFD Contribuições"
            :loading="exportando"
            @click="onExportar('efd-contribuicoes')"
          />
          <agro-btn
            color="primary"
            unelevated
            icon="download"
            label="SPED Contábil"
            descricao="Exportar SPED Contábil"
            :loading="exportando"
            @click="onExportar('contabil')"
          />
        </div>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Enviar ao escritório</h3>
        <q-form greedy class="agro-formulario" @submit.prevent="onEnviar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="envio.tipo"
                outlined
                emit-value
                map-options
                label="Tipo SPED"
                class="field-required"
                :options="TipoSpedFiscalOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="envio.periodo"
                outlined
                label="Período (AAAA-MM)"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="envio.emailEscritorio"
                outlined
                type="email"
                label="E-mail do escritório"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn
              color="primary"
              unelevated
              label="Enviar"
              type="submit"
              :loading="enviando"
            />
          </div>
        </q-form>
        <p v-if="ultimoEnvio" class="resultado text-metric">
          {{ ultimoEnvio.status }} — {{ ultimoEnvio.tipo }} / {{ ultimoEnvio.periodo }}
          <span v-if="ultimoEnvio.mensagem"> · {{ ultimoEnvio.mensagem }}</span>
        </p>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import { useSpedFiscal } from 'composables/useSpedFiscal';
import { TipoSpedFiscalOpcoes, type TipoSpedFiscalValor } from 'constants/enums';
import { obrigatorio } from 'utils/validators';
import { reactive } from 'vue';

const { ultimoEnvio, exportando, enviando, exportar, enviarEscritorio } = useSpedFiscal();

const periodo = reactive({
  dataInicio: '',
  dataFim: '',
});

const envio = reactive({
  tipo: '' as TipoSpedFiscalValor | '',
  periodo: '',
  emailEscritorio: '',
});

async function onExportar(
  tipo: 'efd-icms-ipi' | 'efd-contribuicoes' | 'contabil',
): Promise<void> {
  await exportar(tipo, {
    dataInicio: periodo.dataInicio,
    dataFim: periodo.dataFim,
  });
}

async function onEnviar(): Promise<void> {
  if (!envio.tipo) return;
  await enviarEscritorio(envio.tipo, envio.periodo, envio.emailEscritorio);
}
</script>

<style scoped>
.grid {
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
