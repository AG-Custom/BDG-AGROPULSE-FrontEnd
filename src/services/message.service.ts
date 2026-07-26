import Swal, { type SweetAlertOptions } from 'sweetalert2';

const CONFIG_PADRAO: SweetAlertOptions = {
  position: 'center',
  showConfirmButton: true,
  confirmButtonText: 'OK',
  buttonsStyling: false,
  customClass: {
    container: 'agro-swal',
    popup: 'agro-swal__popup',
    title: 'agro-swal__title',
    htmlContainer: 'agro-swal__content',
    confirmButton: 'agro-swal__btn agro-swal__btn--primary',
    cancelButton: 'agro-swal__btn agro-swal__btn--secondary',
    icon: 'agro-swal__icon',
  },
};

export class MessageService {
  sucesso(mensagem: string, titulo = 'Sucesso'): void {
    void Swal.fire({
      ...CONFIG_PADRAO,
      icon: 'success',
      title: titulo,
      text: mensagem,
    });
  }

  erro(mensagem: string, titulo = 'Ops!'): void {
    void Swal.fire({
      ...CONFIG_PADRAO,
      icon: 'error',
      title: titulo,
      text: mensagem,
    });
  }

  aviso(mensagem: string, titulo = 'Atenção'): void {
    void Swal.fire({
      ...CONFIG_PADRAO,
      icon: 'warning',
      title: titulo,
      text: mensagem,
    });
  }

  info(mensagem: string, titulo = 'Informação'): void {
    void Swal.fire({
      ...CONFIG_PADRAO,
      icon: 'info',
      title: titulo,
      text: mensagem,
    });
  }

  async confirmar(opcoes: {
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    icone?: SweetAlertOptions['icon'];
  }): Promise<boolean> {
    const resultado = await Swal.fire({
      ...CONFIG_PADRAO,
      icon: opcoes.icone ?? 'warning',
      title: opcoes.titulo,
      text: opcoes.mensagem,
      showCancelButton: true,
      confirmButtonText: opcoes.textoConfirmar ?? 'Confirmar',
      cancelButtonText: opcoes.textoCancelar ?? 'Cancelar',
      reverseButtons: true,
    });

    return resultado.isConfirmed;
  }

  async confirmarComJustificativa(opcoes: {
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    icone?: SweetAlertOptions['icon'];
    minimoCaracteres?: number;
  }): Promise<string | null> {
    const minimo = opcoes.minimoCaracteres ?? 10;
    const resultado = await Swal.fire({
      ...CONFIG_PADRAO,
      icon: opcoes.icone ?? 'warning',
      title: opcoes.titulo,
      text: opcoes.mensagem,
      input: 'textarea',
      inputLabel: 'Justificativa',
      inputPlaceholder: 'Informe o motivo da inativação (mín. 10 caracteres)',
      inputAttributes: {
        maxlength: '1000',
      },
      inputValidator: (valor) => {
        const texto = String(valor ?? '').trim();
        if (texto.length < minimo) {
          return `Informe ao menos ${minimo} caracteres.`;
        }
        if (texto.length > 1000) {
          return 'Justificativa deve ter no máximo 1000 caracteres.';
        }
        return undefined;
      },
      showCancelButton: true,
      confirmButtonText: opcoes.textoConfirmar ?? 'Inativar',
      cancelButtonText: opcoes.textoCancelar ?? 'Cancelar',
      reverseButtons: true,
    });

    if (!resultado.isConfirmed || typeof resultado.value !== 'string') {
      return null;
    }

    return resultado.value.trim();
  }
}

export const messageService = new MessageService();
