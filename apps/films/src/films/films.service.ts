import { InjectModel } from "@nestjs/sequelize";
import { Film } from "./films.model";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFilmsDto } from "./dto/create-films.dto";
import { Genre } from "../genres/genres.model";
import { Country } from "../countries/countries.model";
import { FilmLang } from "./films-lang.model";
import { Op } from "sequelize";
import { firstValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";


@Injectable()
export class FilmsService {

    constructor(
        @InjectModel(Film) private filmsRepository: typeof Film,
        @InjectModel(FilmLang) private filmlangRepository: typeof FilmLang,
        @InjectModel(Genre) private genresRepository: typeof Genre,
        @InjectModel(Country) private countriesRepository: typeof Country,
        @Inject('films_service') private personsClient: ClientProxy,
        @Inject('reviews_service') private reviewsClient: ClientProxy,
    ) { }

    async createFilms(dto: CreateFilmsDto) {
        const films = await this.filmsRepository.create(dto);
        return films;
    }

    async getAll() {
        const films = await this.filmsRepository.findAll({ include: { all: true } });
        return films;
    }

    async getFilmsByName(filmName: string) {
        const film = await this.filmlangRepository.findOne({
            where: { filmName },
            include: { all: true }
        });
        return film;
    }

    async getFilmsByType(filmType: string) {
        const film = await this.filmsRepository.findOne({
            where: { filmType },
            include: { all: true }
        });
        return film;
    }

    async getFilmsSets(lang: string) {
        const bestFilmsSet = await this.getBestFilmsSet(lang);
        const bestFantasyFilmsSet = await this.getBestFantasyFilmsSet(lang);
        const familyFriendlyComediesSet = await this.getFamilyFriendlyComediesSet(lang);

        return { bestFilmsSet, bestFantasyFilmsSet, familyFriendlyComediesSet };
    }

    async getStartData(lang: string) {
        const bestFilmsSet = await this.getBestFilmsSet(lang);

        const genres = await this.genresRepository.findAll();
        const genresRu = genres.filter(genre => genre.lang == 'ru')
            .map(genre => { return { id: genre.id, name: genre.name } });
        const genresEn = genres.filter(genre => genre.lang == 'en')
            .map(genre => { return { id: genre.id, name: genre.name } });

        const countries = await this.countriesRepository.findAll();
        const countriesRu = countries.filter(country => country.lang == 'ru')
            .map(country => { return { id: country.id, name: country.name } });
        const countriesEn = countries.filter(country => country.lang == 'en')
            .map(country => { return { id: country.id, name: country.name } });

        try {
            const { popularActors, actors, directors } = await firstValueFrom(
                this.personsClient.send("persons-data-request", 'all')
            );

            return {
                bestFilmsSet, genresRu, genresEn, countriesRu, countriesEn,
                popularActors, actors, directors
            };
        } catch (err) {
            console.log(err);

            return { bestFilmsSet, genresRu, genresEn, countriesRu, countriesEn };
        }

    }

    async getFilmById(id: number, lang: string) {
        let film = await this.filmsRepository.findByPk(id, {
            include: [
                {
                    model: FilmLang,
                    attributes: ['lang', 'filmName', 'filmDescription'],
                },
                {
                    model: Genre,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Country,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });

        if (!film) {
            throw new NotFoundException(`Film with id ${id} not found`);
        }

        film.dataValues.similarFilms = await this.getSimilarFilms(film, lang);

        try {
            const { actors, directors } = await firstValueFrom(
                this.personsClient.send("persons-request", { filmsId: [id], lang })
            );

            film.dataValues.actors = this.mapActorsToFilm(film, actors);
            film.dataValues.directors = this.mapDirectorsToFilm(film, directors);
        } catch (err) {
            console.log(err);

            film.dataValues.actors = 'Error: Cannot load actors';
            film.dataValues.directors = 'Error: Cannot load directors';
        }

        try {
            const reviews = await firstValueFrom(
                this.reviewsClient.send("reviews-request", { filmId: id})
            );

            film.dataValues.reviews = reviews;
        } catch (err) {
            console.log(err);

            film.dataValues.reviews = 'Error: Cannot load reviews';
        }

        return film;
    }

    async getFilmsByFilters(
        countries, genres, actorsFilter: string[],
        directorsFilter: string[], lang: string
    ) {
        const filmsId = await this.filterIdByGenreAndCountry(genres, countries);

        if (!filmsId || filmsId.length == 0) {
            throw new NotFoundException(`There are no movies matching your search criteria.`);
        }

        let films = await this.filmsRepository.findAll({
            attributes: ['id', 'filmPoster', 'filmGrade', 'filmTotalGrade', 'filmYear', 'filmTime', 'filmAge'],
            where: {
                id: {
                    [Op.in]: [...filmsId]
                }
            },
            include: [
                {
                    model: FilmLang,
                    attributes: ['lang', 'filmName', 'filmDescription'],
                },
                {
                    model: Genre,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Country,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });

        try {
            const { actors, directors } = await firstValueFrom(
                this.personsClient.send("persons-filters-request", { filmsId, lang })
            );

            films.forEach(film => {
                film.dataValues.actors = this.mapActorsToFilm(film, actors);
                film.dataValues.directors = this.mapDirectorsToFilm(film, directors);
            });

            if (actorsFilter && actorsFilter.length > 0) {
                films = films.filter(film =>
                    film.dataValues.actors
                        .filter(actor => actorsFilter.includes(actor.name))
                        .length
                );
            }

            if (directorsFilter && directorsFilter.length > 0) {
                films = films.filter(film =>
                    film.dataValues.directors
                        .filter(director => directorsFilter.includes(director.name))
                        .length
                );
            }
            

            return films;
        } catch (err) {
            console.log(err);

            films.forEach(film => {
                film.dataValues.actors = 'Error: Cannot load actors';
                film.dataValues.directors = 'Error: Cannot load directors';
            });

            return films;
        }

    }

    async getFilmsByPerson(filmsId, lang) {
        return await this.filmsRepository.findAll({
            where: {
                id: { [Op.in]: [...filmsId] }
            },
            attributes: ['id', 'filmYear', 'filmGrade', 'filmPoster'],
            include: [
                {
                    model: FilmLang,
                    attributes: ['filmName'],
                    where: { lang: lang },
                },
            ]
        })
    }

    private async getBestFilmsSet(lang: string) {
        return await this.filmsRepository.findAll({
            limit: 30,
            order: [['filmGrade', 'DESC']],
            attributes: ['id', 'filmPoster', 'filmGrade', 'filmYear', 'filmTime', 'filmAge'],
            include: [
                {
                    model: FilmLang,
                    attributes: ['lang', 'filmName'],
                },
                {
                    model: Genre,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Country,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });
    }

    private async getBestFantasyFilmsSet(lang: string) {
        return await this.filmsRepository.findAll({
            limit: 30,
            order: [['filmGrade', 'DESC']],
            attributes: ['id', 'filmPoster', 'filmGrade', 'filmYear', 'filmTime', 'filmAge'],
            include: [
                {
                    model: FilmLang,
                    attributes: ['lang', 'filmName'],
                },
                {
                    model: Genre,
                    where: { lang: lang, name: 'фэнтези' },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Country,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });
    }

    private async getFamilyFriendlyComediesSet(lang: string) {
        return await this.filmsRepository.findAll({
            limit: 30,
            attributes: ['id', 'filmPoster', 'filmGrade', 'filmYear', 'filmTime', 'filmAge'],
            where: { filmAge: '6' },
            include: [
                {
                    model: FilmLang,
                    attributes: ['lang', 'filmName'],
                },
                {
                    model: Genre,
                    where: { lang: lang, name: 'комедия' },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Country,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });
    }

    private async getSimilarFilms(film: Film, lang: string) {
        return await this.filmsRepository.findAll({
            limit: 28,
            order: [['filmGrade', 'DESC']],
            attributes: ['id', 'filmPoster', 'filmGrade', 'filmYear', 'filmTime', 'filmAge'],
            where: {
                id: { [Op.ne]: film.id },
            },
            include: [
                {
                    model: FilmLang,
                    attributes: ['lang', 'filmName'],
                },
                {
                    model: Genre,
                    where: { lang: lang, name: film.genres[0].name },
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Country,
                    where: { lang: lang },
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });
    }

    private async filterIdByGenreAndCountry(genres, countries) {
        let genreClause = {};
        if (genres && genres.length > 0) {
            genreClause['name'] = { [Op.in]: [...genres] };
        }
        let countryClause = {};
        if (countries && countries.length > 0) {
            countryClause['name'] = { [Op.in]: [...countries] };
        }

        const filmsId = await this.filmsRepository.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Genre,
                    attributes: [],
                    through: { attributes: [] },
                    where: genreClause,
                },
                {
                    model: Country,
                    attributes: [],
                    through: { attributes: [] },
                    where: countryClause,
                }
            ],
            group: ['Film.id'],
        });

        return filmsId.map(item => item.id);
    }

    private mapActorsToFilm(film, actors) {
        return actors
            .filter(actor =>
                actor.actorFilms
                    .filter(item => item.filmId == film.id)
                    .length
            )
            .map(actor => {
                return {
                    id: actor.id,
                    name: actor.personLang[0].personName,
                    photo: actor.personPicture,
                }
            });
    }

    private mapDirectorsToFilm(film, directors) {
        return directors
            .filter(director =>
                director.directorFilms
                    .filter(item => item.filmId == film.id)
                    .length
            )
            .map(director => {
                return {
                    id: director.id,
                    name: director.personLang[0].personName,
                    photo: director.personPicture,
                }
            });
    }

    async getFilmsByYear(filmYear: number) {
        const film = await this.filmsRepository.findAll({
            where: { filmYear },
            include: { all: true }
        });
        if (!film) {
            throw new NotFoundException(`Genre with year ${filmYear} not found`);
        }

        return film;
    }

    async updateFilmName(filmId: number, lang: string, newFilmName: string) {
        const film = await this.filmlangRepository.findOne({
            where: { filmId, lang },
            include: { all: true }
        });
        if (!film) {
            throw new NotFoundException(`Film with id ${filmId} not found`);
        }
        film.filmName = newFilmName;
        await film.save();

        return film;
    }

    async deleteFilm(id: number) {
        const film = await this.filmsRepository.findByPk(id);
        if (!film) {
            throw new NotFoundException(`Film with id ${id} not found`);
        }
        await film.destroy()

        return film;
    }

}
