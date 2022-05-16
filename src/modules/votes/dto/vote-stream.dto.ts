import { IsInt, IsUUID } from "class-validator";

export class VoteStreamDto {
    
    @IsUUID()
    candidateId: string

    @IsInt()
    votedCount: number
    
}
