import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from '@app/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './reviews.model';

@Module({
    controllers: [ReviewsController],
    providers: [ReviewsService],
    imports: [
        SequelizeModule.forFeature([Review]),
        SharedModule,
    ],
    exports: [ReviewsService]
})

export class ReviewsModule { }
