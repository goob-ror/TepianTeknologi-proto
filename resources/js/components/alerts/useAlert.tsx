import { showAlert } from './alert';

export const useAlert = () => {
  return {
    success: (title: string, text: string) => showAlert(title, text, 'success'),
    error: (title: string, text: string) => showAlert(title, text, 'error'),
    warning: (title: string, text: string) => showAlert(title, text, 'warning'),
    info: (title: string, text: string) => showAlert(title, text, 'info'),
  };
};
