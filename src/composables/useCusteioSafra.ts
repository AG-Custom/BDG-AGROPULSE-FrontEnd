import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { CategoriaCusteioSafraValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type {
  CusteioResumoDto,
  CusteioSafraDto,
  CusteioSafraFormModel,
  ListarCusteiosParams,
  ProdutividadeSafraDto,
} from 'types/dtos/safras.dto';
import { ref } from 'vue';

export function useCusteioSafra() {
  const custeios = ref<CusteioSafraDto[]>([]);
  const resumo = ref<CusteioResumoDto | null>(null);
  const produtividade = ref<ProdutividadeSafraDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarCusteiosParams): Promise<void> {
    carregando.value = true;
    try {
      const [lista, resumoApi] = await Promise.all([
        safrasService.listarCusteios(params),
        safrasService.obterResumoCusteio(params),
      ]);
      custeios.value = lista;
      resumo.value = resumoApi;
    } catch (e) {
      erro(mensagem(e));
      custeios.value = [];
      resumo.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function carregarProdutividade(safraId: string): Promise<void> {
    try {
      produtividade.value = await safrasService.obterProdutividade(safraId);
    } catch (e) {
      erro(mensagem(e));
      produtividade.value = null;
    }
  }

  async function criar(form: CusteioSafraFormModel): Promise<boolean> {
    if (!form.categoria) return false;
    salvando.value = true;
    try {
      await safrasService.criarCusteio({
        safraId: form.safraId,
        talhaoId: form.talhaoId.trim() || null,
        categoria: form.categoria as CategoriaCusteioSafraValor,
        descricao: form.descricao.trim(),
        valor: Number(form.valor),
        data: form.data || null,
        quantidade: form.quantidade.trim() ? Number(form.quantidade) : null,
        unidade: form.unidade.trim() || null,
      });
      sucesso('Custeio registrado.');
      await carregar({
        safraId: form.safraId || undefined,
        talhaoId: form.talhaoId || undefined,
      });
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(id: string, params?: ListarCusteiosParams): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover custeio',
      mensagem: 'Deseja remover este item de custeio?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.removerCusteio(id);
      sucesso('Custeio removido.');
      await carregar(params);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    custeios,
    resumo,
    produtividade,
    carregando,
    salvando,
    carregar,
    carregarProdutividade,
    criar,
    remover,
  };
}
