import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { RegimeTributarioValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type {
  RegimeTributarioCnpjDto,
  RegimeTributarioCnpjFormModel,
} from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

export function useRegimesCnpj() {
  const regimes = ref<RegimeTributarioCnpjDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      regimes.value = await fiscalGestaoService.listarRegimesCnpj();
    } catch (e) {
      erro(mensagem(e));
      regimes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: RegimeTributarioCnpjFormModel): Promise<boolean> {
    if (!form.regime) {
      erro('Selecione o regime tributário.');
      return false;
    }
    salvando.value = true;
    try {
      await fiscalGestaoService.criarRegimeCnpj({
        cnpjEmpresaId: form.cnpjEmpresaId.trim(),
        regime: form.regime as RegimeTributarioValor,
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('Regime por CNPJ criado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: RegimeTributarioCnpjFormModel): Promise<boolean> {
    if (!form.regime) {
      erro('Selecione o regime tributário.');
      return false;
    }
    salvando.value = true;
    try {
      await fiscalGestaoService.editarRegimeCnpj(id, {
        cnpjEmpresaId: form.cnpjEmpresaId.trim(),
        regime: form.regime as RegimeTributarioValor,
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('Regime por CNPJ atualizado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { regimes, carregando, salvando, carregar, criar, editar };
}
