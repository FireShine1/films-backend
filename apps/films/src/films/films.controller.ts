import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { CreateFilmsDto } from "./dto/create-films.dto";
import { MessagePattern } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Film } from "./films.model";
import { AuthorOrAdminGuard } from "apps/profile-service/src/profiles/guard/author-or-admin.guard";
import { Roles, RolesGuard } from "@app/common";

@ApiTags('films')
@Controller()
export class FilmsController {
    
    constructor(private filmsService: FilmsService) {}

    @ApiOperation({summary: "Создание фильма"})
    @ApiResponse({status: 200, type: Film})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('films')
    async create(@Body() dto: CreateFilmsDto) {
        return await this.filmsService.createFilms(dto); 
    }
    
    @ApiOperation({summary: "Получение всех фильмов"})
    @ApiResponse({status: 200, type: [Film]})
    @Get('films')
    async getAll() {
        return await this.filmsService.getAll();
    }

    @ApiOperation({summary: "Получение фильма по названию"})
    @ApiResponse({status: 200, type: Film})
    @Get('films/filmName/:filmName')
    async getFilmsByName(@Param('filmName') filmName: string) {
        const film = await this.filmsService.getFilmsByName(filmName)
        return film;
    }

    @ApiOperation({summary: "Получение фильма по типу фильма"})
    @ApiResponse({status: 200, type: Film})
    @Get('films/filmType/:filmType')
    async getFilmsByType(@Param('filmType') filmType: string) {
        const film = await this.filmsService.getFilmsByType(filmType)
        return film;
    }

    @ApiOperation({summary: "Получение фильма по id"})
    @ApiResponse({status: 200, type: Film})
    @Get('films/:id')
    async getFilmsById(@Param('id')  id: number) {
        const lang = '??'   //Пока хз, как мы будем его получать
        const film = await this.filmsService.getFilmById(id, lang);
        return film;
        
    }

    //Для главной страницы и для страницы поиска без фильтров
    @ApiOperation({summary: "-"})
    @ApiResponse({status: 200, type: Film})
    @Get(['main', 'films'])
    getFilmsSets() {
        const lang = '??'   //Опять язык, который пока хз, как мы будем получать
        return this.filmsService.getFilmsSets(lang);
    }

    //Скорее всего, основным методом для поиска фильмов будет что-то типа этого
    //Post или Get - тут хз, надо ребят с фронта спрашивать
    //Так же как и то, как именно мы filters получаем
    //Набросал пока для примера
    @ApiOperation({summary: "Фильры"})
    @ApiResponse({status: 200, type: Film})
    @Post('films/*')
    getFilmsByFilters(@Body() filters) {
        const countries = filters.countries;
        const genres = filters.genres;
        const lang = filters.lang;

        return this.filmsService.getFilmsByFilters(countries, genres, lang);
    }
    
    //Это чтобы отдавать сервису личностей по запросу конкретной личности фильмы,
    //в которых эта личность участвовала
    @MessagePattern('films-request')
    getFilmsByPerson(request) {
        const filmsId = request.filmsId;
        const lang = request.lang;
        return this.filmsService.getFilmsByPerson(filmsId, lang);
    }

    @ApiOperation({summary: "Получение фильма по году создания"})
    @ApiResponse({status: 200, type: Film})
    @Get('/year/:year')
    async getFilmsByDate(@Param('year')  filmYear: number) {
        const film = await this.filmsService.getFilmsByYear(filmYear);
        return film;
    }

    @ApiOperation({summary: "Изменение названия фильма по id"})
    @ApiResponse({status: 200, type: Film})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('films/:id/:lang/name')
    async updateFilmsName(@Param('id') id: number, @Param('lang') lang: string, @Body('name') newFilmsName: string) {
        const film = await this.filmsService.updateFilmsName(id, lang, newFilmsName);
        return film;
    }

    @ApiOperation({summary: "Удаление фильма"})
    @ApiResponse({status: 200, type: Film})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    async deleteFilm(@Param('id') id: number) {
       return await this.filmsService.deleteFilm(id);
    }

    
    /*@MessagePattern({ cmd: 'get-Films'})
    async getFilms(@Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message)
        return {Films: 'Films'}
    }*/
}   


