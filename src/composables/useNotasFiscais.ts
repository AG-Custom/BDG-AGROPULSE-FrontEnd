import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService, type EmitirNfePayload } from 'services/fiscal-gestao.service';
import type {
  CancelarNotaFormModel,
  CceFormModel,
  EmitirCteFormModel,
  EmitirMdfeFormModel,
  ParteTransporteFormModel,
  ListarNotasFiscaisParams,
  NotaFiscalGestaoDto,
} from 'types/dtos/fiscal-gestao.dto';
import { baixarArquivo } from 'utils/download';
import { parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

function parte(form: ParteTransporteFormModel) {
  return {
    documento: form.documento.trim(),
    nome: form.nome.trim(),
    logradouro: form.logradouro.trim(),
    numero: form.numero.trim(),
    bairro: form.bairro.trim(),
    cep: form.cep.trim(),
    codigoMunicipio: form.codigoMunicipio.trim(),
    municipio: form.municipio.trim(),
    uf: form.uf.trim(),
  };
}

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

  async function emitirNfe(pedidoId: string, payload: EmitirNfePayload): Promise<boolean> {
    salvando.value = true;
    try {
      const nota = await fiscalGestaoService.emitirNfe(pedidoId, payload);
      sucesso(`NF-e: ${nota.status}. ${nota.mensagemErro ?? ''}`);
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
        naturezaOperacao: form.naturezaOperacao.trim(),
        cfop: form.cfop.trim(),
        codigoMunicipioEnvio: form.codigoMunicipioEnvio.trim(),
        municipioEnvio: form.municipioEnvio.trim(),
        ufEnvio: form.ufEnvio.trim(),
        codigoMunicipioInicio: form.codigoMunicipioInicio.trim(),
        municipioInicio: form.municipioInicio.trim(),
        ufInicio: form.ufInicio.trim(),
        codigoMunicipioFim: form.codigoMunicipioFim.trim(),
        municipioFim: form.municipioFim.trim(),
        ufFim: form.ufFim.trim(),
        remetente: parte(form.remetente),
        destinatario: parte(form.destinatario),
        valorServico: parseMascaraMoeda(form.valorServico) ?? 0,
        aliquotaIcms: Number(form.aliquotaIcms.replace(',', '.')) || 0,
        valorIcms: parseMascaraMoeda(form.valorIcms) ?? 0,
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
        ufInicio: form.ufInicio.trim(),
        ufFim: form.ufFim.trim(),
        codigoMunicipioCarregamento: form.codigoMunicipioCarregamento.trim(),
        municipioCarregamento: form.municipioCarregamento.trim(),
        codigoMunicipioDescarregamento: form.codigoMunicipioDescarregamento.trim(),
        municipioDescarregamento: form.municipioDescarregamento.trim(),
        placa: form.placa.trim(),
        tara: Number(form.tara) || 0,
        condutorNome: form.condutorNome.trim(),
        condutorCpf: form.condutorCpf.trim(),
        valorCarga: parseMascaraMoeda(form.valorCarga) ?? 0,
        pesoBruto: Number(form.pesoBruto.replace(',', '.')) || 0,
        chaves: form.chaves.split(/[\s,;]+/).map((chave) => chave.trim()).filter(Boolean),
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
        result.status === 'Cancelada' ? 'Cancelamento confirmado pela Focus.' : `Cancelamento ainda não confirmado. ${result.mensagemErro ?? 'Consulte novamente.'}`,
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

  async function abrirDanfe(id: string, modelo?: string): Promise<boolean> {
    const nfce = modelo === 'NFCe';
    try {
      baixarArquivo(
        await fiscalGestaoService.arquivoOficial(id, nfce ? 'html' : 'pdf'),
        nfce ? `danfce-${id}.html` : `danfe-${id}.pdf`,
      );
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    }
  }

  async function baixarXml(id: string): Promise<boolean> {
    try {
      const blob = await fiscalGestaoService.arquivoOficial(id, 'xml');
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
    emitirDevolucao,
    cancelar,
    registrarCce,
    abrirDanfe,
    baixarXml,
  };
}
