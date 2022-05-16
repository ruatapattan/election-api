import { IsNumber, IsString, IsUUID, Length, MaxLength, MinLength } from "class-validator";

export class VoterDto {
    
    @IsString()
    @Length(13,13, {
        message: "nationalId must be 13 digits long"
    })
    nationalId: string
    
}
