import type {
  CategoriaProdutoDto,
  CategoriaProdutoFormModel,
  SalvarCategoriaProdutoPayload,
} from 'types/dtos/categoria-produto.dto';

export function criarCategoriaProdutoFormVazia(): CategoriaProdutoFormModel {
  return {
    nome: '',
    margemMinimaPercentual: '',
  };
}

export function categoriaProdutoDtoParaForm(dto: CategoriaProdutoDto): CategoriaProdutoFormModel {
  return {
    nome: dto.nome,
    margemMinimaPercentual:
      dto.margemMinimaPercentual !== null ? String(dto.margemMinimaPercentual) : '',
  };
}

function parseNumeroOpcional(valor: string): number | null {
  const texto = valor.trim();
  if (!texto) {
    return null;
  }

  const numero = Number(texto.replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

export function formParaSalvarCategoriaProdutoPayload(
  form: CategoriaProdutoFormModel,
): SalvarCategoriaProdutoPayload {
  return {
    nome: form.nome.trim(),
    margemMinimaPercentual: parseNumeroOpcional(form.margemMinimaPercentual),
  };
}
