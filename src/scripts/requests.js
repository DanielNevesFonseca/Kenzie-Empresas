import { colorError, colorSuccess, toast } from "./toast.js";

const baseUrl = "http://localhost:3333";

export async function readAllCategories() {
  const categoriesListRequest = await fetch(`${baseUrl}/categories/readAll`, {
    method: 'GET'
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError))

  return categoriesListRequest;
}

export async function readCompaniesByCategory(category) {
  const companiesListRequest = await fetch(`${baseUrl}/companies/readByCategory/${category}`, {
    method: "GET",
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return companiesListRequest;
}

export async function login(loginBody) {
  const loginData = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginBody),
  })
    .then(async (res) => {
      const resJson = await res.json();
      if (res.ok) {
        toast('Login feito com sucesso! Redirecionando para sua dashboard!', colorSuccess);
        localStorage.setItem('@KenzieEmpresas:infoUser', JSON.stringify(resJson));
        if (resJson.isAdm === true) {
          setTimeout(() => {
            window.location.replace('../pages/admDashboard.html');
          }, 1500);
        } else {
          setTimeout(() => {
            window.location.replace('../pages/userDashboard.html');
          }, 1500);
        }
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return loginData;
}

export async function register(registerBody) {
  const registerData = await fetch(`${baseUrl}/employees/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(registerBody),
  })
    .then(async (res) => {
      const resJson = await res.json();
      if (res.ok) {
        toast('Cadastro feito com sucesso! Redirecionando para página de login!', colorSuccess);
        setTimeout(() => {
          window.location.replace('../pages/login.html');
        }, 1500);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return registerData;
}

export async function readInfoUserLogged() {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const infoUser = await fetch(`${baseUrl}/employees/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return infoUser;
}

export async function readInfoCompanyById(companyId) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const infoCompany = await fetch(`${baseUrl}/companies/readById/${companyId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return infoCompany;
}

export async function readAllCompanies() {
  const companiesInfo = await fetch(`${baseUrl}/companies/readAll`, {
    method: "GET",
  })
    .then(async (res) => {
      const resJson = await res.json();
      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return companiesInfo;
}

export async function readCategoriesByCompany(companyId) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const infoCategory = await fetch(`${baseUrl}/departments/readByCompany/${companyId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return infoCategory;
}

export async function readInfoDepartmentsById(departmentId) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const infoDepartment = await fetch(`${baseUrl}/departments/readById/${departmentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return infoDepartment;
}

export async function updateInfoEmployee(employeeId, updateBody) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const employeeInfo = await fetch(`${baseUrl}/employees/updateEmployee/${employeeId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateBody),
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        toast('Funcionário Atualizado!', colorSuccess);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return employeeInfo;
}

export async function deleteEmployeeById(employeeId) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const deleteRequest = await fetch(`${baseUrl}/employees/deleteEmployee/${employeeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        toast(resJson.message, colorSuccess);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return deleteRequest;
}

export async function deleteDepartmentById(departmentId) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const deleteRequest = await fetch(`${baseUrl}/departments/delete/${departmentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        toast(resJson.message, colorSuccess);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return deleteRequest;
}

export async function updateDepartmentInfoById(departmentId, departmentBody) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const updateRequest = await fetch(`${baseUrl}/departments/update/${departmentId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(departmentBody)
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        toast(resJson.message, colorSuccess);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return updateRequest;
}

export async function createDepartment(departmentBody) {
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const createRequest = await fetch(`${baseUrl}/departments/create`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(departmentBody),
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        toast('Departamento Criado com Sucesso!', colorSuccess);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return createRequest;
}

export async function readAllUnemployedUsers(){
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const unemployedUsersRequest = await fetch(`${baseUrl}/employees/outOfWork`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async (res) => {
      const resJson = await res.json();
      if (res.ok) {
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return unemployedUsersRequest;
}

export async function hireEmployeeToDepartment(departmentBody, employeeId){
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const hireRequest = await fetch(`${baseUrl}/employees/hireEmployee/${employeeId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(departmentBody)
  })
    .then(async (res) => {
      const resJson = await res.json();

      if (res.ok) {
        toast(resJson.message, colorSuccess);
        return resJson;
      } else {
        throw new Error(resJson.message);
      }
    })
    .catch(err => toast(err.message, colorError));
  return hireRequest;
}

export async function fireEmployeeOfDepartment(employeeId){
  const info = JSON.parse(localStorage.getItem('@KenzieEmpresas:infoUser'));
  const token = info.authToken;
  const fireRequest = await fetch(`${baseUrl}/employees/dismissEmployee/${employeeId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then(async (res) => {
    const resJson = await res.json();

    if (res.ok) {
      toast(resJson.message, colorSuccess);
      return resJson;
    } else {
      throw new Error(resJson.message);
    }
  })
  .catch(err => toast(err.message, colorError));
return fireRequest;
}