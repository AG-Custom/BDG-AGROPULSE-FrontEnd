import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { ModeloDocumentoFiscalValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type {
  InutilizacaoFormModel,
  NumeracaoInutilizadaDto,
} from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

export function useInutilizacoesFiscais() {
  const inutilizacoes = ref<NumeracaoInutilizadaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      inutilizacoes.value = await fiscalGestaoService.listarInutilizacoes();
    } catch (e) {
      erro(mensagem(e));
      inutilizacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: InutilizacaoFormModel): Promise<boolean> {
    if (!form.modeloDocumento) {
      erro('Selecione o modelo do documento.');
      return false;
    }
    salvando.value = true;
    try {
      await fiscalGestaoService.criarInutilizacao({
        serie: form.serie.trim(),
        numeroInicial: Number(form.numeroInicial),
        numeroFinal: Number(form.numeroFinal),
        justificativa: form.justificativa.trim(),
        modeloDocumento: form.modeloDocumento as ModeloDocumentoFiscalValor,
      });
      sucesso('Inutilização registrada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { inutilizacoes, carregando, salvando, carregar, criar };
}
