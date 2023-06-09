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

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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
    imports:  [AuthModule,
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
        host: "localhost",
        port: 5432,
        username:"postgres",
        password: "12345678",
        database: "auth",
        models: [], 
        autoLoadModels: true,
      }),
    ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });
  describe( 'Auth', () => {
    it('getAllAuth', async () => {
      const Auth = await controller.getAll('');
      expect(Auth).toBeDefined();
    });
});
});

