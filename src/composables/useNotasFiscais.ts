import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type {
  CancelarNotaFormModel,
  CceFormModel,
  ComplementarFormModel,
  EmitirCteFormModel,
  EmitirMdfeFormModel,
  EmitirNfprFormModel,
  ListarNotasFiscaisParams,
  NotaFiscalGestaoDto,
} from 'types/dtos/fiscal-gestao.dto';
import { baixarArquivo } from 'utils/download';
import { ref } from 'vue';

export function useNotasFiscais() {
  const notas = ref<NotaFiscalGestaoDto[]>([]);
  const notaAtual = ref<NotaFiscalGestaoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarNotasFiscaisParams): Promise<void> {
    carregando.value = true;
    try {
      notas.value = await fiscalGestaoService.listarNotas(params);
    } catch (e) {
      erro(mensagem(e));
      notas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<NotaFiscalGestaoDto | null> {
    carregando.value = true;
    try {
      notaAtual.value = await fiscalGestaoService.obterNota(id);
      return notaAtual.value;
    } catch (e) {
      erro(mensagem(e));
      notaAtual.value = null;
      return null;
    } finally {
      carregando.value = false;
    }
  }

  async function emitirNfe(pedidoId: string): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirNfe(pedidoId);
      sucesso('NF-e emitida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function emitirNfce(pdvVendaId: string): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirNfce(pdvVendaId);
      sucesso('NFC-e emitida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function emitirCte(form: EmitirCteFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirCte({
        remetente: form.remetente.trim(),
        destinatario: form.destinatario.trim(),
        valor: Number(form.valor),
        ufDestino: form.ufDestino.trim() || null,
      });
      sucesso('CT-e emitido.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function emitirMdfe(form: EmitirMdfeFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirMdfe({
        veiculo: form.veiculo.trim(),
        ufInicio: form.ufInicio.trim(),
        ufFim: form.ufFim.trim(),
        valorCarga: Number(form.valorCarga),
      });
      sucesso('MDF-e emitido.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function emitirNfpr(form: EmitirNfprFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirNfpr({
        clienteId: form.clienteId.trim(),
        itens: [
          {
            produtoId: form.produtoId.trim(),
            quantidade: Number(form.quantidade),
            valor: Number(form.valor),
          },
        ],
        cultura: form.cultura.trim() || null,
        safra: form.safra.trim() || null,
      });
      sucesso('NFPR emitida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function emitirDevolucao(devolucaoId: string): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirNfeDevolucao(devolucaoId);
      sucesso('NF-e de devolução emitida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(id: string, form: CancelarNotaFormModel): Promise<boolean> {
    if (form.motivo.trim().length < 15) {
      erro('Motivo do cancelamento deve ter ao menos 15 caracteres.');
      return false;
    }
    salvando.value = true;
    try {
      const result = await fiscalGestaoService.cancelarNota(id, {
        motivo: form.motivo.trim(),
      });
      sucesso(
        result.reverterEstoque
          ? 'Nota cancelada (reversão de estoque stub).'
          : 'Nota cancelada.',
      );
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarCce(id: string, form: CceFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.registrarCce(id, {
        textoCorrecao: form.textoCorrecao.trim(),
      });
      sucesso('Carta de correção registrada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function complementar(id: string, form: ComplementarFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.emitirComplementar(id, {
        valorAdicional: Number(form.valorAdicional),
        motivo: form.motivo.trim(),
      });
      sucesso('Nota complementar emitida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function abrirDanfe(id: string): Promise<boolean> {
    try {
      const danfe = await fiscalGestaoService.obterDanfe(id);
      const janela = window.open('', '_blank');
      if (janela) {
        janela.document.write(danfe.html);
        janela.document.close();
      } else {
        const blob = new Blob([danfe.html], { type: 'text/html;charset=utf-8' });
        baixarArquivo(blob, `danfe-${id}.html`);
      }
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    }
  }

  async function baixarXml(id: string): Promise<boolean> {
    try {
      const xml = await fiscalGestaoService.obterXml(id);
      const blob = new Blob([xml.xml], { type: 'application/xml;charset=utf-8' });
      baixarArquivo(blob, `nota-${id}.xml`);
      sucesso('XML baixado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    }
  }

  return {
    notas,
    notaAtual,
    carregando,
    salvando,
    carregar,
    obter,
    emitirNfe,
    emitirNfce,
    emitirCte,
    emitirMdfe,
    emitirNfpr,
    emitirDevolucao,
    cancelar,
    registrarCce,
    complementar,
    abrirDanfe,
    baixarXml,
  };
}
