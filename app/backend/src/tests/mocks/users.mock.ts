import { IMockLogin } from "../../interfaces/interface.login";

const userMock: IMockLogin = {
  id: 1,
  username: 'Admin',
  role: 'Admin',
  email: 'admin@admin.com',
  password: 'secret_admin',
}

const mockToken: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY2OTI5MzU1NCwiZXhwIjoxNjY5Mzc5OTU0fQ.H-yr2L37UFctrizP1D-J8S4JPC2NrX-4oGGErQtieyw'


export { userMock, mockToken };