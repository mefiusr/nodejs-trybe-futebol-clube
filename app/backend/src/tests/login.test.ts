import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';

import { userMock } from './mocks/users.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 1', () => {
  beforeEach(() => {
    sinon.restore();
  })

  describe('Testando a rota /login com POST', () => {

    it('Login com senha válida', async () => {
      sinon.stub(User, 'findOne').resolves(userMock as User);
      sinon.stub(bcrypt, 'compareSync').returns(true);

      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          "email": "admin@admin.com",
          "password": "secret_admin"
        })
      
      expect(chaiHttpResponse.status).to.be.equal(200);
    });

    it('Login com senha inválida', async () => {
      sinon.stub(User, 'findOne').resolves(userMock as User);
      sinon.stub(bcrypt, 'compareSync').returns(false);

      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          "email": "admin@admin.com",
          "password": "secret"
        });

      expect(chaiHttpResponse.status).to.be.equal(401);
    });

    it('Testa se falha ao tentar fazer login sem email', async () => {
      const chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": '',
        "password": "secret"
      })
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: 'All fields must be filled',
      });
    });

    it('Testa se falha ao tentar fazer login sem password', async () => {
      const chaiHttpResponse = await chai.request(app).post('/login').send({
        "email": 'admin@admin.com',
        "password": ''
      })
      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: 'All fields must be filled',
      });
    });

    it('Testa se falha ao tentar fazer login com um email inválido', async () => {
      const chaiHttpResponse = await chai.request(app).post('/login').send({
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
      const chaiHttpResponse = await chai.request(app).get('/login/validate').set(token)

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token not found' });
    })

    it('Testa se falha ao tentar fazer uma requisição com um token inválido', async () => {
      const header = {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      }

      const chaiHttpResponse = await chai.request(app).get('/login/validate').set(header)

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token must be a valid token' });
    })

    it('Testa se retorna a role do usuário', async () => {
      sinon.stub(jsonwebtoken, 'verify').resolves({ id: 1 });
      sinon.stub(User, 'findOne').resolves(userMock as User);

      const chaiHttpResponse = await chai.request(app).get('/login/validate').auth('token', { type: 'bearer' })

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal({ role: 'Admin' });
    })

  })
})

