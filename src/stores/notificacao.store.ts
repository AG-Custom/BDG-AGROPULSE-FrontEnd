import { defineStore } from 'pinia';

import { useAuthStore } from 'stores/auth.store';
import { notificacaoService } from 'services/notificacao.service';
import type {
  ListarNotificacoesParams,
  NotificacaoDto,
} from 'types/dtos/notificacao.dto';
import { filtrarNotificacoesPorPolitica } from 'utils/alerta-politica';

interface NotificacaoState {
  itens: NotificacaoDto[];
  carregando: boolean;
  marcando: boolean;
}

export const useNotificacaoStore = defineStore('notificacao', {
  state: (): NotificacaoState => ({
    itens: [],
    carregando: false,
    marcando: false,
  }),
  getters: {
    perfilAtual(): string | null {
      return useAuthStore().usuario?.perfil ?? null;
    },
    notificacoesVisiveis(state): NotificacaoDto[] {
      const perfil = useAuthStore().usuario?.perfil ?? null;
      return filtrarNotificacoesPorPolitica(state.itens, perfil);
    },
    naoLidas(): NotificacaoDto[] {
      return this.notificacoesVisiveis.filter((item) => !item.lida);
    },
    quantidadeNaoLidas(): number {
      return this.naoLidas.length;
    },
  },
  actions: {
    async carregar(params?: ListarNotificacoesParams): Promise<void> {
      this.carregando = true;

      try {
        this.itens = await notificacaoService.listar(params);
      } finally {
        this.carregando = false;
      }
    },

    async marcarComoLida(id: string): Promise<boolean> {
      this.marcando = true;

      try {
        await notificacaoService.marcarComoLida(id);
        const atual = this.itens.find((item) => item.id === id);

        if (atual) {
          atual.lida = true;
          atual.lidaEm = new Date().toISOString();
        }

        return true;
      } finally {
        this.marcando = false;
      }
    },
  },
});
