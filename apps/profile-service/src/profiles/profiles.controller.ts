import { Body, Controller, Delete, Get, Param, Post, Put, Response, Request, UseGuards } from '@nestjs/common';
import { Roles, RolesGuard, UserDto } from "@app/common";
import { ProfilesService } from "./profiles.service";
import { ProfileDto } from './dto/profile.dto';
import { AuthorOrAdminGuard } from './guard/author-or-admin.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Profile } from './profiles.model';
import { RegisterDto } from './dto/register.dto';


@Controller('users')
export class ProfilesController {

    constructor(private profilesService: ProfilesService) { }

    @ApiOperation({ summary: "Вход пользователя" })
    @ApiResponse({ status: 200, type: Profile })
    @Post('/login')
    async login(@Body() userDto: UserDto, @Response({ passthrough: true }) res) {
        const userData = await this.profilesService.login(userDto);

        res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return userData;
    }

    @ApiOperation({ summary: "Регистрация пользователя" })
    @ApiResponse({ status: 200, type: Profile })
    @Post('/registration')
    async registration(@Body() registerDto: RegisterDto, @Response({ passthrough: true }) res) {
        const userData = await this.profilesService.register(registerDto);

        res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return userData;
    }

    @ApiOperation({ summary: "Выход пользователя" })
    @ApiResponse({ status: 200, type: Profile })
    @Post('/logout')
    async logout(@Request() req) {
        const { refreshToken } = req.cookies;

        await this.profilesService.logout(refreshToken);
    }

    @ApiOperation({ summary: "Обновление токена" })
    @ApiResponse({ status: 200, type: Profile })
    @Get('/refresh')
    async refresh(@Request() req, @Response({ passthrough: true }) res) {
        const { refreshToken } = req.cookies;
        const userData = await this.profilesService.refresh(refreshToken);
        res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return userData;
    }

    @ApiOperation({ summary: "Получение всех профилей" })
    @ApiResponse({ status: 200, type: Profile })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.profilesService.getAll();
    }

    @ApiOperation({ summary: "Получение данных пользователя по id" })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(AuthorOrAdminGuard)
    @Get('full/:id')
    getUserDataById(@Param('id') id: number) {
        return this.profilesService.getUserDataById(id);
    }

    @ApiOperation({ summary: "Получение профиля по id" })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(AuthorOrAdminGuard)
    @Get('/:id')
    getProfileById(@Param('id') id: number) {
        return this.profilesService.getProfileById(id);
    }

    @ApiOperation({ summary: "Обновление профиля" })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(AuthorOrAdminGuard)
    @Put('/:id')
    update(@Param('id') id: number,
        @Body() profileDto: ProfileDto) {
        return this.profilesService.update(id, profileDto);
    }

    @ApiOperation({ summary: "Удаление профиля" })
    @ApiResponse({ status: 200, type: Profile })
    @UseGuards(AuthorOrAdminGuard)
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.profilesService.delete(id);
    }

}