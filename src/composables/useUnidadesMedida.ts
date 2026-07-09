import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { unidadeMedidaService } from 'services/unidade-medida.service';
import type {
  ListarUnidadesMedidaParams,
  UnidadeMedidaFormModel,
  UnidadeMedidaResumoDto,
} from 'types/dtos/unidade-medida.dto';
import { formParaSalvarUnidadeMedidaPayload } from 'utils/mappers/unidade-medida.mapper';
import { ref } from 'vue';

export function useUnidadesMedida() {
  const unidadesMedida = ref<UnidadeMedidaResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarUnidadesMedidaParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarUnidadesMedidaParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      unidadesMedida.value = await unidadeMedidaService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: UnidadeMedidaFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await unidadeMedidaService.criar(formParaSalvarUnidadeMedidaPayload(form));
      sucesso('Unidade de medida cadastrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(unidadeMedidaId: string, form: UnidadeMedidaFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await unidadeMedidaService.editar(unidadeMedidaId, formParaSalvarUnidadeMedidaPayload(form));
      sucesso('Unidade de medida atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(unidadeMedidaId: string): Promise<boolean> {
    inativando.value = true;

    try {
      await unidadeMedidaService.inativar(unidadeMedidaId);
      sucesso('Unidade de medida inativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(unidadeMedidaId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await unidadeMedidaService.ativar(unidadeMedidaId);
      sucesso('Unidade de medida ativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(unidade: UnidadeMedidaResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar unidade de medida',
      mensagem: `Deseja inativar a unidade ${unidade.codigo}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return inativar(unidade.id);
  }

  async function solicitarAtivacao(unidade: UnidadeMedidaResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar unidade de medida',
      mensagem: `Deseja reativar a unidade ${unidade.codigo}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(unidade.id);
  }

  function rotuloUnidadeMedida(unidade: UnidadeMedidaResumoDto): string {
    return `${unidade.codigo} — ${unidade.descricao}`;
  }

  return {
    unidadesMedida,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    rotuloUnidadeMedida,
  };
}
