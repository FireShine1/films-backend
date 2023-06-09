import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from "@app/common";
import * as bcrypt from 'bcryptjs'
import { User } from "./auth.model";
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService,
        private tokenService: TokenService) {}

    async login(userDto: UserDto) {
        const data = await this.validateUser(userDto);

        if (data instanceof User) {
            return await this.generateTokens(data);
        } else {
            return data;
        }
        
    }

    async register(userDto: UserDto) {

        const candidate = await this.getUserByEmail(userDto.email);
        if (candidate) {
            return {error: {message: 'Пользователь с таким email существует', status: HttpStatus.BAD_REQUEST} };
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);

        const user = await this.createUser({ ...userDto, password: hashPassword });

        return await this.generateTokens(user);
    }

    async logout(refreshToken) {
        await this.tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            return {error: {message: 'Пользователь не авторизован', status: HttpStatus.UNAUTHORIZED} };
        }

        const userData = this.tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            return {error: {message: 'Пользователь не авторизован', status: HttpStatus.UNAUTHORIZED} };
        }

        const user = await this.userRepository.findOne({where: {id: userData.id} });

        return await this.generateTokens(user);
    }

    async delete(userId: number) {
        await this.userRepository.destroy({where: {id: userId} });
        //мы не удаляем токен вручную, потому что он будет удален благодаря опции onDelete: 'CASCADE'
    }

    async getAll() {
        return await this.userRepository.findAll();
    }

    async getById(userId: number) {
        return await this.userRepository.findByPk(userId);
    }

    private async generateTokens(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles };
        const tokens = this.tokenService.generateTokens(payload);
        await this.tokenService.saveToken(user.id, tokens.refreshToken);

        return { tokens, user: user };
    }

    private async createUser(dto: UserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("USER");
        await user.$set('roles', [role.id]);
        user.roles = [role];

        return user;
    }

    private async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }

    private async validateUser(userDto: UserDto) {

        const user = await this.getUserByEmail(userDto.email);
        if (!user) {
            return {error: {message: 'Пользователя с таким email не существует', status: HttpStatus.UNAUTHORIZED} };
        }

        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!passwordEquals) {
            return {error: {message: 'Неверный пароль', status: HttpStatus.UNAUTHORIZED} };
        }

        return user;
    }

}