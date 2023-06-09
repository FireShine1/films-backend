import { GenresService } from './genres.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { Genre } from './genres.model';
import { GenresFilms } from './genres-films.model';

@Module({
    controllers: [GenresController],
    providers: [GenresService],
    imports: [
        SequelizeModule.forFeature([Genre, GenresFilms]),
    ],
    exports: [GenresService]
})

export class GenresModule { }