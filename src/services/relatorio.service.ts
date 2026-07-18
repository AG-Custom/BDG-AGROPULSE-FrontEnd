import type { ExportacaoFormatoValor } from 'constants/enums';
import { api } from 'services/api';
import type {
  AlertaGerencialDto,
  ComissaoRepasseItemDto,
  ComissoesRepasseParams,
  CurvaAbcLucratividadeItemDto,
  CurvaAbcLucratividadeParams,
  DashboardKpisDto,
  DashboardParams,
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
  RankingUnidadeItemDto,
  RankingUnidadesParams,
  RentabilidadeItemDto,
  RentabilidadeParams,
} from 'types/dtos/relatorio.dto';

function exportarBlob(
  path: string,
  formato: ExportacaoFormatoValor,
  params?: Record<string, unknown>,
): Promise<Blob> {
  return api
    .get<Blob>(path, {
      params: { ...params, exportar: formato },
      responseType: 'blob',
    })
    .then((r) => r.data);
}

export const relatorioService = {
  curvaAbcLucratividade(
    params?: CurvaAbcLucratividadeParams,
  ): Promise<CurvaAbcLucratividadeItemDto[]> {
    return api
      .get<CurvaAbcLucratividadeItemDto[]>('/relatorios/curva-abc-lucratividade', {
        params,
      })
      .then((r) => r.data);
  },

  exportarCurvaAbc(
    formato: ExportacaoFormatoValor,
    params?: Omit<CurvaAbcLucratividadeParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/curva-abc-lucratividade', formato, params);
  },

  comissoesRepasse(params?: ComissoesRepasseParams): Promise<ComissaoRepasseItemDto[]> {
    return api
      .get<ComissaoRepasseItemDto[]>('/relatorios/comissoes-repasse', { params })
      .then((r) => r.data);
  },

  exportarComissoes(
    formato: ExportacaoFormatoValor,
    params?: Omit<ComissoesRepasseParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/comissoes-repasse', formato, params);
  },

  giroEstoque(params?: GiroEstoqueParams): Promise<GiroEstoqueItemDto[]> {
    return api
      .get<GiroEstoqueItemDto[]>('/relatorios/giro-estoque', { params })
      .then((r) => r.data);
  },

  exportarGiroEstoque(
    formato: ExportacaoFormatoValor,
    params?: Omit<GiroEstoqueParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/giro-estoque', formato, params);
  },

  dashboard(params?: DashboardParams): Promise<DashboardKpisDto> {
    return api
      .get<DashboardKpisDto>('/relatorios/dashboard', { params })
      .then((r) => r.data);
  },

  margemPorLote(params?: MargemPorLoteParams): Promise<MargemPorLoteItemDto[]> {
    return api
      .get<MargemPorLoteItemDto[]>('/relatorios/margem-por-lote', { params })
      .then((r) => r.data);
  },

  exportarMargemPorLote(
    formato: ExportacaoFormatoValor,
    params?: Omit<MargemPorLoteParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/margem-por-lote', formato, params);
  },

  dre(params?: DreParams): Promise<DreDto> {
    return api.get<DreDto>('/relatorios/dre', { params }).then((r) => r.data);
  },

  rankingUnidades(params?: RankingUnidadesParams): Promise<RankingUnidadeItemDto[]> {
    return api
      .get<RankingUnidadeItemDto[]>('/relatorios/ranking-unidades', { params })
      .then((r) => r.data);
  },

  exportarRankingUnidades(
    formato: ExportacaoFormatoValor,
    params?: Omit<RankingUnidadesParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/ranking-unidades', formato, params);
  },

  rentabilidade(params?: RentabilidadeParams): Promise<RentabilidadeItemDto[]> {
    return api
      .get<RentabilidadeItemDto[]>('/relatorios/rentabilidade', { params })
      .then((r) => r.data);
  },

  exportarRentabilidade(
    formato: ExportacaoFormatoValor,
    params?: Omit<RentabilidadeParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/rentabilidade', formato, params);
  },

  inadimplencia(): Promise<InadimplenciaDto> {
    return api.get<InadimplenciaDto>('/relatorios/inadimplencia').then((r) => r.data);
  },

  desempenhoEquipe(params?: DesempenhoEquipeParams): Promise<DesempenhoEquipeItemDto[]> {
    return api
      .get<DesempenhoEquipeItemDto[]>('/relatorios/desempenho-equipe', { params })
      .then((r) => r.data);
  },

  exportarDesempenhoEquipe(
    formato: ExportacaoFormatoValor,
    params?: Omit<DesempenhoEquipeParams, 'exportar'>,
  ): Promise<Blob> {
    return exportarBlob('/relatorios/desempenho-equipe', formato, params);
  },

  alertas(): Promise<AlertaGerencialDto[]> {
    return api.get<AlertaGerencialDto[]>('/relatorios/alertas').then((r) => r.data);
  },

  powerBi(): Promise<PowerBiStubDto> {
    return api.get<PowerBiStubDto>('/relatorios/power-bi').then((r) => r.data);
  },
};
