import type {
  NotificacaoPrioridadeValor,
  NotificacaoTipoValor,
} from 'constants/enums';

export interface NotificacaoDto {
  id: string;
  empresaId: string;
  usuarioId: string | null;
  tipo: NotificacaoTipoValor;
  prioridade: NotificacaoPrioridadeValor;
  titulo: string;
  mensagem: string;
  modeloReferencia: string;
  idReferencia: string;
  lida: boolean;
  lidaEm: string | null;
  createdAt: string;
}

export interface ListarNotificacoesParams {
  apenasNaoLidas?: boolean;
}
