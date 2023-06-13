import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { send } from 'process';


describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  //roles
  it('/roles/:value (GET) - returns list of films', async () => {
    const value= 'USER';
    const res = await request(app.getHttpServer()).get(`roles/:${encodeURIComponent(value)}`);
    expect(res.statusCode).toBe(200)
  });
  it('/roles (POST) - create new films', async () => {
    const newFilm = await request(app.getHttpServer()).post('/roles');
    send({
      "value": "USER",
      "description": "Пользователь"
    })
    expect(newFilm.statusCode).toEqual(201)
    expect({
      "id": 1,
      "value": "USER",
      "description": "Пользователь"
    });
  });

  it('/role (POST) - create new films', async () => {
    const newFilm = await request(app.getHttpServer()).post('/role');
    send({
      "value": "USER",
      "userId": 1
    })
    expect(newFilm.statusCode).toEqual(201)
    expect({
      "value": "USER",
      "userId": 1
    });
  });

});
