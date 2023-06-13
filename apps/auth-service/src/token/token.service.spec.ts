import { Test, TestingModule } from "@nestjs/testing";
import { UserRoles } from "../roles/user-roles.model";
import { Role } from "../roles/roles.model";
import { SequelizeModule, getModelToken } from "@nestjs/sequelize";
import { Token } from "../token/token.model";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TokenService } from "./token.service";
import { User } from "../auth/auth.model";
import { TokenModule } from "./token.module";

describe('TokenController', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ 
    providers: [TokenService,
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
    imports:  [TokenModule,
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

    service = module.get<TokenService>(TokenService);
  });
  describe( 'Token', () => {
    it('getAllToken', async () => {
      const payload = ''
      const token = await service.generateTokens(payload);
      expect(token).toBeDefined();
    });
});
});

