import { forwardRef, HttpCode, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Connection, getConnection, Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { Response } from 'express';
import handleErrorUtils from '../../ultilities/handleError.utils';
import { ElectionService } from '../election/election.service';
import { Vote } from '../votes/entities/vote.entity';

@Injectable()
export class CandidatesService {
  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => ElectionService))
    private  electionService: ElectionService,
    @InjectRepository(Candidate) 
    private candidateRepository: Repository<Candidate>
    
  ) {}


  async create(createCandidateDto: CreateCandidateDto, res: Response) {
    const queryRunner = await this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const manager = queryRunner.manager

    try {

      //check whether voting is already started
      const electionStatus = await this.electionService.getElectionStatus()

      //will not allow creation if voting has begun
      if (electionStatus && electionStatus.enable) {
        throw {name: 'UnprocessableError', message: 'creation is not allowed while the election is underway'}
      }

      const candidateToCreate = new Candidate()
      candidateToCreate.name = createCandidateDto.name.trim()
      candidateToCreate.dob = createCandidateDto.dob
      candidateToCreate.bioLink = createCandidateDto.bioLink
      candidateToCreate.imageLink = createCandidateDto.imageLink
      candidateToCreate.policy = createCandidateDto.policy.trim()

       manager.save(candidateToCreate)

      const vote = new Vote()
      vote.candidate = candidateToCreate

      
      const createdVote = await manager.save(vote)
      
      await queryRunner.commitTransaction()

      delete createdVote.candidate.createdAt
      delete createdVote.candidate.updatedAt
      delete createdVote.candidate.deletedAt
      delete createdVote.candidate.isActive
      delete createdVote.id

      
      return res.json({...createdVote.candidate, votedCount: createdVote.votedCount})

    } catch (error) {
      console.log('err', error)
      await queryRunner.rollbackTransaction()
      await handleErrorUtils.handleError(error, res);
      
    } finally {
      await queryRunner.release()
    }

    
  }

  async findAll(): Promise<any> {
    const candidates = await this.candidateRepository
      .createQueryBuilder('candidates')
      .select([
        'candidates.id AS id',
         'candidates.name AS name',
         'candidates.dob AS dob',
         'candidates.bioLink AS bioLink',
         'candidates.imageLink AS imageLink',
         'candidates.policy AS policy',
         'vote.votedCount AS votedCount'
      ])
      .leftJoin('vote', 'vote', 'vote.candidate_id = candidates.id')
      .getRawMany()

      return candidates
  }

  async findOne(id: string) {

     const candidate = await this.candidateRepository
       .createQueryBuilder('candidates')
       .select([
         'candidates.id AS id',
         'candidates.name AS name',
         'candidates.dob AS dob',
         'candidates.bioLink AS bioLink',
         'candidates.imageLink AS imageLink',
         'candidates.policy AS policy',
         'vote.votedCount AS votedCount'
       ])
       .where(`candidates.id = '${id}'`)
       .leftJoin('vote', 'vote', 'vote.candidate_id = candidates.id')
       .getRawOne()

     return candidate;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto, res: Response) {

      try {

        //check whether voting is already started
        const electionStatus = await this.electionService.getElectionStatus()

        //will not allow update if voting has begun
        if (electionStatus && electionStatus.enable) {
          throw {name: 'UnprocessableError', message: 'update is not allowed while the election is underway'}
        }

        const candidateToUpdate = new Candidate()
        candidateToUpdate.name = updateCandidateDto.name ? updateCandidateDto.name.trim() : undefined
        candidateToUpdate.dob = updateCandidateDto.dob
        candidateToUpdate.bioLink = updateCandidateDto.bioLink
        candidateToUpdate.imageLink = updateCandidateDto.imageLink
        candidateToUpdate.policy = updateCandidateDto.policy ? updateCandidateDto.policy.trim() : undefined

        for (const item in candidateToUpdate) {
          if (candidateToUpdate[item] === undefined) {
            delete candidateToUpdate[item]
          }
        }

        const updatedCandidate = await this.candidateRepository.update({id, deletedAt: null}, candidateToUpdate)
      
        if (updatedCandidate.affected > 0) {
          const candidate = await this.findOne(id)
          return res.status(HttpStatus.OK).json(candidate)
        }

        if (updatedCandidate.affected < 1) {
          throw {name: 'BadRequestError', message: 'Candidate not found'}
        } 

      } catch (error) {
        console.log('err', error)
        await handleErrorUtils.handleError(error, res);
      }

  }

  async remove(id: string, res: Response) {
    
    try {
      
      //check whether voting is already started
      const electionStatus = await this.electionService.getElectionStatus()

      //will not allow deletion if voting has begun
      if (electionStatus && electionStatus.enable) {
        throw {name: 'UnprocessableError', message: 'deletion is not allowed while the election is underway'}
      }
      
      const deleted = await this.candidateRepository.softDelete(id)      

      if (deleted.affected < 1) {
        throw {name: 'UnprocessableError', message: 'Candidate not found'}
      } 

      return res.status(HttpStatus.OK).json({
        status: 'ok'
      })
      
    } catch (error) {
      console.log('err', error)
      await handleErrorUtils.handleError(error, res);
    }

  }
}
