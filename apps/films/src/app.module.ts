import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { GenresFilms } from "./genre/genres-films.model";
import { Genres } from "./genre/genres.model";
import { Films } from "./films/films.model";
import { FilmsModule } from "./films/films.module";
import { GenresModule } from "./genre/genres.module";
import { CountryController } from './country/country.controller';
import { CountryService } from './country/country.service';
import { CountryModule } from './country/country.module';
import { Country } from "./country/country.model";
import { CountriesFilms} from "./country/countries-films.model";
import { FilmLang } from "./films/films-lang.model";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
           envFilePath: `C:\Users\Савелий\Desktop\JS\kino\apps\films\.env`
        }),
        SequelizeModule.forRoot({
            //dialectModule: require('pg'),
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [Films, Genres, GenresFilms, Country, CountriesFilms, FilmLang],
            autoLoadModels: true
        }),
        FilmsModule,
        GenresModule,
        CountryModule
    ]
})
export class AppModule {};