import { api } from 'services/api';

import type {
  ClienteContatoDto,
  ClienteContatoPayload,
  ClienteDto,
  ClienteEnderecoDto,
  ClienteEnderecoPayload,
  ClienteResumoDto,
  CriarClientePayload,
  EditarClientePayload,
  ListarClientesParams,
} from 'types/dtos/cliente.dto';

export const clienteService = {
  listar(params?: ListarClientesParams): Promise<ClienteResumoDto[]> {
    return api.get<ClienteResumoDto[]>('/clientes', { params }).then((r) => r.data);
  },

  obter(clienteId: string): Promise<ClienteDto> {
    return api.get<ClienteDto>(`/clientes/${clienteId}`).then((r) => r.data);
  },

  criar(payload: CriarClientePayload): Promise<ClienteDto> {
    return api.post<ClienteDto>('/clientes', payload).then((r) => r.data);
  },

  editar(clienteId: string, payload: EditarClientePayload): Promise<ClienteDto> {
    return api.put<ClienteDto>(`/clientes/${clienteId}`, payload).then((r) => r.data);
  },

  inativar(clienteId: string): Promise<void> {
    return api.patch(`/clientes/${clienteId}/inativar`);
  },

  ativar(clienteId: string): Promise<void> {
    return api.patch(`/clientes/${clienteId}/ativar`);
  },

  listarEnderecos(clienteId: string): Promise<ClienteEnderecoDto[]> {
    return api
      .get<ClienteEnderecoDto[]>(`/clientes/${clienteId}/enderecos`)
      .then((r) => r.data);
  },

  adicionarEndereco(
    clienteId: string,
    payload: ClienteEnderecoPayload,
  ): Promise<ClienteEnderecoDto> {
    return api
      .post<ClienteEnderecoDto>(`/clientes/${clienteId}/enderecos`, payload)
      .then((r) => r.data);
  },

  editarEndereco(
    clienteId: string,
    enderecoId: string,
    payload: ClienteEnderecoPayload,
  ): Promise<ClienteEnderecoDto> {
    return api
      .put<ClienteEnderecoDto>(`/clientes/${clienteId}/enderecos/${enderecoId}`, payload)
      .then((r) => r.data);
  },

  removerEndereco(clienteId: string, enderecoId: string): Promise<void> {
    return api.delete(`/clientes/${clienteId}/enderecos/${enderecoId}`);
  },

  listarContatos(clienteId: string): Promise<ClienteContatoDto[]> {
    return api.get<ClienteContatoDto[]>(`/clientes/${clienteId}/contatos`).then((r) => r.data);
  },

  adicionarContato(
    clienteId: string,
    payload: ClienteContatoPayload,
  ): Promise<ClienteContatoDto> {
    return api
      .post<ClienteContatoDto>(`/clientes/${clienteId}/contatos`, payload)
      .then((r) => r.data);
  },

  editarContato(
    clienteId: string,
    contatoId: string,
    payload: ClienteContatoPayload,
  ): Promise<ClienteContatoDto> {
    return api
      .put<ClienteContatoDto>(`/clientes/${clienteId}/contatos/${contatoId}`, payload)
      .then((r) => r.data);
  },

  removerContato(clienteId: string, contatoId: string): Promise<void> {
    return api.delete(`/clientes/${clienteId}/contatos/${contatoId}`);
  },
};
