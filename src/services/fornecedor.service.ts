import { api } from 'services/api';

import type {
  ContatoFornecedorDto,
  ContatoFornecedorPayload,
  CriarFornecedorPayload,
  EditarFornecedorPayload,
  FornecedorDto,
  FornecedorResumoDto,
  ListarFornecedoresParams,
} from 'types/dtos/fornecedor.dto';

export const fornecedorService = {
  listar(params?: ListarFornecedoresParams): Promise<FornecedorResumoDto[]> {
    return api
      .get<FornecedorResumoDto[]>('/fornecedores', { params })
      .then((r) => r.data);
  },

  obter(fornecedorId: string): Promise<FornecedorDto> {
    return api.get<FornecedorDto>(`/fornecedores/${fornecedorId}`).then((r) => r.data);
  },

  criar(payload: CriarFornecedorPayload): Promise<FornecedorDto> {
    return api.post<FornecedorDto>('/fornecedores', payload).then((r) => r.data);
  },

  editar(fornecedorId: string, payload: EditarFornecedorPayload): Promise<FornecedorDto> {
    return api.put<FornecedorDto>(`/fornecedores/${fornecedorId}`, payload).then((r) => r.data);
  },

  inativar(fornecedorId: string): Promise<void> {
    return api.post(`/fornecedores/${fornecedorId}/inativar`);
  },

  adicionarContato(
    fornecedorId: string,
    payload: ContatoFornecedorPayload,
  ): Promise<ContatoFornecedorDto> {
    return api
      .post<ContatoFornecedorDto>(`/fornecedores/${fornecedorId}/contatos`, payload)
      .then((r) => r.data);
  },

  editarContato(
    fornecedorId: string,
    contatoId: string,
    payload: ContatoFornecedorPayload,
  ): Promise<ContatoFornecedorDto> {
    return api
      .put<ContatoFornecedorDto>(
        `/fornecedores/${fornecedorId}/contatos/${contatoId}`,
        payload,
      )
      .then((r) => r.data);
  },

  removerContato(fornecedorId: string, contatoId: string): Promise<void> {
    return api.delete(`/fornecedores/${fornecedorId}/contatos/${contatoId}`);
  },
};
