import { useNotificacao } from 'composables/useNotificacao';
import { viacepService } from 'services/viacep.service';
import { isViaCepNaoEncontrado } from 'types/api/viacep.dto';
import { apenasDigitos } from 'utils/formatters';
import { type Ref, ref, watch } from 'vue';

export interface EnderecoViaCepForm {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
}

export function useBuscaCep(formulario: Ref<EnderecoViaCepForm>) {
  const buscandoCep = ref(false);
  const ultimoCepConsultado = ref('');
  const { erro } = useNotificacao();

  async function consultarCep(cepDigitos: string): Promise<void> {
    if (cepDigitos.length !== 8 || cepDigitos === ultimoCepConsultado.value) {
      return;
    }

    buscandoCep.value = true;

    try {
      const resultado = await viacepService.buscar(cepDigitos);
      ultimoCepConsultado.value = cepDigitos;

      if (isViaCepNaoEncontrado(resultado)) {
        erro('CEP não encontrado.');
        return;
      }

      if (resultado.logradouro) {
        formulario.value.logradouro = resultado.logradouro;
      }

      if (resultado.bairro) {
        formulario.value.bairro = resultado.bairro;
      }

      if (resultado.localidade) {
        formulario.value.cidade = resultado.localidade;
      }

      if (resultado.uf) {
        formulario.value.estado = resultado.uf;
      }

      if (resultado.complemento && !formulario.value.complemento?.trim()) {
        formulario.value.complemento = resultado.complemento;
      }
    } catch {
      ultimoCepConsultado.value = '';
      erro('Não foi possível consultar o CEP. Tente novamente.');
    } finally {
      buscandoCep.value = false;
    }
  }

  async function buscarSeCepValido(): Promise<void> {
    await consultarCep(apenasDigitos(formulario.value.cep));
  }

  function resetarConsultaCep(): void {
    ultimoCepConsultado.value = '';
  }

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  watch(
    () => apenasDigitos(formulario.value.cep),
    (cepDigitos) => {
      clearTimeout(debounceTimer);

      if (cepDigitos.length < 8) {
        ultimoCepConsultado.value = '';
        return;
      }

      if (cepDigitos.length !== 8) {
        return;
      }

      debounceTimer = setTimeout(() => {
        void consultarCep(cepDigitos);
      }, 400);
    },
  );

  return {
    buscandoCep,
    buscarSeCepValido,
    resetarConsultaCep,
  };
}
