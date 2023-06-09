import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { Profile } from '../profiles/profiles.model';
import { Review } from './reviews.model';
import { ReviewsModule } from './reviews.module';
import { CreateReviewDto } from './dto/create-review.dto';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;
  let reviewsDto: CreateReviewDto;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [ReviewsService,
        {
          provide: getModelToken(Profile),
          useValue: {},
        },
        {
          provide: getModelToken(Review),
          useValue: {},
        },
      ],
      imports: [ReviewsModule, Review,
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: "localhost",
          port: 5432,
          username:"postgres",
          password: "12345678",
          database: "films_v2",
          models: [], 
          autoLoadModels: true,
        }),
      ],
  }).compile();
    controller = app.get<ReviewsController>(ReviewsController);
    service = app.get<ReviewsService>(ReviewsService);
    reviewsDto = app.get<CreateReviewDto>(CreateReviewDto);
  });

  describe('ReviewsController', () => {
    it('createProfile', async () => {
      const dto: typeof reviewsDto = {
      review: "test",
      parentReviewId: 1,
      profileId: 1,
      };
      let filmId = 1;
      const review = await controller.create(dto, filmId);
      expect(review).toMatchObject({
        "id": 1,
        "review": "test",
        "parentReviewId": 1,
        "profileId": 1,
        "filmId": filmId
      });
    });
    it('getAllReviews', async () => {
      const review = await controller.getAll();
      expect(review).toHaveLength(0);
    });
  });
});
