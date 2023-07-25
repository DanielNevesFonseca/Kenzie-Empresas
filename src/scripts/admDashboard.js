import { closeModal } from "./modal.js";
import { createDepartment, deleteDepartmentById, deleteEmployeeById, fireEmployeeOfDepartment, hireEmployeeToDepartment, readAllCompanies, readAllUnemployedUsers, readCategoriesByCompany, readInfoCompanyById, readInfoDepartmentsById, updateDepartmentInfoById, updateInfoEmployee } from "./requests.js";
import { colorAlert, colorSuccess, toast } from "./toast.js";

function handleLogoutModal() {
  const modalController = document.querySelector('.logout-modal__controller');
  const openModalButton = document.querySelector('.button-go-to-logout');
  const logoutButton = document.querySelector('.button-logout');

  openModalButton.addEventListener('click', () => {
    modalController.showModal();
    closeModal(modalController.classList.value);
    console.log(logoutButton)

    logoutButton.addEventListener('click', () => {

      localStorage.removeItem('@KenzieEmpresas:infoUser');
      modalController.close();
      toast('Redirecionando para Home...', colorSuccess);
      setTimeout(() => {
        window.location.replace('../../index.html');
      }, 1500);
    })
  });

}

async function handleSelectCompanies() {
  const companiesList = await readAllCompanies();
  const select = document.querySelector('.companies__select');

  companiesList.forEach(company => {
    let option = document.createElement('option');
    option.innerText = company.name;
    option.value = company.id;
    select.appendChild(option);
  });
}

function renderDepartments() {
  const departmentsContainer = document.querySelector('.departments__container');
  const companySelected = document.querySelector('.companies__select');

  companySelected.addEventListener('change', async (event) => {
    departmentsContainer.innerHTML = "";

    if (companySelected.value === '') {
      toast('Selecione uma das empresas listadas!', colorAlert);
    } else {
      const companyId = event.target.value;
      const companyDepartments = await readCategoriesByCompany(companyId);
      const companyNameRequest = await readInfoCompanyById(companyId);

      if (companyDepartments.length === 0) {
        departmentsContainer.insertAdjacentHTML('afterbegin',
          `
        <h1 class="info-text title-1-bold">Empresa <span class="color-brand">${companyNameRequest.name}</span> não possui departamentos</h1>
        `
        );
      } else {
        companyDepartments.forEach(department => {
          const item = document.createElement('li');
          const boxText = document.createElement('div');
          const boxIcons = document.createElement('div');
          const departmentName = document.createElement('h2');
          const departmentDescription = document.createElement('p');
          const companyName = document.createElement('p');
          const eyeIcon = document.createElement('img');
          const pencilIcon = document.createElement('img');
          const trashIcon = document.createElement('img');

          eyeIcon.dataset.departmentId = department.id;
          pencilIcon.dataset.departmentId = department.id;
          trashIcon.dataset.departmentId = department.id;

          item.classList.add('department-item');
          boxText.classList.add('box-text');
          boxIcons.classList.add('box-icons');
          departmentName.classList.add('title-2-bold', 'department-item__title');
          departmentDescription.classList.add('text-1-regular', 'department-item__description');
          companyName.classList.add('text-1-semibold', 'department-item__company');
          eyeIcon.classList.add('icon-eye', 'show-department');
          pencilIcon.classList.add('icon-pencil', 'edit-department');
          trashIcon.classList.add('icon-trash', 'delete-department');

          eyeIcon.src = '../assets/icons/visibility-on.svg';
          eyeIcon.alt = 'imagem de olho';
          pencilIcon.src = '../assets/icons/pencil-icon.svg';
          pencilIcon.alt = 'imagem de lápis';
          trashIcon.src = '../assets/icons/delete-trash-icon.svg';
          trashIcon.alt = 'imagem de lixeira';

          departmentName.innerText = department.name;
          departmentDescription.innerText = department.description;
          companyName.innerText = companyNameRequest.name;

          boxText.append(departmentName, departmentDescription, companyName);
          boxIcons.append(eyeIcon, pencilIcon, trashIcon);
          item.append(boxText, boxIcons);
          departmentsContainer.appendChild(item);
        })
        handleDeleteDepartmentModal();
        handleUpdateDepartmentInfoModal();
        handleShowDepartmentModal();
      }
    }
  })
}

