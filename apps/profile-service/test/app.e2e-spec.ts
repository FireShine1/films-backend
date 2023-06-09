import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { send } from 'process';


describe('ProfileController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET) - returns list of users', async () => {
    const res = await request(app.getHttpServer()).get('/users');
    expect(res.statusCode).toBe(200)
  });
  it('/user/login (Post) - create user', async () => {
    const res = await request(app.getHttpServer()).post('/user/login');
    send({
      "nickName": "test",
      
    });
    expect(res.statusCode).toEqual(201)
    expect([{
      "id": "1",
      "nickName": "test",
    }]);
    it('/user/registration (Post) - create user', async () => {
      const res = await request(app.getHttpServer()).post('/user/registration');
      send({
        "nickName": "test",
      });
      send({
        "email": "test",
        "password": "test",
        
      });
      expect(res.statusCode).toEqual(201)
      expect([{
        "id": "1",
        "nickName": "test",
      }]);
      expect([{
        "id": "1",
        "email": "test",
        "password": "test",
      }]);
    });
  });
});
