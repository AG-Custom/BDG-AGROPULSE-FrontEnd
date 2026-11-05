import { OrigemMercadoria, type OrigemMercadoriaValor } from 'constants/enums';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { produtoService } from 'services/produto.service';
import type { ProdutoFiscalFormModel } from 'types/dtos/produto.dto';
import {
  criarFiscalFormVazio,
  fiscalDtoParaForm,
  formParaFiscalPayload,
} from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

export interface FiscalNotaParaCadastro {
  ncm: string;
  cest: string;
  origem: string;
  cstIcms: string;
  csosn: string;
  aliquotaIcms: number | null;
  campos: string[];
}

const origemPorCodigoNfe: OrigemMercadoriaValor[] = [
  OrigemMercadoria.Nacional,
  OrigemMercadoria.EstrangeiraImportacaoDireta,
  OrigemMercadoria.EstrangeiraAdquiridaMercadoInterno,
  OrigemMercadoria.NacionalConteudoImportacaoSuperior40,
  OrigemMercadoria.NacionalProcessosBasicos,
  OrigemMercadoria.NacionalConteudoImportacaoInferior40,
  OrigemMercadoria.EstrangeiraImportacaoDiretaSemSimilar,
  OrigemMercadoria.EstrangeiraAdquiridaMercadoInternoSemSimilar,
  OrigemMercadoria.NacionalConteudoImportacaoSuperior70,
];

export function useProdutoFiscal(produtoId: () => string | undefined) {
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function salvar(form: ProdutoFiscalFormModel): Promise<boolean> {
    const id = produtoId();

    if (!id) {
      erro('Salve o produto antes de configurar o fiscal.');
      return false;
    }

    salvando.value = true;

    try {
      const fiscal = await produtoService.salvarFiscal(id, formParaFiscalPayload(form));
      sucesso('Configuração fiscal salva com sucesso.');
      return Boolean(fiscal);
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aplicarDaNota(nota: FiscalNotaParaCadastro): Promise<boolean> {
    const id = produtoId();

    if (!id) {
      erro('Vincule o produto antes de atualizar o cadastro fiscal.');
      return false;
    }

    salvando.value = true;

    try {
      const produto = await produtoService.obter(id);
      const form = produto.fiscal ? fiscalDtoParaForm(produto.fiscal) : criarFiscalFormVazio();
      const falha = aplicarCamposNota(form, nota);
      if (falha) {
        erro(falha);
        return false;
      }

      const fiscal = await produtoService.salvarFiscal(id, formParaFiscalPayload(form));
      sucesso('Cadastro fiscal do produto atualizado.');
      return Boolean(fiscal);
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { salvando, salvar, aplicarDaNota };
}

function origemDaNota(valor: string): OrigemMercadoriaValor | null {
  const conhecida = origemPorCodigoNfe.find((origem) => origem === valor);
  if (conhecida) return conhecida;
  const codigo = Number(valor.replace(/\D/g, ''));
  if (!Number.isInteger(codigo)) return null;
  return origemPorCodigoNfe[codigo] ?? null;
}

function aplicarCamposNota(form: ProdutoFiscalFormModel, nota: FiscalNotaParaCadastro): string | null {
  const campos = new Set(nota.campos);
  if (campos.has('ncm')) form.ncm = nota.ncm;
  if (campos.has('cest')) form.cest = nota.cest;
  if (campos.has('cstIcms')) form.cstIcms = nota.cstIcms;
  if (campos.has('csosn')) form.csosn = nota.csosn;
  if (campos.has('aliquotaIcms')) {
    form.aliquotaIcms = nota.aliquotaIcms == null ? '' : String(nota.aliquotaIcms);
  }
  if (campos.has('origem')) {
    const origem = origemDaNota(nota.origem);
    if (!origem) return 'Origem da nota não corresponde a uma origem do cadastro.';
    form.origemMercadoria = origem;
  }
  return null;
}
