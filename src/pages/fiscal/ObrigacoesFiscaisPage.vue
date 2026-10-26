<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Obrigações fiscais"
      subtitulo="Geração dos arquivos fiscais a partir da escrituração da competência."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar obrigacoes__barra">
          <q-input
            v-model="competencia"
            class="obrigacoes__campo"
            outlined
            mask="####-##"
            label="Competência (AAAA-MM)"
          />
          <q-select
            v-model="finalidade"
            class="obrigacoes__campo"
            outlined
            emit-value
            map-options
            label="Finalidade"
            :options="FinalidadeArquivoFiscalOpcoes"
          />
          <agro-btn
            v-for="obrigacao in obrigacoes"
            :key="obrigacao.tipo"
            color="primary"
            unelevated
            icon="description"
            :label="obrigacao.label"
            :descricao="obrigacao.descricao"
            :loading="gerando === obrigacao.tipo"
            :disable="!competenciaValida || gerando !== null"
            @click="gerar(obrigacao.tipo)"
          />
          <agro-btn
            flat
            icon="tune"
            label="Perfil EFD"
            descricao="Configurar o perfil EFD ICMS/IPI do estabelecimento"
            @click="perfilAberto = true"
          />
        </div>
      </agro-card>
    </section>

    <section v-if="pendencias.length > 0" class="agro-section">
      <pendencias-geracao-list :pendencias="pendencias" />
    </section>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && arquivos.length === 0" :colunas="7" />
        <arquivos-fiscais-table
          v-else
          :arquivos="arquivos"
          :carregando="carregando"
          @baixar="baixar"
        />
      </agro-card>
    </section>

    <perfil-efd-dialog
      v-model="perfilAberto"
      :perfil="perfilEfd"
      :salvando="salvandoPerfil"
      @submit="salvarPerfil"
    />
  </q-page>
</template>

<script setup lang="ts">
import ArquivosFiscaisTable from 'components/fiscal/ArquivosFiscaisTable.vue';
import PendenciasGeracaoList from 'components/fiscal/PendenciasGeracaoList.vue';
import PerfilContribuicoesDialog from 'components/fiscal/PerfilContribuicoesDialog.vue';
import PerfilEfdDialog from 'components/fiscal/PerfilEfdDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import { useObrigacoesFiscais } from 'composables/useObrigacoesFiscais';
import { FinalidadeArquivoFiscalOpcoes, TipoArquivoFiscal } from 'constants/enums';
import type { TipoArquivoFiscalValor } from 'constants/enums';
import type { PerfilContribuicoesDto, PerfilEfdFormModel } from 'types/dtos/obrigacao-fiscal.dto';
import { onMounted, ref } from 'vue';

const {
  competencia,
  competenciaValida,
  finalidade,
  arquivos,
  pendencias,
  carregando,
  gerando,
  perfilEfd,
  salvandoPerfil,
  perfilContribuicoes,
  salvandoPerfilContribuicoes,
  carregarArquivos,
  carregarPerfilEfd,
  salvarPerfilEfd,
  carregarPerfilContribuicoes,
  salvarPerfilContribuicoes,
  gerar,
  baixar,
} = useObrigacoesFiscais();

const obrigacoes: { tipo: TipoArquivoFiscalValor; label: string; descricao: string }[] = [
  {
    tipo: TipoArquivoFiscal.Sintegra,
    label: 'Gerar SINTEGRA',
    descricao: 'Gerar o arquivo SINTEGRA da competência a partir da escrituração',
  },
  {
    tipo: TipoArquivoFiscal.EfdIcmsIpi,
    label: 'Gerar EFD ICMS/IPI',
    descricao: 'Gerar o arquivo EFD ICMS/IPI da competência a partir da escrituração e das apurações',
  },
  {
    tipo: TipoArquivoFiscal.EfdContribuicoes,
    label: 'Gerar EFD-Contribuições',
    descricao: 'Gerar o arquivo EFD-Contribuições (PIS/COFINS) da competência a partir da escrituração',
  },
];

const perfilAberto = ref(false);
const perfilContribuicoesAberto = ref(false);

async function salvarPerfil(form: PerfilEfdFormModel): Promise<void> {
  if (await salvarPerfilEfd(form)) perfilAberto.value = false;
}

async function salvarPerfilContrib(form: PerfilContribuicoesDto): Promise<void> {
  if (await salvarPerfilContribuicoes(form)) perfilContribuicoesAberto.value = false;
}

onMounted(() => {
  void carregarArquivos();
  void carregarPerfilEfd();
  void carregarPerfilContribuicoes();
});
</script>

<style scoped>
.obrigacoes__barra {
  align-items: flex-end;
}

.obrigacoes__campo {
  flex: 1 1 14rem;
  max-width: 20rem;
}
</style>
