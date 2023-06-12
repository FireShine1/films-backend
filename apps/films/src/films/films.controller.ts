import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { CreateFilmsDto } from "./dto/create-films.dto";
import { MessagePattern } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Film } from "./films.model";
import { RolesGuard } from "@app/common/guards/roles.guard";
import { Roles } from "@app/common/guards/roles-auth.decorator";


@ApiTags('films')
@Controller()
export class FilmsController {

    constructor(private filmsService: FilmsService) { }

    //@ApiOperation({ summary: "Создание фильма" })
    //@ApiResponse({ status: 200, type: Film })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('films')
    async create(@Body() dto: CreateFilmsDto) {
        return await this.filmsService.createFilms(dto);
    }

    //@ApiOperation({ summary: "Получение всех фильмов" })
    //@ApiResponse({ status: 200, type: [Film] })
    @Get('films')
    async getAll() {
        return await this.filmsService.getAll();
    }

    //@ApiOperation({ summary: "Получение фильма по названию" })
    //@ApiResponse({ status: 200, type: Film })
    @Get('films/filmName/:filmName')
    async getFilmsByName(@Param('filmName') filmName: string) {
        const film = await this.filmsService.getFilmsByName(filmName)
        return film;
    }

    //@ApiOperation({ summary: "Получение фильма по типу фильма" })
    //@ApiResponse({ status: 200, type: Film })
    @Get('films/filmType/:filmType')
    async getFilmsByType(@Param('filmType') filmType: string) {
        const film = await this.filmsService.getFilmsByType(filmType)
        return film;
    }

    @ApiOperation({ summary: "Получение фильма по id" })
    @ApiResponse({ status: 200, type: Film })
    @Get('film/:id')
    async getFilmById(@Param('id') id: number,
        @Query('lang') lang: string) {
        const film = await this.filmsService.getFilmById(id, lang);
        return film;

    }

    //Для главной страницы
    @ApiOperation({ summary: "Получение подборок фильмов для главной страницы" })
    @ApiResponse({ status: 200, type: Film })
    @Get('home')
    getFilmsSets(@Query('lang') lang: string) {
        return this.filmsService.getFilmsSets(lang);
    }

    @ApiOperation({ summary: "Страница поиска без фильтров" })
    @ApiResponse({ status: 200, type: Film })
    @Get('movies')
    getStartData(@Query('lang') lang: string) {
        return this.filmsService.getStartData(lang);
    }

    //Скорее всего, основным методом для поиска фильмов будет что-то типа этого
    //Post или Get - тут хз, надо ребят с фронта спрашивать
    //Так же как и то, как именно мы filters получаем
    //Набросал пока для примера
    @ApiOperation({ summary: "Поиск фильмов по фильтрам" })
    @ApiResponse({ status: 200, type: Film })
    @Post('movies')
    getFilmsByFilters(@Body() filters, @Query('lang') lang: string) {
        const countries = filters.countries;
        const genres = filters.genres;
        const actors = filters.actors;
        const directors = filters.directors;

        return this.filmsService.getFilmsByFilters(countries, genres, actors, directors, lang);
    }

    //Это чтобы отдавать сервису личностей по запросу конкретной личности фильмы,
    //в которых эта личность участвовала
    @MessagePattern('films-request')
    getFilmsByPerson(request) {
        const filmsId = request.filmsId;
        const lang = request.lang;
        return this.filmsService.getFilmsByPerson(filmsId, lang);
    }

    //@ApiOperation({ summary: "Получение фильма по году создания" })
    //@ApiResponse({ status: 200, type: Film })
    @Get('films/year/:year')
    async getFilmsByDate(@Param('year') filmYear: number) {
        const film = await this.filmsService.getFilmsByYear(filmYear);
        return film;
    }

    @ApiOperation({ summary: "Изменение названия фильма по id" })
    @ApiResponse({ status: 200, type: Film })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('admin/film/:id')
    async updateFilmName(
        @Param('id') id: number,
        @Query('lang') lang: string,
        @Body('name') newFilmName: string
    ) {
        const film = await this.filmsService.updateFilmName(id, lang, newFilmName);
        return film;
    }

    @ApiOperation({ summary: "Удаление фильма" })
    @ApiResponse({ status: 200, type: Film })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('admin/film/:id')
    async deleteFilm(@Param('id') id: number) {
        return await this.filmsService.deleteFilm(id);
    }

}


