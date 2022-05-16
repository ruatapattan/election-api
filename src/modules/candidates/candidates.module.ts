import { forwardRef, Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { VotesModule } from '../votes/votes.module';
import { VotesGateway } from '../votes/votes.gateway';
import { VotesService } from '../votes/votes.service';
import { Vote } from '../votes/entities/vote.entity';
import { ElectionModule } from '../election/election.module';

@Module({
  exports:[CandidatesService],
  imports:[TypeOrmModule.forFeature([Candidate]), VotesModule, forwardRef(() => ElectionModule)],
  controllers: [CandidatesController],
  providers: [CandidatesService]
})
export class CandidatesModule {}
