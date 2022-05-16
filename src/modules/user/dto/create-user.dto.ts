import { IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @Length(13,13)
    nationalId: string

    @IsString()
    @MinLength(8)
    password: string
}
