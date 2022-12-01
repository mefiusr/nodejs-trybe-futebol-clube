import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Match from '../database/models/Match';
import { matchesFinishedsMock } from './mocks/matches.mock';
import { Response } from "superagent";
import { mockLeaderAway, mockLeaderHome, mockTeamName } from './mocks/leaderboard.mock';
import Team from '../database/models/Team';
import LeaderboardService from '../services/LeaderboardService';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da seção 4', () => {
  let chaiHttpResponse: Response;

  beforeEach(() => {
    sinon.restore();
  });
  it('Testa um get na rota /leaderboard/home', async () => {
    sinon.stub(Match, "findAll").resolves(matchesFinishedsMock as any);
    sinon.stub(Team, "findByPk").resolves(mockTeamName as any);
    sinon.stub(LeaderboardService, "sortScore").resolves(mockLeaderHome as any);

    chaiHttpResponse = await chai.request(app).get("/leaderboard/home");

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(mockLeaderHome);
  })

  it('Testa um get na rota /leaderboard/away', async () => {
    sinon.stub(Match, "findAll").resolves(matchesFinishedsMock as any);
    sinon.stub(Team, "findByPk").resolves(mockTeamName as any);
    sinon.stub(LeaderboardService, "sortScore").resolves(mockLeaderAway as any);

    chaiHttpResponse = await chai.request(app).get("/leaderboard/away");

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(mockLeaderAway);
  })
  it('Testa um get na rota /leaderboard', async () => {
    sinon.stub(Match, "findAll").resolves(matchesFinishedsMock as any);
    sinon.stub(Team, "findByPk").resolves(mockTeamName as any);
    sinon.stub(LeaderboardService, "sortScore").resolves(mockLeaderAway as any);

    chaiHttpResponse = await chai.request(app).get("/leaderboard");

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(mockLeaderAway);
  })
})