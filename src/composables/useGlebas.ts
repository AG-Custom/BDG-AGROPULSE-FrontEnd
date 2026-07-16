import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type {
  GlebaDto,
  GlebaFormModel,
  ListarGlebasParams,
} from 'types/dtos/safras.dto';
import { computed, ref } from 'vue';

export function useGlebas() {
  const glebas = ref<GlebaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const glebaOpcoes = computed(() =>
    glebas.value
      .filter((g) => g.ativo)
      .map((g) => ({ label: g.nome, value: g.id })),
  );

  async function carregar(params?: ListarGlebasParams): Promise<void> {
    carregando.value = true;
    try {
      glebas.value = await safrasService.listarGlebas(params);
    } catch (e) {
      erro(mensagem(e));
      glebas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: GlebaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.criarGleba({
        fazendaId: form.fazendaId,
        nome: form.nome.trim(),
        areaHa: form.areaHa.trim() ? Number(form.areaHa) : null,
      });
      sucesso('Gleba cadastrada.');
      await carregar(form.fazendaId ? { fazendaId: form.fazendaId } : undefined);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: GlebaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.editarGleba(id, {
        nome: form.nome.trim(),
        areaHa: form.areaHa.trim() ? Number(form.areaHa) : null,
      });
      sucesso('Gleba atualizada.');
      await carregar(form.fazendaId ? { fazendaId: form.fazendaId } : undefined);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(id: string, fazendaId?: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar gleba',
      mensagem: 'Deseja inativar esta gleba?',
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.inativarGleba(id);
      sucesso('Gleba inativada.');
      await carregar(fazendaId ? { fazendaId } : undefined);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    glebas,
    glebaOpcoes,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    inativar,
  };
}
