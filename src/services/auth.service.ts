import { api } from 'boot/axios';

import type {
  AuthContextSessionDto,
  AuthSessionDto,
  ConfirmEmailPayload,
  DefinirSenhaPrimeiroAcessoPayload,
  LoginPayload,
  SelecionarEmpresaPayload,
  SelecionarEmpresaResponseDto,
  SelecionarUnidadePayload,
  SelecionarUnidadeResponseDto,
  UnidadesDisponiveisResponseDto,
} from 'types/dtos/auth.dto';

export const authService = {
  login(payload: LoginPayload): Promise<AuthSessionDto> {
    return api.post<AuthSessionDto>('/auth/login', payload).then((response) => response.data);
  },

  confirmarEmail(payload: ConfirmEmailPayload): Promise<void> {
    return api.post('/auth/confirm-email', payload).then(() => undefined);
  },

  definirSenhaPrimeiroAcesso(payload: DefinirSenhaPrimeiroAcessoPayload): Promise<void> {
    return api.post('/auth/primeiro-acesso', payload).then(() => undefined);
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

  selecionarEmpresa(payload: SelecionarEmpresaPayload): Promise<SelecionarEmpresaResponseDto> {
    return api
      .post<SelecionarEmpresaResponseDto>('/auth/selecionar-empresa', payload)
      .then((response) => response.data);
  },
};
