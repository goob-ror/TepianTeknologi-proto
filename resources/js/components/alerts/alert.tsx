import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question') => {
  return MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-2xl p-6 shadow-lg',
      title: 'text-blue-700 text-xl font-semibold',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mt-4',
    },
    background: '#f0faff',
    backdrop: `
      rgba(0,0,123,0.4)
      left top
      no-repeat
    `
  });
};
