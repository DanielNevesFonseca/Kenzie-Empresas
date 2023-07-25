import { readAllCategories, readCompaniesByCategory } from "./requests.js";
import { colorSuccess, toast } from "./toast.js";

async function renderCategories() {
  const categories = await readAllCategories();
  const select = document.querySelector('.companies__select');

  categories.forEach(category => {
    let option = document.createElement('option');
    option.innerText = category.name;
    option.value = category.name;
    select.appendChild(option);
  });
}

async function renderCompanies() {
  const select = document.querySelector('.companies__select');
  const container = document.querySelector('.companies__container');

    select.addEventListener('change', async (event) => {
      container.innerHTML = '';
      const categoryValue = event.target.value;
      if(categoryValue == ''){
        toast('Selecione um setor e veja as empresas listadas!', colorSuccess);
      } else {
        const companiesRequest = await readCompaniesByCategory(categoryValue);
        companiesRequest.forEach(company => {
          const companyCard = createCompanyCard(company.name, categoryValue);
          container.appendChild(companyCard);
        });
      }
    })
}

function createCompanyCard(companyName, sector) {
  const item = document.createElement('li');
  const title = document.createElement('h2');
  const button = document.createElement('button');

  item.classList.add('companies__item');
  title.classList.add('title-2-bold');
  button.classList.add('button-chip-on');

  title.innerText = companyName;
  button.innerText = sector;

  item.append(title, button);

  return item;
}

function redirectToPages(){
  const buttonLogin = document.querySelector('.button-login');
  const buttonRegister = document.querySelector('.button-register');

  buttonLogin.addEventListener('click', () => {
    toast('Você será redirecionado para página de login...', colorSuccess);
    setTimeout(() => {
      window.location.replace('./src/pages/login.html');
    }, 1500);
  });

  buttonRegister.addEventListener('click', () => {
    toast('Você será redirecionado para página de registro...', colorSuccess);
    setTimeout(() => {
      window.location.replace('./src/pages/register.html');
    }, 1500);
  });
}




await renderCategories();
await renderCompanies();
redirectToPages();