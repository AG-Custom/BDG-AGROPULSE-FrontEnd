<template>
  <q-page class="agro-page">
    <app-page-header titulo="MVA NCM/UF" subtitulo="Margem de valor agregado para ICMS ST.">
      <agro-btn color="primary" unelevated icon="add" label="Nova MVA" descricao="Cadastrar MVA" @click="abrirDialog()" />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && itens.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && itens.length === 0"
          titulo="Nenhuma MVA"
          descricao="Cadastre MVA por NCM e UF."
          icon="swap_horiz"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="itens"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-mva="props">
            <q-td :props="props" class="text-metric">{{ props.row.mva }}%</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn flat round dense icon="edit" color="primary" descricao="Editar" @click="abrirDialog(props.row)" />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar MVA' : 'Nova MVA NCM/UF' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input v-model="form.ncm" outlined label="NCM" class="field-required" :readonly="!!editandoId" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-4">
                <q-input v-model="form.ufOrigem" outlined label="UF origem" maxlength="2" class="field-required" :readonly="!!editandoId" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-4">
                <q-input v-model="form.ufDestino" outlined label="UF destino" maxlength="2" class="field-required" :readonly="!!editandoId" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.mva" outlined label="MVA %" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.aliquotaInterna" outlined label="Alíq. interna" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.aliquotaInterestadual" outlined label="Alíq. interestadual" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.aliquotaFcp" outlined label="Alíq. FCP" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-6">
                <q-input v-model="form.vigenciaInicio" outlined type="date" label="Vigência início" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-6">
                <q-input v-model="form.vigenciaFim" outlined type="date" label="Vigência fim" />
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
import { useMvaNcmUf } from 'composables/useMvaNcmUf';
import type { QTableColumn } from 'quasar';
import type { MvaNcmUfDto, MvaNcmUfFormModel } from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { itens, carregando, salvando, carregar, criar, editar } = useMvaNcmUf();
const dialog = ref(false);
const editandoId = ref<string | null>(null);
const form = ref<MvaNcmUfFormModel>({
  ncm: '',
  ufOrigem: '',
  ufDestino: '',
  mva: '',
  aliquotaInterna: '',
  aliquotaInterestadual: '',
  aliquotaFcp: '',
  vigenciaInicio: '',
  vigenciaFim: '',
});

const colunas: QTableColumn<MvaNcmUfDto>[] = [
  { name: 'ncm', label: 'NCM', field: 'ncm', align: 'left' },
  { name: 'ufOrigem', label: 'UF origem', field: 'ufOrigem', align: 'left' },
  { name: 'ufDestino', label: 'UF destino', field: 'ufDestino', align: 'left' },
  { name: 'mva', label: 'MVA', field: 'mva', align: 'right' },
  { name: 'aliquotaInterna', label: 'Interna', field: 'aliquotaInterna', align: 'right' },
  { name: 'aliquotaInterestadual', label: 'Interestadual', field: 'aliquotaInterestadual', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(item?: MvaNcmUfDto): void {
  editandoId.value = item?.id ?? null;
  form.value = {
    ncm: item?.ncm ?? '',
    ufOrigem: item?.ufOrigem ?? '',
    ufDestino: item?.ufDestino ?? '',
    mva: item ? String(item.mva) : '',
    aliquotaInterna: item ? String(item.aliquotaInterna) : '',
    aliquotaInterestadual: item ? String(item.aliquotaInterestadual) : '',
    aliquotaFcp: item ? String(item.aliquotaFcp) : '',
    vigenciaInicio: item?.vigenciaInicio ?? '',
    vigenciaFim: item?.vigenciaFim ?? '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, form.value)
    : await criar(form.value);
  if (ok) dialog.value = false;
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
