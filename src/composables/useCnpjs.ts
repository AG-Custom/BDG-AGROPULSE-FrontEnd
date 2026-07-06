import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { cnpjService } from 'services/cnpj.service';
import type { CnpjEmpresaDto, CnpjFormModel } from 'types/dtos/cnpj.dto';
import { formParaCriarPayload } from 'utils/mappers/cnpj.mapper';
import { ref } from 'vue';

export function useCnpjs() {
  const cnpjs = ref<CnpjEmpresaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      cnpjs.value = await cnpjService.listar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: CnpjFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await cnpjService.criar(formParaCriarPayload(form));
      sucesso('CNPJ cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    cnpjs,
    carregando,
    salvando,
    carregar,
    criar,
  };
}
