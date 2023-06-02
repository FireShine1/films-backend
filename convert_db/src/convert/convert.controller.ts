import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConvertService } from './convert.service';

@Controller('/')
export class ConvertController {
    constructor(private readonly appService: ConvertService) { }

    @Get('convert/films')
    convertfilmDataBase() {
        this.appService.convertFilmsDataBase();
    }

    @Get('convert/actors')
    convertActorDataBase() {
        this.appService.convertActorsDataBase();
    }

    @Get('convert/actors-films')
    connectActorsToFilms() {
        this.appService.connectActorsToFilms();
    }

    @Get('convert/enGenres')
    addEnGenresAndCountries() {
        this.appService.addEnGenresAndCountries();
    }

    @Post('film')
    getOneFilm(@Body() body) {
        const name = body.name;
        const lang = body.lang;
        return this.appService.getOneFilm(name, lang);
    }

    @Post('filmByGenre')
    filterByGenres(@Body() body) {
        const genre = body.genre;
        return this.appService.filterByGenres(genre);
    }

    @Post('comment')
    createComment(@Body() comment) {
        this.appService.createReview(comment);
    }

    @Get('comment')
    getComments() {
        const id = 1;
        return this.appService.getFilmReviews(id);
    }

}
