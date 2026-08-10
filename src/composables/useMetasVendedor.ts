import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  metaVendedorService,
  representanteService,
} from 'services/comercial-extras.service';
import { messageService } from 'services/message.service';
import type {
  ListarMetasVendedorParams,
  ListarRepresentantesParams,
  MetaVendedorDto,
  MetaVendedorFormModel,
  MetaVendedorPayload,
  RepresentanteDto,
  TipoMetaVendedorValor,
} from 'types/dtos/comercial-extras.dto';
import {
  EscopoMetaVendedor,
  TipoMetaVendedor,
} from 'types/dtos/comercial-extras.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

function formVazio(): MetaVendedorFormModel {
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  return {
    escopo: EscopoMetaVendedor.Unidade,
    vendedorUsuarioId: '',
    periodoInicio: formatarDateInput(inicioMes),
    periodoFim: formatarDateInput(fimMes),
    tipo: TipoMetaVendedor.Valor,
    valorMeta: '',
    produtoId: '',
    quantidadeMeta: '',
  };
}

function formatarDateInput(data: Date): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dtoParaForm(dto: MetaVendedorDto): MetaVendedorFormModel {
  const tipo = (dto.tipo === TipoMetaVendedor.Produto
    ? TipoMetaVendedor.Produto
    : TipoMetaVendedor.Valor) as TipoMetaVendedorValor;
  const temVendedor = Boolean(dto.vendedorUsuarioId);

  return {
    escopo: temVendedor ? EscopoMetaVendedor.Vendedor : EscopoMetaVendedor.Unidade,
    vendedorUsuarioId: dto.vendedorUsuarioId ?? '',
    periodoInicio: dto.periodoInicio.slice(0, 10),
    periodoFim: dto.periodoFim.slice(0, 10),
    tipo,
    valorMeta:
      tipo === TipoMetaVendedor.Valor ? formatarMoedaParaInput(dto.valorMeta) : '',
    produtoId: dto.produtoId ?? '',
    quantidadeMeta:
      dto.quantidadeMeta == null ? '' : String(dto.quantidadeMeta),
  };
}

function formParaPayload(form: MetaVendedorFormModel): MetaVendedorPayload {
  const vendedorUsuarioId =
    form.escopo === EscopoMetaVendedor.Vendedor && form.vendedorUsuarioId
      ? form.vendedorUsuarioId
      : null;

  if (form.tipo === TipoMetaVendedor.Produto) {
    return {
      vendedorUsuarioId,
      periodoInicio: form.periodoInicio,
      periodoFim: form.periodoFim,
      tipo: TipoMetaVendedor.Produto,
      produtoId: form.produtoId,
      quantidadeMeta: Number(form.quantidadeMeta),
    };
  }

  return {
    vendedorUsuarioId,
    periodoInicio: form.periodoInicio,
    periodoFim: form.periodoFim,
    tipo: TipoMetaVendedor.Valor,
    valorMeta: parseMascaraMoeda(form.valorMeta) ?? 0,
  };
}

export function useMetasVendedor() {
  const metas = ref<MetaVendedorDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarMetasVendedorParams): Promise<void> {
    carregando.value = true;

    try {
      metas.value = await metaVendedorService.listar(params);
    } catch (e) {
      metas.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: MetaVendedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await metaVendedorService.criar(formParaPayload(form));
      sucesso('Meta cadastrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: MetaVendedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await metaVendedorService.editar(id, formParaPayload(form));
      sucesso('Meta atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarExclusao(meta: MetaVendedorDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Excluir meta',
      mensagem: 'Deseja excluir esta meta?',
      textoConfirmar: 'Excluir',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await metaVendedorService.excluir(meta.id);
      sucesso('Meta excluída com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    metas,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    solicitarExclusao,
    formVazio,
    dtoParaForm,
  };
}

export function useRepresentantes() {
  const representantes = ref<RepresentanteDto[]>([]);
  const carregando = ref(false);
  const indisponivel = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarRepresentantesParams): Promise<void> {
    carregando.value = true;
    indisponivel.value = false;

    try {
      representantes.value = await representanteService.listar(params);
    } catch (e) {
      representantes.value = [];
      indisponivel.value = true;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    representantes,
    carregando,
    indisponivel,
    carregar,
  };
}