function renderEmployees() {
  const employeesContainer = document.querySelector('.employees__container');
  const companySelected = document.querySelector('.companies__select');

  companySelected.addEventListener('change', async (event) => {
    employeesContainer.innerHTML = "";
    const companyId = event.target.value;
    const infoCompany = await readInfoCompanyById(companyId);
    const companyNameRequest = infoCompany.name;
    const employees = infoCompany.employees;
    if (employees.length === 0) {
      employeesContainer.insertAdjacentHTML('afterbegin',
        `
      <h1 class="info-text title-1-bold">A Empresa <span class="color-brand">${infoCompany.name}</span> não possui funcionarios</h1>
      `
      )
    } else {
      employees.forEach(employee => {
        const item = document.createElement('li');
        const boxText = document.createElement('div');
        const boxIcons = document.createElement('div');
        const employeeName = document.createElement('h2');
        const companyName = document.createElement('p');
        const pencilIcon = document.createElement('img');
        const trashIcon = document.createElement('img');

        item.classList.add('employee-item');
        boxText.classList.add('box-text');
        boxIcons.classList.add('box-icons');
        employeeName.classList.add('title-2-bold', 'employee-item__title');
        companyName.classList.add('text-1-semibold', 'department-item__company');
        pencilIcon.classList.add('edit-employee-info');
        trashIcon.classList.add('delete-employee');

        pencilIcon.src = '../assets/icons/pencil-icon.svg';
        pencilIcon.alt = 'imagem de lápis';
        trashIcon.src = '../assets/icons/delete-trash-icon.svg';
        trashIcon.alt = 'imagem de lixeira';

        pencilIcon.dataset.userId = employee.id;
        trashIcon.dataset.userId = employee.id;

        employeeName.innerText = employee.name;
        companyName.innerText = companyNameRequest;

        boxText.append(employeeName, companyName);
        boxIcons.append(pencilIcon, trashIcon);
        item.append(boxText, boxIcons);
        employeesContainer.appendChild(item);
      });
      handleEditUserModal();
      handleDeleteUserModal();
    }
  })
}

function handleEditUserModal() {
  const modalController = document.querySelector('.modal__controller--edit-user');
  const editButtons = document.querySelectorAll('.edit-employee-info');
  const requestButton = document.querySelector('.edit-request');
  const inputs = document.querySelectorAll('.edit__input');
  const updateBody = {};

  editButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      modalController.showModal();
      closeModal(modalController.classList.value);
      const employeeId = event.target.dataset.userId;

      requestButton.addEventListener('click', async (event) => {
        event.preventDefault();
        inputs.forEach(input => {
          updateBody[input.name] = input.value;
        });
        await updateInfoEmployee(employeeId, updateBody);
        modalController.close();
      })
    })
  })
}

function handleDeleteUserModal() {
  const modalController = document.querySelector('.modal__controller--delete-user');
  const deleteButtons = document.querySelectorAll('.delete-employee');
  const requestButton = document.querySelector('.delete-request');

  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      modalController.showModal();
      closeModal(modalController.classList.value);
      const employeeId = event.target.dataset.userId;

      requestButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await deleteEmployeeById(employeeId);
        modalController.close();
      })
    })
  })
}

function handleDeleteDepartmentModal() {
  const modalController = document.querySelector('.modal__controller--delete-department');
  const deleteButtons = document.querySelectorAll('.delete-department');
  const requestButton = document.querySelector('.delete-department-request');

  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      modalController.showModal();
      closeModal(modalController.classList.value);
      const departmentId = event.target.dataset.departmentId;

      requestButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await deleteDepartmentById(departmentId);
        modalController.close();
      })
    })
  })
}

function handleUpdateDepartmentInfoModal() {
  const modalController = document.querySelector('.modal__controller--edit-department');
  const editButtons = document.querySelectorAll('.edit-department');
  const requestButton = document.querySelector('.edit-department-request');
  const inputs = document.querySelectorAll('.edit-department__input');
  const departmentBody = {};

  editButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      modalController.showModal();
      closeModal(modalController.classList.value);
      const departmentId = event.target.dataset.departmentId;
      const infoDepartmentRequest = await readInfoDepartmentsById(departmentId);

      inputs.forEach(input => {
        if (input.name == 'description') {
          input.value = infoDepartmentRequest.description;
        }
        if (input.name == 'name') {
          input.value = infoDepartmentRequest.name;
        }
      });

      requestButton.addEventListener('click', async (event) => {
        event.preventDefault();

        inputs.forEach(input => {
          departmentBody[input.name] = input.value;
        });
        await updateDepartmentInfoById(departmentId, departmentBody);
        modalController.close();

        inputs.forEach(input => {
          input.name = '';
        });
      })
    })
  })
}

