import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PersonsService } from "./persons.service";
import { CreatePersonsDto } from "./dto/create-persons.dto";
import { MessagePattern } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Person } from "./persons.model";
import { AuthorOrAdminGuard } from "apps/profile-service/src/profiles/guard/author-or-admin.guard";

@ApiTags('countries')
@Controller('persons')
export class PersonsController {
    constructor(private personsService: PersonsService) {}

    @ApiOperation({summary: "Создание человека"})
    @ApiResponse({status: 200, type: Person})
    @UseGuards(AuthorOrAdminGuard)
    @Post()
    create(@Body() dto: CreatePersonsDto) {
        return this.personsService.createPersons(dto); 
    }
    
    @ApiOperation({summary: "Получения всех людей"})
    @ApiResponse({status: 200, type: Person})
    @Get()
    getAll() {
        return this.personsService.getAll();
    }

    @ApiOperation({summary: "Получение человека по именя"})
    @ApiResponse({status: 200, type: Person})
    @Get('/personName/:personName')
    async getPersonsByName(@Param('personName') personName: string) {
        const film = await this.personsService.getPersonsByName(personName)
        return film;
    }

    @ApiOperation({summary: "Получение человека по id"})
    @ApiResponse({status: 200, type: Person})
    @Get('/:id')
    async getPersonById(@Param('id')  id: number) {
        const lang = '??' //Пока хз, как именно мы будем получать этот параметр
        return this.personsService.getPersonById(id, lang);
    }
    
    @MessagePattern("persons-request")
    getActors(request) {
        const filmsId = request.filmsId;
        const poster = request.poster;
        const lang = request.lang;
        return this.personsService.getPersons(filmsId, poster, lang);
    }

}