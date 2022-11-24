import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Users from '../database/models/Users';

import { Response } from 'superagent';
import { userMock } from './mocks/users.mock';
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
    it.skip('Fazer login com sucesso', async () => {
      sinon.stub(Users, 'findOne').resolves(userMock as Users);
      sinon.stub(LoginService, 'validatePassword').resolves(true);
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": "secret_admin"
      })
      expect(chaiHttpResponse.status).to.be.equal(200);
      (Users.findOne as sinon.SinonStub).restore();
      (LoginService.validatePassword as sinon.SinonStub).restore();
    });
    it('Fazer login com senha incorreta', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": "secret"
      })
      sinon.stub(Users, 'findOne').resolves(userMock as Users);
      sinon.stub(LoginService, 'validatePassword').resolves(false);

      expect(chaiHttpResponse.status).to.be.equal(401);

      (Users.findOne as sinon.SinonStub).restore();
      (LoginService.validatePassword as sinon.SinonStub).restore();
    });
    // it('Testa se ao fazer login, um token é gerado', async () => {
    // chaiHttpResponse = await chai.request(app).post('/login').send({
    //   "email": "admin@admin.com",
    //   "password": "secret_admin"
    // })
    // sinon.stub(LoginController, 'prototype').resolves({ status: 200, token: mockToken })
    // console.log(chaiHttpResponse.body);
    // expect(chaiHttpResponse.status).to.be.equal(200);
    // expect(chaiHttpResponse.body).to.deep.equal(mockToken);
    // });
    it('Testa se falha ao tentar fazer login sem email', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": '',
        "password": "secret"
      })
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: 'All fields must be filled',
      });
    });
    it('Testa se falha ao tentar fazer login sem password', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": 'admin@admin.com',
        "password": ''
      })
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: 'All fields must be filled',
      });
    });
    it('Testa se falha ao tentar fazer login com um email inválido', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": 'admin',
        "password": 'secret_admin'
      })
      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: 'Incorrect email or password',
      });
    });
  })
})