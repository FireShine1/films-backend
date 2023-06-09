import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Person } from "./persons/persons.model";
import { PersonsModule } from "./persons/persons.module";
import { PersonLang } from "./persons/persons-lang.model";
import { FilmsActors } from "./persons/films-actors.model";
import { DirectorsFilms } from "./persons/directors-films.model";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        SequelizeModule.forRoot({
            //dialectModule: require('pg'),
            dialect: 'postgres',
            host: "localhost",
            port: 5432,
            username:"postgres",
            password: "12345678",
            database: "persons_v2",
            models: [
                Person,
                PersonLang,
                FilmsActors,
                DirectorsFilms],
            autoLoadModels: true
        }),
        PersonsModule
    ]
})
export class AppModule { };