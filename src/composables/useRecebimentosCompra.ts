import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { comprasService } from 'services/compras.service';
import type {
  AtualizarItensRecebimentoPayload,
  ConfirmarRecebimentoPayload,
  CriarRecebimentoPayload,
  ListarRecebimentosCompraParams,
  PreviewRecebimentoXmlDto,
  PreviewXmlRecebimentoPayload,
  RecebimentoCompraDto,
  RegistrarDivergenciaRecebimentoPayload,
} from 'types/dtos/compras.dto';
import { ref } from 'vue';

export function useRecebimentosCompra() {
  const recebimentos = ref<RecebimentoCompraDto[]>([]);
  const recebimento = ref<RecebimentoCompraDto | null>(null);
  const previewXml = ref<PreviewRecebimentoXmlDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarRecebimentosCompraParams): Promise<void> {
    carregando.value = true;

    try {
      recebimentos.value = await comprasService.listarRecebimentos(params);
    } catch (e) {
      erro(mensagem(e));
      recebimentos.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      recebimento.value = await comprasService.obterRecebimento(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function previewXmlConteudo(
    payload: PreviewXmlRecebimentoPayload,
  ): Promise<PreviewRecebimentoXmlDto | null> {
    salvando.value = true;

    try {
      previewXml.value = await comprasService.previewXmlRecebimento(payload);
      sucesso('XML analisado.');
      return previewXml.value;
    } catch (e) {
      erro(mensagem(e));
      previewXml.value = null;
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function criar(
    payload: CriarRecebimentoPayload,
  ): Promise<RecebimentoCompraDto | null> {
    salvando.value = true;

    try {
      const criado = await comprasService.criarRecebimento(payload);
      sucesso('Recebimento criado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function atualizarItens(
    id: string,
    payload: AtualizarItensRecebimentoPayload,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      recebimento.value = await comprasService.atualizarItensRecebimento(id, payload);
      sucesso('Itens atualizados.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarDivergencia(
    id: string,
    payload: RegistrarDivergenciaRecebimentoPayload,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      recebimento.value = await comprasService.registrarDivergenciaRecebimento(id, payload);
      sucesso('Divergência registrada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function confirmar(
    id: string,
    payload?: ConfirmarRecebimentoPayload | null,
  ): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Confirmar recebimento',
      mensagem:
        'Confirma o recebimento? Isso gera entrada de estoque, contas a pagar e histórico.',
      textoConfirmar: 'Confirmar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      recebimento.value = await comprasService.confirmarRecebimento(id, payload);
      sucesso('Recebimento confirmado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function limparPreview(): void {
    previewXml.value = null;
  }

  return {
    recebimentos,
    recebimento,
    previewXml,
    carregando,
    salvando,
    carregar,
    obter,
    previewXmlConteudo,
    criar,
    atualizarItens,
    registrarDivergencia,
    confirmar,
    limparPreview,
  };
}
