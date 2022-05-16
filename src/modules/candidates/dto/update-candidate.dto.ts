import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateCandidateDto } from './create-candidate.dto';

export class UpdateCandidateDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    dob: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => value.replaceAll(/<|>/ig, ''))
    @IsUrl()
    bioLink: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Transform(({value}) => value.replaceAll(/<|>/ig, ''))
    @IsUrl()
    imageLink: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    policy: string

}
