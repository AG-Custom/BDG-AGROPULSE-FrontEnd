import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { MvaNcmUfDto, MvaNcmUfFormModel } from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

function toNumber(value: string): number {
  return Number(String(value).replace(',', '.'));
}

export function useMvaNcmUf() {
  const itens = ref<MvaNcmUfDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      itens.value = await fiscalGestaoService.listarMvaNcmUf();
    } catch (e) {
      erro(mensagem(e));
      itens.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: MvaNcmUfFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.criarMvaNcmUf({
        ncm: form.ncm.trim(),
        ufOrigem: form.ufOrigem.trim().toUpperCase(),
        ufDestino: form.ufDestino.trim().toUpperCase(),
        mva: toNumber(form.mva),
        aliquotaInterna: toNumber(form.aliquotaInterna),
        aliquotaInterestadual: toNumber(form.aliquotaInterestadual),
        aliquotaFcp: toNumber(form.aliquotaFcp),
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('MVA NCM/UF criado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: MvaNcmUfFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.editarMvaNcmUf(id, {
        mva: toNumber(form.mva),
        aliquotaInterna: toNumber(form.aliquotaInterna),
        aliquotaInterestadual: toNumber(form.aliquotaInterestadual),
        aliquotaFcp: toNumber(form.aliquotaFcp),
        vigenciaInicio: form.vigenciaInicio,
        vigenciaFim: form.vigenciaFim || null,
      });
      sucesso('MVA NCM/UF atualizado.');
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
