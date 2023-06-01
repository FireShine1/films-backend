import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "../films/films.model";
import { CountriesFilms } from "./countries-films.model";
import { ApiProperty } from "@nestjs/swagger";


// interface CountryCreationAttrs {
//     id: string;
//     lang: string;
//     name: string;
// }

@Table({tableName: 'countries', timestamps: false})
export class Country extends Model<Country > {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ApiProperty({example: 'ru', description: 'Язык'})
    @Column({type: DataType.STRING(16)})
    lang: string;

    @ApiProperty({example: 'США', description: 'Название страны'})
    @Column({type: DataType.STRING, unique: true})
    name: string;

    @BelongsToMany(() => Film, () => CountriesFilms)
    films: Film[];

}