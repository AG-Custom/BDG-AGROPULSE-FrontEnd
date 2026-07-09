import { isPerfilUsuarioGlobal, PerfilUsuario } from 'constants/enums';

import type {
  CriarUsuarioPayload,
  EditarUsuarioPayload,
  UsuarioDto,
  UsuarioFormModel,
} from 'types/dtos/usuario.dto';

export function criarUsuarioFormVazia(): UsuarioFormModel {
  return {
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    perfil: PerfilUsuario.Diretor,
    unidadeIds: [],
    colaboradorId: null,
  };
}

export function usuarioDtoParaForm(dto: UsuarioDto): UsuarioFormModel {
  return {
    nome: dto.nome,
    sobrenome: dto.sobrenome,
    email: dto.email,
    senha: '',
    confirmarSenha: '',
    perfil: dto.perfil,
    unidadeIds: [...dto.unidadeIds],
    colaboradorId: dto.colaboradorId,
  };
}

function montarUnidadeIds(form: UsuarioFormModel): string[] | undefined {
  if (isPerfilUsuarioGlobal(form.perfil)) {
    return undefined;
  }

  return form.unidadeIds;
}

export function formParaCriarPayload(form: UsuarioFormModel): CriarUsuarioPayload {
  return {
    nome: form.nome.trim(),
    sobrenome: form.sobrenome.trim(),
    email: form.email.trim(),
    senha: form.senha,
    perfil: form.perfil,
    unidadeIds: montarUnidadeIds(form),
    colaboradorId: form.colaboradorId ?? undefined,
  };
}

export function formParaEditarPayload(form: UsuarioFormModel): EditarUsuarioPayload {
  return {
    nome: form.nome.trim(),
    sobrenome: form.sobrenome.trim(),
    perfil: form.perfil,
    unidadeIds: montarUnidadeIds(form),
    colaboradorId: form.colaboradorId,
  };
}
