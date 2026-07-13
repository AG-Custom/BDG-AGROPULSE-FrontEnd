import { api } from 'services/api';
import type {
  ConverterOrcamentoPayload,
  CriarOrcamentoPayload,
  EditarOrcamentoPayload,
  ListarOrcamentosParams,
  OrcamentoDto,
  OrcamentoResumoDto,
} from 'types/dtos/orcamento.dto';
import type { PedidoVendaDto } from 'types/dtos/pedido-venda.dto';

export const orcamentoService = {
  listar(params?: ListarOrcamentosParams): Promise<OrcamentoResumoDto[]> {
    return api
      .get<OrcamentoResumoDto[]>('/orcamentos', { params })
      .then((r) => r.data);
  },

  obter(id: string): Promise<OrcamentoDto> {
    return api.get<OrcamentoDto>(`/orcamentos/${id}`).then((r) => r.data);
  },

  criar(payload: CriarOrcamentoPayload): Promise<OrcamentoDto> {
    return api.post<OrcamentoDto>('/orcamentos', payload).then((r) => r.data);
  },

  editar(id: string, payload: EditarOrcamentoPayload): Promise<OrcamentoDto> {
    return api.put<OrcamentoDto>(`/orcamentos/${id}`, payload).then((r) => r.data);
  },

  cancelar(id: string): Promise<void> {
    return api.post(`/orcamentos/${id}/cancelar`).then(() => undefined);
  },

  converter(id: string, payload: ConverterOrcamentoPayload): Promise<PedidoVendaDto> {
    return api
      .post<PedidoVendaDto>(`/orcamentos/${id}/converter`, payload)
      .then((r) => r.data);
  },
};
