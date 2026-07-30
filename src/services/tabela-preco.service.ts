import { api } from 'services/api';

import type {
  EditarTabelaPrecoItemPayload,
  ListarTabelasPrecoParams,
  SalvarTabelaPrecoPayload,
  TabelaPrecoDto,
  TabelaPrecoItemDto,
  TabelaPrecoItemPayload,
  TabelaPrecoResumoDto,
} from 'types/dtos/tabela-preco.dto';

export const tabelaPrecoService = {
  listar(params?: ListarTabelasPrecoParams): Promise<TabelaPrecoResumoDto[]> {
    return api.get<TabelaPrecoResumoDto[]>('/tabelas-preco', { params }).then((r) => r.data);
  },

  obter(tabelaPrecoId: string): Promise<TabelaPrecoDto> {
    return api.get<TabelaPrecoDto>(`/tabelas-preco/${tabelaPrecoId}`).then((r) => r.data);
  },

  criar(payload: SalvarTabelaPrecoPayload): Promise<TabelaPrecoDto> {
    return api.post<TabelaPrecoDto>('/tabelas-preco', payload).then((r) => r.data);
  },

  editar(tabelaPrecoId: string, payload: SalvarTabelaPrecoPayload): Promise<TabelaPrecoDto> {
    return api.put<TabelaPrecoDto>(`/tabelas-preco/${tabelaPrecoId}`, payload).then((r) => r.data);
  },

  inativar(tabelaPrecoId: string, justificativa: string): Promise<void> {
    return api.patch(`/tabelas-preco/${tabelaPrecoId}/inativar`, { justificativa });
  },

  ativar(tabelaPrecoId: string): Promise<void> {
    return api.patch(`/tabelas-preco/${tabelaPrecoId}/ativar`);
  },

  definirPadrao(tabelaPrecoId: string): Promise<TabelaPrecoDto> {
    return api
      .put<TabelaPrecoDto>(`/tabelas-preco/${tabelaPrecoId}/definir-padrao`)
      .then((r) => r.data);
  },

  listarItens(tabelaPrecoId: string): Promise<TabelaPrecoItemDto[]> {
    return api
      .get<TabelaPrecoItemDto[]>(`/tabelas-preco/${tabelaPrecoId}/itens`)
      .then((r) => r.data);
  },

  adicionarItem(
    tabelaPrecoId: string,
    payload: TabelaPrecoItemPayload,
  ): Promise<TabelaPrecoItemDto> {
    return api
      .post<TabelaPrecoItemDto>(`/tabelas-preco/${tabelaPrecoId}/itens`, payload)
      .then((r) => r.data);
  },

  editarItem(
    tabelaPrecoId: string,
    itemId: string,
    payload: EditarTabelaPrecoItemPayload,
  ): Promise<TabelaPrecoItemDto> {
    return api
      .put<TabelaPrecoItemDto>(`/tabelas-preco/${tabelaPrecoId}/itens/${itemId}`, payload)
      .then((r) => r.data);
  },

  removerItem(tabelaPrecoId: string, itemId: string): Promise<void> {
    return api.delete(`/tabelas-preco/${tabelaPrecoId}/itens/${itemId}`);
  },
};
