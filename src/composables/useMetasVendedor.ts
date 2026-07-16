import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  metaVendedorService,
  representanteService,
} from 'services/comercial-extras.service';
import type {
  ListarMetasVendedorParams,
  ListarRepresentantesParams,
  MetaVendedorDto,
  RepresentanteDto,
} from 'types/dtos/comercial-extras.dto';
import { ref } from 'vue';

export function useMetasVendedor() {
  const metas = ref<MetaVendedorDto[]>([]);
  const carregando = ref(false);
  const indisponivel = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarMetasVendedorParams): Promise<void> {
    carregando.value = true;
    indisponivel.value = false;

    try {
      metas.value = await metaVendedorService.listar(params);
    } catch (e) {
      metas.value = [];
      indisponivel.value = true;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    metas,
    carregando,
    indisponivel,
    carregar,
  };
}

export function useRepresentantes() {
  const representantes = ref<RepresentanteDto[]>([]);
  const carregando = ref(false);
  const indisponivel = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarRepresentantesParams): Promise<void> {
    carregando.value = true;
    indisponivel.value = false;

    try {
      representantes.value = await representanteService.listar(params);
    } catch (e) {
      representantes.value = [];
      indisponivel.value = true;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    representantes,
    carregando,
    indisponivel,
    carregar,
  };
}
