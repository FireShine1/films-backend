import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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
    const res = await request(app.getHttpServer()).post('/persons');
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
  it('[persons/personName/:personName (GET) - get persons by name', async () => {
    const personName = 'Киану Ривз';
    const res = await request(app.getHttpServer()).get(`/persons/personName/${encodeURIComponent(personName)}`);
    expect(res.statusCode).toBe(200)
  });

  it('[persons/:id (GET) - get persons by d', async () => {
    const personId = 1;
    const res = await request(app.getHttpServer()).get(`/persons/${encodeURIComponent(personId)}`);
    expect(res.statusCode).toBe(200)
  });
});
