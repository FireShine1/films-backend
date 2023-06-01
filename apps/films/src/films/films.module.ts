import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film } from './films.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FilmLang } from './films-lang.model';
import { Genre } from '../genres/genres.model';
import { GenresFilms } from '../genres/genres-films.model';
import { Country } from '../countries/countries.model';
import { CountriesFilms } from '../countries/countries-films.model';
import { GenresModule } from '../genres/genres.module';
import { CountriesModule } from '../countries/countries.module';
import { SharedModule } from '@app/common';

@Module({
    controllers: [FilmsController],
    providers: [FilmsService],
    imports: [
        SequelizeModule.forFeature([
            Film,
            Genre,
            GenresFilms,
            Country,
            CountriesFilms,
            FilmLang
        ]),
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
        GenresModule,
        CountriesModule,
        SharedModule,
    ],
    exports: [FilmsService]
})

export class FilmsModule { }
