import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Users from '../database/models/Users';

import { Response } from 'superagent';
import { userMock } from './mocks/users.mock';
import { IMockLogin } from '../interfaces/interface.login';
import LoginService from '../services/loginService';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 1', () => {
  let chaiHttpResponse: Response;
  describe('Post na rota /login', () => {

// beforeEach(async () => {
//   sinon.stub(Users, 'findOne').resolves(userMock as Users)
// });

// afterEach(async () => {
//   (Users.findOne as sinon.SinonStub).restore();
// })

    it('Fazer login com senha incorreta', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
       "email": "admin@admin.com",
       "password": "secret"
     })
      sinon.stub(Users, 'findOne').resolves(null);
      sinon.stub(LoginService, 'validatePassword').resolves(false);
  
      expect(chaiHttpResponse.status).to.be.equal(401);
    });
    it('Fazer login com sucesso', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
       "email": "admin@admin.com",
       "password": "secret_admin"
     })
      sinon.stub(Users, 'findOne').resolves(userMock as Users);
      sinon.stub(LoginService, 'validatePassword').resolves(true);
  
      expect(chaiHttpResponse.status).to.be.equal(200);
    });
  })
})