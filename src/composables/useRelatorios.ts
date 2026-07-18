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
  CurvaAbcLucratividadeItemDto,
  CurvaAbcLucratividadeParams,
  DesempenhoEquipeItemDto,
  DesempenhoEquipeParams,
  DreDto,
  DreParams,
  GiroEstoqueItemDto,
  GiroEstoqueParams,
  InadimplenciaDto,
  MargemPorLoteItemDto,
  MargemPorLoteParams,
  PowerBiStubDto,
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
  const rentabilidade = ref<RentabilidadeItemDto[]>([]);
  const inadimplencia = ref<InadimplenciaDto | null>(null);
  const desempenhoEquipe = ref<DesempenhoEquipeItemDto[]>([]);
  const alertas = ref<AlertaGerencialDto[]>([]);
  const powerBi = ref<PowerBiStubDto | null>(null);
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

  async function carregarPowerBi(): Promise<void> {
    carregando.value = true;
    try {
      powerBi.value = await relatorioService.powerBi();
    } catch (e) {
      powerBi.value = null;
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
    rentabilidade,
    inadimplencia,
    desempenhoEquipe,
    alertas,
    powerBi,
    carregando,
    exportando,
    carregarCurvaAbc,
    carregarComissoes,
    carregarGiroEstoque,
    carregarMargemPorLote,
    carregarDre,
    carregarRentabilidade,
    carregarInadimplencia,
    carregarDesempenhoEquipe,
    carregarAlertas,
    carregarPowerBi,
    exportarCurvaAbc,
    exportarComissoes,
    exportarGiroEstoque,
    exportarMargemPorLote,
    exportarRentabilidade,
    exportarDesempenhoEquipe,
  };
}
