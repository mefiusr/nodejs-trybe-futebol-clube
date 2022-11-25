import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import { userMock, mockToken } from './mocks/users.mock';
import LoginService from '../services/LoginService';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 1', () => {
  let chaiHttpResponse: Response;

  describe('Testando a rota /login com POST', () => {

      it.skip('Login com senha válida', async () => {
        sinon.stub(User, 'findOne').resolves(userMock as User);
        sinon.stub(LoginService, 'validatePassword').resolves(true);

        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send({
            "email": "admin@admin.com",
            "password": "secret_admin"
          });

        expect(chaiHttpResponse.status).to.be.equal(200);
        (User.findOne as sinon.SinonStub).restore();
        (bcrypt.compare as sinon.SinonStub).restore();
      });

      it.skip('Login com senha inválida', async () => {
        sinon.stub(User, 'findOne').resolves(userMock as User);
        sinon.stub(bcrypt, 'compare').resolves(false);

        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send({
            "email": "admin@admin.com",
            "password": "secret"
          });

        expect(chaiHttpResponse.status).to.be.equal(401);
        (User.findOne as sinon.SinonStub).restore();
        (bcrypt.compare as sinon.SinonStub).restore();
      });

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

  describe('Testes na rota /login com GET', () => {
    it('Testa se falha ao tentar fazer uma requisição sem um token', async () => {
      const token = {}
      chaiHttpResponse = await chai.request(app).get('/login/validate').set(token)

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token not found' });
    })
    it('Testa se falha ao tentar fazer uma requisição com um token inválido', async () => {
      const token = {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      }

      chaiHttpResponse = await chai.request(app).get('/login/validate').set(token)

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Invalid token' });
    })
    it('Testa se retorna a role do usuário', async () => {
      sinon.stub(jsonwebtoken, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findOne').resolves(userMock as User);

      chaiHttpResponse = await chai.request(app).get('/login/validate').auth('token', { type: 'bearer' })

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal({ role: 'Admin' });
    })

  })
})