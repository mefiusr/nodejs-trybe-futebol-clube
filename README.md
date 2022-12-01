
# :soccer: Trybe Futebol Club

O TFC é um site informativo sobre partidas e classificações de futebol! soccer

Neste projeto foi passado uma aplicação em front end, e minha responsabilidade era desenvolver todo back end para seu funcionamento.
Desenvolvi uma API (utilizando o método TDD) e também integrei - através do docker-compose - as aplicações para que elas funcionem consumindo um banco de dados.

Construi um back-end dockerizado utilizando modelagem de dados através do Sequelize e fiz os relacionamentos entre as tabelas.

## ⚙️ Funcionalidades

✅ Fazer login;

✅ Buscar partidas em andamento/finalizadas;

✅ Alterar o estado da partida/placar;

✅ Consultar a classificação do campeonato;

## :hammer_and_wrench: Ferramentas 
### 🍮 BackEnd
- TypeScript;
- POO;
- SOLID;
- DOCKER;
- MySQL com Sequelize;
- NodeJS com Express;
- JWT;
- bcrypts;
- Testes (Sinon, Chai, Mocha);

# Orientações

- *Clonar o repositório:*

```
$ git clone git@github.com:mathews-r/trybe-futebol-clube.git
```

- *Acessar o projeto blogsapi:*

```
$ cd trybe-futebol-clube
```


- *Para acessar a aplicação:*
```
Utilizar uma senha/usuário válidos

acesso: http://localhost:3000
login: admin@admin.com
senha: secret_admin
```

<details>
  <summary><strong>🐋 Rodando no Docker vs Localmente</strong></summary><br />
  
  ## Com Docker

  > Rode o serviço `node` com o comando `docker-compose up -d`.
  - Esse serviço irá inicializar um container chamado `trybers_and_dragons`.
  - A partir daqui você pode rodar o container `trybers_and_dragons` via CLI ou abri-lo no VS Code.

  > Use o comando `docker exec -it trybers_and_dragons bash`.

  > Instale as dependências com `npm install`
  
  ⚠ Atenção ⚠ Caso opte por utilizar o Docker, **TODOS** os comandos disponíveis no `package.json` (npm start, npm test, npm run dev, ...) devem ser executados **DENTRO** do container, ou seja, no terminal que aparece após a execução do comando `docker exec` citado acima. 

<img src="images/remote-container.png" width="800px" >  

---
  
  ## Sem Docker
  
  > Instale as dependências com `npm install`
 
  - Para rodar o projeto desta forma, obrigatoriamente você deve ter o `node` instalado em seu computador.

  <br/>
</details>

## 👨‍💻 Desenvolvedor

- [Mathews Rodrigues](https://www.linkedin.com/in/mathewsrodrigues/)
