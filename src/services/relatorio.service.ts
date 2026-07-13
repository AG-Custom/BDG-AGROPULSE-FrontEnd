import { api } from 'services/api';
import type {
  ComissaoRepasseItemDto,
  ComissoesRepasseParams,
  CurvaAbcLucratividadeItemDto,
  CurvaAbcLucratividadeParams,
  GiroEstoqueItemDto,
  GiroEstoqueParams,
} from 'types/dtos/relatorio.dto';

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

  comissoesRepasse(params?: ComissoesRepasseParams): Promise<ComissaoRepasseItemDto[]> {
    return api
      .get<ComissaoRepasseItemDto[]>('/relatorios/comissoes-repasse', { params })
      .then((r) => r.data);
  },

  giroEstoque(params?: GiroEstoqueParams): Promise<GiroEstoqueItemDto[]> {
    return api
      .get<GiroEstoqueItemDto[]>('/relatorios/giro-estoque', { params })
      .then((r) => r.data);
  },
};
