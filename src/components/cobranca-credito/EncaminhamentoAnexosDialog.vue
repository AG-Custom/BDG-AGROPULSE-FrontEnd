<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Anexos jurídicos</h4>
        <p v-if="clienteLabel" class="subtitulo">{{ clienteLabel }}</p>
      </q-card-section>
      <q-card-section>
        <div class="upload-bar">
          <q-file
            v-model="arquivoUpload"
            outlined
            label="Arquivo"
            clearable
            class="upload-bar__file"
            :disable="salvando"
          />
          <agro-btn
            color="primary"
            unelevated
            icon="upload"
            label="Enviar"
            descricao="Enviar anexo jurídico"
            :loading="salvando"
            :disable="!arquivoUpload || !encaminhamentoId"
            @click="enviar"
          />
        </div>

        <empty-state
          v-if="anexos.length === 0"
          titulo="Nenhum anexo"
          descricao="Envie contratos, procurações ou demais documentos do processo."
          icon="attach_file"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          hide-pagination
          :rows="anexos"
          :columns="colunas"
          :pagination="{ rowsPerPage: 0 }"
        >
          <template #body-cell-tamanhoBytes="cell">
            <q-td :props="cell" class="text-metric">
              {{ formatarTamanhoArquivo(cell.row.tamanhoBytes) }}
            </q-td>
          </template>
          <template #body-cell-urlPublica="cell">
            <q-td :props="cell">
              <a
                v-if="cell.row.urlPublica"
                :href="cell.row.urlPublica"
                target="_blank"
                rel="noopener noreferrer"
                class="link-anexo"
              >
                Abrir
              </a>
              <span v-else class="text-secondary">Sem URL</span>
            </q-td>
          </template>
          <template #body-cell-acoes="cell">
            <q-td :props="cell">
              <agro-acoes-menu
                :mostrar-visualizar="false"
                :mostrar-editar="false"
                :mostrar-status="false"
                mostrar-excluir
                :loading-excluir="salvando"
                excluir-label="Remover anexo"
                @excluir="emit('remover', cell.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section class="agro-form-actions">
        <agro-btn flat label="Fechar" descricao="Fechar anexos" @click="emit('update:modelValue', false)" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { EncaminhamentoJuridicoAnexoDto } from 'types/dtos/cobranca-credito.dto';
import { formatarTamanhoArquivo } from 'utils/mappers/produto.mapper';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  encaminhamentoId: string | null;
  clienteLabel?: string;
  anexos: EncaminhamentoJuridicoAnexoDto[];
  salvando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  enviar: [arquivo: File];
  remover: [anexo: EncaminhamentoJuridicoAnexoDto];
}>();

const arquivoUpload = ref<File | null>(null);

const colunas: QTableColumn<EncaminhamentoJuridicoAnexoDto>[] = [
  { name: 'nomeOriginal', label: 'Arquivo', field: 'nomeOriginal', align: 'left' },
  { name: 'contentType', label: 'Tipo', field: 'contentType', align: 'left' },
  { name: 'tamanhoBytes', label: 'Tamanho', field: 'tamanhoBytes', align: 'right' },
  { name: 'urlPublica', label: 'Download', field: 'urlPublica', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

watch(
  () => props.modelValue,
  (aberto) => {
    if (!aberto) arquivoUpload.value = null;
  },
);

function enviar(): void {
  if (!arquivoUpload.value) return;
  emit('enviar', arquivoUpload.value);
  arquivoUpload.value = null;
}
</script>

<style scoped>
.dialog {
  min-width: min(640px, 94vw);
}

.titulo {
  margin: 0;
}

.subtitulo {
  margin: var(--spacing-1) 0 0;
  color: var(--color-text-secondary);
}

.upload-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
}

.upload-bar__file {
  flex: 1 1 240px;
}

.link-anexo {
  color: var(--color-primary-500);
  text-decoration: none;
}

.link-anexo:hover {
  text-decoration: underline;
}
</style>
