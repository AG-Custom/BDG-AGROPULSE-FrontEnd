import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { TipoNotaFiscal, type TipoNotaFiscalValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { NotaFiscalGestaoDto } from 'types/dtos/fiscal-gestao.dto';
import { baixarArquivo } from 'utils/download';
import { computed, ref } from 'vue';

export type FiltroTipoEntradaSaida = 'todos' | TipoNotaFiscalValor;

function dataReferencia(nota: NotaFiscalGestaoDto): string | null {
  return nota.emitidaEm ?? nota.createdAt ?? null;
}

function dentroPeriodo(iso: string | null, de: string, ate: string): boolean {
  if (!iso) return !de && !ate;
  const dia = iso.slice(0, 10);
  if (de && dia < de) return false;
  if (ate && dia > ate) return false;
  return true;
}

export function useNotasEntradaSaida() {
  const notas = ref<NotaFiscalGestaoDto[]>([]);
  const carregando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const busca = ref('');
  const filtroTipo = ref<FiltroTipoEntradaSaida>('todos');
  const entradaDe = ref('');
  const entradaAte = ref('');
  const saidaDe = ref('');
  const saidaAte = ref('');

  const filtradas = computed(() => {
    const termo = busca.value.trim().toLowerCase();
    return notas.value.filter((n) => {
      const tipo = String(n.tipo);
      if (filtroTipo.value !== 'todos' && tipo !== filtroTipo.value) return false;

      if (tipo === TipoNotaFiscal.Entrada) {
        if (!dentroPeriodo(dataReferencia(n), entradaDe.value, entradaAte.value)) return false;
      } else if (tipo === TipoNotaFiscal.Saida) {
        if (!dentroPeriodo(dataReferencia(n), saidaDe.value, saidaAte.value)) return false;
      }

      if (!termo) return true;
      const haystack = [
        n.numero,
        n.serie,
        n.chaveAcesso,
        n.naturezaOperacao,
        n.cfop,
        n.ufDestino,
        n.tipoDestinatario,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(termo);
    });
  });

  const kpis = computed(() => {
    const entradas = filtradas.value.filter((n) => String(n.tipo) === TipoNotaFiscal.Entrada);
    const saidas = filtradas.value.filter((n) => String(n.tipo) === TipoNotaFiscal.Saida);
    const totalEntradas = entradas.reduce((s, n) => s + (n.valorTotal ?? 0), 0);
    const totalSaidas = saidas.reduce((s, n) => s + (n.valorTotal ?? 0), 0);
    return {
      qtdEntradas: entradas.length,
      qtdSaidas: saidas.length,
      totalEntradas,
      totalSaidas,
    };
  });

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      const tipo =
        filtroTipo.value === 'todos' ? undefined : filtroTipo.value;
      notas.value = await fiscalGestaoService.listarNotas({ tipo });
    } catch (e) {
      erro(mensagem(e));
      notas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  function limparFiltros(): void {
    busca.value = '';
    filtroTipo.value = 'todos';
    entradaDe.value = '';
    entradaAte.value = '';
    saidaDe.value = '';
    saidaAte.value = '';
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
    filtradas,
    kpis,
    carregando,
    busca,
    filtroTipo,
    entradaDe,
    entradaAte,
    saidaDe,
    saidaAte,
    carregar,
    limparFiltros,
    baixarXml,
  };
}
