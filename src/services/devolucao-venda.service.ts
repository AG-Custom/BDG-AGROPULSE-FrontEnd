import { api } from 'services/api';
import type {
  BuscarOrigemDevolucaoParams,
  CriarDevolucaoVendaPayload,
  DevolucaoVendaDto,
  ListarDevolucoesVendaParams,
  OrigemDevolucaoDto,
} from 'types/dtos/devolucao-venda.dto';

export const devolucaoVendaService = {
  listar(params?: ListarDevolucoesVendaParams): Promise<DevolucaoVendaDto[]> {
    return api
      .get<DevolucaoVendaDto[]>('/devolucoes-venda', { params })
      .then((r) => r.data);
  },

  obter(id: string): Promise<DevolucaoVendaDto> {
    return api.get<DevolucaoVendaDto>(`/devolucoes-venda/${id}`).then((r) => r.data);
  },

  buscarOrigem(params: BuscarOrigemDevolucaoParams): Promise<OrigemDevolucaoDto> {
    return api
      .get<OrigemDevolucaoDto>('/devolucoes-venda/origem', { params })
      .then((r) => r.data);
  },

  criar(payload: CriarDevolucaoVendaPayload): Promise<DevolucaoVendaDto> {
    return api
      .post<DevolucaoVendaDto>('/devolucoes-venda', payload)
      .then((r) => r.data);
  },

  processar(id: string): Promise<DevolucaoVendaDto> {
    return api
      .post<DevolucaoVendaDto>(`/devolucoes-venda/${id}/processar`)
      .then((r) => r.data);
  },
};
