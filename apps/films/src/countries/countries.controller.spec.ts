import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './countries.controller';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryService } from './countries.service';
import { FilmLang } from '../films/films-lang.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { Film } from '../films/films.model';
import { Country } from './countries.model';
import { CountriesFilms } from './countries-films.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CountriesModule } from './countries.module';
import { Genre } from '../genres/genres.model';
import { GenresFilms } from '../genres/genres-films.model';

describe('CountryController', () => {
  let countryDto: CreateCountryDto;
  let controller: CountryController;
  let service: CountryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [CountryService,
        {
          provide: getModelToken(Film),
          useValue: {},
        },
        {
          provide: getModelToken(Country),
          useValue: {},
        },
        {
          provide: getModelToken(Genre),
          useValue: {},
        },
        {
          provide: getModelToken(GenresFilms),
          useValue: {},
        },
        {
          provide: getModelToken(CountriesFilms),
          useValue: {},
        },
        {
          provide: getModelToken(FilmLang),
          useValue: {},
        },
      ],
      imports:  [CountriesModule, CreateCountryDto,
        ClientsModule.register([{
          name: 'films_service',
          transport: Transport.RMQ,
          options: {
              urls: [`amqp://localhost:5672`],
              queue: 'films_queue',
              queueOptions: {
                  durable: false,
              },
          },
      }]),
        ClientsModule.register([{
          name: 'reviews_service',
          transport: Transport.RMQ,
          options: {
              urls: [`amqp://localhost:5672`],
              queue: 'review_queue',
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
          database: "films_v2",
          models: [], 
          autoLoadModels: true,
        }),
      ],  
    }).compile();
    countryDto = module.get<CreateCountryDto>(CreateCountryDto);
    service = module.get<CountryService>(CountryService);
    controller = module.get<CountryController>(CountryController);
  });

  describe( 'Country ', () => {
    it('getAllCountry ', async () => {
      const country = await controller.getAll();
      expect(country ).toHaveLength(72);
    });
    it('createCountry', async () => {
      const dto: typeof countryDto = { 
        id: 73,
        lang: 'test',
        name: 'test',
      };
      const country = await controller.create(dto);
      expect(country).toMatchObject({
        "id": 73,
        "lang": "test",
        "name": "test",
    });
    });
  });
});
