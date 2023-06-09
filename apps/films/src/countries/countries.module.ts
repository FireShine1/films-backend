import { Module } from '@nestjs/common';
import { CountryController } from './countries.controller';
import { CountryService } from './countries.service';
import { Country } from './countries.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountriesFilms } from './countries-films.model';

@Module({
    controllers: [CountryController],
    providers: [CountryService],
    imports: [
        SequelizeModule.forFeature([Country, CountriesFilms]),
    ],
    
    exports: [CountryService]
})

export class CountriesModule {}
