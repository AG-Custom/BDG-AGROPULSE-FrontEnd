import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { devolucaoVendaService } from 'services/devolucao-venda.service';
import type {
  CriarDevolucaoVendaPayload,
  DevolucaoVendaDto,
  DevolucaoVendaFormModel,
  ListarDevolucoesVendaParams,
  OrigemDevolucaoDto,
} from 'types/dtos/devolucao-venda.dto';
import type {
  DestinoCreditoDevolucaoValor,
  DestinoDevolucaoValor,
} from 'constants/enums';
import { DestinoDevolucao } from 'constants/enums';
import { ref } from 'vue';

function formParaPayload(form: DevolucaoVendaFormModel): CriarDevolucaoVendaPayload {
  return {
    pedidoVendaId: form.pedidoVendaId,
    observacao: form.observacao.trim() || null,
    destinoCredito: (form.destinoCredito || null) as DestinoCreditoDevolucaoValor | null,
    notaFiscalNumero: form.buscaNf.trim() || null,
    itens: form.itens.map((item) => ({
      produtoId: item.produtoId,
      quantidade: Number(item.quantidade),
      destino: item.destino as DestinoDevolucaoValor,
      loteId: item.loteId.trim() || null,
      numeroLote: item.numeroLote.trim() || null,
      justificativaDescarte:
        item.destino === DestinoDevolucao.Descarte
          ? item.justificativaDescarte.trim() || null
          : null,
    })),
  };
}

export function useDevolucoesVenda() {
  const devolucoes = ref<DevolucaoVendaDto[]>([]);
  const devolucao = ref<DevolucaoVendaDto | null>(null);
  const origem = ref<OrigemDevolucaoDto | null>(null);
  const carregando = ref(false);
  const buscandoOrigem = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarDevolucoesVendaParams): Promise<void> {
    carregando.value = true;

    try {
      devolucoes.value = await devolucaoVendaService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      devolucao.value = await devolucaoVendaService.obter(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function buscarOrigemPorNf(busca: string): Promise<OrigemDevolucaoDto | null> {
    const valor = busca.trim();
    if (!valor) {
      return null;
    }

    buscandoOrigem.value = true;

    try {
      const pareceChave = valor.replace(/\D/g, '').length >= 44;
      origem.value = await devolucaoVendaService.buscarOrigem(
        pareceChave ? { chaveNf: valor } : { numeroNf: valor },
      );
      sucesso('Origem da NF localizada.');
      return origem.value;
    } catch (e) {
      origem.value = null;
      erro(mensagem(e));
      return null;
    } finally {
      buscandoOrigem.value = false;
    }
  }

  async function criar(form: DevolucaoVendaFormModel): Promise<DevolucaoVendaDto | null> {
    salvando.value = true;

    try {
      const criada = await devolucaoVendaService.criar(formParaPayload(form));
      sucesso('Devolução registrada com sucesso.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function processar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Processar devolução',
      mensagem: 'Confirma o processamento desta devolução?',
      textoConfirmar: 'Processar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      devolucao.value = await devolucaoVendaService.processar(id);
      sucesso('Devolução processada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    devolucoes,
    devolucao,
    origem,
    carregando,
    buscandoOrigem,
    salvando,
    carregar,
    obter,
    buscarOrigemPorNf,
    criar,
    processar,
  };
}
