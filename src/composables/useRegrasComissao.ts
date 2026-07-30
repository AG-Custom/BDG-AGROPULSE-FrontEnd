import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { CanalVendaValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { regraComissaoService } from 'services/regra-comissao.service';
import type {
  ListarRegrasComissaoParams,
  RegraComissaoDto,
  RegraComissaoFormModel,
} from 'types/dtos/regra-comissao.dto';
import { ref } from 'vue';

function formParaPayload(form: RegraComissaoFormModel) {
  return {
    canal: (form.canal || null) as CanalVendaValor | null,
    percentual: Number(form.percentual.replace(',', '.')),
  };
}

export function formVazioRegraComissao(): RegraComissaoFormModel {
  return {
    canal: '',
    percentual: '',
  };
}

export function regraComissaoParaForm(dto: RegraComissaoDto): RegraComissaoFormModel {
  return {
    canal: dto.canal ?? '',
    percentual: String(dto.percentual),
  };
}

export function useRegrasComissao() {
  const regras = ref<RegraComissaoDto[]>([]);
  const regra = ref<RegraComissaoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarRegrasComissaoParams): Promise<void> {
    carregando.value = true;

    try {
      regras.value = await regraComissaoService.listar(params);
    } catch (e) {
      regras.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      regra.value = await regraComissaoService.obter(id);
      return true;
    } catch (e) {
      regra.value = null;
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: RegraComissaoFormModel): Promise<RegraComissaoDto | null> {
    salvando.value = true;

    try {
      const criado = await regraComissaoService.criar(formParaPayload(form));
      sucesso('Regra de comissão salva.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    id: string,
    form: RegraComissaoFormModel,
  ): Promise<RegraComissaoDto | null> {
    salvando.value = true;

    try {
      const atualizado = await regraComissaoService.editar(id, formParaPayload(form));
      sucesso('Regra de comissão atualizada.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function excluir(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Excluir regra',
      mensagem: 'Deseja excluir esta regra de comissão?',
      textoConfirmar: 'Excluir',
    });

    if (!confirmou) {
      return false;
    }

    try {
      await regraComissaoService.excluir(id);
      sucesso('Regra de comissão excluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    }
  }

  return {
    regras,
    regra,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    excluir,
  };
}
