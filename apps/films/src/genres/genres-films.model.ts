import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import { Film } from "../films/films.model";
import { Genre } from "./genres.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({tableName: 'genres_films', timestamps: false, underscored: true})
export class GenresFilms extends Model<GenresFilms> {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор жанра'})
    @ForeignKey(() => Genre)
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    genreId: number;

    @ApiProperty({example: '1', description: 'Уникальный индентификатор фильма'})
    @ForeignKey(() => Film)
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    filmId: number;

}