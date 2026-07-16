import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { producaoService } from 'services/producao.service';
import type {
  CriarParadaLinhaPayload,
  ParadaLinhaDto,
  ParadaLinhaFormModel,
  ResolverParadaLinhaPayload,
} from 'types/dtos/producao.dto';
import { ref } from 'vue';

function formParaPayload(form: ParadaLinhaFormModel): CriarParadaLinhaPayload {
  return {
    ordemProducaoId: form.ordemProducaoId,
    causa: form.causa.trim(),
    inicio: form.inicio,
    fim: form.fim || null,
    impactoUnidades: form.impactoUnidades ? Number(form.impactoUnidades) : null,
    equipamento: form.equipamento.trim() || null,
  };
}

export function useParadas() {
  const paradas = ref<ParadaLinhaDto[]>([]);
  const parada = ref<ParadaLinhaDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      paradas.value = await producaoService.listarParadas();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      parada.value = await producaoService.obterParada(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ParadaLinhaFormModel): Promise<ParadaLinhaDto | null> {
    salvando.value = true;
    try {
      const criada = await producaoService.criarParada(formParaPayload(form));
      sucesso('Parada registrada.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    id: string,
    form: ParadaLinhaFormModel,
  ): Promise<ParadaLinhaDto | null> {
    salvando.value = true;
    try {
      const atualizada = await producaoService.editarParada(id, formParaPayload(form));
      sucesso('Parada atualizada.');
      return atualizada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function resolver(
    id: string,
    payload?: ResolverParadaLinhaPayload,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      const atualizada = await producaoService.resolverParada(id, payload);
      sucesso('Parada resolvida.');
      const idx = paradas.value.findIndex((p) => p.id === id);
      if (idx >= 0) paradas.value[idx] = atualizada;
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover parada',
      mensagem: 'Deseja remover este registro de parada?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await producaoService.removerParada(id);
      sucesso('Parada removida.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    paradas,
    parada,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    resolver,
    remover,
  };
}
