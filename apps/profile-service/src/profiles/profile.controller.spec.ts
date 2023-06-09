import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { Review } from '../rewiews/reviews.model';
import { ProfileDto } from './dto/profile.dto';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Profile } from './profiles.model';
import { ProfilesModule } from './profiles.module';

describe('ProfileController', () => {
  let profileController: ProfilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
        providers: [ProfilesService,
          {
            provide: getModelToken(Profile),
            useValue: {},
          },
          {
            provide: getModelToken(Review),
            useValue: {},
          },
        ],
        imports: [ProfilesModule, ProfileDto,
          ClientsModule.register([{
            name: 'auth_service',
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://rabbitmq:5672'],
                queue: 'auth-queue',
                queueOptions: {
                    durable: false
                }
            }
        }]),
          
          SequelizeModule.forRoot({
            dialect: 'postgres',
            host: "localhost",
            port: 5432,
            username:"postgres",
            password: "12345678",
            database: "films_v2",
            models: [], 
            autoLoadModels: true,
          }),
        ],
    }).compile();

    profileController = app.get<ProfilesController>(ProfilesController);
  });

  /*describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(profileController.getHello()).toBe('Hello World!');
    });
  });*/
});
