import { api } from 'services/api';
import type {
  ListarPdvVendasParams,
  PdvVendaDto,
  PdvVendaResumoDto,
  VenderPdvPayload,
} from 'types/dtos/pdv.dto';

export const pdvService = {
  vender(payload: VenderPdvPayload): Promise<PdvVendaDto> {
    return api.post<PdvVendaDto>('/pdv/vender', payload).then((r) => r.data);
  },

  listarVendas(params?: ListarPdvVendasParams): Promise<PdvVendaResumoDto[]> {
    return api
      .get<PdvVendaResumoDto[]>('/pdv/vendas', { params })
      .then((r) => r.data);
  },

  obterVenda(id: string): Promise<PdvVendaDto> {
    return api.get<PdvVendaDto>(`/pdv/vendas/${id}`).then((r) => r.data);
  },

  cancelar(id: string): Promise<PdvVendaDto> {
    return api.post<PdvVendaDto>(`/pdv/${id}/cancelar`).then((r) => r.data);
  },
};
