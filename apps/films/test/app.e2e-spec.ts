import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { send } from 'process';


describe('FilmsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  // films
  it('/films (GET) - returns list of films', async () => {
    const res = await request(app.getHttpServer()).get('/films');
    expect(res.statusCode).toBe(200)
  });

  it('/films (POST) - create new films', async () => {
    const newFilm = await request(app.getHttpServer()).post('/films');
    send({
      "filmType": "test",
      "filmLink": "test",
      "filmTrailer": "test",
      "filmYear": 2000,
      "filmTime": 0,
      "filmGrade": 1,
      "filmTotalGrade": 0,
      "filmR": "test",
      "filmAge": "test",
      "filmPoster": "test"
    })
    expect(newFilm.statusCode).toEqual(201)
    expect({
      "id": 7,
      "filmType": "test",
      "filmLink": "test",
      "filmTrailer": "test",
      "filmYear": 2000,
      "filmTime": 0,
      "filmGrade": 1,
      "filmTotalGrade": 0,
      "filmR": "test",
      "filmAge": "test",
      "filmPoster": "test"
    });
  });
  //countries
  it('/country (GET) - returns list of countries', async () => {
    const res = await request(app.getHttpServer()).get('/country');
    expect(res.statusCode).toBe(200)
  });
  it('/country (POST) - create new country', async () => {
    const newCountry = await request(app.getHttpServer()).post('/country');
    send({
      "id": 79,
      "lang": "ru",
      "name": "тест"
    })
    expect(newCountry.statusCode).toEqual(201)
    expect([{
      "id": "79",
      "lang": "ru",
      "name": "тест"
    }]);
  });
  //genres
  it('/genres (GET) - returns list of genres', async () => {
    const res = await request(app.getHttpServer()).get('/genres');
    expect(res.statusCode).toBe(200)
  });
  
  it('/genres (POST) - create new genre', async () => {
    const newGenre = await request(app.getHttpServer()).post('/genres');
    send({
      "id": "1",
      "lang": "ru",
      "name": "тестовый"
    })
    expect(newGenre.statusCode).toEqual(500)
    expect([{
      "id": "1",
      "lang": "ru",
      "name": "тестовый"
    }]);
  });
  it('films/filmType/:filmType (GET) - Получение фильма по его типу', async () => {
    const filmsnType = 'FILM';
    const res = await request(app.getHttpServer()).get(`films/filmType/${encodeURIComponent(filmsnType)}`);
    expect(res.statusCode).toBe(200)
  });
  it('films/filmName/:filmName (GET) - Получение фильма по его типу', async () => {
    const filmsnName = 'Матрица';
    const res = await request(app.getHttpServer()).get(`films/filmName/${encodeURIComponent(filmsnName)}`);
    expect(res.statusCode).toBe(200)
  });
});
