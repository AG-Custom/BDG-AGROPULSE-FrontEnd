import { api } from 'services/api';
import type {
  ComissaoRepasseItemDto,
  ComissoesRepasseParams,
  CurvaAbcLucratividadeItemDto,
  CurvaAbcLucratividadeParams,
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
};
