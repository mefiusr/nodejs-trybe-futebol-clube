import * as sinon from "sinon";
import * as chai from "chai";
import * as jwt from "jsonwebtoken";
// @ts-ignore
import chaiHttp = require("chai-http");

import App from "../app";

import { Response } from "superagent";
import Match from "../database/models/Match";
import {
  matchesFinishedsMock,
  matchesInProgressMock,
  matchesMock,
  newMatchMock,
  sucessMatchMock,
} from "./mocks/matches.mock";

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe("Testes da seção 3", () => {
  let chaiHttpResponse: Response;

  beforeEach(() => {
    sinon.restore();
  });

  describe("Tests na rota /matches", () => {
    it("Testa se retorna todos as partidas", async () => {
      sinon.stub(Match, "findAll").resolves(matchesMock as Match[]);
      chaiHttpResponse = await chai.request(app).get("/matches");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
    });
    it("Testa se retonar todas as partidas em andamento", async () => {
      sinon.stub(Match, "findAll").resolves(matchesInProgressMock as Match[]);
      chaiHttpResponse = await chai
        .request(app)
        .get("/matches?inProgress=true");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesInProgressMock);
    });

    it("Testa se retonar todas as partidas finalizadas", async () => {
      sinon.stub(Match, "findAll").resolves(matchesFinishedsMock as Match[]);
      chaiHttpResponse = await chai
        .request(app)
        .get("/matches?inProgress=false");

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesFinishedsMock);
    });

    it("Testa se criou uma partida", async () => {
      // sinon.stub(jwt, 'verify').resolves({ id: 9 });
      sinon.stub(Match, "create").resolves(sucessMatchMock as Match);

      chaiHttpResponse = await chai
        .request(app)
        .post("/matches")
        .send(newMatchMock)
        .set("authorization", "token");

      expect(chaiHttpResponse.status).to.be.equal(201);
      expect(chaiHttpResponse.body).to.deep.equal(sucessMatchMock);
    });

    it("Falha ao tentar inserir um time mandante igual ao time visitante", async () => {
      sinon.stub(jwt, "verify").resolves({ id: 1 });
      chaiHttpResponse = await chai
        .request(app)
        .post("/matches")
        .send({
          homeTeam: 1,
          awayTeam: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
        })
        .set("Authorization", "token");

      expect(chaiHttpResponse.status).to.be.equal(422);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: "It is not possible to create a match with two equal teams",
      });
    });

    it("Falha se um time não existir", async () => {
      sinon.stub(jwt, "verify").resolves({ id: 12 });
      chaiHttpResponse = await chai
        .request(app)
        .post("/matches")
        .send({
          homeTeam: 99,
          awayTeam: 5,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
        })
        .set("Authorization", "token");

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.deep.equal({
        message: "There is no team with such id!",
      });
    });
  });
});
