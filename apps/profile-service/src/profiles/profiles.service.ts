import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { UserDto } from "@app/common";
import { Profile } from './profiles.model';
import { ProfileDto } from './dto/profile.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class ProfilesService {

    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
        @Inject('auth_service') private client: ClientProxy) { };

    async login(userDto: UserDto) {
        const data = await firstValueFrom(this.client.send("login", userDto));
        if (data.error) {
            throw new HttpException(data.error.message, data.error.status);
        }
        const {tokens, user} = data;

        const profile = await this.profileRepository.findOne( { where: { userId: user.id } } )

        return {tokens, user, profile};
    }

    async register(registerDto: RegisterDto) {
        const { userDto, profileDto } = registerDto;

        const data = await firstValueFrom(this.client.send("register", userDto));
        if (data.error) {
            throw new HttpException(data.error.message, data.error.status);
        }

        const {tokens, user} = data;

        const profile = await this.profileRepository.create({userId: user.id, ...profileDto});
        return { tokens, profile, user };

    }

    async logout(refreshToken) {
        await firstValueFrom(this.client.send("logout", refreshToken));
    }

    async refresh(refreshToken) {
        const data = await firstValueFrom(this.client.send("refresh", refreshToken));
        if (data.error) {
            throw new HttpException(data.error.message, data.error.status);
        }

        return data;
    }

    async getAll() {
        const users = await firstValueFrom(this.client.send("getAll", 'null'));
        const profiles = await this.profileRepository.findAll();

        const data = profiles.map(profile => this.mapUsersToProfiles(profile, users));
        return data;
    }

    private mapUsersToProfiles(profile, users) {
        const user = users.find(user => user.id == profile.userId);
        return {profile, user};
    }

    async getUserDataById(id: number) {
        const profile = await this.profileRepository.findByPk(id);
        const user = await firstValueFrom(this.client.send("getById", profile.userId));
        return {user, profile};
    }

    async getProfileById(id: number) {
        return await this.profileRepository.findByPk(id);
    }

    async update(id: number, newProfile: ProfileDto) {
        return this.profileRepository.update(newProfile, { where: { id }, returning: true });
    }

    async delete(id: number) {
        await firstValueFrom(this.client.send("delete", id));
        this.profileRepository.destroy({ where: { id } });
    }

}