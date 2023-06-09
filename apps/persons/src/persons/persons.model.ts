import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { PersonLang } from "./persons-lang.model";
import { DirectorsFilms } from "./directors-films.model";
import { FilmsActors } from "./films-actors.model";


// interface PersonsCreationAttrs {
//     personLink: string;
//     personPicture: string;
//     personGender: string;
//     height: number;
//     age: number;
//     birthDate: string;
// };

@Table({tableName: 'persons', timestamps: false, underscored: true})
export class Person extends Model<Person> {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id актера'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @HasMany(() => PersonLang)
    personLang: PersonLang[];

    @ApiProperty({example: 'https://www.kinopoisk.ru/name/3/', description: 'Ссылка на человека'})
    @Column({type: DataType.STRING})
    personLink: string;

    @ApiProperty({example: 'https://kinopoiskapiunofficial.tech/images/actor_posters/kp/110.jpg', description: 'Ссылка на фото человека '})
    @Column({type: DataType.STRING})
    personPicture: string;

    @ApiProperty({example: 'MALE', description: 'Пол человека'})
    @Column({type: DataType.STRING(16)})
    personGender: string;

    @ApiProperty({example: '185', description: 'Рост человека'})
    @Column({type: DataType.INTEGER})
    height: number;

    @ApiProperty({example: '75', description: 'Возраст человека'})
    @Column({type: DataType.INTEGER})
    age: number;

    @ApiProperty({example: '1946-06-28', description: 'Дата рождения'})
    @Column({type: DataType.STRING})
    birthDate: string;

    @HasMany(() => FilmsActors)
    actorFilms: FilmsActors[];

    @HasMany(() => DirectorsFilms)
    directorFilms: DirectorsFilms[];

    films;

}