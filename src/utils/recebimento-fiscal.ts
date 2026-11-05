import type { DivergenciaFiscalEntradaDto } from 'types/dtos/compras.dto';

export function produtoSemNcmNoCadastro(item: {
  produtoId: string;
  divergenciasFiscais: readonly DivergenciaFiscalEntradaDto[];
}): boolean {
  return Boolean(item.produtoId)
    && item.divergenciasFiscais.some((diferenca) => diferenca.campo === 'ncm' && !diferenca.valorCadastro?.trim());
}
