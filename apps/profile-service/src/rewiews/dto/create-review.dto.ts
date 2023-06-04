import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewDto {
    @ApiProperty({example: 'Хороший фильм', description: 'Коментарий к фильму'})
    readonly review: string;

    @ApiProperty({example: '1', description: 'id родительского комментария, если есть'})
    readonly parentReviewId: number;

    @ApiProperty({example: '1', description: 'id профиля автора'})
    readonly profileId: number;
}