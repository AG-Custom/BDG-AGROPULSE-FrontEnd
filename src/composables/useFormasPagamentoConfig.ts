import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { financeiroService } from 'services/financeiro.service';
import type {
  ConfigFormaPagamentoDto,
  ConfigFormaPagamentoFormModel,
  TaxaFormaPagamentoFormModel,
} from 'types/dtos/financeiro.dto';
import {
  formParaCriarConfigPayload,
  formParaEditarConfigPayload,
  formParaTaxaPayload,
} from 'utils/mappers/financeiro.mapper';
import { ref } from 'vue';

export function useFormasPagamentoConfig() {
  const configs = ref<ConfigFormaPagamentoDto[]>([]);
  const config = ref<ConfigFormaPagamentoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      configs.value = await financeiroService.listarFormasPagamentoConfig();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      config.value = await financeiroService.obterFormaPagamentoConfig(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(
    form: ConfigFormaPagamentoFormModel,
  ): Promise<ConfigFormaPagamentoDto | null> {
    salvando.value = true;

    try {
      const criado = await financeiroService.criarFormaPagamentoConfig(
        formParaCriarConfigPayload(form),
      );
      sucesso('Configuração criada com sucesso.');
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
    form: ConfigFormaPagamentoFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      config.value = await financeiroService.editarFormaPagamentoConfig(
        id,
        formParaEditarConfigPayload(form),
      );
      sucesso('Configuração atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarInativacao(item: ConfigFormaPagamentoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar configuração',
      mensagem: 'Deseja inativar esta forma de pagamento?',
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await financeiroService.inativarFormaPagamentoConfig(item.id);
      sucesso('Configuração inativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function salvarTaxa(
    id: string,
    form: TaxaFormaPagamentoFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      config.value = await financeiroService.upsertTaxaFormaPagamento(
        id,
        formParaTaxaPayload(form),
      );
      sucesso('Taxa salva com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    configs,
    config,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    solicitarInativacao,
    salvarTaxa,
  };
}
