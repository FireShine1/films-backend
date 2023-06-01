import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import { GenresFilms } from "./genres-films.model";
import { Film } from "../films/films.model";
import { ApiProperty } from "@nestjs/swagger";


@Table({tableName: 'genres', timestamps: false})
export class Genre extends Model<Genre> {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ApiProperty({example: 'ru', description: 'Язык жанра'})
    @Column({type: DataType.STRING(16)})
    lang: string;

    @ApiProperty({example: 'триллер', description: 'Название жанра'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;
    
    @BelongsToMany(() => Film, () => GenresFilms)
    films: Film[];

}