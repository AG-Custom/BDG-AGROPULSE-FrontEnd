<template>
  <agro-card class="produto-documentos">
    <template #header>
      <div class="produto-documentos__header">
        <h3 class="produto-documentos__titulo">Documentos</h3>
      </div>
    </template>

    <div v-if="!somenteLeitura" class="produto-documentos__upload row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="tipoUpload"
          outlined
          label="Tipo de documento"
          emit-value
          map-options
          :options="TipoDocumentoProdutoOpcoes"
        />
      </div>
      <div class="col-12 col-md-5">
        <q-file
          v-model="arquivoUpload"
          outlined
          label="Arquivo"
          clearable
          :disable="enviando"
        />
      </div>
      <div class="col-12 col-md-3 produto-documentos__upload-acao">
        <agro-btn
          color="primary"
          unelevated
          icon="upload"
          :label="produtoId ? 'Enviar' : 'Adicionar'"
          :descricao="produtoId ? 'Enviar documento do produto' : 'Adicionar documento ao cadastro'"
          :loading="enviando"
          :disable="!arquivoUpload"
          @click="enviarDocumento"
        />
      </div>
    </div>

    <empty-state
      v-if="documentosInternos.length === 0"
      titulo="Nenhum documento cadastrado"
      descricao="Envie FISPQ, ficha técnica ou outros documentos."
      icon="description"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="produto-documentos__tabela"
      :rows="documentosInternos"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-tipo="cell">
        <q-td :props="cell">
          {{ rotuloTipo(cell.row.tipo) }}
        </q-td>
      </template>

      <template #body-cell-tamanhoBytes="cell">
        <q-td :props="cell">
          {{ formatarTamanhoArquivo(cell.row.tamanhoBytes) }}
        </q-td>
      </template>

      <template #body-cell-urlPublica="cell">
        <q-td :props="cell">
          <a
            v-if="urlPublica(cell.row)"
            :href="urlPublica(cell.row)!"
            target="_blank"
            rel="noopener noreferrer"
            class="produto-documentos__link"
          >
            Abrir
          </a>
          <span v-else class="text-secondary">Pendente</span>
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="cell">
        <q-td :props="cell" class="produto-documentos__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-editar="false"
            :mostrar-status="false"
            mostrar-excluir
            :loading-excluir="removendoId === cell.row.id"
            :disable="removendo"
            excluir-label="Remover documento"
            @excluir="solicitarRemocao(cell.row)"
          />
        </q-td>
      </template>
    </q-table>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { TipoDocumentoProduto, TipoDocumentoProdutoOpcoes } from 'constants/enums';
import type { TipoDocumentoProdutoValor } from 'constants/enums';
import { useProdutoDocumentos } from 'composables/useProdutoDocumentos';
import type { ProdutoDocumentoListaItem } from 'types/dtos/produto.dto';
import { formatarTamanhoArquivo } from 'utils/mappers/produto.mapper';
import type { QTableColumn } from 'quasar';
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps<{
  produtoId?: string;
  somenteLeitura?: boolean;
}>();

const documentos = defineModel<ProdutoDocumentoListaItem[]>('documentos', { required: true });

const {
  enviando,
  removendo,
  removendoId,
  definirDocumentos,
  enviar,
  solicitarRemocao,
  documentos: documentosInternos,
} = useProdutoDocumentos(() => props.produtoId);

const tipoUpload = ref<TipoDocumentoProdutoValor>(TipoDocumentoProduto.Fispq);
const arquivoUpload = ref<File | null>(null);
const sincronizando = ref(false);

const colunas = computed(() => {
  const base: QTableColumn<ProdutoDocumentoListaItem>[] = [
  { name: 'nomeOriginal', label: 'Arquivo', field: 'nomeOriginal', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'tamanhoBytes', label: 'Tamanho', field: 'tamanhoBytes', align: 'left' },
  { name: 'urlPublica', label: 'Link', field: 'id', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }
  return base;
});

watch(
  documentos,
  (lista) => {
    if (sincronizando.value) {
      return;
    }

    definirDocumentos(lista);
  },
  { immediate: true },
);

watch(
  documentosInternos,
  async (lista) => {
    sincronizando.value = true;
    documentos.value = [...lista];
    await nextTick();
    sincronizando.value = false;
  },
);

function rotuloTipo(tipo: TipoDocumentoProdutoValor): string {
  return TipoDocumentoProdutoOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

function urlPublica(item: ProdutoDocumentoListaItem): string | null {
  return 'urlPublica' in item ? item.urlPublica : null;
}

async function enviarDocumento(): Promise<void> {
  if (!arquivoUpload.value) {
    return;
  }

  const sucesso = await enviar(tipoUpload.value, arquivoUpload.value);

  if (sucesso) {
    arquivoUpload.value = null;
  }
}
</script>

<style scoped>
.produto-documentos__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.produto-documentos__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.produto-documentos__upload {
  margin-bottom: var(--spacing-4);
}

.produto-documentos__upload-acao {
  align-items: flex-end;
  display: flex;
}

.produto-documentos__link {
  color: var(--color-primary-500);
  text-decoration: none;
}

.produto-documentos__acoes {
  white-space: nowrap;
}
</style>
