import { ApiProperty } from "@nestjs/swagger";

export class ProfileDto {
    /*@ApiProperty({example: 'Анатолий', description: 'Имя пользователя'})
    readonly name: string;

    @ApiProperty({example: 'Максимович', description: 'Отчество пользователя'})
    readonly middleName: string;

    @ApiProperty({example: 'Пушкин', description: 'Фамилия пользователя'})
    readonly lastName: string;*/

    @ApiProperty({example: 'Анатолий Пушкин', description: 'Ник пользователя'})
    readonly nickname: string;

    /*@ApiProperty({example: 'О себе:', description: 'Описание пользователя'})
    readonly description: string;
    
    @ApiProperty({example: '+79999999999', description: 'Телефон пользователя'})
    readonly phoneNumber: string;*/
    
}