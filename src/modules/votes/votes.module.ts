import { forwardRef, Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesGateway } from './votes.gateway';
import { Vote } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesController } from './votes.controller';
import { Voter } from './entities/voter.entity';
import { ElectionModule } from '../election/election.module';

@Module({
  exports:[VotesService, VotesGateway],
  imports:[
    TypeOrmModule.forFeature([Vote, Voter]), 
    forwardRef(() => ElectionModule)
  ],
  providers: [VotesGateway, VotesService],
  controllers: [VotesController]
})
export class VotesModule {}
