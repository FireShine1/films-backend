import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
//import { Profile } from "../profiles/profiles.model";


/*interface ReviewsCreationAttrs {
    review: string;
    filmId: number;
    reviewId: number;
};*/

@Table( {tableName: 'reviews', underscored: true, timestamps: true })
export class Review extends Model<Review > {

    @ApiProperty({example: '1', description: 'Уникальный индентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({example: 'Хороший фильм', description: 'Коментарий к фильму'})
    @Column({type: DataType.STRING, allowNull: false})
    review: string;

    /*@BelongsTo(() => Profile, {onDelete: 'CASCADE',  hooks:true})
    profile: Profile;

    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id пользователя'})
    @ForeignKey(() => Profile)
    @Column({type: DataType.INTEGER})
    userId: number;*/

    @ApiProperty({example: '1', description: 'Уникальный индентификатор, id фильма'})
    @Column({type: DataType.INTEGER})
    filmId: number;

    //@ForeignKey(() => Review)
    @Column({type: DataType.INTEGER})
    reviewId: number;

    //@HasMany(() => Review)
    childReviews: Review[];
    
}