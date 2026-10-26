<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Livro fiscal"
      subtitulo="Escrituração fiscal normalizada por competência, com pendências do que o documento não informa."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="sync"
        label="Reprocessar competência"
        descricao="Reinterpretar as notas fiscais da competência"
        :loading="reprocessando"
        :disable="!competenciaValida"
        @click="reprocessar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar livro-fiscal__barra">
          <q-input
            v-model="competencia"
            class="livro-fiscal__campo"
            outlined
            mask="####-##"
            label="Competência (AAAA-MM)"
            @update:model-value="carregar"
          />
          <q-select
            v-model="direcao"
            class="livro-fiscal__campo"
            outlined
            emit-value
            map-options
            clearable
            label="Tipo de operação"
            :options="direcoes"
            @update:model-value="carregar"
          />
        </div>
      </agro-card>
    </section>

    <section v-if="livro" class="agro-section">
      <livro-fiscal-totais :entradas="livro.entradas" :saidas="livro.saidas" />
      <q-banner v-if="livro.pendenciasBloqueantes > 0" class="livro-fiscal__banner" rounded>
        {{ livro.pendenciasBloqueantes }} pendência(s) bloqueante(s) impedem a geração de apurações e arquivos desta competência.
      </q-banner>
    </section>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && !livro" :colunas="8" />
        <livro-fiscal-table
          v-else
          :documentos="livro?.documentos ?? []"
          :carregando="carregando"
          @abrir="abrirDocumento"
        />
      </agro-card>
    </section>

    <documento-escriturado-dialog :detalhe="detalhe" @fechar="fecharDocumento" />
  </q-page>
</template>

<script setup lang="ts">
import DocumentoEscrituradoDialog from 'components/fiscal/DocumentoEscrituradoDialog.vue';
import LivroFiscalTable from 'components/fiscal/LivroFiscalTable.vue';
import LivroFiscalTotais from 'components/fiscal/LivroFiscalTotais.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import { useLivroFiscal } from 'composables/useLivroFiscal';
import type { DirecaoEscrituracao } from 'types/dtos/escrituracao.dto';
import { onMounted } from 'vue';

const {
  competencia,
  competenciaValida,
  direcao,
  livro,
  detalhe,
  carregando,
  reprocessando,
  carregar,
  reprocessar,
  abrirDocumento,
  fecharDocumento,
} = useLivroFiscal();

const direcoes: { label: string; value: DirecaoEscrituracao }[] = [
  { label: 'Entradas', value: 'Entrada' },
  { label: 'Saídas', value: 'Saida' },
];

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.livro-fiscal__barra {
  align-items: flex-end;
}

.livro-fiscal__campo {
  flex: 1 1 14rem;
  max-width: 20rem;
}

.livro-fiscal__banner {
  background: var(--color-warning-50);
  color: var(--color-text-primary);
  margin-top: var(--spacing-4);
}
</style>
