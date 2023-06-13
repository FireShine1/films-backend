import { GenresService } from './genres.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { Genre } from './genres.model';
import { GenresFilms } from './genres-films.model';
import { SharedModule } from '@app/common';

@Module({
    controllers: [GenresController],
    providers: [GenresService],
    imports: [
        SequelizeModule.forFeature([Genre, GenresFilms]),
        SharedModule,
    ],
    exports: [GenresService]
})

export class GenresModule { }