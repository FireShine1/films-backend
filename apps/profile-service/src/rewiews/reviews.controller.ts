import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Review } from './reviews.model';
import { Roles, RolesGuard } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

    @ApiOperation({summary: "Создание комментария"})
    @ApiResponse({status: 201, type: Review})
    @Roles("USER")
    @UseGuards(RolesGuard)
    @Post('film/:id/comment')
    create(@Body() dto: CreateReviewDto, @Param('filmId') filmId: number) {
        return this.reviewsService.createReview(dto, filmId);
    }
    
    @ApiOperation({summary: "Получение всех комментариев"})
    @ApiResponse({status: 200, type: Review})
    @Get()
    getAll() {
        return this.reviewsService.getAll();
    }

    @MessagePattern('reviews-request')
    getReviewsByFilm(request) {
        const filmId = request.filmId;
        return this.reviewsService.getReviewsByFilm(filmId);
    }

}
