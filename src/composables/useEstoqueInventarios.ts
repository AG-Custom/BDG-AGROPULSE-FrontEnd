import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { estoqueService } from 'services/estoque.service';
import type {
  ContagemInventarioFormModel,
  IniciarInventarioPayload,
  InventarioDto,
} from 'types/dtos/estoque.dto';
import { formParaContagemPayload } from 'utils/mappers/estoque.mapper';
import { ref } from 'vue';

export function useEstoqueInventarios() {
  const inventarios = ref<InventarioDto[]>([]);
  const inventario = ref<InventarioDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      inventarios.value = await estoqueService.listarInventarios();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(inventarioId: string): Promise<boolean> {
    carregando.value = true;

    try {
      inventario.value = await estoqueService.obterInventario(inventarioId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function iniciar(payload?: IniciarInventarioPayload): Promise<InventarioDto | null> {
    salvando.value = true;

    try {
      const criado = await estoqueService.iniciarInventario(payload);
      sucesso('Inventário iniciado com sucesso.');
      await carregar();
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarContagem(
    inventarioId: string,
    itemId: string,
    form: ContagemInventarioFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      inventario.value = await estoqueService.registrarContagem(
        inventarioId,
        itemId,
        formParaContagemPayload(form),
      );
      sucesso('Contagem registrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarConclusao(inventarioId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Concluir inventário',
      mensagem:
        'Ao concluir, as diferenças serão convertidas em ajustes automáticos de estoque. Deseja continuar?',
      textoConfirmar: 'Concluir',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      inventario.value = await estoqueService.concluirInventario(inventarioId);
      sucesso('Inventário concluído com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    inventarios,
    inventario,
    carregando,
    salvando,
    carregar,
    obter,
    iniciar,
    registrarContagem,
    solicitarConclusao,
  };
}
