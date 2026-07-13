import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { rastreabilidadeService } from 'services/rastreabilidade.service';
import type {
  AplicacaoInsumoDto,
  AplicacaoInsumoFormModel,
  CriarAplicacaoInsumoPayload,
  CriarTalhaoPayload,
  TalhaoDto,
  TalhaoFormModel,
} from 'types/dtos/rastreabilidade.dto';
import { ref } from 'vue';

function talhaoFormParaPayload(form: TalhaoFormModel): CriarTalhaoPayload {
  return {
    nome: form.nome.trim(),
    areaHectares: form.areaHectares ? Number(form.areaHectares) : null,
  };
}

function aplicacaoFormParaPayload(form: AplicacaoInsumoFormModel): CriarAplicacaoInsumoPayload {
  return {
    talhaoId: form.talhaoId,
    produtoId: form.produtoId,
    loteId: form.loteId.trim() || null,
    quantidade: Number(form.quantidade),
    unidadeMedida: form.unidadeMedida.trim(),
    dataAplicacao: form.dataAplicacao,
    safra: form.safra.trim() || null,
    cultura: form.cultura.trim() || null,
    numeroReceita: form.numeroReceita.trim() || null,
    crea: form.crea.trim() || null,
  };
}

export function useRastreabilidade() {
  const talhoes = ref<TalhaoDto[]>([]);
  const talhao = ref<TalhaoDto | null>(null);
  const aplicacoes = ref<AplicacaoInsumoDto[]>([]);
  const aplicacao = ref<AplicacaoInsumoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarTalhoes(): Promise<void> {
    carregando.value = true;

    try {
      talhoes.value = await rastreabilidadeService.listarTalhoes();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterTalhao(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      talhao.value = await rastreabilidadeService.obterTalhao(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarTalhao(form: TalhaoFormModel): Promise<TalhaoDto | null> {
    salvando.value = true;

    try {
      const criado = await rastreabilidadeService.criarTalhao(talhaoFormParaPayload(form));
      sucesso('Talhão cadastrado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarTalhao(id: string, form: TalhaoFormModel): Promise<TalhaoDto | null> {
    salvando.value = true;

    try {
      const atualizado = await rastreabilidadeService.editarTalhao(
        id,
        talhaoFormParaPayload(form),
      );
      sucesso('Talhão atualizado.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function inativarTalhao(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar talhão',
      mensagem: 'Deseja inativar este talhão?',
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await rastreabilidadeService.inativarTalhao(id);
      sucesso('Talhão inativado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarAplicacoes(): Promise<void> {
    carregando.value = true;

    try {
      aplicacoes.value = await rastreabilidadeService.listarAplicacoes();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterAplicacao(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      aplicacao.value = await rastreabilidadeService.obterAplicacao(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarAplicacao(
    form: AplicacaoInsumoFormModel,
  ): Promise<AplicacaoInsumoDto | null> {
    salvando.value = true;

    try {
      const criada = await rastreabilidadeService.criarAplicacao(
        aplicacaoFormParaPayload(form),
      );
      sucesso('Aplicação registrada.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarAplicacao(
    id: string,
    form: AplicacaoInsumoFormModel,
  ): Promise<AplicacaoInsumoDto | null> {
    salvando.value = true;

    try {
      const atualizada = await rastreabilidadeService.editarAplicacao(
        id,
        aplicacaoFormParaPayload(form),
      );
      sucesso('Aplicação atualizada.');
      return atualizada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function removerAplicacao(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover aplicação',
      mensagem: 'Deseja remover esta aplicação de insumo?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await rastreabilidadeService.removerAplicacao(id);
      sucesso('Aplicação removida.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    talhoes,
    talhao,
    aplicacoes,
    aplicacao,
    carregando,
    salvando,
    carregarTalhoes,
    obterTalhao,
    criarTalhao,
    editarTalhao,
    inativarTalhao,
    carregarAplicacoes,
    obterAplicacao,
    criarAplicacao,
    editarAplicacao,
    removerAplicacao,
  };
}
