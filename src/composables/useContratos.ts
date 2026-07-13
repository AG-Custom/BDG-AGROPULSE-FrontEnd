import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { FontePrecoValor, TipoContratoValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { contratoService } from 'services/contrato.service';
import type {
  ContratoDto,
  ContratoFormModel,
  CotacaoMercadoDto,
  CriarContratoPayload,
} from 'types/dtos/contrato.dto';
import { type Ref, ref, unref } from 'vue';

function formParaPayload(form: ContratoFormModel): CriarContratoPayload {
  return {
    clienteId: form.clienteId,
    produtoId: form.produtoId,
    quantidade: Number(form.quantidade),
    preco: Number(form.preco),
    fontePreco: form.fontePreco as FontePrecoValor,
    dataInicio: form.dataInicio,
    dataFim: form.dataFim || null,
    observacao: form.observacao.trim() || null,
  };
}

export function useContratos(tipo: TipoContratoValor | Ref<TipoContratoValor>) {
  const contratos = ref<ContratoDto[]>([]);
  const contrato = ref<ContratoDto | null>(null);
  const cotacao = ref<CotacaoMercadoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function tipoAtual(): TipoContratoValor {
    return unref(tipo);
  }

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      contratos.value = await contratoService.listar(tipoAtual());
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      contrato.value = await contratoService.obter(tipoAtual(), id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ContratoFormModel): Promise<ContratoDto | null> {
    salvando.value = true;

    try {
      const criado = await contratoService.criar(tipoAtual(), formParaPayload(form));
      sucesso('Contrato criado com sucesso.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: ContratoFormModel): Promise<ContratoDto | null> {
    salvando.value = true;

    try {
      const atualizado = await contratoService.editar(
        tipoAtual(),
        id,
        formParaPayload(form),
      );
      sucesso('Contrato atualizado com sucesso.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function liquidar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Liquidar contrato',
      mensagem: 'Deseja liquidar este contrato?',
      textoConfirmar: 'Liquidar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      contrato.value = await contratoService.liquidar(tipoAtual(), id);
      sucesso('Contrato liquidado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function entregar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Entregar contrato',
      mensagem: 'Deseja marcar este contrato como entregue?',
      textoConfirmar: 'Entregar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      contrato.value = await contratoService.entregar(tipoAtual(), id);
      sucesso('Contrato entregue.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar contrato',
      mensagem: 'Deseja cancelar este contrato?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await contratoService.cancelar(tipoAtual(), id);
      sucesso('Contrato cancelado.');
      contrato.value = await contratoService.obter(tipoAtual(), id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarCotacaoMercado(
    produto?: string,
    fonte?: FontePrecoValor,
  ): Promise<void> {
    try {
      cotacao.value = await contratoService.cotacaoMercado(produto, fonte);
    } catch (e) {
      erro(mensagem(e));
    }
  }

  return {
    contratos,
    contrato,
    cotacao,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    liquidar,
    entregar,
    cancelar,
    carregarCotacaoMercado,
  };
}
