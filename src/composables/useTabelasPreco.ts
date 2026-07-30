import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { tabelaPrecoService } from 'services/tabela-preco.service';
import type {
  ListarTabelasPrecoParams,
  TabelaPrecoDto,
  TabelaPrecoFormModel,
  TabelaPrecoResumoDto,
} from 'types/dtos/tabela-preco.dto';
import { formParaSalvarTabelaPrecoPayload } from 'utils/mappers/tabela-preco.mapper';
import { ref } from 'vue';

function tabelaDtoParaResumo(dto: TabelaPrecoDto): TabelaPrecoResumoDto {
  return {
    id: dto.id,
    empresaId: dto.empresaId,
    codigo: dto.codigo,
    nome: dto.nome,
    vigenciaInicio: dto.vigenciaInicio,
    vigenciaFim: dto.vigenciaFim,
    ativo: dto.ativo,
    ehPadrao: dto.ehPadrao,
    clienteId: dto.clienteId,
  };
}

export function useTabelasPreco() {
  const tabelas = ref<TabelaPrecoResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarTabelasPrecoParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarTabelasPrecoParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      tabelas.value = await tabelaPrecoService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: TabelaPrecoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      const criada = await tabelaPrecoService.criar(formParaSalvarTabelaPrecoPayload(form));
      sucesso('Tabela de preço cadastrada com sucesso.');
      await carregar(ultimosParams.value);

      const resumo = tabelaDtoParaResumo(criada);
      const indice = tabelas.value.findIndex((tabela) => tabela.id === criada.id);

      if (indice >= 0) {
        tabelas.value[indice] = { ...tabelas.value[indice], ...resumo };
      } else {
        tabelas.value = [resumo, ...tabelas.value];
      }

      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(tabelaId: string, form: TabelaPrecoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await tabelaPrecoService.editar(tabelaId, formParaSalvarTabelaPrecoPayload(form));
      sucesso('Tabela de preço atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(tabelaId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await tabelaPrecoService.inativar(tabelaId, justificativa);
      sucesso('Tabela de preço inativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(tabelaId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await tabelaPrecoService.ativar(tabelaId);
      sucesso('Tabela de preço ativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(tabela: TabelaPrecoResumoDto): Promise<boolean> {
    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar tabela de preço',
      mensagem: `Deseja inativar a tabela ${tabela.nome}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(tabela.id, justificativa);
  }

  async function solicitarAtivacao(tabela: TabelaPrecoResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar tabela de preço',
      mensagem: `Deseja reativar a tabela ${tabela.nome}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(tabela.id);
  }

  async function definirPadrao(tabelaId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Definir tabela padrão',
      mensagem: 'Esta tabela passará a ser a padrão da unidade. Continuar?',
      textoConfirmar: 'Definir padrão',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await tabelaPrecoService.definirPadrao(tabelaId);
      sucesso('Tabela definida como padrão.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    tabelas,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    definirPadrao,
  };
}
