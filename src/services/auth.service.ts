import { api } from 'boot/axios';

import type {
  AuthContextSessionDto,
  AuthSessionDto,
  ConfirmEmailPayload,
  LoginPayload,
  RegisterPayload,
  RegisterResponseDto,
  SelecionarUnidadePayload,
  SelecionarUnidadeResponseDto,
  UnidadesDisponiveisResponseDto,
} from 'types/dtos/auth.dto';

export const authService = {
  login(payload: LoginPayload): Promise<AuthSessionDto> {
    return api.post<AuthSessionDto>('/auth/login', payload).then((response) => response.data);
  },

  register(payload: RegisterPayload): Promise<RegisterResponseDto> {
    return api.post<RegisterResponseDto>('/auth/register', payload).then((response) => response.data);
  },

  confirmarEmail(payload: ConfirmEmailPayload): Promise<void> {
    return api.post('/auth/confirm-email', payload).then(() => undefined);
  },

  refresh(): Promise<AuthContextSessionDto> {
    return api.post<AuthContextSessionDto>('/auth/refresh').then((response) => response.data);
  },

  logout(): Promise<void> {
    return api.post('/auth/logout').then(() => undefined);
  },

  obterSessao(): Promise<AuthSessionDto> {
    return api.get<AuthSessionDto>('/auth/session').then((response) => response.data);
  },

  listarUnidades(): Promise<UnidadesDisponiveisResponseDto> {
    return api.get<UnidadesDisponiveisResponseDto>('/auth/unidades').then((response) => response.data);
  },

  selecionarUnidade(payload: SelecionarUnidadePayload): Promise<SelecionarUnidadeResponseDto> {
    return api
      .post<SelecionarUnidadeResponseDto>('/auth/selecionar-unidade', payload)
      .then((response) => response.data);
  },
};
