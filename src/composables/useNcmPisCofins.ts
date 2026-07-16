import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { NcmPisCofinsDto, NcmPisCofinsFormModel } from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

function toNumber(value: string): number {
  return Number(String(value).replace(',', '.'));
}

export function useNcmPisCofins() {
  const itens = ref<NcmPisCofinsDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      itens.value = await fiscalGestaoService.listarNcmPisCofins();
    } catch (e) {
      erro(mensagem(e));
      itens.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: NcmPisCofinsFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.criarNcmPisCofins({
        ncm: form.ncm.trim(),
        cstPis: form.cstPis.trim(),
        cstCofins: form.cstCofins.trim(),
        aliquotaPis: toNumber(form.aliquotaPis),
        aliquotaCofins: toNumber(form.aliquotaCofins),
        suspenso: form.suspenso,
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('Regra PIS/COFINS criada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: NcmPisCofinsFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.editarNcmPisCofins(id, {
        cstPis: form.cstPis.trim(),
        cstCofins: form.cstCofins.trim(),
        aliquotaPis: toNumber(form.aliquotaPis),
        aliquotaCofins: toNumber(form.aliquotaCofins),
        suspenso: form.suspenso,
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('Regra PIS/COFINS atualizada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { itens, carregando, salvando, carregar, criar, editar };
}
