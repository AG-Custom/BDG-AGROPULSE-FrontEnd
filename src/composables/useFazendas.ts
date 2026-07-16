import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type {
  FazendaDto,
  FazendaFormModel,
  ImportarGeoFormModel,
} from 'types/dtos/safras.dto';
import type { TipoGeoImportacaoValor } from 'constants/enums';
import { computed, ref } from 'vue';

function formParaPayload(form: FazendaFormModel) {
  return {
    nome: form.nome.trim(),
    clienteId: form.clienteId.trim() || null,
    municipio: form.municipio.trim() || null,
    uf: form.uf.trim() || null,
    areaTotalHa: form.areaTotalHa.trim() ? Number(form.areaTotalHa) : null,
  };
}

export function useFazendas() {
  const fazendas = ref<FazendaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const fazendaOpcoes = computed(() =>
    fazendas.value
      .filter((f) => f.ativo)
      .map((f) => ({ label: f.nome, value: f.id })),
  );

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      fazendas.value = await safrasService.listarFazendas();
    } catch (e) {
      erro(mensagem(e));
      fazendas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: FazendaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.criarFazenda(formParaPayload(form));
      sucesso('Fazenda cadastrada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: FazendaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.editarFazenda(id, formParaPayload(form));
      sucesso('Fazenda atualizada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar fazenda',
      mensagem: 'Deseja inativar esta fazenda?',
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.inativarFazenda(id);
      sucesso('Fazenda inativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function importarGeo(form: ImportarGeoFormModel): Promise<boolean> {
    if (!form.tipo) return false;
    salvando.value = true;
    try {
      await safrasService.importarGeo({
        fileName: form.nomeArquivo.trim() || null,
        tipoArquivo: form.tipo as TipoGeoImportacaoValor,
        conteudoBase64: null,
      });
      sucesso('Importação geo enviada (stub).');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    fazendas,
    fazendaOpcoes,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    inativar,
    importarGeo,
  };
}
