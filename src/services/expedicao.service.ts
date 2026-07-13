import { api } from 'services/api';
import type { ExpedicaoPedidoDto, RomaneioDto } from 'types/dtos/expedicao.dto';

export const expedicaoService = {
  listar(): Promise<ExpedicaoPedidoDto[]> {
    return api.get<ExpedicaoPedidoDto[]>('/expedicao').then((r) => r.data);
  },

  obterRomaneio(pedidoId: string): Promise<RomaneioDto> {
    return api
      .get<RomaneioDto>(`/expedicao/${pedidoId}/romaneio`)
      .then((r) => r.data);
  },
};
