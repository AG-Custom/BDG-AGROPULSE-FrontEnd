import { usePermissao } from 'composables/usePermissao';
import {
  ALERTAS_GERENCIAIS,
  type AcaoAlertaGerencial,
} from 'constants/alertas-gerenciais';

export interface DetalheAlertaGerencial {
  significado: string | null;
  acao: AcaoAlertaGerencial | null;
}

export function useAlertaGerencialAcao() {
  const { possuiPermissao } = usePermissao();

  function detalhar(tipo: string): DetalheAlertaGerencial {
    const definicao = ALERTAS_GERENCIAIS[tipo];
    if (!definicao) {
      return { significado: null, acao: null };
    }

    return {
      significado: definicao.significado,
      acao: possuiPermissao(definicao.acao.permissao) ? definicao.acao : null,
    };
  }

  return { detalhar };
}
