import { IMockLogin } from "../../interfaces/interface.login";

const userMock: IMockLogin = {
  id: 1,
  username: 'Admin',
  role: 'Admin',
  email: 'admin@admin.com',
  password: 'secret_admin',
}

export { userMock };