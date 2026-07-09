export interface UnidadeMedidaResumoDto {
  id: string;
  empresaId: string;
  codigo: string;
  descricao: string;
  ativo: boolean;
}

export type UnidadeMedidaDto = UnidadeMedidaResumoDto;

export interface SalvarUnidadeMedidaPayload {
  codigo: string;
  descricao: string;
}

export interface ListarUnidadesMedidaParams {
  ativo?: boolean;
  busca?: string;
}

export interface UnidadeMedidaFormModel {
  codigo: string;
  descricao: string;
}
