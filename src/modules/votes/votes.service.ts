import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import handleErrorUtils from '../..//ultilities/handleError.utils';
import { Connection, Repository } from 'typeorm';
import { Candidate } from '../candidates/entities/candidate.entity';
import { ElectionService } from '../election/election.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VoterDto } from './dto/voter.dto';
import { Vote } from './entities/vote.entity';
import { Voter } from './entities/voter.entity';
import { VotesGateway } from './votes.gateway';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(Voter)
    private voterRepository: Repository<Voter>,
    @Inject(forwardRef(() => ElectionService))
    private readonly electionService: ElectionService,
    private connection: Connection,
    private readonly votesGateway: VotesGateway,
  ) {}

  async voteForCandidate(createVoteDto: CreateVoteDto, res: Response) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      const electionStatus = await this.electionService.getElectionStatus();

      if (!electionStatus || !electionStatus.enable) {
        throw { name: 'UnprocessableError', message: 'Election is closed' };
      }

      const check = await this.checkVoterHelper(createVoteDto.nationalId);
      if (check) {
        throw { name: 'UnprocessableError', message: 'Already voted' };
      }

      const voterToCreate = new Voter();
      const candidateToVote = new Candidate();
      candidateToVote.id = createVoteDto.candidateId;
      voterToCreate.nationalId = createVoteDto.nationalId;
      voterToCreate.candidate = candidateToVote;

      await manager.save(voterToCreate);
      await manager
        .createQueryBuilder()
        .update(Vote)
        .set({ votedCount: () => 'voted_count + 1' })
        .where(`candidate_id = '${createVoteDto.candidateId}'`)
        .execute();

      queryRunner.commitTransaction();

      const newVote = await this.voteRepository
        .createQueryBuilder('vote')
        .select()
        .where(`vote.candidate_id = '${createVoteDto.candidateId}'`)
        .getOne();

      this.votesGateway.voted({
        candidateId: createVoteDto.candidateId,
        votedCount: newVote.votedCount,
      });

      res.status(HttpStatus.CREATED).json({
        status: 'ok',
      });
    } catch (error) {
      console.log('err', error);
      if (error.name === 'QueryFailedError') {
        error.message = 'candidate not found'
      }
      await queryRunner.rollbackTransaction();
      return await handleErrorUtils.handleError(error, res);
    } finally {
      await queryRunner.release();
    }
  }

  async checkIfVoted(
    voterDto: VoterDto,
    res: Response,
    errorMessage: string | boolean = false,
  ) {
    try {
      const check = await this.checkVoterHelper(voterDto.nationalId);

      if (!check) {
        res.status(HttpStatus.OK).json({
          status: true,
        });
      } else {
        res.status(HttpStatus.OK).json({
          status: false,
        });
      }

    } catch (error) {
      console.log('err', error);
      await handleErrorUtils.handleError(error, res);
    }
  }

  async checkVoterHelper(nationalId: string) {
    return await this.voterRepository
      .createQueryBuilder('voter')
      .select()
      .where(`voter.nationalId = ${nationalId}`)
      .getOne();
  }

  async getVoterData() {
    const data = await this.voterRepository
      .createQueryBuilder('voter')
      .select([
        `voter.voted_for_candidate_id AS "Candidate id"`,
        `voter.national_id AS "National id"`,
      ])
      .orderBy('voter.voted_for_candidate_id')
      .getRawMany();
    return data;
  }
}
