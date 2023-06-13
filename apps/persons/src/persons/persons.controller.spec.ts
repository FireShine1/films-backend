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

    personsDto = module.get<CreatePersonsDto>(CreatePersonsDto);
    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);
  });
  describe( 'Persons', () => {
    it('createPersons', async () => {
      const dto: typeof personsDto = { 
        personLink: "test",
        personPicture: "test",
        personGender: "test",
        height: 180,
        age: 59,
        birthDate: "test"
            };
      const person = await controller.create(dto);
      expect(person).toMatchObject({
        "id": 5671,
        "personLink": "test",
        "personPicture": "test",
        "personGender": "test",
        "height": 180,
        "age": 59,
        "birthDate": "test"
    });
    });
    it('getAllPersons', async () => {
      const persons = await controller.getAll();
      expect(persons).toHaveLength(5170);
    });
    it('getByName', async () => {
      const personName = 'test';
      const persons = await controller.getPersonsByName(personName);
      expect(persons).toMatchObject({
        "id": 1,
        "personLink": "test",
        "personPicture": "test",
        "personGender": "test",
        "height": 180,
        "age": 59,
        "birthDate": "test"
    });
    });
    it('getByIs', async () => {
      const personId = 1;
      const persons = await controller.getPersonById;
      expect(persons).toMatchObject({
        "id": 1,
        "personLink": "test",
        "personPicture": "test",
        "personGender": "test",
        "height": 180,
        "age": 59,
        "birthDate": "test"
    });
    });
  });
});

