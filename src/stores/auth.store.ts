import { defineStore } from 'pinia';

import { authService } from 'services/auth.service';
import type { ConfirmEmailPayload, LoginPayload, RegisterPayload, SessaoPersistida } from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';
import { loginParaSessao, refreshParaSessao, usuarioDtoParaLogado } from 'utils/auth.mapper';
import { limparSessao, obterSessao, salvarSessao } from 'utils/auth-storage';

interface AuthState {
  autenticado: boolean;
  verificado: boolean;
  usuario: UsuarioLogado | null;
  empresaId: string | null;
  unidadeId: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    autenticado: false,
    verificado: false,
    usuario: null,
    empresaId: null,
    unidadeId: null,
  }),
  getters: {
    permissoes: (state): string[] => state.usuario?.permissoes ?? [],
    precisaOnboarding: (state): boolean => state.autenticado && !state.empresaId,
    temEmpresa: (state): boolean => !!state.empresaId,
  },
  actions: {
    aplicarSessao(sessao: SessaoPersistida) {
      this.usuario = usuarioDtoParaLogado(sessao.usuario);
      this.empresaId = sessao.empresaId;
      this.unidadeId = sessao.unidadeId;
      this.autenticado = true;
      this.verificado = true;
    },

    async verificar() {
      try {
        const sessaoRemota = await authService.obterSessao();
        const sessao = loginParaSessao(sessaoRemota);
        salvarSessao(sessao);
        this.aplicarSessao(sessao);
      } catch {
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

    async renovarTokens() {
      const sessaoAtual = obterSessao();

      if (!sessaoAtual) {
        throw new Error('Sessão inválida para renovação.');
      }

      const resposta = await authService.refresh();
      const novaSessao = refreshParaSessao(resposta, sessaoAtual);
      salvarSessao(novaSessao);
      this.empresaId = novaSessao.empresaId;
      this.unidadeId = novaSessao.unidadeId;
    },

    possuiPermissao(permissao: string): boolean {
      return this.permissoes.includes(permissao);
    },

    async sair() {
      try {
        await authService.logout();
      } catch {
        // Cookies podem já estar inválidos; limpar estado local mesmo assim.
      }

      limparSessao();
      this.limparEstado();
      this.verificado = true;
    },

    limparEstado() {
      this.autenticado = false;
      this.usuario = null;
      this.empresaId = null;
      this.unidadeId = null;
    },
  },
});
