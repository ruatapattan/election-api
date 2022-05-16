import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class LoginDto extends CreateUserDto {
    
    @IsString()
    password: string;
}
