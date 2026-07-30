export interface LogAuditoriaDto {
  id: string;
  empresaId: string;
  usuarioId: string | null;
  acao: string;
  modeloAfetado: string;
  registroId: string;
  valorAnterior: string | null;
  valorNovo: string | null;
  descricao: string;
  createdAt: string;
}

export interface ListarAuditoriaParams {
  modelo?: string;
  registroId?: string;
}
