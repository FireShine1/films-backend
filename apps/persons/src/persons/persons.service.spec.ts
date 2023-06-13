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
  let service: PersonsService;
  let personsDto: CreatePersonsDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ 
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

    service = module.get<PersonsService>(PersonsService);
    personsDto = module.get<CreatePersonsDto>(CreatePersonsDto);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Get all person', async () => {
    const person = await service.getAll();
    expect(person).toHaveLength(5173);
  });

  it('Get person by Name', async () => {
    let personName = 'Киану Ривз';
    const person = await service.getPersonByName(personName);
    expect(person).toMatchObject({
        "birthPlace": "Бейрут, Ливан", 
        "career": "Актер, Продюсер, Режиссер", 
        "id": 851, 
        "lang": "ru", 
        "person": {
            "age": 57, 
            "birthDate": 
            "1964-09-02", 
            "height": 186, 
            "id": 7836, 
            "personGender": "MALE", 
            "personLink": "https://www.kinopoisk.ru/name/7836/", 
            "personPicture": "https://kinopoiskapiunofficial.tech/images/actor_posters/kp/7836.jpg"
        }, 
        "personId":7836, 
        "personName": "Киану Ривз"
    });
  });

  it('Get person by id', async () => {
    let personId = 1;
    let lang = 'ru';
    const person = await service.getPersonById(personId, lang);
    expect(person).toMatchObject({
        "age": 59, 
        "birthDate": "test", 
        "films": "Error: Cannot load films", 
        "height": 180, 
        "id": 1, 
        "personGender": "test", 
        "personLink": "test", 
        "personPicture": "test"
    });
  });
  it('create person', async () => {
    const dto: typeof personsDto = { 
        personLink: "test",
        personPicture: "test",
        personGender: "test",
        height: 180,
        age: 59,
        birthDate: "test"
            };
      const person = await service.createPerson(dto);
      expect(person).toMatchObject({
        "id": 5,
        "personLink": "test",
        "personPicture": "test",
        "personGender": "test",
        "height": 180,
        "age": 59,
        "birthDate": "test"
    });
  });

  it('Get persons', async () => {
    let poster = ''
    let personId = 1;
    let lang = 'ru';
    const person = await service.getPersons(personId, lang, poster);
    expect( typeof person).toBe('object');;
  });

  it('Get persons data', async () => {
    const person = await service.getPersonsData();
    expect( typeof person).toBe('object');
  });

});
