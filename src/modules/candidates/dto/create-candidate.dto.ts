import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCandidateDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    dob: string

    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => value.replaceAll(/<|>/ig, ''))
    @IsUrl()
    bioLink: string

    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => value.replaceAll(/<|>/ig, ''))
    @IsUrl()
    imageLink: string

    @IsNotEmpty()
    @IsString()
    policy: string
}
