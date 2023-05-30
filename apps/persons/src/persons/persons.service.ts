import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Person } from './persons.model';
import { CreatePersonsDto } from './dto/create-persons.dto';
import { PersonLang } from './persons-lang.model';
import { FilmsActors } from './films-actors.model';
import { DirectorsFilms } from './directors-films.model';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Op } from 'sequelize';

@Injectable()
export class PersonsService {
    actorsFilmsRepository: any;
    directorsFilmsRepository: any;

    constructor(
        @InjectModel(Person) private personsRepository: typeof Person,
        @InjectModel(PersonLang) private personlangRepository: typeof PersonLang,
        @Inject('persons_service') private client: ClientProxy,) { }

    async createPersons(dto: CreatePersonsDto) {
        const Personss = await this.personsRepository.create(dto);
        return Personss;
    }

    async getAll() {
        const Personss = await this.personsRepository.findAll({ include: { all: true } });
        return Personss;
    }

    async getPersonsByName(personName: string) {
        const Persons = await this.personlangRepository.findOne({
            where: { personName },
            include: { all: true }
        });
        return Persons;
    }

    /*async getPersonsById(id: number) {
        const Persons = await this.personsRepository.findByPk(id);
        if (!Persons) {
            throw new Error('Personss not found');
        }
        return Persons;
    }*/

    async getPersons(filmsId, poster, lang) {
        const actors = await this.getActors(filmsId, poster, lang);
        const directors = await this.getDirectors(filmsId, poster, lang);
        return { actors, directors };
    }

    private async getActors(filmsId, poster, lang) {
        let attr;

        if (poster) {
            attr = ['id', 'personPicture'];
        } else {
            attr = ['id'];
        }

        return await this.personsRepository.findAll({
            attributes: ['id', 'personPicture'],
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
            attributes: ['id', 'personPicture'],
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
            throw new NotFoundException(`Film with id ${id} not found`);
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