import { Notify } from 'quasar';

export function useNotificacao() {
  function sucesso(message: string): void {
    Notify.create({ type: 'positive', message });
  }

  function erro(message: string): void {
    Notify.create({ type: 'negative', message });
  }

  return { sucesso, erro };
}
