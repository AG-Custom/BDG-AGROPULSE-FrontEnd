import { api } from 'services/api';
import type { PedidoFilaAprovacaoDto } from 'types/dtos/aprovacao.dto';

export const aprovacaoService = {
  listar(): Promise<PedidoFilaAprovacaoDto[]> {
    return api.get<PedidoFilaAprovacaoDto[]>('/aprovacoes').then((r) => r.data);
  },
};
