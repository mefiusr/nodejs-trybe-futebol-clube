import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import Match from '../database/models/Match';
import { matchesFinishedsMock, matchesInProgressMock, matchesMock } from './mocks/matches.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 3', () => {
  let chaiHttpResponse: Response;

  beforeEach(() => {
    sinon.restore();
  })

  describe('Testa GET na rota /matches', () => {
    it('Testa se retorna todos as partidas', async () => {
      sinon.stub(Match, 'findAll').resolves(matchesMock as any);
      chaiHttpResponse = await chai.request(app).get('/matches');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
      
    });
    it('Testa se retonar todas as partidas em andamento', async () => {
      sinon.stub(Match, 'findAll').resolves(matchesInProgressMock as any);
      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesInProgressMock);
    });

    it('Testa se retonar todas as partidas finalizadas', async () => {
      sinon.stub(Match, 'findAll').resolves(matchesFinishedsMock as any);
      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesFinishedsMock);
    });
  })
})