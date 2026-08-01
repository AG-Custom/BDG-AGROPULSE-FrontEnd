<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Importação geo"
      subtitulo="Importar KML, Shapefile ou GeoJSON (stub)."
    />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.nomeArquivo"
                outlined
                label="Nome do arquivo"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.tipo"
                outlined
                label="Tipo"
                class="field-required"
                emit-value
                map-options
                :options="TipoGeoImportacaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12">
              <agro-select-cadastro
                v-model="formulario.fazendaId"
                entidade="fazenda"
                label="Fazenda (opcional)"
                clearable
                :options="fazendaOpcoes"
                @atualizar="carregar()"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn
              color="primary"
              unelevated
              label="Importar"
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
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useFazendas } from 'composables/useFazendas';
import { TipoGeoImportacaoOpcoes } from 'constants/enums';
import type { ImportarGeoFormModel } from 'types/dtos/safras.dto';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { fazendaOpcoes, salvando, carregar, importarGeo } = useFazendas();
const formulario = ref<ImportarGeoFormModel>({
  nomeArquivo: '',
  tipo: '',
  fazendaId: '',
});

async function salvar(): Promise<void> {
  const ok = await importarGeo(formulario.value);
  if (ok) {
    formulario.value = { nomeArquivo: '', tipo: '', fazendaId: '' };
  }
}

onMounted(() => {
  void carregar();
});
</script>
