import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoAtividadeDiarioCampoValor } from 'constants/enums';
import { safrasService } from 'services/safras.service';
import type { DiarioCampoDto, DiarioCampoFormModel } from 'types/dtos/safras.dto';
import { ref } from 'vue';

function gerarClientSyncId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `sync-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useDiarioCampo() {
  const entradas = ref<DiarioCampoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      entradas.value = await safrasService.listarDiarioCampo();
    } catch (e) {
      erro(mensagem(e));
      entradas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: DiarioCampoFormModel): Promise<boolean> {
    if (!form.tipoAtividade) return false;
    salvando.value = true;
    try {
      await safrasService.criarDiarioCampo({
        data: form.data,
        tipoAtividade: form.tipoAtividade as TipoAtividadeDiarioCampoValor,
        descricao: form.descricao.trim(),
        talhaoId: form.talhaoId.trim() || null,
        safraId: form.safraId.trim() || null,
        clientSyncId: gerarClientSyncId(),
      });
      sucesso('Entrada do diário registrada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    entradas,
    carregando,
    salvando,
    carregar,
    criar,
  };
}
