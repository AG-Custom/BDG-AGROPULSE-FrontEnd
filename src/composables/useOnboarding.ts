import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { storeToRefs } from 'pinia';
import { useOnboardingStore } from 'stores/onboarding.store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useOnboarding() {
  const store = useOnboardingStore();
  const router = useRouter();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const { empresa, unidades } = storeToRefs(store);
  const salvando = ref(false);

  function adicionarUnidade(): void {
    store.adicionarUnidade();
  }

  function removerUnidade(id: string): void {
    store.removerUnidade(id);
  }

  function definirMatriz(id: string): void {
    store.definirMatriz(id);
  }

  function validarUnidades(): string | null {
    const matrizes = unidades.value.filter((u) => u.matriz);
    if (matrizes.length !== 1) {
      return 'Selecione exatamente uma unidade como matriz.';
    }

    const codigos = unidades.value.map((u) => u.codigo.trim().toLowerCase());
    const codigosUnicos = new Set(codigos.filter(Boolean));
    if (codigosUnicos.size !== codigos.filter(Boolean).length) {
      return 'Os códigos das unidades devem ser únicos.';
    }

    return null;
  }

  async function salvar(): Promise<boolean> {
    const erroValidacao = validarUnidades();
    if (erroValidacao) {
      erro(erroValidacao);
      return false;
    }

    salvando.value = true;

    try {
      const resposta = await store.salvarEmpresa();
      sucesso(resposta.message);
      await router.replace({ name: 'dashboard' });
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    empresa,
    unidades,
    salvando,
    adicionarUnidade,
    removerUnidade,
    definirMatriz,
    salvar,
  };
}
