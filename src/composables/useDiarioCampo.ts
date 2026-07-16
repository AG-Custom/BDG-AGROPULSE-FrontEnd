import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoAtividadeDiarioCampoValor } from 'constants/enums';
import { safrasService } from 'services/safras.service';
import type {
  DiarioCampoDto,
  DiarioCampoFormModel,
  DiarioCampoSyncItem,
} from 'types/dtos/safras.dto';
import { ref } from 'vue';

function gerarClientSyncId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `sync-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useDiarioCampo() {
  const entradas = ref<DiarioCampoDto[]>([]);
  const pendentesSync = ref<DiarioCampoSyncItem[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const sincronizando = ref(false);
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
    const clientSyncId = gerarClientSyncId();
    try {
      await safrasService.criarDiarioCampo({
        data: form.data,
        tipoAtividade: form.tipoAtividade as TipoAtividadeDiarioCampoValor,
        descricao: form.descricao.trim(),
        talhaoId: form.talhaoId.trim() || null,
        safraId: form.safraId.trim() || null,
        clientSyncId,
      });
      sucesso('Entrada do diário registrada.');
      await carregar();
      return true;
    } catch (e) {
      pendentesSync.value.push({
        clientSyncId,
        data: form.data,
        tipoAtividade: form.tipoAtividade as TipoAtividadeDiarioCampoValor,
        descricao: form.descricao.trim(),
        talhaoId: form.talhaoId.trim() || null,
        safraId: form.safraId.trim() || null,
      });
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function enfileirarOffline(form: DiarioCampoFormModel): void {
    if (!form.tipoAtividade) return;
    pendentesSync.value.push({
      clientSyncId: gerarClientSyncId(),
      data: form.data,
      tipoAtividade: form.tipoAtividade as TipoAtividadeDiarioCampoValor,
      descricao: form.descricao.trim(),
      talhaoId: form.talhaoId.trim() || null,
      safraId: form.safraId.trim() || null,
    });
    sucesso('Entrada enfileirada para sync offline.');
  }

  async function sincronizar(): Promise<boolean> {
    if (pendentesSync.value.length === 0) {
      const itemStub: DiarioCampoSyncItem = {
        clientSyncId: gerarClientSyncId(),
        data: new Date().toISOString().slice(0, 10),
        tipoAtividade: 'Outro',
        descricao: 'Sync stub — sem pendências locais',
      };
      sincronizando.value = true;
      try {
        await safrasService.syncDiarioCampo([itemStub]);
        sucesso('Sync offline executado (stub).');
        await carregar();
        return true;
      } catch (e) {
        erro(mensagem(e));
        return false;
      } finally {
        sincronizando.value = false;
      }
    }

    sincronizando.value = true;
    try {
      await safrasService.syncDiarioCampo([...pendentesSync.value]);
      pendentesSync.value = [];
      sucesso('Pendências sincronizadas.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      sincronizando.value = false;
    }
  }

  return {
    entradas,
    pendentesSync,
    carregando,
    salvando,
    sincronizando,
    carregar,
    criar,
    enfileirarOffline,
    sincronizar,
  };
}
