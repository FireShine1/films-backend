import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { Review } from '../rewiews/reviews.model';
import { ProfileDto } from './dto/profile.dto';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Profile } from './profiles.model';
import { ProfilesModule } from './profiles.module';
import { UserDto } from '@app/common';

describe('ProfileController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;
  let profileDto: ProfileDto;
  let userDto: UserDto;
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

    controller = app.get<ProfilesController>(ProfilesController);
    service = app.get<ProfilesService>(ProfilesService);
    profileDto = app.get<ProfileDto>(ProfileDto);
    userDto = app.get<UserDto>(UserDto);
  });

  describe('root', () => {
    it('createProfile', async () => {
      const dto: typeof userDto = { 
        email: "test",
        password: "test"
      };
      const person = await controller.login(dto, 'res');
      expect(person).toMatchObject({
        "id": 5671,
        "email": "test",
        "password": "test"
      });
    });
    it('getAllprofile', async () => {
      const profile = await controller.getAll();
      expect(profile).toHaveLength(0);
    });
  });
});
