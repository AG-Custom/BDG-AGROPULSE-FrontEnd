<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Obrigações fiscais"
      subtitulo="Geração dos arquivos fiscais a partir da escrituração da competência."
    />

    <section class="agro-section">
      <h2 class="obrigacoes__passo"><span class="obrigacoes__numero">1</span>Escolha o período</h2>
      <agro-card>
        <div class="agro-filter-bar obrigacoes__barra">
          <q-input
            v-model="competencia"
            class="obrigacoes__campo"
            outlined
            mask="####-##"
            label="Competência (AAAA-MM)"
            hint="Mês de referência dos documentos"
          />
          <q-select
            v-model="finalidade"
            class="obrigacoes__campo"
            outlined
            emit-value
            map-options
            label="Finalidade"
            hint="Normal, substituto ou retificador"
            :options="FinalidadeArquivoFiscalOpcoes"
          />
        </div>
      </agro-card>
    </section>

    <section class="agro-section">
      <h2 class="obrigacoes__passo"><span class="obrigacoes__numero">2</span>Gere o arquivo fiscal</h2>
      <div class="obrigacoes__grade">
        <obrigacao-geracao-card
          v-for="obrigacao in obrigacoes"
          :key="obrigacao.tipo"
          :titulo="obrigacao.titulo"
          :descricao="obrigacao.descricao"
          :tem-perfil="obrigacao.perfil !== null"
          :perfil-configurado="obrigacao.perfil === 'efd' ? perfilEfd !== null : perfilContribuicoes !== null"
          :gerando="gerando === obrigacao.tipo"
          :desabilitado="!competenciaValida || gerando !== null"
          @gerar="gerar(obrigacao.tipo)"
          @configurar-perfil="abrirPerfil(obrigacao.perfil)"
        />
      </div>
    </section>

    <section v-if="pendencias.length > 0" class="agro-section">
      <pendencias-geracao-list :pendencias="pendencias" />
    </section>

    <section class="agro-section">
      <h2 class="obrigacoes__passo"><span class="obrigacoes__numero">3</span>Baixe os arquivos gerados</h2>
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
    <perfil-contribuicoes-dialog
      v-model="perfilContribuicoesAberto"
      :perfil="perfilContribuicoes"
      :salvando="salvandoPerfilContribuicoes"
      @submit="salvarPerfilContrib"
    />
  </q-page>
</template>

<script setup lang="ts">
import ArquivosFiscaisTable from 'components/fiscal/ArquivosFiscaisTable.vue';
import ObrigacaoGeracaoCard from 'components/fiscal/ObrigacaoGeracaoCard.vue';
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

type PerfilObrigacao = 'efd' | 'contribuicoes' | null;

const obrigacoes: {
  tipo: TipoArquivoFiscalValor;
  titulo: string;
  descricao: string;
  perfil: PerfilObrigacao;
}[] = [
  {
    tipo: TipoArquivoFiscal.Sintegra,
    titulo: 'SINTEGRA',
    descricao: 'Informações de ICMS para a SEFAZ estadual, geradas a partir da escrituração da competência.',
    perfil: null,
  },
  {
    tipo: TipoArquivoFiscal.EfdIcmsIpi,
    titulo: 'EFD ICMS/IPI',
    descricao: 'Escrituração fiscal digital de ICMS e IPI, a partir da escrituração e das apurações fechadas.',
    perfil: 'efd',
  },
  {
    tipo: TipoArquivoFiscal.EfdContribuicoes,
    titulo: 'EFD-Contribuições',
    descricao: 'Escrituração de PIS e COFINS da competência, a partir da escrituração fiscal.',
    perfil: 'contribuicoes',
  },
];

const perfilAberto = ref(false);
const perfilContribuicoesAberto = ref(false);

function abrirPerfil(perfil: PerfilObrigacao): void {
  if (perfil === 'efd') perfilAberto.value = true;
  if (perfil === 'contribuicoes') perfilContribuicoesAberto.value = true;
}

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

.obrigacoes__passo {
  align-items: center;
  color: var(--color-text-primary);
  display: flex;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  gap: var(--spacing-3);
  margin: 0 0 var(--spacing-3);
}

.obrigacoes__numero {
  align-items: center;
  background: var(--color-primary-600);
  border-radius: var(--radius-full);
  color: var(--color-text-inverse);
  display: inline-flex;
  font-size: var(--font-size-sm);
  height: var(--spacing-6);
  justify-content: center;
  width: var(--spacing-6);
}

.obrigacoes__grade {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}
</style>
