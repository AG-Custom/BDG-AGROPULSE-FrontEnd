import { useAuth } from 'composables/useAuth';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { storeToRefs } from 'pinia';
import { usePlataformaStore } from 'stores/plataforma.store';
import type {
  AtualizarEmpresaPlataformaPayload,
  CriarEmpresaPlataformaPayload,
  DocumentosEmpresaFormModel,
} from 'types/dtos/plataforma.dto';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function usePlataforma() {
  const store = usePlataformaStore();
  const router = useRouter();
  const { selecionarEmpresa, precisaSelecionarUnidade } = useAuth();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const { empresas, detalhe, carregando } = storeToRefs(store);
  const salvando = ref(false);
  const acessandoId = ref<string | null>(null);

  async function carregar(): Promise<void> {
    try {
      await store.listarEmpresas();
    } catch (e) {
      erro(mensagem(e));
    }
  }

  async function carregarDetalhe(empresaId: string): Promise<boolean> {
    try {
      await store.obterEmpresa(empresaId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    }
  }

  async function enviarDocumentos(
    empresaId: string,
    documentos: DocumentosEmpresaFormModel,
  ): Promise<boolean> {
    try {
      if (documentos.arquivoFicha) {
        await store.enviarFichaCliente(empresaId, documentos.arquivoFicha);
      }

      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    }
  }

  async function criar(
    payload: CriarEmpresaPlataformaPayload,
    documentos: DocumentosEmpresaFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      const resposta = await store.criarEmpresa(payload);
      const documentosOk = await enviarDocumentos(resposta.empresaId, documentos);

      if (!documentosOk) {
        erro('Empresa criada, mas os arquivos não foram enviados. Complete na edição.');
        await router.replace({ name: 'plataforma-empresa-editar', params: { id: resposta.empresaId } });
        return false;
      }

      sucesso(resposta.message);
      await router.replace({ name: 'plataforma' });
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function atualizar(
    empresaId: string,
    payload: AtualizarEmpresaPlataformaPayload,
    documentos: DocumentosEmpresaFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      await store.atualizarEmpresa(empresaId, payload);
      const documentosOk = await enviarDocumentos(empresaId, documentos);

      if (!documentosOk) {
        erro('Dados salvos, mas os arquivos não foram atualizados. Tente enviar novamente.');
        return false;
      }

      sucesso('Empresa atualizada.');
      await router.replace({ name: 'plataforma' });
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function acessar(empresaId: string): Promise<boolean> {
    acessandoId.value = empresaId;

    try {
      await selecionarEmpresa(empresaId);

      if (precisaSelecionarUnidade.value) {
        await router.replace({ name: 'selecionar-unidade' });
      } else {
        await router.replace({ name: 'dashboard' });
      }

      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      acessandoId.value = null;
    }
  }

  return {
    empresas,
    detalhe,
    carregando,
    salvando,
    acessandoId,
    carregar,
    carregarDetalhe,
    criar,
    atualizar,
    acessar,
  };
}
