import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './Genres.controller';
import { GenresService } from './Genres.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { CreateGenresDto } from './dto/create-genres.dto';
import { Genre } from './genres.model';
import { GenresModule } from './genres.module';
import { Film } from '../films/films.model';
import { GenresFilms } from './genres-films.model';
import { Country } from '../countries/countries.model';
import { CountriesFilms } from '../countries/countries-films.model';
import { FilmLang } from '../films/films-lang.model';
import { ClientsModule, Transport } from '@nestjs/microservices';



describe('GenresController', () => {
  let controller: GenresController;
  let genresDto: CreateGenresDto;
  let service: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    controllers: [GenresController],
    providers: [GenresService,
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
      },
    ],
    imports:  [GenresModule, CreateGenresDto,
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

    genresDto = module.get<CreateGenresDto>(CreateGenresDto);
    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);

  });
  describe( 'Genres', () => {
    it('getAllGenres', async () => {
      const genres = await controller.getAll();
      expect(genres).toHaveLength(48);
    });
    it('createGenres', async () => {
      const dto: typeof genresDto = { 
        id: 49,
        lang: 'test',
        name: 'test',
      };
      const genres = await controller.create(dto);
      expect(genres).toMatchObject({
        "id": 49,
        "lang": "test",
        "name": "test",
    });
    });
    it('getGenresById', async () => {
      const id = 49
      const genres = await controller.getGenreById(id);
      expect(genres).toMatchObject({
        "id": 49,
        "lang": "test",
        "name": "test",
      });
    });
    it('deleteGenresById', async () => {
      const id = 49
      const genres = await controller.deleteGenre(id);
      expect(genres).toMatchObject({
        "id": 49,
        "lang": "test",
        "name": "test",
      });
    });
  });
});
