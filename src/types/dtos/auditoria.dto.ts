export interface LogAuditoriaDto {
  id: string;
  empresaId: string;
  usuarioId: string | null;
  usuarioNome: string | null;
  acao: string;
  modeloAfetado: string;
  registroId: string;
  valorAnterior: string | null;
  valorNovo: string | null;
  descricao: string;
  createdAt: string;
}

export interface ListaAuditoriaPaginadaDto {
  itens: LogAuditoriaDto[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
}

export interface ListarAuditoriaParams {
  modelo?: string;
  registroId?: string;
  acao?: string;
  usuarioId?: string;
  de?: string;
  ate?: string;
  pagina?: number;
  tamanhoPagina?: number;
}
