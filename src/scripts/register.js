import { redirectToHomePage } from "./login.js";
import { register } from "./requests.js";
import { colorAlert, colorSuccess, toast } from "./toast.js";

function handleRegister() {
  const inputs = document.querySelectorAll('.register__input');
  const registerButton = document.querySelector('.button-register');
  const registerBody = {};
  let count = 0;

  registerButton.addEventListener('click', async (event) => {
    event.preventDefault();
    inputs.forEach(input => {

      if (input.value.trim() === '') {
        count++;
      }
      registerBody[input.name] = input.value;
    });

    if (count !== 0) {
      count = 0;
      toast('Certifique-se de digitar todos os campos corretamente!', colorAlert);
    } else {
      await register(registerBody);
    }
  });
}

function redirectToLogin() {
  const loginButtons = document.querySelectorAll('.go-to-login');
  if(loginButtons !== null){
    loginButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        toast('Redirecionando para página de login!', colorSuccess);
        setTimeout(() => {
          window.location.replace('../pages/login.html');
        }, 1500);
      })
    })
  }
}


handleRegister();
redirectToLogin();
