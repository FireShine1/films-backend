import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { Film } from './films.model';
import { FilmsModule } from './films.module';
import { CreateFilmsDto } from './dto/create-films.dto';
import { Sequelize } from 'sequelize';
import { Genre } from '../genres/genres.model';
import { GenresFilms } from '../genres/genres-films.model';
import { Country } from '../countries/countries.model';
import { CountriesFilms } from '../countries/countries-films.model';
import { FilmLang } from './films-lang.model';
import { ClientsModule, Transport } from '@nestjs/microservices';


describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsDto: CreateFilmsDto;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      
    controllers: [FilmsController],
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
      },
    ],
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

    filmsDto = module.get<CreateFilmsDto>(CreateFilmsDto);
    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });
  describe( 'Film', () => {
    it('createFilms', async () => {
      const dto: typeof filmsDto = { 
        filmType: 'test',
        filmLink: 'test',
        filmTrailer: 'test',
        filmYear: 2000,
        filmTime: 0,
        filmGrade: 1.0,
        filmTotalGrade: 0,
        filmR: 'test',
        filmAge: 'test',
        filmPoster: 'test',
            };
      const films = await controller.create(dto);
      expect(films).toMatchObject({
        "id": 6,
        "filmType": "test",
        "filmLink": "test",
        "filmTrailer": "test",
        "filmYear": 2000,
        "filmTime": 0,
        "filmGrade": 1,
        "filmTotalGrade": 0,
        "filmR": "test",
        "filmAge": "test",
        "filmPoster": "test"
    });
    });
    it('getAllFilms', async () => {
      const films = await controller.getAll();
      expect(films).toHaveLength(78);
    });

    it('getFilmsByName', async () => {
      const filmName = 'Матрица'
      const films = await controller.getFilmsByName(filmName);
      expect(films).toMatchObject({
        "id": 7,
        "filmId": 301,
        "lang": "ru",
        "filmName": "Матрица",
        "filmDescription": "Хакер Нео узнает, что его мир — виртуальный. Выдающийся экшен, доказавший, что зрелищное кино может быть умным",
        "film": {
            "id": 301,
            "filmType": "FILM",
            "filmLink": "https://www.kinopoisk.ru/film/301/",
            "filmTrailer": "",
            "filmYear": 1999,
            "filmTime": 136,
            "filmGrade": 8.5,
            "filmTotalGrade": 677706,
            "filmR": "r",
            "filmAge": "16",
            "filmPoster": "https://kinopoiskapiunofficial.tech/images/posters/kp/301.jpg"
        }
    });
    });

    it('getFilmsByType', async () => {
      const filmType = 'FILM'
      const films = await controller.getFilmsByType(filmType);
      expect(films).toMatchObject({
        "id": 298,
        "filmType": "FILM",
        "filmLink": "https://www.kinopoisk.ru/film/298/",
        "filmTrailer": "https://widgets.kinopoisk.ru/discovery/trailer/648?onlyPlayer=1&autoplay=1&cover=1",
        "filmYear": 2003,
        "filmTime": 134,
        "filmGrade": 7.6,
        "filmTotalGrade": 196900,
        "filmR": "pg13",
        "filmAge": "12",
        "filmPoster": "https://kinopoiskapiunofficial.tech/images/posters/kp/298.jpg",
        "filmLang": [
            {
                "id": 1,
                "filmId": 298,
                "lang": "ru",
                "filmName": "Люди Икс 2",
                "filmDescription": "Супергерои в опале объединяются с вечным врагом Магнето, чтобы выжить. Сиквел истории мутантов"
            },
            {
                "id": 2,
                "filmId": 298,
                "lang": "en",
                "filmName": "X2",
                "filmDescription": ""
            }
        ],
        "countries": [
            {
                "id": 1,
                "lang": "ru",
                "name": "США",
                "CountriesFilms": {
                    "countryId": 1,
                    "filmId": 298
                }
            },
            {
                "id": 2,
                "lang": "ru",
                "name": "Канада",
                "CountriesFilms": {
                    "countryId": 2,
                    "filmId": 298
                }
            }
        ],
        "genres": [
            {
                "id": 1,
                "lang": "ru",
                "name": "триллер",
                "GenresFilms": {
                    "genreId": 1,
                    "filmId": 298
                }
            },
            {
                "id": 2,
                "lang": "ru",
                "name": "фантастика",
                "GenresFilms": {
                    "genreId": 2,
                    "filmId": 298
                }
            },
            {
                "id": 3,
                "lang": "ru",
                "name": "приключения",
                "GenresFilms": {
                    "genreId": 3,
                    "filmId": 298
                }
            },
            {
                "id": 4,
                "lang": "ru",
                "name": "боевик",
                "GenresFilms": {
                    "genreId": 4,
                    "filmId": 298
                }
            }
        ]

          });
        });
    // it('getById', async () => {
    //   const id = 298
    //   const lang = "ru"
    //   const films = await controller.getFilmById(id, lang);
    //   expect(films).toEqual({

    //   });
    // });
    
    it('getFilmsByDate', async () => {
      const year = 2004 
      const expectedFilm = [
        {
            "id": 322,
            "filmType": "FILM",
            "filmLink": "https://www.kinopoisk.ru/film/322/",
            "filmTrailer": "https://www.youtube.com/v/L3JGt3Cod1U",
            "filmYear": 2004,
            "filmTime": 142,
            "filmGrade": 8.2,
            "filmTotalGrade": 601850,
            "filmR": "pg",
            "filmAge": "12",
            "filmPoster": "https://kinopoiskapiunofficial.tech/images/posters/kp/322.jpg",
            "filmLang": [
                {
                    "id": 48,
                    "filmId": 322,
                    "lang": "en",
                    "filmName": "Harry Potter and the Prisoner of Azkaban",
                    "filmDescription": ""
                },
                {
                    "id": 47,
                    "filmId": 322,
                    "lang": "ru",
                    "filmName": "Гарри Поттер и узник Азкабана",
                    "filmDescription": "Беглый маг, тайны прошлого и путешествия во времени. В третьей части поттерианы Альфонсо Куарон сгущает краски"
                }
            ],
            "countries": [
                {
                    "id": 1,
                    "lang": "ru",
                    "name": "США",
                    "CountriesFilms": {
                        "countryId": 1,
                        "filmId": 322
                    }
                },
                {
                    "id": 7,
                    "lang": "ru",
                    "name": "Великобритания",
                    "CountriesFilms": {
                        "countryId": 7,
                        "filmId": 322
                    }
                }
            ],
            "genres": [
                {
                    "id": 3,
                    "lang": "ru",
                    "name": "приключения",
                    "GenresFilms": {
                        "genreId": 3,
                        "filmId": 322
                    }
                },
                {
                    "id": 12,
                    "lang": "ru",
                    "name": "фэнтези",
                    "GenresFilms": {
                        "genreId": 12,
                        "filmId": 322
                    }
                },
                {
                    "id": 8,
                    "lang": "ru",
                    "name": "семейный",
                    "GenresFilms": {
                        "genreId": 8,
                        "filmId": 322
                    }
                }
            ]
        }
    ]
      const films = await controller.getFilmsByDate(year);
      expect(films).toMatchObject(expectedFilm);
    });
    
    it('deleteFilm', async () => {
      const id = 6
      const films = await controller.deleteFilm(id);
      expect(films).toMatchObject({
        "id": 6,
        "filmType": "test",
        "filmLink": "test",
        "filmTrailer": "test",
        "filmYear": 2000,
        "filmTime": 0,
        "filmGrade": 1,
        "filmTotalGrade": 0,
        "filmR": "test",
        "filmAge": "test",
        "filmPoster": "test"
      });
    });
  });
});
