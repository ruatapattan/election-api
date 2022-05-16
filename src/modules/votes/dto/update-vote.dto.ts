import { IsNumber, IsUUID } from 'class-validator';

export class UpdateVoteDto {
  @IsUUID()
  candidateId: string;

  @IsNumber()
  votedCount: number;
}
