
import { UserDto } from "@app/common";
import { ProfileDto } from "./profile.dto";

export class RegisterDto {

    readonly userDto: UserDto;
    readonly profileDto: ProfileDto;
    
}