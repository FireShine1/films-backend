import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PersonsModule } from '../src/persons/persons.module';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreatePersonsDto } from '../src/persons/dto/create-persons.dto';
import { DirectorsFilms } from '../src/persons/directors-films.model';
import { FilmsActors } from '../src/persons/films-actors.model';
import { PersonLang } from '../src/persons/persons-lang.model';
import { Person } from '../src/persons/persons.model';
import { PersonsService } from '../src/persons/persons.service';
import { PersonsController } from '../src/persons/persons.controller';
import { AppModule } from '../src/app.module';
import { send } from 'process';


describe('PersonsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports:  [AppModule],
      }).compile(); 

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/persons (GET) - returns list of persons', async () => {
    const res = await request(app.getHttpServer()).get('/persons');
    expect(res.statusCode).toBe(200)
  });
  it('/persons (Post) - create persons', async () => {
    const res = await request(app.getHttpServer()).get('/persons');
    send({
      "personLink": "test",
      "personPicture": "test",
      "personGender": "test",
      "height": "test",
      "age": "test",
      "birthDate": "test"
    });
    expect(res.statusCode).toEqual(201)
    expect([{
      "id": "1",
      "personLink": "test",
      "personPicture": "test",
      "personGender": "test",
      "height": "test",
      "age": "test",
      "birthDate": "test"
    }]);
  });
});
