import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConvertModule } from './convert/convert.module';
import { FilmMain } from './convert/films.model';
import { FilmWithGenres } from './convert/films-old.model';
import { GenresFilms } from './convert/films-genres.model';
import { Genre } from './convert/genres.model';
import { FilmLang } from './convert/films-lang.model';
import { Country } from './convert/countries.model';
import { CountriesFilms } from './convert/countries-films.model';
import { DirectorsFilms } from './convert/directors-films.model';
import { PersonMain } from './convert/persons-main.model';
import { PersonLang } from './convert/persons-lang.model';
import { PersonOld } from './convert/persons-old.model';
import { FilmsActors } from './convert/films-actors.model';
import { Review } from './convert/reviews.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [
                FilmMain,
                FilmLang,
                FilmWithGenres,
                GenresFilms,
                Genre,
                Country,
                CountriesFilms,
                DirectorsFilms,
                PersonMain,
                PersonLang,
                PersonOld,
                FilmsActors,
                Review
            ],
            autoLoadModels: true
        }),
        ConvertModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule { }
