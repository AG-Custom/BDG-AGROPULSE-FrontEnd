<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Funrural"
      subtitulo="Configuração de alíquotas e cálculo Funrural + GILRAT + SENAR."
    />

    <section class="agro-section grid">
      <agro-card>
        <h3 class="titulo">Configuração</h3>
        <agro-form-skeleton v-if="carregando && !config" :campos="5" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="onSalvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.aliquotaFunrural"
                outlined
                label="Alíquota Funrural (%)"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.aliquotaGilrat"
                outlined
                label="Alíquota GILRAT (%)"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.aliquotaSenar"
                outlined
                label="Alíquota SENAR (%)"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.vigenciaInicio"
                outlined
                type="date"
                label="Vigência início"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.vigenciaFim" outlined type="date" label="Vigência fim" />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
          </div>
        </q-form>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Calcular</h3>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input v-model="baseCalculo" outlined label="Base de cálculo" />
          </div>
          <div class="col-12 col-md-4">
            <q-toggle v-model="isProdutorRural" label="Produtor rural" />
          </div>
          <div class="col-12 col-md-4">
            <agro-btn
              color="primary"
              unelevated
              label="Calcular"
              descricao="Calcular Funrural"
              :loading="calculando"
              :disable="!baseCalculo"
              @click="onCalcular"
            />
          </div>
        </div>
        <div v-if="calculo" class="resultado row q-col-gutter-md q-mt-md">
          <div class="col-6 col-md-3">
            <span class="label">Funrural</span>
            <p class="text-metric">{{ formatarMoeda(calculo.funrural) }}</p>
          </div>
          <div class="col-6 col-md-3">
            <span class="label">GILRAT</span>
            <p class="text-metric">{{ formatarMoeda(calculo.gilrat) }}</p>
          </div>
          <div class="col-6 col-md-3">
            <span class="label">SENAR</span>
            <p class="text-metric">{{ formatarMoeda(calculo.senar) }}</p>
          </div>
          <div class="col-6 col-md-3">
            <span class="label">Total</span>
            <p class="text-metric">{{ formatarMoeda(calculo.total) }}</p>
          </div>
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useFunrural } from 'composables/useFunrural';
import type { ConfigFunruralFormModel } from 'types/dtos/fiscal-gestao.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref, watch } from 'vue';

const {
  config,
  calculo,
  carregando,
  salvando,
  calculando,
  carregar,
  salvar,
  calcular,
} = useFunrural();

const form = ref<ConfigFunruralFormModel>({
  aliquotaFunrural: '',
  aliquotaGilrat: '',
  aliquotaSenar: '',
  vigenciaInicio: '',
  vigenciaFim: '',
});
const baseCalculo = ref('');
const isProdutorRural = ref(true);

watch(
  config,
  (cfg) => {
    if (!cfg) return;
    form.value = {
      aliquotaFunrural: String(cfg.aliquotaFunrural),
      aliquotaGilrat: String(cfg.aliquotaGilrat),
      aliquotaSenar: String(cfg.aliquotaSenar),
      vigenciaInicio: cfg.vigenciaInicio,
      vigenciaFim: cfg.vigenciaFim ?? '',
    };
  },
  { immediate: true },
);

async function onSalvar(): Promise<void> {
  await salvar(form.value);
}

async function onCalcular(): Promise<void> {
  await calcular(baseCalculo.value, isProdutorRural.value);
}

onMounted(() => {
  void carregar();
});
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
.label {
  display: block;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
