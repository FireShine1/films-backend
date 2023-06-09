import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateGenresDto } from './dto/create-genres.dto';
import { GenresService } from './genres.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Genre } from './genres.model';
import { Roles, RolesGuard } from '@app/common';

@ApiTags('genres')
@Controller()
export class GenresController {
    constructor(private genresService: GenresService) {}

    @ApiOperation({summary: "Создание жанра"})
    @ApiResponse({status: 200, type: Genre})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/genres')
    async create(@Body() dto: CreateGenresDto) {
        return await this.genresService.createGenres(dto); 
    }
    
    @ApiOperation({summary: "Получение всех жанров"})
    @ApiResponse({status: 200, type: Genre})
    @Get('/genres')
    async getAll() {
        return await this.genresService.getAll();
    }

    @ApiOperation({summary: "Получение жанра по id"})
    @ApiResponse({status: 200, type: Genre})
    @Get('genres/:id')
    async getGenreById(@Param('id') id: number) {
        const genre = await this.genresService.getGenreById(id);
        return genre;
    }

    @ApiOperation({summary: "Изменение названия жанра по id"})
    @ApiResponse({status: 200, type: Genre})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('admin/genres/:id')
    async updateGenreName(@Param('id') id: number, @Body('name') newName: string) {
        const genre = await this.genresService.updateGenreName(id, newName);
        return genre;
    }

    @ApiOperation({summary: "Удаление жанра по id"})
    @ApiResponse({status: 200, type: Genre})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete('admin/genres/:id')
    async deleteGenre(@Param('id') id: number) {
       return await this.genresService.deleteGenre(id);
    }
    
}
