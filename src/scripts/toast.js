export const colorSuccess = '#36B37E';
export const colorError = '#FF5630';
export const colorAlert = '#FFAB00';

export function toast(message, color){
  Toastify({
    text: message,
    duration: 2000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: color,
    },
  }).showToast();
}