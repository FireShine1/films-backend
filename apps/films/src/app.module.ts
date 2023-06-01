import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { GenresFilms } from "./genres/genres-films.model";
import { Genre } from "./genres/genres.model";
import { Film } from "./films/films.model";
import { FilmsModule } from "./films/films.module";
import { GenresModule } from "./genres/genres.module";
import { FilmLang } from "./films/films-lang.model";
import { CountriesFilms } from "./countries/countries-films.model";
import { Country } from "./countries/countries.model";
import { CountriesModule } from "./countries/countries.module";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
           envFilePath: `.env`
        }),
        SequelizeModule.forRoot({
            //dialectModule: require('pg'),
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [Film, Genre, GenresFilms, Country, CountriesFilms, FilmLang],
            autoLoadModels: true
        }),
        FilmsModule,
        GenresModule,
        CountriesModule
    ]
})
export class AppModule {};