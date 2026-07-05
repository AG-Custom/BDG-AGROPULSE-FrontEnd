import { api } from 'boot/axios';

import type {
  ConfirmEmailPayload,
  LoginPayload,
  LoginResponseDto,
  RefreshPayload,
  RefreshResponseDto,
  RegisterPayload,
  RegisterResponseDto,
} from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';

export const authService = {
  login(payload: LoginPayload): Promise<LoginResponseDto> {
    return api.post<LoginResponseDto>('/auth/login', payload).then((response) => response.data);
  },

  register(payload: RegisterPayload): Promise<RegisterResponseDto> {
    return api.post<RegisterResponseDto>('/auth/register', payload).then((response) => response.data);
  },

  confirmarEmail(payload: ConfirmEmailPayload): Promise<void> {
    return api.post('/auth/confirm-email', payload).then(() => undefined);
  },

  refresh(payload: RefreshPayload): Promise<RefreshResponseDto> {
    return api.post<RefreshResponseDto>('/auth/refresh', payload).then((response) => response.data);
  },

  usuarioLogado(): Promise<UsuarioLogado> {
    return api.get<UsuarioLogado>('/auth/me').then((response) => response.data);
  },
};
