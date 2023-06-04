import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Profile } from "../profiles/profiles.model";

/*interface ReviewsCreationAttrs {
    review: string;
    parentReviewId: number;
    profileId: number;
    filmId: number;
};*/

@Table( {tableName: 'reviews', underscored: true, timestamps: true })
export class Review extends Model<Review> {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({example: 'Хороший фильм', description: 'Коментарий к фильму'})
    @Column({type: DataType.TEXT, allowNull: false})
    review: string;

    @BelongsTo(() => Profile, {onDelete: 'CASCADE',  hooks:true})
    profile: Profile;

    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id пользователя'})
    @ForeignKey(() => Profile)
    @Column({type: DataType.INTEGER})
    profileId: number;

    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id фильма'})
    @Column({type: DataType.INTEGER})
    filmId: number;

    //@ForeignKey(() => Review)
    @Column({type: DataType.INTEGER})
    parentReviewId: number;

    //@HasMany(() => Review)
    childReviews: Review[];
    
}