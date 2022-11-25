import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Users from '../database/models/Users';

import { Response } from 'superagent';
import { mockToken, userMock } from './mocks/users.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 1', () => {
  let chaiHttpResponse: Response;

  describe('Testando a rota /login com POST', () => {

      it('Login com senha válida', async () => {
        sinon.stub(Users, 'findOne').resolves(userMock as Users);
        sinon.stub(bcrypt, 'compare').resolves(true);

        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send({
            "email": "admin@admin.com",
            "password": "secret_admin"
          });

        expect(chaiHttpResponse.status).to.be.equal(200);
        (Users.findOne as sinon.SinonStub).restore();
        (bcrypt.compare as sinon.SinonStub).restore();
      });

      it('Login com senha inválida', async () => {
        sinon.stub(Users, 'findOne').resolves(userMock as Users);
        sinon.stub(bcrypt, 'compare').resolves(false);

        chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send({
            "email": "admin@admin.com",
            "password": "secret"
          });

        expect(chaiHttpResponse.status).to.be.equal(401);
        (Users.findOne as sinon.SinonStub).restore();
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

      it('Testa se falha ao tentar fazer login (post) com um email inválido', async () => {
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
    it('Testa se falha ao tentar fazer login (get) sem um token', async () => {
      chaiHttpResponse = await chai.request(app).get('/login/validate').auth('token', { type: 'bearer' })
      sinon.stub(jsonwebtoken, 'verify').resolves('mockToken');

      expect(chaiHttpResponse.status).to.be.equal(401);

      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Invalid token' });
      (jsonwebtoken.verify as sinon.SinonStub).restore();
    })
  })



});
