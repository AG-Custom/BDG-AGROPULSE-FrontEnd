import { Notify } from 'quasar';

export function useNotificacao() {
  function sucesso(message: string): void {
    Notify.create({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 4000,
    });
  }

  function erro(message: string): void {
    Notify.create({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 6000,
    });
  }

  return { sucesso, erro };
}
