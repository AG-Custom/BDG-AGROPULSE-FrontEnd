import type { UsuarioLogado } from 'types/entidades/usuario';

import { api } from 'boot/axios';

export const authService = {
  async status(): Promise<boolean> {
    try {
      await api.get('/health');
      return false;
    } catch {
      return false;
    }
  },

  async usuarioLogado(): Promise<UsuarioLogado> {
    return api.get<UsuarioLogado>('/auth/me').then((response) => response.data);
  },
};
