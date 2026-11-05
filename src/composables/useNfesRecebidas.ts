import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoManifestacaoSefazValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { FiltroNfeRecebida, NfeRecebidaDto } from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

const manifestacoesFinais = new Set(['confirmacao', 'desconhecimento', 'nao_realizada']);

export function manifestacaoFinal(codigo: string | null): boolean {
  return codigo != null && manifestacoesFinais.has(codigo);
}

export function useNfesRecebidas() {
  const notas = ref<NfeRecebidaDto[]>([]);
  const filtro = ref<FiltroNfeRecebida>('Todas');
  const carregando = ref(false);
  const sincronizando = ref(false);
  const manifestando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      notas.value = await fiscalGestaoService.listarNfesRecebidas(filtro.value);
    } catch (e) {
      erro(mensagem(e));
      notas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function sincronizar(): Promise<void> {
    sincronizando.value = true;
    try {
      await fiscalGestaoService.sincronizarNfesRecebidas();
      sucesso('NF-e recebidas atualizadas.');
      await carregar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      sincronizando.value = false;
    }
  }

  async function manifestarSelecionadas(
    selecionadas: NfeRecebidaDto[],
    tipo: TipoManifestacaoSefazValor,
    justificativa?: string,
  ): Promise<boolean> {
    const chaves = selecionadas
      .filter((nota) => !manifestacaoFinal(nota.manifestacaoDestinatario))
      .map((nota) => nota.chaveNfe);
    if (chaves.length === 0) {
      erro('Nenhuma nota selecionada pode receber nova manifestação.');
      return false;
    }

    manifestando.value = true;
    let falhas = 0;
    let primeiraMensagem = '';
    try {
      for (const chaveAcesso of chaves) {
        try {
          await fiscalGestaoService.manifestar({ chaveAcesso, tipo, justificativa });
        } catch (e) {
          falhas += 1;
          if (!primeiraMensagem) primeiraMensagem = mensagem(e);
        }
      }

      if (falhas === chaves.length) {
        erro(primeiraMensagem);
        return false;
      }

      await carregar();
      if (falhas > 0) {
        erro(`${falhas} de ${chaves.length} manifestações não foram registradas. ${primeiraMensagem}`);
        return false;
      }

      sucesso(
        chaves.length === 1
          ? 'Manifestação registrada.'
          : `${chaves.length} manifestações registradas.`,
      );
      return true;
    } finally {
      manifestando.value = false;
    }
  }

  return {
    notas,
    filtro,
    carregando,
    sincronizando,
    manifestando,
    carregar,
    sincronizar,
    manifestarSelecionadas,
  };
}
