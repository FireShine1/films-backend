import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { PersonsService } from "./persons.service";
import { CreatePersonsDto } from "./dto/create-persons.dto";
import { MessagePattern } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Person } from "./persons.model";
import { AuthorOrAdminGuard } from "apps/profile-service/src/profiles/guard/author-or-admin.guard";
import { Roles, RolesGuard } from "@app/common";

@ApiTags('persons')
@Controller('persons')
export class PersonsController {
    constructor(private personsService: PersonsService) {}

<<<<<<< HEAD
    @ApiOperation({summary: "Создание человека"})
    @ApiResponse({status: 200, type: Person})
    // @Roles("ADMIN")
    // @UseGuards(RolesGuard)
=======
    //@ApiOperation({summary: "Создание человека"})
    //@ApiResponse({status: 200, type: Person})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
>>>>>>> 0b760ad6cf57fe576010cd99c22c7f401e8f7824
    @Post()
    create(@Body() dto: CreatePersonsDto) {
        return this.personsService.createPerson(dto); 
    }
    
    //@ApiOperation({summary: "Получения всех людей"})
    //@ApiResponse({status: 200, type: Person})
    @Get()
    getAll() {
        return this.personsService.getAll();
    }

    //@ApiOperation({summary: "Получение человека по имени"})
    //@ApiResponse({status: 200, type: Person})
    @Get('/personName/:personName')
    async getPersonsByName(@Param('personName') personName: string) {
        const film = await this.personsService.getPersonByName(personName)
        return film;
    }

    @ApiOperation({summary: "Получение человека по id"})
    @ApiResponse({status: 200, type: Person})
    @Get('/:id')
    async getPersonById(@Param('id')  id: number, @Query('lang') lang: string) {
        return this.personsService.getPersonById(id, lang);
    }
    
    @MessagePattern("persons-request")
    getPersons(request) {
        const filmsId = request.filmsId;
        const poster = request.poster;
        const lang = request.lang;
        return this.personsService.getPersons(filmsId, poster, lang);
    }

    @MessagePattern("persons-data-request")
    getPersonData(request) {
        return this.personsService.getPersonsData();
    }

}