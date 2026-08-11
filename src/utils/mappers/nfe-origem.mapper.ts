import { OrigemMercadoria, type OrigemMercadoriaValor } from 'constants/enums';

const ORIGEM_POR_CODIGO: Record<string, OrigemMercadoriaValor> = {
  '0': OrigemMercadoria.Nacional,
  '1': OrigemMercadoria.EstrangeiraImportacaoDireta,
  '2': OrigemMercadoria.EstrangeiraAdquiridaMercadoInterno,
  '3': OrigemMercadoria.NacionalConteudoImportacaoSuperior40,
  '4': OrigemMercadoria.NacionalProcessosBasicos,
  '5': OrigemMercadoria.NacionalConteudoImportacaoInferior40,
  '6': OrigemMercadoria.EstrangeiraImportacaoDiretaSemSimilar,
  '7': OrigemMercadoria.EstrangeiraAdquiridaMercadoInternoSemSimilar,
  '8': OrigemMercadoria.NacionalConteudoImportacaoSuperior70,
};

export function mapearOrigemMercadoriaNfe(
  origem: string | null | undefined,
): OrigemMercadoriaValor | null {
  if (!origem) return null;

  const bruto = origem.trim();
  if (!bruto) return null;

  const porCodigo = ORIGEM_POR_CODIGO[bruto];
  if (porCodigo) return porCodigo;

  const valores = Object.values(OrigemMercadoria) as OrigemMercadoriaValor[];
  if (valores.includes(bruto as OrigemMercadoriaValor)) {
    return bruto as OrigemMercadoriaValor;
  }

  return null;
}
