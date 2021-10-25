import Swal from 'sweetalert2';


export const showSweetalertLoading = (message: string) => {
  Swal.fire({
    text: message,
    allowOutsideClick: false
  });
  Swal.showLoading();
};

export const closeSweetalertLoading = () => {
  Swal.close();
};


export const showSweetalertErrorMessage = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
};
