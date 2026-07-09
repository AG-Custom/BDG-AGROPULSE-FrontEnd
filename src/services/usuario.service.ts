import { api } from 'services/api';

import type {
  CriarUsuarioPayload,
  EditarUsuarioPayload,
  UsuarioDto,
  UsuarioResumoDto,
} from 'types/dtos/usuario.dto';

export const usuarioService = {
  listar(): Promise<UsuarioResumoDto[]> {
    return api.get<UsuarioResumoDto[]>('/usuarios').then((r) => r.data);
  },

  obter(usuarioId: string): Promise<UsuarioDto> {
    return api.get<UsuarioDto>(`/usuarios/${usuarioId}`).then((r) => r.data);
  },

  criar(payload: CriarUsuarioPayload): Promise<UsuarioDto> {
    return api.post<UsuarioDto>('/usuarios', payload).then((r) => r.data);
  },

  editar(usuarioId: string, payload: EditarUsuarioPayload): Promise<UsuarioDto> {
    return api.put<UsuarioDto>(`/usuarios/${usuarioId}`, payload).then((r) => r.data);
  },

  inativar(usuarioId: string): Promise<void> {
    return api.patch(`/usuarios/${usuarioId}/inativar`);
  },

  ativar(usuarioId: string): Promise<void> {
    return api.patch(`/usuarios/${usuarioId}/ativar`);
  },

  revogarSessoes(usuarioId: string): Promise<void> {
    return api.post(`/usuarios/${usuarioId}/revogar-sessoes`);
  },
};
