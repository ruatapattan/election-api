import { IsNumber, IsString, IsUUID } from "class-validator";
import { VoterDto } from "./voter.dto";

export class CreateVoteDto extends VoterDto{
    
    @IsUUID()
    candidateId: string
    
}
