import type {
  SalvarUnidadeMedidaPayload,
  UnidadeMedidaDto,
  UnidadeMedidaFormModel,
} from 'types/dtos/unidade-medida.dto';

export function criarUnidadeMedidaFormVazia(): UnidadeMedidaFormModel {
  return {
    codigo: '',
    descricao: '',
  };
}

export function unidadeMedidaDtoParaForm(dto: UnidadeMedidaDto): UnidadeMedidaFormModel {
  return {
    codigo: dto.codigo,
    descricao: dto.descricao,
  };
}

export function formParaSalvarUnidadeMedidaPayload(
  form: UnidadeMedidaFormModel,
): SalvarUnidadeMedidaPayload {
  return {
    codigo: form.codigo.trim().toUpperCase(),
    descricao: form.descricao.trim(),
  };
}
