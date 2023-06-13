import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { Film } from './films.model';
import { Genre } from '../genres/genres.model';
import { GenresFilms } from '../genres/genres-films.model';
import { Country } from '../countries/countries.model';
import { CountriesFilms } from '../countries/countries-films.model';
import { FilmLang } from './films-lang.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FilmsModule } from './films.module';
import { CreateFilmsDto } from './dto/create-films.dto';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsService,
        {
          provide: getModelToken(Film),
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
          provide: getModelToken(Country),
          useValue: {},
        },
        {
          provide: getModelToken(CountriesFilms),
          useValue: {},
        },
        {
          provide: getModelToken(FilmLang),
          useValue: {},
        },],
        imports:  [FilmsModule, CreateFilmsDto,
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

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', async () => {
    const films = await service.getAll();
    expect(films).toBeDefined();
  });
});
