<template>
  <q-page class="agro-page">
    <app-page-header :titulo="`Apuração de ${nomeTributo}`" :subtitulo="subtitulo">
      <agro-btn
        v-if="fechada"
        flat
        icon="lock_open"
        label="Reabrir"
        descricao="Reabrir a apuração da competência"
        :loading="executando"
        @click="reabrir"
      />
      <agro-btn
        v-else
        color="primary"
        unelevated
        icon="lock"
        label="Fechar apuração"
        descricao="Fechar a apuração da competência"
        :loading="executando"
        :disable="!apuracao?.podeFechar"
        @click="fechar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar apuracao__barra">
          <q-input
            v-model="competencia"
            class="apuracao__campo"
            outlined
            mask="####-##"
            label="Competência (AAAA-MM)"
            @update:model-value="carregar"
          />
          <agro-badge
            v-if="apuracao"
            :label="fechada ? 'Fechada' : 'Aberta'"
            :variant="fechada ? 'success' : 'warning'"
          />
        </div>
      </agro-card>
    </section>

    <section v-if="carregando && !apuracao" class="agro-section">
      <agro-table-skeleton :colunas="4" />
    </section>

    <template v-if="apuracao">
      <section v-if="apuracao.pendencias.length > 0" class="agro-section">
        <apuracao-pendencias-list :pendencias="apuracao.pendencias" />
      </section>

      <section class="agro-section">
        <apuracao-totais-card :totais="apuracao.totais" />
      </section>

      <section v-if="!fechada" class="agro-section">
        <h2 class="apuracao__titulo">Documentos em revisão</h2>
        <apuracao-revisao-table
          :documentos="apuracao.documentosRevisao"
          :somente-leitura="fechada"
          @decidir="documentoEmDecisao = $event"
        />
      </section>

      <section class="agro-section">
        <h2 class="apuracao__titulo">Lançamentos</h2>
        <apuracao-lancamentos-table :lancamentos="apuracao.lancamentos" />
      </section>

      <section class="agro-section">
        <div class="apuracao__cabecalho">
          <h2 class="apuracao__titulo">Ajustes</h2>
          <agro-btn
            v-if="!fechada"
            color="primary"
            unelevated
            icon="add"
            label="Novo ajuste"
            descricao="Adicionar ajuste à apuração"
            @click="dialogAjuste = true"
          />
        </div>
        <apuracao-ajustes-table
          :ajustes="apuracao.ajustes"
          :somente-leitura="fechada"
          @remover="removerAjuste"
        />
      </section>
    </template>

    <decisao-apuracao-dialog
      :documento="documentoEmDecisao"
      :salvando="executando"
      @fechar="documentoEmDecisao = null"
      @submit="salvarDecisao"
    />
    <ajuste-apuracao-dialog
      v-model="dialogAjuste"
      :tributo="tributo"
      :salvando="executando"
      @submit="salvarAjuste"
    />
  </q-page>
</template>

<script setup lang="ts">
import AjusteApuracaoDialog from 'components/fiscal/AjusteApuracaoDialog.vue';
import ApuracaoAjustesTable from 'components/fiscal/ApuracaoAjustesTable.vue';
import ApuracaoLancamentosTable from 'components/fiscal/ApuracaoLancamentosTable.vue';
import ApuracaoPendenciasList from 'components/fiscal/ApuracaoPendenciasList.vue';
import ApuracaoRevisaoTable from 'components/fiscal/ApuracaoRevisaoTable.vue';
import ApuracaoTotaisCard from 'components/fiscal/ApuracaoTotaisCard.vue';
import DecisaoApuracaoDialog from 'components/fiscal/DecisaoApuracaoDialog.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import { useApuracaoFiscal } from 'composables/useApuracaoFiscal';
import type { TributoApuracaoValor } from 'constants/enums';
import type {
  AjusteApuracaoFormModel,
  DecisaoApuracaoFormModel,
  DocumentoRevisaoDto,
} from 'types/dtos/apuracao-fiscal.dto';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{ tributo: TributoApuracaoValor }>();

const {
  competencia,
  apuracao,
  fechada,
  carregando,
  executando,
  carregar,
  fechar,
  reabrir,
  decidir,
  adicionarAjuste,
  removerAjuste,
} = useApuracaoFiscal(props.tributo);

const documentoEmDecisao = ref<DocumentoRevisaoDto | null>(null);
const dialogAjuste = ref(false);

const nomeTributo = computed(() => props.tributo.toUpperCase());
const subtitulo = computed(
  () =>
    `Débitos, créditos, ajustes e saldo de ${nomeTributo.value} calculados sobre a escrituração da competência.`,
);

async function salvarDecisao(form: DecisaoApuracaoFormModel): Promise<void> {
  if (!documentoEmDecisao.value) return;
  if (await decidir(documentoEmDecisao.value.documentoEscrituradoId, form)) {
    documentoEmDecisao.value = null;
  }
}

async function salvarAjuste(form: AjusteApuracaoFormModel): Promise<void> {
  if (await adicionarAjuste(form)) {
    dialogAjuste.value = false;
  }
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.apuracao__barra {
  align-items: center;
}

.apuracao__campo {
  flex: 1 1 14rem;
  max-width: 20rem;
}

.apuracao__cabecalho {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.apuracao__titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-3);
}

.apuracao__cabecalho .apuracao__titulo {
  margin: 0;
}
</style>
