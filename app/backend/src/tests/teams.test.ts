import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import { teamMock } from './mocks/teams.mock';
import Team from '../database/models/Team';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 2', () => {
  let chaiHttpResponse: Response;

  describe('Testa GET na rota /teams', () => {
    it('Testa se retorna todos os time', async () => {
      sinon.stub(Team, 'findAll' ).resolves(teamMock as Team[]);
      chaiHttpResponse = await chai.request(app).get('/teams');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(teamMock);
      (Team.findAll as sinon.SinonStub).restore();
      
    });
    it('Testa se retorna um único time', async () => {
      sinon.stub(Team, 'findByPk' ).resolves(teamMock[0] as Team);
      chaiHttpResponse = await chai.request(app).get('/teams/1');
      
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(teamMock[0]);
      (Team.findByPk as sinon.SinonStub).restore();
    });
  })
})