import { api } from 'services/api';
import type {
  ListarNotificacoesParams,
  NotificacaoDto,
} from 'types/dtos/notificacao.dto';

export const notificacaoService = {
  listar(params?: ListarNotificacoesParams): Promise<NotificacaoDto[]> {
    return api.get<NotificacaoDto[]>('/notificacoes', { params }).then((r) => r.data);
  },

  marcarComoLida(id: string): Promise<void> {
    return api.post(`/notificacoes/${id}/ler`).then(() => undefined);
  },
};
