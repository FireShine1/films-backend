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
    actorsFilmsRepository: any;
    directorsFilmsRepository: any;

    constructor(
        @InjectModel(Person) private personsRepository: typeof Person,
        @InjectModel(PersonLang) private personlangRepository: typeof PersonLang,
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
        return await this.personsRepository.findAll({
            attributes: ['id'],
            include: [
                {
                    model: FilmsActors,
                    attributes: [],
                    required: true,
                },
                {
                    model: PersonLang,
                    attributes: ['personName'],
                }
            ],
            group: ['Person.id'],
        });
    }

    private async getAllDirectors() {
        return await this.personsRepository.findAll({
            attributes: ['id'],
            include: [
                {
                    model: DirectorsFilms,
                    attributes: [],
                    required: true,
                },
                {
                    model: PersonLang,
                    attributes: ['personName'],
                }
            ],
            group: ['Person.id'],
        });
    }

    private async getPopularActors() {
        return await this.personsRepository.findAll({
            limit: 30,
            attributes: [
                'id', 'personPicture',
                [Sequelize.fn("COUNT", Sequelize.col("FilmsActors.filmId")), "filmsNumber"]
            ],
            include: [
                {
                    model: FilmsActors,
                    attributes: [],
                    required: true,
                },
                {
                    model: PersonLang,
                    attributes: ['personName'],
                }
            ],
            group: ['Person.id'],
            order: [['filmsNumber', 'DESC']],
        });
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