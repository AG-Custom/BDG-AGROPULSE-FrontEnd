import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type {
  ConfigFunruralDto,
  ConfigFunruralFormModel,
  FunruralCalculoDto,
} from 'types/dtos/fiscal-gestao.dto';
import { parseMascaraMoedaObrigatorio } from 'utils/formatters';
import { ref } from 'vue';

function toNumber(value: string): number {
  return Number(String(value).replace(',', '.'));
}

export function useFunrural() {
  const config = ref<ConfigFunruralDto | null>(null);
  const calculo = ref<FunruralCalculoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const calculando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      config.value = await fiscalGestaoService.obterFunrural();
    } catch (e) {
      erro(mensagem(e));
      config.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function salvar(form: ConfigFunruralFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      config.value = await fiscalGestaoService.salvarFunrural({
        aliquotaFunrural: toNumber(form.aliquotaFunrural),
        aliquotaGilrat: toNumber(form.aliquotaGilrat),
        aliquotaSenar: toNumber(form.aliquotaSenar),
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('Configuração Funrural salva.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function calcular(baseCalculo: string, isProdutorRural: boolean): Promise<boolean> {
    calculando.value = true;
    try {
      calculo.value = await fiscalGestaoService.calcularFunrural({
        baseCalculo: parseMascaraMoedaObrigatorio(baseCalculo),
        isProdutorRural,
      });
      sucesso('Cálculo Funrural concluído.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      calculo.value = null;
      return false;
    } finally {
      calculando.value = false;
    }
  }

  return {
    config,
    calculo,
    carregando,
    salvando,
    calculando,
    carregar,
    salvar,
    calcular,
  };
}