function handleCreateDepartmentModal() {
  const modalController = document.querySelector('.modal__controller--create-department');
  const createButton = document.querySelector('.button-create-department');
  const requestButton = document.querySelector('.create-department-request');
  const inputs = document.querySelectorAll('.create-department__input');
  const select = document.querySelector('.companies-select__option');
  const departmentBody = {};

  createButton.addEventListener('click', (event) => {
    event.preventDefault()
    modalController.showModal();
    closeModal(modalController.classList.value);
    handleSelectCompaniesModal();

    requestButton.addEventListener('click', async (event) => {
      event.preventDefault();

      inputs.forEach(input => {
        departmentBody[input.name] = input.value;
      });

      departmentBody[select.name] = select.value;
      await createDepartment(departmentBody);
      modalController.close();

      inputs.forEach(input => {
        input.name = '';
      });
    })
  })
}

function handleShowDepartmentModal() {
  const modalController = document.querySelector('.modal__controller--show-department');
  const showButtons = document.querySelectorAll('.show-department');
  const buttonHire = document.querySelector('.button-hire-employee');
  const departmentName = document.querySelector('.name-department-selected');
  const departmentDescription = document.querySelector('.department-description');
  const companyName = document.querySelector('.company-name');
  const select = document.querySelector('.unemployed__select');
  const employeesContainer = document.querySelector('.employees-in-department__container');


  showButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      modalController.showModal();
      closeModal(modalController.classList.value);

      const departmentId = event.target.dataset.departmentId;
      const infoDepartment = await readInfoDepartmentsById(departmentId);
      const infoCompany = await readInfoCompanyById(infoDepartment.company_id);

      const companyNameTag = infoCompany.name;

      departmentName.innerText = infoDepartment.name;
      departmentDescription.innerText = infoDepartment.description;
      companyName.innerText = infoCompany.name;


      await handleUnemployedUsersSelect();
      let employeeId = select.value;

      select.addEventListener('change', () => {
        employeeId = select.value;
      })

      buttonHire.addEventListener('click', async (event) => {
        const departmentBody = {
          department_id: infoDepartment.id
        };
        console.log(departmentBody, employeeId);
        await hireEmployeeToDepartment(departmentBody, employeeId);
        modalController.close();
      });

      const departmentEmployees = infoDepartment.employees;
      console.log(departmentEmployees);

      employeesContainer.innerHTML = '';

      if (departmentEmployees.length === 0) {
        employeesContainer.insertAdjacentHTML('afterbegin',
          `
        <li class="employee-in-department__item">
          <h1 class="title-2-bold">O departamento ainda não possui funcionários!</h1>
        </li>
        `)
      } else {
        departmentEmployees.forEach(employee => {
          const employeeItem = document.createElement('li');
          const boxText = document.createElement('div');
          const employeeName = document.createElement('h2');
          const companyNameEmployee = document.createElement('p');
          const fireEmployeeButton = document.createElement('button');

          employeeItem.classList.add('employee-in-department__item');
          boxText.classList.add('box-text');
          employeeName.classList.add('title-2-bold');
          companyNameEmployee.classList.add('text-1-regular');
          fireEmployeeButton.classList.add('button-action-2', 'button-fire-employee');

          employeeName.innerText = employee.name;
          companyNameEmployee.innerText = companyNameTag;
          fireEmployeeButton.dataset.employeeId = employee.id;
          fireEmployeeButton.innerText = 'Desligar';

          boxText.append(employeeName, companyNameEmployee);
          employeeItem.append(boxText, fireEmployeeButton);
          employeesContainer.appendChild(employeeItem);
        })
      };

      const fireEmployeeButtons = document.querySelectorAll('.button-fire-employee');

      fireEmployeeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
          const employeeId = event.target.dataset.employeeId;
          await fireEmployeeOfDepartment(employeeId);
          modalController.close();
        })
      })
    })
  })
}

async function handleUnemployedUsersSelect() {
  const unemployedUsers = await readAllUnemployedUsers();
  const select = document.querySelector('.unemployed__select');

  select.innerHTML = "";

  unemployedUsers.forEach(user => {
    let option = document.createElement('option');
    option.innerText = user.name;
    option.value = user.id;
    select.appendChild(option);
  });
}

async function handleSelectCompaniesModal() {
  const companiesList = await readAllCompanies();
  const select = document.querySelector('.companies-select__option');

  companiesList.forEach(company => {
    let option = document.createElement('option');
    option.innerText = company.name;
    option.value = company.id;
    select.appendChild(option);
  });
}


await handleSelectCompanies()
renderDepartments();
handleCreateDepartmentModal();
renderEmployees();
handleLogoutModal();
