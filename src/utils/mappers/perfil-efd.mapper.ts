import { AtividadeEfd, PerfilEfd } from 'constants/enums';
import type { PerfilEfdDto, PerfilEfdFormModel } from 'types/dtos/obrigacao-fiscal.dto';

export function perfilEfdParaFormulario(dto: PerfilEfdDto | null): PerfilEfdFormModel {
  return {
    perfil: dto?.perfil ?? PerfilEfd.A,
    atividade: dto?.atividade ?? AtividadeEfd.Outros,
    codigoVersaoLeiaute: dto?.codigoVersaoLeiaute ?? '',
    tipoItemPadrao: dto?.tipoItemPadrao ?? '00',
    obrigadoBlocoG: dto?.obrigadoBlocoG ?? false,
    obrigadoBlocoK: dto?.obrigadoBlocoK ?? false,
    obrigadoInventario: dto?.obrigadoInventario ?? false,
    codigoReceitaIcms: dto?.codigoReceitaIcms ?? '',
    diaVencimentoIcms: dto?.diaVencimentoIcms?.toString() ?? '',
    contabilistaNome: dto?.contabilistaNome ?? '',
    contabilistaCpf: dto?.contabilistaCpf ?? '',
    contabilistaCrc: dto?.contabilistaCrc ?? '',
    contabilistaCodigoMunicipio: dto?.contabilistaCodigoMunicipio ?? '',
    contabilistaEmail: dto?.contabilistaEmail ?? '',
    contabilistaTelefone: dto?.contabilistaTelefone ?? '',
  };
}

export function formularioParaPerfilEfd(form: PerfilEfdFormModel): PerfilEfdDto {
  const dia = Number.parseInt(form.diaVencimentoIcms, 10);
  return {
    ...form,
    codigoReceitaIcms: form.codigoReceitaIcms.trim() || null,
    diaVencimentoIcms: Number.isNaN(dia) ? null : dia,
    contabilistaEmail: form.contabilistaEmail.trim() || null,
    contabilistaTelefone: form.contabilistaTelefone.trim() || null,
  };
}
