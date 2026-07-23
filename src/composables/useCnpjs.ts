import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { cnpjService } from 'services/cnpj.service';
import { messageService } from 'services/message.service';
import type { CnpjEmpresaDto, CnpjFormModel } from 'types/dtos/cnpj.dto';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/cnpj.mapper';
import { formatarCnpj } from 'utils/formatters';
import { ref } from 'vue';
export function useCnpjs() {
  const cnpjs = ref<CnpjEmpresaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      cnpjs.value = await cnpjService.listar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: CnpjFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await cnpjService.criar(formParaCriarPayload(form));
      sucesso('CNPJ cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(cnpjId: string, form: CnpjFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await cnpjService.editar(cnpjId, formParaEditarPayload(form));
      sucesso('CNPJ atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(cnpjId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await cnpjService.inativar(cnpjId, justificativa);
      sucesso('CNPJ inativado com sucesso.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(cnpjId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await cnpjService.ativar(cnpjId);
      sucesso('CNPJ ativado com sucesso.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(cnpj: CnpjEmpresaDto): Promise<boolean> {
    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar CNPJ',
      mensagem: `Deseja inativar o CNPJ ${formatarCnpj(cnpj.numero)}? Unidades ativas vinculadas impedem esta ação.`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(cnpj.id, justificativa);
  }

  async function solicitarAtivacao(cnpj: CnpjEmpresaDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar CNPJ',
      mensagem: `Deseja reativar o CNPJ ${formatarCnpj(cnpj.numero)}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    return confirmou ? ativar(cnpj.id) : false;
  }

  return {
    cnpjs,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
  };
}