import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  ExportacaoFormato,
  type ExportacaoFormatoValor,
} from 'constants/enums';
import { relatorioService } from 'services/relatorio.service';
import type {
  AlertaGerencialDto,
  ComissaoRepasseItemDto,
  ComissoesRepasseParams,
  ContasFinanceirasDto,
  CurvaAbcLucratividadeItemDto,
  CurvaAbcLucratividadeParams,
  DesempenhoEquipeItemDto,
  DesempenhoEquipeParams,
  DespesaCentroCustoItemDto,
  DreDto,
  DreParams,
  GiroEstoqueItemDto,
  GiroEstoqueParams,
  InadimplenciaDto,
  MargemPorLoteItemDto,
  MargemPorLoteParams,
  RankingUnidadeItemDto,
  RankingUnidadesParams,
  RelatorioBarterDto,
  RentabilidadeItemDto,
  RentabilidadeParams,
} from 'types/dtos/relatorio.dto';
import { baixarArquivo } from 'utils/download';
import { ref } from 'vue';

export function useRelatorios() {
  const curvaAbc = ref<CurvaAbcLucratividadeItemDto[]>([]);
  const comissoes = ref<ComissaoRepasseItemDto[]>([]);
  const giroEstoque = ref<GiroEstoqueItemDto[]>([]);
  const margemPorLote = ref<MargemPorLoteItemDto[]>([]);
  const dre = ref<DreDto | null>(null);
  const rankingUnidades = ref<RankingUnidadeItemDto[]>([]);
  const rentabilidade = ref<RentabilidadeItemDto[]>([]);
  const inadimplencia = ref<InadimplenciaDto | null>(null);
  const desempenhoEquipe = ref<DesempenhoEquipeItemDto[]>([]);
  const alertas = ref<AlertaGerencialDto[]>([]);
  const barter = ref<RelatorioBarterDto | null>(null);
  const despesasCentroCusto = ref<DespesaCentroCustoItemDto[]>([]);
  const contasFinanceiras = ref<ContasFinanceirasDto | null>(null);
  const carregando = ref(false);
  const exportando = ref(false);
  const { erro, sucesso } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarCurvaAbc(params?: CurvaAbcLucratividadeParams): Promise<void> {
    carregando.value = true;
    try {
      curvaAbc.value = await relatorioService.curvaAbcLucratividade(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarComissoes(params?: ComissoesRepasseParams): Promise<void> {
    carregando.value = true;
    try {
      comissoes.value = await relatorioService.comissoesRepasse(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarGiroEstoque(params?: GiroEstoqueParams): Promise<void> {
    carregando.value = true;
    try {
      giroEstoque.value = await relatorioService.giroEstoque(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarMargemPorLote(params?: MargemPorLoteParams): Promise<void> {
    carregando.value = true;
    try {
      margemPorLote.value = await relatorioService.margemPorLote(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarDre(params?: DreParams): Promise<void> {
    carregando.value = true;
    try {
      dre.value = await relatorioService.dre(params);
    } catch (e) {
      dre.value = null;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarRankingUnidades(params?: RankingUnidadesParams): Promise<void> {
    carregando.value = true;
    try {
      rankingUnidades.value = await relatorioService.rankingUnidades(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarRentabilidade(params?: RentabilidadeParams): Promise<void> {
    carregando.value = true;
    try {
      rentabilidade.value = await relatorioService.rentabilidade(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarInadimplencia(): Promise<void> {
    carregando.value = true;
    try {
      inadimplencia.value = await relatorioService.inadimplencia();
    } catch (e) {
      inadimplencia.value = null;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarBarter(): Promise<void> {
    carregando.value = true;
    try {
      barter.value = await relatorioService.barter();
    } catch (e) {
      barter.value = null;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarDespesasCentroCusto(params?: {
    de?: string;
    ate?: string;
  }): Promise<void> {
    carregando.value = true;
    try {
      despesasCentroCusto.value = await relatorioService.despesasCentroCusto(params);
    } catch (e) {
      despesasCentroCusto.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarContasFinanceiras(): Promise<void> {
    carregando.value = true;
    try {
      contasFinanceiras.value = await relatorioService.contasFinanceiras();
    } catch (e) {
      contasFinanceiras.value = null;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarDesempenhoEquipe(params?: DesempenhoEquipeParams): Promise<void> {
    carregando.value = true;
    try {
      desempenhoEquipe.value = await relatorioService.desempenhoEquipe(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarAlertas(): Promise<void> {
    carregando.value = true;
    try {
      alertas.value = await relatorioService.alertas();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function baixarExportacao(
    nomeBase: string,
    formato: ExportacaoFormatoValor,
    fetchBlob: () => Promise<Blob>,
  ): Promise<boolean> {
    exportando.value = true;
    try {
      const blob = await fetchBlob();
      const extensao = formato === ExportacaoFormato.Excel ? 'xlsx' : 'pdf';
      baixarArquivo(blob, `${nomeBase}.${extensao}`);
      sucesso('Exportação concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      exportando.value = false;
    }
  }

  function exportarCurvaAbc(
    formato: ExportacaoFormatoValor,
    params?: Omit<CurvaAbcLucratividadeParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('curva-abc', formato, () =>
      relatorioService.exportarCurvaAbc(formato, params),
    );
  }

  function exportarComissoes(
    formato: ExportacaoFormatoValor,
    params?: Omit<ComissoesRepasseParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('comissoes-repasse', formato, () =>
      relatorioService.exportarComissoes(formato, params),
    );
  }

  function exportarGiroEstoque(
    formato: ExportacaoFormatoValor,
    params?: Omit<GiroEstoqueParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('giro-estoque', formato, () =>
      relatorioService.exportarGiroEstoque(formato, params),
    );
  }

  function exportarMargemPorLote(
    formato: ExportacaoFormatoValor,
    params?: Omit<MargemPorLoteParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('margem-por-lote', formato, () =>
      relatorioService.exportarMargemPorLote(formato, params),
    );
  }

  function exportarRankingUnidades(
    formato: ExportacaoFormatoValor,
    params?: Omit<RankingUnidadesParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('ranking-unidades', formato, () =>
      relatorioService.exportarRankingUnidades(formato, params),
    );
  }

  function exportarRentabilidade(
    formato: ExportacaoFormatoValor,
    params?: Omit<RentabilidadeParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('rentabilidade', formato, () =>
      relatorioService.exportarRentabilidade(formato, params),
    );
  }

  function exportarDesempenhoEquipe(
    formato: ExportacaoFormatoValor,
    params?: Omit<DesempenhoEquipeParams, 'exportar'>,
  ): Promise<boolean> {
    return baixarExportacao('desempenho-equipe', formato, () =>
      relatorioService.exportarDesempenhoEquipe(formato, params),
    );
  }

  return {
    curvaAbc,
    comissoes,
    giroEstoque,
    margemPorLote,
    dre,
    rankingUnidades,
    rentabilidade,
    inadimplencia,
    desempenhoEquipe,
    alertas,
    barter,
    despesasCentroCusto,
    contasFinanceiras,
    carregando,
    exportando,
    carregarCurvaAbc,
    carregarComissoes,
    carregarGiroEstoque,
    carregarMargemPorLote,
    carregarDre,
    carregarRankingUnidades,
    carregarRentabilidade,
    carregarInadimplencia,
    carregarBarter,
    carregarDespesasCentroCusto,
    carregarContasFinanceiras,
    carregarDesempenhoEquipe,
    carregarAlertas,
    exportarCurvaAbc,
    exportarComissoes,
    exportarGiroEstoque,
    exportarMargemPorLote,
    exportarRankingUnidades,
    exportarRentabilidade,
    exportarDesempenhoEquipe,
  };
}
