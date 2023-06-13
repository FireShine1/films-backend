import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRoles } from "../roles/user-roles.model";
import { Role } from "../roles/roles.model";
import { User } from "./auth.model";
import { SequelizeModule, getModelToken } from "@nestjs/sequelize";
import { Token } from "../token/token.model";
import { AuthModule } from "./auth.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserDto } from "@app/common";

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userDto: UserDto
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ 
    controllers: [AuthController],
    providers: [AuthService,
      {
        provide: getModelToken(User),
        useValue: {},
      },
      {
        provide: getModelToken(Role),
        useValue: {},
      },
      {
        provide: getModelToken(UserRoles),
        useValue: {},
      },
      {
        provide: getModelToken(Token),
        useValue: {},
      },
    ],
    imports:  [AuthModule, UserDto,
    ClientsModule.register([{
        name: 'Auth_service',
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://localhost:5672`],
            queue: 'Auth_queue',
            queueOptions: {
                durable: false,
            },
        },
        }]), 
    SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: String(process.env.POSTGRES_PASSWORD),
        database: process.env.POSTGRES_DB,
        models: [], 
        autoLoadModels: true,
      }),
    ],
    }).compile();
    userDto = module.get<UserDto>(UserDto);
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });
  describe( 'Auth', () => {
    it('getAllAuth', async () => {
      const auth = await service.getAll();
      expect(auth).toBeDefined();
    });
    it('getAllAuth', async () => {
        const userId = 1
        const auth = await service.getById(userId);
        expect(auth).toBeDefined();
      });
      it('createUser', async () => {
        const dto: typeof userDto = {
            email: 'test',
            password: 'test'
        };
        const users = await service.login(dto);
        expect(users).toMatchObject({
            "id": "1",
            "email": 'test',
            "password": 'test'
        });
    });
    });   
});
