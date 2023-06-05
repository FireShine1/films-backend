import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Person } from "./persons.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({tableName: 'films_actors', timestamps: false, underscored: true})
export class FilmsActors extends Model<FilmsActors> {
    
    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id актера'})
    @ForeignKey(() => Person)
    @Column({type: DataType.INTEGER, primaryKey: true})
    actorId: number;

    @BelongsTo(() => Person)
    person: Person;

    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id фильма'})
    @Column({type: DataType.INTEGER, primaryKey: true})
    filmId: number;

}