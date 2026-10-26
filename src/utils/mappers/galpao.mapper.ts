import type { GalpaoDto, GalpaoFormModel, SalvarGalpaoPayload } from 'types/dtos/galpao.dto';

export function criarGalpaoFormVazio(): GalpaoFormModel {
  return {
    nome: '',
  };
}

export function galpaoDtoParaForm(dto: GalpaoDto): GalpaoFormModel {
  return {
    nome: dto.nome,
  };
}

export function formParaSalvarGalpaoPayload(form: GalpaoFormModel): SalvarGalpaoPayload {
  return {
    nome: form.nome.trim(),
  };
}
