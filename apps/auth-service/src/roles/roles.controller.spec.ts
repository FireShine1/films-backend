import { Test, TestingModule } from "@nestjs/testing";

import { UserRoles } from "../roles/user-roles.model";
import { Role } from "../roles/roles.model";

import { SequelizeModule, getModelToken } from "@nestjs/sequelize";
import { Token } from "../token/token.model";

import { ClientsModule, Transport } from "@nestjs/microservices";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { User } from "../auth/auth.model";
import { RolesModule } from "./roles.module";
import { CreateRoleDto } from "./dto/create-role.dto";
import { AddRoleDto } from "./dto/add-role.dto";

describe('RolesController', () => {
    let controller: RolesController;
    let service: RolesService;
    let roleDto: CreateRoleDto
    let addDto: AddRoleDto
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [RolesService,
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
            ],
            imports: [RolesModule,
                ClientsModule.register([{
                    name: 'Roles_service',
                    transport: Transport.RMQ,
                    options: {
                        urls: [`amqp://localhost:5672`],
                        queue: 'Roles_queue',
                        queueOptions: {
                            durable: false,
                        },
                    },
                }]),
                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    host: "localhost",
                    port: 5432,
                    username: "postgres",
                    password: "12345678",
                    database: "Roles",
                    models: [],
                    autoLoadModels: true,
                }),
            ],
        }).compile();
        roleDto = module.get<CreateRoleDto>(CreateRoleDto);
        addDto = module.get<AddRoleDto>(AddRoleDto);
        controller = module.get<RolesController>(RolesController);
        service = module.get<RolesService>(RolesService);
    });
    describe('Roles', () => {
        it('getAllRoles', async () => {
            const roles = await controller.getByValue('');
            expect(roles).toBeDefined();
        });

        it('createRole', async () => {
            const dto: typeof roleDto = {
                value: 'USER',
                description: 'Пользователь'
            };
            const roles = await controller.create(dto);
            expect(roles).toMatchObject({
                "id": "1",
                "value": "USER",
                "description": "Пользователь"
            });
        });

        it('addRole', async () => {
            const dto: typeof addDto = {
                value: 'USER',
                userId: 1
            };
            const roles = await controller.addRole(dto);
            expect(roles).toMatchObject({
                "userId": "1",
                "value": "USER",
            });
        });
    });
});