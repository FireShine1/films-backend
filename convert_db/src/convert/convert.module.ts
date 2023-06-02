import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilmMain } from './films.model';
import { FilmWithGenres } from './films-old.model';
import { GenresFilms } from './films-genres.model';
import { Genre } from './genres.model';
import { ConvertController } from './convert.controller';
import { PersonLang } from './persons-lang.model';
import { PersonMain } from './persons-main.model';
import { PersonOld } from './persons-old.model';
import { CountriesFilms } from './countries-films.model';
import { Country } from './countries.model';
import { DirectorsFilms } from './directors-films.model';
import { FilmsActors } from './films-actors.model';
import { FilmLang } from './films-lang.model';
import { Review } from './reviews.model';

@Module({
    providers: [ConvertService],
    controllers: [ConvertController],
    imports: [
        SequelizeModule.forFeature( [
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
        ]),
    ],
    exports: [
        ConvertService,
    ]
})
export class ConvertModule { }
