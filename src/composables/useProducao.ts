import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { producaoService } from 'services/producao.service';
import type {
  BeneficiamentoLoteDto,
  BeneficiamentoLoteFormModel,
  CriarBeneficiamentoLotePayload,
  CriarOrdemProducaoPayload,
  OrdemProducaoDto,
  OrdemProducaoFormModel,
} from 'types/dtos/producao.dto';
import { ref } from 'vue';

function ordemFormParaPayload(form: OrdemProducaoFormModel): CriarOrdemProducaoPayload {
  return {
    produtoSaidaId: form.produtoSaidaId,
    quantidadePlanejada: Number(form.quantidadePlanejada),
    dataPrevista: form.dataPrevista || null,
    observacao: form.observacao.trim() || null,
    itens: form.itens.map((item) => ({
      produtoInsumoId: item.produtoInsumoId,
      quantidade: Number(item.quantidade),
    })),
  };
}

function beneficiamentoFormParaPayload(
  form: BeneficiamentoLoteFormModel,
): CriarBeneficiamentoLotePayload {
  return {
    produtoEntradaId: form.produtoEntradaId,
    produtoSaidaId: form.produtoSaidaId,
    quantidadeEntrada: Number(form.quantidadeEntrada),
    quantidadeSaida: Number(form.quantidadeSaida),
    observacao: form.observacao.trim() || null,
  };
}

export function useProducao() {
  const ordens = ref<OrdemProducaoDto[]>([]);
  const ordem = ref<OrdemProducaoDto | null>(null);
  const beneficiamentos = ref<BeneficiamentoLoteDto[]>([]);
  const beneficiamento = ref<BeneficiamentoLoteDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarOrdens(): Promise<void> {
    carregando.value = true;

    try {
      ordens.value = await producaoService.listarOrdens();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterOrdem(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      ordem.value = await producaoService.obterOrdem(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarOrdem(form: OrdemProducaoFormModel): Promise<OrdemProducaoDto | null> {
    salvando.value = true;

    try {
      const criada = await producaoService.criarOrdem(ordemFormParaPayload(form));
      sucesso('Ordem de produção criada.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarOrdem(
    id: string,
    form: OrdemProducaoFormModel,
  ): Promise<OrdemProducaoDto | null> {
    salvando.value = true;

    try {
      const atualizada = await producaoService.editarOrdem(id, ordemFormParaPayload(form));
      sucesso('Ordem de produção atualizada.');
      return atualizada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function iniciarOrdem(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Iniciar ordem',
      mensagem: 'Deseja iniciar esta ordem de produção?',
      textoConfirmar: 'Iniciar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      ordem.value = await producaoService.iniciarOrdem(id);
      sucesso('Ordem iniciada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function concluirOrdem(id: string, quantidadeProduzida: number): Promise<boolean> {
    salvando.value = true;

    try {
      ordem.value = await producaoService.concluirOrdem(id, { quantidadeProduzida });
      sucesso('Ordem concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelarOrdem(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar ordem',
      mensagem: 'Deseja cancelar esta ordem de produção?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await producaoService.cancelarOrdem(id);
      sucesso('Ordem cancelada.');
      ordem.value = await producaoService.obterOrdem(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarBeneficiamentos(): Promise<void> {
    carregando.value = true;

    try {
      beneficiamentos.value = await producaoService.listarBeneficiamentos();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterBeneficiamento(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      beneficiamento.value = await producaoService.obterBeneficiamento(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarBeneficiamento(
    form: BeneficiamentoLoteFormModel,
  ): Promise<BeneficiamentoLoteDto | null> {
    salvando.value = true;

    try {
      const criado = await producaoService.criarBeneficiamento(
        beneficiamentoFormParaPayload(form),
      );
      sucesso('Beneficiamento registrado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarBeneficiamento(
    id: string,
    form: BeneficiamentoLoteFormModel,
  ): Promise<BeneficiamentoLoteDto | null> {
    salvando.value = true;

    try {
      const atualizado = await producaoService.editarBeneficiamento(
        id,
        beneficiamentoFormParaPayload(form),
      );
      sucesso('Beneficiamento atualizado.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function removerBeneficiamento(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover beneficiamento',
      mensagem: 'Deseja remover este beneficiamento?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await producaoService.removerBeneficiamento(id);
      sucesso('Beneficiamento removido.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    ordens,
    ordem,
    beneficiamentos,
    beneficiamento,
    carregando,
    salvando,
    carregarOrdens,
    obterOrdem,
    criarOrdem,
    editarOrdem,
    iniciarOrdem,
    concluirOrdem,
    cancelarOrdem,
    carregarBeneficiamentos,
    obterBeneficiamento,
    criarBeneficiamento,
    editarBeneficiamento,
    removerBeneficiamento,
  };
}
