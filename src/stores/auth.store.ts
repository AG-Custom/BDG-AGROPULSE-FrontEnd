import { defineStore } from 'pinia';

import { authService } from 'services/auth.service';
import type {
  AuthContextSessionDto,
  ConfirmEmailPayload,
  LoginPayload,
  RegisterPayload,
  SessaoPersistida,
  UnidadeDisponivelDto,
} from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';
import {
  loginParaSessao,
  mesclarSessaoRemotaComLocal,
  refreshParaSessao,
  selecionarUnidadeParaSessao,
  usuarioDtoParaLogado,
} from 'utils/auth.mapper';
import { limparSessao, obterSessao, salvarSessao, sessaoExpirada } from 'utils/auth-storage';

interface AuthState {
  autenticado: boolean;
  verificado: boolean;
  usuario: UsuarioLogado | null;
  empresaId: string | null;
  unidadeId: string | null;
  requiresUnidadeSelection: boolean;
  unidadesDisponiveis: UnidadeDisponivelDto[] | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    autenticado: false,
    verificado: false,
    usuario: null,
    empresaId: null,
    unidadeId: null,
    requiresUnidadeSelection: false,
    unidadesDisponiveis: null,
  }),
  getters: {
    permissoes: (state): string[] => state.usuario?.permissoes ?? [],
    precisaOnboarding: (state): boolean => state.autenticado && !state.empresaId,
    temEmpresa: (state): boolean => !!state.empresaId,
    temUnidade: (state): boolean => !!state.unidadeId,
    precisaSelecionarUnidade: (state): boolean =>
      state.autenticado &&
      !!state.empresaId &&
      (state.requiresUnidadeSelection || !state.unidadeId),
  },
  actions: {
    aplicarSessao(sessao: SessaoPersistida) {
      this.usuario = usuarioDtoParaLogado(sessao.usuario, sessao.empresaId);
      this.empresaId = sessao.empresaId;
      this.unidadeId = sessao.unidadeId;
      this.requiresUnidadeSelection = sessao.requiresUnidadeSelection;
      this.unidadesDisponiveis = sessao.unidadesDisponiveis;
      this.autenticado = true;
      this.verificado = true;
    },

    aplicarContextoRefresh(resposta: AuthContextSessionDto) {
      const sessaoAtual = obterSessao();

      if (!sessaoAtual) {
        return;
      }

      const novaSessao = refreshParaSessao(resposta, sessaoAtual);
      salvarSessao(novaSessao);
      this.aplicarSessao(novaSessao);
    },

    async verificar() {
      const sessaoLocal = obterSessao();

      try {
        const sessaoRemota = await authService.obterSessao();
        const sessao = mesclarSessaoRemotaComLocal(loginParaSessao(sessaoRemota), sessaoLocal);
        salvarSessao(sessao);
        this.aplicarSessao(sessao);
      } catch {
        if (sessaoLocal && !sessaoExpirada(sessaoLocal.expiresAt)) {
          this.aplicarSessao(sessaoLocal);
          this.verificado = true;
          return;
        }

        limparSessao();
        this.limparEstado();
        this.verificado = true;
      }
    },

    async entrar(payload: LoginPayload) {
      const resposta = await authService.login(payload);
      const sessao = loginParaSessao(resposta);
      salvarSessao(sessao);
      this.aplicarSessao(sessao);
    },

    async cadastrar(payload: RegisterPayload) {
      return authService.register(payload);
    },

    async confirmarEmail(payload: ConfirmEmailPayload) {
      await authService.confirmarEmail(payload);
    },

    async listarUnidades() {
      const resposta = await authService.listarUnidades();
      return resposta.unidades;
    },

    async selecionarUnidade(unidadeId: string) {
      const sessaoAtual = obterSessao();

      if (!sessaoAtual) {
        throw new Error('Sessão inválida para seleção de unidade.');
      }

      const resposta = await authService.selecionarUnidade({ unidadeId });
      const novaSessao = selecionarUnidadeParaSessao(resposta, sessaoAtual);
      salvarSessao(novaSessao);
      this.aplicarSessao(novaSessao);
    },

    async renovarTokens() {
      const sessaoAtual = obterSessao();

      if (!sessaoAtual) {
        throw new Error('Sessão inválida para renovação.');
      }

      const resposta = await authService.refresh();
      const novaSessao = refreshParaSessao(resposta, sessaoAtual);
      salvarSessao(novaSessao);
      this.aplicarSessao(novaSessao);
    },

    possuiPermissao(permissao: string): boolean {
      return this.permissoes.includes(permissao);
    },

    async sair() {
      limparSessao();
      this.limparEstado();
      this.verificado = true;

      try {
        await authService.logout();
      } catch {}
    },

    limparEstado() {
      this.autenticado = false;
      this.usuario = null;
      this.empresaId = null;
      this.unidadeId = null;
      this.requiresUnidadeSelection = false;
      this.unidadesDisponiveis = null;
    },
  },
});
