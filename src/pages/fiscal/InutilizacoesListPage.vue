<template>
  <q-page class="agro-page">
    <app-page-header titulo="Inutilizações" subtitulo="Inutilização de numeração fiscal.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova inutilização"
        descricao="Registrar inutilização"
        @click="dialog = true"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && inutilizacoes.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && inutilizacoes.length === 0"
          titulo="Nenhuma inutilização"
          descricao="Registre faixas de numeração inutilizadas."
          icon="block"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="inutilizacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarData(props.row.createdAt) }}</q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Nova inutilização</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input v-model="form.serie" outlined label="Série" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.numeroInicial" outlined label="Número inicial" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.numeroFinal" outlined label="Número final" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.modeloDocumento"
                  outlined
                  emit-value
                  map-options
                  label="Modelo"
                  class="field-required"
                  :options="ModeloDocumentoFiscalOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.justificativa"
                  outlined
                  type="textarea"
                  autogrow
                  label="Justificativa"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" @click="dialog = false" />
              <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useInutilizacoesFiscais } from 'composables/useInutilizacoesFiscais';
import { ModeloDocumentoFiscalOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { InutilizacaoFormModel, NumeracaoInutilizadaDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarData } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { inutilizacoes, carregando, salvando, carregar, criar } = useInutilizacoesFiscais();
const dialog = ref(false);
const form = ref<InutilizacaoFormModel>({
  serie: '',
  numeroInicial: '',
  numeroFinal: '',
  justificativa: '',
  modeloDocumento: '',
});

const colunas: QTableColumn<NumeracaoInutilizadaDto>[] = [
  { name: 'serie', label: 'Série', field: 'serie', align: 'left' },
  { name: 'numeroInicial', label: 'Inicial', field: 'numeroInicial', align: 'right' },
  { name: 'numeroFinal', label: 'Final', field: 'numeroFinal', align: 'right' },
  { name: 'modeloDocumento', label: 'Modelo', field: 'modeloDocumento', align: 'left' },
  { name: 'protocoloStub', label: 'Protocolo', field: 'protocoloStub', align: 'left' },
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'left' },
];

async function salvar(): Promise<void> {
  const ok = await criar(form.value);
  if (ok) {
    dialog.value = false;
    form.value = {
      serie: '',
      numeroInicial: '',
      numeroFinal: '',
      justificativa: '',
      modeloDocumento: '',
    };
  }
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.dialog {
  min-width: min(560px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
