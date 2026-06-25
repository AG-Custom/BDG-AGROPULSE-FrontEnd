import { defineStore } from 'pinia';

import { authService } from 'services/auth.service';
import type { UsuarioLogado } from 'types/entidades/usuario';

interface AuthState {
  autenticado: boolean;
  verificado: boolean;
  usuario: UsuarioLogado | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    autenticado: false,
    verificado: false,
    usuario: null,
  }),
  getters: {
    permissoes: (state): string[] => state.usuario?.permissoes ?? [],
  },
  actions: {
    async verificar() {
      this.autenticado = await authService.status();
      this.usuario = this.autenticado ? await authService.usuarioLogado() : null;
      this.verificado = true;
    },
    possuiPermissao(permissao: string): boolean {
      return this.permissoes.includes(permissao);
    },
    entrarSessaoLocal() {
      this.autenticado = true;
      this.verificado = true;
      this.usuario = {
        id: 'local',
        nome: 'Administrador AgroPulse',
        email: 'admin@agropulse.local',
        permissoes: ['dashboard.visualizar'],
      };
    },
    sair() {
      this.autenticado = false;
      this.usuario = null;
    },
  },
});
