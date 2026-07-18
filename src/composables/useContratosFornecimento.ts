import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { comprasService } from 'services/compras.service';
import type {
  AtualizarContratoFornecimentoPayload,
  ContratoFornecimentoAlertaDto,
  ContratoFornecimentoDto,
  CriarContratoFornecimentoPayload,
  ListarContratosFornecimentoParams,
} from 'types/dtos/compras.dto';
import { ref } from 'vue';

export function useContratosFornecimento() {
  const contratos = ref<ContratoFornecimentoDto[]>([]);
  const contrato = ref<ContratoFornecimentoDto | null>(null);
  const alertas = ref<ContratoFornecimentoAlertaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarContratosFornecimentoParams): Promise<void> {
    carregando.value = true;
    try {
      contratos.value = await comprasService.listarContratosFornecimento(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      contrato.value = await comprasService.obterContratoFornecimento(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(
    payload: CriarContratoFornecimentoPayload,
  ): Promise<ContratoFornecimentoDto | null> {
    salvando.value = true;
    try {
      const criado = await comprasService.criarContratoFornecimento(payload);
      sucesso('Contrato de fornecimento criado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function atualizar(
    id: string,
    payload: AtualizarContratoFornecimentoPayload,
  ): Promise<ContratoFornecimentoDto | null> {
    salvando.value = true;
    try {
      const atualizado = await comprasService.atualizarContratoFornecimento(id, payload);
      sucesso('Contrato de fornecimento atualizado.');
      contrato.value = atualizado;
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar contrato',
      mensagem: 'Deseja cancelar este contrato de fornecimento?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await comprasService.cancelarContratoFornecimento(id);
      sucesso('Contrato cancelado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarAlertas(dias = 30): Promise<void> {
    try {
      alertas.value = await comprasService.alertasContratosFornecimento(dias);
    } catch (e) {
      erro(mensagem(e));
    }
  }

  return {
    contratos,
    contrato,
    alertas,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    atualizar,
    cancelar,
    carregarAlertas,
  };
}
