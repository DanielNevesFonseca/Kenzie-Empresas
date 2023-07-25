import { closeModal } from "./modal.js";
import { readInfoCompanyById, readInfoUserLogged } from "./requests.js";
import { colorSuccess, toast } from "./toast.js";

const infoUserLogged = await readInfoUserLogged();

function authentication() {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const isAdm = info.isAdm;
  if (isAdm) {
    window.location.replace('../admDashboard.html');
  }
}

function handleLogoutModal() {
  const modalController = document.querySelector('.logout-modal__controller');
  const openModalButton = document.querySelector('.button-go-to-logout');
  const logoutButton = document.querySelector('.button-logout');
  openModalButton.addEventListener('click', () => {
    modalController.showModal();
    closeModal(modalController.classList.value);
  });

  logoutButton.addEventListener('click', () => {
    if (localStorage.getItem('@KenzieEmpresas:infoUser')) {
      localStorage.removeItem('@KenzieEmpresas:infoUser');
      modalController.close();
      toast('Redirecionando para Home...', colorSuccess);
      setTimeout(() => {
        window.location.replace('../../index.html');
      }, 1500);
    }
  })
}

function renderInfoUser() {
  const userName = document.querySelector('.main__info-user > h1');
  const userEmail = document.querySelector('.main__info-user > p');
  userName.innerText = infoUserLogged.name;
  userEmail.innerText = infoUserLogged.email;
}

async function renderInfoCompany() {
  const infoCompanySection = document.querySelector('.main__info-company');
  const infoCompanyRequest = await readInfoCompanyById(infoUserLogged.company_id);
  infoCompanySection.innerHTML = ''

  if (infoUserLogged.company_id === null) {
    infoCompanySection.insertAdjacentHTML('afterbegin',
      `
    <div class="info-company__unemployed-info">
      <h1 class="title-1-bold">Você ainda não foi contratado.</h1>
      <p class="text-1-regular">Não se desanime. Em breve encontrará sua oportunidade!</p>
    </div>
    `)
  } else {

    infoCompanySection.insertAdjacentHTML('afterbegin',
      `
    <h1 class="info-company__name title-1-bold">${infoCompanyRequest.name} - ${infoCompanyRequest.category.name}</h1>
    `)

    const employeesList = infoCompanyRequest.employees;
    const employeesContainer = document.createElement('ul');

    employeesList.forEach(employee => {
      const employeeItem = document.createElement('li');
      const employeeName = document.createElement('p');

      employeesContainer.classList.add('info-company__employees');
      employeeItem.classList.add('employee-info');
      employeeName.classList.add('text-1-semibold');

      employeeName.innerText = employee.name;

      employeeItem.appendChild(employeeName);
      employeesContainer.appendChild(employeeItem);

    });

    infoCompanySection.appendChild(employeesContainer);
  }
}

authentication();
handleLogoutModal();
renderInfoUser();
await renderInfoCompany();