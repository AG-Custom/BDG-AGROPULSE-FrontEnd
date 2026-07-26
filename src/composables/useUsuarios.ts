import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  PerfilUsuarioOpcoes,
  UsuarioStatus,
  UsuarioStatusOpcoes,
} from 'constants/enums';
import { messageService } from 'services/message.service';
import { usuarioService } from 'services/usuario.service';
import type { UsuarioFormModel, UsuarioResumoDto } from 'types/dtos/usuario.dto';
import type { PerfilUsuarioValor, UsuarioStatusValor } from 'constants/enums';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/usuario.mapper';
import { ref } from 'vue';

export function useUsuarios() {
  const usuarios = ref<UsuarioResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const revogandoSessoes = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      usuarios.value = await usuarioService.listar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: UsuarioFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await usuarioService.criar(formParaCriarPayload(form));
      sucesso('Usuário cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(usuarioId: string, form: UsuarioFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await usuarioService.editar(usuarioId, formParaEditarPayload(form));
      sucesso('Usuário atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(usuarioId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await usuarioService.inativar(usuarioId, justificativa);
      sucesso('Usuário inativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(usuarioId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await usuarioService.ativar(usuarioId);
      sucesso('Usuário reativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function revogarSessoes(usuarioId: string): Promise<boolean> {
    revogandoSessoes.value = true;

    try {
      await usuarioService.revogarSessoes(usuarioId);
      sucesso('Sessões revogadas com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      revogandoSessoes.value = false;
    }
  }

  async function solicitarInativacao(usuario: UsuarioResumoDto): Promise<boolean> {
    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar usuário',
      mensagem: `Deseja inativar o usuário ${nomeCompleto(usuario)}? As sessões ativas serão encerradas.`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(usuario.id, justificativa);
  }

  async function solicitarAtivacao(usuario: UsuarioResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Reativar usuário',
      mensagem: `Deseja reativar o usuário ${nomeCompleto(usuario)}?`,
      textoConfirmar: 'Reativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(usuario.id);
  }

  async function solicitarRevogacaoSessoes(usuario: UsuarioResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Revogar sessões',
      mensagem: `Deseja revogar todas as sessões ativas de ${nomeCompleto(usuario)}?`,
      textoConfirmar: 'Revogar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return revogarSessoes(usuario.id);
  }

  function nomeCompleto(usuario: Pick<UsuarioResumoDto, 'nome' | 'sobrenome'>): string {
    return `${usuario.nome} ${usuario.sobrenome}`.trim();
  }

  function rotuloStatus(status: UsuarioStatusValor): string {
    return UsuarioStatusOpcoes.find((opcao) => opcao.value === status)?.label ?? status;
  }

  function rotuloPerfil(perfil: PerfilUsuarioValor): string {
    return PerfilUsuarioOpcoes.find((opcao) => opcao.value === perfil)?.label ?? perfil;
  }

  function variantStatus(status: UsuarioStatusValor): 'success' | 'warning' | 'default' {
    if (status === UsuarioStatus.Ativo) {
      return 'success';
    }

    if (status === UsuarioStatus.PendenteConfirmacao) {
      return 'warning';
    }

    return 'default';
  }

  function podeInativar(status: UsuarioStatusValor): boolean {
    return status === UsuarioStatus.Ativo || status === UsuarioStatus.PendenteConfirmacao;
  }

  return {
    usuarios,
    carregando,
    salvando,
    inativando,
    ativando,
    revogandoSessoes,
    carregar,
    criar,
    editar,
    inativar,
    ativar,
    revogarSessoes,
    solicitarInativacao,
    solicitarAtivacao,
    solicitarRevogacaoSessoes,
    nomeCompleto,
    rotuloStatus,
    rotuloPerfil,
    variantStatus,
    podeInativar,
  };
}
