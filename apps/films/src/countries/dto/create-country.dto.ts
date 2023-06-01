import { ApiProperty } from "@nestjs/swagger";

export class CreateCountryDto {
    @ApiProperty({example: 'ru', description: 'Язык'})
    readonly id: number;
    @ApiProperty({example: 'ru', description: 'Язык'})
    readonly lang: string;
    @ApiProperty({example: 'США', description: 'Название страны'})
    readonly name: string;
}
   