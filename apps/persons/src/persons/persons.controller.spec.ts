import { Test, TestingModule } from "@nestjs/testing";
import { CreatePersonsDto } from "./dto/create-persons.dto";
import { PersonsController } from "./persons.controller";
import { PersonsService } from "./persons.service";
import { SequelizeModule, getModelToken } from "@nestjs/sequelize";
import { FilmsModule } from "apps/films/src/films/films.module";
import { PersonsModule } from "./persons.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Person } from "./persons.model";
import { DirectorsFilms } from "./directors-films.model";
import { FilmsActors } from "./films-actors.model";
import { PersonLang } from "./persons-lang.model";


describe('PersonsController', () => {
  let controller: PersonsController;
  let personsDto: CreatePersonsDto;
  let service: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ 
    controllers: [PersonsController],
    providers: [PersonsService,
      {
        provide: getModelToken(Person),
        useValue: {},
      },
      {
        provide: getModelToken(PersonLang),
        useValue: {},
      },
      {
        provide: getModelToken(FilmsActors),
        useValue: {},
      },
      {
        provide: getModelToken(DirectorsFilms),
        useValue: {},
      },
    ],
    imports:  [PersonsModule, CreatePersonsDto,
    ClientsModule.register([{
        name: 'persons_service',
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://localhost:5672`],
            queue: 'persons_queue',
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
        database: "persons_v2",
        models: [], 
        autoLoadModels: true,
      }),
    ],
    }).compile();

    personsDto = module.get<CreatePersonsDto>(CreatePersonsDto);
    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);
  });
  describe( 'Persons', () => {
    // it('createPersons', async () => {
    //   const dto: typeof personsDto = { 
        
    //         };
    //   const persons = await controller.create(dto);
    //   expect(persons).toMatchObject({
    //     "id": 6,
        
    // });
    });
    it('getAllPersons', async () => {
      const persons = await controller.getAll();
      expect(persons).toHaveLength(5170);
    });
});

