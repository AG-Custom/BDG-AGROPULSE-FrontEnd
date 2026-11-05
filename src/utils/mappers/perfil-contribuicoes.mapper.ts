import { IncidenciaContribuicoes } from 'constants/enums';
import type { PerfilContribuicoesDto } from 'types/dtos/obrigacao-fiscal.dto';

export function perfilContribuicoesParaFormulario(
  dto: PerfilContribuicoesDto | null,
): PerfilContribuicoesDto {
  return {
    codigoVersaoLeiaute: dto?.codigoVersaoLeiaute ?? '',
    naturezaPessoaJuridica: dto?.naturezaPessoaJuridica ?? '00',
    indicadorAtividade: dto?.indicadorAtividade ?? '2',
    codigoIncidencia: dto?.codigoIncidencia ?? IncidenciaContribuicoes.NaoCumulativo,
    indicadorRegimeCumulativo: dto?.indicadorRegimeCumulativo ?? null,
    cstEntrada: dto?.cstEntrada ?? '70',
    naturezaBaseCredito: dto?.naturezaBaseCredito ?? null,
    obrigadoBlocoF: dto?.obrigadoBlocoF ?? false,
    obrigadoBlocoI: dto?.obrigadoBlocoI ?? false,
    obrigadoBlocoP: dto?.obrigadoBlocoP ?? false,
  };
}