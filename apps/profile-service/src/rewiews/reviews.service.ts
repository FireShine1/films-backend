import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Review } from "./reviews.model";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Profile } from "../profiles/profiles.model";

@Injectable()
export class ReviewsService {

    constructor (@InjectModel(Review) private reviewsRepository: typeof Review) {}
    
    async createReview(dto: CreateReviewDto, filmId: number) {
        const review = await this.reviewsRepository.create({filmId, ...dto});
        return review;
    }

    async getAll() {
        const reviews = await this.reviewsRepository.findAll({include: {all: true}});
        return reviews;
    }

    async getReviewsByFilm(filmId: number) {
        let reviews = await this.reviewsRepository.findAll({
            where: { filmId },
            include: [
                {
                    model: Profile,
                    attributes: ['id', 'nickname']
                }
            ]
        });

        let result = reviews.filter(review => !review.parentReviewId);

        for (let review of result) {
            if (!review.parentReviewId) {
                review.dataValues.childReviews = this.makeReviewHierarchy(reviews, review.id);
            }
        }

        return result;
    }

    private makeReviewHierarchy(reviews: Review[], id: number) {
        let result: Review[] = [];
        for (let review of reviews) {
            if (review.parentReviewId == id) {
                review.dataValues.childReviews = this.makeReviewHierarchy(reviews, review.id);
                result.push(review);
            }
        }
        return result;
    }

}