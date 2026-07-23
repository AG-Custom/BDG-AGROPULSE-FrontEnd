<template>
  <q-page class="agro-page">
    <app-page-header titulo="PIS/COFINS por NCM" subtitulo="Regras de alíquota e suspensão por NCM.">
      <agro-btn color="primary" unelevated icon="add" label="Nova regra" descricao="Cadastrar regra" @click="abrirDialog()" />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && itens.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && itens.length === 0"
          titulo="Nenhuma regra"
          descricao="Cadastre PIS/COFINS por NCM."
          icon="percent"
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
          <template #body-cell-aliquotaPis="props">
            <q-td :props="props" class="text-metric">{{ props.row.aliquotaPis }}%</q-td>
          </template>
          <template #body-cell-aliquotaCofins="props">
            <q-td :props="props" class="text-metric">{{ props.row.aliquotaCofins }}%</q-td>
          </template>
          <template #body-cell-suspenso="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.suspenso ? 'Suspenso' : 'Ativo'"
                :variant="props.row.suspenso ? 'warning' : 'success'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-visualizar="false"
                :mostrar-status="false"
                @editar="abrirDialog(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar regra' : 'Nova regra PIS/COFINS' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input v-model="form.ncm" outlined label="NCM" class="field-required" :readonly="!!editandoId" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-4">
                <q-input v-model="form.cstPis" outlined label="CST PIS" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-4">
                <q-input v-model="form.cstCofins" outlined label="CST COFINS" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.aliquotaPis" outlined label="Alíquota PIS" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.aliquotaCofins" outlined label="Alíquota COFINS" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.vigenciaInicio" outlined type="date" label="Vigência início" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="form.vigenciaFim" outlined type="date" label="Vigência fim" />
              </div>
              <div class="col-12">
                <q-toggle v-model="form.suspenso" label="Suspenso" />
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
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useNcmPisCofins } from 'composables/useNcmPisCofins';
import type { QTableColumn } from 'quasar';
import type { NcmPisCofinsDto, NcmPisCofinsFormModel } from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { itens, carregando, salvando, carregar, criar, editar } = useNcmPisCofins();
const dialog = ref(false);
const editandoId = ref<string | null>(null);
const form = ref<NcmPisCofinsFormModel>({
  ncm: '',
  cstPis: '',
  cstCofins: '',
  aliquotaPis: '',
  aliquotaCofins: '',
  suspenso: false,
  vigenciaInicio: '',
  vigenciaFim: '',
});

const colunas: QTableColumn<NcmPisCofinsDto>[] = [
  { name: 'ncm', label: 'NCM', field: 'ncm', align: 'left' },
  { name: 'cstPis', label: 'CST PIS', field: 'cstPis', align: 'left' },
  { name: 'cstCofins', label: 'CST COFINS', field: 'cstCofins', align: 'left' },
  { name: 'aliquotaPis', label: 'PIS %', field: 'aliquotaPis', align: 'right' },
  { name: 'aliquotaCofins', label: 'COFINS %', field: 'aliquotaCofins', align: 'right' },
  { name: 'suspenso', label: 'Status', field: 'suspenso', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(item?: NcmPisCofinsDto): void {
  editandoId.value = item?.id ?? null;
  form.value = {
    ncm: item?.ncm ?? '',
    cstPis: item?.cstPis ?? '',
    cstCofins: item?.cstCofins ?? '',
    aliquotaPis: item ? String(item.aliquotaPis) : '',
    aliquotaCofins: item ? String(item.aliquotaCofins) : '',
    suspenso: item?.suspenso ?? false,
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
