import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Genre } from "../genres/genres.model";
import { GenresFilms } from "../genres/genres-films.model";
import { Country } from "../countries/countries.model";
import { CountriesFilms } from "../countries/countries-films.model";
import { FilmLang } from "./films-lang.model";

// interface FilmsCreationAttrs {
//     films_link: string;
//     films_name: string;
//     films_trailer: string;
//     films_date: string;
//     films_list_country: string;
//     films_list_genre: string;
//     films_list_director: string;
//     films_grade: string;
//     films_total_grade: string;
//     films_age: string;
//     films_r: string;
//     films_time: string;
//     films_list_actor: string;
//     films_picture: string;
//     filmType: string;
// }

@Table( {tableName: 'films', underscored: true, timestamps: false })
export class Film extends Model<Film> {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @HasMany(() => FilmLang)
    filmLang: FilmLang[];

    @ApiProperty({example: 'FILM', description: 'Тип фильма(фильм или сериал)'})
    @Column({type: DataType.STRING})
    filmType: string;

    @ApiProperty({example: 'https://www.kinopoisk.ru/film/298/', description: 'Ссылка на фильм'})
    @Column({type: DataType.STRING})
    filmLink: string;

    @ApiProperty({example: 'https://widgets.kinopoisk.ru/discovery/trailer/648?onlyPlayer=1&autoplay=1&cover=1', description: 'Ссылка на трейлер фильмa'})
    @Column({type: DataType.STRING})
    filmTrailer: string;

    @ApiProperty({example: '2003', description: 'Год выпуска фильма'})
    @Column({type: DataType.INTEGER})
    filmYear: number;

    @ApiProperty({example: '134', description: 'Длительность фильма в минутах'})
    @Column({type: DataType.INTEGER})
    filmTime: number;

    @BelongsToMany(() => Country, () => CountriesFilms)
    countries: Country[];

    @BelongsToMany(() => Genre, () => GenresFilms)
    genres: Genre[];

    @ApiProperty({example: '7.8', description: 'Оценка фильма(рейтинг кинопоиска)'})
    @Column({type: DataType.DOUBLE})
    filmGrade: number;

    @ApiProperty({example: '1223', description: 'Количество оценок'})
    @Column({type: DataType.INTEGER})
    filmTotalGrade: number;

    @ApiProperty({example: 'r', description: 'Рейтинг фильма MPPA'})
    @Column({type: DataType.STRING(16)})
    filmR: string;

    @ApiProperty({example: '16', description: 'Возрастное ограничение фильма'})
    @Column({type: DataType.STRING(16)})
    filmAge: string;

    @ApiProperty({example: 'https://kinopoiskapiunofficial.tech/images/posters/kp/298.jpg', description: 'Ссылка на картинку фильма'})
    @Column({type: DataType.STRING})
    filmPoster: string;

    //Считай, что это поля-плейсхолдеры
    //Их нет в самой таблице в бд, они нужны только чтобы в сервисе можно было удобно подцепить актеров и режиссеров,
    //полученных из сервиса с личностями
    //films.datavalues.actors и films.datavalues.directors - это вот эти строчки
    //@ApiProperty({example: 'https://kinopoiskapiunofficial.tech/images/posters/kp/298.jpg', description: 'Ссылка на картинку фильма'})
    directors;

    //@ApiProperty({example: 'https://kinopoiskapiunofficial.tech/images/posters/kp/298.jpg', description: 'Ссылка на картинку фильма'})
    actors;

    //@ApiProperty({example: 'https://kinopoiskapiunofficial.tech/images/posters/kp/298.jpg', description: 'Ссылка на картинку фильма'})
    similarFilms;

    reviews;

}