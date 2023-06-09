import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Person } from './persons.model';
import { CreatePersonsDto } from './dto/create-persons.dto';
import { PersonLang } from './persons-lang.model';
import { FilmsActors } from './films-actors.model';
import { DirectorsFilms } from './directors-films.model';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class PersonsService {
    constructor(
        @InjectModel(Person) private personsRepository: typeof Person,
        @InjectModel(PersonLang) private personlangRepository: typeof PersonLang,
        @InjectModel(DirectorsFilms) private directorsFilmsRepository: typeof DirectorsFilms,
        @InjectModel(FilmsActors) private actorsFilmsRepository: typeof FilmsActors,
        @Inject('persons_service') private client: ClientProxy,
        ) { }

    async getPersonsData() {
        const actors = await this.getAllActors();
        const directors = await this.getAllDirectors();
        const popularActors = await this.getPopularActors();

        return {actors, directors, popularActors};
    }

    async getPersons(filmsId, poster, lang) {
        const actors = await this.getActors(filmsId, poster, lang);
        const directors = await this.getDirectors(filmsId, poster, lang);
        return { actors, directors };
    }

    async getPersonById(id: number, lang: string) {
        const person = await this.personsRepository.findByPk(id, {
            include: [
                {
                    model: PersonLang,
                    attributes: ['lang', 'personName', 'career', 'birthPlace'],
                }
            ]
        });

        if (!person) {
            throw new NotFoundException(`Person with id ${id} not found`);
        }


        try {
            const filmsId = await this.getFilmsIdsByPerson(id);

            const filmsData = await firstValueFrom(this.client.send("films-request", { filmsId, lang }));

            person.dataValues.films = filmsData.map(film => {
                return {
                    id: film.id,
                    name: film.filmLang[0].filmName,
                    year: film.filmYear,
                    rating: film.filmGrade,
                    poster: film.filmPoster,
                }
            });

            return person;
        } catch(err) {
            console.log(err);

            person.dataValues.films = 'Error: Cannot load films';

            return person;
        }
    }

    async createPerson(dto: CreatePersonsDto) {
        const Persons = await this.personsRepository.create(dto);
        return Persons;
    }

    async getAll() {
        const Persons = await this.personsRepository.findAll({ include: { all: true } });
        return Persons;
    }

    async getPersonByName(personName: string) {
        const Persons = await this.personlangRepository.findOne({
            where: { personName },
            include: { all: true }
        });
        return Persons;
    }

    private async getAllActors() {
        const actorsIds = await this.personsRepository.findAll({
            attributes: ['id'],
            include: [
                {
                    model: FilmsActors,
                    attributes: [],
                    required: true,
                },
            ],
            group: ['Person.id'],
        });
        const ids = actorsIds.map(item => item.id);

        return await this.personsRepository.findAll({
            attributes: ['id'],
            where: {
                id: {
                    [Op.in]: [...ids]
                }
            },
            include: [
                {
                    model: PersonLang,
                    attributes: ['lang','personName'],
                }
            ]
        });
    }

    private async getAllDirectors() {
        const directorsIds = await this.personsRepository.findAll({
            attributes: ['id'],
            include: [
                {
                    model: DirectorsFilms,
                    attributes: [],
                    required: true,
                },
            ],
            group: ['Person.id'],
        });
        const ids = directorsIds.map(item => item.id);

        return await this.personsRepository.findAll({
            attributes: ['id'],
            where: {
                id: {
                    [Op.in]: [...ids]
                }
            },
            include: [
                {
                    model: PersonLang,
                    attributes: ['lang', 'personName'],
                }
            ]
        });
    }

    private async getPopularActors() {
        const personsIds = await this.personsRepository.findAll({
            subQuery: false,
            attributes: [
                'id',
                [Sequelize.fn("COUNT", Sequelize.col("actorFilms.film_id")), "filmsNumber"]
            ],
            include: [
                {
                    model: FilmsActors,
                    attributes: [],
                },
            ],
            group: ['Person.id'],
            order: [['filmsNumber', 'DESC']],
            limit: 30,
        });
        const ids = personsIds.map(item => item.id);

        const persons = await this.personsRepository.findAll({
            attributes: ['id', 'personPicture'],
            where: {
                id: {
                    [Op.in]: [...ids]
                }
            },
            include: [
                {
                    model: PersonLang,
                    attributes: ['lang', 'personName'],
                }
            ]
        });

        let result = [];
        persons.forEach(person => personsIds.forEach(item => {
            if (person.id == item.id) {
                result.push({person, filmsNumber: item.dataValues['filmsNumber']})
            }
        }));

        return result.sort((item1, item2) => (item2.filmsNumber - item1.filmsNumber));
    }
    
    private async getActors(filmsId, poster, lang) {
        let attr;

        if (poster) {
            attr = ['id', 'personPicture'];
        } else {
            attr = ['id'];
        }

        return await this.personsRepository.findAll({
            attributes: attr,
            include: [
                {
                    model: FilmsActors,
                    attributes: ['filmId'],
                    where: {
                        filmId: { [Op.in]: [...filmsId] }
                    }
                },
                {
                    model: PersonLang,
                    attributes: ['personName'],
                    where: { lang: lang }
                }
            ]
        });
    }

    private async getDirectors(filmsId, poster, lang) {
        let attr;

        if (poster) {
            attr = ['id', 'personPicture'];
        } else {
            attr = ['id'];
        }
        
        return await this.personsRepository.findAll({
            attributes: attr,
            include: [
                {
                    model: DirectorsFilms,
                    attributes: ['filmId'],
                    where: {
                        filmId: { [Op.in]: [...filmsId] }
                    }
                },
                {
                    model: PersonLang,
                    attributes: ['personName'],
                    where: { lang: lang }
                }
            ]
        });
    }

    private async getFilmsIdsByPerson(id: number) {
        let personFilmsId: number[];

        const actorFilmsId = await this.actorsFilmsRepository.findAll({
            attributes: ['filmId'],
            where: { actorId: id },
        });
        personFilmsId = actorFilmsId.map(item => item.filmId);

        const directorFilmsId = await this.directorsFilmsRepository.findAll({
            attributes: ['filmId'],
            where: { directorId: id },
        });
        directorFilmsId.forEach(item => personFilmsId.push(item.id));

        return personFilmsId;
    }

}