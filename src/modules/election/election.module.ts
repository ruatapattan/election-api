import { forwardRef, Module } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Election } from './entities/election.entity';
import { CandidatesModule } from '../candidates/candidates.module';
import { VotesModule } from '../votes/votes.module';

@Module({
  exports:[ElectionService],
  imports: [
    TypeOrmModule.forFeature([Election]), 
    forwardRef(() => CandidatesModule),
    forwardRef(() => VotesModule),
  ],
  controllers: [ElectionController],
  providers: [ElectionService]
})
export class ElectionModule {}
